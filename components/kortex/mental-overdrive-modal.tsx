'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Zap, Trophy, Target, Flame, Atom, Calculator, Percent, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

type Difficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
type GamePhase = 'setup' | 'playing' | 'results'
type SessionDuration = 30 | 60 | 120
type Protocol = 'DECIMAL_CRUSHER' | 'PERCENT_SHREDDER' | 'SCIENCE_NOTATION' | 'FACTOR_X'

interface Question {
  question: string
  answer: number | ScientificNotationAnswer
  displayQuestion: string // For special formatting
}

interface ScientificNotationAnswer {
  mantissa: number
  exponent: number
}

interface MentalOverdriveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MentalOverdriveModal({ isOpen, onClose }: MentalOverdriveModalProps) {
  // Game State
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('INTERMEDIATE')
  const [sessionDuration, setSessionDuration] = useState<SessionDuration>(60)
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>('DECIMAL_CRUSHER')
  
  // Playing State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userInput, setUserInput] = useState('')
  const [mantissaInput, setMantissaInput] = useState('') // For Protocol C
  const [exponentInput, setExponentInput] = useState('') // For Protocol C
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'error' | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const mantissaRef = useRef<HTMLInputElement>(null)
  const exponentRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Protocol Metadata
  const protocolInfo = {
    DECIMAL_CRUSHER: {
      name: 'DECIMAL CRUSHER',
      description: 'Ordens de Grandeza',
      icon: Calculator,
      color: 'cyan'
    },
    PERCENT_SHREDDER: {
      name: 'PERCENT SHREDDER',
      description: 'Matemática Financeira',
      icon: Percent,
      color: 'green'
    },
    SCIENCE_NOTATION: {
      name: 'SCIENCE NOTATION',
      description: 'Notação Científica',
      icon: Atom,
      color: 'purple'
    },
    FACTOR_X: {
      name: 'FACTOR X',
      description: 'Geometria & Radiciação',
      icon: Square,
      color: 'orange'
    }
  }

  // ============================================
  // PROTOCOL A: DECIMAL_CRUSHER
  // ============================================
  const generateDecimalCrusher = (diff: Difficulty): Question => {
    const isMultiplication = Math.random() > 0.5
    
    if (diff === 'BASIC') {
      const decimals = [0.05, 0.1, 0.2, 0.25, 0.5, 1.5, 2.5]
      const integers = [10, 12, 15, 16, 20, 24, 25, 30, 40, 50, 60, 80, 100]
      
      const decimal = decimals[Math.floor(Math.random() * decimals.length)]
      const integer = integers[Math.floor(Math.random() * integers.length)]
      
      if (isMultiplication) {
        const answer = integer * decimal
        return {
          question: `${integer} × ${decimal}`,
          answer,
          displayQuestion: `${integer} × ${decimal}`
        }
      } else {
        const answer = integer / decimal
        return {
          question: `${integer} ÷ ${decimal}`,
          answer,
          displayQuestion: `${integer} ÷ ${decimal}`
        }
      }
    } else if (diff === 'INTERMEDIATE') {
      const decimals = [0.02, 0.025, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5]
      const integers = [12, 15, 20, 24, 25, 30, 40, 48, 50, 60, 75, 80, 100, 120, 150, 200]
      
      const decimal = decimals[Math.floor(Math.random() * decimals.length)]
      const integer = integers[Math.floor(Math.random() * integers.length)]
      
      if (isMultiplication) {
        const answer = integer * decimal
        return {
          question: `${integer} × ${decimal}`,
          answer,
          displayQuestion: `${integer} × ${decimal}`
        }
      } else {
        const answer = integer / decimal
        return {
          question: `${integer} ÷ ${decimal}`,
          answer,
          displayQuestion: `${integer} ÷ ${decimal}`
        }
      }
    } else {
      // ADVANCED
      const decimals = [0.004, 0.005, 0.02, 0.025, 0.04, 0.05, 0.1, 0.125, 0.2, 0.25]
      const integers = [20, 24, 25, 30, 40, 48, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400]
      
      const decimal = decimals[Math.floor(Math.random() * decimals.length)]
      const integer = integers[Math.floor(Math.random() * integers.length)]
      
      if (isMultiplication) {
        const answer = integer * decimal
        return {
          question: `${integer} × ${decimal}`,
          answer,
          displayQuestion: `${integer} × ${decimal}`
        }
      } else {
        const answer = integer / decimal
        return {
          question: `${integer} ÷ ${decimal}`,
          answer,
          displayQuestion: `${integer} ÷ ${decimal}`
        }
      }
    }
  }

