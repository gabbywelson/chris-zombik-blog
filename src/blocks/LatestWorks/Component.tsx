import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { LatestWorksBlock as LatestWorksBlockType } from '@/payload-types'

import { StoryCard } from '@/components/StoryCard'

export const LatestWorksBlock: React.FC<LatestWorksBlockType> = async ({
  heading,
  description,
  count = 3,
}) => {
  const payload = await getPayload({ config: configPromise })

  const stories = await payload.find({
    collection: 'short-stories',
    depth: 1,
    limit: count || 3,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

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

