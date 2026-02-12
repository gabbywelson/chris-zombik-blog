import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FootnoteReference: Block = {
  slug: 'footnoteReference',
  interfaceName: 'FootnoteReferenceBlock',
  labels: {
    singular: 'Footnote Reference',
    plural: 'Footnote References',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Footnote Content',
      required: true,
      admin: {
        description: 'This text appears in the footnotes section at the bottom of the post.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
}
