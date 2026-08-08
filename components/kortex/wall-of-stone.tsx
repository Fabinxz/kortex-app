'use client'

import { Lock } from 'lucide-react'

interface WallOfStoneProps {
  topics: Array<{
    id: string
    name: string
    difficultyLevel: number
    status: string
    subjectName: string
    subjectColor: string
    sessionCount: number
    errorCount: number
  }>
}

export function WallOfStone({ topics }: WallOfStoneProps) {
  return (
    <div className="border border-cyber-red bg-zinc-950 p-4 border-glow-red">
      <div className="mb-4 flex items-center gap-2">
        <Lock className="h-4 w-4 text-cyber-red" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-red glow-red">
          MURO DE PEDRA // TÓPICOS BLOQUEADOS
        </h2>
      </div>

      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="border border-zinc-800 bg-zinc-900/50 p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-xs font-bold text-cyber-red mb-1">
                  {topic.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: topic.subjectColor }}
                  />
                  <span className="text-[9px] text-zinc-500">
                    {topic.subjectName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-1.5 ${
                        i < topic.difficultyLevel
                          ? 'bg-cyber-red'
                          : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[8px] text-zinc-600 font-mono">
                  NVL {topic.difficultyLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-mono">
              <span>{topic.sessionCount} sessões</span>
              <span>•</span>
              <span>{topic.errorCount} erros</span>
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-8 text-zinc-600 text-sm">
            Nenhum tópico bloqueado. Parabéns! 🎉
          </div>
        )}
      </div>
    </div>
  )
}
