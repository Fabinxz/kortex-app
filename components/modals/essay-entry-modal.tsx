'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Fingerprint, Hash, Calendar, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// === SCHEMA ===
const essaySchema = z.object({
  provider: z.enum(['SAS', 'BERNOULLI', 'ENEM', 'CUSTOM']),
  year: z.number().min(2000).max(2100),
  date: z.string(),
  timeInMinutes: z.number().min(0),
  c1: z.number().min(0).max(200),
  c2: z.number().min(0).max(200),
  c3: z.number().min(0).max(200),
  c4: z.number().min(0).max(200),
  c5: z.number().min(0).max(200),
})

type EssayFormValues = z.infer<typeof essaySchema>

// === CIRCULAR GAUGE (Reused from Simulado) ===
const CircularGauge = ({ percentage, isLocked }: { percentage: number; isLocked: boolean }) => {
    const radius = 70
    const stroke = 8
    const normalizedRadius = radius - stroke / 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const getColor = () => {
        if (percentage >= 80) return '#00ff00'
        if (percentage >= 60) return '#fbbf24'
        return '#ef4444'
    }

    const color = getColor()

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    stroke="#27272a"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress circle */}
                <motion.circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    initial={false}
                    animate={{ 
                        strokeDashoffset,
                        stroke: color
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
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

export function EssayEntryModal() {
  const [open, setOpen] = useState(false)
  
  const form = useForm<EssayFormValues>({
    resolver: zodResolver(essaySchema),
    defaultValues: {
      provider: 'SAS',
      year: new Date().getFullYear(),
      date: new Date().toISOString().split('T')[0],
      timeInMinutes: 60,
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0,
    },
  })

  // Watch all competencies
  const c1 = form.watch('c1') || 0
  const c2 = form.watch('c2') || 0
  const c3 = form.watch('c3') || 0
  const c4 = form.watch('c4') || 0
  const c5 = form.watch('c5') || 0
  
  const totalScore = c1 + c2 + c3 + c4 + c5
  const percentage = Math.round((totalScore / 1000) * 100)

  // Color coding for total score
  const getScoreColor = () => {
    if (totalScore >= 800) return 'text-[#00ff00]'
    if (totalScore >= 600) return 'text-yellow-500'
    return 'text-red-500'
  }

  // Check if all competencies filled
  const allCompetenciesFilled = () => {
    return c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0 && c5 > 0
  }

  const onSubmit = (data: EssayFormValues) => {
    setOpen(false)
  }

  // === COMPETENCY INPUT COMPONENT ===
  const CompetencyInput = ({ 
    index, 
    label 
  }: { 
    index: 1 | 2 | 3 | 4 | 5
    label: string 
  }) => {
    const fieldName = `c${index}` as keyof EssayFormValues
    const value = form.watch(fieldName) as number || 0
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const val = parseInt(inputValue) || 0
        const clamped = Math.max(0, Math.min(200, val))
        form.setValue(fieldName, clamped)
        setInputValue(clamped.toString())
        
        // Move to next competency
        if (index < 5) {
          const nextInput = document.querySelector(`input[name="c${index + 1}"]`) as HTMLInputElement
          nextInput?.focus()
        }
      }
    }

    return (
      <div className="flex items-center gap-3">
        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold w-8">
          {label}
        </Label>
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-sm px-3 h-10 flex items-center">
          <input
            name={fieldName}
            type="number"
            value={value > 0 ? value : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            min={0}
            max={200}
            step={40}
            className="bg-transparent text-[11px] font-mono text-zinc-300 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0-200"
          />
        </div>
        <span className="text-[9px] text-zinc-600 font-mono w-16">
          {value > 0 && `${value} pts`}
        </span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] bg-zinc-900/50 border border-zinc-800 hover:border-[#00ff00]/50 hover:bg-[#00ff00]/5 transition-all group">
           <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00ff00] group-hover:rotate-90 transition-all" />
           <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 group-hover:text-[#00ff00] transition-colors">Adicionar</span>
        </button>
      </DialogTrigger>
      
       <DialogContent className="max-w-5xl bg-[#09090b] border border-zinc-800 p-0 overflow-hidden gap-0 flex flex-col h-[650px] z-50 focus:outline-none focus-visible:outline-none">
         {/* HEADER */}
         <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 relative">
             <DialogTitle className="text-2xl font-black italic tracking-tighter text-zinc-100 flex items-center gap-2">
                 <span className="text-[#00ff00]">&gt;_</span> REGISTRO_REDAÇÃO
             </DialogTitle>
             
             {/* Close Button */}
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
                     <select 
                        {...form.register('provider')}
                        className="bg-transparent text-[10px] uppercase font-mono text-zinc-300 focus:outline-none pr-1"
                     >
                         <option value="SAS">SAS</option>
                         <option value="BERNOULLI">BER</option>
                         <option value="ENEM">ENEM</option>
                         <option value="CUSTOM">OUTRO</option>
                     </select>
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

         {/* MAIN CONTENT - SPLIT LAYOUT */}
         <div className="flex-1 flex overflow-hidden">
             {/* LEFT: COMPETENCY INPUTS (60%) */}
             <div className="w-[60%] border-r border-zinc-800 p-6 overflow-y-auto">
                 <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">
                     Competências (0-200 cada)
                 </Label>
                 
                 <div className="space-y-3">
                     <CompetencyInput index={1} label="C1" />
                     <CompetencyInput index={2} label="C2" />
                     <CompetencyInput index={3} label="C3" />
                     <CompetencyInput index={4} label="C4" />
                     <CompetencyInput index={5} label="C5" />
                 </div>

                 <div className="mt-6 p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                     <p className="text-[9px] text-zinc-600 font-mono">
                         <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[#00ff00]">ENTER</kbd> para confirmar • 
                         <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-cyan-500 ml-1">TAB</kbd> para navegar
                     </p>
                 </div>
             </div>

             {/* RIGHT: FEEDBACK PANEL (40%) */}
             <div className="w-[40%] p-6 flex flex-col items-center justify-center gap-8">
                 <div className="text-center">
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-3">PONTUAÇÃO TOTAL</span>
                     <motion.div 
                        className={cn("text-8xl font-black font-mono", getScoreColor())}
                        initial={false}
                        animate={{ scale: allCompetenciesFilled() ? 1 : 0.95, opacity: allCompetenciesFilled() ? 1 : 0.5 }}
                        style={{ textShadow: allCompetenciesFilled() ? `0 0 30px ${totalScore >= 800 ? '#00ff00' : totalScore >= 600 ? '#fbbf24' : '#ef4444'}50` : 'none' }}
                     >
                         {totalScore}
                     </motion.div>
                     <span className="text-zinc-600 text-sm font-mono">/ 1000</span>
                 </div>

                 <CircularGauge percentage={percentage} isLocked={allCompetenciesFilled()} />

                 <div className="text-center">
                     <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">EFICIÊNCIA</span>
                 </div>
             </div>
         </div>

         {/* FOOTER */}
         <button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={!allCompetenciesFilled()}
            className={cn(
                "h-16 font-black text-xl uppercase flex items-center justify-center gap-3 transition-all",
                allCompetenciesFilled()
                    ? "bg-[#00ff00] hover:bg-emerald-400 text-black cursor-pointer"
                    : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
            )}
         >
             <span>[ ENTER ]</span> SALVAR DADOS {!allCompetenciesFilled() && <span className="text-sm">• Preencha todas as competências</span>}
         </button>
       </DialogContent>
    </Dialog>
  )
}
