# Database Schema

## Overview

Axis Analytics uses PostgreSQL with 4 main tables. The schema was created by `setup-database.js` and evolved through 9 migration scripts.

## Tables

### `teams`

Stores team identity and metadata. One row per team per season.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Auto-incrementing primary key |
| team_id | VARCHAR(50) | Presto Sports team identifier |
| name | VARCHAR(255) | Team name |
| league | VARCHAR(10) | `mens` or `womens` |
| conference | VARCHAR(100) | Conference name |
| json_url | TEXT | Presto Sports JSON data URL |
| primary_color | VARCHAR(7) | Hex color code |
| secondary_color | VARCHAR(7) | Hex color code |
| logo_url | TEXT | Team logo image URL |
| city | VARCHAR(100) | School city |
| state | VARCHAR(2) | School state abbreviation |
| latitude | DECIMAL(10,7) | School latitude |
| longitude | DECIMAL(10,7) | School longitude |
| is_excluded | BOOLEAN | TRUE if non-NAIA team (excluded from calculations) |
| season | VARCHAR(10) | Season identifier (e.g., `2025-26`) |
| created_at | TIMESTAMP | Row creation timestamp |
| updated_at | TIMESTAMP | Row update timestamp |

**Unique constraint:** `(team_id, season)`
**Indexes:** `idx_teams_league`, `idx_teams_season`

---

### `games`

Stores individual game results and box score data. One row per team per game (each game appears twice — once for each team).

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Auto-incrementing primary key |
| game_id | VARCHAR(100) | Unique game identifier |
| team_id | VARCHAR(50) | Team this row is for |
| opponent_id | VARCHAR(50) | Opponent team_id (if NAIA) |
| opponent_name | VARCHAR(255) | Opponent display name |
| game_date | DATE | Date of game |
| location | VARCHAR(20) | `home`, `away`, or `neutral` |
| team_score | INTEGER | Team's final score |
| opponent_score | INTEGER | Opponent's final score |
| is_completed | BOOLEAN | Whether game has been played |
| season | VARCHAR(10) | Season identifier |
| **Classification flags** | | |
| is_conference | BOOLEAN | Conference game |
| is_postseason | BOOLEAN | Postseason (conference tournament) game |
| is_national_tournament | BOOLEAN | National tournament game |
| is_naia_game | BOOLEAN | Opponent is an NAIA team |
| event_id | VARCHAR(50) | Presto Sports event ID |
| **Team box score** | | |
| fgm, fga | INTEGER | Field goals made/attempted |
| fg_pct | DECIMAL(5,3) | Field goal percentage |
| fgm3, fga3 | INTEGER | 3-pointers made/attempted |
| fg3_pct | DECIMAL(5,3) | 3-point percentage |
| ftm, fta | INTEGER | Free throws made/attempted |
| ft_pct | DECIMAL(5,3) | Free throw percentage |
| oreb, dreb, treb | INTEGER | Offensive/defensive/total rebounds |
| ast | INTEGER | Assists |
| stl | INTEGER | Steals |
| blk | INTEGER | Blocks |
| turnovers | INTEGER | Turnovers |
| pf | INTEGER | Personal fouls |
| pts_paint | INTEGER | Points in the paint |
| pts_fastbreak | INTEGER | Fastbreak points |
| pts_bench | INTEGER | Bench points |
| pts_turnovers | INTEGER | Points off turnovers |
| possessions | DECIMAL(6,1) | Estimated possessions |
| **Opponent box score** | | |
| opp_fgm, opp_fga, ... | (same types) | Mirror of all team stats for opponent |
| **Halftime scores** | | |
| first_half_score | INTEGER | Team's 1st half score |
| second_half_score | INTEGER | Team's 2nd half score |
| opp_first_half_score | INTEGER | Opponent's 1st half score |
| opp_second_half_score | INTEGER | Opponent's 2nd half score |
| **Timestamps** | | |
| created_at | TIMESTAMP | Row creation |
| updated_at | TIMESTAMP | Row update |

**Unique constraint:** `(game_id, season)`
**Indexes:** `idx_games_team`, `idx_games_date`, `idx_games_season`

---

### `team_ratings`

