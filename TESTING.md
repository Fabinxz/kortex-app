# KORTEX - Testing Checklist

Use this checklist after setup to ensure everything is working correctly.

## ✅ Pre-Flight Checks

### Environment Setup
- [ ] `.env` file exists with valid `DATABASE_URL`
- [ ] `node_modules` installed (`pnpm install` or `npm install`)
- [ ] Prisma Client generated (`pnpm prisma:generate`)
- [ ] Database schema pushed (`pnpm prisma:push`)
- [ ] Database seeded with mock data (`pnpm prisma:seed`)

### Development Server
- [ ] `pnpm dev` starts without errors
- [ ] Accessible at `http://localhost:3000`
- [ ] No console errors in browser
- [ ] No TypeScript errors in terminal

---

## 🎯 Core Functionality Tests

### Dashboard Header
- [ ] KORTEX logo appears with green glow
- [ ] Current date and time display correctly
- [ ] "SISTEMAS ONLINE" indicator is green and pulsing
- [ ] Time filter shows 4 options: HOJE, SEMANA, MÊS, ANO

### Time Filter (URL Parameters)
- [ ] Clicking "HOJE" updates URL to `?range=today`
- [ ] Clicking "SEMANA" updates URL to `?range=week`
- [ ] Clicking "MÊS" updates URL to `?range=month`
- [ ] Clicking "ANO" updates URL to `?range=year`
- [ ] Selected filter has green background
- [ ] Page data updates when changing filters

### Stats Bar (5 KPIs)
- [ ] **Matérias**: Shows format "X/Y" (e.g., "3/13")
- [ ] **Matérias**: Has green color with progress bar
- [ ] **Horas Líq.**: Shows decimal hours (e.g., "7.6h")
- [ ] **Horas Líq.**: Has cyan color
- [ ] **Erros Logg.**: Shows number with amber color
- [ ] **Wall of Stone**: Shows number with red color
- [ ] **Questões**: Shows large number with green glow and border
- [ ] All numbers use monospace font (JetBrains Mono)
- [ ] Stats update when changing time filter

### Essay Performance Chart
- [ ] Chart renders without errors
- [ ] Green area gradient visible
- [ ] X-axis shows dates in DD/MM format
- [ ] Y-axis range is 400-1000
- [ ] META reference line at 800 visible
- [ ] Hover shows tooltip with C1-C5 breakdown
- [ ] Data points have green dots
- [ ] Title: "$ ESSAY PERFORMANCE // REDAÇÃO" in green

### Simulated Performance Chart
- [ ] Chart renders without errors
- [ ] Cyan line visible
- [ ] X-axis shows dates in DD/MM format
- [ ] Y-axis range is 0-90
- [ ] Hover shows tooltip with score
- [ ] Data points have cyan dots
- [ ] Title: "$ DESEMPENHO SIMULADOS" in cyan

### Ritual Beast Mode
- [ ] Input field for "Questões Hoje" visible
- [ ] Number input accepts values
- [ ] 4 checkboxes visible:
  - [ ] Sono adequado (7-8h)
  - [ ] Exercício físico
  - [ ] Alimentação limpa
  - [ ] Zero redes sociais
- [ ] Checkboxes toggle on/off
- [ ] "REGISTRAR" button visible (green background)
- [ ] Clicking REGISTRAR saves data (page reloads)
- [ ] After save, Questões count updates in Stats Bar

### Topic Heatmap
- [ ] All subjects listed with color dots
- [ ] Each subject shows "X/Y" count
- [ ] Grid of topic squares visible
- [ ] Topics colored by status:
  - Gray (TODO)
  - Amber (IN_PROGRESS)
  - Green (MASTERED)
  - Red (LOCKED - Wall of Stone)
- [ ] Hover on square shows topic name in tooltip
- [ ] Legend at bottom shows 4 status types

### Error Distribution (Bar Chart)
- [ ] Chart renders with colored bars
- [ ] 5 categories visible:
  - TEORIA (Red)
  - INTERP (Amber)
  - DESATENÇÃO (Cyan)
  - TEMPO (Gray)
  - EMOCIONAL (Purple)
- [ ] Bars have different heights based on count
- [ ] Hover shows count tooltip
- [ ] Title: "ERRO TAXONOMY // DISTRIBUIÇÃO" in amber

### Error Sniper Log
- [ ] Scrollable list of errors visible
- [ ] Each error shows:
  - Colored tag (TEORIA, INTERP, etc.)
  - Date in DD/MM format
  - Subject with colored dot
  - Description text
  - Topic name
  - Simulation name (if applicable)
- [ ] Can scroll through list
- [ ] Border colors match error types
- [ ] Count shows at top (e.g., "50 REGISTROS")

### Wall of Stone
- [ ] Red border with glow effect
- [ ] Title has red glow effect
- [ ] Lists locked topics (if any)
- [ ] Each topic shows:
  - Name in red
  - Subject with colored dot
  - Difficulty bars (1-5)
  - Session count
  - Error count
- [ ] If no locked topics: shows success message

---

## 📱 Responsive Design Tests

### Desktop (1920x1080)
- [ ] Stats bar: 5 cards in one row
- [ ] Charts: 2 columns side by side
- [ ] Main content: 2 columns side by side
- [ ] All text readable
- [ ] No horizontal scroll

### Tablet (768x1024)
- [ ] Stats bar: 3 cards per row (wraps)
- [ ] Charts: 2 columns (might wrap)
- [ ] Main content: May stack
- [ ] Time filter still accessible

