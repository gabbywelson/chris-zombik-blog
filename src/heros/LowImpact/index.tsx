import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      links?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
      links?: Page['hero']['links']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, links }) => {
  return (
    <div className="container mt-16 md:mt-24">
      <div className="max-w-3xl">
        {children || (
          richText && (
            <RichText
              className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:font-medium prose-p:text-lg prose-p:leading-relaxed"
              data={richText}
              enableGutter={false}
            />
          )
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex flex-wrap gap-4 mt-8">
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
  )
}
