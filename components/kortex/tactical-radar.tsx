'use client'

import { Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RadarItem {
  id: string
  name: string
  subjectName: string
  subjectColor: string
  incidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  status: string
  masteryScore: number
  errorCount: number
}

interface TacticalRadarProps {
  priorities: RadarItem[]
}

const incidenceLabels = {
  LOW: 'BAIXA INCIDÊNCIA',
  MEDIUM: 'MÉDIA INCIDÊNCIA',
  HIGH: 'ALTA INCIDÊNCIA',
  VERY_HIGH: 'ALTÍSSIMA INCIDÊNCIA'
}

const incidenceColors = {
  LOW: 'text-zinc-500 border-zinc-700',
  MEDIUM: 'text-cyber-amber border-cyber-amber',
  HIGH: 'text-cyber-red border-cyber-red',
  VERY_HIGH: 'text-cyber-red border-cyber-red glow-red'
}

export function TacticalRadar({ priorities }: TacticalRadarProps) {
  const handleStartBattery = (topicId: string, topicName: string) => {
    // TODO: Integrate with question system
    alert(`Iniciando bateria de questões: ${topicName}`)
  }

  return (
    <div className="border border-cyber-red bg-zinc-950 p-4 border-glow-red">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-4 w-4 text-cyber-red" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-red glow-red">
          RADAR DE PRIORIDADE // ALVOS DE ALTO VALOR
        </h2>
      </div>

      <div className="space-y-3">
        {priorities.map((item, index) => (
          <div
            key={item.id}
            className={`
              border bg-zinc-900/50 p-4 transition-all hover:border-cyber-red
              ${index === 0 ? 'border-cyber-red border-glow-red' : 'border-zinc-800'}
            `}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Topic Info */}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {item.name}
                  </span>
                  {index === 0 && (
                    <TrendingUp className="h-3 w-3 text-cyber-red" />
                  )}
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.subjectColor }}
                  />
                  <span className="text-[9px] text-zinc-500">
                    {item.subjectName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Incidence Tag */}
                  <span
                    className={`
                      px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider
                      border ${incidenceColors[item.incidence]}
                    `}
                  >
                    {incidenceLabels[item.incidence]}
                  </span>

                  {/* Mastery Score */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-600">Domínio:</span>
                    <span className="font-mono text-xs text-cyber-amber">
                      {item.masteryScore}%
                    </span>
                  </div>

                  {/* Error Count */}
                  {item.errorCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-600">Erros:</span>
                      <span className="font-mono text-xs text-cyber-red">
                        {item.errorCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mastery Progress Bar */}
                <div className="mt-2 h-1 w-full bg-zinc-800">
                  <div
                    className="h-full bg-cyber-amber"
                    style={{ width: `${item.masteryScore}%` }}
                  />
                </div>
              </div>

              {/* Right: Action Button */}
              <Button
                onClick={() => handleStartBattery(item.id, item.name)}
                className="bg-cyber-red text-black font-bold uppercase text-[10px] tracking-wider hover:bg-cyber-red/90 px-3 py-2 h-auto"
              >
                INICIAR
                <br />
                BATERIA
              </Button>
            </div>
          </div>
        ))}

        {priorities.length === 0 && (
          <div className="text-center py-8 text-zinc-600 text-sm">
            Todos os tópicos dominados! Parabéns! 🎯
          </div>
        )}
      </div>
    </div>
  )
}
