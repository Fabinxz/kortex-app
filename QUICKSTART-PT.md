# KORTEX - Início Rápido (PT-BR)

## 🎯 Bem-vindo ao KORTEX

Sistema de alta performance para tracking de estudos preparatórios para Medicina.

---

## ⚡ Instalação Rápida

### Windows

1. Abra o terminal (PowerShell ou CMD)
2. Navegue até a pasta do projeto
3. Execute:

```bash
setup.bat
```

Siga as instruções na tela.

### Mac/Linux

1. Abra o terminal
2. Navegue até a pasta do projeto
3. Execute:

```bash
chmod +x setup.sh
./setup.sh
```

### Manual

Se os scripts não funcionarem:

```bash
# 1. Copie o arquivo de ambiente
cp .env.example .env

# 2. Edite .env e adicione seu DATABASE_URL
# (PostgreSQL local ou Neon)

# 3. Instale dependências
pnpm install
# ou: npm install

# 4. Configure o banco de dados
pnpm prisma:push
pnpm prisma:generate

# 5. Popule com dados de exemplo (90 dias)
pnpm prisma:seed

# 6. Inicie o servidor
pnpm dev
```

Abra: `http://localhost:3000`

---

## 📊 Como Usar o Dashboard

### 1. Filtro Temporal (Topo da Tela)

Controla TODOS os dados exibidos:

- **HOJE**: Apenas hoje
- **SEMANA**: Últimos 7 dias
- **MÊS**: Últimos 30 dias ⭐ (padrão)
- **ANO**: Últimos 365 dias

💡 **Dica**: Comece com "MÊS" para ver o panorama geral.

### 2. Stats Bar - 5 Métricas Principais

#### 📚 Matérias Dominadas (Verde)
- Mostra: X/Y (ex: 3/13)
- X = Tópicos dominados (status MASTERED)
- Y = Total de tópicos
- Barra de progresso visual

#### ⏱️ Horas Líquidas (Cyan)
- Soma de todas as sessões de estudo no período
- Formato: decimal (ex: 7.6h)
- Meta sugerida: 40h/semana

#### ❌ Erros Registrados (Âmbar)
- Quantidade de erros catalogados
- Use para tracking de evolução
- Deve diminuir com o tempo

#### 🧱 Muro de Pedra (Vermelho)
- Tópicos bloqueados/difíceis
- Priorize estudo desses tópicos
- Meta: zerar essa métrica

#### 🎯 QUESTÕES FEITAS (Verde Brilhante) ⭐⭐⭐
**MÉTRICA MAIS IMPORTANTE**
- Volume total de questões resolvidas
- Indicador principal de trabalho
- Meta sugerida: 150-200 questões/dia

### 3. Gráficos de Performance

#### 📝 Evolução na Redação
- **Linha verde**: Sua nota (0-1000)
- **Linha tracejada**: Meta (800 pontos)
- **Hover**: Mostra breakdown C1, C2, C3, C4, C5
- **Objetivo**: Linha sempre acima de 800

#### 📊 Desempenho nos Simulados
- **Linha cyan**: Acertos (0-90)
- **Tendência**: Deve ser ascendente
- **Hover**: Mostra número de acertos

### 4. Ritual Beast Mode 🔥

**Use TODOS OS DIAS!**

#### Como usar:
1. **Questões Hoje**: Digite o número de questões que você fez
2. **Hábitos**: Marque os checkboxes:
   - ✅ Sono adequado (7-8h)
   - ✅ Exercício físico
   - ✅ Alimentação limpa
   - ✅ Zero redes sociais
3. Clique **REGISTRAR**
4. Página recarrega com dados atualizados

💡 **Melhor Momento**: Fim do dia, antes de dormir.

### 5. Domínio por Matéria (Heatmap)

Grid visual de todos os seus tópicos.

**Cores**:
- 🟫 **Cinza**: TODO (não iniciado)
- 🟧 **Âmbar**: EM PROGRESSO
- 🟩 **Verde**: DOMINADO ✅
- 🟥 **Vermelho**: BLOQUEADO (Muro de Pedra)

**Como usar**:
- Passe o mouse sobre os quadrados para ver o nome do tópico
- Foque em transformar cinza → âmbar → verde
- Priorize destravar os vermelhos

### 6. Taxonomia de Erros (Bar Chart)

Gráfico de barras com 5 tipos de erro:

1. **TEORIA** (Vermelho): Não dominou o conceito
2. **INTERPRETAÇÃO** (Âmbar): Não entendeu o enunciado
3. **DESATENÇÃO** (Cyan): Erro bobo, cálculo errado
4. **TEMPO** (Cinza): Não teve tempo suficiente
5. **EMOCIONAL** (Roxo): Ansiedade, nervosismo

**Como usar**:
- Identifique sua barra mais alta
- **Se TEORIA alto**: Revise material teórico
- **Se INTERPRETAÇÃO alto**: Treine leitura de enunciados
- **Se DESATENÇÃO alto**: Resolva questões mais devagar
- **Se TEMPO alto**: Treine velocidade
- **Se EMOCIONAL alto**: Trabalhe técnicas de controle emocional

### 7. Error Sniper Log 🎯

Lista completa de todos os erros recentes.

**Cada erro mostra**:
- Tag colorida do tipo
- Data (DD/MM)
- Matéria (bolinha colorida)
- Descrição
- Tópico
- Simulado (se aplicável)

**Como usar**:
- Revise semanalmente
- Identifique padrões
- Revise tópicos com mais erros

### 8. Muro de Pedra (Wall of Stone) 🧱

