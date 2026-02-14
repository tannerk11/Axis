# Data Pipeline

## Overview

Axis Analytics sources all game data from **Presto Sports**, the official statistics provider for NAIA member institutions. Raw data is scraped, imported into PostgreSQL, and then processed to derive advanced analytics metrics.

## Pipeline Steps

The pipeline runs in this order:

```
1. scrape-team-urls.js   → Discover team data endpoints
2. import-data.js        → Import game results and box scores
3. scrape-conferences.js → Get conference assignments
4. calculate-analytics.js → Compute advanced metrics
5. import-players.js     → Import individual player stats
```

### Step 1: Scrape Team URLs (`scrape-team-urls.js`)

- Uses Puppeteer to scrape the NAIA website for team schedule page URLs
- Extracts each team's Presto Sports JSON data endpoint
- Saves results to `team-urls-YYYY-YY.json` (cached per season)
- Populates the `teams` table with team_id, name, league, json_url

**Run manually:** `npm run scrape` or `node scrape-team-urls.js --season 2025-26`

### Step 2: Import Game Data (`import-data.js`)

- Reads team URLs from the JSON cache file
- Fetches each team's JSON data from Presto Sports S3 (`prestosports-downloads.s3.us-west-2.amazonaws.com`)
- Parses box scores (made-attempted format like "36-67")
- Classifies each game: exhibition, conference, postseason, national tournament
- Determines game location (home/away/neutral)
- Inserts or updates rows in the `games` table
- Processes 5 teams concurrently for performance

**Run manually:** `npm run import` or `node import-data.js --season 2025-26`

### Step 3: Scrape Conferences (`scrape-conferences.js`)

- Scrapes the NAIA website for conference membership assignments
- Updates the `conference` column in the `teams` table
- Also scrapes team logos and school colors

**Run manually:** `npm run conferences` or `node scrape-conferences.js --season 2025-26`

### Step 4: Calculate Analytics (`calculate-analytics.js`)

This is the core analytics engine. It computes:

- **Efficiency ratings:** Offensive Rating, Defensive Rating, Net Rating (points per 100 possessions)
- **Adjusted ratings:** Efficiency ratings adjusted for strength of opponents (iterative algorithm, 5 iterations)
- **RPI:** Rating Percentage Index (30% Win%, 50% Opponent Win%, 20% Opponent's Opponent Win%)
- **Strength of Schedule:** SOS, OSOS (offensive), DSOS (defensive), NSOS (net)
- **Shooting splits:** FG%, 3P%, FT%, eFG% (team and opponent)
- **Four Factors:** eFG%, Turnover%, OREB%, FT Rate
- **Per-game stats:** Assists, steals, blocks, rebounds, fouls
- **Pace:** Possessions per game

Key parameters (defined in the script):
- `ADJUSTMENT_FACTOR = 0.4` — weight for SOS adjustment
- `HOME_COURT_ADVANTAGE = 3.5` — points added/subtracted for home/away adjustments
- `ITERATIONS = 5` — number of iterative adjustment passes

Results are written to the `team_ratings` table with `date_calculated` set to today.

**Run manually:** `npm run analytics` or `node calculate-analytics.js --season 2025-26`

### Step 5: Import Players (`import-players.js`)

- Fetches player statistics from Presto Sports for each team
- Imports per-game stats: points, rebounds, assists, shooting percentages, etc.
- Populates the `players` table

**Run manually:** `node import-players.js --season 2025-26 --league mens`

## Automated Schedule

In production, `scheduler.js` runs these jobs automatically via node-cron:

| Time (Eastern) | Job | Scripts Run |
|----------------|-----|-------------|
| Midnight | Scrape | `scrape-team-urls.js` + `scrape-conferences.js` |
| Every 4 hours (2am, 6am, 10am, 2pm, 6pm, 10pm) | Refresh | `import-data.js` + `calculate-analytics.js` |
| 3:00 AM | Players | `import-players.js` |

The scheduler prevents overlapping runs — if a previous job is still running, the next scheduled run is skipped.

The scheduler only starts when `NODE_ENV=production` (see `server.js` line 29).

## Full Refresh

To run the entire pipeline manually:

```bash
# Current season (uses DEFAULT_SEASON)
npm run refresh

# Specific season
npm run refresh:2024    # runs 2024-25 pipeline
```

The `refresh` script chains: `scrape → import → conferences → analytics`

## Adding a New Season

1. Create a new season's data by running the pipeline with `--season YYYY-YY`:
   ```bash
   node scrape-team-urls.js --season 2026-27
   node import-data.js --season 2026-27
   node scrape-conferences.js --season 2026-27
   node calculate-analytics.js --season 2026-27
   ```
2. Update `DEFAULT_SEASON` in `server.js`
3. Update `SEASON` in `render.yaml`
4. Update the default season in `client/src/App.jsx` DEFAULTS object

## Excluded Teams

The file `config/excluded-teams.js` lists non-NAIA teams (NCAA D1/D2/D3, junior colleges) that should not count as NAIA opponents. These exclusions affect:
- NAIA win/loss record
- Strength of Schedule calculations
- RPI formula

When a team plays an excluded opponent, that game is tagged `is_naia_game = FALSE` in the `games` table.

## Data Source Format

Presto Sports exposes team data as JSON files hosted on S3:
```
https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/{teamId}.json
```

Each JSON file contains:
- Team schedule with game results
- Box score statistics per game
- Game metadata (date, opponent, location, event type)
