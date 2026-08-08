'use client'

import { useState, useMemo } from 'react'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { formatTime } from '@/lib/format'
import { EssayEntryModal } from '@/components/modals/essay-entry-modal'

interface EssayPerformanceChartProps {
  essays: Array<{
    date: Date
    title: string // e.g., "Redação Enem 2023"
    score: number
    timeInMinutes?: number
    c1: number | null
    c2: number | null
    c3: number | null
    c4: number | null
    c5: number | null
  }>
  isExpanded: boolean
}

// Competency colors
const competencyColors = {
  total: '#a1a1aa',
  c1: '#f43f5e',
  c2: '#ec4899',
  c3: '#d946ef',
  c4: '#8b5cf6',
  c5: '#6366f1',
}

const competencyLabels = {
  total: 'TOTAL',
  c1: 'C1',
  c2: 'C2',
  c3: 'C3',
  c4: 'C4',
  c5: 'C5',
}

const competencyTooltips = {
  c1: 'Norma Culta',
  c2: 'Tema e Estrutura',
  c3: 'Argumentação',
  c4: 'Coesão',
  c5: 'Proposta de Intervenção'
}

export function EssayPerformanceChart({ essays, isExpanded }: EssayPerformanceChartProps) {
  const { theme } = useTheme()
  const [metric, setMetric] = useState<'score' | 'time'>('score')
  const [visibleLines, setVisibleLines] = useState({
    total: true,
    c1: true,
    c2: true,
    c3: true,
    c4: true,
    c5: true,
  })

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }))
  }

  const chartData = essays.map(essay => {
    // Calculate score from competencies if explicit score is missing
    const calculatedScore = (essay.c1 || 0) + (essay.c2 || 0) + (essay.c3 || 0) + (essay.c4 || 0) + (essay.c5 || 0)
    const finalScore = essay.score || calculatedScore
    
    return {
      date: format(new Date(essay.date), 'dd/MM', { locale: ptBR }),
      total: metric === 'score' ? Number(finalScore) : Number(essay.timeInMinutes || 0),
      c1: metric === 'score' ? essay.c1 : null,
      c2: metric === 'score' ? essay.c2 : null,
      c3: metric === 'score' ? essay.c3 : null,
      c4: metric === 'score' ? essay.c4 : null,
      c5: metric === 'score' ? essay.c5 : null,
      title: essay.title,
      rawScore: Number(finalScore),
      rawTime: Number(essay.timeInMinutes || 0)
    }
  })

  const latestEssay = essays.length > 0 ? essays[essays.length - 1] : null
  const TARGET_SCORE = 920 // High performance target

  // Rolling Average (Last 4)
  const calculateRollingAverage = () => {
    const lastFour = essays.slice(-4)
    if (lastFour.length === 0) return null
    
    const validEssays = lastFour.filter(e => 
      e.c1 !== null && e.c2 !== null && e.c3 !== null && e.c4 !== null && e.c5 !== null
    )
    
    if (validEssays.length === 0) return null
    
    const avgC1 = Math.round(validEssays.reduce((sum, e) => sum + Number(e.c1 || 0), 0) / validEssays.length)
    const avgC2 = Math.round(validEssays.reduce((sum, e) => sum + Number(e.c2 || 0), 0) / validEssays.length)
    const avgC3 = Math.round(validEssays.reduce((sum, e) => sum + Number(e.c3 || 0), 0) / validEssays.length)
    const avgC4 = Math.round(validEssays.reduce((sum, e) => sum + Number(e.c4 || 0), 0) / validEssays.length)
    const avgC5 = Math.round(validEssays.reduce((sum, e) => sum + Number(e.c5 || 0), 0) / validEssays.length)
    const avgTotal = avgC1 + avgC2 + avgC3 + avgC4 + avgC5
    
    return {
      total: avgTotal,
      c1: avgC1,
      c2: avgC2,
      c3: avgC3,
      c4: avgC4,
      c5: avgC5,
      time: Math.round(validEssays.reduce((sum, e) => sum + (e.timeInMinutes || 0), 0) / validEssays.length),
      count: validEssays.length
    }
  }

  const rollingAvg = calculateRollingAverage()
  const distanceToGoal = rollingAvg ? rollingAvg.total - TARGET_SCORE : 0
  const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null

  const calculateConsistency = () => {
    if (!rollingAvg || !latestData) return 0
    const diff = Math.abs(latestData.rawScore - rollingAvg.total)
    const rate = Math.round((1 - (diff / 1000)) * 100)
    return isNaN(rate) ? 0 : Math.max(0, rate)
  }
  
  const consistencyRate = calculateConsistency()
  
  // Trend
  const lastScore = latestData?.rawScore || 0
  const avgScore = rollingAvg?.total || 0
  const trend = lastScore > avgScore ? 'up' : lastScore < avgScore ? 'down' : 'neutral'

  // Scatter Data (Time vs Score)
  const scatterData = essays.map(essay => {
    const calculatedScore = (essay.c1 || 0) + (essay.c2 || 0) + (essay.c3 || 0) + (essay.c4 || 0) + (essay.c5 || 0)
    const finalScore = essay.score || calculatedScore
    return {
      x: Number(essay.timeInMinutes || 0),
      y: Number(finalScore),
      title: essay.title,
      date: format(new Date(essay.date), 'dd/MM', { locale: ptBR }),
    }
  }).filter(item => item.x > 0)

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataIndex = chartData.findIndex(item => item.date === label)
      const title = payload[0].payload.title || 'Redação Semanal'
      const data = payload[0].payload
      
      const borderColor = metric === 'score' 
        ? (theme === 'dark' ? '#00ff88' : '#10b981')
        : (theme === 'dark' ? '#22d3ee' : '#0891b2')

      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border border-zinc-200 dark:border-zinc-800 p-3 shadow-lg backdrop-blur-sm min-w-[200px]">
           <div className="mb-2 border-b border-gray-200 dark:border-zinc-800/50 pb-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-900 dark:text-white max-w-[180px] truncate" style={{ color: borderColor }}>
               {title}
            </p>
            <p className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5">{label}</p>
          </div>
          
          {metric === 'score' ? (
              <div className="space-y-1">
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="uppercase font-bold tracking-wider text-emerald-500">TOTAL</span>
                   <span className="font-bold text-emerald-500">{payload[0].value}</span>
                 </div>
                 {[1,2,3,4,5].map(n => {
                    const val = payload[0].payload[`c${n}`]
                    if (val === null) return null
                    return (
                      <div key={n} className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                        <span>C{n}</span>
                        <span>{val}</span>
                      </div>
                    )
                 })}
              </div>
           ) : (
             <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="uppercase font-bold tracking-wider text-cyan-500">TEMPO</span>
                <span className="font-bold text-cyan-500">{formatTime(payload[0].value)}</span>
             </div>
           )}
        </div>
      )
    }
    return null
  }

   // Custom Tooltip for Radar Chart
   const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border border-purple-500 p-2 shadow-lg dark:shadow-[0_0_15px_rgba(139,92,246,0.15)] backdrop-blur-sm min-w-[120px]">
          <p className="text-[10px] uppercase tracking-widest text-purple-500 font-bold text-center mb-1">
             {data.subject}
          </p>
          <p className="text-[8px] text-center text-zinc-500 mb-2">{competencyTooltips[data.subject.toLowerCase() as keyof typeof competencyTooltips]}</p>
           <div className="flex justify-center items-baseline gap-1">
             <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{data.A}</span>
             <span className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono">/200</span>
           </div>
        </div>
      )
    }
    return null
  }

  // Custom Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border border-cyan-500 p-2 shadow-lg dark:shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-sm min-w-[150px]">
          <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-1">
             {data.title}
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
             <div>
               <p className="text-zinc-500">Tempo</p>
               <p className="font-bold text-slate-700 dark:text-zinc-200">{formatTime(data.x)}</p>
             </div>
             <div>
               <p className="text-zinc-500">Nota</p>
               <p className="font-bold text-emerald-500">{data.y}</p>
             </div>
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 border-t border-dashed border-zinc-700 pt-1 text-right">{data.date}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col transition-all duration-300 ease-in-out shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-600 dark:text-cyber-green mb-1">
            Desempenho Redações
          </h3>
          
          {/* Data Entry Modal */}
          <EssayEntryModal />
        </div>
        
        {/* Metric Toggle */}
        <div className="flex items-center gap-1 border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0.5 rounded">
          <button
            onClick={() => setMetric('score')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all duration-150 rounded-sm ${
              metric === 'score'
                ? 'bg-emerald-600 dark:bg-cyber-green text-white dark:text-black'
                : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            PONTOS
          </button>
          <button
            onClick={() => setMetric('time')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all duration-150 rounded-sm ${
              metric === 'time'
                ? 'bg-cyan-600 dark:bg-cyan-400 text-white dark:text-black'
                : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            TEMPO
          </button>
        </div>
      </div>

      {/* Primary Chart: Total Score Trend - Always Visible */}
      <div className="mb-0">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e5e7eb'} vertical={false} />
            <XAxis dataKey="date" stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9 }} tickLine={false} axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} />
            <YAxis 
              domain={metric === 'score' ? [0, 1000] : [0, 90]} 
              stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} 
              tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
              tickLine={false} 
              axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} 
              ticks={metric === 'score' ? [0, 200, 400, 600, 800, 1000] : [0, 30, 60, 90]}
              tickFormatter={metric === 'time' ? (value) => formatTime(value) : undefined}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke={metric === 'score' ? (theme === 'dark' ? '#00ff41' : '#10b981') : '#06b6d4'}
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6, fill: metric === 'score' ? (theme === 'dark' ? '#00ff41' : '#10b981') : '#06b6d4', stroke: theme === 'dark' ? '#09090b' : '#ffffff', strokeWidth: 2 }} 
              name={metric === 'score' ? 'TOTAL' : 'TEMPO'} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

       {/* EXPANDABLE SECTION */}
       {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 mt-4">
           <div className="my-3 h-px bg-gray-200 dark:bg-zinc-800" />
           
           {/* SECONDARY CHART */}
           <div className="mb-4">
               {/* SCORE MODE: Competency Breakdown */}
               {metric === 'score' && (
                 <>
                   <div className="flex items-center justify-between mb-4 h-6">
                     <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                       Competências
                     </h3>
                     <div className="flex gap-1">
                          {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((comp) => (
                            <button
                              key={comp}
                              onClick={() => toggleLine(comp)}
                              className={`
                                flex items-center gap-1 px-1.5 py-0.5 border text-[8px] uppercase tracking-wider font-bold transition-all
                                ${visibleLines[comp] ? 'bg-opacity-10' : 'border-gray-300 dark:border-zinc-800 text-slate-500 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-900'}
                              `}
                              style={{
                                borderColor: visibleLines[comp] ? competencyColors[comp] : undefined,
                                color: visibleLines[comp] ? competencyColors[comp] : undefined,
                                backgroundColor: visibleLines[comp] ? `${competencyColors[comp]}15` : undefined,
                              }}
                            >
                              {visibleLines[comp] ? <Eye className="h-2 w-2" /> : <EyeOff className="h-2 w-2" />}
                              {comp.toUpperCase()}
                            </button>
                          ))}
                     </div>
                   </div>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e5e7eb'} vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke={theme === 'dark' ? '#71717a' : '#94a3b8'} 
                            tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                            tickLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} 
                            axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} 
                          />
                          <YAxis domain={[0, 200]} stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} ticks={[0, 40, 80, 120, 160, 200]} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          
                          {visibleLines.c1 && <Line type="monotone" dataKey="c1" stroke={competencyColors.c1} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="C1" />}
                          {visibleLines.c2 && <Line type="monotone" dataKey="c2" stroke={competencyColors.c2} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="C2" />}
                          {visibleLines.c3 && <Line type="monotone" dataKey="c3" stroke={competencyColors.c3} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="C3" />}
                          {visibleLines.c4 && <Line type="monotone" dataKey="c4" stroke={competencyColors.c4} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="C4" />}
                          {visibleLines.c5 && <Line type="monotone" dataKey="c5" stroke={competencyColors.c5} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="C5" />}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 </>
               )}

               {/* TIME MODE: Scatter Chart (Time x Score) */}
               {metric === 'time' && (
                 <>
                   <div className="flex items-center justify-between mb-4 h-6">
                     <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                       Correlação: Tempo/Nota
                     </h3>
                   </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e5e7eb'} />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Tempo" 
                            unit="m" 
                            domain={['dataMin - 10', 'dataMax + 10']} 
                            stroke={theme === 'dark' ? '#71717a' : '#94a3b8'}
                            tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                            tickLine={false}
                            axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Nota" 
                            domain={[0, 1000]} 
                            stroke={theme === 'dark' ? '#52525b' : '#94a3b8'}
                            tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                            tickLine={false}
                            axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }}
                          />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
                          <Scatter name="Redações" data={scatterData} fill="#06b6d4" shape="circle" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                 </>
               )}
           </div>

           {/* Stats Summary - HUD Layout */}
           <div className="border-t border-zinc-800/50 pt-4 mt-2">
             {rollingAvg && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Module 1: KPIs */}
                  <div className="relative p-4 lg:border-r border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                        {metric === 'score' ? `MÉDIA (ÚLT. ${rollingAvg.count})` : 'TEMPO MÉDIO'}
                      </p>
                      {trend !== 'neutral' && metric === 'score' && (
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${trend === 'up' ? 'bg-cyber-green/10 text-cyber-green' : 'bg-cyber-red/10 text-cyber-red'}`}>
                          {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        </div>
                      )}
                    </div>
                    
                    {metric === 'score' ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-mono text-4xl font-black text-cyber-green tracking-tighter" style={{ textShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>{rollingAvg.total}</span>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Pontos</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Distância</p>
                            <p className={`font-mono text-lg font-bold ${distanceToGoal >= 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                              {distanceToGoal >= 0 ? '+' : ''}{distanceToGoal}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Consistência</p>
                            <p className="font-mono text-lg font-bold text-cyber-cyan">
                              {consistencyRate}%
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                         <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-mono text-3xl font-black text-cyan-400 tracking-tighter" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
                            {formatTime(rollingAvg.time)}
                          </span>
                        </div>
                         <div className="mt-2 text-[10px] text-zinc-500">
                           Tempo ideal: <span className="text-zinc-300 font-bold">1h 00m</span>
                         </div>
                      </>
                    )}
                  </div>

                  {/* Module 2: Radar Hologram (Score) or Simple Info (Time) */}
                  <div className="relative p-4 flex flex-col items-center justify-center lg:border-r border-white/5">
                     <div className="absolute top-0 left-0 w-full text-center">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
                          {metric === 'score' ? 'Perfil de Competências' : 'Análise Temporal'}
                        </p>
                     </div>
                     <div className="w-full h-full relative flex items-center justify-center pt-4">
                       {metric === 'score' ? (
                         <ResponsiveContainer width="100%" height={120}>
                           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                             { subject: 'C1', A: rollingAvg.c1, fullMark: 200 },
                             { subject: 'C2', A: rollingAvg.c2, fullMark: 200 },
                             { subject: 'C3', A: rollingAvg.c3, fullMark: 200 },
                             { subject: 'C4', A: rollingAvg.c4, fullMark: 200 },
                             { subject: 'C5', A: rollingAvg.c5, fullMark: 200 },
                           ]}>
                             <PolarGrid stroke="#333" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 9, fontWeight: 'bold' }} />
                             <PolarRadiusAxis 
                               angle={30} 
                               domain={[0, 200]} 
                               tick={false} 
                               axisLine={false} 
                             />
                             <Radar 
                               name="Média" 
                               dataKey="A" 
                               stroke="#8b5cf6" 
                               strokeWidth={2} 
                               fill="#8b5cf6" 
                               fillOpacity={0.3} 
                             />
                             <Tooltip content={<CustomRadarTooltip />} cursor={false} />
                           </RadarChart>
                         </ResponsiveContainer>
                       ) : (
                         <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 flex items-center justify-center mb-2">
                               <span className="font-mono text-cyan-400 font-bold">{Math.round((rollingAvg.total / 1000) * 100)}%</span>
                            </div>
                            <p className="text-[9px] text-zinc-500">Índice de Eficiência</p>
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Module 3: System Alert */}
                  <div className="relative p-4 flex flex-col justify-center">
                     {metric === 'score' ? (() => {
                       const scores = [
                         { area: 'C1', fullName: 'Norma Culta', score: rollingAvg.c1 },
                         { area: 'C2', fullName: 'Tema/Estrutura', score: rollingAvg.c2 },
                         { area: 'C3', fullName: 'Argumentação', score: rollingAvg.c3 },
                         { area: 'C4', fullName: 'Coesão', score: rollingAvg.c4 },
                         { area: 'C5', fullName: 'Proposta', score: rollingAvg.c5 },
                       ]
                       const weakest = scores.reduce((min, curr) => curr.score < min.score ? curr : min)
                       
                       return (
                         <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                             <p className="text-[9px] uppercase tracking-widest text-amber-500 font-bold animate-pulse">Requer Atenção</p>
                           </div>
                           <p className="font-mono text-lg text-amber-500 mb-1 font-bold tracking-tight">FOCO: {weakest.area}</p>
                           <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Média <span className="text-zinc-300 font-bold">{weakest.score}/200</span> em {weakest.fullName}.</p>
                           <div className="mt-2 pt-2 border-t border-dashed border-zinc-800/50">
                             <p className="text-[8px] uppercase tracking-widest text-zinc-600">Recomendação</p>
                             <p className="text-[10px] mt-0.5 font-bold text-cyber-cyan">+ Revisar Competência {weakest.area}</p>
                           </div>
                         </div>
                       )
                     })() : (
                         <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                             <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">STATUS OK</p>
                           </div>
                           <p className="font-mono text-lg text-emerald-500 mb-1 font-bold tracking-tight">BOM RITMO</p>
                           <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Ritmo de escrita consistente e dentro da meta.</p>
                         </div>
                     )}
                  </div>
                </div>
             )}
           </div>
        </div>
       )}
    </div>
  )
}
