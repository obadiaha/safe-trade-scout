export default function DocsPage() {
  return (
    <main className="container">
      <h1>Token Safety Check</h1>
      <p>Pre-trade safety analysis combining GoPlus security data, DEXScreener liquidity, and holder concentration metrics.</p>

      <h2>Endpoint</h2>
      <div className="endpoint">
        <span className="method">POST</span>
        <span className="path">/api/check</span>
      </div>

      <h3>Request</h3>
      <pre><code>{`{
  "token": "0x...",
  "chain": "ethereum"
}`}</code></pre>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>token</code></td>
              <td>Contract address</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><code>chain</code></td>
              <td>ethereum | bsc | polygon | arbitrum | base | solana</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Response</h3>
      <pre><code>{`{
  "token": "0x...",
  "chain": "ethereum",
  "name": "Token Name",
  "symbol": "TKN",
  "safety": {
    "score": 72,
    "grade": "B",
    "recommendation": "CAUTION"
  },
  "honeypot": {
    "is_honeypot": false,
    "buy_tax": 0,
    "sell_tax": 5,
    "transfer_pausable": false,
    "can_blacklist": false,
    "can_mint": false,
    "owner_can_change_balance": false
  },
  "liquidity": {
    "usd": 150000,
    "locked": false,
    "lock_percent": 0,
    "pairs_count": 2
  },
  "holders": {
    "count": 1234,
    "top10_percent": 45,
    "whale_alert": false,
    "creator_percent": 5
  },
  "flags": ["HIGH_SELL_TAX"],
  "checked_at": "2024-01-15T10:30:00Z"
}`}</code></pre>

      <h2>Risk Grades</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Score</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="grade-a">A</span></td>
              <td>80-100</td>
              <td>Low risk</td>
            </tr>
            <tr>
              <td><span className="grade-b">B</span></td>
              <td>60-79</td>
              <td>Moderate risk</td>
            </tr>
            <tr>
              <td><span className="grade-c">C</span></td>
              <td>40-59</td>
              <td>High risk</td>
            </tr>
            <tr>
              <td><span className="grade-d">D</span></td>
              <td>20-39</td>
              <td>Very high risk</td>
            </tr>
            <tr>
              <td><span className="grade-f">F</span></td>
              <td>0-19</td>
              <td>Extreme risk</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Risk Flags</h2>
      <div>
        <span className="flag">HONEYPOT</span>
        <span className="flag">HIGH_BUY_TAX</span>
        <span className="flag">HIGH_SELL_TAX</span>
        <span className="flag">EXTREME_TAX</span>
        <span className="flag">NO_LIQUIDITY</span>
        <span className="flag">LOW_LIQUIDITY</span>
        <span className="flag">HIGH_HOLDER_CONCENTRATION</span>
        <span className="flag">WHALE_DOMINATED</span>
        <span className="flag">MINTABLE</span>
        <span className="flag">PAUSABLE</span>
        <span className="flag">BLACKLIST_ENABLED</span>
        <span className="flag">OWNER_CAN_MODIFY</span>
      </div>

      <h2>Errors</h2>
      <pre><code>{`{
  "error": "Token address is required",
  "code": "MISSING_TOKEN"
}`}</code></pre>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>HTTP</th>
              <th>Cause</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>MISSING_TOKEN</code></td>
              <td>400</td>
              <td>No token address provided</td>
            </tr>
            <tr>
              <td><code>MISSING_CHAIN</code></td>
              <td>400</td>
              <td>No chain specified</td>
            </tr>
            <tr>
              <td><code>INVALID_CHAIN</code></td>
              <td>400</td>
              <td>Unsupported chain</td>
            </tr>
            <tr>
              <td><code>INVALID_ADDRESS</code></td>
              <td>400</td>
              <td>Malformed address</td>
            </tr>
            <tr>
              <td><code>INVALID_JSON</code></td>
              <td>400</td>
              <td>Request body parse error</td>
            </tr>
            <tr>
              <td><code>INTERNAL_ERROR</code></td>
              <td>500</td>
              <td>Upstream API or server issue</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Example</h2>
      <pre><code>{`curl -X POST https://your-domain.com/api/check \\
  -H "Content-Type: application/json" \\
  -d '{"token":"0x6B175474E89094C44Da98b954EescdCade5eDD7e6f8","chain":"ethereum"}'`}</code></pre>
    </main>
  );
}
