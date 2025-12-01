import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { ShortStory } from '../../../payload-types'

export const revalidateShortStory: CollectionAfterChangeHook<ShortStory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/short-stories/${doc.slug}`

      payload.logger.info(`Revalidating short story at path: ${path}`)

      revalidatePath(path)
      revalidateTag('short-stories-sitemap')
      revalidateTag('short-stories') // Invalidate LatestWorksBlock cache
    }

    // If the story was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/short-stories/${previousDoc.slug}`

      payload.logger.info(`Revalidating old short story at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('short-stories-sitemap')
      revalidateTag('short-stories') // Invalidate LatestWorksBlock cache
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<ShortStory> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/short-stories/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('short-stories-sitemap')
    revalidateTag('short-stories') // Invalidate LatestWorksBlock cache
  }

  return doc
}

