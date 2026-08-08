import { PrismaClient, TopicStatus, ErrorType, IncidenceLevel } from '@prisma/client'

const prisma = new PrismaClient()

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

// --- ENEM MATRIZ DE REFERÊNCIA: MATÉRIAS E TÓPICOS ---
const subjects = [
  { name: 'Matemática e suas Tecnologias', color: '#00d4ff' },
  { name: 'Física', color: '#ff0055' },
  { name: 'Química', color: '#00ff41' },
  { name: 'Biologia', color: '#00e676' },
  { name: 'História', color: '#ff9100' },
  { name: 'Geografia', color: '#ffc400' },
  { name: 'Filosofia', color: '#ffd600' },
  { name: 'Sociologia', color: '#ff6d00' },
  { name: 'Linguagens e Gramática', color: '#ab47bc' },
  { name: 'Literatura Brasileira', color: '#7e57c2' },
  { name: 'Língua Estrangeira (Inglês)', color: '#29b6f6' },
]

const topicsBySubject: Record<string, string[]> = {
  'Matemática e suas Tecnologias': [
    'Matemática Financeira e Porcentagem',
    'Estatística e Análise de Gráficos',
    'Geometria Plana e Espacial',
    'Funções (1º, 2º grau, Exponencial e Log)',
    'Razão, Proporção e Regra de Três',
  ],
  'Física': [
    'Eletrodinâmica (Circuitos e Potência)',
    'Termologia e Calorimetria',
    'Ondulatória e Acústica',
    'Cinemática e Mecânica',
    'Óptica Geométrica',
  ],
  'Química': [
    'Estequiometria e Cálculos Químicos',
    'Química Orgânica (Reações e Funções)',
    'Físico-Química (Termoquímica e Cinética)',
    'Eletroquímica (Pilhas e Eletrólise)',
    'Soluções e Concentrações',
  ],
  'Biologia': [
    'Ecologia e Impactos Ambientais',
    'Citologia e Biologia Celular',
    'Genética e Biotecnologia',
    'Fisiologia Humana e Saúde Pública',
    'Evolução e Imunologia',
  ],
  'História': [
    'Brasil Império e Segunda Guerra',
    'Era Vargas e Populismo',
    'Ditadura Militar no Brasil',
    'Brasil Colônia e Escravidão',
    'História Contemporânea e Guerra Fria',
  ],
  'Geografia': [
    'Geografia Agrária e Ambiental',
    'Geopolítica Mundial e Globalização',
    'Urbanização e Demografia Brasileira',
    'Climatologia e Domínios Morphoclimáticos',
    'Cartografia e Geologia',
  ],
  'Filosofia': [
    'Ética, Política e Cidadania',
    'Filosofia Antiga (Sócrates, Platão e Aristóteles)',
    'Epistemologia Moderna e Racionalismo',
    'Filosofia Contemporânea e Teoria Crítica',
  ],
  'Sociologia': [
    'Cultura, Identidade e Diversidade',
    'Trabalho e Transformações Produtivas',
    'Movimentos Sociais e Direitos Humanos',
    'Sociologia Clássica (Marx, Durkheim e Weber)',
  ],
  'Linguagens e Gramática': [
    'Funções e Figuras de Linguagem',
    'Variação Linguística e Norma Culta',
    'Gêneros Textuais e Coesão',
    'Interpretação e Análise do Discurso',
  ],
  'Literatura Brasileira': [
    'Modernismo Brasileiro (1ª, 2ª e 3ª Fases)',
    'Realismo, Naturalismo e Parnasianismo',
    'Romantismo no Brasil',
    'Literatura Contemporânea e Poesia',
  ],
  'Língua Estrangeira (Inglês)': [
    'Interpretação Textual e Skimming/Scanning',
    'Conectivos e Recursos Coesivos',
    'Vocabulário Contextualizado em Notícias',
  ],
}

// --- TEMAS REAIS DE REDAÇÃO ENEM ---
const realEnemEssayThemes = [
  'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
  'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
  'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
  'O estigma associado às doenças mentais na sociedade brasileira',
  'Democratização do acesso ao cinema no Brasil',
  'Caminhos para combater a evasão escolar no ensino médio brasileiro',
  'Os impactos da inteligência artificial no mercado de trabalho e na educação',
  'O combate ao abandono de animais e os reflexos na saúde pública no Brasil',
  'Desafios da mobilidade urbana sustentável nas grandes metrópoles brasileiras',
  'A cultura do cancelamento e os limites da liberdade de expressão na internet',
  'Preservação do patrimônio histórico-cultural e identidade nacional brasileira',
  'A importância da educação financeira no ambiente escolar público e privado',
  'Caminhos para combater a intolerância religiosa no Brasil',
]

