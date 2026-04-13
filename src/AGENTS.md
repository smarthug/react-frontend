<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-11 | Updated: 2026-04-11 -->

# src

## Purpose
All React application code: entry point, top-level App with routing, global CSS, API client, pages, and components.

## Key Files
| File | Description |
|------|-------------|
| `main.jsx` | React mount point, wraps app in `<BrowserRouter>` |
| `App.jsx` | Layout (Sidebar + Header + content area) + route config (`/storyboards`, `/cuts`, `/cuts/:panelId`, `/settings`) |
| `api.js` | `fetch`-based API client. Functions: `fetchPanels/Cuts/Templates/Settings/PanelSummary`, `create/update/delete` for each, `reorderPanels`, `reReviewCut`, `bulkDeleteCuts`, `bulkReReviewCuts`. `fetchCuts(panelId, {limit, offset, sort, order, status})`. |
| `index.css` | All styles (dark mode, grid layouts, lightbox, bulk bar, panel cards). Cut card styles originally at lines 417-489 — now expanded with score bars, status badges, seed display, prompt tag. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `pages/` | Route-level components: StoryboardPage, CutsPage, SettingsPage (see `pages/AGENTS.md`) |
| `components/` | Reusable: PanelCard, CutCard, Lightbox, Sidebar, Header (see `components/AGENTS.md`) |
| `assets/` | Images/icons |

## For AI Agents

### Working In This Directory
- `api.js` throws Error with `detail` text on non-200 — callers should try/catch
- Dark mode palette: bg `#0f0f0f` / `#1e1e1e` / `#161616`, text `#e5e7eb` / `#d1d5db` / `#9ca3af` / `#6b7280` / `#4b5563`, accents `#16a34a` (pass) / `#dc2626` (fail) / `#f59e0b` (error)
- CSS classes are kebab-case (`.cut-card-*`, `.panel-card-*`, `.lightbox-*`, `.settings-*`)

### Testing Requirements
- After modifying CSS: `npx vite build` to catch syntax errors
- Verify routes render: `/storyboards`, `/cuts/1`, `/settings`

### Common Patterns
- Polling: `useEffect` + `setInterval(loadFn, 5000)` + cleanup
- Optimistic UI: `setState` locally, then fire API, fallback to `loadFn()` on error
- URL params: `const { panelId } = useParams()`

## Dependencies

### Internal
- Backend API at `/api/*` (proxied by Vite)

### External
- react, react-router-dom, @hello-pangea/dnd

<!-- MANUAL: -->
