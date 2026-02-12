import type { DefaultTypedEditorState, SerializedInlineBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

import type { SerializedFootnoteNode } from '@/lexical/footnotes/FootnoteNode'

type FootnoteInlineBlockFields = {
  blockName?: string
  blockType: 'footnoteReference'
  content: DefaultTypedEditorState
}

export type ExtractedFootnote = {
  content: DefaultTypedEditorState | string
  id: string
  number: number
}

function isLegacyFootnoteNode(node: SerializedLexicalNode): node is SerializedFootnoteNode {
  return node.type === 'footnote'
}

function isFootnoteInlineBlockNode(
  node: SerializedLexicalNode,
): node is SerializedInlineBlockNode<FootnoteInlineBlockFields> {
  if (node.type !== 'inlineBlock') {
    return false
  }

  const fields = (node as SerializedInlineBlockNode<FootnoteInlineBlockFields>).fields
  return fields?.blockType === 'footnoteReference' && typeof fields?.id === 'string'
}

/**
 * Recursively extracts all footnotes from Lexical content in document order.
 * Supports both legacy `footnote` nodes and new `footnoteReference` inline blocks.
 */
export function extractFootnotes(content?: DefaultTypedEditorState | null): ExtractedFootnote[] {
  const footnotes: ExtractedFootnote[] = []
  const seenIds = new Set<string>()

  function pushFootnote(footnote: Omit<ExtractedFootnote, 'number'>) {
    if (seenIds.has(footnote.id)) {
      return
    }

    seenIds.add(footnote.id)
    footnotes.push({
      ...footnote,
      number: footnotes.length + 1,
    })
  }

  function traverse(nodes: SerializedLexicalNode[]) {
    for (const node of nodes) {
      if (isLegacyFootnoteNode(node)) {
        pushFootnote({
          id: node.id,
          content: node.fields.content,
        })
      }

      if (isFootnoteInlineBlockNode(node)) {
        pushFootnote({
          id: node.fields.id,
          content: node.fields.content,
        })
      }

      if ('children' in node && Array.isArray(node.children)) {
        traverse(node.children as SerializedLexicalNode[])
      }
    }
  }

  if (content?.root?.children) {
    traverse(content.root.children as SerializedLexicalNode[])
  }

  return footnotes
}

export function createFootnoteNumberMap(footnotes: ExtractedFootnote[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const footnote of footnotes) {
    map.set(footnote.id, footnote.number)
  }
  return map
}
