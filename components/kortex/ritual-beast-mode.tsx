'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { createOrUpdateDailyLog } from '@/lib/queries'
import { Zap } from 'lucide-react'

interface RitualBeastModeProps {
  initialLog?: {
    questionsCount: number
    sleepOk: boolean
    workoutOk: boolean
    cleanDiet: boolean
    noSocialMedia: boolean
  } | null
}

export function RitualBeastMode({ initialLog }: RitualBeastModeProps) {
  const [isPending, startTransition] = useTransition()
  const [questionsCount, setQuestionsCount] = useState(initialLog?.questionsCount || 0)
  const [habits, setHabits] = useState({
    sleepOk: initialLog?.sleepOk || false,
    workoutOk: initialLog?.workoutOk || false,
    cleanDiet: initialLog?.cleanDiet || false,
    noSocialMedia: initialLog?.noSocialMedia || false,
  })

  const handleSave = () => {
    startTransition(async () => {
      await createOrUpdateDailyLog({
        questionsCount,
        ...habits,
      })
      // Optionally refresh the page to show updated stats
      window.location.reload()
    })
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-cyber-green" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-green">
          RITUAL BEAST MODE
        </h2>
      </div>

      <div className="space-y-4">
        {/* Questions Count Input */}
        <div>
          <label className="mb-2 block text-[9px] uppercase tracking-widest text-zinc-500">
            Questões Hoje
          </label>
          <Input
            type="number"
            value={questionsCount}
            onChange={(e) => setQuestionsCount(parseInt(e.target.value) || 0)}
            className="border-zinc-800 bg-zinc-900 font-mono text-lg text-cyber-green focus-visible:border-cyber-green focus-visible:ring-0"
            placeholder="0"
          />
        </div>

        {/* Habits Checklist */}
        <div className="space-y-3">
          <label className="block text-[9px] uppercase tracking-widest text-zinc-500">
            Hábitos do Dia
          </label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sleep"
              checked={habits.sleepOk}
              onCheckedChange={(checked) =>
                setHabits({ ...habits, sleepOk: checked as boolean })
              }
              className="border-zinc-700 data-[state=checked]:bg-cyber-green data-[state=checked]:border-cyber-green"
            />
            <label
              htmlFor="sleep"
              className="text-xs text-zinc-400 cursor-pointer"
            >
              Sono adequado (7-8h)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="workout"
              checked={habits.workoutOk}
              onCheckedChange={(checked) =>
                setHabits({ ...habits, workoutOk: checked as boolean })
              }
              className="border-zinc-700 data-[state=checked]:bg-cyber-green data-[state=checked]:border-cyber-green"
            />
            <label
              htmlFor="workout"
              className="text-xs text-zinc-400 cursor-pointer"
            >
              Exercício físico
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="diet"
              checked={habits.cleanDiet}
              onCheckedChange={(checked) =>
                setHabits({ ...habits, cleanDiet: checked as boolean })
              }
              className="border-zinc-700 data-[state=checked]:bg-cyber-green data-[state=checked]:border-cyber-green"
            />
            <label
              htmlFor="diet"
              className="text-xs text-zinc-400 cursor-pointer"
            >
              Alimentação limpa
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="social"
              checked={habits.noSocialMedia}
              onCheckedChange={(checked) =>
                setHabits({ ...habits, noSocialMedia: checked as boolean })
              }
              className="border-zinc-700 data-[state=checked]:bg-cyber-green data-[state=checked]:border-cyber-green"
            />
            <label
              htmlFor="social"
              className="text-xs text-zinc-400 cursor-pointer"
            >
              Zero redes sociais
            </label>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-cyber-green text-black font-bold uppercase text-xs tracking-wider hover:bg-cyber-green/90 disabled:opacity-50"
        >
          {isPending ? 'SALVANDO...' : 'REGISTRAR'}
        </Button>
      </div>
    </div>
  )
}
