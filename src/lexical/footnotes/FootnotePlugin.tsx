'use client'

import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'
import type { JSX } from 'react'

import { LexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $getNodeByKey,
} from '@payloadcms/richtext-lexical/lexical'
import { useCallback, useContext, useEffect, useState } from 'react'

import {
  $createClientFootnoteNode,
  $isClientFootnoteNode,
  ClientFootnoteNode,
} from './ClientFootnoteNode'
import { FootnoteModal } from './FootnoteModal'

type FootnotePayload = {
  nodeKey?: string
}

export const INSERT_FOOTNOTE_COMMAND: LexicalCommand<void> =
  createCommand('INSERT_FOOTNOTE_COMMAND')
export const OPEN_FOOTNOTE_MODAL_COMMAND: LexicalCommand<FootnotePayload> = createCommand(
  'OPEN_FOOTNOTE_MODAL_COMMAND',
)

// Inner component that requires the Lexical context
function FootnotePluginInner({ editor }: { editor: any }): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null)
  const [initialContent, setInitialContent] = useState<string>('')

  const handleModalSubmit = useCallback(
    (content: string) => {
      editor.update(() => {
        if (editingNodeKey) {
          // Editing existing footnote
          const node = $getNodeByKey(editingNodeKey)
          if (node && $isClientFootnoteNode(node)) {
            node.setFields({ content })
          }
        } else {
          // Creating new footnote
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const footnoteNode = $createClientFootnoteNode({ content })
            selection.insertNodes([footnoteNode])
          }
        }
      })

      setEditingNodeKey(null)
      setInitialContent('')
      setIsModalOpen(false)
    },
    [editor, editingNodeKey],
  )

  const handleClose = useCallback(() => {
    setEditingNodeKey(null)
    setInitialContent('')
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      INSERT_FOOTNOTE_COMMAND,
      () => {
        setEditingNodeKey(null)
        setInitialContent('')
        setIsModalOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      OPEN_FOOTNOTE_MODAL_COMMAND,
      (payload: FootnotePayload) => {
        if (payload?.nodeKey) {
          // Edit existing footnote
          editor.getEditorState().read(() => {
            const node = $getNodeByKey(payload.nodeKey!)
            if (node && $isClientFootnoteNode(node)) {
              setEditingNodeKey(payload.nodeKey!)
              setInitialContent(node.getFields().content)
              setIsModalOpen(true)
            }
          })
        } else {
          // New footnote
          setEditingNodeKey(null)
          setInitialContent('')
          setIsModalOpen(true)
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <FootnoteModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleModalSubmit}
      initialContent={initialContent}
      title={editingNodeKey ? 'Edit Footnote' : 'Add Footnote'}
    />
  )
}

// Wrapper component that safely checks for Lexical context
export function FootnotePlugin(): JSX.Element | null {
  const composerContext = useContext(LexicalComposerContext)

  // If no context available, render nothing
  if (!composerContext) {
    return null
  }

  const [editor] = composerContext

  return <FootnotePluginInner editor={editor} />
}
