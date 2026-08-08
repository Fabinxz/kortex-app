# KORTEX - Complete System Documentation & Functional Specification

> **Document Purpose:** Authoritative technical specification for the KORTEX High-Performance Study Platform.  
> **Intended Audience:** Developers, architects, and product managers joining the project.  
> **Last Updated:** February 10, 2026

---

## 1. SYSTEM OVERVIEW

**Project Name:** KORTEX v1.0  
**Description:** High-Performance Study Platform for Brazilian Medical School Entrance Exam Preparation  
**Architecture:** Next.js 14 + Prisma + PostgreSQL  
**Design Style:** Cyber-brutalist / Dark Mode  
**Target Users:** Medical school entrance exam students (FUVEST, ENEM, Vestibulares)

---

## 2. TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14.2+ (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS 3.x + Custom design system
- **UI Components:** Shadcn/ui (40+ components)
- **Charts:** Recharts 2.x
- **Animations:** Framer Motion

### Backend
- **ORM:** Prisma 5.x
- **Database:** PostgreSQL 15+
- **API Layer:** Next.js Server Actions

### Development
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Type Checking:** TypeScript

---

## 3. DATABASE SCHEMA

### 3.1 Entity Relationships

```
User ──< Subject ──< Topic ──< StudySession
                      │    └──< QuestionError
                      │
User ──< Simulation ──< QuestionError (optional)
User ──< Essay
User ──< DailyLog
```

### 3.2 Core Models

#### User
```prisma
id        String   @id @default(uuid())
email     String   @unique
name      String?
```
**Purpose:** Student profile  
**Note:** Demo uses fixed ID `00000000-0000-0000-0000-000000000001`

#### Subject
```prisma
id        String  @id @default(uuid())
userId    String
name      String  // "Matemática", "Física"
color     String  // Hex color
```
**11 Default Subjects:** Matemática, Física, Química, Biologia, Português, Literatura, Inglês, História, Geografia, Filosofia, Redação

#### Topic
```prisma
id             String      @id @default(uuid())
subjectId      String
name           String
difficultyLevel Int        @default(1)  // 1-5
isWallOfStone  Boolean     @default(false)
status         TopicStatus @default(TODO)
```
**Status:** `TODO` | `IN_PROGRESS` | `MASTERED`  
**Difficulty:** 1 (easy) → 5 (very hard)  
**Wall of Stone:** Locked/difficult topics flagged for extra attention

#### StudySession
```prisma
id              String   @id @default(uuid())
userId          String
topicId         String
durationMinutes Int
date            DateTime @default(now())
```
**Purpose:** Time tracking  
**Constraint:** durationMinutes > 0

#### Simulation
```prisma
id          String   @id @default(uuid())
userId      String
date        DateTime
name        String   // "FUVEST 2024"
score       Int      // Total correct (0-90)
mathScore   Int?     // 0-45
natScore    Int?     // 0-45
humScore    Int?     // 0-45
linScore    Int?     // 0-45
timeInMinutes Int?
```
**Brazilian Format:** 90 questions total, 4 areas × 45 questions each

#### Essay
```prisma
id            String   @id @default(uuid())
userId        String
date          DateTime
title         String
totalScore    Int      // 0-1000
timeInMinutes Int?
c1            Int?     // Competência 1 (0-200)
c2            Int?     // Competência 2 (0-200)
c3            Int?     // Competência 3 (0-200)
c4            Int?     // Competência 4 (0-200)
c5            Int?     // Competência 5 (0-200)
```
**Scoring:** totalScore = c1 + c2 + c3 + c4 + c5 (max 1000)  
**Goal:** ≥800 points for medical school

#### QuestionError
```prisma
id           String    @id @default(uuid())
userId       String
simulationId String?
topicId      String
errorType    ErrorType 
description  String
correction   String
date         DateTime
nextReview   DateTime  // Spaced repetition
reviewCount  Int       @default(0)
archived     Boolean   @default(false)
```
**ErrorType:** `THEORY` | `INTERPRETATION` | `ATTENTION` | `TIME` | `EMOTIONAL`  
**Spaced Repetition:** Intervals increase with correct reviews (1→3→7→14→30 days)

#### DailyLog
```prisma
id             String   @id @default(uuid())
userId         String
date           DateTime
questionsCount Int      @default(0)
sleepOk        Boolean  @default(false)
workoutOk      Boolean  @default(false)
cleanDiet      Boolean  @default(false)
noSocialMedia  Boolean  @default(false)
```
**Purpose:** Daily volume + habit tracking  
**Key Metric:** questionsCount (prominently displayed)

