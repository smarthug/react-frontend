import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import PanelCard from '../components/PanelCard'
import { fetchPanels, createPanel, updatePanel, deletePanel, reorderPanels, fetchTemplates } from '../api'

function StoryboardPage() {
  const [panels, setPanels] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([fetchPanels(), fetchTemplates()])
      setPanels(p)
      setTemplates(t)
    } catch (err) {
      console.error('Failed to load panels:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleDragEnd = async (result) => {
    if (!result.destination) return
    const items = Array.from(panels)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setPanels(items)
    try {
      await reorderPanels(items.map((p) => p.id))
    } catch {
      loadData()
    }
  }

  const handlePanelClick = (panel) => {
    navigate(`/cuts/${panel.id}`)
  }

  const handlePanelUpdate = async (id, data) => {
    try {
      const updated = await updatePanel(id, data)
      setPanels((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (err) {
      console.error('Failed to update panel:', err)
    }
  }

  const handleAddPanel = async () => {
    const num = panels.length + 1
    try {
      await createPanel({ name: `Panel_${String(num).padStart(2, '0')}`, number: num })
      loadData()
    } catch (err) {
      console.error('Failed to create panel:', err)
    }
  }

  const handleDeletePanel = async (id) => {
    if (!confirm('Delete this panel and all its cuts?')) return
    try {
      await deletePanel(id)
      loadData()
    } catch (err) {
      console.error('Failed to delete panel:', err)
    }
  }

  if (loading) {
    return <div style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Loading panels...</div>
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="panels" direction="horizontal">
          {(provided) => (
            <div
              className="panel-grid"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {panels.map((panel, index) => (
                <Draggable key={String(panel.id)} draggableId={String(panel.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <PanelCard
                        key={`${panel.id}-${panel.output_path}-${panel.prompt_template_id}`}
                        panel={panel}
                        templates={templates}
                        onUpdate={handlePanelUpdate}
                        onClick={handlePanelClick}
                        onDelete={handleDeletePanel}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className="panel-add-btn" onClick={handleAddPanel} type="button">
        + Add Panel
      </button>
    </>
  )
}

export default StoryboardPage