Lista de tópicos que você marcou como bloqueados.

**Cada tópico mostra**:
- Nome (em vermelho)
- Matéria
- Dificuldade (1-5 barras)
- Quantas vezes você estudou
- Quantos erros teve

**Como desbloquear**:
1. Escolha um tópico
2. Dedique 3-4 sessões de estudo intensas
3. Refaça exercícios até acertar consistentemente
4. Quando dominar, remova do "Muro"

---

## 🔄 Workflow Recomendado

### Rotina Diária (5 minutos)

**Manhã:**
1. Abra KORTEX
2. Filtro: HOJE
3. Note suas metas do dia

**Noite:**
1. Abra "Ritual Beast Mode"
2. Digite quantas questões fez
3. Marque os hábitos cumpridos
4. Clique REGISTRAR

### Revisão Semanal (15 minutos)

**Toda segunda-feira:**
1. Filtro: SEMANA
2. Analise "Taxonomia de Erros"
3. Revise "Error Sniper Log"
4. Ajuste estratégia da semana

**Perguntas para responder:**
- Qual tipo de erro foi mais comum?
- Quais tópicos erraram mais?
- Cumpri os hábitos?
- Atingi a meta de volume?

### Revisão Mensal (30 minutos)

**Primeira segunda do mês:**
1. Filtro: MÊS
2. Analise evolução nos gráficos
3. Verifique "Muro de Pedra"
4. Conte quantos tópicos dominou
5. Planeje o próximo mês

**Perguntas para responder:**
- Notas de redação melhoraram?
- Acertos em simulados aumentaram?
- Domínio de matérias cresceu?
- Consegui manter consistência?

---

## 🎯 Metas Sugeridas

### Volume (Questões)
- **Início**: 100 questões/dia
- **Intermediário**: 150 questões/dia
- **Avançado**: 200+ questões/dia
- **Meta Semanal**: 1000+ questões

### Redação
- **Início**: 600+ pontos
- **Intermediário**: 700+ pontos
- **Avançado**: 800+ pontos (consistente)
- **Elite**: 900+ pontos

### Simulados
- **Início**: 50/90 acertos
- **Intermediário**: 65/90 acertos
- **Avançado**: 75/90 acertos
- **Elite**: 80+/90 acertos

### Domínio de Matérias
- **Meta**: 80% dos tópicos em DOMINADO (verde)
- **Crítico**: Zero tópicos no Muro de Pedra

### Hábitos
- **Meta**: 100% de checkmarks todos os dias
- Sono, exercício, dieta e zero redes sociais

---

## 💡 Dicas Pro

### Para Aumentar Volume
1. Use técnica Pomodoro (25min foco + 5min pausa)
2. Resolva questões antigas primeiro (mais fácil)
3. Não perca tempo com questões impossíveis
4. Mantenha ritmo constante (não maratone)

### Para Melhorar Redação
1. Escreva 1 redação por semana (mínimo)
2. Analise o gráfico: identifique competência mais fraca
3. Foque em corrigir uma competência por vez
4. Use modelos de introdução/conclusão

### Para Dominar Tópicos
1. Priorize "Muro de Pedra"
2. Estude teoria → Faça exercícios → Revise erros
3. Use ciclo: TODO → EM PROGRESSO → DOMINADO
4. Não avance sem dominar o básico

### Para Reduzir Erros
1. Revise semanalmente o "Error Sniper Log"
2. Anote padrões em um caderno físico
3. Refaça questões que errou após 1 semana
4. Se errou 2x o mesmo tipo: PARE e estude teoria

### Para Manter Consistência
1. Use o dashboard TODO DIA (5 min)
2. Não quebre a sequência de registros
3. Hábitos > Intensidade
4. Celebre pequenas vitórias (ex: dominou um tópico)

---

## 🐛 Problemas Comuns

### "Métricas estão zeradas"
- Mude o filtro para "ANO"
- Se ainda zerado, rode: `pnpm prisma:seed`

### "Gráficos estão vazios"
- Use filtro "ANO" para ver dados históricos
- Verifique se o seed rodou corretamente

### "Não salvou meu registro"
- Verifique conexão com internet (se database remoto)
- Veja console do navegador (F12) para erros

### "Dashboard está lento"
- Limpe cache do navegador
- Reinicie o servidor: `pnpm dev`

---

## 📚 Recursos Adicionais

- **README.md**: Documentação técnica completa
- **GUIDE.md**: Guia de referência detalhado
- **TESTING.md**: Checklist de testes

---

## 🎓 Mindset KORTEX

> **"Measure everything. Master anything."**

1. **Volume é Rei**: Mais questões = mais aprendizado
2. **Consistência > Intensidade**: 150 questões/dia por 365 dias > 1000 questões em 1 dia
3. **Erros são Dados**: Cada erro é uma oportunidade de melhorar
4. **Hábitos Sustentam Performance**: Sono, exercício e dieta não são opcionais
5. **Tracking é Poder**: Se você mede, você melhora

---

## 🚀 Próximos Passos

1. ✅ Complete a instalação
2. ✅ Explore o dashboard com dados de exemplo
3. ✅ Registre seu primeiro dia no Ritual Beast Mode
4. ✅ Estabeleça suas metas pessoais
5. ✅ Revise semanalmente
6. ✅ Ajuste estratégia mensalmente
7. ✅ **DOMÍNIO TOTAL** 🏆

---

**KORTEX v1.0**  
Sistema de Performance Cognitiva  
Desenvolvido para estudantes de Medicina

*Boa sorte nos estudos! Você consegue! 💪*