---

## 4. SERVER ACTIONS (API)

**File:** `lib/queries.ts`  
**Pattern:** All functions use `'use server'` directive

### Date Range Filter
```typescript
type DateRange = 'today' | 'week' | 'month' | 'year'
```

### Core Queries

#### getDashboardStats(range)
```typescript
Returns: {
  totalTopics: number
  masteredTopics: number
  weeklyStudyHours: string  // Formatted "12.5h"
  errors: number
  wallTopics: number
  questionsCount: number  // ⭐ Main metric
}
```

#### getEssayPerformance(range)
Returns essays with totalScore + competencies (c1-c5)

#### getSimulationPerformance(range)
Returns simulations with name, date, score

#### getSubjectsWithTopics()
Returns hierarchical subject → topics structure (no date filter)

#### getErrorLog(range, limit)
Returns recent errors with topic/subject/simulation context  
**Default limit:** 50

#### getErrorDistribution(range)
Returns count by errorType for bar chart

#### getWallOfStoneTopics()
Returns locked topics with session/error counts

#### getDailyLog(date)
Returns log for specific date (default: today)

#### createOrUpdateDailyLog(data)
Upserts daily log  
**Side effect:** Triggers page reload

---

## 5. COMPONENT ARCHITECTURE

### Classification

**Server Components (SSR):**
- `app/page.tsx` - Main dashboard
- `StatsBar` - KPI metrics
- `TopicHeatmap` - Subject/topic grid
- `ErrorLog` - Scrollable error list

**Client Components (Interactive):**
- `DashboardHeader` - Clock + Time filter
- `EssayPerformanceChart` - Recharts area chart
- `SimulatedPerformanceChart` - Recharts line chart
- `RitualBeastMode` - Daily log form
- `TacticalHudModal` - Study session input (**NEW**)
- `DataInjectorModal` - Quick entry
- `MentalOverdriveModal` - Mental math trainer

### Key Components

#### TimeFilter
**Behavior:**  
Updates URL param `?range=X` → triggers server re-render → all data refetches

**Options:** `HOJE` | `SEMANA` | `MÊS` | `ANO`

#### RitualBeastMode
**Fields:** Questions count + 4 habits (checkboxes)  
**Submit:** Calls `createOrUpdateDailyLog()` → `window.location.reload()`

#### EssayPerformanceChart
**View Modes:**
- Score Analysis: Shows essay scores over time
- Time Analysis: Shows time spent per essay
- Toggle button switches between modes

**Visual:** Green gradient area chart  
**Reference Line:** 800 points (goal)  
**Tooltip:** Shows c1-c5 breakdown

#### SimulatedPerformanceChart
**View Modes:**
- Score Analysis: Shows correct answers over time
- Time Analysis: Shows exam duration trends

**Visual:** Cyan line chart  
**Reference Line:** 65 correct answers (passing estimate)

#### TopicHeatmap
**Colors:**
- Gray: TODO
- Amber: IN_PROGRESS
- Green: MASTERED
- Red: Wall of Stone (locked)

---

## 6. MODAL COMPONENTS

### Tactical HUD Modal 🆕

**Trigger:** `Ctrl+J` or button click  
**Purpose:** Fast study session logging with pilot-like UX

**Fields:**
- Subject dropdown (5 options)
- Topic autocomplete (fuzzy search from mock data)
- Source text input
- Total Questions (number)
- Correct Answers (number)
- Time Spent (minutes)

**Real-time Calculations:**
- **Efficiency:** `(Correct / Total) × 100`
  - Green: ≥80%
  - Yellow: 60-79%
  - Red: <60%
- **Pace:** `Time / Total` (min/question)

**Conditional "Autopsia do Erro":**
- **Trigger:** IF Correct < Total
- **4 Error Categories:**
  1. 🔴 Lacuna Teórica (Theory gap)
  2. 🟡 Atenção/Silly (Careless)
  3. 🔵 Interpretação (Misunderstood)
  4. 🟣 Tempo (Time pressure)
- **Validation:** Must categorize 100% of errors before saving
- **Hotkeys:** Press `1-4` to increment categories

**Debriefing Section:**
- Textarea: "Protocolo de Retenção"
- Purpose: Active recall (explain what you learned)

