'use client'

import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'
import type { JSX } from 'react'

import { LexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { formatDrawerSlug, useEditDepth } from '@payloadcms/ui'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from '@payloadcms/richtext-lexical/lexical'
import { useCallback, useContext, useEffect, useState } from 'react'

import { FieldsDrawer } from '@payloadcms/richtext-lexical/client'
import { useEditorConfigContext } from '@payloadcms/richtext-lexical/client'
import { useLexicalDrawer } from '@payloadcms/richtext-lexical/client'

import { $createClientFootnoteNode, $isClientFootnoteNode } from './ClientFootnoteNode'

type FootnoteDrawerPayload = {
  nodeKey?: string
}

export const INSERT_FOOTNOTE_COMMAND: LexicalCommand<void> =
  createCommand('INSERT_FOOTNOTE_COMMAND')
export const OPEN_FOOTNOTE_DRAWER_COMMAND: LexicalCommand<FootnoteDrawerPayload> = createCommand(
  'OPEN_FOOTNOTE_DRAWER_COMMAND',
)

// Inner component that requires the Lexical context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FootnotePluginInner({ editor }: { editor: any }): JSX.Element {
  const editDepth = useEditDepth()
  const {
    fieldProps: { schemaPath },
    uuid,
  } = useEditorConfigContext()

  const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null)
  const [initialContent, setInitialContent] = useState<string>('')

  const drawerSlug = formatDrawerSlug({
    slug: `lexical-footnote-${uuid}`,
    depth: editDepth,
  })

  const { toggleDrawer, closeDrawer } = useLexicalDrawer(drawerSlug, true)

  const handleDrawerSubmit = useCallback(
    (fields: any, data: any) => {
      const content = data.content as string

      editor.update(() => {
        if (editingNodeKey) {
          // Editing existing footnote
          const node = editor.getEditorState()._nodeMap.get(editingNodeKey)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (node && $isClientFootnoteNode(node as any)) {
            ;(node as any).setFields({ content })
          }
        } else {
          // Creating new footnote
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const footnoteNode = $createClientFootnoteNode({ content })
            selection.insertNodes([footnoteNode as any])
          }
        }
      })

      setEditingNodeKey(null)
      setInitialContent('')
      closeDrawer()
    },
    [editor, editingNodeKey, closeDrawer],
  )

  useEffect(() => {
    return editor.registerCommand(
      INSERT_FOOTNOTE_COMMAND,
      () => {
        setEditingNodeKey(null)
        setInitialContent('')
        toggleDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, toggleDrawer])

  useEffect(() => {
    return editor.registerCommand(
      OPEN_FOOTNOTE_DRAWER_COMMAND,
      (payload: FootnoteDrawerPayload) => {
        if (payload?.nodeKey) {
          // Edit existing footnote
          editor.getEditorState().read(() => {
            const node = editor.getEditorState()._nodeMap.get(payload.nodeKey!)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (node && $isClientFootnoteNode(node as any)) {
              setEditingNodeKey(payload.nodeKey!)
              setInitialContent((node as any).getFields().content)
            }
          })
        } else {
          // New footnote
          setEditingNodeKey(null)
          setInitialContent('')
        }
        toggleDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, toggleDrawer])

  return (
    <FieldsDrawer
      drawerSlug={drawerSlug}
      drawerTitle={editingNodeKey ? 'Edit Footnote' : 'Add Footnote'}
      featureKey="footnote"
      handleDrawerSubmit={handleDrawerSubmit}
      schemaPath={schemaPath}
      schemaPathSuffix="fields"
      data={initialContent ? { content: initialContent } : undefined}
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
