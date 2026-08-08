'use client'

import { useState, useMemo } from 'react'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { formatTime } from '@/lib/format'
import { PaceGauge } from './pace-gauge'

import { SimuladoEntryModal } from '@/components/modals/simulado-entry-modal'

interface SimulatedPerformanceChartProps {
  simulations: Array<{
    date: Date
    name: string
    score: number
    timeInMinutes?: number
    mathScore: number | null
    natScore: number | null
    humScore: number | null
    linScore: number | null
  }>
  isExpanded: boolean
}

// Subject area colors
const areaColors = {
  geral: '#a1a1aa',
  mat: '#00ff88',
  nat: '#00d8ff',
  hum: '#ffb800',
  lin: '#ff0055',
}

const areaLabels = {
  geral: 'GERAL',
  mat: 'MAT',
  nat: 'NAT',
  hum: 'HUM',
  lin: 'LIN',
}

const areaFullNames = {
  mat: 'Matemática',
  nat: 'Natureza',
  hum: 'Humanas',
  lin: 'Linguagens',
}

export function SimulatedPerformanceChart({ simulations, isExpanded }: SimulatedPerformanceChartProps) {
  const { theme } = useTheme()
  const [metric, setMetric] = useState<'score' | 'time'>('score')
  const [visibleLines, setVisibleLines] = useState({
    geral: true,
    mat: true,
    nat: true,
    hum: true,
    lin: true,
  })

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }))
  }

  const chartData = simulations.map(sim => ({
    date: format(new Date(sim.date), 'dd/MM', { locale: ptBR }),
    geral: metric === 'score' ? Number(sim.score) : Number(sim.timeInMinutes || 0),
    pace: sim.timeInMinutes ? (Number(sim.timeInMinutes) / 90) : 0, // Mock: 90 questions default
    mat: metric === 'score' ? sim.mathScore : null,
    nat: metric === 'score' ? sim.natScore : null,
    hum: metric === 'score' ? sim.humScore : null,
    lin: metric === 'score' ? sim.linScore : null,
    name: sim.name,
    rawScore: Number(sim.score),
    rawTime: Number(sim.timeInMinutes || 0)
  }))
  
  // Custom Tooltip for Radar Chart
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border border-cyan-600 dark:border-[#00d4ff] p-2 shadow-lg dark:shadow-[0_0_15px_rgba(0,212,255,0.15)] backdrop-blur-sm min-w-[120px]">
          <p className="text-[10px] uppercase tracking-widest text-cyan-600 dark:text-[#00d4ff] font-bold text-center mb-1">
             {areaFullNames[data.subject.toLowerCase() as keyof typeof areaFullNames] || data.subject}
          </p>
           <div className="flex justify-center items-baseline gap-1">
             <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{data.A}</span>
             <span className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono">/45</span>
           </div>
        </div>
      )
    }
    return null
  }

  // Calculate analytics
  const latestSim = simulations.length > 0 ? simulations[simulations.length - 1] : null
  const TARGET_SCORE = 160 // Out of 180 (4 areas × 45)

  // Rolling Average Calculation (last 4 exams or available)
  const calculateRollingAverage = () => {
    const lastFour = simulations.slice(-4)
    if (lastFour.length === 0) return null
    
    const validSims = lastFour.filter(sim => 
      sim.mathScore !== null && sim.natScore !== null && 
      sim.humScore !== null && sim.linScore !== null
    )
    
    if (validSims.length === 0) return null
    
    // Safety check for casting
    const safeNumber = (val: any) => {
        const n = Number(val)
        return isNaN(n) ? 0 : n
    }

    const avgMath = Math.round(validSims.reduce((sum, sim) => sum + safeNumber(sim.mathScore), 0) / validSims.length)
    const avgNat = Math.round(validSims.reduce((sum, sim) => sum + safeNumber(sim.natScore), 0) / validSims.length)
    const avgHum = Math.round(validSims.reduce((sum, sim) => sum + safeNumber(sim.humScore), 0) / validSims.length)
    const avgLin = Math.round(validSims.reduce((sum, sim) => sum + safeNumber(sim.linScore), 0) / validSims.length)
    const avgTotal = avgMath + avgNat + avgHum + avgLin
    const avgTime = validSims.reduce((sum, sim) => sum + safeNumber(sim.timeInMinutes), 0) / validSims.length
    
    return {
      total: avgTotal,
      mat: avgMath,
      nat: avgNat,
      hum: avgHum,
      lin: avgLin,
      time: Math.round(avgTime),
      pace: avgTime / 90,
      speed: avgTime > 0 ? 90 / (avgTime / 60) : 0,
      count: validSims.length
    }
  }
  
  const rollingAvg = calculateRollingAverage()
  const distanceToGoal = rollingAvg ? rollingAvg.total - TARGET_SCORE : 0
  const accuracyRate = rollingAvg ? Math.round((rollingAvg.total / 180) * 100) : 0
  
  // Trend indicator (compare last exam vs average)
  const lastScore = latestSim?.score || 0
  const avgScore = rollingAvg?.total || 0
  const trend = lastScore > avgScore ? 'up' : lastScore < avgScore ? 'down' : 'neutral'

  // Mock Exam Name Lookup
  const getMockExamName = (index: number) => {
    const names = [
      'FUVEST 2024 1ª Fase',
      'ENEM 2023 Dia 1',
      'UNICAMP 2024',
      'ENEM 2023 Dia 2',
      'VUNESP 2024',
      'FUVEST 2025 Simulado',
      'Kortex Simulado Avançado'
    ]
    return names[index % names.length]
  }

  // Custom Cyberpunk Tooltip for Line Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataIndex = chartData.findIndex(item => item.date === label) 
      const mockName = getMockExamName(dataIndex >= 0 ? dataIndex : 0)
      const data = payload[0].payload
      
      const borderColor = metric === 'score' 
        ? (theme === 'dark' ? '#00ff88' : '#10b981')
        : (theme === 'dark' ? '#22d3ee' : '#0891b2')
      
      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border p-3 shadow-lg dark:shadow-[0_0_15px_rgba(0,255,136,0.15)] backdrop-blur-sm min-w-[180px]" style={{ borderColor }}>
          {/* Header: Exam Name */}
          <div className="mb-2 border-b border-gray-200 dark:border-zinc-800/50 pb-2">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: borderColor }}>
               {data.name || mockName}
            </p>
            <p className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5">{label}</p>
          </div>
          
          {/* Body: Scores/Time */}
          <div className="space-y-1">
            {payload.map((entry: any) => (
              <div key={entry.name} className="flex justify-between items-center text-[10px] font-mono">
                <span style={{ color: entry.color }} className="uppercase font-bold tracking-wider">
                  {metric === 'score' ? (entry.name === 'geral' ? 'TOTAL' : entry.name) : 'DURAÇÃO'}
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-bold">
                  {metric === 'time' ? formatTime(entry.value) : entry.value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer: Context */}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-zinc-800/50 flex justify-between items-center">
            <span className="text-[9px] text-slate-500 dark:text-zinc-600 uppercase tracking-wider">
              {metric === 'score' ? 'Desempenho' : 'Eficiência'}
            </span>
            <span className="text-[9px] font-mono text-slate-600 dark:text-zinc-400">
               {metric === 'score' 
                 ? (data.geral > 140 ? 'EXCELENTE' : data.geral > 120 ? 'BOM' : 'REGULAR')
                 : (data.geral < 120 ? 'RÁPIDO' : data.geral < 180 ? 'NORMAL' : 'LENTO')
               }
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom Tooltip for Pace Chart
  const CustomPaceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataIndex = chartData.findIndex(item => item.date === label)
      const mockName = getMockExamName(dataIndex >= 0 ? dataIndex : 0)
      const pace = payload[0].value

      const minutes = Math.floor(pace)
      const seconds = Math.round((pace - minutes) * 60)

      return (
        <div className="bg-white dark:bg-[#0a0a0a]/95 border border-cyan-600 dark:border-[#00d4ff] p-3 shadow-lg dark:shadow-[0_0_15px_rgba(0,212,255,0.15)] backdrop-blur-sm min-w-[180px]">
           <div className="mb-2 border-b border-gray-200 dark:border-zinc-800/50 pb-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-600 dark:text-[#00d4ff]">
               {mockName}
            </p>
            <p className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5">{label}</p>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
             <span className="uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400">RITMO</span>
             <span className="text-slate-800 dark:text-zinc-200 font-bold">{minutes}m {seconds}s <span className="text-[8px] text-zinc-500">/questão</span></span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-zinc-800/50 flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-zinc-600">Status</span>
            <span className={`text-[9px] font-mono font-bold ${pace <= 3.0 ? 'text-emerald-500' : 'text-amber-500'}`}>
               {pace <= 3.0 ? 'NO RITMO' : 'LENTO'}
            </span>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col transition-all duration-300 ease-in-out shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-600 dark:text-cyber-green mb-1">
            Desempenho Simulados
          </h3>
          <SimuladoEntryModal />
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
              domain={metric === 'score' ? [0, 180] : [0, 240]} 
              stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} 
              tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
              tickLine={false} 
              axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} 
              ticks={metric === 'score' ? [0, 45, 90, 135, 180] : [0, 60, 120, 180, 240]}
              tickFormatter={metric === 'time' ? (value) => formatTime(value) : undefined}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="geral" 
              stroke={metric === 'score' ? (theme === 'dark' ? '#00ff41' : '#10b981') : '#06b6d4'}
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6, fill: metric === 'score' ? (theme === 'dark' ? '#00ff41' : '#10b981') : '#06b6d4', stroke: theme === 'dark' ? '#09090b' : '#ffffff', strokeWidth: 2 }} 
              name={metric === 'score' ? 'GERAL' : 'TEMPO'} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* EXPANDABLE SECTION */}
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 mt-4">
           <div className="my-3 h-px bg-gray-200 dark:bg-zinc-800" />
           
           {/* SECONDARY CHART: Competency Breakdown */}
           <div className="mb-4">
               {/* Header for Secondary Chart */}
               <div className="flex items-center justify-between mb-4 h-6">
                 {metric === 'score' ? (
                   <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                     Por Área
                   </h3>
                 ) : (
                   <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                     Ritmo de Prova
                   </h3>
                 )}

                 {/* Toggles (Only for Score) */}
                 {metric === 'score' && (
                     <div className="flex gap-1">
                      {(['mat', 'nat', 'hum', 'lin'] as const).map((area) => (
                        <button
                          key={area}
                          onClick={() => toggleLine(area)}
                          className={`
                            flex items-center gap-1 px-1.5 py-0.5 border text-[8px] uppercase tracking-wider font-bold transition-all
                            ${visibleLines[area] ? 'bg-opacity-10' : 'border-gray-300 dark:border-zinc-800 text-slate-500 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-900'}
                          `}
                          style={{
                            borderColor: visibleLines[area] ? areaColors[area] : undefined,
                            color: visibleLines[area] ? areaColors[area] : undefined,
                            backgroundColor: visibleLines[area] ? `${areaColors[area]}15` : undefined,
                          }}
                        >
                          {visibleLines[area] ? <Eye className="h-2 w-2" /> : <EyeOff className="h-2 w-2" />}
                          {areaLabels[area]}
                        </button>
                      ))}
                     </div>
                 )}
               </div>

                <div className="h-48 w-full">
                  {metric === 'time' ? (
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
                        <YAxis domain={[0, 6]} stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} ticks={[0, 2, 3, 4, 6]} />
                        <Tooltip content={<CustomPaceTooltip />} cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <ReferenceLine y={3.0} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: 'Alvo (3m)', fill: '#10b981', fontSize: 9 }} />
                        <Line type="monotone" dataKey="pace" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#06b6d4' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
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
                        <YAxis domain={[0, 45]} stroke={theme === 'dark' ? '#52525b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#71717a' : '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb' }} ticks={[0, 15, 30, 45]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        
                        {visibleLines.mat && <Line type="monotone" dataKey="mat" stroke={areaColors.mat} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="MAT" />}
                        {visibleLines.nat && <Line type="monotone" dataKey="nat" stroke={areaColors.nat} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="NAT" />}
                        {visibleLines.hum && <Line type="monotone" dataKey="hum" stroke={areaColors.hum} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="HUM" />}
                        {visibleLines.lin && <Line type="monotone" dataKey="lin" stroke={areaColors.lin} strokeWidth={1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="LIN" />}
                      </LineChart>
                    </ResponsiveContainer>
                  )}
               </div>
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
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Acertos</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Distância</p>
                            <p className={`font-mono text-lg font-bold ${distanceToGoal >= 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                              {distanceToGoal >= 0 ? '+' : ''}{distanceToGoal}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Precisão</p>
                            <p className="font-mono text-lg font-bold text-cyber-cyan">
                              {accuracyRate}%
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Time Mode KPIs */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-mono text-3xl font-black text-cyan-400 tracking-tighter" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
                            {formatTime(rollingAvg.time)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Ritmo</p>
                            <p className={`font-mono text-lg font-bold ${rollingAvg.pace <= 3.2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {rollingAvg.pace.toFixed(1)}m<span className="text-[10px] text-zinc-500">/q</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-zinc-600 mb-1">Velocidade</p>
                            <p className="font-mono text-lg font-bold text-cyan-400">
                              {Math.round(rollingAvg.speed)} <span className="text-[10px] text-zinc-500">q/h</span>
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Module 2: Radar Hologram (Score) or Pace Gauge (Time) */}
                  <div className="relative p-4 flex flex-col items-center justify-center lg:border-r border-white/5">
                     <div className="absolute top-0 left-0 w-full text-center">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
                          {metric === 'score' ? 'Perfil' : 'Ritmo Médio'}
                        </p>
                     </div>
                     <div className="w-full h-full relative flex items-center justify-center pt-4">
                       {metric === 'score' ? (
                         <ResponsiveContainer width="100%" height={120}>
                           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                             { subject: 'MAT', A: rollingAvg.mat, fullMark: 45 },
                             { subject: 'NAT', A: rollingAvg.nat, fullMark: 45 },
                             { subject: 'HUM', A: rollingAvg.hum, fullMark: 45 },
                             { subject: 'LIN', A: rollingAvg.lin, fullMark: 45 },
                           ]}>
                             <PolarGrid stroke="#333" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 9, fontWeight: 'bold' }} />
                             <PolarRadiusAxis 
                               angle={30} 
                               domain={[0, 45]} 
                               tick={false} 
                               axisLine={false} 
                             />
                             <Radar 
                               name="Média" 
                               dataKey="A" 
                               stroke="#00d4ff" 
                               strokeWidth={2} 
                               fill="#00d4ff" 
                               fillOpacity={0.3} 
                             />
                             <Tooltip content={<CustomRadarTooltip />} cursor={false} />
                           </RadarChart>
                         </ResponsiveContainer>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center">
                           <PaceGauge pace={rollingAvg.pace} />
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Module 3: System Alert */}
                  <div className="relative p-4 flex flex-col justify-center">
                     {metric === 'score' ? (() => {
                       const scores = [
                         { area: 'MAT', fullName: 'Matemática', score: rollingAvg.mat, color: areaColors.mat },
                         { area: 'NAT', fullName: 'Natureza', score: rollingAvg.nat, color: areaColors.nat },
                         { area: 'HUM', fullName: 'Humanas', score: rollingAvg.hum, color: areaColors.hum },
                         { area: 'LIN', fullName: 'Linguagens', score: rollingAvg.lin, color: areaColors.lin },
                       ]
                       const weakest = scores.reduce((min, curr) => curr.score < min.score ? curr : min)
                       
                       return (
                         <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse shadow-[0_0_8px_rgba(255,0,85,0.8)]"></div>
                             <p className="text-[9px] uppercase tracking-widest text-cyber-red font-bold animate-pulse">Alerta do Sistema</p>
                           </div>
                           <p className="font-mono text-lg text-cyber-red mb-1 font-bold tracking-tight">CRÍTICO: {weakest.area}</p>
                           <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Pontuação <span className="text-zinc-300 font-bold">{weakest.score}/45</span> abaixo do limite.</p>
                           <div className="mt-2 pt-2 border-t border-dashed border-zinc-800/50">
                             <p className="text-[8px] uppercase tracking-widest text-zinc-600">Recomendação</p>
                             <p className="text-[10px] mt-0.5 font-bold" style={{ color: weakest.color }}>+ Priorizar {weakest.fullName}</p>
                           </div>
                         </div>
                       )
                     })() : (() => {
                       // Time Analysis Alert
                       const isSlow = rollingAvg.time > 270 // > 4h 30m
                       const isFast = rollingAvg.time < 180 // < 3h
                       
                       if (isSlow) {
                          return (
                            <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                                 <p className="text-[9px] uppercase tracking-widest text-amber-500 font-bold animate-pulse">ALERTA DE RITMO</p>
                               </div>
                               <p className="font-mono text-lg text-amber-500 mb-1 font-bold tracking-tight">RITMO LENTO</p>
                               <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Tempo médio <span className="text-zinc-300 font-bold">{formatTime(rollingAvg.time)}</span> acima da meta.</p>
                               <div className="mt-2 pt-2 border-t border-dashed border-zinc-800/50">
                                 <p className="text-[8px] uppercase tracking-widest text-zinc-600">Recomendação</p>
                                 <p className="text-[10px] text-cyan-400 mt-0.5 font-bold">+ Treinar Cálculo Mental</p>
                               </div>
                            </div>
                          )
                       } else if (isFast) {
                          return (
                            <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                 <p className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold animate-pulse">ALERTA DE VELOCIDADE</p>
                               </div>
                               <p className="font-mono text-lg text-cyan-400 mb-1 font-bold tracking-tight">APRESSADO?</p>
                               <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Tempo médio <span className="text-zinc-300 font-bold">{formatTime(rollingAvg.time)}</span> muito rápido.</p>
                               <div className="mt-2 pt-2 border-t border-dashed border-zinc-800/50">
                                 <p className="text-[8px] uppercase tracking-widest text-zinc-600">Recomendação</p>
                                 <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">+ Revisar Erros com Atenção</p>
                               </div>
                            </div>
                          )
                       } else {
                          return (
                            <div className="h-full flex flex-col justify-center pl-4 border-l border-white/5 lg:border-l-0">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                 <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">STATUS OK</p>
                               </div>
                               <p className="font-mono text-lg text-emerald-500 mb-1 font-bold tracking-tight">RITMO IDEAL</p>
                               <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[150px]">Gestão de tempo dentro da meta.</p>
                            </div>
                          )
                       }
                     })()}
                  </div>
                </div>
             )}
           </div>
        </div>
      )}
    </div>
  )
}
