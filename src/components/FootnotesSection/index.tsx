import type { ExtractedFootnote } from '@/utilities/extractFootnotes'

type Props = {
  footnotes: ExtractedFootnote[]
  className?: string
}

export function FootnotesSection({ footnotes, className = '' }: Props) {
  if (!footnotes || footnotes.length === 0) {
    return null
  }

  return (
    <section
      className={`footnotes-section border-t border-border mt-12 pt-8 ${className}`}
      aria-label="Footnotes"
    >
      <h2 className="text-xl font-serif font-semibold mb-6">Footnotes</h2>
      <ol className="list-none space-y-4 text-sm text-muted-foreground">
        {footnotes.map((footnote) => (
          <li key={footnote.id} id={`footnote-${footnote.id}`} className="flex gap-3">
            <span className="text-primary font-medium shrink-0">[{footnote.number}]</span>
            <span className="flex-1">
              {footnote.content}
              <a
                href={`#footnote-ref-${footnote.id}`}
                className="ml-2 text-primary hover:text-primary/80 no-underline"
                aria-label={`Back to reference ${footnote.number}`}
                title="Back to reference"
              >
                ↩
              </a>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