// --- SIMULADOS MODELO ENEM ---
const realEnemSimulations = [
  { name: 'ENEM 2024 - 1º Dia (Linguagens + Humanas)', maxQuestions: 90, isFirstDay: true },
  { name: 'ENEM 2024 - 2º Dia (Natureza + Matemática)', maxQuestions: 90, isFirstDay: false },
  { name: 'Simulado ENEM SAS 2024 #1 - Completo', maxQuestions: 180, isFull: true },
  { name: 'Simulado ENEM Bernoulli 2024 #2 - Completo', maxQuestions: 180, isFull: true },
  { name: 'Simulado ENEM Poliedro 2024 #3 - Completo', maxQuestions: 180, isFull: true },
  { name: 'ENEM 2023 - Aplicação Regular (Dia 1)', maxQuestions: 90, isFirstDay: true },
  { name: 'ENEM 2023 - Aplicação Regular (Dia 2)', maxQuestions: 90, isFirstDay: false },
]

// --- AUXILIAR PARA GERAR NOTAS DA REDAÇÃO ENEM DE 20 EM 20 PONTOS ---
// Competências ENEM (C1 a C5) variam em múltiplos de 20 pontos de 0 a 200.
// Ex: 120, 140, 160, 180, 200.
const VALID_ENEM_COMPETENCY_SCORES = [120, 140, 160, 180, 200]

function getRandomEnemCompetency(min: number = 140, max: number = 200): number {
  const choices = VALID_ENEM_COMPETENCY_SCORES.filter((s) => s >= min && s <= max)
  return choices[Math.floor(Math.random() * choices.length)] || 160
}

