# Changelog

All notable changes to KORTEX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-08

### Added - Initial Release

#### Core Features
- **Dashboard de Performance** completo com 5 métricas principais
- **Filtro Temporal Global** (HOJE/SEMANA/MÊS/ANO) que controla todos os dados
- **Gráfico de Evolução na Redação** com breakdown de competências (C1-C5)
- **Gráfico de Desempenho nos Simulados** com tracking histórico
- **Ritual Beast Mode** para input diário de volume e hábitos
- **Heatmap de Domínio** mostrando status de todos os tópicos
- **Taxonomia de Erros** com 5 categorias (Teoria, Interpretação, Desatenção, Tempo, Emocional)
- **Error Sniper Log** com lista scrollável de erros recentes
- **Muro de Pedra** destacando tópicos bloqueados

#### Technical Stack
- Next.js 14 (App Router)
- React 19
- TypeScript 5.7
- Prisma ORM 6.2
- PostgreSQL
- Tailwind CSS 3.4
- Shadcn UI
- Recharts 2.15
- date-fns 4.1

#### Design System
- Estética Cyber-Brutalist com paleta neon
- Tipografia: Inter (UI) + JetBrains Mono (dados)
- Cores principais: Verde (#00ff41), Cyan (#00d4ff), Vermelho (#ff0055), Âmbar (#ffaa00), Roxo (#aa55ff)
- Zero arredondamento, bordas finas, design flat

#### Database Schema
- 8 modelos principais: User, Subject, Topic, StudySession, Simulation, Essay, QuestionError, DailyLog
- Suporte completo para tracking de tempo, erros, redações e simulados
- Status de tópicos: TODO, IN_PROGRESS, MASTERED
- Flag "Wall of Stone" para tópicos bloqueados

#### Developer Experience
- Seed script com 90 dias de dados mock
- Setup scripts para Windows (.bat) e Unix (.sh)
- Documentação completa (README, GUIDE, API, DEPLOYMENT)
- VSCode settings otimizadas
- TypeScript strict mode
- Prisma Studio para visualização de dados

#### Deployment
- Pronto para deploy no Vercel
- Suporte para Neon Database (PostgreSQL serverless)
- Environment variables configuradas
- Build otimizado com geração automática do Prisma Client

### Components
- `dashboard-header` - Cabeçalho com filtro temporal e status
- `stats-bar` - Grid com 5 KPIs principais
- `time-filter` - Seletor de range temporal
- `essay-performance-chart` - Gráfico de área para redações
- `simulated-performance-chart` - Line chart para simulados
- `ritual-beast-mode` - Formulário de input diário
- `topic-heatmap` - Grid visual de domínio por matéria
- `error-distribution` - Bar chart de taxonomia
- `error-log` - Lista densa de erros recentes
- `wall-of-stone` - Cards de tópicos bloqueados

### Documentation
- `README.md` - Setup completo e overview
- `GUIDE.md` - Guia de referência rápida em PT-BR
- `API.md` - Documentação técnica da API
- `DEPLOYMENT.md` - Guia de deploy para produção
- `CHANGELOG.md` - Este arquivo

### Scripts
- `setup.sh` / `setup.bat` - Scripts de instalação automática
- `pnpm dev` - Servidor de desenvolvimento
- `pnpm build` - Build de produção
- `pnpm prisma:push` - Sincronizar schema com DB
- `pnpm prisma:seed` - Popular banco com dados mock
- `pnpm prisma:studio` - Interface visual do banco

---

## [Unreleased]

### Planned Features
- [ ] Autenticação com NextAuth
- [ ] Multi-user support
- [ ] Export de dados para CSV/PDF
- [ ] Gráficos adicionais (velocity charts, burndown)
- [ ] Pomodoro timer integrado
- [ ] Notificações push
- [ ] Mobile app (React Native)
- [ ] Integração com Google Calendar
- [ ] AI-powered study recommendations
- [ ] Gamificação (badges, achievements)

### Known Issues
- None reported yet

---

## Version History

- **1.0.0** (2026-02-08) - Initial release

---

**KORTEX v1.0** // Sistema de Performance Cognitiva  
*"Measure everything. Master anything."*
