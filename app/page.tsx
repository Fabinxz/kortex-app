import { DashboardWrapper } from '@/components/kortex/dashboard-wrapper'
import { StatsBar } from '@/components/kortex/stats-bar'
import { TopicHeatmap } from '@/components/kortex/topic-heatmap'
import { PerformanceSection } from '@/components/kortex/performance-section'
import {
  getDashboardStats,
  getEssayPerformance,
  getSimulationPerformance,
  type DateRange,
} from '@/lib/queries'

interface PageProps {
  searchParams: Promise<{ range?: DateRange }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const range = params.range || 'month'

  const [
    stats,
    essays,
    simulations,
  ] = await Promise.all([
    getDashboardStats(range),
    getEssayPerformance(range),
    getSimulationPerformance(range),
  ])


  return (
    <div className="min-h-screen bg-background">
      <DashboardWrapper>
        {/* Stats Bar */}
        <div className="p-4">
          <StatsBar stats={stats} />
        </div>

      {/* Performance Charts - Full Width Grid */}
      <div className="p-4 pt-0 space-y-4">
        <PerformanceSection simulations={simulations} essays={essays} />
        <TopicHeatmap />
      </div>




      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 p-4 text-center bg-white dark:bg-transparent">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-zinc-600">
          KORTEX v1.0 // SISTEMA DE PERFORMANCE COGNITIVA // TODOS OS SISTEMAS OPERACIONAIS
        </p>
        <p className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-zinc-700 mt-1">
          Desenvolvido para Medicina • FUVEST • ENEM • Vestibulares
        </p>
      </footer>
      </DashboardWrapper>
    </div>
  )
}
