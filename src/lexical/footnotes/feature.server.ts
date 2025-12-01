import { createServerFeature } from '@payloadcms/richtext-lexical'

import { FootnoteNode } from './FootnoteNode'

export const FootnoteFeature = createServerFeature({
  feature: {
    ClientFeature: '@/lexical/footnotes/feature.client#FootnoteFeatureClient',
    nodes: [
      {
        node: FootnoteNode,
      },
    ],
    generateSchemaMap: () => {
      const schemaMap = new Map()
      schemaMap.set('fields', {
        fields: [
          {
            name: 'content',
            type: 'textarea',
            label: 'Footnote Content',
            required: true,
          },
        ],
      })
      return schemaMap
    },
  },
  key: 'footnote',
})
