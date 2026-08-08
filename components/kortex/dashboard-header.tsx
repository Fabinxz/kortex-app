'use client'

import { useState, useEffect } from 'react'
import { TimeFilter } from './time-filter'
import { ThemeToggle } from './theme-toggle'
import { Terminal } from 'lucide-react'

interface DashboardHeaderProps {
  onOpenModal?: () => void
}

export function DashboardHeader({ onOpenModal }: DashboardHeaderProps) {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }))
      setCurrentTime(now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-emerald-600 dark:text-cyber-green" />
          <h1 className="text-lg font-black uppercase tracking-wider text-emerald-600 dark:text-cyber-green dark:glow-green">
            KORTEX
          </h1>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-600">
            // SISTEMA DE PERFORMANCE COGNITIVA
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600 dark:text-zinc-500">
            <span className="uppercase" suppressHydrationWarning>{currentDate}</span>
            <span className="text-emerald-600 dark:text-cyber-green" suppressHydrationWarning>{currentTime}</span>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="border border-emerald-600 dark:border-cyber-green text-emerald-600 dark:text-cyber-green px-4 py-1.5 text-[9px] uppercase tracking-wider font-bold hover:bg-emerald-50 dark:hover:bg-cyber-green/10 transition-all flex items-center gap-2 shadow-sm dark:shadow-none"
            >
              <span>+</span> REGISTRO
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
         <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Filtro Temporal:
          </span>
          <TimeFilter />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-cyber-green animate-pulse" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-600">
            SISTEMAS ONLINE
          </span>
        </div>
      </div>
    </header>
  )
}
