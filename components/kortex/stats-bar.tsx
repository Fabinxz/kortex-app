import { TrendingUp, Target, Activity, Flame, Hourglass } from 'lucide-react'

interface StatsBarProps {
  stats: {
    totalTopics: number
    masteredTopics: number
    weeklyStudyHours: string
    dayStreak: number
    streakRecord: number
    nextExamName: string
    daysUntilExam: number
    questionsCount: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  const masteryPercentage = Math.round((stats.masteredTopics / stats.totalTopics) * 100)

  // Calculate current pace (questions per day since start of tracking)
  const START_DATE = new Date('2025-11-17') // Start of tracking
  const today = new Date()
  const daysElapsed = Math.ceil((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24))
  const currentPace = daysElapsed > 0 ? Math.round(stats.questionsCount / daysElapsed) : 0

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {/* Matérias Dominadas */}
      <div className="border border-gray-200 dark:border-zinc-800 border-t-2 border-t-emerald-500 dark:border-t-[#00ff88] bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-cyber-green" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Matérias
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-cyber-green dark:glow-green">
            {stats.masteredTopics}
          </span>
          <span className="font-mono text-lg text-slate-400 dark:text-zinc-600">/</span>
          <span className="font-mono text-lg text-slate-600 dark:text-zinc-400">
            {stats.totalTopics}
          </span>
        </div>
        <div className="mt-1 h-1 w-full bg-gray-100 dark:bg-zinc-900">
          <div
            className="h-full bg-emerald-600 dark:bg-cyber-green"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* Horas Líquidas */}
      <div className="border border-gray-200 dark:border-zinc-800 border-t-2 border-t-cyan-500 dark:border-t-[#00d8ff] bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-3 w-3 text-cyan-600 dark:text-cyber-cyan" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Horas Líq.
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-cyan-600 dark:text-cyber-cyan dark:glow-cyan">
            {stats.weeklyStudyHours}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-zinc-500">h</span>
        </div>
      </div>

      {/* Day Streak */}
      <div className="border border-gray-200 dark:border-zinc-800 border-t-2 border-t-orange-500 dark:border-t-[#ff5f1f] bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-3 w-3 text-orange-600 dark:text-[#ff5f1f]" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Sequência
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-mono text-2xl font-bold text-orange-600 dark:text-[#ff5f1f]" style={{ textShadow: 'var(--tw-shadow, none)' }}>
            {stats.dayStreak}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-zinc-500">dias</span>
        </div>
        <div className="text-[8px] text-slate-500 dark:text-zinc-600">
          Recorde: {stats.streakRecord} dias
        </div>
      </div>

      {/* Smart Countdown */}
      <div className="border border-gray-200 dark:border-zinc-800 border-t-2 border-t-amber-500 dark:border-t-[#ffb800] bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Hourglass className="h-3 w-3 text-amber-600 dark:text-cyber-amber" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Contagem Regressiva // {stats.nextExamName}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-mono text-2xl font-bold text-amber-600 dark:text-cyber-amber" style={{ textShadow: 'var(--tw-shadow, none)' }}>
            {stats.daysUntilExam > 0 ? stats.daysUntilExam : '✓'}
          </span>
          {stats.daysUntilExam > 0 && (
            <span className="font-mono text-sm text-slate-500 dark:text-zinc-500">dias</span>
          )}
        </div>
        <div className="text-[8px] text-slate-500 dark:text-zinc-600">
          {stats.daysUntilExam > 0 ? 'Foco total' : 'Parabéns!'}
        </div>
      </div>

      {/* Questões Feitas - Infinite Counter */}
      <div className="border border-gray-200 dark:border-zinc-800 border-t-2 border-t-emerald-500 dark:border-t-[#00ff88] bg-white dark:bg-zinc-950 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-3 w-3 text-emerald-600 dark:text-cyber-green" />
          <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-cyber-green">
            Questões
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-mono text-3xl font-black text-emerald-600 dark:text-cyber-green dark:glow-green">
            {stats.questionsCount.toLocaleString('pt-BR')}
          </span>
        </div>
        <div className="text-[8px] text-slate-500 dark:text-zinc-600">
          Ritmo: {currentPace}/dia
        </div>
      </div>
    </div>
  )
}
