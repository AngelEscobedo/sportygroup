# AI Tools Used

I used **Claude Code** (Anthropic, Claude Opus model) as a pair programmer during this assignment. I set the direction, made the product and architecture decisions, and reviewed everything. Claude sped up implementation and helped me check my ideas against the real API.

## What I decided

- **Stack**: Angular with standalone components, Angular Material as the base, and Tailwind for utility styling.
- **Structure**: component-based architecture with separate `.ts` / `.html` / `.scss` files per component.
- **API exploration**: I pointed to the free key `123` and asked to check API v2 for the missing `strLeagueAlternate` field. This is how we confirmed that v2 is premium-only and found that `lookupleague.php` does return the field.
- **UX**: expandable cards instead of a modal, to make the app feel more modern.
- **Product angle**: featuring the English Premier League, given Sporty Group's UK market.
- **Documentation**: English docs, and what each document should cover.

## Where Claude helped

| Area                | How it helped                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planning            | Turned the brief into a requirements checklist, a folder structure and a 90-minute time plan, which I then adjusted.                                                                                          |
| API probing         | Ran the requests I asked for and summarised the quirks: `strBadge: null` in early seasons, a string payload for invalid ids, a varying league count, no alternate names in `all_leagues.php`.                 |
| Project setup       | Scaffolded Angular 22 and set up Material and Tailwind v4 together. The non-obvious parts were disabling Tailwind's preflight and keeping Tailwind out of Sass.                                               |
| **Signal store**    | Helped me build `LeaguesStore`: private writable signals with read-only exposure, `computed` selectors for the filtered list and the sports list, featured-first sorting, and a single-expanded-card action.  |
| **Expandable card** | Implemented the card I designed: accessible `<button>` header with `aria-expanded`/`aria-controls`, enter animation, rotating chevron, one open card at a time, and lazy loading of details only when opened. |
| Lazy details        | Suggested `rxResource` so loading / error / value states are signals, and loading the badge and alternate names in parallel.                                                                                  |
| Caching             | Helped write the in-memory cache in `SportsApiService` (`shareReplay`, failed requests not cached so retries work).                                                                                           |
| Tests               | Drafted unit tests for the cache, the API service (`HttpTestingController`) and the store.                                                                                                                    |
| Verification        | Checked the app in a browser: expand/collapse, one request per league in the network log, search, the empty state and the mobile layout.                                                                      |
| Docs                | Drafted the first versions of README and CLAUDE.md, which I restructured around the app's purpose and how the API works.                                                                                      |

## How I validated the output

- Read and reviewed every generated file. Kept the code consistent with the structure and conventions I asked for.
- Ran the production build and the test suite (9/9 passing).
- Tested the flows manually on desktop and mobile.
