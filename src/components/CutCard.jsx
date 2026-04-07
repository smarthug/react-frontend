function CutCard({ cut, onDelete }) {
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
        <img src={cut.src} alt={cut.description} loading="lazy" />
      </div>
      <div className="cut-card-info">
        <div className="cut-card-path">{cut.path}</div>
        <div className="cut-card-desc">{cut.description}</div>
      </div>
    </div>
  )
}

export default CutCard
