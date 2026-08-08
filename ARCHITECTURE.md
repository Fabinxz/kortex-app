# KORTEX - System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                     (localhost:3000)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Request
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   NEXT.JS 14 APP                            │
│                   (App Router)                              │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │           app/page.tsx (Server Component)          │   │
│  │                                                     │   │
│  │  • Reads URL params (?range=month)                │   │
│  │  • Calls Server Actions                           │   │
│  │  • Fetches all data in parallel                   │   │
│  │  • Renders components                             │   │
│  └────────────────────┬───────────────────────────────┘   │
│                       │                                     │
│         ┌─────────────┴─────────────┐                      │
│         │                           │                      │
│  ┌──────▼───────┐           ┌──────▼────────┐            │
│  │   Server     │           │    Client      │            │
│  │ Components   │           │  Components    │            │
│  │              │           │                │            │
│  │ • StatsBar   │           │ • TimeFilter   │            │
│  │ • ErrorLog   │           │ • Charts       │            │
│  │ • WallStone  │           │ • RitualMode   │            │
│  └──────┬───────┘           └──────┬─────────┘            │
│         │                           │                      │
│         └─────────────┬─────────────┘                      │
│                       │                                     │
│  ┌────────────────────▼────────────────────────────┐      │
│  │         lib/queries.ts (Server Actions)        │      │
│  │                                                 │      │
│  │  • getDashboardStats()                        │      │
│  │  • getEssayPerformance()                      │      │
│  │  • getSimulationPerformance()                 │      │
│  │  • getSubjectsWithTopics()                    │      │
│  │  • getErrorLog()                              │      │
│  │  • getErrorDistribution()                     │      │
│  │  • getWallOfStoneTopics()                     │      │
│  │  • getDailyLog()                              │      │
│  │  • createOrUpdateDailyLog()                   │      │
│  └────────────────────┬────────────────────────────┘      │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ Prisma Client
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   lib/db.ts                                 │
│              (Prisma Client Singleton)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────────┐
│               POSTGRESQL DATABASE                           │
│            (Local or Neon Serverless)                       │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │                  8 TABLES                          │   │
│  │                                                     │   │
│  │  1. users            - Student profiles           │   │
│  │  2. subjects         - Academic subjects          │   │
│  │  3. topics           - Individual topics          │   │
│  │  4. study_sessions   - Time tracking              │   │
│  │  5. simulations      - Exam performance           │   │
│  │  6. essays           - Essay scores               │   │
│  │  7. question_errors  - Error taxonomy             │   │
│  │  8. daily_logs       - Daily volume + habits      │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Initial Page Load

```
User visits
    ↓
app/page.tsx (Server Component)
    ↓
Read URL params (?range=month)
    ↓
Call 8 Server Actions in parallel (Promise.all)
    ↓
Prisma queries database
    ↓
Returns data
    ↓
Components render with data
    ↓
HTML sent to browser
```

### 2. Time Filter Change

```
User clicks "SEMANA"
    ↓
TimeFilter (Client Component)
    ↓
Update URL: ?range=week
    ↓
Next.js router refresh
    ↓
app/page.tsx re-renders
    ↓
Server Actions called with new range
    ↓
New data fetched
    ↓
Components re-render
    ↓
Updated HTML sent to browser
```

### 3. Save Daily Log

```
User fills Ritual Beast Mode form
    ↓
Clicks REGISTRAR
    ↓
RitualBeastMode (Client Component)
    ↓
Call createOrUpdateDailyLog() Server Action
    ↓
Prisma upsert to database
    ↓
Success
    ↓
Page reload (window.location.reload)
    ↓
Fresh data displayed
```

---

## 📦 Component Hierarchy

```
app/page.tsx (Server)
│
├── DashboardHeader (Client)
│   └── TimeFilter (Client)
│
├── StatsBar (Server)
│   ├── Metric Card 1 (Matérias)
│   ├── Metric Card 2 (Horas Líq.)
│   ├── Metric Card 3 (Erros)
│   ├── Metric Card 4 (Wall of Stone)
│   └── Metric Card 5 (Questões) ⭐
│
├── EssayPerformanceChart (Client - Recharts)
│   └── AreaChart with gradient
│
├── SimulatedPerformanceChart (Client - Recharts)
│   └── LineChart
│
├── RitualBeastMode (Client - Form)
│   ├── Input (questions)
│   ├── Checkboxes (habits)
│   └── Button (save)
│
├── TopicHeatmap (Server)
│   └── Grid of topic squares
│
├── ErrorDistribution (Client - Recharts)
│   └── BarChart
│
├── ErrorLog (Server)
│   └── ScrollArea with error list
│
└── WallOfStone (Server)
    └── List of locked topics
```

