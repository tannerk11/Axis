import { useState, useMemo } from 'react';
import PlayerScatterChart from './PlayerScatterChart';
import './PlayerVisualizations.css';

// Tab configuration
const TABS = [
  { id: 'scoring', label: 'Scoring' },
  { id: 'playmaking', label: 'Playmaking' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'rebounding', label: 'Rebounding' },
];

const MIN_GAMES = 5;
const MIN_MINUTES = 10;

function PlayerVisualizations({ players, loading }) {
  const [activeTab, setActiveTab] = useState('scoring');

  // Use all players passed in (filtering is done by parent via filter bar)
  const baseFilteredPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];
    
    // Filter by minimum games and minutes
    let filtered = players.filter(p => 
      p.gp >= MIN_GAMES && 
      p.min_pg >= MIN_MINUTES
    );
    
    // Sort by PPG (best scorers first)
    return filtered.sort((a, b) => (b.pts_pg || 0) - (a.pts_pg || 0));
  }, [players]);

  // Scoring players (PPG vs FG%)
  const scoringPlayers = useMemo(() => {
    return baseFilteredPlayers.filter(p => 
      p.pts_pg != null && p.fg_pct != null && p.fga >= 50
    );
  }, [baseFilteredPlayers]);

  // Playmaking players (AST vs TO ratio)
  const playmakingPlayers = useMemo(() => {
    return baseFilteredPlayers.filter(p => 
      p.ast_pg != null && p.to_pg != null && p.ast >= 20
    );
  }, [baseFilteredPlayers]);

  // Shooting players (3PM vs 3P%)
  const shootingPlayers = useMemo(() => {
    return baseFilteredPlayers.filter(p => 
      p.fg3m != null && p.fg3_pct != null && p.fg3a >= 30
    );
  }, [baseFilteredPlayers]);

  // Rebounding players
  const reboundingPlayers = useMemo(() => {
    return baseFilteredPlayers.filter(p => 
      p.oreb_pg != null && p.dreb_pg != null && p.reb >= 30
    );
  }, [baseFilteredPlayers]);

  // Format functions - percentages are stored as whole numbers (45.6 = 45.6%)
  const pctFormat = (v) => `${parseFloat(v).toFixed(1)}%`;
  const decimalFormat = (v) => parseFloat(v).toFixed(1);
  const intFormat = (v) => Math.round(parseFloat(v)).toString();

  if (loading) {
    return <div className="loading">Loading visualizations...</div>;
  }

  if (!players || players.length === 0) {
    return (
      <div className="player-visualizations-placeholder">
        <div className="coming-soon">
          <p>No player data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-visualizations">
      {/* Controls */}
      <div className="player-viz-controls">
        <div className="player-viz-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`player-viz-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Scoring Tab */}
      {activeTab === 'scoring' && (
        <div className="player-viz-content">
          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Scoring Efficiency</h2>
              <p className="insight-description">
                Points per game vs Field Goal % — {scoringPlayers.length} players (min 50 FGA)
              </p>
            </div>
            <PlayerScatterChart
              players={scoringPlayers}
              xKey="pts_pg"
              yKey="fg_pct"
              xLabel="Points Per Game"
              yLabel="Field Goal %"
              xFormat={decimalFormat}
              yFormat={pctFormat}
            />
          </section>

          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Volume vs Efficiency</h2>
              <p className="insight-description">
                Field Goal Attempts per game vs FG% — {scoringPlayers.length} players
              </p>
            </div>
            <PlayerScatterChart
              players={scoringPlayers.map(p => ({ ...p, fga_pg: p.fga / p.gp }))}
              xKey="fga_pg"
              yKey="fg_pct"
              xLabel="FGA Per Game"
              yLabel="Field Goal %"
              xFormat={decimalFormat}
              yFormat={pctFormat}
            />
          </section>
        </div>
      )}

      {/* Playmaking Tab */}
      {activeTab === 'playmaking' && (
        <div className="player-viz-content">
          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Assist Leaders</h2>
              <p className="insight-description">
                Assists per game vs Turnovers per game — {playmakingPlayers.length} players (min 20 AST)
              </p>
            </div>
            <PlayerScatterChart
              players={playmakingPlayers}
              xKey="ast_pg"
              yKey="to_pg"
              xLabel="Assists Per Game"
              yLabel="Turnovers Per Game"
              xFormat={decimalFormat}
              yFormat={decimalFormat}
            />
          </section>

          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Scoring Playmakers</h2>
              <p className="insight-description">
                Points per game vs Assists per game — {playmakingPlayers.length} players
              </p>
            </div>
            <PlayerScatterChart
              players={playmakingPlayers}
              xKey="pts_pg"
              yKey="ast_pg"
              xLabel="Points Per Game"
              yLabel="Assists Per Game"
              xFormat={decimalFormat}
              yFormat={decimalFormat}
            />
          </section>
        </div>
      )}

      {/* Shooting Tab */}
      {activeTab === 'shooting' && (
        <div className="player-viz-content">
          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">3-Point Shooting</h2>
              <p className="insight-description">
                3-Pointers Made vs 3-Point % — {shootingPlayers.length} players (min 30 3PA)
              </p>
            </div>
            <PlayerScatterChart
              players={shootingPlayers}
              xKey="fg3m"
              yKey="fg3_pct"
              xLabel="3-Pointers Made (Season)"
              yLabel="3-Point %"
              xFormat={intFormat}
              yFormat={pctFormat}
            />
          </section>

          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Free Throw Shooting</h2>
              <p className="insight-description">
                Free Throws Made vs FT% — {scoringPlayers.filter(p => p.fta >= 30).length} players (min 30 FTA)
              </p>
            </div>
            <PlayerScatterChart
              players={scoringPlayers.filter(p => p.fta >= 30)}
              xKey="ftm"
              yKey="ft_pct"
              xLabel="Free Throws Made (Season)"
              yLabel="Free Throw %"
              xFormat={intFormat}
              yFormat={pctFormat}
            />
          </section>
        </div>
      )}

      {/* Rebounding Tab */}
      {activeTab === 'rebounding' && (
        <div className="player-viz-content">
          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Rebounding Profile</h2>
              <p className="insight-description">
                Offensive vs Defensive Rebounds per game — {reboundingPlayers.length} players (min 30 REB)
              </p>
            </div>
            <PlayerScatterChart
              players={reboundingPlayers}
              xKey="dreb_pg"
              yKey="oreb_pg"
              xLabel="Defensive Rebounds Per Game"
              yLabel="Offensive Rebounds Per Game"
              xFormat={decimalFormat}
              yFormat={decimalFormat}
            />
          </section>

          <section className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-title">Rebounding vs Scoring</h2>
              <p className="insight-description">
                Total Rebounds per game vs Points per game — {reboundingPlayers.length} players
              </p>
            </div>
            <PlayerScatterChart
              players={reboundingPlayers}
              xKey="reb_pg"
              yKey="pts_pg"
              xLabel="Rebounds Per Game"
              yLabel="Points Per Game"
              xFormat={decimalFormat}
              yFormat={decimalFormat}
            />
          </section>
        </div>
      )}
    </div>
  );
}

export default PlayerVisualizations;
