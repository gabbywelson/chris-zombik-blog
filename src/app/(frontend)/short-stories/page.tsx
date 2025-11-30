import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import { formatDateTime } from '@/utilities/formatDateTime'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const stories = await payload.find({
    collection: 'short-stories',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return (
    <div className="pt-16 md:pt-24 pb-24">
      <PageClient />

      {/* Page Header */}
      <div className="container mb-16">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">Short Stories</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A collection of short fiction exploring themes of fantasy, wonder, and the human condition.
          </p>
        </div>
      </div>

      {/* Page Range */}
      <div className="container mb-8">
        <PageRange
          collection="short-stories"
          currentPage={stories.page}
          limit={12}
          totalDocs={stories.totalDocs}
        />
      </div>

      {/* Stories List */}
      <div className="container">
        <div className="max-w-4xl">
          {stories.docs.map((story, index) => (
            <article
              key={story.id}
              className={`py-8 ${index !== stories.docs.length - 1 ? 'border-b border-border' : ''}`}
            >
              <Link href={`/short-stories/${story.slug}`} className="group block">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                  {story.publishedAt && (
                    <time className="text-sm text-muted-foreground shrink-0 mb-2 md:mb-0 md:w-32">
                      {formatDateTime(story.publishedAt)}
                    </time>
                  )}
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl md:text-3xl font-medium mb-3 group-hover:text-primary/80 transition-colors">
                      {story.title}
                    </h2>
                    {story.summary && (
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {story.summary}
                      </p>
                    )}
                    <span className="inline-block mt-4 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                      Read story →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mt-12">
        {stories.totalPages > 1 && stories.page && (
          <Pagination page={stories.page} totalPages={stories.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Short Stories',
    description: 'A collection of short fiction exploring themes of fantasy, wonder, and the human condition.',
  }
}

