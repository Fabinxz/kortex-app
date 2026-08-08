# KORTEX - Guia Rápido de Referência

## 🎯 Visão Geral do Sistema

KORTEX é um dashboard de alta performance para preparação para vestibular de medicina. Sistema modular com tracking completo de métricas de estudo.

## 📊 Métricas Principais (Stats Bar)

### 1. Matérias Dominadas
- **O que mostra**: Tópicos com status "MASTERED" / Total de tópicos
- **Cor**: Verde (#00ff41)
- **Exemplo**: 3/13 significa 3 tópicos dominados de 13 totais

### 2. Horas Líquidas
- **O que mostra**: Soma das sessões de estudo no período selecionado
- **Cor**: Cyan (#00d4ff)
- **Unidade**: Horas decimais (ex: 7.6h)

### 3. Erros Registrados
- **O que mostra**: Quantidade de erros catalogados no período
- **Cor**: Âmbar (#ffaa00)
- **Uso**: Para tracking de evolução (deve diminuir com o tempo)

### 4. Muro de Pedra (Wall of Stone)
- **O que mostra**: Tópicos marcados como bloqueados/difíceis
- **Cor**: Vermelho (#ff0055)
- **Ação**: Focar esforços nesses tópicos

### 5. Questões Feitas ⭐ **MÉTRICA PRINCIPAL**
- **O que mostra**: Volume total de questões resolvidas no período
- **Cor**: Verde brilhante com glow
- **Importância**: Principal indicador de volume de trabalho

## 🕒 Filtro Temporal

Controla TODOS os dados exibidos no dashboard:

- **HOJE**: Apenas hoje
- **SEMANA**: Últimos 7 dias
- **MÊS**: Últimos 30 dias (padrão)
- **ANO**: Últimos 365 dias

## 📈 Gráficos de Performance

### Evolução na Redação
- **Tipo**: Área chart com preenchimento verde
- **Eixo Y**: 400-1000 pontos
- **Meta**: Linha tracejada em 800 pontos
- **Tooltip**: Mostra breakdown C1-C5 ao passar o mouse

### Desempenho nos Simulados
- **Tipo**: Line chart cyan
- **Eixo Y**: 0-90 acertos
- **Dados**: Apenas histórico real (sem predições)

## 🔥 Ritual Beast Mode

Módulo de input diário. Registre:

1. **Questões Feitas Hoje**: Input numérico
2. **Hábitos do Dia** (checkboxes):
   - Sono adequado (7-8h)
   - Exercício físico
   - Alimentação limpa
   - Zero redes sociais

**Botão REGISTRAR**: Salva e atualiza todas as métricas

## 🗺️ Domínio por Matéria (Heatmap)

Grid visual de tópicos por matéria.

**Cores dos Status**:
- **Cinza escuro**: TODO (não iniciado)
- **Âmbar**: IN_PROGRESS (em progresso)
- **Verde**: MASTERED (dominado)
- **Vermelho**: LOCKED (muro de pedra)

**Hover**: Mostra nome do tópico

## 📊 Taxonomia de Erros

Bar chart com 5 categorias:

1. **TEORIA** (Vermelho): Lacuna teórica, não dominou conceito
2. **INTERPRETAÇÃO** (Âmbar): Não entendeu o enunciado
3. **DESATENÇÃO** (Cyan): Erro de cálculo, pulou etapa
4. **TEMPO** (Cinza): Não teve tempo suficiente
5. **EMOCIONAL** (Roxo): Ansiedade, nervosismo

## 🎯 Error Sniper Log

Lista densa e scrollável de erros recentes.

**Cada entrada mostra**:
- Tag colorida do tipo de erro
- Data (DD/MM)
- Matéria (bolinha colorida)
- Descrição do erro
- Tópico relacionado
- Simulado (se aplicável)

**Uso**: Revisar padrões de erro para focar estudos

## 🧱 Muro de Pedra

Lista de tópicos bloqueados que exigem atenção especial.

**Cada card mostra**:
- Nome do tópico (vermelho)
- Matéria
- Nível de dificuldade (1-5 barras)
- Quantidade de sessões de estudo
- Quantidade de erros

**Objetivo**: Zerar essa lista!

## 🎨 Design System - Referência Rápida

### Cores Principais (Hex)
```
#09090b - Fundo principal
#00ff41 - Verde (sucesso/volume)
#00d4ff - Cyan (matemática/sims)
#ff0055 - Vermelho (danger/locked)
#ffaa00 - Âmbar (warning)
#aa55ff - Roxo (humanas)
#27272a - Bordas (zinc-800)
```

### Fontes
- **Labels/UI**: Inter (sans-serif)
- **Números/Dados**: JetBrains Mono (monospace)

### Padrões
- Sem arredondamento (sharp corners)
- Bordas finas (1px)
- Sem sombras (exceto glows sutis)
- Tudo uppercase nos títulos

## 🔄 Workflow Recomendado

### Diário (5 min)
1. Abrir KORTEX
2. Filtro: **HOJE**
3. Preencher "Ritual Beast Mode"
4. Revisar "Error Sniper Log" do dia

### Semanal (15 min)
1. Filtro: **SEMANA**
2. Analisar "Erro Taxonomy"
3. Identificar padrões (ex: muitos erros de INTERPRETAÇÃO)
4. Ajustar estratégia de estudo

### Mensal (30 min)
1. Filtro: **MÊS**
2. Revisar evolução nos gráficos
3. Verificar "Muro de Pedra"
4. Planejar próximo mês

## 🚀 Atalhos e Dicas

### Para Aumentar Volume
- Foco na métrica "Questões Feitas"
- Meta sugerida: 200+ questões/dia
- Consistência > Intensidade

### Para Melhorar Redação
- Acompanhar gráfico semanal
- Identificar competência mais fraca (C1-C5)
- Meta: 800+ pontos consistentes

### Para Dominar Tópicos
- Priorizar "Muro de Pedra"
- Status TODO → IN_PROGRESS → MASTERED
- Heatmap deve ficar verde

### Para Reduzir Erros
- Analisar taxonomia semanalmente
- Se TEORIA alto: revisar conceitos
- Se INTERPRETAÇÃO alto: treinar enunciados
- Se DESATENÇÃO alto: resolver mais devagar

## 📱 Responsividade

- **Desktop**: Layout 2 colunas
- **Tablet**: Stack adaptativo
- **Mobile**: Single column

## 🐛 Troubleshooting Comum

### Dados não aparecem
- Verifique se rodou `pnpm prisma:seed`
- Tente mudar o filtro temporal

### Métricas zeradas
- Filtro "HOJE" pode estar vazio se não registrou dados hoje
- Mude para "SEMANA" ou "MÊS"

### Gráficos vazios
- Seed cria 90 dias de dados
- Ajuste range do filtro

## 📚 Recursos Adicionais

- README.md - Setup completo
- prisma/schema.prisma - Estrutura do banco
- lib/queries.ts - Lógica de filtros

---

**KORTEX v1.0** // *"Measure everything. Master anything."*
