import { NextRequest, NextResponse } from 'next/server';
import { CheckRequest, CheckResponse, ApiError, ChainId } from '@/types';
import { isValidChain, isValidAddress } from '@/lib/chains';
import { fetchGoPlusSecurity, parseHoneypotData, parseHolderData, parseTokenInfo } from '@/lib/goplus';
import { fetchDexScreenerData, parseLiquidityData, getTokenInfoFromDex } from '@/lib/dexscreener';
import { calculateRisk } from '@/lib/risk-engine';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<CheckRequest>;

    // Validate input
    const validationError = validateRequest(body);
    if (validationError) {
      return errorResponse(validationError.error, validationError.code, 400);
    }

    const { token, chain } = body as CheckRequest;

    // Fetch data from all sources in parallel
    const [goplusData, dexData] = await Promise.all([
      fetchGoPlusSecurity(token, chain),
      fetchDexScreenerData(token, chain),
    ]);

    // Parse results
    const honeypot = parseHoneypotData(goplusData);
    const liquidity = parseLiquidityData(dexData);
    const holders = parseHolderData(goplusData);

    // Get token info from either source
    const goplusInfo = parseTokenInfo(goplusData);
    const dexInfo = getTokenInfoFromDex(dexData);
    const name = goplusInfo.name || dexInfo.name;
    const symbol = goplusInfo.symbol || dexInfo.symbol;

    // Calculate risk
    const { safety, flags } = calculateRisk({ honeypot, liquidity, holders });

    const response: CheckResponse = {
      token,
      chain,
      name,
      symbol,
      safety,
      honeypot,
      liquidity,
      holders,
      flags,
      checked_at: new Date().toISOString(),
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error('Check endpoint error:', err);
    
    if (err instanceof SyntaxError) {
      return errorResponse('Request body is not valid JSON', 'INVALID_JSON', 400);
    }
    
    return errorResponse(
      'Failed to process token check',
      'INTERNAL_ERROR',
      500,
      err instanceof Error ? err.message : undefined
    );
  }
}

function validateRequest(body: Partial<CheckRequest>): ApiError | null {
  if (!body.token) {
    return { error: 'Token address is required', code: 'MISSING_TOKEN' };
  }

  if (!body.chain) {
    return { error: 'Chain is required', code: 'MISSING_CHAIN' };
  }

  if (!isValidChain(body.chain)) {
    return { 
      error: `Invalid chain: ${body.chain}. Supported: ethereum, bsc, polygon, arbitrum, base, solana`,
      code: 'INVALID_CHAIN'
    };
  }

  if (!isValidAddress(body.token, body.chain as ChainId)) {
    return { 
      error: `Invalid token address format for ${body.chain}`,
      code: 'INVALID_ADDRESS'
    };
  }

  return null;
}

function errorResponse(
  error: string,
  code: string,
  status: number,
  details?: string
): NextResponse {
  const body: ApiError = { error, code };
  if (details) body.details = details;
  
  return NextResponse.json(body, { status });
}

// Also support GET for testing
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/check',
    description: 'Check token safety before trading',
    body: {
      token: 'string (required) - Token contract address',
      chain: 'string (required) - ethereum | bsc | polygon | arbitrum | base | solana',
    },
    example: {
      token: '0x6B175474E89094C44Da98b954EescdCade5ede7e6f8',
      chain: 'ethereum',
    },
  });
}
