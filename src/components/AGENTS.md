<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-11 | Updated: 2026-04-11 -->

# components

## Purpose
Reusable React components consumed by page-level components.

## Key Files
| File | Description |
|------|-------------|
| `Sidebar.jsx` | Left nav: Storyboards / Cuts / Settings + bottom Help/Logout |
| `Header.jsx` | Top bar: search, notifications, user avatar |
| `PanelCard.jsx` | Single storyboard panel. Settings popover (output_path, prompt template dropdown, transition, notes). Fetches `/api/panels/{id}/summary` for best-cut thumbnail + cut/pass/fail counts. Click body → navigate to cuts. Gear icon opens settings. |
| `CutCard.jsx` | Single cut. Status badge, score bars (composition/detail/prompt_fidelity), total score, feedback, error message, filename, timestamp, seed (from `cut.generation_params` JSON), prompt template tag (shows which template reviewed this cut). Delete + re-review buttons. Checkbox in select mode. Click image → lightbox. |
| `Lightbox.jsx` | Full-size image modal. ESC/ArrowLeft/ArrowRight keyboard nav. Shows filename, total score, seed+steps+cfg+sampler tags, feedback, toggle to reveal full review prompt content (`review.prompt_template_content`). |

## For AI Agents

### Working In This Directory
- **PanelCard state staleness**: the parent passes `key={`${panel.id}-${panel.output_path}-${panel.prompt_template_id}`}` to force remount on material changes (local state reset). If you change which fields trigger remount, update the key in `StoryboardPage.jsx`.
- **CutCard**: all callbacks use `e.stopPropagation()` to prevent triggering image-click (lightbox). Checkbox is positioned absolute; delete/re-review buttons grouped top-right.
- **Lightbox**: `useEffect` adds keydown listener, cleanup on unmount. Prompt content hidden by default — user toggles via button.
- Seed display uses `JSON.parse(cut.generation_params)` — null-safe check required
- `review.prompt_template_name` and `review.prompt_template_content` come from the API (require backend joinedload of `Review.prompt_template`)

### Testing Requirements
- PanelCard: change output_path → summary refetches on next mount (key change)
- CutCard: all buttons clickable without propagating to image-click
- Lightbox: keyboard nav only affects current lightbox, removed on unmount

### Common Patterns
- Props destructured at top of component
- Conditional renders use `&&` short-circuit
- CSS classes are descriptive (`.cut-card-seed`, `.lightbox-prompt-toggle`)

## Dependencies

### Internal
- `../api.js` (PanelCard for summary fetch only)

### External
- react (useState, useEffect, useCallback)

<!-- MANUAL: -->
