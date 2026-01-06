import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const BlockQuote: Block = {
  slug: 'blockQuote',
  fields: [
    {
      name: 'quote',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'Quote',
      required: true,
    },
    {
      name: 'citation',
      type: 'text',
      label: 'Citation',
      admin: {
        description: 'Optional attribution for the quote (e.g., author name, book title)',
      },
    },
  ],
  interfaceName: 'BlockQuoteBlock',
  labels: {
    singular: 'Block Quote',
    plural: 'Block Quotes',
  },
}