**Keyboard Shortcuts:**
- `Ctrl+J`: Toggle modal
- `Tab`: Navigate fields
- `1-4`: Increment error categories (when not typing)
- `Ctrl+Enter`: Save

### Data Injector Modal

**Trigger:** `Ctrl+K`  
**Layout:** Dual-column (Input | Feedback)

**Left Column:**
- Subject buttons (MAT, NAT, HUM, LIN)
- Topic search with fuzzy autocomplete
- Total Questions + Correct Answers

**Right Column:**
- Efficiency gauge (circular meter)
- Color-coded: Green/Yellow/Red

**Sniper Log (Conditional):**
- Shows when errors exist
- Clickable error tags (4 types)

### Mental Overdrive Modal

**Purpose:** Mental math speed training  
**Phases:** Setup → Playing → Results

**4 Training Protocols:**

1. **DECIMAL CRUSHER** - Order of magnitude
   - Examples: `24 × 0.25`, `100 ÷ 0.05`

2. **PERCENT SHREDDER** - Percentage calculations
   - Examples: `20% DE 150`, `100 + 25%`

3. **SCIENCE NOTATION** - Scientific notation
   - Examples: `(2·10³) × (3·10⁴)`
   - Dual input: Mantissa + Exponent

4. **FACTOR X** - Squares, roots, multiples
   - Examples: `18²`, `√289`, `23 × 3`

**Difficulty Levels:** BASIC, INTERMEDIATE, ADVANCED  
**Durations:** 30s, 60s, 120s

**Playing Screen:**
- Large question display
- Input field with instant validation
- Timer countdown
- Acertos counter
- **Auto-advancement:** No submit button needed
- **Visual feedback:** Border glows green/red

**Results:**
- Total Acertos
- Accuracy %
- MPM (answers per minute)

---

## 7. DESIGN SYSTEM

### Color Palette

```css
/* Background */
#09090b  /* Pure black */

/* Primary Accents */
#00ff88  /* Cyber Green - Success/Primary */
#00d4ff  /* Cyan - Math/Data */
#ff0055  /* Red - Danger */
#ffaa00  /* Amber - Warning */
#aa55ff  /* Purple - Humanities */

/* Surfaces */
#27272a  /* Zinc-800 - Borders */
#1a1a1e  /* Zinc-900 - Hover */
#0f0f12  /* Zinc-950 - Deep backgrounds */
```

### Typography

**UI Text:** Inter (sans-serif)  
**Numbers:** JetBrains Mono (monospace) - **CRITICAL FOR ALIGNMENT**

**Conventions:**
- Headers: `uppercase tracking-widest`
- Labels: `uppercase tracking-wider`
- Numbers: Always `.font-mono`

### Design Principles

**Cyber-Brutalist Rules:**
1. Zero rounded corners
2. 1px thin borders
3. Flat design (no shadows, only glows)
4. High contrast (pure black bg)
5. Monospace for all data

**Glow Effects:**
```css
.glow-green {
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}
```

### Responsive Breakpoints

```
sm: 640px   (Mobile)
md: 768px   (Tablet)
lg: 1024px  (Laptop)
xl: 1280px  (Desktop)
```

---

## 8. BUSINESS LOGIC

### Topic Progression

```
TODO → IN_PROGRESS:
  - First study session OR error logged

IN_PROGRESS → MASTERED:
  - Efficiency ≥85% over last 5 sessions
  - Zero errors in last 7 days

Wall of Stone Flag:
  - difficultyLevel ≥ 4 AND errorCount > 10
```

### Essay Scoring

```typescript
totalScore = c1 + c2 + c3 + c4 + c5
// Each: 0-200, Total: 0-1000
// Goal: ≥800
```

### Spaced Repetition

```typescript
Intervals: [1, 3, 7, 14, 30, 60, 120] days
- Correct review: Advance to next interval
- Wrong review: Reset to 1 day
- After 120 days: Archive
```

---

## 9. DATA FLOW

### Page Load
```
1. User visits /?range=month
2. app/page.tsx reads searchParams
3. Calls 6 Server Actions in parallel (Promise.all)
4. Renders components with data
5. HTML sent to browser
6. Client components hydrate
```

### Time Filter Change
```
1. User clicks "SEMANA"
2. TimeFilter updates URL to ?range=week
3. Next.js router triggers re-render
4. Server Actions called with new range
5. Components re-render with filtered data
```

