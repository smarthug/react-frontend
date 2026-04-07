import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import PanelCard from '../components/PanelCard'

const initialPanels = [
  { id: '1', name: 'Panel_01', number: 1, transition: 'Auto', notes: '' },
  { id: '2', name: 'Panel_02', number: 2, transition: 'Auto', notes: '' },
  { id: '3', name: 'Panel_03', number: 3, transition: 'Auto', notes: '' },
  { id: '4', name: 'Panel_04', number: 4, transition: 'Auto', notes: '' },
  { id: '5', name: 'Panel_05', number: 5, transition: 'Auto', notes: '' },
  { id: '6', name: 'Panel_06', number: 6, transition: 'Auto', notes: '' },
]

function StoryboardPage() {
  const [panels, setPanels] = useState(initialPanels)
  const [modalPanel, setModalPanel] = useState(null)

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(panels)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setPanels(items)
  }

  const handleTransitionChange = (id, value) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, transition: value } : p)))
  }

  const handleNotesChange = (id, value) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, notes: value } : p)))
  }

  const handlePlayClick = (panel) => {
    setModalPanel(panel)
  }

  const closeModal = () => {
    setModalPanel(null)
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
                <Draggable key={panel.id} draggableId={panel.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <PanelCard
                        panel={panel}
                        onTransitionChange={handleTransitionChange}
                        onNotesChange={handleNotesChange}
                        onPlayClick={handlePlayClick}
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

      {modalPanel && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalPanel.name}</h2>
            <p>Panel #{modalPanel.number}</p>
            <button className="modal-close-btn" type="button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default StoryboardPage
