import { HolderResult, RiskFlag } from '@/types';

/**
 * Analyze holder distribution for red flags
 */
export function analyzeHolders(holders: HolderResult): RiskFlag[] {
  const flags: RiskFlag[] = [];

  // Top 10 holders own too much
  if (holders.top10_percent > 90) {
    flags.push('WHALE_DOMINATED');
  } else if (holders.top10_percent > 70) {
    flags.push('HIGH_HOLDER_CONCENTRATION');
  }

  return flags;
}

/**
 * Calculate holder concentration score (0-100)
 * Lower concentration = higher score (better)
 */
export function holderConcentrationScore(holders: HolderResult): number {
  if (holders.count === 0) {
    return 0;
  }

  // Ideal: top10 owns < 30%
  // Bad: top10 owns > 90%
  const top10 = holders.top10_percent;
  
  if (top10 <= 30) return 100;
  if (top10 >= 95) return 0;
  
  // Linear scale between 30-95%
  return Math.round(100 - ((top10 - 30) / 65) * 100);
}

/**
 * Calculate creator risk
 * High creator holding is risky for new tokens
 */
export function creatorRiskScore(creatorPercent: number): number {
  if (creatorPercent === 0) return 100;
  if (creatorPercent > 50) return 0;
  if (creatorPercent > 30) return 25;
  if (creatorPercent > 15) return 50;
  if (creatorPercent > 5) return 75;
  return 90;
}
