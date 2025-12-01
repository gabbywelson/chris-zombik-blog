import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { ShortStory } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { formatDateTime } from '@/utilities/formatDateTime'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const stories = await payload.find({
    collection: 'short-stories',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = stories.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ShortStoryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/short-stories/' + decodedSlug
  const story = await queryStoryBySlug({ slug: decodedSlug })

  if (!story) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 md:pt-24 pb-24">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Story Header */}
      <header className="container mb-12 md:mb-16">
        <div className="max-w-2xl mx-auto text-center">
          {story.publishedAt && (
            <time className="text-sm text-muted-foreground block mb-4">
              {formatDateTime(story.publishedAt)}
            </time>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
            {story.title}
          </h1>
          {story.summary && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
              {story.summary}
            </p>
          )}
        </div>
      </header>

      {/* Decorative Divider */}
      <div className="container mb-12">
        <div className="max-w-2xl mx-auto flex justify-center">
          <div className="w-16 h-px bg-border" />
        </div>
      </div>

      {/* Story Content */}
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <RichText
            className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:font-medium prose-p:leading-[1.8] prose-p:text-foreground/90 max-w-none"
            data={story.content}
            enableGutter={false}
          />
        </div>
      </div>

      {/* Back Link */}
      <div className="container mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/short-stories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-serif"
          >
            ← Back to all stories
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const story = await queryStoryBySlug({ slug: decodedSlug })

  return generateMeta({ doc: story })
}

const queryStoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'short-stories',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
