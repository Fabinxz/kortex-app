'use client'

import { useState, useTransition } from 'react'
import { Beaker, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { reviewError } from '@/lib/queries'

interface PendingError {
  id: string
  description: string
  correction: string
  errorType: string
  reviewCount: number
  topicName: string
  subjectName: string
  subjectColor: string
}

interface LockedTopic {
  id: string
  name: string
  subjectName: string
  subjectColor: string
  unlockProgress: number
  sessionCount: number
  errorCount: number
  difficultyLevel: number
}

interface TacticalLabProps {
  pendingErrors: PendingError[]
  lockedTopics: LockedTopic[]
}

export function TacticalLab({ pendingErrors, lockedTopics }: TacticalLabProps) {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0)
  const [showCorrection, setShowCorrection] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentError = pendingErrors[currentErrorIndex]

  const handleStartReview = () => {
    setIsReviewing(true)
    setShowCorrection(false)
  }

  const handleReviewAnswer = async (correct: boolean) => {
    if (!currentError) return

    startTransition(async () => {
      await reviewError(currentError.id, correct)
      
      // Move to next error
      if (currentErrorIndex < pendingErrors.length - 1) {
        setCurrentErrorIndex(currentErrorIndex + 1)
        setShowCorrection(false)
      } else {
        // Finished all errors
        setIsReviewing(false)
        setCurrentErrorIndex(0)
        window.location.reload() // Refresh to get updated data
      }
    })
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Beaker className="h-4 w-4 text-cyber-cyan" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyber-cyan">
          O LABORATÓRIO // OPERAÇÕES TÁTICAS
        </h2>
      </div>

      <Tabs defaultValue="necrotério" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
          <TabsTrigger 
            value="necrotério"
            className="data-[state=active]:bg-cyber-red data-[state=active]:text-black font-bold uppercase text-[10px]"
          >
            NECROTÉRIO
          </TabsTrigger>
          <TabsTrigger 
            value="protocolo"
            className="data-[state=active]:bg-cyber-amber data-[state=active]:text-black font-bold uppercase text-[10px]"
          >
            PROTOCOLO
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: NECROTÉRIO (Error Review) */}
        <TabsContent value="necrotério" className="mt-4">
          {!isReviewing ? (
            // State A: Empty/Start
            <div className="border border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <div className="mb-4">
                <div className="inline-block rounded-full bg-cyber-red/10 p-4 mb-4">
                  <XCircle className="h-8 w-8 text-cyber-red" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Você tem {pendingErrors.length} erros pendentes
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Revise e elimine seus erros através de repetição espaçada
                </p>
              </div>
              
              <Button
                onClick={handleStartReview}
                disabled={pendingErrors.length === 0}
                className="bg-cyber-red text-black font-bold uppercase text-xs tracking-wider hover:bg-cyber-red/90"
              >
                ELIMINAR ERROS AGORA
              </Button>
            </div>
          ) : (
            // State B: Active Review
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>ERRO {currentErrorIndex + 1} DE {pendingErrors.length}</span>
                <span>REVISÃO #{currentError.reviewCount + 1}</span>
              </div>

              {/* Error Card */}
              <div className="border border-zinc-800 bg-zinc-900 p-6">
                {/* Subject Tag */}
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentError.subjectColor }}
                  />
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                    {currentError.subjectName} • {currentError.topicName}
                  </span>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h4 className="text-[10px] uppercase tracking-widest text-cyber-red mb-2">
                    O QUE VOCÊ ERROU?
                  </h4>
                  <p className="text-sm text-white leading-relaxed">
                    {currentError.description}
                  </p>
                </div>

                {/* Correction (Hidden until revealed) */}
                <div className="border-t border-zinc-800 pt-4">
                  {!showCorrection ? (
                    <Button
                      onClick={() => setShowCorrection(true)}
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-400 hover:border-cyber-cyan hover:text-cyber-cyan"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      REVELAR CORREÇÃO
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-sm">
                        <h4 className="text-[10px] uppercase tracking-widest text-cyber-green mb-2 flex items-center gap-2">
                          <EyeOff className="h-3 w-3" />
                          CORREÇÃO
                        </h4>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {currentError.correction}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleReviewAnswer(false)}
                          disabled={isPending}
                          className="bg-zinc-800 text-white hover:bg-zinc-700 font-bold uppercase text-[10px]"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          ERREI
                        </Button>
                        <Button
                          onClick={() => handleReviewAnswer(true)}
                          disabled={isPending}
                          className="bg-cyber-green text-black hover:bg-cyber-green/90 font-bold uppercase text-[10px]"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          ACERTEI
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: PROTOCOLO DE DESBLOQUEIO */}
        <TabsContent value="protocolo" className="mt-4">
          <div className="space-y-3">
            {lockedTopics.map((topic) => (
              <div
                key={topic.id}
                className="border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Topic Name */}
                    <div className="mb-2 flex items-center gap-2">
                      <Lock className="h-3 w-3 text-cyber-amber" />
                      <span className="text-sm font-bold text-cyber-amber">
                        {topic.name}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: topic.subjectColor }}
                      />
                      <span className="text-[9px] text-zinc-500">
                        {topic.subjectName}
                      </span>
                    </div>

                    {/* Mission */}
                    <div className="mb-2">
                      <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                        Missão: Acertar 5 questões seguidas
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="h-2 w-full bg-zinc-800">
                        <div
                          className="h-full bg-cyber-amber"
                          style={{ width: `${topic.unlockProgress}%` }}
                        />
                      </div>
                      <span className="absolute right-0 -top-5 text-[9px] font-mono text-cyber-amber">
                        {topic.unlockProgress}%
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-2 flex items-center gap-3 text-[9px] text-zinc-600 font-mono">
                      <span>{topic.sessionCount} sessões</span>
                      <span>•</span>
                      <span>{topic.errorCount} erros</span>
                      <span>•</span>
                      <span>Dif. {topic.difficultyLevel}/5</span>
                    </div>
                  </div>

                  {/* Lock Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-sm bg-cyber-amber/10 p-3">
                      <Lock className="h-6 w-6 text-cyber-amber" />
                    </div>
                    <span className="text-[8px] text-cyber-amber font-bold">
                      BLOQUEADO
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {lockedTopics.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-sm">
                Nenhum tópico bloqueado! Todos desbloqueados! 🔓
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
