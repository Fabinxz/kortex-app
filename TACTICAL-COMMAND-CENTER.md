# 🎯 KORTEX - Tactical Command Center

## Transformação v2.0: De Informacional para Ação

### O Que Mudou?

Substituímos a seção "Bottom Deck" passiva (Heatmap, Error Log, Wall of Stone) por um **Centro de Comando Tático** focado em ROI máximo para o estudante.

---

## 🚀 Nova Arquitetura

### Split-View Layout (50/50)

```
┌─────────────────────────────────────────────────────────┐
│  RADAR DE PRIORIDADE     │    O LABORATÓRIO            │
│  (Alvos de Alto Valor)   │    (Tabs: Necrotério +      │
│                           │     Protocolo)              │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 PAINEL ESQUERDO: Radar de Prioridade

### Conceito
Matriz inteligente que mostra **O QUE** estudar baseado em:
- **Alta Incidência** no vestibular
- **Baixo Domínio** atual

### Features
- Lista Top 3-5 tópicos críticos
- Cada item mostra:
  - Nome do tópico
  - Tag de incidência (BAIXA / MÉDIA / ALTA / ALTÍSSIMA)
  - Score de domínio atual (0-100%)
  - Contador de erros
  - Barra de progresso
- **Botão de Ação**: "INICIAR BATERIA"
  - Próximo: Integrar com sistema de questões

### Lógica de Priorização
```typescript
1. Filtrar: status != MASTERED
2. Ordenar por:
   - Incidência (VERY_HIGH > HIGH > MEDIUM > LOW)
   - Status (TODO > IN_PROGRESS)
3. Limitar: Top 5
```

### Visual
- Borda **vermelha** com glow para itens críticos
- Primeiro item sempre destacado
- Hover effects

---

## 🧪 PAINEL DIREITO: O Laboratório

### Tab 1: NECROTÉRIO (Revisão Ativa de Erros)

#### Estado A: Vazio/Início
```
┌─────────────────────────────────────┐
│  ❌ Você tem 12 erros pendentes    │
│                                     │
│  [ELIMINAR ERROS AGORA]            │
└─────────────────────────────────────┘
```

#### Estado B: Modo Ativo
Mostra **UM erro por vez** (flashcard):

```
┌─────────────────────────────────────┐
│  ERRO 1 DE 12  │  REVISÃO #2        │
│                                     │
│  O QUE VOCÊ ERROU?                 │
│  [Descrição do erro]               │
│                                     │
│  [REVELAR CORREÇÃO] ←              │
└─────────────────────────────────────┘
```

Após revelar:
```
┌─────────────────────────────────────┐
│  CORREÇÃO:                          │
│  [Explicação detalhada]            │
│                                     │
│  [ERREI]  [ACERTEI ✓]              │
└─────────────────────────────────────┘
```

#### Sistema de Repetição Espaçada
- **Acertou**: Próxima revisão = 2^(reviewCount) dias
  - 1ª vez: 2 dias
  - 2ª vez: 4 dias
  - 3ª vez: 8 dias
  - 4ª vez: 16 dias
  - Arquivado após 3 acertos consecutivos
- **Errou**: Volta para 1 dia (resetar contador)

### Tab 2: PROTOCOLO DE DESBLOQUEIO

#### Conceito
Gamificação para tópicos bloqueados (Wall of Stone).

#### Visual
```
┌─────────────────────────────────────┐
│  🔒 ELETRODINÂMICA                 │
│  Física                            │
│                                    │
│  Missão: Acertar 5 questões       │
│  seguidas                          │
│                                    │
│  [████████░░░░] 40%                │
│                                    │
│  3 sessões • 5 erros • Dif. 4/5   │
└─────────────────────────────────────┘
```

#### Mecânica de Desbloqueio
- **Objetivo**: 5 questões corretas consecutivas
- **Progress bar**: 0-100%
- **Ícone**: 🔒 (locked) → 🔓 (unlocked)
- **Status**: Atualiza `unlockProgress` no banco

---

## 🗄️ Mudanças no Banco de Dados

### Schema Updates

#### Topic Model
```prisma
model Topic {
  // ... campos existentes
  incidence      IncidenceLevel @default(MEDIUM)
  unlockProgress Int            @default(0)
}

