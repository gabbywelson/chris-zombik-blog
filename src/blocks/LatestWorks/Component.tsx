import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { LatestWorksBlock as LatestWorksBlockType } from '@/payload-types'

import { StoryCard } from '@/components/StoryCard'

const getCachedStories = unstable_cache(
  async (limit: number) => {
    const payload = await getPayload({ config: configPromise })
    return payload.find({
      collection: 'short-stories',
      depth: 1,
      limit,
      overrideAccess: false,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
  },
  ['latest-works'],
  { tags: ['short-stories'], revalidate: 3600 }
)

export const LatestWorksBlock: React.FC<LatestWorksBlockType> = async ({
  heading,
  description,
  count = 3,
}) => {
  const stories = await getCachedStories(count || 3)

  if (!stories.docs || stories.docs.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {heading && (
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">{heading}</h2>
          )}
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{description}</p>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.docs.map((story) => (
            <StoryCard key={story.id} doc={story} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/short-stories"
            className="inline-flex items-center gap-2 text-lg font-serif hover:underline underline-offset-4"
          >
            View all stories
          </Link>
        </div>
      </div>
    </section>
  )
}

