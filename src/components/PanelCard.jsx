import { useState, useEffect } from 'react'
import { fetchPanelSummary } from '../api'

function PanelCard({ panel, templates, onUpdate, onClick, onDelete, dragHandleProps }) {
  const [showSettings, setShowSettings] = useState(false)
  const [summary, setSummary] = useState(null)
  const [outputPath, setOutputPath] = useState(panel.output_path || '')
  const [templateId, setTemplateId] = useState(panel.prompt_template_id || '')
  const [notes, setNotes] = useState(panel.notes || '')
  const [transition, setTransition] = useState(panel.transition || 'Auto')

  useEffect(() => {
    fetchPanelSummary(panel.id).then(setSummary).catch(() => {})
  }, [panel.id])

  const handleSaveSettings = () => {
    onUpdate(panel.id, {
      output_path: outputPath || null,
      prompt_template_id: templateId ? Number(templateId) : null,
      notes,
      transition,
    })
    setShowSettings(false)
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header" {...dragHandleProps}>
        <span className="panel-drag-handle">&#x2630;</span>
        <span className="panel-card-name">{panel.name}</span>
        <div className="panel-card-actions">
          <button
            className="panel-settings-toggle"
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings) }}
            title="Settings"
          >
            &#x2699;
          </button>
          <button
            className="panel-delete-toggle"
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(panel.id) }}
            title="Delete"
          >
            &#x2715;
          </button>
        </div>
      </div>

      <div className="panel-card-body" onClick={() => onClick(panel)} role="button" tabIndex={0}>
        <div className="panel-card-image-placeholder">
          {summary?.best_cut ? (
            <img className="panel-card-thumbnail" src={summary.best_cut.src} alt="Best cut" />
          ) : panel.output_path ? (
            <span className="panel-card-path-badge" title={panel.output_path}>
              {panel.output_path.split('/').slice(-2).join('/')}
            </span>
          ) : (
            <span className="panel-card-no-path">No output path set</span>
          )}
        </div>
        {summary && summary.cut_count > 0 ? (
          <div className="panel-card-stats">
            <span className="panel-stat-count">{summary.cut_count} cuts</span>
            {summary.pass_count > 0 && <span className="panel-stat-pass">{summary.pass_count} pass</span>}
            {summary.fail_count > 0 && <span className="panel-stat-fail">{summary.fail_count} fail</span>}
          </div>
        ) : (
          <div className="panel-card-click-hint">Click to view cuts</div>
        )}
      </div>

      {showSettings && (
        <div className="panel-card-settings" onClick={(e) => e.stopPropagation()}>
          <label className="panel-setting-label">
            Output Path
            <input
              type="text"
              className="settings-input"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              placeholder="/path/to/ComfyUI/output/..."
            />
          </label>
          <label className="panel-setting-label">
            Review Prompt
            <select
              className="settings-input"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="">Global Default</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}{t.is_default ? ' (default)' : ''}</option>
              ))}
            </select>
          </label>
          <label className="panel-setting-label">
            Transition
            <select
              className="settings-input"
              value={transition}
              onChange={(e) => setTransition(e.target.value)}
            >
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
              <option value="Loop">Loop</option>
            </select>
          </label>
          <label className="panel-setting-label">
            Notes
            <textarea
              className="settings-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </label>
          <button className="settings-btn settings-btn-primary" onClick={handleSaveSettings} type="button">
            Save Settings
          </button>
        </div>
      )}
    </div>
  )
}

export default PanelCard
