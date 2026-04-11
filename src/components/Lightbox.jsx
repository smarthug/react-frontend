import { useEffect, useCallback, useState } from 'react'

function Lightbox({ cuts, currentIndex, onClose, onNavigate }) {
  const cut = cuts[currentIndex]
  const [showPrompt, setShowPrompt] = useState(false)
  if (!cut) return null
  const review = cut.review
  const params = cut.generation_params ? JSON.parse(cut.generation_params) : null

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1)
    if (e.key === 'ArrowRight' && currentIndex < cuts.length - 1) onNavigate(currentIndex + 1)
  }, [currentIndex, cuts.length, onClose, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {currentIndex > 0 && (
          <button className="lightbox-nav lightbox-prev" onClick={() => onNavigate(currentIndex - 1)} type="button">
            &#x2039;
          </button>
        )}

        <img className="lightbox-image" src={cut.src} alt={cut.image_filename} />

        {currentIndex < cuts.length - 1 && (
          <button className="lightbox-nav lightbox-next" onClick={() => onNavigate(currentIndex + 1)} type="button">
            &#x203A;
          </button>
        )}

        <button className="lightbox-close" onClick={onClose} type="button">&#x2715;</button>

        <div className="lightbox-info">
          <div className="lightbox-info-row">
            <span className="lightbox-filename">{cut.image_filename}</span>
            {review?.total_score != null && (
              <span className="lightbox-score">{review.total_score.toFixed(1)}</span>
            )}
            <span className="lightbox-counter">{currentIndex + 1} / {cuts.length}</span>
          </div>

          {params?.seed && (
            <div className="lightbox-info-row">
              <span className="lightbox-tag">Seed: {params.seed}</span>
              {params.steps && <span className="lightbox-tag">Steps: {params.steps}</span>}
              {params.cfg && <span className="lightbox-tag">CFG: {params.cfg}</span>}
              {params.sampler_name && <span className="lightbox-tag">{params.sampler_name}</span>}
              {params.denoise != null && <span className="lightbox-tag">Denoise: {params.denoise}</span>}
            </div>
          )}

          {review?.feedback && (
            <div className="lightbox-feedback">{review.feedback}</div>
          )}

          {review?.prompt_template_name && (
            <div className="lightbox-prompt-section">
              <button
                className="lightbox-prompt-toggle"
                onClick={() => setShowPrompt(!showPrompt)}
                type="button"
              >
                {showPrompt ? '- Hide' : '+ Show'} Review Prompt ({review.prompt_template_name})
              </button>
              {showPrompt && review.prompt_template_content && (
                <pre className="lightbox-prompt-content">{review.prompt_template_content}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lightbox
