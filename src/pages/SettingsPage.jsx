import { useState, useEffect } from 'react'
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../api'

function SettingsPage() {
  const [templates, setTemplates] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', content: '', is_default: false })
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', content: '', is_default: false })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const tmpl = await fetchTemplates()
      setTemplates(tmpl)
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
  }

  const handleCreate = async () => {
    try {
      await createTemplate(newForm)
      setNewForm({ name: '', content: '', is_default: false })
      setShowNew(false)
      await loadData()
      setMessage('Template created.')
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleUpdate = async () => {
    try {
      await updateTemplate(editingId, editForm)
      setEditingId(null)
      await loadData()
      setMessage('Template updated.')
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id)
      await loadData()
      setMessage('Template deleted.')
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setEditForm({ name: t.name, content: t.content, is_default: t.is_default })
  }

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      {message && <div className="settings-message">{message}</div>}

      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Review Prompt Templates</h3>
          <button className="settings-btn" onClick={() => setShowNew(!showNew)}>
            {showNew ? 'Cancel' : '+ New Template'}
          </button>
        </div>
        <p className="settings-hint">
          프롬프트 템플릿은 Qwen에게 이미지 평가 방식을 지시합니다. 각 패널 설정에서
          원하는 템플릿을 선택하세요. Output Path는 스토리보드 페이지의 각 패널
          설정에서 지정합니다.
        </p>

        {showNew && (
          <div className="template-form">
            <input
              type="text"
              className="settings-input"
              placeholder="Template name"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
            />
            <textarea
              className="settings-textarea"
              placeholder="Review prompt content..."
              value={newForm.content}
              onChange={(e) => setNewForm({ ...newForm, content: e.target.value })}
              rows={6}
            />
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={newForm.is_default}
                onChange={(e) => setNewForm({ ...newForm, is_default: e.target.checked })}
              />
              Set as default
            </label>
            <button className="settings-btn settings-btn-primary" onClick={handleCreate}>
              Create Template
            </button>
          </div>
        )}

        <div className="template-list">
          {templates.map((t) => (
            <div key={t.id} className="template-card">
              {editingId === t.id ? (
                <div className="template-form">
                  <input
                    type="text"
                    className="settings-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <textarea
                    className="settings-textarea"
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={6}
                  />
                  <label className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={editForm.is_default}
                      onChange={(e) => setEditForm({ ...editForm, is_default: e.target.checked })}
                    />
                    Set as default
                  </label>
                  <div className="template-actions">
                    <button className="settings-btn settings-btn-primary" onClick={handleUpdate}>Save</button>
                    <button className="settings-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="template-header">
                    <span className="template-name">
                      {t.name}
                      {t.is_default && <span className="template-default-badge">Default</span>}
                    </span>
                    <div className="template-actions">
                      <button className="settings-btn-sm" onClick={() => startEdit(t)}>Edit</button>
                      <button className="settings-btn-sm settings-btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                    </div>
                  </div>
                  <pre className="template-content">{t.content}</pre>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