Stores pre-calculated analytics metrics. Updated daily by `calculate-analytics.js`. One row per team per calculation date per season.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Auto-incrementing primary key |
| team_id | VARCHAR(50) | Team identifier |
| date_calculated | DATE | Date these ratings were computed |
| season | VARCHAR(10) | Season identifier |
| **Record** | | |
| games_played | INTEGER | Total NAIA games |
| wins, losses | INTEGER | Overall wins/losses |
| win_pct | DECIMAL(5,3) | Overall win percentage |
| naia_wins, naia_losses | INTEGER | NAIA-only wins/losses |
| naia_win_pct | DECIMAL(5,3) | NAIA win percentage |
| **Scoring** | | |
| points_per_game | DECIMAL(6,2) | Average points scored |
| points_allowed_per_game | DECIMAL(6,2) | Average points allowed |
| **Efficiency Ratings** | | |
| offensive_rating | DECIMAL(6,2) | Points per 100 possessions |
| defensive_rating | DECIMAL(6,2) | Points allowed per 100 possessions |
| net_rating | DECIMAL(6,2) | ORTG minus DRTG |
| adjusted_offensive_rating | DECIMAL(6,2) | SOS-adjusted ORTG |
| adjusted_defensive_rating | DECIMAL(6,2) | SOS-adjusted DRTG |
| adjusted_net_rating | DECIMAL(6,2) | SOS-adjusted net rating |
| **Shooting** | | |
| fg_pct | DECIMAL(5,2) | Field goal % |
| fg3_pct | DECIMAL(5,2) | 3-point % |
| ft_pct | DECIMAL(5,2) | Free throw % |
| efg_pct | DECIMAL(5,2) | Effective FG % |
| fg_pct_opp | DECIMAL(5,2) | Opponent FG % |
| fg3_pct_opp | DECIMAL(5,2) | Opponent 3P % |
| efg_pct_opp | DECIMAL(5,2) | Opponent eFG % |
| **Four Factors** | | |
| turnover_pct | DECIMAL(5,2) | Turnovers per 100 possessions |
| turnover_pct_opp | DECIMAL(5,2) | Opponent turnover % |
| oreb_pct | DECIMAL(5,2) | Offensive rebound % |
| dreb_pct | DECIMAL(5,2) | Defensive rebound % |
| oreb_pct_opp | DECIMAL(5,2) | Opponent OREB % |
| dreb_pct_opp | DECIMAL(5,2) | Opponent DREB % |
| ft_rate | DECIMAL(5,2) | FTA / FGA |
| three_pt_rate | DECIMAL(5,2) | 3PA / FGA |
| pace | DECIMAL(5,1) | Possessions per game |
| **Per-Game Stats** | | |
| assists_per_game | DECIMAL(5,2) | |
| turnovers_per_game | DECIMAL(5,2) | |
| steals_per_game | DECIMAL(5,2) | |
| blocks_per_game | DECIMAL(5,2) | |
| fouls_per_game | DECIMAL(5,2) | |
| oreb_per_game | DECIMAL(5,2) | |
| dreb_per_game | DECIMAL(5,2) | |
| total_reb_per_game | DECIMAL(5,2) | |
| **Opponent Per-Game Stats** | | |
| assists_per_game_opp | DECIMAL(5,2) | |
| turnovers_per_game_opp | DECIMAL(5,2) | |
| steals_per_game_opp | DECIMAL(5,2) | |
| blocks_per_game_opp | DECIMAL(5,2) | |
| fouls_per_game_opp | DECIMAL(5,2) | |
| oreb_per_game_opp | DECIMAL(5,2) | |
| dreb_per_game_opp | DECIMAL(5,2) | |
| total_reb_per_game_opp | DECIMAL(5,2) | |
| **Strength of Schedule** | | |
| rpi | DECIMAL(8,6) | Rating Percentage Index |
| strength_of_schedule | DECIMAL(8,6) | Overall SOS |
| opponent_win_pct | DECIMAL(8,6) | Average opponent win % |
| opponent_opponent_win_pct | DECIMAL(8,6) | Avg opponent's opponent win % |
| osos | DECIMAL(6,2) | Offensive SOS |
| dsos | DECIMAL(6,2) | Defensive SOS |
| nsos | DECIMAL(6,2) | Net SOS |
| assist_turnover_ratio | DECIMAL(5,2) | AST/TO ratio |
| **Timestamps** | | |
| created_at | TIMESTAMP | Row creation |

