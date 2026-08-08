# KORTEX API Reference

## Server Actions (lib/queries.ts)

All queries support date range filtering and are cached automatically by Next.js.

### Date Range Types

```typescript
type DateRange = 'today' | 'week' | 'month' | 'year'
```

## Core Functions

### `getDashboardStats(range?: DateRange)`

Returns aggregated statistics for the dashboard header cards.

**Parameters:**
- `range` (optional): Time period filter. Default: `'month'`

**Returns:**
```typescript
{
  totalTopics: number          // Total topics count
  masteredTopics: number       // Topics with MASTERED status
  weeklyStudyHours: string     // Study hours in selected range (formatted)
  errors: number               // Question errors count
  wallTopics: number           // Locked topics count
  questionsCount: number       // Total questions solved
}
```

**Example:**
```typescript
const stats = await getDashboardStats('week')
// { totalTopics: 13, masteredTopics: 3, ... }
```

---

### `getEssayPerformance(range?: DateRange)`

Fetches essay data with competency breakdown for the performance chart.

**Parameters:**
- `range` (optional): Default: `'year'`

**Returns:**
```typescript
Array<{
  id: string
  title: string
  date: Date
  totalScore: number     // 0-1000
  c1: number | null      // Competency 1 score
  c2: number | null      // Competency 2 score
  c3: number | null      // Competency 3 score
  c4: number | null      // Competency 4 score
  c5: number | null      // Competency 5 score
}>
```

**Usage in Component:**
```typescript
const essays = await getEssayPerformance('month')
<EssayPerformanceChart essays={essays} />
```

---

### `getSimulationPerformance(range?: DateRange)`

Returns simulation scores over time.

**Parameters:**
- `range` (optional): Default: `'year'`

**Returns:**
```typescript
Array<{
  id: string
  name: string           // e.g., "FUVEST 2024"
  date: Date
  score: number          // Correct answers (e.g., 72/90)
}>
```

---

### `getSubjectsWithTopics()`

Fetches all subjects with nested topics. No date filtering (structural data).

**Returns:**
```typescript
Array<{
  id: string
  name: string
  color: string          // Hex color
  topics: Array<{
    id: string
    name: string
    status: 'TODO' | 'IN_PROGRESS' | 'MASTERED'
    isWallOfStone: boolean
    difficultyLevel: number  // 1-5
  }>
}>
```

**Usage:**
```typescript
const subjects = await getSubjectsWithTopics()
<TopicHeatmap subjects={subjects} />
```

---

### `getErrorLog(range?: DateRange, limit?: number)`

Returns recent question errors with full context.

**Parameters:**
- `range` (optional): Default: `'month'`
- `limit` (optional): Max results. Default: `50`

**Returns:**
```typescript
Array<{
  id: string
  description: string
  errorType: 'THEORY' | 'INTERPRETATION' | 'ATTENTION' | 'TIME' | 'EMOTIONAL'
  date: Date
  topicName: string
  subjectName: string
  subjectColor: string
  simulationName: string | null
}>
```

**Example:**
```typescript
const recentErrors = await getErrorLog('week', 20)
```

---

### `getErrorDistribution(range?: DateRange)`

Returns error counts grouped by type for the taxonomy chart.

**Parameters:**
- `range` (optional): Default: `'month'`

**Returns:**
```typescript
Array<{
  errorType: 'THEORY' | 'INTERPRETATION' | 'ATTENTION' | 'TIME' | 'EMOTIONAL'
  count: number
}>
```

---

### `getWallOfStoneTopics()`

Returns all locked/difficult topics. No date filtering.

**Returns:**
```typescript
Array<{
  id: string
  name: string
  difficultyLevel: number
  status: string
  subjectName: string
  subjectColor: string
  sessionCount: number    // Study sessions on this topic
  errorCount: number      // Errors on this topic
}>
```

---

### `getDailyLog(date?: Date)`

Fetches daily log for a specific date.

**Parameters:**
- `date` (optional): Target date. Default: `new Date()` (today)

**Returns:**
```typescript
{
  id: string
  userId: string
  date: Date
  questionsCount: number
  sleepOk: boolean
  workoutOk: boolean
  cleanDiet: boolean
  noSocialMedia: boolean
} | null
```

---

### `createOrUpdateDailyLog(data)`

Creates or updates today's daily log. Used by Ritual Beast Mode.

**Parameters:**
```typescript
{
  questionsCount?: number
  sleepOk?: boolean
  workoutOk?: boolean
  cleanDiet?: boolean
  noSocialMedia?: boolean
}
```

**Returns:**
```typescript
DailyLog  // Updated or created record
```

