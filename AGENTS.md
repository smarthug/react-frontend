<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-11 | Updated: 2026-04-11 -->

# react-frontend

## Purpose
React 19 + Vite SPA — the Lapis Dashboard UI. Dark mode (#0f0f0f/#1e1e1e/#9ca3af). Three routes: storyboards (panel drag-drop manager), cuts gallery (per-panel), settings (global templates + output dir). Vite proxies `/api` → backend at `localhost:8000`.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | Deps: react 19, react-router-dom 7, @hello-pangea/dnd 18. Scripts: `dev`, `build`, `lint`, `preview` |
| `vite.config.js` | Port 5174, proxy `/api` → `http://localhost:8000` (change origin) |
| `index.html` | Mount point |
| `eslint.config.js` | ESLint with react-hooks + react-refresh plugins |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `public/` | Static assets (favicon etc.) |
| `dist/` | Build output (gitignored) |
| `node_modules/` | npm dependencies (gitignored) |

## For AI Agents

### Working In This Directory
- Build: `npx vite build` (not `npm run build` if bin not on PATH)
- Dev server: `npx vite --host 0.0.0.0` then visit `http://localhost:5174`
- No state management library — local state + 5s polling is the pattern
- No CSS-in-JS — all styles in `src/index.css`
- Keep bundle small: NO new npm packages unless strictly necessary

### Testing Requirements
- `npm run build` must succeed before considering a frontend task done
- Manual browser check: `/storyboards`, `/cuts/:panelId`, `/settings`

### Common Patterns
- API functions in `src/api.js` — centralized `fetch` with JSON handling
- Pages in `src/pages/` consume API, manage state, render layout
- Components in `src/components/` are reusable (CutCard, PanelCard, Lightbox)

## Dependencies

### External
- `react@^19.2` — UI framework
- `react-router-dom@^7.14` — client-side routing with `:panelId` param
- `@hello-pangea/dnd@^18.0` — drag-drop (IDs must be strings — always `String(panel.id)`)

<!-- MANUAL: -->
