'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Plus, X, Clock, Calendar, Hash, Fingerprint, Lock, Check, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// --- Types & Schema ---
type TopicLog = {
  id: string
  topic: string
  type: 'HIT' | 'MISS'
  reason?: 'LACUNA' | 'ATENÇÃO' | 'TEMPO'
}

const areaSchema = z.object({
  correct: z.number().min(0).max(45),
  topicLogs: z.array(z.any()),
})

const simuladoSchema = z.object({
  provider: z.string(),
  year: z.number(),
  edition: z.number().optional(),
  date: z.string(),
  timeInMinutes: z.number(),
  mat: areaSchema,
  nat: areaSchema,
  hum: areaSchema,
  lin: areaSchema,
})

type SimuladoFormValues = z.infer<typeof simuladoSchema>

// --- Circular Gauge ---
const CircularGauge = ({ percentage, isLocked }: { percentage: number, isLocked: boolean }) => {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    const color = percentage >= 80 ? '#00ff00' : percentage >= 60 ? '#fbbf24' : '#ef4444'

    return (
        <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="transform -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} stroke="#27272a" strokeWidth="10" fill="none" />
                <motion.circle 
                    cx="80" cy="80" r={radius} 
                    stroke={color} strokeWidth="10" fill="none"
                    strokeDasharray={circumference}
                    initial={false}
                    animate={{ strokeDashoffset: isLocked ? offset : circumference }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <motion.span 
                className="absolute text-6xl font-black font-mono"
                style={{ color, textShadow: `0 0 20px ${color}50` }}
                initial={false}
                animate={{ opacity: isLocked ? 1 : 0.3 }}
            >
                {percentage}%
            </motion.span>
        </div>
    )
}

export function SimuladoEntryModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('mat')
  
  const form = useForm<SimuladoFormValues>({
    resolver: zodResolver(simuladoSchema),
    defaultValues: {
      provider: 'SAS',
      year: 2026,
      edition: 1,
      date: new Date().toISOString().split('T')[0],
      timeInMinutes: 300,
      mat: { correct: 0, topicLogs: [] },
      nat: { correct: 0, topicLogs: [] },
      hum: { correct: 0, topicLogs: [] },
      lin: { correct: 0, topicLogs: [] },
    }
  })

  const provider = form.watch('provider')
  const showEdition = !['ENEM', 'PPL'].includes(provider)

  // --- AREA COMPONENT ---
  const AreaInput = ({ area }: { area: 'mat' | 'nat' | 'hum' | 'lin' }) => {
    const [scoreValue, setScoreValue] = useState('')
    const [topicInput, setTopicInput] = useState('')
    const [showReasonSelector, setShowReasonSelector] = useState(false)
    const [isEditingScore, setIsEditingScore] = useState(true)
    const topicInputRef = useRef<HTMLInputElement>(null)
    
    const logs: TopicLog[] = form.watch(`${area}.topicLogs`) || []
    const score = form.watch(`${area}.correct`) || 0
    
    // FIX: scoreLocked is computed from score, not local state
    const scoreLocked = score > 0 && !isEditingScore

    // Lock score on ENTER
    const handleScoreLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const val = parseInt(scoreValue) || 0
            const clamped = Math.max(0, Math.min(45, val))
            form.setValue(`${area}.correct`, clamped)
            setScoreValue(clamped.toString())
            setIsEditingScore(false)
        }
    }

    // Topic mapping keyboard handler
    const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!topicInput.trim()) return
        
        if (e.key === 'Enter' && !e.shiftKey) {
            // HIT
            e.preventDefault()
            const newLog: TopicLog = {
                id: `${Date.now()}-${Math.random()}`,
                topic: topicInput.trim(),
                type: 'HIT'
            }
            form.setValue(`${area}.topicLogs`, [...logs, newLog])
            setTopicInput('')
        } else if (e.key === 'Enter' && e.shiftKey) {
            // MISS - show reason selector
            e.preventDefault()
            setShowReasonSelector(true)
        }
    }

    // Add miss with reason
    const addMiss = (reason: 'LACUNA' | 'ATENÇÃO' | 'TEMPO') => {
        const newLog: TopicLog = {
            id: `${Date.now()}-${Math.random()}`,
            topic: topicInput.trim(),
            type: 'MISS',
            reason
        }
        form.setValue(`${area}.topicLogs`, [...logs, newLog])
        setTopicInput('')
        setShowReasonSelector(false)
    }

    const removeTopic = (id: string) => {
        form.setValue(`${area}.topicLogs`, logs.filter(l => l.id !== id))
    }

    const hitCount = logs.filter(l => l.type === 'HIT').length
    const missCount = logs.filter(l => l.type === 'MISS').length

    return (
        <div className="space-y-6">
            {/* SCORE INPUT */}
            <div>
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 flex items-center gap-2">
                    Meta de Acertos
                    {scoreLocked && <Lock className="w-3 h-3 text-[#00ff00]" />}
                </Label>
                
                <div className="relative">
                    <input 
                        type="number"
                        value={scoreValue}
                        onChange={(e) => {
                            const newVal = e.target.value
                            setScoreValue(newVal)
                        }}
                        onKeyDown={handleScoreLock}
                        onClick={() => {
                            if (score > 0 && !isEditingScore) {
                                setIsEditingScore(true)
                            }
                        }}
                        min={0}
                        max={45}
                        autoFocus={score === 0}
                        className={cn(
                            "w-full rounded-sm text-7xl font-black font-mono p-6 pr-32 focus:outline-none transition-all placeholder:text-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            scoreLocked 
                                ? "bg-[#09090b] border-2 border-[#00ff00] text-zinc-100 shadow-[0_0_30px_rgba(0,255,0,0.2)] cursor-pointer" 
                                : "bg-[#09090b] border-2 border-zinc-800 text-zinc-100/40 focus:border-zinc-700"
                        )}
                        placeholder="00"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-mono text-4xl select-none">
                        / 45
                    </div>
                </div>
                
                {!scoreLocked ? (
                    <p className="mt-2 text-[10px] text-zinc-600 font-mono flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[#00ff00]">ENTER</kbd>
                        para travar
                    </p>
                ) : (
                    <p className="mt-2 text-[9px] text-zinc-500 font-mono flex items-center gap-2">
                        <span className="text-cyan-500">✓</span> Travado • Clique para editar
                    </p>
                )}
            </div>

            {/* TOPIC MAPPING CONSOLE - OPTIMIZED */}
            {score > 0 && (
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            Console
                        </Label>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-mono font-bold">
                            <span className="text-cyan-400">{logs.length}</span>/45
                        </span>
                    </div>
                    
                    {/* Console Input - COMPACT */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-1.5 focus-within:border-cyan-500/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-500 font-mono pl-1.5 text-xs font-bold">{'>'}</span>
                            <input
                                ref={topicInputRef}
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={handleTopicKeyDown}
                                disabled={showReasonSelector}
                                autoFocus={score > 0 && !showReasonSelector}
                                placeholder="Digite o tópico..."
                                className="bg-transparent border-none focus:ring-0 flex-1 text-xs font-mono text-zinc-200 placeholder:text-zinc-700 h-8 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Hint - COMPACT */}
                    <p className="text-[8px] text-zinc-600 font-mono flex items-center gap-3">
                        <span><kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[#00ff00] text-[8px]">ENTER</kbd> = Acerto</span>
                        <span><kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-red-500 text-[8px]">SHIFT+ENTER</kbd> = Erro</span>
                    </p>

                    {/* REASON SELECTOR - COMPACT */}
                    {showReasonSelector && (
                        <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-1.5 p-2 bg-zinc-900/80 border border-zinc-800 rounded-sm items-center"
                        >
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Motivo:</span>
                            <button
                                onClick={() => addMiss('LACUNA')}
                                className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-[2px] text-[9px] font-bold uppercase transition-colors"
                            >
                                Lacuna
                            </button>
                            <button
                                onClick={() => addMiss('ATENÇÃO')}
                                className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 rounded-[2px] text-[9px] font-bold uppercase transition-colors"
                            >
                                Atenção
                            </button>
                            <button
                                onClick={() => addMiss('TEMPO')}
                                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-[2px] text-[9px] font-bold uppercase transition-colors"
                            >
                                Tempo
                            </button>
                            <button
                                onClick={() => setShowReasonSelector(false)}
                                className="ml-auto text-zinc-600 hover:text-zinc-400"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.div>
                    )}

                    {/* Topic Pills - COMPACT GRID */}
                    <div className="min-h-[60px] max-h-[140px] overflow-y-auto">
                        <div className="flex flex-wrap gap-1.5">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-[10px] font-mono uppercase",
                                        log.type === 'HIT' 
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    )}
                                >
                                    {log.type === 'HIT' ? (
                                        <Check className="w-2.5 h-2.5" />
                                    ) : (
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                    )}
                                    <span className="text-[10px]">{log.topic}</span>
                                    {log.reason && (
                                        <span className="text-[8px] opacity-60">• {log.reason}</span>
                                    )}
                                    <button 
                                        onClick={() => removeTopic(log.id)}
                                        className="ml-0.5 hover:opacity-100 opacity-50"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats - INLINE */}
                    {logs.length > 0 && (
                        <div className="flex gap-4 pt-1 border-t border-zinc-800">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-black font-mono text-green-500">{hitCount}</span>
                                <span className="text-[8px] uppercase tracking-widest text-zinc-600">Acertos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-black font-mono text-red-500">{missCount}</span>
                                <span className="text-[8px] uppercase tracking-widest text-zinc-600">Erros</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
  }

  // --- FEEDBACK PANEL ---
  const FeedbackPanel = ({ area }: { area: 'mat' | 'nat' | 'hum' | 'lin' }) => {
      const score = form.watch(`${area}.correct`) || 0
      const percentage = Math.round((score / 45) * 100)
      const isLocked = score > 0

      return (
          <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">EFICIÊNCIA</span>
                  <CircularGauge percentage={percentage} isLocked={isLocked} />
              </div>
          </div>
      )
  }

  const onSubmit = (data: SimuladoFormValues) => {
    setOpen(false)
  }

  // Check if all 4 areas have scores
  const allAreasFilled = () => {
    const mat = form.watch('mat.correct') || 0
    const nat = form.watch('nat.correct') || 0
    const hum = form.watch('hum.correct') || 0
    const lin = form.watch('lin.correct') || 0
    return mat > 0 && nat > 0 && hum > 0 && lin > 0
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] bg-zinc-900/50 border border-zinc-800 hover:border-[#00ff00]/50 hover:bg-[#00ff00]/5 transition-all group">
           <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00ff00] group-hover:rotate-90 transition-all" />
           <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 group-hover:text-[#00ff00] transition-colors">Adicionar</span>
        </button>
      </DialogTrigger>
      
       <DialogContent className="max-w-6xl bg-[#09090b] border border-zinc-800 p-0 overflow-hidden gap-0 flex flex-col h-[700px] z-50 focus:outline-none focus-visible:outline-none">
         {/* HEADER */}
         <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 relative">
             <DialogTitle className="text-2xl font-black italic tracking-tighter text-zinc-100 flex items-center gap-2">
                 <span className="text-[#00ff00]">&gt;_</span> BATERIA_QUESTÕES
             </DialogTitle>
             
             {/* Close Button - FIXED */}
             <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 z-10 text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-sm hover:bg-zinc-800/50"
             >
                <X className="w-5 h-5" />
             </button>
             
             <div className="flex items-center gap-2">
                 {/* Provider */}
                 <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-2 h-9 gap-1.5">
                     <Fingerprint className="w-3 h-3 text-zinc-600" />
                     <Controller
                        name="provider"
                        control={form.control}
                        render={({ field }) => (
                            <select {...field} className="bg-transparent text-[10px] uppercase font-mono text-zinc-300 focus:outline-none pr-1">
                                <option value="SAS">SAS</option>
                                <option value="BERNOULLI">BER</option>
                                <option value="POLIEDRO">POL</option>
                                <option value="ENEM">ENEM</option>
                                <option value="PPL">PPL</option>
                            </select>
                        )}
                     />
                 </div>
                 
                 {/* Year */}
                 <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-2 h-9 gap-1">
                     <Hash className="w-3 h-3 text-zinc-600" />
                     <input 
                        type="number" 
                        {...form.register('year', { valueAsNumber: true })} 
                        className="bg-transparent text-[10px] font-mono text-zinc-300 focus:outline-none w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     />
                 </div>
                 
                 {/* Edition */}
                 {showEdition && (
                     <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-2 h-9 gap-1">
                         <span className="text-[8px] text-zinc-600 uppercase font-bold">ED</span>
                         <input 
                            type="number" 
                            {...form.register('edition', { valueAsNumber: true })} 
                            className="bg-transparent text-[10px] font-mono text-zinc-300 focus:outline-none w-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={1}
                         />
                     </div>
                 )}
                 
                 {/* Date */}
                 <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-2 h-9 gap-1">
                     <Calendar className="w-3 h-3 text-zinc-600" />
                     <input 
                        type="date" 
                        {...form.register('date')} 
                        className="bg-transparent text-[10px] font-mono text-zinc-300 focus:outline-none w-24"
                     />
                 </div>
                 
                 {/* Time */}
                 <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-2 h-9 gap-1">
                     <Clock className="w-3 h-3 text-zinc-600" />
                     <input 
                        type="number" 
                        {...form.register('timeInMinutes', { valueAsNumber: true })} 
                        className="bg-transparent text-[10px] font-mono text-zinc-300 focus:outline-none w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     />
                     <span className="text-[8px] text-zinc-600 uppercase">min</span>
                 </div>
             </div>
         </div>

         {/* BODY */}
         <div className="flex-1 grid grid-cols-12 overflow-hidden">
             {/* LEFT: Input Area */}
             <div className="col-span-7 p-6 border-r border-zinc-800 overflow-y-auto bg-[#09090b]">
                 <Tabs value={activeTab} onValueChange={setActiveTab}>
                     <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-sm grid grid-cols-4 mb-6 h-12 w-full">
                         {['mat', 'nat', 'hum', 'lin'].map(tab => (
                             <TabsTrigger 
                                key={tab} 
                                value={tab}
                                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#00ff00] text-xs font-black uppercase"
                             >
                                 {tab}
                             </TabsTrigger>
                         ))}
                     </TabsList>

                     {['mat', 'nat', 'hum', 'lin'].map(area => (
                         <TabsContent key={area} value={area}>
                             <AreaInput area={area as any} />
                         </TabsContent>
                     ))}
                 </Tabs>
             </div>

             {/* RIGHT: Feedback */}
             <div className="col-span-5 bg-zinc-950/30 relative">
                 <div className="absolute inset-0 opacity-20" 
                      style={{ backgroundImage: 'linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                 />
                 <div className="relative h-full">
                     {['mat', 'nat', 'hum', 'lin'].map(area => (
                         activeTab === area && <FeedbackPanel key={area} area={area as any} />
                     ))}
                 </div>
             </div>
         </div>

         {/* FOOTER */}
         <button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={!allAreasFilled()}
            className={cn(
                "h-16 font-black text-xl uppercase flex items-center justify-center gap-3 transition-all",
                allAreasFilled()
                    ? "bg-[#00ff00] hover:bg-emerald-400 text-black cursor-pointer"
                    : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
            )}
         >
             <span>[ ENTER ]</span> SALVAR DADOS {!allAreasFilled() && <span className="text-sm">• Preencha todas as áreas</span>}
         </button>
      </DialogContent>
    </Dialog>
  )
}
