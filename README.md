# KORTEX // Sistema de Performance Cognitiva

Dashboard full-stack desenvolvido para rastrear e analisar métricas de estudo para vestibulares de alta concorrência. Criado para resolver o problema de falta de mensuração de desempenho nos estudos.

## Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript** — Tipagem estrita
- **SQLite / PostgreSQL** — Banco de dados via Prisma ORM
- **Prisma** — Schema, migrations, seed
- **Tailwind CSS** — Estilização com design system customizado
- **Recharts** — Gráficos de desempenho
- **Framer Motion** — Animações de interface
- **Radix UI** — Componentes acessíveis (Dialog, Tabs, Select, etc.)

## Funcionalidades

- **Stats Bar** — Métricas de tópicos dominados, horas líquidas, sequência diária, contagem regressiva para provas e volume de questões.
- **Desempenho em Simulados** — Gráfico de evolução por área (MAT, NAT, HUM, LIN) com análise de ritmo de prova e alertas de desempenho.
- **Desempenho em Redações** — Gráfico de evolução por competência (C1–C5) com radar de perfil e correlação tempo/nota.
- **Mapa de Calor por Tópico** — Visualização de proficiência por assunto em grid ou lista, com filtro por área.
- **Registro de Erros** — Log detalhado com taxonomia (Teoria, Interpretação, Desatenção, Tempo, Emocional).
- **Muro de Pedra** — Tópicos bloqueados com nível de dificuldade e contagem de sessões/erros.
- **Ritual Beast Mode** — Registro diário de questões e hábitos (sono, exercício, dieta, redes sociais).
- **Modais de Entrada** — Formulários para registrar redações e simulados com feedback visual em tempo real.

## Como Rodar

```bash
# 1. Clone o repositório
git clone <repo-url> && cd kortex-app-main

# 2. Copie o .env
cp .env.example .env

# 3. Configure o DATABASE_URL no .env
# SQLite (local):  DATABASE_URL="file:./dev.db"
# PostgreSQL:      DATABASE_URL="postgresql://user:pass@host:5432/kortex"

# 4. Instale as dependências
npm install --legacy-peer-deps

# 5. Configure o banco
npx prisma db push
npx prisma generate

# 6. Popule com dados de exemplo
npm run prisma:seed

# 7. Inicie o servidor
npm run dev
```

Acesse: `http://localhost:3000`

## Estrutura do Projeto

```
app/              → Páginas (App Router)
components/
  kortex/         → Componentes do dashboard
  modals/         → Modais de entrada de dados
  ui/             → Componentes base (Radix UI)
lib/              → Queries, utilitários, conexão com DB
prisma/           → Schema e seed
```

## Licença

MIT
