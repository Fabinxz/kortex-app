'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Target, Zap, AlertTriangle, CheckCircle2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// MOCK DATA FOR FUZZY SEARCH (Derived from Heatmap)
const MOCK_TOPICS = [
  "Geometria Espacial", "Eletrodinâmica", "Estequiometria", 
  "Termologia", "Probabilidade", "Funções", "Ecologia", 
  "Interpretação Textual", "2ª Guerra Mundial", "Geopolítica",
  "Estatística", "Genética", "Óptica Geométrica", "Botânica", 
  "Logaritmos", "Era Vargas", "Modernismo", "Cinemática", 
  "Climatologia", "Trigonometria", "Guerra Fria", "PA e PG",
  "Números Complexos", "Filosofia Medieval", "Matrizes", "Parnasianismo"
]

interface DataInjectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DataInjectorModal({ isOpen, onClose }: DataInjectorModalProps) {
  const [subject, setSubject] = useState<'MAT' | 'NAT' | 'HUM' | 'LIN' | ''>('')
  const [topicQuery, setTopicQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [totalQuestions, setTotalQuestions] = useState<string>('')
  const [correctAnswers, setCorrectAnswers] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showSniper, setShowSniper] = useState(false)
  const [efficiency, setEfficiency] = useState<number | null>(null)

  const topicInputRef = useRef<HTMLInputElement>(null)

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // If already open, close? Or focus? User said Open. 
        // Logic handled by parent usually, but we can ensure focus here.
        topicInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // AUTO FOCUS ON OPEN
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        topicInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // FUZZY SEARCH LOGIC
  useEffect(() => {
    if (topicQuery.length > 1) {
      const filtered = MOCK_TOPICS.filter(t => 
        t.toLowerCase().includes(topicQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [topicQuery])

  // EFFICIENCY CALCULATION
  useEffect(() => {
    const total = parseInt(totalQuestions)
    const correct = parseInt(correctAnswers)

    if (!isNaN(total) && !isNaN(correct) && total > 0) {
      const eff = Math.round((correct / total) * 100)
      setEfficiency(eff)
      setShowSniper(correct < total)
    } else {
      setEfficiency(null)
      setShowSniper(false)
    }
  }, [totalQuestions, correctAnswers])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would save the data
    const payload = {
      subject,
      topic: topicQuery,
      total: parseInt(totalQuestions),
      correct: parseInt(correctAnswers),
      efficiency,
      tags: selectedTags
    }
    
    // Play sound or Flash (Simulated)
    // Close
    onClose()
    
    // Reset form
    setSubject('')
    setTopicQuery('')
    setTotalQuestions('')
    setCorrectAnswers('')
    setSelectedTags([])
    setEfficiency(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* MODAL CONTAINER */}
      <div className="w-full max-w-2xl bg-white dark:bg-[#09090b] border border-gray-300 dark:border-zinc-800 shadow-2xl rounded-lg overflow-hidden relative flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: INPUTS */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
          
          {/* Header */}
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter flex items-center gap-2">
              <TerminalIcon className="w-5 h-5 text-emerald-600 dark:text-cyber-green" />
              INJETOR DE DADOS
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono mt-1">
              // SISTEMA DE ENTRADA RÁPIDA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* SUBJECT & TOPIC */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {['MAT', 'NAT', 'HUM', 'LIN'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s as any)}
                    className={cn(
                      "py-2 text-xs font-bold rounded border transition-all duration-200 uppercase",
                      subject === s 
                        ? "bg-emerald-600 dark:bg-zinc-800 text-white border-emerald-700 dark:border-zinc-600 shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
                        : "bg-gray-100 dark:bg-zinc-900/50 text-slate-600 dark:text-zinc-600 border-gray-300 dark:border-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-zinc-600 group-focus-within:text-emerald-600 dark:group-focus-within:text-cyber-green transition-colors" />
                <input
                  ref={topicInputRef}
                  type="text"
                  value={topicQuery}
                  onChange={(e) => setTopicQuery(e.target.value)}
                  placeholder="Buscar Tópico (ex: Eletro...)"
                  className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded p-3 pl-10 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-600 dark:focus:border-cyber-green focus:ring-1 focus:ring-emerald-600/50 dark:focus:ring-cyber-green/50 transition-all uppercase"
                />
                
                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded shadow-xl z-20">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setTopicQuery(s)
                          setSuggestions([])
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition-colors border-b border-gray-200 dark:border-zinc-900 last:border-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NUMBERS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-500 ml-1">Total de Questões</label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded p-3 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-white/40 transition-all text-center"
                  placeholder="00"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-500 ml-1">Respostas Corretas</label>
                <input
                  type="number"
                  value={correctAnswers}
                  onChange={(e) => setCorrectAnswers(e.target.value)}
                  className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded p-3 text-lg font-mono font-bold text-emerald-600 dark:text-cyber-green focus:outline-none focus:border-emerald-600/50 dark:focus:border-cyber-green/50 transition-all text-center"
                  placeholder="00"
                />
              </div>
            </div>

            {/* SNIPER LOG (Error Tags) */}
            {showSniper && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-red-500/5 border border-red-500/20 rounded p-3">
                <div className="flex items-center gap-2 mb-2 text-red-500/80">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Diagnóstico de Erros</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['LACUNA TEÓRICA', 'DESATENÇÃO', 'INTERPRETAÇÃO', 'TEMPO'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        "px-2 py-1 text-[9px] font-bold rounded border transition-all uppercase",
                        selectedTags.includes(tag) 
                          ? "bg-red-500/20 text-red-400 border-red-500/40" 
                          : "bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-600"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full bg-emerald-600 dark:bg-cyber-green text-white dark:text-black font-black uppercase tracking-widest py-3 rounded hover:bg-emerald-700 dark:hover:bg-[#00ff99] hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all active:scale-[0.98]"
            >
              [ ENTER ] SALVAR DADOS
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: REAL-TIME FEEDBACK */}
        <div className="w-full md:w-48 bg-gray-50 dark:bg-zinc-900/50 border-l border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10" />
          
          <div className="relative z-10 text-center">
            <h3 className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase mb-2">Eficiência</h3>
            
            <div className="relative flex items-center justify-center w-32 h-32">
              {/* Animated Ring (CSS would ideally rotate) */}
              <div className={cn(
                "absolute inset-0 rounded-full border-4 opacity-20",
                efficiency !== null ? "border-emerald-600 dark:border-cyber-green" : "border-gray-300 dark:border-zinc-800"
              )} />
              
              <div className="text-center">
                <span className={cn(
                  "text-4xl font-black tracking-tighter",
                  efficiency !== null 
                    ? (efficiency >= 80 ? "text-emerald-600 dark:text-cyber-green dark:glow-green" : efficiency >= 60 ? "text-[#ffb800]" : "text-[#ff0055]")
                    : "text-gray-300 dark:text-zinc-700"
                )}>
                  {efficiency !== null ? `${efficiency}%` : '--'}
                </span>
              </div>
            </div>

            {efficiency !== null && (
              <div className="mt-4 flex flex-col gap-1 items-center">
                 <div className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                    efficiency >= 80 ? 'bg-green-500/20 text-green-400' :
                    efficiency >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                 )}>
                   {efficiency >= 80 ? 'EXCELENTE' : efficiency >= 60 ? 'ATENÇÃO' : 'CRÍTICO'}
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// Icon helper
function TerminalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}
