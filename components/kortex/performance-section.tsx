'use client'

import { useState, useRef, useEffect } from 'react'
import { SimulatedPerformanceChart } from './simulated-performance-chart'
import { EssayPerformanceChart } from './essay-performance-chart'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PerformanceSectionProps {
  simulations: any[]
  essays: any[]
}

export function PerformanceSection({ simulations, essays }: PerformanceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded && sectionRef.current) {
      // Small timeout to allow layout transition to start
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [isExpanded])

  return (
    <div ref={sectionRef} className="flex flex-col gap-4 scroll-mt-24">
      {/* Section Header with Synchronized Trigger */}
      <div className="flex items-center justify-center relative h-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-950 border transition-all duration-300
              ${isExpanded 
                ? 'border-emerald-600 dark:border-cyber-green text-emerald-600 dark:text-cyber-green shadow-sm dark:shadow-[0_0_10px_rgba(0,255,136,0.1)]' 
                : 'border-gray-300 dark:border-zinc-800 text-slate-500 dark:text-zinc-500 hover:border-gray-400 dark:hover:border-zinc-700 hover:text-slate-700 dark:hover:text-zinc-300'
              }
            `}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">
              {isExpanded ? 'Ocultar Métricas' : 'Ver Métricas'}
            </span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SimulatedPerformanceChart simulations={simulations} isExpanded={isExpanded} />
        <EssayPerformanceChart essays={essays} isExpanded={isExpanded} />
      </div>
    </div>
  )
}