**Example:**
```typescript
'use server'

async function handleSave() {
  await createOrUpdateDailyLog({
    questionsCount: 150,
    sleepOk: true,
    workoutOk: true,
  })
}
```

---

## Database Models (Prisma Schema)

### User
- Core user profile
- Relations: subjects, simulations, errors, essays, dailyLogs, studySessions

### Subject
- Academic subject (Matemática, Física, etc.)
- Fields: `name`, `color` (hex)
- Relations: topics

### Topic
- Individual study topic
- Fields: `name`, `difficultyLevel` (1-5), `isWallOfStone`, `status`
- Status enum: `TODO | IN_PROGRESS | MASTERED`

### StudySession
- Time tracking entry
- Fields: `durationMinutes`, `date`
- Relations: user, topic

### Simulation
- Historical exam performance
- Fields: `name`, `date`, `score`
- Relations: user, errors

### Essay
- Essay performance with competencies
- Fields: `title`, `date`, `totalScore` (0-1000), `c1-c5`
- Relations: user

### QuestionError
- Error taxonomy entry
- Fields: `errorType`, `description`, `correction`, `date`
- ErrorType enum: `THEORY | INTERPRETATION | ATTENTION | TIME | EMOTIONAL`
- Relations: user, simulation, topic

### DailyLog
- Daily volume and habits tracking
- Fields: `date`, `questionsCount`, `sleepOk`, `workoutOk`, `cleanDiet`, `noSocialMedia`
- Relations: user

---

## Adding Custom Queries

### Example: Get Top 5 Most Difficult Topics

```typescript
// lib/queries.ts

export async function getTopDifficultTopics() {
  const topics = await prisma.topic.findMany({
    where: {
      subject: { userId: DEMO_USER_ID },
    },
    include: {
      subject: true,
      _count: {
        select: {
          errors: true,
          sessions: true,
        },
      },
    },
    orderBy: {
      errors: {
        _count: 'desc',
      },
    },
    take: 5,
  })

  return topics
}
```

### Example: Weekly Volume Trend

```typescript
export async function getWeeklyVolumeTrend() {
  const thirtyDaysAgo = subDays(new Date(), 30)
  
  const logs = await prisma.dailyLog.findMany({
    where: {
      userId: DEMO_USER_ID,
      date: { gte: thirtyDaysAgo },
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      questionsCount: true,
    },
  })

  return logs
}
```

---

## URL Parameters

### Date Range Filter

The main dashboard reads `range` from URL search params:

```
/?range=today
/?range=week
/?range=month  (default)
/?range=year
```

Implemented in `components/kortex/time-filter.tsx`.

---

## Client Components vs Server Components

### Server Components (Default)
- All page components
- Automatically fetch data
- No `'use client'` directive

### Client Components (Needs Interactivity)
- `time-filter.tsx` - URL manipulation
- `ritual-beast-mode.tsx` - Form handling
- `dashboard-header.tsx` - Real-time clock
- All chart components - Recharts requires client

---

## Extending the API

### Adding a New Metric

1. **Update Database Schema** (prisma/schema.prisma):
```prisma
model Topic {
  // ... existing fields
  lastReviewedAt DateTime?
}
```

2. **Push Schema**:
```bash
pnpm prisma:push
```

3. **Create Query** (lib/queries.ts):
```typescript
export async function getTopicsNeedingReview() {
  const weekAgo = subWeeks(new Date(), 1)
  
  return await prisma.topic.findMany({
    where: {
      subject: { userId: DEMO_USER_ID },
      lastReviewedAt: { lt: weekAgo },
    },
  })
}
```

4. **Use in Component**:
```typescript
// app/page.tsx
const needsReview = await getTopicsNeedingReview()
<TopicsReviewList topics={needsReview} />
```

---

## Performance Optimization

### Caching

Next.js automatically caches Server Actions. To disable:

```typescript
export const revalidate = 0 // Disable cache

export async function getDashboardStats() {
  // ... query
}
```

### Parallel Queries

Always use `Promise.all()`:

```typescript
const [stats, essays, errors] = await Promise.all([
  getDashboardStats(),
  getEssayPerformance(),
  getErrorLog(),
])
```

### Pagination

For large datasets:

```typescript
export async function getErrorLog(range, limit = 50, offset = 0) {
  const errors = await prisma.questionError.findMany({
    // ... filters
    take: limit,
    skip: offset,
  })
  
  return errors
}
```

---

## Type Safety

All Prisma queries are fully typed. Import types:

```typescript
import type { Prisma } from '@prisma/client'

type TopicWithSubject = Prisma.TopicGetPayload<{
  include: { subject: true }
}>
```

---

**Need more API features?** Extend `lib/queries.ts` following these patterns.
