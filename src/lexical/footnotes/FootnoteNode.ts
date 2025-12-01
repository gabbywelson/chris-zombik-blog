import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from '@payloadcms/richtext-lexical/lexical'

import ObjectID from 'bson-objectid'
import { $applyNodeReplacement, DecoratorNode } from '@payloadcms/richtext-lexical/lexical'
import type { JSX } from 'react'

export type FootnoteFields = {
  /** The footnote content/text */
  content: string
}

export type SerializedFootnoteNode = Spread<
  {
    fields: FootnoteFields
    id: string
    type: 'footnote'
  },
  SerializedLexicalNode
>

/**
 * FootnoteNode is an inline decorator node that displays a superscript footnote reference
 * and stores the footnote content within the node itself.
 */
export class FootnoteNode extends DecoratorNode<JSX.Element | null> {
  __fields: FootnoteFields
  __id: string

  constructor({ fields, id, key }: { fields: FootnoteFields; id?: string; key?: NodeKey }) {
    super(key)
    this.__fields = fields
    this.__id = id || new ObjectID().toHexString()
  }

  static clone(node: FootnoteNode): FootnoteNode {
    return new FootnoteNode({
      fields: node.__fields,
      id: node.__id,
      key: node.__key,
    })
  }

  static getType(): string {
    return 'footnote'
  }

  static importDOM(): DOMConversionMap | null {
    return {
      sup: (node: HTMLElement) => {
        if (node.hasAttribute('data-footnote')) {
          return {
            conversion: () => {
              const content = node.getAttribute('data-footnote-content') || ''
              const id = node.getAttribute('data-footnote-id') || new ObjectID().toHexString()
              return {
                node: $createFootnoteNode({ content, id }),
              }
            },
            priority: 1,
          }
        }
        return null
      },
    }
  }

  static importJSON(serializedNode: SerializedFootnoteNode): FootnoteNode {
    return $createFootnoteNode({
      content: serializedNode.fields.content,
      id: serializedNode.id,
    })
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    element.className = 'footnote-ref-wrapper'
    element.setAttribute('data-footnote', 'true')
    element.setAttribute('data-footnote-id', this.__id)
    element.style.display = 'inline'
    return element
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element | null {
    // Return null here - the actual decoration is handled by the replacement mechanism
    // in the client feature where we specify a different node class
    return null
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('sup')
    element.setAttribute('data-footnote', 'true')
    element.setAttribute('data-footnote-id', this.__id)
    element.setAttribute('data-footnote-content', this.__fields.content)
    element.textContent = '[*]' // Placeholder, actual number calculated at render time
    return { element }
  }

  exportJSON(): SerializedFootnoteNode {
    return {
      type: 'footnote',
      fields: this.getFields(),
      id: this.getID(),
      version: 1,
    }
  }

  getFields(): FootnoteFields {
    return this.getLatest().__fields
  }

  getID(): string {
    return this.getLatest().__id
  }

  getTextContent(): string {
    return '[*]'
  }

  isInline(): boolean {
    return true
  }

  setFields(fields: FootnoteFields): this {
    const writable = this.getWritable()
    writable.__fields = fields
    return writable
  }

  updateDOM(): boolean {
    return false
  }
}

export function $createFootnoteNode({
  content,
  id,
}: {
  content: string
  id?: string
}): FootnoteNode {
  return $applyNodeReplacement(
    new FootnoteNode({
      fields: { content },
      id,
    }),
  )
}

export function $isFootnoteNode(node: LexicalNode | null | undefined): node is FootnoteNode {
  return node instanceof FootnoteNode
}
