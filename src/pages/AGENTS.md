<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-11 | Updated: 2026-04-11 -->

# pages

## Purpose
Route-level React page components. Each consumes the API client, manages route-scoped state, and composes components.

## Key Files
| File | Description |
|------|-------------|
| `StoryboardPage.jsx` | Panel manager. Loads panels + templates. Drag-drop reorders (POST /api/panels/reorder). Click → `navigate(/cuts/:id)`. Supports add/delete panel. `draggableId={String(panel.id)}` (dnd requires string IDs). |
| `CutsPage.jsx` | Gallery for `:panelId`. Score/recent sort, status multi-filter, select mode with bulk delete/re-review, "Load More" pagination (`currentLimit` adjusts polling to keep loaded range refreshed), Lightbox integration on image click. 5s polling. |
| `SettingsPage.jsx` | Global settings: CRUD prompt templates (create/edit inline/delete), edit ComfyUI output directory (note: per-panel output_path in PanelCard supersedes this for newly watched dirs). |

## For AI Agents

### Working In This Directory
- **Polling + pagination**: when `currentLimit` grows via Load More, polling calls `fetchCuts(panelId, {limit: currentLimit})` to refresh the entire loaded range without reverting to page 1
- **Bulk re-review**: changes cuts to `{status: 'pending', review: null}` locally, then fires `bulkReReviewCuts(ids)` — polling eventually reconciles
- **Drag-drop**: reset selection + lightbox on panelId change (avoid stale indices)
- `confirm()` for destructive bulk actions; inline confirm banner for single-cut delete not implemented yet

### Testing Requirements
- StoryboardPage: drag-drop reorder persists (refresh page, order preserved)
- CutsPage: sort by score puts highest first, null scores last; filter combines with sort
- SettingsPage: create template → appears in PanelCard dropdown (refresh storyboards)

### Common Patterns
- `useCallback` for fetch functions to stable-reference polling interval
- `useEffect` resets state (cuts, selection, lightbox) when route params change
- Error state rendered above grid, empty state rendered instead of grid

## Dependencies

### Internal
- `../api.js` — all data fetching
- `../components/CutCard`, `../components/PanelCard`, `../components/Lightbox`

### External
- `react-router-dom` (useParams, useNavigate, Link)
- `@hello-pangea/dnd` (DragDropContext, Droppable, Draggable)

<!-- MANUAL: -->
