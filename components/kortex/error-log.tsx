'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ErrorLogProps {
  errors: Array<{
    id: string
    description: string
    errorType: string
    date: Date
    topicName: string
    subjectName: string
    subjectColor: string
    simulationName: string | null
  }>
}

const errorTypeColors: Record<string, string> = {
  THEORY: 'text-cyber-red border-cyber-red',
  INTERPRETATION: 'text-cyber-amber border-cyber-amber',
  ATTENTION: 'text-cyber-cyan border-cyber-cyan',
  TIME: 'text-zinc-400 border-zinc-600',
  EMOTIONAL: 'text-cyber-purple border-cyber-purple',
}

const errorTypeLabels: Record<string, string> = {
  THEORY: 'TEORIA',
  INTERPRETATION: 'INTERP',
  ATTENTION: 'DESATEN',
  TIME: 'TEMPO',
  EMOTIONAL: 'EMOC',
}

export function ErrorLog({ errors }: ErrorLogProps) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-cyber-red" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-red">
          REGISTRO DE ERROS
        </h2>
        <span className="ml-auto font-mono text-[9px] text-zinc-600">
          {errors.length} REGISTROS
        </span>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {errors.map((error) => (
            <div
              key={error.id}
              className="border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <span
                  className={`
                    px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider
                    border ${errorTypeColors[error.errorType]}
                  `}
                >
                  {errorTypeLabels[error.errorType]}
                </span>
                
                <span className="text-[8px] text-zinc-600 font-mono">
                  {format(new Date(error.date), 'dd/MM', { locale: ptBR })}
                </span>

                <div className="ml-auto flex items-center gap-1">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: error.subjectColor }}
                  />
                  <span className="text-[8px] text-zinc-500">
                    {error.subjectName}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 mb-1">
                {error.description}
              </p>

              <div className="flex items-center gap-2 text-[8px] text-zinc-600">
                <span>{error.topicName}</span>
                {error.simulationName && (
                  <>
                    <span>•</span>
                    <span>{error.simulationName}</span>
                  </>
                )}
              </div>
            </div>
          ))}

          {errors.length === 0 && (
            <div className="text-center py-8 text-zinc-600 text-sm">
              Nenhum erro registrado no período
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
