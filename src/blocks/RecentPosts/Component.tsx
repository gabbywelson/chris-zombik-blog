import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { RecentPostsBlock as RecentPostsBlockType } from '@/payload-types'

import { Card } from '@/components/Card'

const getCachedPosts = unstable_cache(
  async (limit: number) => {
    const payload = await getPayload({ config: configPromise })
    return payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        heroImage: true,
        meta: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
  },
  ['recent-posts'],
  { tags: ['posts'], revalidate: 3600 },
)

export const RecentPostsBlock: React.FC<RecentPostsBlockType> = async ({
  heading,
  description,
  count = 3,
}) => {
  const posts = await getCachedPosts(count || 3)

  if (!posts.docs || posts.docs.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-card/50">
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.docs.map((post) => (
            <Card key={post.id} doc={post} relationTo="posts" showCategories />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-lg font-serif hover:underline underline-offset-4"
          >
            View all posts
          </Link>
        </div>
      </div>
    </section>
  )
}
