# CLAUDE.md — Axis Analytics

## What This Project Is

NAIA basketball analytics platform. Scrapes game data from Presto Sports, calculates advanced metrics, and presents them via a React frontend. Serves coaches, selection committee members, and fans.

## Tech Stack

- **Backend:** Express 5 + PostgreSQL (CommonJS, `server.js` is the monolith — 2900+ lines)
- **Frontend:** React 19 + Vite 7 + Recharts + React Router 7 (ESM, all in `client/`)
- **Data Pipeline:** Node.js scripts at project root, Puppeteer for scraping
- **Deployment:** Render.com (`render.yaml`)

## Key Architecture Decisions

- **URL-based state:** All filter state (league, season, conference, opponent, statGroup, view) is stored in URL search params, not React state. See `App.jsx` lines 37-44.
- **CSS variables for theming:** Light/dark mode uses CSS custom properties in `client/src/index.css`. Theme toggle is in `ThemeContext.jsx`.
- **Pre-calculated ratings:** The `team_ratings` table stores pre-computed metrics. The `calculateDynamicStats()` function in `server.js` (line 126) does on-the-fly calculation from raw game data when filters are applied.
- **No TypeScript:** The project uses plain JavaScript despite having `@types/react` installed.

## Project Layout

```
server.js              — ALL API routes + SQL queries + business logic
scheduler.js           — Cron jobs for automated data refresh
config/                — excluded-teams.js (non-NAIA opponent list)
client/src/App.jsx     — Routing, state management, data fetching
client/src/components/ — All UI components (JSX + colocated CSS)
client/src/contexts/   — ThemeContext.jsx only
client/src/index.css   — Global styles + all CSS variable tokens
```

## Common Tasks

### Run locally
```bash
npm run dev          # API server on :3001
cd client && npm run dev  # Vite dev server on :5173
```

### Refresh data for current season
```bash
npm run refresh      # scrape → import → conferences → analytics
```

### Add a new season
1. Update `DEFAULT_SEASON` in `server.js` line 34
2. Update `SEASON` in `render.yaml` line 16
3. Update default in `client/src/App.jsx` DEFAULTS object (line 24)
4. Run `npm run refresh` with `--season YYYY-YY`

### Add a new API endpoint
All endpoints are in `server.js`. Follow the existing pattern:
```javascript
app.get('/api/your-endpoint', async (req, res) => {
  try {
    const result = await pool.query('...', [params]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});
```

### Add a new page/route
1. Create component in `client/src/components/YourPage.jsx`
2. Import in `App.jsx` and add a `<Route>` element
3. Add nav button in `Header.jsx` (both desktop nav-right and mobile dropdown)

## Known Issues / Gotchas

- **`server.js` is 2900+ lines** — all routes, SQL, and business logic in one file. Decomposition is planned but not yet done.
- **`API_URL` is duplicated** in 9 component files. If you need to change the API URL, search for `import.meta.env.VITE_API_URL` across all files.
- **`TOOLTIPS` are duplicated** in `TeamsTable.jsx`, `Scout.jsx`, and `Bracketcast.jsx` with inconsistent content. If updating tooltip text, check all three.
- **`normalizeYear()` and `normalizePosition()`** are duplicated in `Scout.jsx` and `Players.jsx`.
- **No tests exist.** There is no test framework configured.
- **Network errors are silent** — all catch blocks log to console only, no user-facing error messages.
- **Render cold starts** — the free-tier Render service can take 30+ seconds to wake up.

## Database

PostgreSQL with 4 main tables: `teams`, `games`, `team_ratings`, `players`. See `docs/database-schema.md` for full schema. Connection via `DATABASE_URL` env var with SSL.

## Data Pipeline

Presto Sports → scrape-team-urls.js → import-data.js → scrape-conferences.js → calculate-analytics.js → import-players.js. Automated via `scheduler.js` in production. See `docs/data-pipeline.md`.
