import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  BookOpen,
  ShoppingBag,
} from 'lucide-react'

// Platform icon mapping
const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  website: Globe,
  goodreads: BookOpen,
  amazon: ShoppingBag,
  bluesky: Globe,
  threads: Globe,
}

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center gap-8">
          {/* Author Name */}
          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl font-medium tracking-wide hover:opacity-80 transition-opacity"
          >
            Chris Zombik
          </Link>

          {/* Navigation Links */}
          {navItems.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    key={i}
                    {...link}
                  />
                )
              })}
            </nav>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.platform ? platformIcons[social.platform] : Globe
                return (
                  <a
                    key={i}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    aria-label={social.platform || 'Social link'}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </a>
                )
              })}
            </div>
          )}

          {/* Theme Selector & Copyright */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/50 w-full max-w-md">
            <ThemeSelector />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
