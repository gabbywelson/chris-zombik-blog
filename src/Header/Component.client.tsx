'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="container relative z-20 border-b border-border/50"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="py-6 md:py-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
        {/* Author Name / Logo */}
        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl font-medium tracking-wide hover:opacity-80 transition-opacity"
        >
          Chris Zombik
        </Link>

        {/* Navigation */}
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
