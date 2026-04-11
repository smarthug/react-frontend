function ScoreBar({ label, value }) {
  const pct = ((value ?? 0) / 10) * 100
  const color = value >= 7 ? '#16a34a' : value >= 4 ? '#f59e0b' : '#dc2626'
  return (
    <div className="cut-card-score-row">
      <span className="cut-card-score-label">{label}</span>
      <div className="cut-card-score-bar">
        <div className="cut-card-score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="cut-card-score-value">{value != null ? value.toFixed(1) : '-'}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pass: { text: 'PASS', cls: 'status-pass' },
    fail: { text: 'FAIL', cls: 'status-fail' },
    pending: { text: 'PENDING', cls: 'status-pending' },
    error: { text: 'ERROR', cls: 'status-error' },
  }
  const s = map[status] || map.pending
  return <span className={`cut-card-status ${s.cls}`}>{s.text}</span>
}

function CutCard({ cut, onDelete }) {
  const review = cut.review
  const hasReview = review && review.total_score != null

  return (
    <div className="cut-card">
      <div className="cut-card-image-wrapper">
        <button
          className="cut-delete-btn"
          type="button"
          onClick={() => onDelete(cut.id)}
          title="Delete"
        >
          &#x1F5D1;
        </button>
        <StatusBadge status={cut.status} />
        <img src={cut.src} alt={cut.description || cut.image_filename} loading="lazy" />
      </div>

      <div className="cut-card-info">
        {hasReview && (
          <>
            <div className="cut-card-total-score">
              {review.total_score.toFixed(1)}
            </div>
            <div className="cut-card-scores">
              <ScoreBar label="Comp" value={review.scores?.composition} />
              <ScoreBar label="Detail" value={review.scores?.detail} />
              <ScoreBar label="Prompt" value={review.scores?.prompt_fidelity} />
            </div>
          </>
        )}

        {review?.feedback && (
          <div className="cut-card-feedback">{review.feedback}</div>
        )}

        {cut.error_message && (
          <div className="cut-card-error">{cut.error_message}</div>
        )}

        <div className="cut-card-meta">
          <div className="cut-card-path">{cut.image_filename}</div>
          {cut.created_at && (
            <div className="cut-card-timestamp">
              {new Date(cut.created_at).toLocaleString()}
            </div>
          )}
        </div>

        {cut.generation_params && (
          <details className="cut-card-params">
            <summary>Parameters</summary>
            <pre>{cut.generation_params}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default CutCard
