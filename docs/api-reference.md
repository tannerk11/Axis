# API Reference

All endpoints are GET requests served by `server.js` on port 3001 (development) or the Render web service URL (production).

## Metadata

### `GET /api/seasons`
Returns available seasons for a league.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |

**Response:** `["2024-25", "2025-26"]`

### `GET /api/conferences`
Returns available conferences for a league/season.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** `["American Midwest", "Chicagoland Collegiate", ...]`

### `GET /api/months`
Returns months that have game data.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** `["2024-11", "2024-12", "2025-01", ...]`

### `GET /api/last-updated`
Returns the timestamp of the most recent analytics calculation.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** `{ "lastUpdated": "2025-02-10T05:00:00.000Z" }`

### `GET /health` and `GET /api/health`
Health check endpoints.

**Response:** `{ "status": "ok", "timestamp": "..." }`

---

## Teams

### `GET /api/teams`
Main endpoint — returns all teams with statistics. Supports dynamic filtering; when filters are applied, stats are recalculated from raw game data on the fly.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |
| conference | (all) | Filter by conference name |
| gameType | (all) | Filter: `naia`, `conference`, `non-conference` |
| seasonType | (all) | Filter: `Regular Season`, `Conference Tournament`, `National Tournament` |
| seasonSegment | (all) | Filter by month (`YYYY-MM`) or `last5`/`last10` games |

**Response:** Array of team objects with all statistics (record, efficiency ratings, shooting, rebounding, per-game stats, SOS, RPI).

### `GET /api/teams/:teamId`
Returns a single team's details including pre-calculated ratings.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Team object with identity info and latest ratings from `team_ratings`.

### `GET /api/teams/:teamId/splits`
Returns game-by-game statistics for a team.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Array of game objects with opponent details, scores, box score stats, running averages, and efficiency metrics per game.

### `GET /api/teams/:teamId/percentiles`
Returns percentile rankings for a team's stats across the league.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Object mapping each stat to a percentile value (0-100).

### `GET /api/teams/:teamId/schedule`
Returns a team's full schedule with results, opponent ratings, quadrant classifications, and predictions for future games.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Array of schedule entries with opponent details, scores, game classification, quadrant, and predictions (margin, win probability, projected scores).

### `GET /api/teams/:teamId/roster`
Returns a team's roster with player statistics.

| Param | Default | Description |
|-------|---------|-------------|
| season | 2025-26 | Season identifier |

**Response:** Array of player objects.

---

## Players

### `GET /api/players`
Returns paginated player statistics with filtering and sorting.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |
| conference | (all) | Filter by conference |
| team | (all) | Filter by team_id |
| position | (all) | Filter by position |
| year | (all) | Filter by class year (Fr, So, Jr, Sr) |
| sort | pts_pg | Sort column |
| order | DESC | Sort direction |
| limit | 100 | Results per page |
| offset | 0 | Pagination offset |

**Response:** Array of player objects with per-game stats and shooting percentages.

### `GET /api/players/exists`
Checks whether player data exists for a league/season.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** `{ "hasPlayers": true }`

### `GET /api/players/:playerId`
Returns detailed stats for a single player.

| Param | Default | Description |
|-------|---------|-------------|
| season | 2025-26 | Season identifier |

**Response:** Player object with full statistics.

---

## Matchups & Games

### `GET /api/matchup`
Head-to-head comparison of two teams with percentile rankings.

| Param | Required | Description |
|-------|----------|-------------|
| team1 | Yes | First team's team_id |
| team2 | Yes | Second team's team_id |
| league | No | Default: `mens` |
| season | No | Default: `2025-26` |

**Response:** Object with both teams' stats and percentile rankings.

### `GET /api/games/:gameId/boxscore`
Returns detailed box score for a specific game.

| Param | Default | Description |
|-------|---------|-------------|
| season | 2025-26 | Season identifier |

**Response:** Object with team and opponent box score stats, shooting percentages, and halftime scores.

---

## Conferences

### `GET /api/conferences/:conference/games`
Returns all games for teams in a conference, organized by date.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Array of game objects with full details.

### `GET /api/conferences/:conference/summary`
Returns aggregate statistics for a conference (averages, totals).

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Object with conference-level aggregate stats.

### `GET /api/conferences/:conference/head-to-head`
Returns head-to-head results matrix for all teams in a conference.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Object mapping team pairs to game results.

### `GET /api/conference-rankings`
Returns power rankings for all conferences with projected standings.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Array of conference objects with aggregate metrics, strength rankings, and projected standings.

### `GET /api/conference-rpi-scatter`
Returns all teams with RPI and adjusted net rating for scatter plot visualization.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Array of team objects with `rpi`, `adjusted_net_rating`, and identity info.

---

## Analytics

### `GET /api/national-averages`
Returns league-wide average metrics.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Object with average values for all major statistics.

---

## Bracketcast

### `GET /api/bracketcast`
Returns tournament projection data including seedings, bracket, and pod assignments.

| Param | Default | Description |
|-------|---------|-------------|
| league | mens | `mens` or `womens` |
| season | 2025-26 | Season identifier |

**Response:** Object with:
- `teams` — Array of teams ranked by projected rank, with RPI, quadrant records, conference champion status, and selection criteria
- `bracket` — Object mapping seeds to teams with first-round matchups
- `pods` — Array of geographic pod assignments with host teams
