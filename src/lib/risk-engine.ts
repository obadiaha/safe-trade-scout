import { HoneypotResult, LiquidityResult, HolderResult, SafetyResult, RiskFlag } from '@/types';
import { holderConcentrationScore, creatorRiskScore, analyzeHolders } from './holders';

interface RiskInput {
  honeypot: HoneypotResult;
  liquidity: LiquidityResult;
  holders: HolderResult;
}

/**
 * Calculate overall safety score and generate flags
 */
export function calculateRisk(input: RiskInput): { safety: SafetyResult; flags: RiskFlag[] } {
  const flags: RiskFlag[] = [];
  let score = 100;

  // === HONEYPOT (Critical - 30 points max penalty) ===
  if (input.honeypot.is_honeypot) {
    flags.push('HONEYPOT');
    score -= 100; // Instant fail
  }

  // === SELL TAX (20 points max penalty) ===
  const sellTax = input.honeypot.sell_tax;
  if (sellTax > 50) {
    flags.push('EXTREME_TAX');
    score -= 30;
  } else if (sellTax > 25) {
    flags.push('HIGH_SELL_TAX');
    score -= 20;
  } else if (sellTax > 10) {
    flags.push('HIGH_SELL_TAX');
    score -= 10;
  }

  // === BUY TAX ===
  const buyTax = input.honeypot.buy_tax;
  if (buyTax > 10) {
    flags.push('HIGH_BUY_TAX');
    score -= 5;
  }

  // === LIQUIDITY (20 points max penalty) ===
  const liq = input.liquidity.usd;
  if (liq === 0) {
    flags.push('NO_LIQUIDITY');
    score -= 25;
  } else if (liq < 10000) {
    flags.push('LOW_LIQUIDITY');
    score -= 15;
  } else if (liq < 50000) {
    flags.push('LOW_LIQUIDITY');
    score -= 8;
  }

  // === HOLDER CONCENTRATION (15 points max penalty) ===
  const holderFlags = analyzeHolders(input.holders);
  flags.push(...holderFlags);
  
  const holderScore = holderConcentrationScore(input.holders);
  score -= Math.round((100 - holderScore) * 0.15);

  // Creator risk
  const creatorScore = creatorRiskScore(input.holders.creator_percent);
  score -= Math.round((100 - creatorScore) * 0.05);

  // === CONTRACT PERMISSIONS (15 points max penalty) ===
  if (input.honeypot.can_mint) {
    flags.push('MINTABLE');
    score -= 8;
  }
  if (input.honeypot.transfer_pausable) {
    flags.push('PAUSABLE');
    score -= 5;
  }
  if (input.honeypot.can_blacklist) {
    flags.push('BLACKLIST_ENABLED');
    score -= 5;
  }
  if (input.honeypot.owner_can_change_balance) {
    flags.push('OWNER_CAN_MODIFY');
    score -= 10;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    safety: {
      score,
      grade: scoreToGrade(score),
      recommendation: scoreToRecommendation(score),
    },
    flags: [...new Set(flags)], // Dedupe
  };
}

function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

function scoreToRecommendation(score: number): 'SAFE' | 'CAUTION' | 'RISKY' | 'AVOID' {
  if (score >= 80) return 'SAFE';
  if (score >= 50) return 'CAUTION';
  if (score >= 25) return 'RISKY';
  return 'AVOID';
}
