import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import CutCard from '../components/CutCard'
import { fetchCuts, deleteCut } from '../api'

const STATUS_OPTIONS = ['pass', 'fail', 'pending', 'error']

function CutsPage() {
  const { panelId } = useParams()
  const [cuts, setCuts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState('score')
  const [statusFilter, setStatusFilter] = useState([])

  const loadCuts = useCallback(async () => {
    try {
      const status = statusFilter.length > 0 ? statusFilter.join(',') : undefined
      const data = await fetchCuts(panelId, { sort, status })
      setCuts(data.items)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [panelId, sort, statusFilter])

  useEffect(() => {
    setLoading(true)
    loadCuts()
    const interval = setInterval(loadCuts, 5000)
    return () => clearInterval(interval)
  }, [loadCuts])

  const handleDelete = async (id) => {
    setCuts((prev) => prev.filter((c) => c.id !== id))
    try {
      await deleteCut(id)
    } catch {
      loadCuts()
    }
  }

  const toggleStatus = (s) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  if (loading) {
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

      {error && <div className="cuts-status cuts-error">Error: {error}</div>}

      {!error && cuts.length === 0 && (
        <div className="cuts-status">
          No images yet. {panelId ? 'Set an output path in panel settings and add images.' : 'Add images to get started.'}
        </div>
      )}

      <div className="cuts-grid">
        {cuts.map((cut) => (
          <CutCard key={cut.id} cut={cut} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default CutsPage
