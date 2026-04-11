import { useState, useEffect, useCallback } from 'react'
import CutCard from '../components/CutCard'
import { fetchCuts, deleteCut } from '../api'

function CutsPage() {
  const [cuts, setCuts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCuts = useCallback(async () => {
    try {
      const data = await fetchCuts()
      setCuts(data.items)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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

  if (loading) {
    return <div className="cuts-status">Loading...</div>
  }

  if (error) {
    return <div className="cuts-status cuts-error">Error: {error}</div>
  }

  if (cuts.length === 0) {
    return (
      <div className="cuts-status">
        No images yet. Add images to your ComfyUI output directory to get started.
      </div>
    )
  }

  return (
    <div className="cuts-grid">
      {cuts.map((cut) => (
        <CutCard key={cut.id} cut={cut} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default CutsPage