  // ============================================
  // PROTOCOL B: PERCENT_SHREDDER
  // ============================================
  const generatePercentShredder = (diff: Difficulty): Question => {
    const examPercentages = [1, 5, 10, 15, 20, 25, 50]
    const advancedPercentages = [12, 150, ...examPercentages]
    
    const percentages = diff === 'ADVANCED' ? advancedPercentages : examPercentages
    const pct = percentages[Math.floor(Math.random() * percentages.length)]
    
    // Determine if increase/decrease format (only for INTERMEDIATE and ADVANCED)
    const useModifier = diff !== 'BASIC' && Math.random() > 0.5
    
    if (useModifier) {
      const isIncrease = Math.random() > 0.5
      // Generate base number that results in clean answer
      const baseNumbers = {
        1: [100, 200, 300, 400, 500],
        5: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
        10: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300],
        15: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
        20: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 150, 200],
        25: [4, 8, 12, 16, 20, 24, 28, 32, 40, 60, 80, 100, 120, 200],
        50: [2, 4, 6, 8, 10, 12, 14, 16, 20, 30, 40, 50, 60, 80, 100, 150, 200],
        12: [25, 50, 75, 100, 125, 150, 175, 200],
        150: [10, 20, 30, 40, 50, 60, 80, 100]
      }
      
      const bases = baseNumbers[pct as keyof typeof baseNumbers] || [100, 200, 300]
      const base = bases[Math.floor(Math.random() * bases.length)]
      
