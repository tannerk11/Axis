-- Create players table for storing individual player stats
-- Each row represents a player's stats for a specific season

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  player_id VARCHAR(50) NOT NULL,           -- Presto ID e.g. "m57p06x6e1a53ux9"
  team_id VARCHAR(50) NOT NULL,             -- Links to teams table
  season VARCHAR(10) NOT NULL,              -- e.g. "2024-25"
  league VARCHAR(20) NOT NULL,              -- "mens" or "womens"
  
  -- Player info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  position VARCHAR(20),
  year VARCHAR(20),                         -- Fr, So, Jr, Sr, etc.
  uniform VARCHAR(10),
  height VARCHAR(10),
  
  -- Overall stats
  gp INTEGER DEFAULT 0,                     -- Games played
  gs INTEGER DEFAULT 0,                     -- Games started
  min DECIMAL(10,1) DEFAULT 0,              -- Total minutes
  min_pg DECIMAL(5,1) DEFAULT 0,            -- Minutes per game
  
  -- Scoring
  pts INTEGER DEFAULT 0,                    -- Total points
  pts_pg DECIMAL(5,1) DEFAULT 0,            -- Points per game
  
  -- Rebounds
  oreb INTEGER DEFAULT 0,
  dreb INTEGER DEFAULT 0,
  reb INTEGER DEFAULT 0,                    -- Total rebounds
  reb_pg DECIMAL(5,1) DEFAULT 0,
  
  -- Assists & Turnovers
  ast INTEGER DEFAULT 0,
  ast_pg DECIMAL(5,1) DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  to_pg DECIMAL(5,1) DEFAULT 0,
  ast_to_ratio DECIMAL(5,2) DEFAULT 0,
  
  -- Defense
  stl INTEGER DEFAULT 0,
  stl_pg DECIMAL(5,1) DEFAULT 0,
  blk INTEGER DEFAULT 0,
  blk_pg DECIMAL(5,1) DEFAULT 0,
  pf INTEGER DEFAULT 0,                     -- Personal fouls
  
  -- Shooting
  fgm INTEGER DEFAULT 0,
  fga INTEGER DEFAULT 0,
  fg_pct DECIMAL(5,1) DEFAULT 0,
  
  fg3m INTEGER DEFAULT 0,
  fg3a INTEGER DEFAULT 0,
  fg3_pct DECIMAL(5,1) DEFAULT 0,
  
  ftm INTEGER DEFAULT 0,
  fta INTEGER DEFAULT 0,
  ft_pct DECIMAL(5,1) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint: one row per player per season
  UNIQUE(player_id, season)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_season ON players(season);
CREATE INDEX IF NOT EXISTS idx_players_league ON players(league);
CREATE INDEX IF NOT EXISTS idx_players_team_season ON players(team_id, season);
CREATE INDEX IF NOT EXISTS idx_players_pts_pg ON players(pts_pg DESC);
CREATE INDEX IF NOT EXISTS idx_players_last_name ON players(last_name);