### Form Submission
```
1. User fills Ritual Beast Mode
2. Clicks REGISTRAR
3. Calls createOrUpdateDailyLog()
4. Upserts database
5. window.location.reload()
6. Fresh data displayed
```

---

## 10. CRITICAL CONSTRAINTS

### Validation Rules

**Study Sessions:**
- durationMinutes > 0
- date ≤ today

**Simulations:**
- score: 0-90
- Per-subject scores: 0-45

**Essays:**
- totalScore: 0-1000
- Each competency: 0-200
- totalScore = sum(c1...c5)

**Daily Logs:**
- questionsCount ≥ 0
- One log per user per day (upsert constraint)

### Performance Rules

1. **Server Components by Default** - Only use client when necessary
2. **Parallel Queries** - Always use `Promise.all()`
3. **Limit Results** - Default 50 for lists
4. **Avoid N+1** - Use Prisma `include` for joins
5. **Reload After Mutations** - Ensures cache invalidation

---

## 11. KEYBOARD SHORTCUTS

**Global:**
- `Ctrl+J`: Open Tactical HUD
- `Ctrl+K`: Open Data Injector
- `Esc`: Close any modal

**Tactical HUD:**
- `Tab`: Navigate fields
- `1-4`: Increment error categories
- `Ctrl+Enter`: Save

**Mental Overdrive:**
- `Enter`: Next (science notation mode)
- `Tab`: Switch mantissa/exponent

---

## 12. FUTURE DEVELOPMENT

### To Add a New Metric
1. Update `DailyLog` model in `schema.prisma`
2. Run `pnpm prisma:push`
3. Update `createOrUpdateDailyLog()` in `lib/queries.ts`
4. Add input to `RitualBeastMode`
5. Update `getDashboardStats()`
6. Add display to `StatsBar`

### To Add a New Chart
1. Create component in `components/kortex/`
2. Mark as `'use client'`
3. Use Recharts
4. Create Server Action for data
5. Add to `app/page.tsx` grid

### To Add a New Modal
1. Create component (use existing as template)
2. Add keyboard shortcut
3. Add trigger button
4. Implement save logic (Server Action)

---

## 13. DEPLOYMENT

**Before Production:**
- Remove mock data (seed.ts)
- Implement authentication
- Set up production database (Neon)
- Configure environment variables
- Run `pnpm build` (verify no errors)
- Deploy to Vercel

**Environment Variables:**
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="random-secret"
```

---

## 14. TESTING CHECKLIST

**Core Flows:**
- [ ] Dashboard loads with data
- [ ] Time filter updates data
- [ ] Ritual Beast Mode saves correctly
- [ ] Tactical HUD validates error categorization
- [ ] Charts render and show tooltips
- [ ] All modals open/close correctly

**Keyboard:**
- [ ] `Ctrl+J` opens Tactical HUD
- [ ] `Ctrl+K` opens Data Injector
- [ ] `Esc` closes modals
- [ ] Error category hotkeys work

**Responsive:**
- [ ] Mobile (375px): Single column
- [ ] Tablet (768px): Adaptive grid
- [ ] Desktop (1920px): Full layout

---

## 15. GLOSSARY

**System Terms:**
- **KORTEX:** Platform name (cognitive performance system)
- **Ritual Beast Mode:** Daily logging feature
- **Wall of Stone:** Difficult topics section
- **Tactical HUD:** Study session input modal
- **Autopsia do Erro:** Error autopsy/diagnosis

**Brazilian Exam Terms:**
- **FUVEST:** São Paulo university entrance exam
- **ENEM:** National high school exam
- **Vestibular:** University entrance exam (general)
- **Competências:** Essay competencies (C1-C5)
- **Acertos:** Correct answers

---

## 16. VERSION INFO

**Current Version:** v1.0  
**Release Date:** February 8, 2026  
**Database Models:** 8  
**Server Actions:** 17  
**Components:** 20+  
**Mock Data:** 90 days

**Known Limitations:**
- Single user (hardcoded ID)
- No authentication
- No pagination (50-item limits)
- Manual topic mastery
- Tactical features partially hidden

---

**END OF SPECIFICATION**

This document is the authoritative source of truth for KORTEX v1.0 architecture and functionality.

For additional documentation:
- Setup: `README.md`
- User Guide: `QUICKSTART-PT.md`
- API Details: `API.md`
- Deployment: `DEPLOYMENT.md`