      if (isIncrease) {
        const answer = base * (1 + pct / 100)
        return {
          question: `${base} + ${pct}%`,
          answer,
          displayQuestion: `${base} + ${pct}%`
        }
      } else {
        const answer = base * (1 - pct / 100)
        return {
          question: `${base} - ${pct}%`,
          answer,
          displayQuestion: `${base} - ${pct}%`
        }
      }
    } else {
      // Standard "X% DE Y" format
      const baseNumbers = {
        1: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        5: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 300, 400, 500],
        10: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500],
        15: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 300, 400],
        20: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 150, 200, 250, 300, 400, 500],
        25: [4, 8, 12, 16, 20, 24, 28, 32, 40, 60, 80, 100, 120, 160, 200, 240, 400],
        50: [2, 4, 6, 8, 10, 12, 14, 16, 20, 30, 40, 50, 60, 80, 100, 150, 200, 300, 400],
        12: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250],
        150: [10, 20, 30, 40, 50, 60, 80, 100, 120, 140]
      }
      
      const bases = baseNumbers[pct as keyof typeof baseNumbers] || [100, 200, 300]
      const base = bases[Math.floor(Math.random() * bases.length)]
      const answer = (base * pct) / 100
      
      return {
        question: `${pct}% DE ${base}`,
        answer,
        displayQuestion: `${pct}% DE ${base}`
      }
    }
  }

  // ============================================
  // PROTOCOL C: SCIENCE_NOTATION
  // ============================================
  const generateScienceNotation = (diff: Difficulty): Question => {
    const isMultiplication = Math.random() > 0.5
    
    // Simple mantissa pairs for easy calculation
    const multPairs = [
      [2, 4.5], [2, 3], [3, 6], [4, 2.5], [5, 2], [3, 4], [2, 5], [4, 3], [6, 2], [8, 1.5]
    ]
    const divPairs = [
      [9, 3], [8, 4], [6, 2], [12, 4], [15, 3], [18, 6], [20, 5], [24, 6], [10, 2], [16, 8]
    ]
    
    if (isMultiplication) {
      const pair = multPairs[Math.floor(Math.random() * multPairs.length)]
      const [a, b] = pair
      
      // Generate exponents based on difficulty
      let expRange: number[]
      if (diff === 'BASIC') {
        expRange = [-3, -2, -1, 0, 1, 2, 3]
      } else if (diff === 'INTERMEDIATE') {
        expRange = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
      } else {
        expRange = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
      
      const exp1 = expRange[Math.floor(Math.random() * expRange.length)]
      const exp2 = expRange[Math.floor(Math.random() * expRange.length)]
      
      const answerMantissa = a * b
      const answerExponent = exp1 + exp2
      
      // Display with superscripts
      const displayExp1 = formatExponent(exp1)
      const displayExp2 = formatExponent(exp2)
      
      return {
        question: `(${a}·10${displayExp1}) × (${b}·10${displayExp2})`,
        answer: { mantissa: answerMantissa, exponent: answerExponent },
        displayQuestion: `(${a}·10${displayExp1}) × (${b}·10${displayExp2})`
      }
    } else {
      const pair = divPairs[Math.floor(Math.random() * divPairs.length)]
      const [a, b] = pair
      
      let expRange: number[]
      if (diff === 'BASIC') {
        expRange = [-3, -2, -1, 0, 1, 2, 3]
      } else if (diff === 'INTERMEDIATE') {
        expRange = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
      } else {
        expRange = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
      
      const exp1 = expRange[Math.floor(Math.random() * expRange.length)]
      const exp2 = expRange[Math.floor(Math.random() * expRange.length)]
      
      const answerMantissa = a / b
      const answerExponent = exp1 - exp2
      
      const displayExp1 = formatExponent(exp1)
      const displayExp2 = formatExponent(exp2)
      
      return {
        question: `(${a}·10${displayExp1}) ÷ (${b}·10${displayExp2})`,
        answer: { mantissa: answerMantissa, exponent: answerExponent },
        displayQuestion: `(${a}·10${displayExp1}) ÷ (${b}·10${displayExp2})`
      }
    }
  }

  // Helper to format exponents with superscripts
  const formatExponent = (exp: number): string => {
    const superscripts: { [key: string]: string } = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻'
    }
    
    return exp.toString().split('').map(char => superscripts[char] || char).join('')
  }

  // ============================================
  // PROTOCOL D: FACTOR_X
  // ============================================
  const generateFactorX = (diff: Difficulty): Question => {
    const questionTypes = ['square', 'root', 'pi']
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    
    if (type === 'square') {
      let range: number[]
      if (diff === 'BASIC') {
        range = [11, 12, 13, 14, 15]
      } else if (diff === 'INTERMEDIATE') {
        range = [16, 17, 18, 19, 20]
      } else {
        range = [21, 22, 23, 24, 25]
      }
      
      const base = range[Math.floor(Math.random() * range.length)]
      const answer = base * base
      
      return {
        question: `${base}²`,
        answer,
        displayQuestion: `${base}²`
      }
    } else if (type === 'root') {
      const perfectSquares = {
        BASIC: [4, 9, 16, 25, 36, 49, 64, 81, 100],
        INTERMEDIATE: [121, 144, 169, 196, 225, 256, 289, 324, 361, 400],
        ADVANCED: [441, 484, 529, 576, 625]
      }
      
      const squares = perfectSquares[diff]
      const square = squares[Math.floor(Math.random() * squares.length)]
      const answer = Math.sqrt(square)
      
      return {
        question: `√${square}`,
        answer,
        displayQuestion: `√${square}`
      }
    } else {
      // Pi simulation (N × 3)
      let range: number[]
      if (diff === 'BASIC') {
        range = [5, 6, 7, 8, 9, 10, 12, 14]
      } else if (diff === 'INTERMEDIATE') {
        range = [15, 16, 18, 20, 21, 22, 24, 25]
      } else {
        range = [26, 27, 28, 30, 32, 35, 40, 45, 50]
      }
      
      const n = range[Math.floor(Math.random() * range.length)]
      const answer = n * 3
      
      return {
        question: `${n} × 3`,
        answer,
        displayQuestion: `${n} × 3`
      }
    }
  }

  // ============================================
  // MAIN QUESTION GENERATOR
  // ============================================
  const generateQuestion = (protocol: Protocol, diff: Difficulty): Question => {
    switch (protocol) {
      case 'DECIMAL_CRUSHER':
        return generateDecimalCrusher(diff)
      case 'PERCENT_SHREDDER':
        return generatePercentShredder(diff)
      case 'SCIENCE_NOTATION':
        return generateScienceNotation(diff)
      case 'FACTOR_X':
        return generateFactorX(diff)
    }
  }

  // Start game
  const startGame = () => {
    setGamePhase('playing')
    setCurrentQuestion(generateQuestion(selectedProtocol, difficulty))
    setUserInput('')
    setMantissaInput('')
    setExponentInput('')
    setSessionTimeLeft(sessionDuration)
    setCorrectAnswers(0)
    setTotalAttempts(0)
    setStartTime(Date.now())
    setFeedback(null)
  }

  // Global timer effect
  useEffect(() => {
    if (gamePhase === 'playing' && sessionTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSessionTimeLeft(prev => Math.max(0, prev - 0.1))
      }, 100)
    } else if (gamePhase === 'playing' && sessionTimeLeft <= 0) {
      setGamePhase('results')
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [gamePhase, sessionTimeLeft])

  // Instant validation for standard protocols (A, B, D)
  useEffect(() => {
    if (gamePhase !== 'playing' || !currentQuestion || selectedProtocol === 'SCIENCE_NOTATION') return
    if (!userInput) return

    const userAnswer = parseFloat(userInput)
    
    if (userAnswer === currentQuestion.answer) {
      // Correct!
      setFeedback('correct')
      setCorrectAnswers(prev => prev + 1)
      setTotalAttempts(prev => prev + 1)
      
      setUserInput('')
      setCurrentQuestion(generateQuestion(selectedProtocol, difficulty))
      
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 150)
      
    } else if (userInput.length > currentQuestion.answer.toString().length) {
      // Wrong answer
      setFeedback('error')
      setTotalAttempts(prev => prev + 1)
      setUserInput('')
      
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 150)
    }
  }, [userInput, gamePhase, currentQuestion, selectedProtocol, difficulty])

  // Instant validation for Protocol C (SCIENCE_NOTATION)
  useEffect(() => {
    if (gamePhase !== 'playing' || !currentQuestion || selectedProtocol !== 'SCIENCE_NOTATION') return
    if (!mantissaInput || !exponentInput) return

    const answer = currentQuestion.answer as ScientificNotationAnswer
    const userMantissa = parseFloat(mantissaInput)
    const userExponent = parseInt(exponentInput)
    
    if (userMantissa === answer.mantissa && userExponent === answer.exponent) {
      // Correct!
      setFeedback('correct')
      setCorrectAnswers(prev => prev + 1)
      setTotalAttempts(prev => prev + 1)
      
      setMantissaInput('')
      setExponentInput('')
      setCurrentQuestion(generateQuestion(selectedProtocol, difficulty))
      
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 150)
      
    } else if (mantissaInput.length > 4 || exponentInput.length > 3) {
      // Wrong answer (too many digits)
      setFeedback('error')
      setTotalAttempts(prev => prev + 1)
      setMantissaInput('')
      setExponentInput('')
      
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 150)
    }
  }, [mantissaInput, exponentInput, gamePhase, currentQuestion, selectedProtocol, difficulty])

  // Auto-focus input
  useEffect(() => {
    if (isOpen && gamePhase === 'playing') {
      if (selectedProtocol === 'SCIENCE_NOTATION') {
        mantissaRef.current?.focus()
      } else {
        inputRef.current?.focus()
      }
    }
  }, [isOpen, gamePhase, selectedProtocol])

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
    setGamePhase('setup')
    setUserInput('')
    setMantissaInput('')
    setExponentInput('')
    setFeedback(null)
  }

  const handleNewSession = () => {
    setGamePhase('setup')
    setUserInput('')
    setMantissaInput('')
    setExponentInput('')
    setFeedback(null)
  }

  if (!isOpen) return null

  // Calculate results
  const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts * 100) : 0
  const mpm = sessionDuration > 0 ? (correctAnswers / (sessionDuration / 60)) : 0
  const minutes = Math.floor(sessionTimeLeft / 60)
  const seconds = Math.floor(sessionTimeLeft % 60)
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-150",
        "bg-white/90 dark:bg-black/90",
        feedback === 'correct' && "bg-emerald-50 dark:bg-green-500/10",
        feedback === 'error' && "bg-red-50 dark:bg-red-500/20"
      )}
    >
      {/* Main Terminal Container */}
      <div 
        className={cn(
          "relative w-full max-w-4xl mx-4 bg-white dark:bg-black border-2 rounded-lg overflow-hidden transition-all duration-150",
          feedback === 'correct' && "border-emerald-600 dark:border-cyber-green shadow-lg shadow-emerald-200 dark:shadow-[0_0_30px_rgba(0,255,65,0.5)]",
          feedback === 'error' && "border-red-600 dark:border-cyber-red shadow-lg shadow-red-200 dark:shadow-[0_0_30px_rgba(255,0,60,0.5)]",
          !feedback && "border-gray-300 dark:border-cyber-green/50 shadow-xl dark:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        )}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 dark:text-zinc-600 hover:text-red-600 dark:hover:text-cyber-red transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-cyber-green/30 p-4 bg-gray-50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-cyber-green" />
              <h2 className="text-emerald-600 dark:text-cyber-green font-mono text-sm uppercase tracking-widest font-black">
                [ MENTAL OVERDRIVE // PROTOCOL TRAINING ]
              </h2>
            </div>
            
            {/* Timer Display (during playing) */}
            {gamePhase === 'playing' && (
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-500 dark:text-zinc-600 uppercase text-[10px] tracking-widest">TIME:</span>
                <span className={cn(
                  "font-bold text-xl",
                  sessionTimeLeft > 10 ? "text-emerald-600 dark:text-cyber-green" : "text-red-600 dark:text-cyber-red animate-pulse"
                )}>
                  {timeDisplay}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-12 flex flex-col items-center justify-center min-h-[500px] relative">
          
          {/* SETUP SCREEN */}
          {gamePhase === 'setup' && (
            <div className="text-center space-y-8 w-full max-w-2xl">
              <div className="text-slate-500 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider mb-8">
                SISTEMA DE TREINAMENTO HEURÍSTICO
              </div>

              {/* Protocol Selector */}
              <div className="space-y-4">
                <div className="text-[10px] text-slate-500 dark:text-zinc-600 uppercase tracking-widest">PROTOCOLO DE TREINAMENTO:</div>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(protocolInfo) as Protocol[]).map((protocol) => {
                    const info = protocolInfo[protocol]
                    const Icon = info.icon
                    return (
                      <button
                        key={protocol}
                        onClick={() => setSelectedProtocol(protocol)}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          selectedProtocol === protocol
                            ? "bg-emerald-50 dark:bg-cyber-green/10 text-emerald-600 dark:text-cyber-green border-emerald-600 dark:border-cyber-green shadow-md dark:shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                            : "bg-gray-50 dark:bg-zinc-950/50 text-slate-500 dark:text-zinc-500 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <div className="font-bold font-mono text-xs">{info.name}</div>
                        </div>
                        <div className="text-[9px] font-mono opacity-70">{info.description}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty Selector */}
              <div className="space-y-4">
                <div className="text-[10px] text-slate-500 dark:text-zinc-600 uppercase tracking-widest">NÍVEL:</div>
                <div className="flex gap-3 justify-center">
                  {(['BASIC', 'INTERMEDIATE', 'ADVANCED'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                        className={cn(
                          "px-4 py-2 text-xs font-bold font-mono uppercase rounded border transition-all",
                          difficulty === diff
                            ? "bg-emerald-100 dark:bg-cyber-green/20 text-emerald-700 dark:text-cyber-green border-emerald-600 dark:border-cyber-green"
                            : "bg-transparent text-slate-500 dark:text-zinc-600 border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600"
                        )}
                    >
                      {diff === 'INTERMEDIATE' ? 'INTER' : diff.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-4">
                <div className="text-[10px] text-slate-500 dark:text-zinc-600 uppercase tracking-widest">DURAÇÃO:</div>
                <div className="flex gap-4 justify-center">
                  {([30, 60, 120] as SessionDuration[]).map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSessionDuration(duration)}
                        className={cn(
                          "px-8 py-3 text-lg font-bold font-mono uppercase rounded-lg border-2 transition-all",
                          sessionDuration === duration
                            ? "bg-emerald-600 dark:bg-cyber-green/20 text-white dark:text-cyber-green border-emerald-600 dark:border-cyber-green shadow-lg dark:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                            : "bg-transparent text-slate-500 dark:text-zinc-500 border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600"
                        )}
                    >
                      {duration}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startGame}
                className="mt-8 bg-emerald-600 dark:bg-cyber-green text-white dark:text-black font-black uppercase tracking-widest py-4 px-12 rounded hover:bg-emerald-700 dark:hover:bg-[#00ff99] shadow-lg dark:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all active:scale-[0.98] font-mono text-sm"
              >
                [ INICIAR PROTOCOLO ]
              </button>

              <div className="text-[9px] text-zinc-700 font-mono uppercase tracking-wider mt-8">
                PRESSIONE ESC PARA FECHAR
              </div>
            </div>
          )}

          {/* PLAYING SCREEN */}
          {gamePhase === 'playing' && (
            <div className="w-full space-y-8">
              {/* Correct Answers Counter */}
              <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-sm">
                <Target className="w-4 h-4 text-emerald-600 dark:text-cyber-green" />
                <span className="text-slate-500 dark:text-zinc-600 uppercase text-[10px] tracking-widest">ACERTOS:</span>
                <span className="text-emerald-600 dark:text-cyber-green font-bold text-lg dark:glow-green">{correctAnswers}</span>
                {correctAnswers > 0 && <Flame className="w-5 h-5 text-orange-500 dark:text-orange-500" />}
              </div>

              {/* Protocol Badge */}
              <div className="absolute top-4 right-16 flex items-center gap-2 font-mono text-sm">
                <span className="text-slate-500 dark:text-zinc-600 uppercase text-[9px] tracking-widest">
                  {protocolInfo[selectedProtocol].name}
                </span>
              </div>

              {/* Question Display */}
              <div className="text-center mt-12">
                <div className="text-slate-900 dark:text-white text-5xl font-black font-mono uppercase tracking-tighter mb-12">
                  {currentQuestion?.displayQuestion || '...'}
                </div>
              </div>

              {/* Input - Adaptive based on protocol */}
              <div className="max-w-md mx-auto">
                {selectedProtocol === 'SCIENCE_NOTATION' ? (
                  // Dual input for Scientific Notation
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-2 text-center font-mono">
                          MANTISSA
                        </div>
                        <input
                          ref={mantissaRef}
                          type="number"
                          step="any"
                          value={mantissaInput}
                          onChange={(e) => setMantissaInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Tab') {
                              e.preventDefault()
                              exponentRef.current?.focus()
                          }
                        }}
                          className="w-full bg-transparent border-b-2 border-emerald-300 dark:border-cyber-green/50 focus:border-emerald-600 dark:focus:border-cyber-green py-3 text-3xl font-mono font-bold text-emerald-600 dark:text-cyber-green text-center focus:outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-zinc-800"
                          placeholder="0"
                          autoComplete="off"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-2 text-center font-mono">
                          EXPONENT
                        </div>
                        <input
                          ref={exponentRef}
                          type="number"
                          value={exponentInput}
                          onChange={(e) => setExponentInput(e.target.value)}
                          className="w-full bg-transparent border-b-2 border-emerald-300 dark:border-cyber-green/50 focus:border-emerald-600 dark:focus:border-cyber-green py-3 text-3xl font-mono font-bold text-emerald-600 dark:text-cyber-green text-center focus:outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-zinc-800"
                          placeholder="0"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="text-center text-[8px] text-slate-500 dark:text-zinc-600 font-mono uppercase tracking-wider">
                      Ex: 8·10³ → Mantissa: 8, Exponent: 3
                    </div>
                  </div>
                ) : (
                  // Standard single input
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="number"
                      step="any"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-emerald-300 dark:border-cyber-green/50 focus:border-emerald-600 dark:focus:border-cyber-green py-4 text-4xl font-mono font-bold text-emerald-600 dark:text-cyber-green text-center focus:outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-zinc-800"
                      placeholder="000"
                      autoComplete="off"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-emerald-600 dark:bg-cyber-green animate-pulse" />
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center text-[9px] text-slate-500 dark:text-zinc-600 font-mono uppercase tracking-wider">
                {selectedProtocol === 'SCIENCE_NOTATION' 
                  ? 'Digite mantissa e expoente (TAB para alternar)'
                  : 'Digite e a resposta valida automaticamente'
                }
              </div>
            </div>
          )}

          {/* RESULTS SCREEN */}
          {gamePhase === 'results' && (
            <div className="text-center space-y-8 w-full max-w-xl">
              <div className="mb-8">
                <Trophy className="w-16 h-16 text-emerald-600 dark:text-cyber-green mx-auto mb-4" />
                <div className="text-emerald-600 dark:text-cyber-green text-3xl font-black font-mono uppercase tracking-widest">
                  SESSÃO COMPLETA
                </div>
                <div className="text-slate-500 dark:text-zinc-500 text-xs font-mono mt-2">
                  PROTOCOLO: {protocolInfo[selectedProtocol].name}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6 bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-cyber-green/30 rounded-lg p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
                  <span className="text-slate-600 dark:text-zinc-500 font-mono text-sm uppercase tracking-wider">Total Acertos:</span>
                  <span className="text-emerald-600 dark:text-cyber-green font-bold text-3xl font-mono">{correctAnswers}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
                  <span className="text-slate-600 dark:text-zinc-500 font-mono text-sm uppercase tracking-wider">Precisão:</span>
                  <span className="text-emerald-600 dark:text-cyber-green font-bold text-3xl font-mono">{accuracy.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-zinc-500 font-mono text-sm uppercase tracking-wider">MPM (Math/Min):</span>
                  <span className="text-emerald-600 dark:text-cyber-green font-bold text-3xl font-mono">{mpm.toFixed(1)}</span>
                </div>
              </div>

              {/* New Session Button */}
              <button
                onClick={handleNewSession}
                className="mt-8 bg-emerald-600 dark:bg-cyber-green text-white dark:text-black font-black uppercase tracking-widest py-4 px-12 rounded hover:bg-emerald-700 dark:hover:bg-[#00ff99] shadow-lg dark:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all active:scale-[0.98] font-mono text-sm"
              >
                [ NOVA SESSÃO ]
              </button>

              <div className="text-[9px] text-zinc-700 font-mono uppercase tracking-wider mt-8">
                PRESSIONE ESC PARA FECHAR
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
