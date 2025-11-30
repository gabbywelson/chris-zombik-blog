'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const AuthorHero: React.FC<Page['hero']> = ({ links, authorImage, authorBio }) => {
  return (
    <div className="container py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Author Image */}
        <div className="relative order-2 md:order-1">
          {authorImage && typeof authorImage === 'object' && (
            <div className="relative aspect-[4/5] max-w-md mx-auto md:mx-0 overflow-hidden rounded-sm">
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={authorImage}
              />
            </div>
          )}
        </div>

        {/* Author Bio */}
        <div className="order-1 md:order-2">
          {authorBio && (
            <RichText
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:text-lg prose-p:leading-relaxed"
              data={authorBio}
              enableGutter={false}
            />
          )}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 mt-8">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

