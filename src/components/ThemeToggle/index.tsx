'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/ui'

interface ThemeToggleProps {
  isOverHero?: boolean
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isOverHero }) => {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center p-2 transition-colors',
        isOverHero ? 'text-white/80 hover:text-white' : 'text-foreground/80 hover:text-foreground',
      )}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}