### Mobile (375x667)
- [ ] All cards stack vertically
- [ ] Charts full width
- [ ] Time filter buttons readable
- [ ] No elements cut off
- [ ] Can scroll smoothly

---

## 🎨 Design System Tests

### Colors
- [ ] Background is near-black (#09090b)
- [ ] All borders are zinc-800 (#27272a)
- [ ] Green neon (#00ff41) used for success/volume
- [ ] Cyan (#00d4ff) used for math/simulations
- [ ] Red (#ff0055) used for danger/locked
- [ ] Amber (#ffaa00) used for warnings
- [ ] Purple (#aa55ff) used for humanities

### Typography
- [ ] UI labels use Inter (sans-serif)
- [ ] Numbers/data use JetBrains Mono (monospace)
- [ ] All titles are UPPERCASE
- [ ] Proper letter-spacing on headers
- [ ] All UI text is in Portuguese

### Components
- [ ] No rounded corners (sharp edges)
- [ ] Thin borders (1px)
- [ ] No drop shadows
- [ ] Glow effects on key elements
- [ ] Flat, brutalist aesthetic

### Scrollbars
- [ ] Custom scrollbar visible
- [ ] Track is black
- [ ] Thumb is gray
- [ ] Hover changes to green

---

## 🔧 Technical Tests

### Database
- [ ] Prisma Studio opens: `pnpm prisma studio`
- [ ] All 8 tables visible
- [ ] Demo user exists (ID: 00000000-0000-0000-0000-000000000001)
- [ ] Subjects populated (11 subjects)
- [ ] Topics populated (~50-60 topics)
- [ ] Study sessions exist (last 90 days)
- [ ] Simulations exist (~6 entries)
- [ ] Essays exist (~13 entries)
- [ ] Question errors exist (~100+ entries)
- [ ] Daily logs exist (90 entries)

### Performance
- [ ] Initial page load < 2 seconds (local)
- [ ] Filter changes update instantly
- [ ] Charts render smoothly
- [ ] No layout shift on load
- [ ] Images lazy load (if any)

### TypeScript
- [ ] `pnpm build` completes without errors
- [ ] No type errors in IDE
- [ ] All imports resolve correctly
- [ ] Prisma types auto-complete

### Environment
- [ ] `.env` not committed to git (check `.gitignore`)
- [ ] `node_modules` not committed
- [ ] `.next` directory in `.gitignore`

---

## 🐛 Common Issues Checklist

### "Prisma Client Not Generated"
- [ ] Run `pnpm prisma:generate`
- [ ] Restart dev server

### "Connection Timed Out"
- [ ] Verify `DATABASE_URL` in `.env`
- [ ] Test connection: `pnpm prisma studio`
- [ ] Check database is running

### Stats Show Zero
- [ ] Check time filter (try "ANO")
- [ ] Verify seed ran: `pnpm prisma:seed`
- [ ] Check Prisma Studio for data

### Charts Empty
- [ ] Change time filter to "ANO"
- [ ] Re-run seed: `pnpm prisma:seed`
- [ ] Clear browser cache

### Layout Broken
- [ ] Clear `.next` folder: `rm -rf .next`
- [ ] Restart dev server: `pnpm dev`
- [ ] Hard refresh browser (Ctrl+Shift+R)

### Fonts Look Wrong
- [ ] Check Network tab for font loading
- [ ] Verify `layout.tsx` includes font variables
- [ ] Try different browser

---

## 🚀 Pre-Deployment Checklist

- [ ] All tests above pass
- [ ] Build succeeds: `pnpm build`
- [ ] Production build runs: `pnpm start`
- [ ] No console errors in production build
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Seed script tested on production DB
- [ ] README updated
- [ ] CHANGELOG updated

---

## 📊 Success Criteria

### Must Have
- ✅ All 5 stats cards display data
- ✅ Both charts render correctly
- ✅ Time filter works
- ✅ Ritual Beast Mode saves data
- ✅ No TypeScript errors
- ✅ No runtime errors

### Should Have
- ✅ All components styled correctly
- ✅ Responsive on mobile
- ✅ Fast load times
- ✅ Smooth interactions

### Nice to Have
- ✅ Custom scrollbars
- ✅ Glow effects
- ✅ Smooth transitions
- ✅ Hover states

---

## 🎓 Manual Testing Scenarios

### Scenario 1: New Day Workflow
1. Open dashboard
2. Click "HOJE" filter
3. Open Ritual Beast Mode
4. Input 150 questions
5. Check all 4 habits
6. Click REGISTRAR
7. Verify Questões stat updates to 150

### Scenario 2: Weekly Review
1. Click "SEMANA" filter
2. Check Error Distribution chart
3. Identify most common error type
4. Open Error Sniper Log
5. Review recent errors
6. Note topics needing attention

### Scenario 3: Monthly Progress
1. Click "MÊS" filter
2. Check Essay Performance chart
3. Verify upward trend
4. Check Simulation Performance
5. Review Topic Heatmap
6. Count mastered topics

### Scenario 4: Tackle Wall of Stone
1. Scroll to Wall of Stone section
2. Identify locked topic
3. Note difficulty level
4. Check error count
5. Plan study session

---

**Testing Complete?** If all checkboxes pass, KORTEX is ready! 🚀

*Last Updated: 2026-02-08*
