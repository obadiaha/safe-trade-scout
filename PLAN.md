# Safe Trade Scout - Build Plan

## Purpose
Pre-trade safety API that aggregates token security data from GoPlus + DEXScreener + on-chain holder analysis into a single response with actionable risk assessment.

## Architecture

```
POST /api/check
     │
     ├── GoPlus Security API → honeypot, taxes, permissions
     ├── DEXScreener API → liquidity, pair data
     └── Holder Analysis → concentration, whale detection
     │
     └── Risk Engine → weighted score + recommendation
```

## File Structure

```
safe-trade-scout/
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # API docs page
│   │   └── api/
│   │       └── check/
│   │           └── route.ts         # Main endpoint
│   ├── lib/
│   │   ├── goplus.ts               # GoPlus client
│   │   ├── dexscreener.ts          # DEXScreener client
│   │   ├── holders.ts              # Holder analysis
│   │   ├── risk-engine.ts          # Score calculation
│   │   └── chains.ts               # Chain config
│   └── types/
│       └── index.ts                # TypeScript types
└── PLAN.md
```

## Dependencies

```json
{
  "next": "^14",
  "react": "^18",
  "typescript": "^5"
}
```

No external packages needed beyond Next.js - all APIs are REST calls via fetch.

## Build Order

1. Types & chain config
2. External API clients (GoPlus, DEXScreener)
3. Holder analysis module
4. Risk scoring engine
5. API route
6. Docs page
7. Config files

## API Response Shape

```json
{
  "token": "0x...",
  "chain": "ethereum",
  "safety": {
    "score": 72,
    "grade": "B",
    "recommendation": "CAUTION"
  },
  "honeypot": {
    "is_honeypot": false,
    "buy_tax": 0,
    "sell_tax": 5
  },
  "liquidity": {
    "usd": 150000,
    "locked": true,
    "lock_percent": 80
  },
  "holders": {
    "count": 1234,
    "top10_percent": 45,
    "whale_alert": false
  },
  "flags": ["HIGH_SELL_TAX", "LOW_LIQUIDITY"],
  "checked_at": "2024-01-15T10:30:00Z"
}
```

## Risk Scoring

| Factor | Weight | Red Flags |
|--------|--------|-----------|
| Honeypot detection | 30% | is_honeypot = true |
| Sell tax | 20% | > 10% = warning, > 25% = critical |
| Liquidity | 20% | < $10k = critical, < $50k = warning |
| Holder concentration | 15% | top10 > 80% = critical |
| Contract permissions | 15% | mint/pause/blacklist enabled |

## Grades

- A (80-100): Low risk, proceed
- B (60-79): Moderate risk, caution advised
- C (40-59): High risk, not recommended
- D (20-39): Very high risk, avoid
- F (0-19): Extreme risk, likely scam

## Recommendations

- `SAFE`: Score >= 80
- `CAUTION`: Score 50-79
- `RISKY`: Score 25-49
- `AVOID`: Score < 25
