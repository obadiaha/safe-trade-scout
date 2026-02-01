import { ChainId, GoPlusTokenSecurity, HoneypotResult, HolderResult } from '@/types';
import { getChainConfig } from './chains';

const GOPLUS_BASE = 'https://api.gopluslabs.io/api/v1';

interface GoPlusResponse {
  code: number;
  message: string;
  result: Record<string, GoPlusTokenSecurity>;
}

export async function fetchGoPlusSecurity(
  token: string,
  chain: ChainId
): Promise<GoPlusTokenSecurity | null> {
  const config = getChainConfig(chain);
  const url = `${GOPLUS_BASE}/token_security/${config.goplusId}?contract_addresses=${token.toLowerCase()}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`GoPlus API error: ${res.status}`);
      return null;
    }

    const data: GoPlusResponse = await res.json();
    
    if (data.code !== 1 || !data.result) {
      return null;
    }

    const tokenData = data.result[token.toLowerCase()];
    return tokenData || null;
  } catch (err) {
    console.error('GoPlus fetch failed:', err);
    return null;
  }
}

export function parseHoneypotData(data: GoPlusTokenSecurity | null): HoneypotResult {
  if (!data) {
    return {
      is_honeypot: false,
      buy_tax: 0,
      sell_tax: 0,
      transfer_pausable: false,
      can_blacklist: false,
      can_mint: false,
      owner_can_change_balance: false,
    };
  }

  return {
    is_honeypot: data.is_honeypot === '1',
    buy_tax: parseFloat(data.buy_tax || '0') * 100,
    sell_tax: parseFloat(data.sell_tax || '0') * 100,
    transfer_pausable: data.transfer_pausable === '1',
    can_blacklist: data.is_blacklisted === '1',
    can_mint: data.is_mintable === '1',
    owner_can_change_balance: data.owner_change_balance === '1',
  };
}

export function parseHolderData(data: GoPlusTokenSecurity | null): HolderResult {
  if (!data) {
    return {
      count: 0,
      top10_percent: 0,
      whale_alert: false,
      creator_percent: 0,
    };
  }

  const holderCount = parseInt(data.holder_count || '0', 10);
  const creatorPercent = parseFloat(data.creator_percent || '0') * 100;

  let top10Percent = 0;
  if (data.holders && Array.isArray(data.holders)) {
    const topHolders = data.holders.slice(0, 10);
    top10Percent = topHolders.reduce((sum, h) => sum + parseFloat(h.percent || '0'), 0) * 100;
  }

  return {
    count: holderCount,
    top10_percent: Math.round(top10Percent * 10) / 10,
    whale_alert: top10Percent > 80,
    creator_percent: Math.round(creatorPercent * 10) / 10,
  };
}

export function parseTokenInfo(data: GoPlusTokenSecurity | null): { name: string | null; symbol: string | null } {
  return {
    name: data?.token_name || null,
    symbol: data?.token_symbol || null,
  };
}
