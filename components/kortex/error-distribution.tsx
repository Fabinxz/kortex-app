'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ErrorDistributionProps {
  data: Array<{
    errorType: string
    count: number
  }>
}

const errorTypeColors: Record<string, string> = {
  THEORY: '#ff0055',
  INTERPRETATION: '#ffaa00',
  ATTENTION: '#00d4ff',
  TIME: '#a1a1aa',
  EMOTIONAL: '#aa55ff',
}

const errorTypeLabels: Record<string, string> = {
  THEORY: 'TEORIA',
  INTERPRETATION: 'INTERP',
  ATTENTION: 'DESATENÇÃO',
  TIME: 'TEMPO',
  EMOTIONAL: 'EMOCIONAL',
}

export function ErrorDistribution({ data }: ErrorDistributionProps) {
  const chartData = data.map(item => ({
    type: errorTypeLabels[item.errorType] || item.errorType,
    count: item.count,
    fill: errorTypeColors[item.errorType] || '#71717a',
  }))

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-amber">
          TAXONOMIA DE ERROS // DISTRIBUIÇÃO
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" vertical={false} />
          
          <XAxis
            dataKey="type"
            stroke="#52525b"
            tick={{ fill: '#71717a', fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
          />
          
          <YAxis
            stroke="#52525b"
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              borderRadius: 0,
              padding: '8px',
            }}
            labelStyle={{
              color: '#ffaa00',
              fontSize: 10,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
            itemStyle={{
              color: '#a1a1aa',
              fontSize: 9,
              fontFamily: 'JetBrains Mono',
            }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          
          <Bar
            dataKey="count"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