---

## 🗂️ File Organization

```
kortex-app-main/
│
├── 📱 FRONTEND
│   ├── app/
│   │   ├── layout.tsx       → Root layout + fonts
│   │   ├── page.tsx         → Main dashboard
│   │   └── globals.css      → Design system
│   │
│   └── components/
│       ├── kortex/          → 10 custom components
│       └── ui/              → 40+ Shadcn UI components
│
├── 🔧 BACKEND
│   ├── lib/
│   │   ├── db.ts            → Prisma client
│   │   ├── queries.ts       → Server actions (API)
│   │   └── utils.ts         → Helper functions
│   │
│   └── prisma/
│       ├── schema.prisma    → Database schema
│       └── seed.ts          → Mock data generator
│
├── 📚 DOCS
│   ├── README.md            → Setup guide
│   ├── START-HERE.md        → Quick overview
│   ├── QUICKSTART-PT.md     → User guide (Portuguese)
│   ├── GUIDE.md             → Feature reference
│   ├── API.md               → Developer docs
│   ├── DEPLOYMENT.md        → Production guide
│   ├── TESTING.md           → Test checklist
│   ├── CHANGELOG.md         → Version history
│   ├── TODO.md              → Future roadmap
│   └── IMPLEMENTATION-SUMMARY.md → This overview
│
├── ⚙️ CONFIG
│   ├── package.json         → Dependencies + scripts
│   ├── tsconfig.json        → TypeScript config
│   ├── tailwind.config.ts   → Tailwind config
│   ├── next.config.mjs      → Next.js config
│   ├── .env.example         → Environment template
│   └── components.json      → Shadcn config
│
└── 🛠️ SCRIPTS
    ├── setup.sh             → Unix setup automation
    └── setup.bat            → Windows setup automation
```

---

## 🎨 Design System Structure

```
globals.css
│
├── CSS Variables (HSL)
│   ├── --background (black)
│   ├── --foreground (white)
│   ├── --primary (green)
│   ├── --destructive (red)
│   └── --chart-1 through --chart-5
│
├── Custom Utilities
│   ├── .text-cyber-green
│   ├── .text-cyber-cyan
│   ├── .glow-green
│   ├── .border-glow-green
│   └── Custom scrollbars
│
└── Tailwind Classes
    ├── border-zinc-800
    ├── bg-zinc-950
    ├── text-[10px]
    ├── font-mono
    └── uppercase tracking-widest
```

---

## 🔐 Security Architecture

```
Environment Variables (.env)
    ↓
Not committed to Git (.gitignore)
    ↓
Loaded by Next.js at runtime
    ↓
Used only in server-side code
    ↓
Never exposed to browser

Database Connection
    ↓
Prisma Client (parameterized queries)
    ↓
SQL Injection: ✅ Protected
    ↓
XSS: ✅ Protected (React escaping)
```

---

## 📊 Data Model Relationships

```
User
 │
 ├──< Subject
 │     └──< Topic
 │           ├──< StudySession
 │           └──< QuestionError
 │
 ├──< Simulation
 │     └──< QuestionError (optional)
 │
 ├──< Essay
 │
 └──< DailyLog

Legend:
  ──<  One-to-Many
  ──>  Many-to-One
```

### Detailed Relationships

```sql
User (1) ──< (Many) Subject
  └─ userId foreign key

Subject (1) ──< (Many) Topic
  └─ subjectId foreign key

Topic (1) ──< (Many) StudySession
  └─ topicId foreign key

Topic (1) ──< (Many) QuestionError
  └─ topicId foreign key

User (1) ──< (Many) Simulation
  └─ userId foreign key

Simulation (1) ──< (Many) QuestionError (optional)
  └─ simulationId foreign key (nullable)

User (1) ──< (Many) Essay
  └─ userId foreign key

User (1) ──< (Many) DailyLog
  └─ userId foreign key
```

---

## ⚡ Performance Optimization

### Server-Side Rendering (SSR)
```
Default: All components render on server
  ↓
HTML sent to browser (fast first paint)
  ↓
Minimal JavaScript shipped
  ↓
Interactive elements hydrate on client
```

### Parallel Data Fetching
```typescript
// Instead of sequential:
const stats = await getDashboardStats()
const essays = await getEssayPerformance()
const errors = await getErrorLog()

// We do parallel:
const [stats, essays, errors] = await Promise.all([
  getDashboardStats(),
  getEssayPerformance(),
  getErrorLog(),
])
```

