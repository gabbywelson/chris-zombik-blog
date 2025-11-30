'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { ShortStory } from '@/payload-types'

import { formatDateTime } from '@/utilities/formatDateTime'

export type StoryCardData = Pick<ShortStory, 'slug' | 'title' | 'summary' | 'publishedAt'>

export const StoryCard: React.FC<{
  className?: string
  doc?: StoryCardData
  showDate?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, showDate = true } = props

  const { slug, title, summary, publishedAt } = doc || {}

  const href = `/short-stories/${slug}`

  return (
    <article
      className={cn(
        'group border-b border-border pb-8 hover:border-foreground/30 transition-colors cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {showDate && publishedAt && (
        <time className="text-sm text-muted-foreground block mb-2">
          {formatDateTime(publishedAt)}
        </time>
      )}

      {title && (
        <h3 className="font-serif text-xl md:text-2xl font-medium mb-3 group-hover:text-primary/80 transition-colors">
          <Link href={href} ref={link.ref} className="hover:no-underline">
            {title}
          </Link>
        </h3>
      )}

      {summary && (
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{summary}</p>
      )}

      <span className="inline-block mt-4 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
        Read story →
      </span>
    </article>
  )
}

