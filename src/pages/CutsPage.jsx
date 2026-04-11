import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import CutCard from '../components/CutCard'
import Lightbox from '../components/Lightbox'
import { fetchCuts, deleteCut, reReviewCut, bulkDeleteCuts, bulkReReviewCuts } from '../api'

const STATUS_OPTIONS = ['pass', 'fail', 'pending', 'error']
const PAGE_SIZE = 50

function CutsPage() {
  const { panelId } = useParams()
  const [cuts, setCuts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState('score')
  const [statusFilter, setStatusFilter] = useState([])
  const [currentLimit, setCurrentLimit] = useState(PAGE_SIZE)

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Bulk select
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const loadCuts = useCallback(async () => {
    try {
      const status = statusFilter.length > 0 ? statusFilter.join(',') : undefined
      const data = await fetchCuts(panelId, { limit: currentLimit, sort, status })
      setCuts(data.items)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [panelId, sort, statusFilter, currentLimit])

  useEffect(() => {
    setLoading(true)
    setCuts([])
    setCurrentLimit(PAGE_SIZE)
    setSelectedIds(new Set())
    setSelectMode(false)
    setLightboxIndex(null)
  }, [panelId, sort, statusFilter])

  useEffect(() => {
    loadCuts()
    const interval = setInterval(loadCuts, 5000)
    return () => clearInterval(interval)
  }, [loadCuts])

  const handleDelete = async (id) => {
    setCuts((prev) => prev.filter((c) => c.id !== id))
    try { await deleteCut(id) } catch { loadCuts() }
  }

  const handleReReview = async (id) => {
    setCuts((prev) => prev.map((c) => c.id === id ? { ...c, status: 'pending', review: null } : c))
    try { await reReviewCut(id) } catch { loadCuts() }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} selected cuts?`)) return
    const ids = [...selectedIds]
    setCuts((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    setSelectedIds(new Set())
    try { await bulkDeleteCuts(ids) } catch { loadCuts() }
  }

  const handleBulkReReview = async () => {
    const ids = [...selectedIds]
    setCuts((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, status: 'pending', review: null } : c))
    setSelectedIds(new Set())
    try { await bulkReReviewCuts(ids) } catch { loadCuts() }
  }

  const toggleStatus = (s) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === cuts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(cuts.map((c) => c.id)))
    }
  }

  const handleLoadMore = () => {
    setCurrentLimit((prev) => prev + PAGE_SIZE)
  }

  if (loading && cuts.length === 0) {
    return <div className="cuts-status">Loading...</div>
  }

  return (
    <div>
      <div className="cuts-toolbar">
        <div className="cuts-toolbar-left">
          {panelId && (
            <Link to="/storyboards" className="cuts-back-link">&larr; Back to Storyboard</Link>
          )}
          {!panelId && (
            <span className="cuts-toolbar-title">All Cuts</span>
          )}
          <button
            className={`cuts-filter-btn ${selectMode ? 'active' : ''}`}
            onClick={() => { setSelectMode(!selectMode); setSelectedIds(new Set()) }}
            type="button"
          >
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
        <div className="cuts-toolbar-right">
          <div className="cuts-filter-group">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                className={`cuts-filter-btn ${statusFilter.includes(s) ? 'active' : ''}`}
                onClick={() => toggleStatus(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
          <select
            className="cuts-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="score">Score (best first)</option>
            <option value="recent">Recent first</option>
          </select>
        </div>
      </div>

      {selectMode && selectedIds.size > 0 && (
        <div className="bulk-action-bar">
          <button className="cuts-filter-btn" onClick={toggleSelectAll} type="button">
            {selectedIds.size === cuts.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="bulk-count">{selectedIds.size} selected</span>
          <button className="settings-btn-sm settings-btn-danger" onClick={handleBulkDelete} type="button">
            Delete Selected
          </button>
          <button className="settings-btn-sm" onClick={handleBulkReReview} type="button">
            Re-review Selected
          </button>
        </div>
      )}

      {selectMode && selectedIds.size === 0 && (
        <div className="bulk-action-bar">
          <button className="cuts-filter-btn" onClick={toggleSelectAll} type="button">Select All</button>
          <span className="bulk-count">Click cards to select</span>
        </div>
      )}

      {error && <div className="cuts-status cuts-error">Error: {error}</div>}

      {!error && cuts.length === 0 && !loading && (
        <div className="cuts-status">
          No images yet. {panelId ? 'Set an output path in panel settings and add images.' : 'Add images to get started.'}
        </div>
      )}

      <div className="cuts-grid">
        {cuts.map((cut, index) => (
          <CutCard
            key={cut.id}
            cut={cut}
            onDelete={handleDelete}
            onImageClick={() => setLightboxIndex(index)}
            onReReview={handleReReview}
            selectMode={selectMode}
            selected={selectedIds.has(cut.id)}
            onSelect={toggleSelect}
          />
        ))}
      </div>

      {cuts.length > 0 && (
        <div className="cuts-pagination">
          <span className="cuts-counter">Showing {cuts.length} of {total}</span>
          {cuts.length < total && (
            <button className="load-more-btn" onClick={handleLoadMore} type="button">
              Load More
            </button>
          )}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          cuts={cuts}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}

export default CutsPage
