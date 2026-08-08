'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" /> // Placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-1.5 hover:opacity-70 transition-opacity active:scale-95"
      aria-label="Alternar tema"
    >
      {/* Sun Icon - Visible in Light Mode */}
      <Sun 
        className={cn(
          "h-5 w-5 transition-all duration-200",
          "text-slate-700",
          theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
      />
      
      {/* Moon Icon - Visible in Dark Mode */}
      <Moon 
        className={cn(
          "absolute top-1.5 left-1.5 h-5 w-5 transition-all duration-200",
          "text-cyber-green",
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        )}
      />
    </button>
  )
}
