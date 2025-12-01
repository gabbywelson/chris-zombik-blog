'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type Props = {
  initialContent: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  title: string
}

export function FootnoteModal({ initialContent, isOpen, onClose, onSubmit, title }: Props) {
  const [content, setContent] = React.useState(initialContent)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  React.useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="footnote-modal-overlay">
      <div className="footnote-modal-container">
        <div className="footnote-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="footnote-modal-close" type="button">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="footnote-modal-body">
          <div className="space-y-2">
            <label className="footnote-modal-label">Footnote Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter footnote content here..."
              className="footnote-modal-textarea"
              autoFocus
            />
          </div>
          <div className="footnote-modal-footer">
            <button type="button" onClick={onClose} className="footnote-modal-btn cancel">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit(content)}
              className="footnote-modal-btn save"
            >
              Save Footnote
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