**Unique constraint:** `(team_id, date_calculated, season)`
**Indexes:** `idx_ratings_team_date`, `idx_ratings_season`

---

### `players`

Stores individual player season statistics. One row per player per season.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Auto-incrementing primary key |
| player_id | VARCHAR(50) | Presto Sports player ID |
| team_id | VARCHAR(50) | Team identifier |
| season | VARCHAR(10) | Season identifier |
| league | VARCHAR(20) | `mens` or `womens` |
| **Player Info** | | |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| position | VARCHAR(20) | G, F, C, PG, SG, SF, PF, etc. |
| year | VARCHAR(20) | Fr, So, Jr, Sr, Gr |
| uniform | VARCHAR(10) | Jersey number |
| height | VARCHAR(10) | Player height |
| **Game Stats** | | |
| gp | INTEGER | Games played |
| gs | INTEGER | Games started |
| min | DECIMAL(10,1) | Total minutes |
| min_pg | DECIMAL(5,1) | Minutes per game |
| **Scoring** | | |
| pts | INTEGER | Total points |
| pts_pg | DECIMAL(5,1) | Points per game |
| **Rebounds** | | |
| oreb, dreb, reb | INTEGER | Offensive/defensive/total |
| reb_pg | DECIMAL(5,1) | Rebounds per game |
| **Assists & Turnovers** | | |
| ast | INTEGER | Total assists |
| ast_pg | DECIMAL(5,1) | Assists per game |
| turnovers | INTEGER | Total turnovers |
| to_pg | DECIMAL(5,1) | Turnovers per game |
| ast_to_ratio | DECIMAL(5,2) | Assist-to-turnover ratio |
| **Defense** | | |
| stl, blk | INTEGER | Total steals/blocks |
| stl_pg, blk_pg | DECIMAL(5,1) | Per game |
| pf | INTEGER | Personal fouls |
| **Shooting** | | |
| fgm, fga | INTEGER | Field goals made/attempted |
| fg_pct | DECIMAL(5,1) | FG % |
| fg3m, fg3a | INTEGER | 3-pointers made/attempted |
| fg3_pct | DECIMAL(5,1) | 3P % |
| ftm, fta | INTEGER | Free throws made/attempted |
| ft_pct | DECIMAL(5,1) | FT % |
| **Timestamps** | | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Unique constraint:** `(player_id, season)`
**Indexes:** `idx_players_team_id`, `idx_players_season`, `idx_players_league`, `idx_players_team_season`, `idx_players_pts_pg`, `idx_players_last_name`

## Relationships

```
teams.team_id ←── games.team_id
teams.team_id ←── games.opponent_id
teams.team_id ←── team_ratings.team_id
teams.team_id ←── players.team_id
```

Note: Foreign key constraints were dropped in `migrate-add-season.js` to simplify multi-season data management. Referential integrity is maintained at the application level.

## Migration History

| # | Script | Changes |
|---|--------|---------|
| 1 | `setup-database.js` | Creates `teams`, `games`, `team_ratings` tables with base columns |
| 2 | `migrations/001_create_players_table.sql` | Creates `players` table |
| 3 | `migrate-add-analytics.js` | Adds 28 analytics columns to `team_ratings` |
| 4 | `migrate-add-game-stats.js` | Adds 47 box score columns to `games` |
| 5 | `migrate-add-naia-game.js` | Adds `is_naia_game` flag to `games` |
| 6 | `migrate-add-location.js` | Adds city/state/lat/lng to `teams` |
| 7 | `migrate-add-excluded.js` | Adds `is_excluded` flag to `teams` |
| 8 | `migrate-add-season.js` | Adds `season` column to all tables, changes unique constraints |
| 9 | `migrate-add-national-tournament.js` | Adds `is_national_tournament` flag to `games` |
| 10 | `migrate-sos-precision.js` | Increases decimal precision on SOS columns |
| 11 | `migrate-copy-locations.js` | Copies location data between seasons |

Migrations are ad-hoc Node.js scripts, not managed by a migration framework. They must be run manually and in order.
