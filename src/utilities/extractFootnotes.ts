import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedFootnoteNode } from '@/lexical/footnotes/FootnoteNode'

export type ExtractedFootnote = {
  id: string
  content: string
  number: number
}

/**
 * Recursively extracts all footnotes from Lexical content in document order.
 * Returns an array of footnotes with their assigned numbers.
 */
export function extractFootnotes(content: {
  root: {
    children: SerializedLexicalNode[]
    [key: string]: unknown
  }
  [key: string]: unknown
}): ExtractedFootnote[] {
  const footnotes: ExtractedFootnote[] = []
  const seenIds = new Set<string>()

  function traverse(nodes: SerializedLexicalNode[]) {
    for (const node of nodes) {
      if (node.type === 'footnote') {
        const footnoteNode = node as SerializedFootnoteNode
        if (!seenIds.has(footnoteNode.id)) {
          seenIds.add(footnoteNode.id)
          footnotes.push({
            id: footnoteNode.id,
            content: footnoteNode.fields.content,
            number: footnotes.length + 1,
          })
        }
      }

      // Recursively check children if they exist
      if ('children' in node && Array.isArray(node.children)) {
        traverse(node.children as SerializedLexicalNode[])
      }
    }
  }

  if (content?.root?.children) {
    traverse(content.root.children)
  }

  return footnotes
}

/**
 * Creates a map from footnote ID to footnote number for quick lookup.
 */
export function createFootnoteNumberMap(footnotes: ExtractedFootnote[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const footnote of footnotes) {
    map.set(footnote.id, footnote.number)
  }
  return map
}
