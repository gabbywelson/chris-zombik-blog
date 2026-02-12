'use client'

import type {
  EditorConfig,
  LexicalEditor,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from '@payloadcms/richtext-lexical/lexical'
import { DecoratorNode, $applyNodeReplacement } from '@payloadcms/richtext-lexical/lexical'
import type { JSX } from 'react'
import ObjectID from 'bson-objectid'

export type FootnoteFields = {
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

function FootnoteEditorComponent({ content }: { content: string }): JSX.Element {
  return (
    <sup
      className="footnote-ref select-none"
      title={content}
    >
      [legacy footnote]
    </sup>
  )
}

/**
 * Legacy client-side FootnoteNode kept for backward compatibility with older post content.
 */
export class ClientFootnoteNode extends DecoratorNode<JSX.Element> {
  __fields: FootnoteFields
  __id: string

  constructor({ fields, id, key }: { fields: FootnoteFields; id?: string; key?: NodeKey }) {
    super(key)
    this.__fields = fields
    this.__id = id || new ObjectID().toHexString()
  }

  static clone(node: ClientFootnoteNode): ClientFootnoteNode {
    return new ClientFootnoteNode({
      fields: node.__fields,
      id: node.__id,
      key: node.__key,
    })
  }

  static getType(): string {
    return 'footnote'
  }

  static importJSON(serializedNode: SerializedFootnoteNode): ClientFootnoteNode {
    return new ClientFootnoteNode({
      fields: serializedNode.fields,
      id: serializedNode.id,
    })
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    element.className = 'footnote-ref-wrapper'
    return element
  }

  updateDOM(): boolean {
    return false
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return <FootnoteEditorComponent content={this.__fields.content} />
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
}

export function $createClientFootnoteNode({
  content,
  id,
}: {
  content: string
  id?: string
}): ClientFootnoteNode {
  return $applyNodeReplacement(
    new ClientFootnoteNode({
      fields: { content },
      id,
    }),
  )
}

export function $isClientFootnoteNode(node: unknown): node is ClientFootnoteNode {
  return node instanceof ClientFootnoteNode
}
