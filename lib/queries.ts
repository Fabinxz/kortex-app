'use server'

import { prisma } from './db'
import { startOfDay, endOfDay, subDays, subWeeks, subMonths, subYears } from 'date-fns'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

export type DateRange = 'today' | 'week' | 'month' | 'year'

function getDateRangeFilter(range: DateRange) {
  const now = new Date()
  const today = startOfDay(now)
  
  switch (range) {
    case 'today':
      return { gte: today, lte: endOfDay(now) }
    case 'week':
      return { gte: subWeeks(today, 1), lte: endOfDay(now) }
    case 'month':
      return { gte: subMonths(today, 1), lte: endOfDay(now) }
    case 'year':
      return { gte: subYears(today, 1), lte: endOfDay(now) }
    default:
      return { gte: subMonths(today, 1), lte: endOfDay(now) }
  }
}

export async function getDashboardStats(range: DateRange = 'month') {
  const dateFilter = getDateRangeFilter(range)
  
  const [
    totalTopics,
    masteredTopics,
    studySessions,
    dailyLogs,
    allDailyLogs,
  ] = await Promise.all([
    prisma.topic.count({
      where: {
        subject: { userId: DEMO_USER_ID }
      }
    }),
    prisma.topic.count({
      where: {
        subject: { userId: DEMO_USER_ID },
        status: 'MASTERED'
      }
    }),
    prisma.studySession.aggregate({
      where: {
        userId: DEMO_USER_ID,
        date: dateFilter
      },
      _sum: {
        durationMinutes: true
      }
    }),
    prisma.dailyLog.aggregate({
      where: {
        userId: DEMO_USER_ID,
        date: dateFilter
      },
      _sum: {
        questionsCount: true
      }
    }),
    prisma.dailyLog.findMany({
      where: {
        userId: DEMO_USER_ID,
        questionsCount: { gt: 0 }
      },
      orderBy: { date: 'desc' },
      select: { date: true }
    }),
  ])

  const weeklyStudyMinutes = studySessions._sum.durationMinutes || 0
  const weeklyStudyHours = (weeklyStudyMinutes / 60).toFixed(1)

  // Calculate day streak
  let dayStreak = 0
  let streakRecord = 0
  const today = startOfDay(new Date())
  
  // Calculate current streak
  for (let i = 0; i < allDailyLogs.length; i++) {
    const logDate = startOfDay(new Date(allDailyLogs[i].date))
    const expectedDate = subDays(today, i)
    
    if (logDate.getTime() === expectedDate.getTime()) {
      dayStreak++
    } else {
      break
    }
  }
  
  // Calculate record streak (mock - in production, store this in user preferences)
  streakRecord = Math.max(dayStreak, 22) // Default record of 22 days
  
  // Smart Countdown: Exam Schedule Queue
  const examSchedule = [
    { name: 'ENEM DIA 1', date: new Date('2026-11-08') },
    { name: 'ENEM DIA 2', date: new Date('2026-11-15') },
    { name: 'FUVEST FASE 1', date: new Date('2026-11-22') },
  ]
  
  const now = new Date()
  
  // Find the next upcoming exam
  const nextExam = examSchedule.find(exam => exam.date > now)
  
  let nextExamName = 'TEMPORADA CONCLUÍDA'
  let daysUntilExam = 0
  
  if (nextExam) {
    nextExamName = nextExam.name
    daysUntilExam = Math.ceil((nextExam.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  return {
    totalTopics,
    masteredTopics,
    weeklyStudyHours,
    dayStreak,
    streakRecord,
    nextExamName,
    daysUntilExam,
    questionsCount: dailyLogs._sum.questionsCount || 0,
  }
}

export async function getEssayPerformance(range: DateRange = 'year') {
  const dateFilter = getDateRangeFilter(range)
  
  const essays = await prisma.essay.findMany({
    where: {
      userId: DEMO_USER_ID,
      date: dateFilter
    },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      title: true,
      date: true,
      totalScore: true,
      timeInMinutes: true,
      c1: true,
      c2: true,
      c3: true,
      c4: true,
      c5: true,
    }
  })

  return essays
}

export async function getSimulationPerformance(range: DateRange = 'year') {
  const dateFilter = getDateRangeFilter(range)
  
  const simulations = await prisma.simulation.findMany({
    where: {
      userId: DEMO_USER_ID,
      date: dateFilter
    },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      name: true,
      date: true,
      score: true,
      timeInMinutes: true,
      mathScore: true,
      natScore: true,
      humScore: true,
      linScore: true,
    }
  })

  return simulations
}

export async function getSubjectsWithTopics() {
  const subjects = await prisma.subject.findMany({
    where: { userId: DEMO_USER_ID },
    include: {
      topics: {
        orderBy: { status: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  return subjects
}

export async function getErrorLog(range: DateRange = 'month', limit: number = 50) {
  const dateFilter = getDateRangeFilter(range)
  
  const errors = await prisma.questionError.findMany({
    where: {
      userId: DEMO_USER_ID,
      date: dateFilter
    },
    include: {
      topic: {
        include: {
          subject: true
        }
      },
      simulation: true
    },
    orderBy: { date: 'desc' },
    take: limit
  })

  return errors.map(error => ({
    id: error.id,
    description: error.description,
    correction: error.correction,
    errorType: error.errorType,
    date: error.date,
    topicName: error.topic.name,
    subjectName: error.topic.subject.name,
    subjectColor: error.topic.subject.color,
    simulationName: error.simulation?.name || null
  }))
}

export async function getErrorDistribution(range: DateRange = 'month') {
  const dateFilter = getDateRangeFilter(range)
  
  const errors = await prisma.questionError.groupBy({
    by: ['errorType'],
    where: {
      userId: DEMO_USER_ID,
      date: dateFilter
    },
    _count: {
      errorType: true
    }
  })

  return errors.map(e => ({
    errorType: e.errorType,
    count: e._count.errorType
  }))
}

export async function getWallOfStoneTopics() {
  const topics = await prisma.topic.findMany({
    where: {
      subject: { userId: DEMO_USER_ID },
      isWallOfStone: true
    },
    include: {
      subject: true,
      _count: {
        select: {
          sessions: true,
          errors: true
        }
      }
    },
    orderBy: { difficultyLevel: 'desc' }
  })

  return topics.map(topic => ({
    id: topic.id,
    name: topic.name,
    difficultyLevel: topic.difficultyLevel,
    status: topic.status,
    subjectName: topic.subject.name,
    subjectColor: topic.subject.color,
    sessionCount: topic._count.sessions,
    errorCount: topic._count.errors
  }))
}

export async function getDailyLog(date: Date = new Date()) {
  const startDate = startOfDay(date)
  const endDate = endOfDay(date)
  
  const log = await prisma.dailyLog.findFirst({
    where: {
      userId: DEMO_USER_ID,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  })

  return log
}

export async function createOrUpdateDailyLog(data: {
  questionsCount?: number
  sleepOk?: boolean
  workoutOk?: boolean
  cleanDiet?: boolean
  noSocialMedia?: boolean
}) {
  const today = startOfDay(new Date())
  
  const existingLog = await prisma.dailyLog.findFirst({
    where: {
      userId: DEMO_USER_ID,
      date: {
        gte: today,
        lte: endOfDay(new Date())
      }
    }
  })

  if (existingLog) {
    return await prisma.dailyLog.update({
      where: { id: existingLog.id },
      data
    })
  } else {
    return await prisma.dailyLog.create({
      data: {
        userId: DEMO_USER_ID,
        date: today,
        ...data
      }
    })
  }
}

// ===== TACTICAL COMMAND CENTER QUERIES =====

export async function getPriorityRadar(limit: number = 5) {
  const topics = await prisma.topic.findMany({
    where: {
      subject: { userId: DEMO_USER_ID },
      status: { not: 'MASTERED' }
    },
    include: {
      subject: true,
      _count: {
        select: {
          errors: true,
          sessions: true
        }
      }
    },
    orderBy: [
      { incidence: 'desc' },
      { status: 'asc' }
    ],
    take: limit
  })

  return topics.map(topic => ({
    id: topic.id,
    name: topic.name,
    subjectName: topic.subject.name,
    subjectColor: topic.subject.color,
    incidence: topic.incidence,
    status: topic.status,
    masteryScore: topic._count.sessions > 0 
      ? Math.min(100, (topic._count.sessions * 20) - (topic._count.errors * 5))
      : 0,
    errorCount: topic._count.errors
  }))
}

export async function getPendingErrors(limit: number = 50) {
  const errors = await prisma.questionError.findMany({
    where: {
      userId: DEMO_USER_ID,
      archived: false,
      nextReview: {
        lte: new Date()
      }
    },
    include: {
      topic: {
        include: {
          subject: true
        }
      }
    },
    orderBy: { nextReview: 'asc' },
    take: limit
  })

  return errors.map(error => ({
    id: error.id,
    description: error.description,
    correction: error.correction,
    errorType: error.errorType,
    reviewCount: error.reviewCount,
    topicName: error.topic.name,
    subjectName: error.topic.subject.name,
    subjectColor: error.topic.subject.color
  }))
}

export async function reviewError(errorId: string, correct: boolean) {
  const error = await prisma.questionError.findUnique({
    where: { id: errorId }
  })

  if (!error) return null

  // Spaced repetition logic
  const nextReviewDays = correct 
    ? Math.min(30, Math.pow(2, error.reviewCount + 1)) // Exponential: 2, 4, 8, 16, 30 days
    : 1 // Review tomorrow if incorrect

  return await prisma.questionError.update({
    where: { id: errorId },
    data: {
      reviewCount: correct ? error.reviewCount + 1 : 0,
      nextReview: new Date(Date.now() + nextReviewDays * 24 * 60 * 60 * 1000),
      archived: correct && error.reviewCount >= 3 // Archive after 3 correct reviews
    }
  })
}

export async function getUnlockProtocol() {
  const lockedTopics = await prisma.topic.findMany({
    where: {
      subject: { userId: DEMO_USER_ID },
      isWallOfStone: true
    },
    include: {
      subject: true,
      _count: {
        select: {
          sessions: true,
          errors: true
        }
      }
    },
    orderBy: { unlockProgress: 'desc' }
  })

  return lockedTopics.map(topic => ({
    id: topic.id,
    name: topic.name,
    subjectName: topic.subject.name,
    subjectColor: topic.subject.color,
    unlockProgress: topic.unlockProgress,
    sessionCount: topic._count.sessions,
    errorCount: topic._count.errors,
    difficultyLevel: topic.difficultyLevel
  }))
}
