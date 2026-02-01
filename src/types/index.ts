export type ChainId = 'ethereum' | 'bsc' | 'polygon' | 'arbitrum' | 'base' | 'solana';

export interface CheckRequest {
  token: string;
  chain: ChainId;
}

export interface SafetyResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendation: 'SAFE' | 'CAUTION' | 'RISKY' | 'AVOID';
}

export interface HoneypotResult {
  is_honeypot: boolean;
  buy_tax: number;
  sell_tax: number;
  transfer_pausable: boolean;
  can_blacklist: boolean;
  can_mint: boolean;
  owner_can_change_balance: boolean;
}

export interface LiquidityResult {
  usd: number;
  locked: boolean;
  lock_percent: number;
  pairs_count: number;
}

export interface HolderResult {
  count: number;
  top10_percent: number;
  whale_alert: boolean;
  creator_percent: number;
}

export type RiskFlag = 
  | 'HONEYPOT'
  | 'HIGH_BUY_TAX'
  | 'HIGH_SELL_TAX'
  | 'EXTREME_TAX'
  | 'LOW_LIQUIDITY'
  | 'NO_LIQUIDITY'
  | 'UNLOCKED_LIQUIDITY'
  | 'HIGH_HOLDER_CONCENTRATION'
  | 'WHALE_DOMINATED'
  | 'MINTABLE'
  | 'PAUSABLE'
  | 'BLACKLIST_ENABLED'
  | 'OWNER_CAN_MODIFY';

export interface CheckResponse {
  token: string;
  chain: ChainId;
  name: string | null;
  symbol: string | null;
  safety: SafetyResult;
  honeypot: HoneypotResult;
  liquidity: LiquidityResult;
  holders: HolderResult;
  flags: RiskFlag[];
  checked_at: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

// GoPlus API response types
export interface GoPlusTokenSecurity {
  is_honeypot?: string;
  buy_tax?: string;
  sell_tax?: string;
  is_mintable?: string;
  can_take_back_ownership?: string;
  owner_change_balance?: string;
  transfer_pausable?: string;
  is_blacklisted?: string;
  token_name?: string;
  token_symbol?: string;
  holder_count?: string;
  lp_holder_count?: string;
  lp_total_supply?: string;
  is_open_source?: string;
  is_proxy?: string;
  creator_percent?: string;
  holders?: Array<{
    address: string;
    percent: string;
    is_contract: number;
  }>;
}

// DEXScreener API response types
export interface DexScreenerPair {
  chainId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  liquidity?: {
    usd: number;
  };
  fdv?: number;
}

export interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}
