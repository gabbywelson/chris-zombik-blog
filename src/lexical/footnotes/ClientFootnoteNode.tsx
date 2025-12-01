'use client'

import type { EditorConfig, LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical'

import ObjectID from 'bson-objectid'
import { $applyNodeReplacement, DecoratorNode } from '@payloadcms/richtext-lexical/lexical'
import * as React from 'react'
import type { JSX } from 'react'

import type { FootnoteFields, SerializedFootnoteNode } from './FootnoteNode'

// Client-side component for rendering footnotes in the editor
function FootnoteEditorComponent({
  content,
  nodeKey,
}: {
  content: string
  nodeKey: string
}): JSX.Element {
  return (
    <sup
      className="footnote-ref cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
      title={content}
      data-footnote-id={nodeKey}
    >
      [*]
    </sup>
  )
}

/**
 * Client-side FootnoteNode with proper React decoration for the Lexical editor.
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

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    element.className = 'footnote-ref-wrapper'
    element.setAttribute('data-footnote', 'true')
    element.setAttribute('data-footnote-id', this.__id)
    element.style.display = 'inline'
    return element
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <FootnoteEditorComponent
        content={this.__fields.content}
        nodeKey={this.__key}
      />
    )
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

export function $isClientFootnoteNode(
  node: unknown,
): node is ClientFootnoteNode {
  return node instanceof ClientFootnoteNode
}

