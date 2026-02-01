import { ChainId, DexScreenerResponse, LiquidityResult } from '@/types';
import { getChainConfig } from './chains';

const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex';

export async function fetchDexScreenerData(
  token: string,
  chain: ChainId
): Promise<DexScreenerResponse | null> {
  const config = getChainConfig(chain);
  const url = `${DEXSCREENER_BASE}/tokens/${token}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`DEXScreener API error: ${res.status}`);
      return null;
    }

    const data: DexScreenerResponse = await res.json();
    
    // Filter pairs by chain
    if (data.pairs) {
      data.pairs = data.pairs.filter(p => p.chainId === config.dexscreenerId);
    }
    
    return data;
  } catch (err) {
    console.error('DEXScreener fetch failed:', err);
    return null;
  }
}

export function parseLiquidityData(data: DexScreenerResponse | null): LiquidityResult {
  if (!data?.pairs || data.pairs.length === 0) {
    return {
      usd: 0,
      locked: false,
      lock_percent: 0,
      pairs_count: 0,
    };
  }

  // Sum liquidity across all pairs
  const totalLiquidity = data.pairs.reduce((sum, pair) => {
    return sum + (pair.liquidity?.usd || 0);
  }, 0);

  return {
    usd: Math.round(totalLiquidity),
    locked: false, // DEXScreener doesn't provide lock info, GoPlus/other sources needed
    lock_percent: 0,
    pairs_count: data.pairs.length,
  };
}

export function getTokenInfoFromDex(data: DexScreenerResponse | null): { name: string | null; symbol: string | null } {
  if (!data?.pairs || data.pairs.length === 0) {
    return { name: null, symbol: null };
  }

  const firstPair = data.pairs[0];
  return {
    name: firstPair.baseToken.name || null,
    symbol: firstPair.baseToken.symbol || null,
  };
}