async function main() {
  console.log('🔄 Iniciando população do banco de dados 100% no padrão ENEM...')

  // Limpar dados existentes
  await prisma.dailyLog.deleteMany({})
  await prisma.questionError.deleteMany({})
  await prisma.essay.deleteMany({})
  await prisma.simulation.deleteMany({})
  await prisma.studySession.deleteMany({})
  await prisma.topic.deleteMany({})
  await prisma.subject.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('🗑️  Dados antigos removidos.')

  // Criar usuário Demo (Estudante de Medicina ENEM)
  const user = await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      email: 'medicina.enem@kortex.app',
      name: 'Futuro Médico ENEM',
    },
  })

  console.log('👤 Usuário "Futuro Médico ENEM" criado com sucesso.')

  // Criar Matérias e Tópicos conforme Matriz de Referência do ENEM
  const subjectRecords = []
  for (const subject of subjects) {
    const topics = topicsBySubject[subject.name] || []

    const subjectRecord = await prisma.subject.create({
      data: {
        userId: user.id,
        name: subject.name,
        color: subject.color,
        topics: {
          create: topics.map((topicName, idx) => {
            const incidenceMap: IncidenceLevel[] = [
              IncidenceLevel.VERY_HIGH,
              IncidenceLevel.HIGH,
              IncidenceLevel.HIGH,
              IncidenceLevel.MEDIUM,
              IncidenceLevel.LOW,
            ]

            return {
              name: topicName,
              difficultyLevel: Math.floor(Math.random() * 3) + 3, // Dificuldade 3 a 5 (Medicina ENEM)
              isWallOfStone: idx === 0 && Math.random() > 0.4, // Muro de Pedra em tópicos desafiadores
              incidence: incidenceMap[idx] || IncidenceLevel.MEDIUM,
              unlockProgress: Math.floor(Math.random() * 50) + 30, // 30-80%
              status:
                idx === 0
                  ? TopicStatus.IN_PROGRESS
                  : idx === 1
                  ? TopicStatus.MASTERED
                  : TopicStatus.TODO,
            }
          }),
        },
      },
      include: {
        topics: true,
      },
    })

    subjectRecords.push(subjectRecord)
  }

  console.log('📚 Matérias e Tópicos alinhados à Matriz do ENEM criados.')

  // Obter todos os tópicos criados
  const allTopics = await prisma.topic.findMany()

  // Criar Sessões de Estudo dos últimos 90 dias
  const now = new Date()
  const studySessions = []

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 3 a 6 sessões por dia
    const sessionCount = Math.floor(Math.random() * 4) + 3

    for (let j = 0; j < sessionCount; j++) {
      const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)]
      const duration = Math.floor(Math.random() * 60) + 45 // 45-105 minutos por sessão

      studySessions.push({
        userId: user.id,
        topicId: randomTopic.id,
        durationMinutes: duration,
        date: new Date(date.getTime() + j * 3600000 + 8 * 3600000),
      })
    }
  }

  await prisma.studySession.createMany({ data: studySessions })
  console.log('⏱️  Sessões de estudo realistas registradas (últimos 90 dias).')

  // Criar Simulados Modelo ENEM
  const createdSimulations = []
  for (let i = 0; i < realEnemSimulations.length; i++) {
    const simDef = realEnemSimulations[i]
    const daysAgo = 90 - i * 12
    const date = new Date(now)
    date.setDate(date.getDate() - Math.max(1, daysAgo))

    // Evolução nos acertos ao longo do tempo (Simulados Medicina ENEM)
    const progressFactor = (i + 1) / realEnemSimulations.length // 0.14 a 1.0

    let mathScore: number | null = null
    let natScore: number | null = null
    let humScore: number | null = null
    let linScore: number | null = null
    let timeInMinutes = 0
    let totalScore = 0

    if (simDef.isFirstDay) {
      // 1º Dia: Linguagens (max 45) + Humanas (max 45) = 90
      linScore = Math.min(45, Math.floor(30 + progressFactor * 10 + Math.random() * 3))
      humScore = Math.min(45, Math.floor(32 + progressFactor * 10 + Math.random() * 3))
      totalScore = linScore + humScore
      timeInMinutes = Math.floor(270 + Math.random() * 30) // ~5 horas
    } else if (simDef.isFull) {
      // Simulado Completo: 180 questões
      mathScore = Math.min(45, Math.floor(32 + progressFactor * 10 + Math.random() * 3))
      natScore = Math.min(45, Math.floor(28 + progressFactor * 12 + Math.random() * 3))
      humScore = Math.min(45, Math.floor(34 + progressFactor * 8 + Math.random() * 3))
      linScore = Math.min(45, Math.floor(32 + progressFactor * 8 + Math.random() * 3))
      totalScore = mathScore + natScore + humScore + linScore
      timeInMinutes = Math.floor(540 + Math.random() * 30) // ~9 horas divididas
    } else {
      // 2º Dia: Natureza (max 45) + Matemática (max 45) = 90
      mathScore = Math.min(45, Math.floor(30 + progressFactor * 11 + Math.random() * 4))
      natScore = Math.min(45, Math.floor(27 + progressFactor * 12 + Math.random() * 4))
      totalScore = mathScore + natScore
      timeInMinutes = Math.floor(280 + Math.random() * 20) // ~5 horas
    }

    const sim = await prisma.simulation.create({
      data: {
        userId: user.id,
        name: simDef.name,
        date,
        score: totalScore,
        timeInMinutes,
        mathScore,
        natScore,
        humScore,
        linScore,
      },
    })
    createdSimulations.push(sim)
  }

  console.log('📝 Simulados modelo ENEM com pontuações reais gravados.')

  // Criar Redações Padrão ENEM com notas de 20 em 20 pontos
  const essays = []
  for (let i = 0; i < realEnemEssayThemes.length; i++) {
    const theme = realEnemEssayThemes[i]
    const daysAgo = 90 - i * 6.5
    const date = new Date(now)
    date.setDate(date.getDate() - Math.max(1, Math.floor(daysAgo)))

    // Para aluno de Medicina, evolução gradual da nota de 760 -> 980/1000 em passos de 20 pontos
    // Garantir rigorosamente que C1, C2, C3, C4, C5 sejam números múltiplos de 20!
    const progressTrend = i / realEnemEssayThemes.length // 0 a 1.0

    // Definir mínimo por competência evoluindo no tempo:
    const minComp = progressTrend < 0.3 ? 140 : progressTrend < 0.7 ? 160 : 180

    const c1 = getRandomEnemCompetency(minComp, 200)
    const c2 = getRandomEnemCompetency(minComp, 200)
    const c3 = getRandomEnemCompetency(minComp, 200)
    const c4 = getRandomEnemCompetency(minComp, 200)
    const c5 = getRandomEnemCompetency(minComp, 200)

    // A SOMA DE MULTIPLOS DE 20 É NECESSARIAMENTE MÚLTIPLO DE 20 (ex: 880, 920, 940, 960, 980, 1000)
    const totalScore = c1 + c2 + c3 + c4 + c5
    const timeInMinutes = Math.floor(50 + Math.random() * 25) // 50 a 75 min por redação

    essays.push({
      userId: user.id,
      title: theme,
      date,
      totalScore,
      timeInMinutes,
      c1,
      c2,
      c3,
      c4,
      c5,
    })
  }

  await prisma.essay.createMany({ data: essays })
  console.log('✍️  Redações padrão ENEM (Notas estritamente de 20 em 20 pontos) criadas.')

  // Criar Registro de Erros (Error Sniper) alinhados ao ENEM
  const errorDescriptions: Record<ErrorType, string[]> = {
    [ErrorType.THEORY]: [
      'Não lembrei da fórmula da Potência Elétrica P = U²/R na questão de Eletrodinâmica do ENEM',
      'Confundi o conceito de Eutrofização e DBO na questão de Ecologia',
      'Falta de domínio na reação de Esterificação na prova de Química Orgânica',
      'Não recordava a Lei das Malhas de Kirchhoff no simulado',
    ],
    [ErrorType.INTERPRETATION]: [
      'Interpretei errado o gráfico de dispersão e mediana na questão de Estatística do ENEM',
      'Confundi a escala cartográfica (1:50.000) no enunciado de Geografia',
      'Não identifiquei a função da linguagem conativa/apelativa no texto publicitário',
      'Errei a interpretação da tirinha por não perceber a ironia na crítica social',
    ],
    [ErrorType.ATTENTION]: [
      'Erro de conversão de unidades (cm³ para Litros) em questão de Estequiometria',
      'Não prestei atenção no comando que pedia a alternativa INCORRETA',
      'Erro bobo de sinal negativo na resolução da função do 2º grau',
      'Marquei a alternativa B no gabarito mas tinha resolvido A no rascunho',
    ],
    [ErrorType.TIME]: [
      'Falta de tempo nas últimas 8 questões de Matemática no 2º Dia do ENEM',
      'Gastei mais de 10 minutos tentando resolver uma questão complexa de Logaritmos',
      'Tive que chutar as últimas 5 questões de Física por estourar o tempo de prova',
    ],
    [ErrorType.EMOTIONAL]: [
      'Ansiedade nos primeiros 30 minutos do 1º Dia atrapalhou a leitura em Humanas',
      'Insegurança na Proposta de Intervenção da Redação me fez refazer o rascunho 2 vezes',
      'Bloqueio mental ("branco") na questão de Geometria Espacial durante a prova',
    ],
  }

  const errors = []
  for (let i = 45; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const errorTypes = [
      ErrorType.THEORY,
      ErrorType.INTERPRETATION,
      ErrorType.ATTENTION,
      ErrorType.TIME,
      ErrorType.EMOTIONAL,
    ]

    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)]
    const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)]
    const descOptions = errorDescriptions[errorType]
    const description = descOptions[Math.floor(Math.random() * descOptions.length)]

    const sim = createdSimulations[Math.floor(Math.random() * createdSimulations.length)]

    errors.push({
      userId: user.id,
      topicId: randomTopic.id,
      simulationId: sim?.id,
      errorType,
      description,
      correction: 'Refazer a questão no papel, revisar o resumo teórico e resolver 10 exercícios similares no banco de questões.',
      date,
      nextReview: new Date(date.getTime() + (Math.floor(Math.random() * 7) + 1) * 86400000),
      reviewCount: Math.floor(Math.random() * 3),
      archived: Math.random() > 0.7,
    })
  }

  await prisma.questionError.createMany({ data: errors })
  console.log('❌ Banco de Erros (Error Sniper) ENEM registrado com sucesso.')

  // Criar Registro Diário (Ritual Beast Mode) dos últimos 90 dias
  const dailyLogs = []
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    // Meta volume ENEM Medicina: ~120 a 200 questões/dia
    const baseQuestions = 110 + Math.floor((90 - i) * 0.9)
    const questionsCount = baseQuestions + Math.floor(Math.random() * 40) - 15

    dailyLogs.push({
      userId: user.id,
      date,
      questionsCount: Math.max(70, questionsCount),
      sleepOk: Math.random() > 0.25,
      workoutOk: Math.random() > 0.35,
      cleanDiet: Math.random() > 0.2,
      noSocialMedia: Math.random() > 0.4,
    })
  }

  await prisma.dailyLog.createMany({ data: dailyLogs })
  console.log('📊 Registro Diário (Ritual Beast Mode) de alta performance gravado.')

  console.log('🎯 POVOAMENTO CONCLUÍDO! BANCO 100% COMPATÍVEL COM O MODELO ENEM.')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
