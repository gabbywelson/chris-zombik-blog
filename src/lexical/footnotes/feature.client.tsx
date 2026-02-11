'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import { ClientFootnoteNode } from './ClientFootnoteNode'

/**
 * Legacy client feature to keep existing `footnote` nodes renderable/editable in old documents.
 * New footnotes should be created via the `footnoteReference` inline block.
 */
export const FootnoteFeatureClient = createClientFeature({
  nodes: [ClientFootnoteNode],
})