enum IncidenceLevel {
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}
```

#### QuestionError Model
```prisma
model QuestionError {
  // ... campos existentes
  nextReview   DateTime @default(now())
  reviewCount  Int      @default(0)
  archived     Boolean  @default(false)
}
```

---

## 📊 Novas Queries

### 1. `getPriorityRadar(limit)`
Retorna tópicos de alta prioridade:
- Filtro: `status != MASTERED`
- Ordenação: `incidence DESC, status ASC`
- Cálculo de mastery score

### 2. `getPendingErrors(limit)`
Retorna erros para revisar:
- Filtro: `archived = false` AND `nextReview <= now()`
- Ordenação: `nextReview ASC`

### 3. `reviewError(errorId, correct)`
Atualiza erro após revisão:
- Se correto: aumenta `reviewCount`, calcula próximo review
- Se incorreto: reseta `reviewCount`, marca para amanhã
- Arquiva após 3 reviews corretos

### 4. `getUnlockProtocol()`
Retorna tópicos bloqueados:
- Filtro: `isWallOfStone = true`
- Inclui: progress, sessões, erros

---

## 🎨 Styling Guide

### Radar de Prioridade
- **Container**: `border-cyber-red` com `border-glow-red`
- **Items**: Primeiro destaque com borda vermelha
- **Tags de Incidência**:
  - VERY_HIGH / HIGH: `text-cyber-red border-cyber-red glow-red`
  - MEDIUM: `text-cyber-amber border-cyber-amber`
  - LOW: `text-zinc-500 border-zinc-700`
- **Botão Ação**: `bg-cyber-red text-black`

### Laboratório
- **Tabs**: 
  - Necrotério: `bg-cyber-red` quando ativo
  - Protocolo: `bg-cyber-amber` quando ativo
- **Error Cards**: `bg-zinc-900 border-zinc-800`
- **Botões**:
  - ERREI: `bg-zinc-800`
  - ACERTEI: `bg-cyber-green`
- **Lock Icons**: `text-cyber-amber`

---

## 🔄 Workflow do Usuário

### Diário (5 min)
1. Abrir dashboard
2. Ver **Radar de Prioridade** → Identificar tópico crítico
3. Clicar "INICIAR BATERIA" (futura integração)
4. Ir para **Necrotério** → Revisar erros pendentes

### Semanal (15 min)
1. Tab **Protocolo** → Focar em desbloquear 1 tópico
2. Resolver 5 questões consecutivas corretas
3. Desbloquear e comemorar! 🎉

---

## 🚀 Próximos Passos

### Fase 1: Integração com Questões ✅ (Atual)
- [x] UI do Radar
- [x] UI do Laboratório
- [x] Sistema de spaced repetition
- [ ] Integrar botão "INICIAR BATERIA" com banco de questões

### Fase 2: Gamificação
- [ ] Conquistas (badges)
- [ ] Streaks de revisão
- [ ] Leaderboard (opcional)

### Fase 3: IA
- [ ] Recomendação inteligente de prioridades
- [ ] Predição de performance
- [ ] Geração automática de questões

---

## 📝 Como Usar (Para Desenvolvedores)

### 1. Atualizar Database
```bash
npm run prisma:push
npm run prisma:seed
```

### 2. Verificar Novos Campos
```bash
npm run prisma:studio
```

### 3. Testar Componentes
- **Radar**: Deve mostrar 5 tópicos priorizados
- **Necrotério**: Clicar "ELIMINAR ERROS AGORA"
- **Protocolo**: Ver tópicos bloqueados com progress

---

## 🎯 ROI para o Estudante

### Antes (Passivo)
- Ver lista de erros → Sem ação clara
- Ver tópicos bloqueados → Sem gamificação
- Heatmap → Só visual, sem priorização

### Depois (Ativo)
- **Radar**: Diz EXATAMENTE o que estudar
- **Necrotério**: Elimina erros com spaced repetition
- **Protocolo**: Gamifica o desbloqueio

### Resultado Esperado
- ↑ Clareza sobre o que estudar
- ↑ Retenção de erros (spaced repetition)
- ↑ Motivação (gamificação)
- ↑ Performance no vestibular

---

## 🔧 Manutenção

### Ajustar Prioridades
Editar `lib/queries.ts` → `getPriorityRadar()`:
```typescript
orderBy: [
  { incidence: 'desc' },  // Mudar peso
  { errorCount: 'desc' }, // Adicionar critério
]
```

### Ajustar Spaced Repetition
Editar `lib/queries.ts` → `reviewError()`:
```typescript
const nextReviewDays = correct 
  ? Math.min(30, Math.pow(2, error.reviewCount + 1))
  : 1
```

---

**KORTEX v2.0 - Tactical Command Center**  
*"De observador para protagonista. De dados para ação."*

🎯 **Measure everything. Master anything. ACT NOW.**
