'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DateRange } from '@/lib/queries'

const timeRanges = [
  { label: 'HOJE', value: 'today' as DateRange },
  { label: 'SEMANA', value: 'week' as DateRange },
  { label: 'MÊS', value: 'month' as DateRange },
  { label: 'ANO', value: 'year' as DateRange },
]

export function TimeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRange = (searchParams.get('range') as DateRange) || 'month'

  const handleRangeChange = (range: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('range', range)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-none border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleRangeChange(range.value)}
          className={`
            px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest
            transition-all duration-150
            ${
              currentRange === range.value
                ? 'bg-emerald-600 dark:bg-cyber-green text-white dark:text-black'
                : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
