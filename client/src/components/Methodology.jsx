import './Methodology.css';

function Methodology() {
  return (
    <main className="methodology-page">
      <div className="page-header">
        <h1>About &amp; Methodology</h1>
        <p className="page-subtitle">How metrics are calculated, where data comes from, and what the numbers mean</p>
      </div>

      <div className="methodology-content">
        {/* Data Source */}
        <section className="method-section">
          <h2>Data Source</h2>
          <p>
            All game results, box scores, team rosters, and player statistics are collected from{' '}
            <strong>Presto Sports</strong>, the official NAIA statistics provider. Data is refreshed
            automatically every 4 hours. Game results typically appear within 4-8 hours of a game ending.
          </p>
          <p>
            All advanced metrics (efficiency ratings, RPI, quadrant records, tournament projections) are
            calculated by Axis Analytics and are not available from the NAIA or Presto Sports directly.
          </p>
        </section>

        {/* Core Ratings */}
        <section className="method-section">
          <h2>Core Efficiency Ratings</h2>

          <div className="method-card">
            <h3>Adjusted Net Rating (Adj NET)</h3>
            <p>
              The single best measure of team quality. Represents the point differential per 100 possessions,
              adjusted for the strength of opponents faced. A team with Adj NET of +15 is roughly 15 points
              per 100 possessions better than average.
            </p>
            <div className="formula">Adj NET = Adj Offensive Rating - Adj Defensive Rating</div>
          </div>

          <div className="method-card">
            <h3>Offensive Rating (ORTG)</h3>
            <p>
              Points scored per 100 possessions. Using possessions instead of games removes the effect of pace:
              a slow team scoring 60 points could be just as efficient as a fast team scoring 80. Higher is better.
            </p>
          </div>

          <div className="method-card">
            <h3>Defensive Rating (DRTG)</h3>
            <p>
              Points allowed per 100 possessions. Lower is better.
            </p>
          </div>

          <div className="method-card">
            <h3>Possessions Estimate</h3>
            <p>Possessions are estimated using the standard formula:</p>
            <div className="formula">Possessions = FGA - OREB + TO + (0.44 &times; FTA)</div>
          </div>
        </section>

        {/* Selection Criteria */}
        <section className="method-section">
          <h2>Selection Criteria (Bracketcast)</h2>

          <div className="method-card">
            <h3>RPI (Rating Percentage Index)</h3>
            <p>
              The NAIA's primary ranking formula. Only NAIA games count toward the calculation.
            </p>
            <div className="formula">RPI = 0.30 &times; WP + 0.50 &times; OWP + 0.20 &times; OOWP</div>
            <ul>
              <li><strong>WP</strong> &mdash; Team's own NAIA win percentage</li>
              <li><strong>OWP</strong> &mdash; Average win percentage of NAIA opponents</li>
              <li><strong>OOWP</strong> &mdash; Average win percentage of opponents' opponents</li>
            </ul>
          </div>

          <div className="method-card">
            <h3>Quadrant Records (Q1/Q2/Q3/Q4)</h3>
            <p>
              Games are divided into quality tiers based on the opponent's RPI rank and game location.
              Q1 wins are the most valuable; Q4 losses are the most damaging.
            </p>
            <table className="method-table">
              <thead>
                <tr>
                  <th>Quadrant</th>
                  <th>Home</th>
                  <th>Neutral</th>
                  <th>Away</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Q1 (Best)</td><td>RPI 1-45</td><td>1-55</td><td>1-65</td></tr>
                <tr><td>Q2 (Good)</td><td>46-90</td><td>56-105</td><td>66-120</td></tr>
                <tr><td>Q3 (Average)</td><td>91-135</td><td>106-150</td><td>121-165</td></tr>
                <tr><td>Q4 (Weak)</td><td>136+</td><td>150+</td><td>166+</td></tr>
              </tbody>
            </table>
          </div>

          <div className="method-card">
            <h3>Quad Win Points (QWP)</h3>
            <p>A weighted point system for quadrant wins:</p>
            <div className="formula">Q1 Win = 4 pts, Q2 Win = 2 pts, Q3 Win = 1 pt, Q4 Win = 0.5 pts</div>
          </div>

          <div className="method-card">
            <h3>Primary Criteria Ranking (PCR)</h3>
            <p>
              A composite rank combining Overall Win %, RPI, and Quadrant Win Points.
              Used for tournament seeding simulation.
            </p>
          </div>

          <div className="method-card">
            <h3>Projected Rank (PR)</h3>
            <p>
              The PCR with conference tournament champions guaranteed a spot in the top 64 as automatic qualifiers.
            </p>
          </div>
        </section>

        {/* Four Factors */}
        <section className="method-section">
          <h2>Four Factors of Basketball</h2>
          <p>
            Dean Oliver's "Four Factors" framework identifies the key statistical areas that determine
            winning. Each is tracked for both offense and defense.
          </p>

          <div className="method-card">
            <h3>Effective Field Goal % (eFG%)</h3>
            <p>Adjusts FG% to account for 3-pointers being worth more than 2-pointers.</p>
            <div className="formula">eFG% = (FGM + 0.5 &times; 3PM) / FGA</div>
          </div>

          <div className="method-card">
            <h3>Turnover %</h3>
            <p>Turnovers committed per 100 possessions. Lower is better for your own team.</p>
          </div>

          <div className="method-card">
            <h3>Offensive Rebound % (OREB%)</h3>
            <p>Percentage of available offensive rebounds grabbed. Second-chance opportunities are valuable.</p>
          </div>

          <div className="method-card">
            <h3>Free Throw Rate</h3>
            <p>Free throw attempts per field goal attempt. Measures the ability to get to the free throw line.</p>
            <div className="formula">FT Rate = FTA / FGA</div>
          </div>
        </section>

        {/* Strength of Schedule */}
        <section className="method-section">
          <h2>Strength of Schedule</h2>

          <div className="method-card">
            <h3>SOS</h3>
            <p>Average quality of opponents faced. Higher means a tougher schedule.</p>
          </div>

          <div className="method-card">
            <h3>OSOS / DSOS / NSOS</h3>
            <ul>
              <li><strong>OSOS</strong> &mdash; Offensive SOS: average opponent offensive rating</li>
              <li><strong>DSOS</strong> &mdash; Defensive SOS: average opponent defensive rating</li>
              <li><strong>NSOS</strong> &mdash; Net SOS: average opponent net rating</li>
            </ul>
          </div>
        </section>

        {/* Experimental */}
        <section className="method-section">
          <h2>Experimental Metrics</h2>

          <div className="method-card">
            <h3>Quality Win Index (QWI)</h3>
            <p>Weighted sum of quadrant results. Heavily rewards Q1 wins and penalizes Q4 losses.</p>
            <div className="formula">
              QWI = Q1W&times;1.0 - Q1L&times;0.25 + Q2W&times;0.6 - Q2L&times;0.5 + Q3W&times;0.3 - Q3L&times;0.75 + Q4W&times;0.1 - Q4L&times;1.0
            </div>
          </div>

          <div className="method-card">
            <h3>Power Index</h3>
            <p>Composite metric combining multiple evaluation dimensions:</p>
            <div className="formula">
              35% AdjORTG + 35% Inverted AdjDRTG + 15% SOS + 7.5% Win% + 7.5% QWI
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="method-section">
          <h2>Known Limitations</h2>
          <ul className="method-limitations">
            <li>Data quality depends on schools accurately reporting results to Presto Sports</li>
            <li>Games against non-NAIA opponents (NCAA D1/D2/D3, JUCO) are tracked but excluded from NAIA-specific calculations</li>
            <li>The RPI formula and quadrant thresholds are based on publicly available NAIA selection criteria and may not exactly match the official committee's methodology</li>
            <li>Adjusted ratings use a simplified opponent-strength adjustment and may differ from other published adjusted metrics</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Methodology;
