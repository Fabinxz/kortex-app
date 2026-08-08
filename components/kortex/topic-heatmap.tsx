'use client'

import { useState } from 'react'
import { Filter, Zap, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

// 1. MOCK DATA
type Topic = {
  id: number
  subject: 'MAT' | 'NAT' | 'HUM' | 'LIN'
  topic: string
  efficiency: number // 0-100
  questions: number
}

const mockTopics: Topic[] = [
  // MAT
  { id: 1, subject: 'MAT', topic: 'Logaritmos', efficiency: 42, questions: 15 },
  { id: 2, subject: 'MAT', topic: 'Geometria Plana', efficiency: 85, questions: 32 },
  { id: 3, subject: 'MAT', topic: 'Análise Combinatória', efficiency: 65, questions: 28 },
  { id: 4, subject: 'MAT', topic: 'Funções', efficiency: 92, questions: 45 },
  { id: 5, subject: 'MAT', topic: 'Trigonometria', efficiency: 38, questions: 12 },
  { id: 18, subject: 'MAT', topic: 'Matrizes', efficiency: 78, questions: 22 },
  { id: 19, subject: 'MAT', topic: 'Probabilidade', efficiency: 55, questions: 18 },
  { id: 20, subject: 'MAT', topic: 'Geometria Espacial', efficiency: 88, questions: 30 },
  
  // NAT
  { id: 6, subject: 'NAT', topic: 'Eletrodinâmica', efficiency: 35, questions: 2 }, 
  { id: 7, subject: 'NAT', topic: 'Estequiometria', efficiency: 72, questions: 18 },
  { id: 8, subject: 'NAT', topic: 'Botânica', efficiency: 88, questions: 22 },
  { id: 9, subject: 'NAT', topic: 'Ondulatória', efficiency: 45, questions: 14 },
  { id: 10, subject: 'NAT', topic: 'Termologia', efficiency: 78, questions: 20 },
  { id: 21, subject: 'NAT', topic: 'Cinemática', efficiency: 92, questions: 40 },
  { id: 22, subject: 'NAT', topic: 'Óptica', efficiency: 60, questions: 15 },

  // HUM
  { id: 11, subject: 'HUM', topic: '2ª Guerra Mundial', efficiency: 98, questions: 50 },
  { id: 12, subject: 'HUM', topic: 'Ditadura Militar', efficiency: 85, questions: 30 },
  { id: 13, subject: 'HUM', topic: 'Filosofia Antiga', efficiency: 68, questions: 15 },
  { id: 14, subject: 'HUM', topic: 'Geografia Física', efficiency: 74, questions: 25 },
  { id: 23, subject: 'HUM', topic: 'Sociologia', efficiency: 82, questions: 20 },

  // LIN
  { id: 15, subject: 'LIN', topic: 'Interpretação', efficiency: 96, questions: 60 },
  { id: 16, subject: 'LIN', topic: 'Modernismo', efficiency: 82, questions: 28 },
  { id: 17, subject: 'LIN', topic: 'Gramática', efficiency: 62, questions: 20 },
  { id: 24, subject: 'LIN', topic: 'Redação', efficiency: 88, questions: 15 },
]

export function TopicHeatmap() {
  const [filter, setFilter] = useState<'TODOS' | 'MAT' | 'NAT' | 'HUM' | 'LIN'>('TODOS')
  const [viewMode, setViewMode] = useState<'pixel' | 'list'>('pixel')

  // Filter & Sort Logic (Critical First for List View, alphabetical/subject for Pixel View depending on preference, sticking to critical first for now)
  const filteredTopics = mockTopics
    .filter(t => filter === 'TODOS' || t.subject === filter)
    .sort((a, b) => a.efficiency - b.efficiency)

  // Color Helper
  const getStatusColor = (eff: number) => {
    if (eff < 60) return { 
      border: 'border-[#ff0055]', 
      text: 'text-[#ff0055]', 
      bg: 'bg-[#ff0055]', 
      bgVar: 'bg-[#ff0055]/10', 
      shadow: 'shadow-[#ff0055]/20', 
      glow: 'shadow-[0_0_10px_rgba(255,0,85,0.4)]' 
    }
    if (eff < 80) return { 
      border: 'border-[#ffb800]', 
      text: 'text-[#ffb800]', 
      bg: 'bg-[#ffb800]', 
      bgVar: 'bg-[#ffb800]/10', 
      shadow: 'shadow-[#ffb800]/20', 
      glow: '' 
    }
    if (eff < 95) return { 
      border: 'border-[#00ff88]', 
      text: 'text-[#00ff88]', 
      bg: 'bg-[#00ff88]', 
      bgVar: 'bg-[#00ff88]/10', 
      shadow: 'shadow-[#00ff88]/20', 
      glow: '' 
    }
    return { 
      border: 'border-cyan-400', 
      text: 'text-cyan-400', 
      bg: 'bg-cyan-400', 
      bgVar: 'bg-cyan-400/10', 
      shadow: 'shadow-cyan-400/20', 
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
    }
  }

  return (
    <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] p-6 relative overflow-visible transition-all duration-500 ease-in-out shadow-sm dark:shadow-none">
      {/* Decorative Grid Background - only show in dark mode */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-0 dark:opacity-100" />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-wider uppercase">Mapa de Calor // Tópicos</h2>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">DIAGNÓSTICO DE PROFICIÊNCIA POR ASSUNTO</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex p-0.5 bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => setViewMode('pixel')}
              className={cn(
                "p-1.5 rounded transition-all",
                viewMode === 'pixel' ? "bg-emerald-600 dark:bg-zinc-800 text-white" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
              title="Grade de Pixels"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded transition-all",
                viewMode === 'list' ? "bg-emerald-600 dark:bg-zinc-800 text-white" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
              title="Lista de Cards"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg backdrop-blur-sm">
            {['TODOS', 'MAT', 'NAT', 'HUM', 'LIN'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all duration-300",
                  filter === tab 
                    ? "bg-emerald-600 dark:bg-zinc-800 text-white shadow-sm" 
                    : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PIXEL VIEW MODE */}
      {viewMode === 'pixel' && (
        <div className="flex flex-wrap gap-1.5 relative z-10 animate-in fade-in duration-300">
          {filteredTopics.map((item) => {
            const styles = getStatusColor(item.efficiency)
            return (
              <div 
                key={item.id}
                className={cn(
                  "group relative w-6 h-6 rounded-sm transition-all duration-200 hover:scale-110 cursor-help",
                  styles.bg,
                  item.efficiency < 60 ? "opacity-90" : "opacity-80 hover:opacity-100" // Subtle opacity diffs
                )}
              >
                {/* Floating Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max min-w-[120px] max-w-[200px] 
                              bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 
                              transition-opacity pointer-events-none z-50 overflow-hidden">
                   {/* Tooltip Header */}
                   <div className="flex justify-between items-center mb-1 border-b border-gray-200 dark:border-zinc-800 pb-1">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-500">{item.subject}</span>
                      <span className={cn("text-[9px] font-bold", styles.text)}>
                        {item.efficiency < 60 ? 'CRÍTICO' : item.efficiency < 80 ? 'ATENÇÃO' : 'BOM'}
                      </span>
                   </div>
                   {/* Tooltip Body */}
                   <p className="text-[10px] font-bold text-slate-900 dark:text-white mb-1 truncate">{item.topic}</p>
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] text-slate-500 dark:text-zinc-600">{item.questions} Qt</span>
                      <span className={cn("text-xs font-mono font-bold", styles.text)}>{item.efficiency}%</span>
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LIST VIEW MODE (Original) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 relative z-10 animate-in fade-in zoom-in-95 duration-300">
          {filteredTopics.map((item) => {
            const styles = getStatusColor(item.efficiency)
            const isCritical = item.efficiency < 60
            
            return (
              <div 
                key={item.id}
                className={cn(
                  "group relative border bg-white dark:bg-zinc-900/40 p-3 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none",
                  styles.border,
                  isCritical && "animate-pulse-slow" 
                )}
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  styles.bgVar
                )} />

                <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                  <div className="flex justify-between items-start">
                     <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-500 font-mono bg-gray-100 dark:bg-zinc-950/50 px-1 rounded border border-gray-200 dark:border-zinc-800">
                       {item.subject}
                     </span>
                     {isCritical && (
                       <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0055] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0055]"></span>
                       </span>
                     )}
                  </div>

                  <div>
                    <h3 className={cn("text-xs font-bold leading-tight mb-2 uppercase tracking-wide", styles.text)}>
                      {item.topic}
                    </h3>
                    <div className="w-full bg-gray-100 dark:bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-800/50">
                      <div 
                        className={cn("h-full transition-all duration-1000 ease-out rounded-full", styles.bg)} 
                        style={{ width: `${item.efficiency}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-800/50 mt-auto">
                     <span className="text-[9px] text-slate-500 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
                       {item.questions} Questões
                     </span>
                     <span className={cn("text-[10px] font-mono font-bold", styles.text)}>
                       {item.efficiency}%
                     </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
