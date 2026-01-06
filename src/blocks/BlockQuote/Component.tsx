import type { BlockQuoteBlock as BlockQuoteBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BlockQuoteBlockProps

export const BlockQuoteBlock: React.FC<Props> = ({ className, quote, citation }) => {
  return (
    <figure className={cn('mx-auto my-8 w-full', className)}>
      <blockquote className="border-l-4 border-primary/60 pl-6 py-2 italic">
        <RichText data={quote} enableGutter={false} enableProse={false} />
      </blockquote>
      {citation && (
        <figcaption className="mt-3 pl-6 text-sm text-muted-foreground">— {citation}</figcaption>
      )}
    </figure>
  )
}