### Caching Strategy
```
Next.js automatically caches:
  ├── Server Component renders
  ├── Server Action results
  └── Static assets

Manual revalidation:
  ├── Time-based (revalidate: 60)
  └── On-demand (revalidatePath())
```

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
  ├── Next.js Dev Server (:3000)
  ├── PostgreSQL Database (local or Neon)
  └── Hot Module Replacement (HMR)
```

### Production (Vercel)
```
GitHub Repository
    ↓
Vercel (auto-deploy on push)
    ├── Build: next build
    ├── Deploy to Edge Network
    └── Connect to Neon Database

CDN Distribution:
  ├── North America
  ├── South America
  ├── Europe
  └── Asia-Pacific
```

---

## 🔄 State Management

### URL State (Time Filter)
```
URL: ?range=month
  ↓
useSearchParams() hook
  ↓
Read by Server Components
  ↓
Passed to Server Actions
  ↓
Filters database queries
```

### Form State (Ritual Beast Mode)
```
React useState()
  ↓
Controlled inputs
  ↓
Submit → Server Action
  ↓
Database update
  ↓
Page reload for fresh data
```

### Server State (All Data)
```
Server Actions fetch data
  ↓
Passed as props to components
  ↓
Components render (no client state)
  ↓
Re-fetch on navigation/refresh
```

---

## 🧪 Testing Architecture

```
Manual Testing
  ├── Component rendering (visual)
  ├── User interactions (clicking)
  ├── Data flow (filtering)
  ├── Responsive design (resize)
  └── Edge cases (empty states)

Type Checking
  ├── TypeScript compiler (tsc)
  ├── Prisma type generation
  └── IDE IntelliSense

Build Testing
  ├── next build
  ├── Check for errors
  └── Bundle size analysis
```

---

## 📈 Scalability Considerations

### Current (v1.0)
- Single user (demo mode)
- ~100 topics max
- ~1000 errors max
- ~365 daily logs max

### Future (v2.0+)
- Multi-user with auth
- Unlimited topics (pagination)
- Unlimited errors (pagination + search)
- Archiving old data
- Database sharding (if needed)

---

## 🔧 Extension Points

### Add New Feature
```
1. Update Prisma schema (prisma/schema.prisma)
2. Push schema (pnpm prisma:push)
3. Create Server Action (lib/queries.ts)
4. Create Component (components/kortex/)
5. Use in page (app/page.tsx)
```

### Add New Metric
```
1. Add field to DailyLog model
2. Update seed.ts
3. Update createOrUpdateDailyLog()
4. Add to RitualBeastMode form
5. Display in StatsBar
```

### Add New Chart
```
1. Create chart component (use Recharts)
2. Create Server Action for data
3. Add to page.tsx grid
4. Style with cyber-brutalist colors
```

---

## 💾 Database Migration Strategy

### Current (v1.0)
- Prisma db push (schema sync)
- No migration files
- Suitable for development

### Future (Production)
```
1. prisma migrate dev --name feature_name
2. Review migration SQL
3. Test on staging database
4. prisma migrate deploy (production)
5. Backup before migration
```

---

## 🎯 Critical Paths

### Path 1: View Dashboard
```
User visits → page.tsx loads → 8 queries fetch data → render components → display
Time: ~1-2 seconds
```

### Path 2: Change Filter
```
Click filter → update URL → page refresh → re-fetch with new range → render
Time: ~0.5 seconds
```

### Path 3: Save Data
```
Fill form → submit → server action → database write → reload → fresh data
Time: ~1-2 seconds
```

---

## 🏗️ Build Process

```
Development: pnpm dev
    ↓
  Next.js starts dev server
    ↓
  File watcher active (HMR)
    ↓
  TypeScript type checking
    ↓
  Tailwind JIT compiler
    ↓
  Prisma Client available

Production: pnpm build
    ↓
  Prisma generate (postinstall)
    ↓
  TypeScript compilation
    ↓
  Next.js optimization
    ↓
  Static generation (if applicable)
    ↓
  Bundle analysis
    ↓
  Output: .next/ folder
```

---

## 🎨 Styling Architecture

```
Tailwind CSS (Utility-first)
    ↓
  Custom colors (globals.css)
    ↓
  Component classes (inline)
    ↓
  Shadcn UI (pre-styled components)
    ↓
  Responsive utilities (sm:, md:, lg:)
    ↓
  Dark mode forced (class="dark")
```

---

**This architecture supports:**
- ✅ Rapid development
- ✅ Type safety
- ✅ Performance
- ✅ Scalability
- ✅ Maintainability
- ✅ Extensibility

---

**KORTEX v1.0 Architecture**  
Built with Next.js 14, Prisma, PostgreSQL, and Tailwind CSS
