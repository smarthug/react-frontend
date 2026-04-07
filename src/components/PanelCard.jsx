import { useState } from 'react'

function PanelCard({ panel, onTransitionChange, onNotesChange, onPlayClick, dragHandleProps }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(panel.notes)

  const handleEditClick = () => {
    setDraft(panel.notes)
    setEditing(true)
  }

  const handleBlur = () => {
    setEditing(false)
    onNotesChange(panel.id, draft)
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <span className="panel-drag-handle" {...dragHandleProps}>&#x2801;&#x2802;</span>
        <span className="panel-card-name">{panel.name}</span>
      </div>

      <div className="panel-image-area" onClick={() => onPlayClick(panel)}>
        <button className="panel-play-btn" type="button">
          &#9654;
        </button>
        <span className="panel-number">{panel.number}</span>
      </div>

      <div className="panel-bottom-bar">
        <button className="panel-small-play" type="button">&#9654;</button>
        <select
          className="panel-transition-select"
          value={panel.transition}
          onChange={(e) => onTransitionChange(panel.id, e.target.value)}
        >
          <option value="Auto">Auto</option>
          <option value="Manual">Manual</option>
          <option value="Loop">Loop</option>
        </select>
      </div>

      <div className="panel-notes">
        <div className="panel-notes-header">
          <span className="panel-notes-label">NOTES</span>
          <button className="panel-notes-edit-btn" type="button" onClick={handleEditClick}>
            &#9998;
          </button>
        </div>
        {editing ? (
          <textarea
            className="panel-notes-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div className="panel-notes-text">
            {panel.notes || 'Click edit to add notes...'}
          </div>
        )}
      </div>
    </div>
  )
}

export default PanelCard
