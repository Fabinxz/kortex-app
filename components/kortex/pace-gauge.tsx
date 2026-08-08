'use client'

import { useTheme } from 'next-themes'

interface PaceGaugeProps {
  pace: number // Minutes per question
}

export function PaceGauge({ pace }: PaceGaugeProps) {
  const { theme } = useTheme()

  // Gauge Configuration
  const width = 200
  const height = 100 // Half circle
  const cx = 100
  const cy = 90 // Slightly higher than 100 to leave room for labels
  const r = 80
  const strokeWidth = 12

  // Scale: 0 to 6 minutes
  const minVal = 0
  const maxVal = 6
  
  // Calculate angle for needle (-90 to 90 degrees)
  const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
  const normalizedPace = clamp(pace, minVal, maxVal)
  const angle = ((normalizedPace - minVal) / (maxVal - minVal)) * 180 - 90

  // Status Text
  let statusText = 'NORMAL'
  let statusColor = '#a1a1aa'
  
  if (pace < 2.5) {
    statusText = 'RÁPIDO'
    statusColor = '#06b6d4' // Cyan
  } else if (pace <= 3.2) {
    statusText = 'IDEAL'
    statusColor = '#10b981' // Green
  } else {
    statusText = 'LENTO'
    statusColor = '#ef4444' // Red
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full max-h-32">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height + 15}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible max-h-[100px]">
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan start */}
            <stop offset="40%" stopColor="#06b6d4" /> {/* Cyan end (~2.4m) */}
            <stop offset="45%" stopColor="#10b981" /> {/* Green start (~2.7m) */}
            <stop offset="55%" stopColor="#10b981" /> {/* Green end (~3.3m) */}
            <stop offset="60%" stopColor="#ef4444" /> {/* Red start */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Red end */}
          </linearGradient>
        </defs>

        {/* Background Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={theme === 'dark' ? '#27272a' : '#e5e7eb'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Track with Gradient */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeOpacity={0.8}
        />

        {/* Needle */}
        <g 
          className="transition-all duration-1000 ease-out" 
          style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${cx}px ${cy}px` }}
        >
           {/* Pivot */}
           <circle cx={cx} cy={cy} r="4" fill={theme === 'dark' ? '#fff' : '#000'} />
           {/* Pointer */}
           <path d={`M ${cx} ${cy - 8} L ${cx - 3} ${cy} L ${cx + 3} ${cy} Z`} fill={theme === 'dark' ? '#fff' : '#000'} transform={`translate(0, -${r - 15})`} />
           <line x1={cx} y1={cy} x2={cx} y2={cy - r + 5} stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5" />
        </g>
        
        {/* Labels on Arc */}
        <text x={cx - r} y={cy + 12} textAnchor="middle" fontSize="8" fill="#71717a" fontWeight="bold">0m</text>
        <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="8" fill="#71717a" fontWeight="bold">3m</text>
        <text x={cx + r} y={cy + 12} textAnchor="middle" fontSize="8" fill="#71717a" fontWeight="bold">6m</text>

        {/* Target Marker (3.0m) */}
        <line x1={cx} y1={cy - r - 4} x2={cx} y2={cy - r + 4} stroke="#10b981" strokeWidth="1.5" />

      </svg>

      {/* Center Value - Positioned absolutely to overlay the bottom of SVG */}
      <div className="absolute bottom-0 flex flex-col items-center translate-y-2">
        <span className="text-2xl font-black font-mono tracking-tighter transition-colors duration-300" style={{ color: statusColor, textShadow: `0 0 15px ${statusColor}40` }}>
          {pace.toFixed(1)} <span className="text-xs text-zinc-500 font-bold">m</span>
        </span>
        <div className="flex gap-1 items-center mt-[-2px]">
           <span className="text-[7px] uppercase tracking-widest text-zinc-500 font-bold">Min/Q</span>
           <span className="text-[7px] uppercase tracking-widest font-bold px-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" style={{ color: statusColor }}>
             {statusText}
           </span>
        </div>
      </div>
    </div>
  )
}
