'use client'

import { $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { toolbarFeatureButtonsGroupWithItems } from '@payloadcms/richtext-lexical/client'

import { ClientFootnoteNode } from './ClientFootnoteNode'
import { FootnotePlugin, INSERT_FOOTNOTE_COMMAND } from './FootnotePlugin'

// Simple footnote icon as an inline SVG component
const FootnoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <text x="4" y="16" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">
      1
    </text>
    <text x="14" y="10" fontSize="8" stroke="none" fill="currentColor">
      *
    </text>
  </svg>
)

const toolbarGroups = [
  toolbarFeatureButtonsGroupWithItems([
    {
      ChildComponent: FootnoteIcon,
      isActive: () => false,
      isEnabled: ({ selection }) => {
        // Enable when there's a cursor position (even without selection)
        return $isRangeSelection(selection)
      },
      key: 'footnote',
      label: () => 'Add Footnote',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INSERT_FOOTNOTE_COMMAND, undefined)
      },
      order: 10,
    },
  ]),
]

const slashMenuGroups = [
  slashMenuBasicGroupWithItems([
    {
      Icon: FootnoteIcon,
      key: 'footnote',
      keywords: ['footnote', 'note', 'reference', 'citation'],
      label: 'Footnote',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INSERT_FOOTNOTE_COMMAND, undefined)
      },
    },
  ]),
]

export const FootnoteFeatureClient = createClientFeature({
  nodes: [ClientFootnoteNode],
  plugins: [
    {
      Component: FootnotePlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: slashMenuGroups,
  },
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
