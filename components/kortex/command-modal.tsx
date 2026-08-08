'use client'

import { useState } from 'react'
import { X, FileText, PenTool, Target } from 'lucide-react'

interface CommandModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'simulado' | 'redacao' | 'error' | null

export function CommandModal({ isOpen, onClose }: CommandModalProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>(null)

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 dark:bg-black/80"
      onClick={onClose}
    >
      <div 
        className="border border-emerald-600 dark:border-cyber-green bg-white dark:bg-[#0a0a0a] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-emerald-600 dark:border-cyber-green p-4 flex items-center justify-between">
          <h2 className="text-emerald-600 dark:text-cyber-green font-mono text-sm uppercase tracking-widest">
            [ OPERAÇÕES DE COMANDO // ENTRADA DE DADOS ]
          </h2>
          <button onClick={onClose} className="text-slate-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-cyber-red transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedTab ? (
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedTab('simulado')}
                className="border border-gray-300 dark:border-zinc-700 hover:border-cyan-600 dark:hover:border-cyber-cyan bg-gray-50 dark:bg-zinc-950 p-6 transition-all hover:bg-cyan-50 dark:hover:bg-cyber-cyan/5 group shadow-sm dark:shadow-none"
              >
                <FileText className="h-8 w-8 mx-auto mb-3 text-cyan-600 dark:text-cyber-cyan group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <p className="text-cyan-600 dark:text-cyber-cyan font-bold text-sm mb-1">SIMULADO</p>
                  <p className="text-slate-500 dark:text-zinc-600 text-[8px] uppercase tracking-wider">Registro de Prova</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTab('redacao')}
                className="border border-gray-300 dark:border-zinc-700 hover:border-emerald-600 dark:hover:border-cyber-green bg-gray-50 dark:bg-zinc-950 p-6 transition-all hover:bg-emerald-50 dark:hover:bg-cyber-green/5 group shadow-sm dark:shadow-none"
              >
                <PenTool className="h-8 w-8 mx-auto mb-3 text-emerald-600 dark:text-cyber-green group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <p className="text-emerald-600 dark:text-cyber-green font-bold text-sm mb-1">REDAÇÃO</p>
                  <p className="text-slate-500 dark:text-zinc-600 text-[8px] uppercase tracking-wider">Registro de Escrita</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTab('error')}
                className="border border-gray-300 dark:border-zinc-700 hover:border-amber-600 dark:hover:border-cyber-amber bg-gray-50 dark:bg-zinc-950 p-6 transition-all hover:bg-amber-50 dark:hover:bg-cyber-amber/5 group shadow-sm dark:shadow-none"
              >
                <Target className="h-8 w-8 mx-auto mb-3 text-amber-600 dark:text-cyber-amber group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <p className="text-amber-600 dark:text-cyber-amber font-bold text-sm mb-1">REGISTRO DE ERRO</p>
                  <p className="text-slate-500 dark:text-zinc-600 text-[8px] uppercase tracking-wider">Registro de Erro</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-500 dark:text-zinc-500 py-12">
              <p className="mb-4">Formulário de {selectedTab} selecionado</p>
              <button
                onClick={() => setSelectedTab(null)}
                className="text-cyan-600 dark:text-cyber-cyan hover:underline text-sm"
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
