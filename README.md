# League List

A single-page app that lists sports leagues from [TheSportsDB](https://www.thesportsdb.com/free_sports_api), with search by name, a sport filter, and expandable cards that show a season badge.

Built with **Angular 22** (standalone components, signals), **Angular Material 3** and **Tailwind CSS v4**.

## Quick start

Requirements: **Node.js 22.22+ or 24.15+** (required by Angular 22) and npm.

```bash
npm install
npm start          # http://localhost:4200
```

| Command         | What it does                           |
| --------------- | -------------------------------------- |
| `npm start`     | Dev server with live reload            |
| `npm run build` | Production build to `dist/league-list` |
| `npm test`      | Unit tests (Vitest)                    |

## Features

- Fetches all leagues and shows `strLeague`, `strSport` and `strLeagueAlternate` (when available).
- Debounced search by league name (it also matches alternate names), plus a sport dropdown built from the data.
- Click a card to expand it: it loads the first season that has a badge and the league's alternate names.
- Every API response is cached in memory, so re-opening a card does not repeat the requests.
- The English Premier League is pinned first and highlighted as "Featured".
- Responsive grid (1 / 2 / 3 columns) with light and dark themes based on the OS setting. Loading, empty and error states. Keyboard and screen-reader friendly.

## Design decisions

- **Purpose**: a league browser, the entry point of a bookmaker product. The goals are to find a league fast, recognise it (name, sport, alternate names), surface the most relevant league first, and keep backend calls to a minimum.
- **Architecture**: component based, with standalone components. `LeaguesPage` is the only container. Search, filter, list and card are presentational (`input()` / `output()`). All state lives in a small **signals store** (`LeaguesStore`); derived data (filtered list, sports list) is `computed`, so it is never stored twice. NgRx was not needed at this size.
- **API handling**: `SportsApiService` is the only place that knows the API. It normalizes the quirks: `all_leagues.php` has no `strLeagueAlternate`, so that field is loaded from `lookupleague.php` when a card is expanded; the first seasons often have `strBadge: null`, so the first season *with* a badge is used; an invalid id returns a string and is treated as "no badge"; v2 requires a premium key, so v1 is used.
- **Caching**: `RequestCache` shares one observable per request (`shareReplay`). Repeat calls and concurrent calls hit the network once, and errors are evicted so retries work. Request budget: `1 + 2 × distinct leagues opened`.
- **UX**: an expandable card instead of a modal (the badge shows in context, one card open at a time). The Premier League is featured for a UK audience. Search is debounced and accent-insensitive. Loading, empty and error states. Accessible, responsive, light and dark theme.
- **Styling**: Angular Material for accessible interactive components and theme tokens; Tailwind v4 for layout and spacing (preflight disabled to avoid clashes).
- **Free-tier limits**: the free key returns a small, Soccer-only subset, so the sport dropdown (built from the data) currently lists only Soccer.

## Docs

- [CLAUDE.md](CLAUDE.md): how to run it, configuration, installed packages, architecture.
- [AI.md](AI.md): how AI tools were used.
