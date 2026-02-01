import { ChainId } from '@/types';

interface ChainConfig {
  name: string;
  goplusId: string;
  dexscreenerId: string;
  explorer: string;
  addressPattern: RegExp;
}

export const CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    goplusId: '1',
    dexscreenerId: 'ethereum',
    explorer: 'https://etherscan.io',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  bsc: {
    name: 'BNB Chain',
    goplusId: '56',
    dexscreenerId: 'bsc',
    explorer: 'https://bscscan.com',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  polygon: {
    name: 'Polygon',
    goplusId: '137',
    dexscreenerId: 'polygon',
    explorer: 'https://polygonscan.com',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  arbitrum: {
    name: 'Arbitrum',
    goplusId: '42161',
    dexscreenerId: 'arbitrum',
    explorer: 'https://arbiscan.io',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  base: {
    name: 'Base',
    goplusId: '8453',
    dexscreenerId: 'base',
    explorer: 'https://basescan.org',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  solana: {
    name: 'Solana',
    goplusId: 'solana',
    dexscreenerId: 'solana',
    explorer: 'https://solscan.io',
    addressPattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
};

export function getChainConfig(chain: ChainId): ChainConfig {
  return CHAINS[chain];
}

export function isValidChain(chain: string): chain is ChainId {
  return chain in CHAINS;
}

export function isValidAddress(address: string, chain: ChainId): boolean {
  return CHAINS[chain].addressPattern.test(address);
}
