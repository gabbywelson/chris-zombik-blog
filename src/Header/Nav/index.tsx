'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/utilities/ui'

interface HeaderNavProps {
  data: HeaderType
  isOverHero?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, isOverHero }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-6 md:gap-8 items-center text-sm md:text-base">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={cn(
              'transition-colors tracking-wide',
              isOverHero
                ? 'text-white/80 hover:text-white'
                : 'text-foreground/80 hover:text-foreground',
            )}
          />
        )
      })}
      <Link
        href="/search"
        className={cn(
          'transition-colors',
          isOverHero
            ? 'text-white/70 hover:text-white'
            : 'text-foreground/70 hover:text-foreground',
        )}
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4 md:w-5 md:h-5" />
      </Link>
      <ThemeToggle isOverHero={isOverHero} />
    </nav>
  )
}
