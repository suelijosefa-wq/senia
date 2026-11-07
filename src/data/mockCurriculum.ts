import { ExerciseItem, HistoryRecord, StudentProfile } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Mariana Duarte',
  registration: 'SE-2026.1-0842',
  course: 'Bacharelado em Secretariado Executivo',
  institution: 'Universidade Federal / Centro de Ciências Sociais Aplicadas',
  levelTitle: 'Assessora Executiva Plena',
  totalExercisesCompleted: 14,
  averageScore: 8.7,
  streakDays: 5,
  badges: [
    {
      id: 'b1',
      title: 'Eloquência de C-Level',
      description: 'Alcançou nota superior a 9.0 em simulação de Conselho de Administração.',
      unlocked: true,
      icon: 'Award',
    },
    {
      id: 'b2',
      title: 'Diplomacia Sob Pressão',
      description: 'Concluiu com sucesso a mediação de conflitos em pauta urgente.',
      unlocked: true,
      icon: 'ShieldCheck',
    },
    {
      id: 'b3',
      title: 'Voz Inclusiva',
      description: 'Demonstrou excelência no uso de linguagem acessível e não-violenta.',
      unlocked: true,
      icon: 'HeartHandshake',
    },
    {
      id: 'b4',
      title: 'Dicção Impecável',
      description: 'Completou 5 exercícios fonéticos com ritmo ideal (130-150 PPM).',
      unlocked: true,
      icon: 'Mic',
    },
    {
      id: 'b5',
      title: 'Mestre da Ata Executiva',
      description: 'Sintetizou reunião complexa de 45 minutos em discurso executivo de 2 minutos.',
      unlocked: false,
      icon: 'FileText',
    },
  ],
};

export const EXERCISES: ExerciseItem[] = [
  // 1. DICÇÃO E PRONÚNCIA
  {
    id: 'dic-1',
    category: 'diccao',
    title: 'Articulação de Termos Técnicos e Corporativos',
    subtitle: 'Precisão fonética e projeção sem esforço vocal',
    level: 'Iniciante',
    scenario:
      'Como Secretário(a) Executivo(a), você deve anunciar a pauta anual para o Comitê de Governança Corporativa e ESG sem tropeçar em vocábulos complexos.',
    roleContext: 'Abertura de Sessão Ordinária de Diretoria.',
    instructions: [
      'Leia com clareza o texto proposto, articulando com amplitude labial e dental.',
      'Pronuncie com precisão termos como "jurisprudência", "desregulamentação", "sustentabilidade" e "plurilateral".',
      'Mantenha ritmo constante entre 130 e 150 palavras por minuto, evitando respiração ofegante.',
    ],
    expectedCompetencies: [
      'Clareza fonética nos encontros consonantais (pr, tr, cl)',
      'Controle do fluxo de ar e pausas pontuais',
      'Tom confiante e assertivo sem oscilações abruptas',
    ],
    sampleAudioPrompt:
      'Prezados conselheiros, a pauta da nossa assembleia extraordinária compreende a reestruturação plurilateral dos comitês de compliance, com foco em jurisprudência socioambiental e governança fiduciária sustentável.',
    recommendedDurationSeconds: 45,
  },
  {
    id: 'dic-2',
    category: 'diccao',
    title: 'Trava-Língua Corporativo e Ressonância',
    subtitle: 'Eliminação de vícios e agilidade articulatória',
    level: 'Intermediário',
    scenario:
      'Treino intensivo para evitar dicção truncada em momentos de nervosismo antes de uma chamada com investidores internacionais.',
    roleContext: 'Aquecimento vocal antes de videoconferência crítica.',
    instructions: [
      'Pronuncie o exercício 3 vezes: primeiro em ritmo moderado, depois em ritmo executivo seguro.',
      'Concentre-se na projeção no terço médio facial, sem tensionar os ombros ou pescoço.',
    ],
    expectedCompetencies: [
      'Agilidade muscular fonoarticulatória',
      'Modularidade e ressonância vocal limpa',
      'Zero deglutição de finais de palavras (-s, -r, -ram/-rão)',
    ],
    sampleAudioPrompt:
      'O assessor executivo esclareceu a proposta orçamentária ao comitê consultivo, que prontamente aprovou o projeto após cuidadosa ponderação protocolar.',
    recommendedDurationSeconds: 30,
  },

  // 2. ENTREVISTAS DE EMPREGO
  {
    id: 'ent-1',
    category: 'entrevistas',
    title: 'Apresentação Profissional (Pitch de Elevador Executivo)',
    subtitle: 'Comunicação de alto impacto e posicionamento de carreira',
    level: 'Intermediário',
    scenario:
      'Você está na etapa final de seleção para Secretário(a) Executivo(a) da Presidência de uma holding multinacional. A Diretora de Gente e Gestão pede: "Mariana, conte-me sobre você, sua trajetória e por que o secretariado executivo é estratégico para a nossa presidência."',
    roleContext: 'Entrevista presencial com a Vice-Presidência de Recursos Humanos.',
    instructions: [
      'Estruture sua resposta em 3 blocos: Quem você é e sua formação; Casos de sucesso em organização e discrição; Seu diferencial em liderança inclusiva.',
      'Evite clichês vazios ("sou perfeccionista", "gosto de ajudar pessoas") e foque em valor estratégico de negócios.',
      'Transmita postura serena, elegante e olhar firme.',
    ],
    expectedCompetencies: [
      'Estrutura narrativa STAR (Situação, Tarefa, Ação, Resultado)',
      'Valorização da profissão de Secretariado como parceiro estratégico',
      'Tom refinado, seguro e cativante',
    ],
    sampleAudioPrompt:
      'Sou graduanda em Secretariado Executivo com foco em assessoria bilíngue e governança. Nos últimos anos, atuei na otimização de fluxos decisórios da diretoria, reduzindo o tempo de resposta a demandas estratégicas em 30%. Compreendo que o secretariado moderno não é apenas operacional, mas o elo diplomático e estratégico que assegura a integridade das decisões da alta gestão.',
    recommendedDurationSeconds: 90,
  },
  {
    id: 'ent-2',
    category: 'entrevistas',
    title: 'Resposta a Situação Ética e Confidencialidade',
    subtitle: 'Firmeza diplomática sob sondagem indevida',
    level: 'Avançado',
    scenario:
      'O entrevistador pergunta: "Se um membro influente do conselho ou um diretor de outra área pedir acesso a uma ata sigilosa antes da aprovação do presidente, como você responderia pessoalmente a ele no corredor?"',
    roleContext: 'Teste situacional de sigilo profissional e inteligência emocional.',
    instructions: [
      'Demonstre absoluta lealdade ética e obediência ao código de ética do Secretário Executivo.',
      'Não seja agressivo(a), mas mantenha firmeza inabalável.',
      'Ofereça um encaminhamento institucional correto e respeitoso.',
    ],
    expectedCompetencies: [
      'Sigilo e integridade fiduciária',
      'Assertividade polida e cortês',
      'Gerenciamento de limites hierárquicos',
    ],
    sampleAudioPrompt:
      'Agradeço o contato, Diretor. Por protocolo de governança estabelecido pela Presidência, o documento encontra-se sob fase restrita de revisão colegiada. Tão logo a versão definitiva seja homologada, terei imensa satisfação em disponibilizá-la formalmente pelo canal oficial de distribuição a todos os membros.',
    recommendedDurationSeconds: 60,
  },

  // 3. REUNIÕES E SITUAÇÕES EMPRESARIAIS
  {
    id: 'reu-1',
    category: 'reunioes',
    title: 'Mediação de Interrupções e Respeito à Fala em Reunião',
    subtitle: 'Manutenção da ordem e igualdade de voz no conselho',
    level: 'Avançado',
    scenario:
      'Durante a reunião de diretoria, dois diretores começam a falar simultaneamente em tom acalorado, interrompendo uma colega que apresentava os dados financeiros. Como condutor(a) e assessor(a) da mesa, você precisa intervir com elegância para restaurar a ordem e garantir que a apresentação continue.',
    roleContext: 'Reunião de Diretoria Executiva presencial e online híbrida.',
    instructions: [
      'Peça a palavra com firmeza serena e postura ereta.',
      'Acolha o entusiasmo de ambos, mas reoriente o foco para a pauta e restabeleça o tempo de fala da apresentadora.',
      'Abra um espaço controlado para réplicas logo após a conclusão dos dados.',
    ],
    expectedCompetencies: [
      'Liderança mediadora e equilíbrio emocional',
      'Linguagem diplomática desarmante',
      'Garantia de equidade na participação de todos os presentes',
    ],
    sampleAudioPrompt:
      'Com licença, diretores. Compreendemos a relevância e o dinamismo deste debate para todos nós. Para garantirmos a clareza das deliberações e o registro fiel em ata, peço a gentileza de ouvirmos a conclusão da Diretora Flávia. Em seguida, destinaremos dez minutos exclusivos para os apontamentos dos senhores.',
    recommendedDurationSeconds: 60,
  },
  {
    id: 'reu-2',
    category: 'reunioes',
    title: 'Comunicação de Crise: Cancelamento de Agenda Crítica',
    subtitle: 'Gestão de expectativas C-Level com resolução proativa',
    level: 'Master Executivo',
    scenario:
      'O voo do CEO foi cancelado por tempestade e ele não chegará a tempo para a abertura de um evento solene com embaixadores e acionistas. Você precisa subir ao palco ou dirigir-se ao auditório para comunicar o imprevisto, transmitir tranquilidade e anunciar o plano de contingência.',
    roleContext: 'Auditório Corporativo com 150 convidados de alta patente.',
    instructions: [
      'Inicie com saudação calorosa e transparente.',
      'Não demonstre pânico; mostre que a situação já está sob controle pela assessoria.',
      'Apresente a solução imediata (participação remota do CEO por link dedicado e transmissão de boas-vindas pelo vice-presidente).',
    ],
    expectedCompetencies: [
      'Presença de palco e autoridade acolhedora',
      'Gerenciamento de crise sem gerar alarme',
      'Clareza nas diretrizes imediatas',
    ],
    sampleAudioPrompt:
      'Senhoras e senhores, boa tarde e sejam calorosamente bem-vindos à nossa conferência. Devido a restrições meteorológicas inesperadas na malha aérea de Brasília, nosso Diretor-Presidente estará conosco de forma remota e ao vivo em instantes. Neste momento, convido o Vice-Presidente de Operações para dar início ao cerimonial e apresentar as diretrizes do nosso encontro.',
    recommendedDurationSeconds: 75,
  },

  // 4. COMUNICAÇÃO PROFISSIONAL & REDAÇÃO PROTOCOLAR
  {
    id: 'com-1',
    category: 'comunicacao',
    title: 'Discurso de Abertura Cerimonial e Pronomes de Tratamento',
    subtitle: 'Elegância e correção no protocolo oficial',
    level: 'Intermediário',
    scenario:
      'Você é responsável pelo mestre de cerimônias da posse da nova reitoria ou conselho deliberativo. É imperativo pronunciar corretamente os pronomes de tratamento de cada autoridade presente (Magnífico, Excelentíssimo, Vossa Senhoria).',
    roleContext: 'Sessão Solene de Outorga de Títulos.',
    instructions: [
      'Cite as autoridades na ordem correta de precedência protocolar.',
      'Use tom solene, cadenciado e respeitoso.',
      'Pronuncie com distinção e sem pressa cada homenagem.',
    ],
    expectedCompetencies: [
      'Domínio das normas protocolares oficiais (Decreto Federal de Cerimonial)',
      'Postura solene e dicção impecável',
      'Ritmo cerimonial sóbrio e envolvente',
    ],
    sampleAudioPrompt:
      'Composta a mesa de honra, saudamos o Magnífico Reitor, a Excelentíssima Senhora Secretária de Educação e os ilustres membros do corpo docente e discente. Damos por iniciada a solene sessão acadêmica em homenagem à excelência da gestão pública e do secretariado executivo.',
    recommendedDurationSeconds: 60,
  },
  {
    id: 'com-2',
    category: 'comunicacao',
    title: 'Síntese Executiva em 90 Segundos (Elevator Update)',
    subtitle: 'Capacidade de resumir relatórios densos para tomada de decisão',
    level: 'Avançado',
    scenario:
      'O Diretor Executivo tem apenas 2 minutos entre reuniões e solicita: "Qual o resumo do parecer do comitê de sustentabilidade e qual decisão preciso assinar hoje?"',
    roleContext: 'Alinhamento rápido na antessala presidencial.',
    instructions: [
      'Vá direto ao ponto essencial (Bottom Line Up Front - BLUF).',
      'Forneça: Contexto em 1 frase; Recomendação técnica do comitê; Ação solicitada (assinatura do termo X até as 17h).',
      'Esteja pronto para responder a uma dúvida rápida com precisão.',
    ],
    expectedCompetencies: [
      'Poder de síntese e concisão executiva',
      'Comunicação orientada a ação',
      'Economia de palavras sem perda de substância',
    ],
    sampleAudioPrompt:
      'Diretor, em suma: o comitê aprovou a transição da frota para modelos híbridos com economia de 18% no biênio. A única pendência que requer sua anuência é a assinatura do aditivo com a concessionária até as 17h para congelarmos a tabela tributária favorável. A minuta já está validada pelo jurídico na sua pasta prioritária.',
    recommendedDurationSeconds: 45,
  },

  // 5. LIDERANÇA, EMPATIA E INTELIGÊNCIA EMOCIONAL
  {
    id: 'lid-1',
    category: 'lideranca_empatia',
    title: 'Acolhimento Inclusivo e Comunicação Não-Violenta',
    subtitle: 'Sensibilidade à diversidade e liderança pelo exemplo',
    level: 'Intermediário',
    scenario:
      'Um colaborador recém-contratado, pessoa com deficiência auditiva que utiliza leitura labial e apoio de intérprete de Libras, sentiu-se isolado durante a primeira reunião de alinhamento com a diretoria. Você o convida para uma conversa individual para redefinir as dinâmicas de comunicação da equipe.',
    roleContext: 'Conversa acolhedora na sala de assessoria executiva.',
    instructions: [
      'Pratique a escuta ativa empática e validação emocional.',
      'Proponha adaptações imediatas para todas as reuniões seguintes (câmeras sempre ativas, transcrição automática, ritmo de fala pausado e prioridade ao intérprete).',
      'Garanta que a responsabilidade pela inclusão é coletiva e institucional, não um "favor".',
    ],
    expectedCompetencies: [
      'Comunicação empática e acolhedora (CNV - Comunicação Não-Violenta)',
      'Compromisso genuíno com a acessibilidade universal',
      'Liderança institucional pelo acolhimento',
    ],
    sampleAudioPrompt:
      'Olá, Gabriel. Quero agradecer por compartilhar sua percepção comigo. Sua presença aqui é fundamental para o sucesso de toda a diretoria. Compreendo perfeitamente como a velocidade e as sobreposições de vozes na reunião de hoje dificultaram o acompanhamento. A partir de amanhã, estabeleceremos diretrizes formais de fala pausada, apoio de Libras e transcrição simultânea. Conte comigo como sua parceira de jornada.',
    recommendedDurationSeconds: 75,
  },
  {
    id: 'lid-2',
    category: 'lideranca_empatia',
    title: 'Desescalada de Conflito Hierárquico com Foco em Soluções',
    subtitle: 'Inteligência emocional e equilíbrio sob ataque verbal injusto',
    level: 'Master Executivo',
    scenario:
      'Um diretor regional entra na sua sala exaltado porque uma sala de videoconferência foi remanejada para receber a auditoria externa. Ele acusa a assessoria de "falta de consideração". Como responder sem ser submisso(a) e sem escalar o conflito?',
    roleContext: 'Gestão de incidente na recepção executiva.',
    instructions: [
      'Mantenha tom de voz calmo, velocidade desacelerada e respiração equilibrada (efeito espelho desescalador).',
      'Valide o impacto na rotina dele sem assumir culpas indevidas.',
      'Apresente imediatamente a alternativa equivalente já preparada com suporte técnico dedicado.',
    ],
    expectedCompetencies: [
      'Autorregulação emocional diante da hostilidade',
      'Assertividade tranquila e respeito mútuo',
      'Resolução imediata e diplomática de impasses',
    ],
    sampleAudioPrompt:
      'Compreendo seu aborrecimento, Dr. Maurício, e sei o quanto sua videoconferência com o conselho regional é importante. O remanejamento ocorreu em caráter excepcional por determinação estatutária da auditoria externa. Pensando nisso, já preparamos a Sala Alpha, com equipamento de ponta testado e suporte de TI exclusivo à sua disposição. Podemos nos dirigir até lá juntos para que inicie sua chamada com total conforto?',
    recommendedDurationSeconds: 60,
  },
];

export const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'hist-1',
    exerciseId: 'dic-1',
    exerciseTitle: 'Articulação de Termos Técnicos e Corporativos',
    category: 'diccao',
    date: '2026-11-05T14:30:00Z',
    studentResponse:
      'Prezados conselheiros, a pauta da nossa assembleia extraordinária compreende a reestruturação plurilateral dos comitês de compliance, com foco em jurisprudência socioambiental e governança fiduciária sustentável.',
    audioWpm: 142,
    durationSeconds: 42,
    modelUsed: 'gemini-4-argon',
    highThinkingApplied: true,
    evaluation: {
      notaGeral: 9.2,
      criterios: {
        diccao_clareza: {
          nota: 9.5,
          comentario: 'Excelente articulação dental e labial. Pronúncia perfeita de "plurilateral" e "fiduciária".',
        },
        tom_postura_executiva: {
          nota: 9.0,
          comentario: 'Postura sóbria e digna de abertura solene de conselho.',
        },
        estrutura_concisao: {
          nota: 9.2,
          comentario: 'Fluxo contínuo com respeito às pausas respiratórias naturais.',
        },
        empatia_inclusao: {
          nota: 9.0,
          comentario: 'Tom acolhedor que convida os ouvintes à atenção sem distanciamento frio.',
        },
        assertividade_diplomatica: {
          nota: 9.3,
          comentario: 'Firmeza e elegância características de assessoria presidencial.',
        },
      },
      destaquesPositivos: [
        'Cadência vocal exemplar em 142 PPM, ideal para assembleias',
        'Respiração diafragmática perceptível e estável',
        'Ausência completa de hesitações ou cacoetes de fala',
      ],
      pontosMelhoria: [
        'Pode aplicar uma pausa de 1 segundo a mais antes de "governança fiduciária" para dar peso dramático executivo',
      ],
      versaoModeloCLevel:
        'Prezados senhores e senhoras conselheiros: submeto à criteriosa apreciação do colegiado a pauta da presente Assembleia Extraordinária, voltada à modernização plurilateral dos nossos comitês de governança e integridade fiduciária.',
      diagnosticoVoz:
        'Voz límpida, ressonância mista bem equilibrada. Timbre transmite serenidade e autoridade institucional.',
      proximoDesafio: 'Avançar para simulações com termos em língua estrangeira e gerenciamento de crises de pauta.',
    },
  },
  {
    id: 'hist-2',
    exerciseId: 'ent-1',
    exerciseTitle: 'Apresentação Profissional (Pitch de Elevador Executivo)',
    category: 'entrevistas',
    date: '2026-11-06T10:15:00Z',
    studentResponse:
      'Sou graduanda em Secretariado Executivo e tenho experiência na organização de agendas complexas de diretoria. Meu objetivo é atuar como braço direito estratégico, garantindo discrição, foco em resultados e comunicação clara entre departamentos.',
    audioWpm: 135,
    durationSeconds: 58,
    modelUsed: 'gemini-4-argon',
    highThinkingApplied: true,
    evaluation: {
      notaGeral: 8.4,
      criterios: {
        diccao_clareza: {
          nota: 8.8,
          comentario: 'Pronúncia limpa e tom de voz bem projetado.',
        },
        tom_postura_executiva: {
          nota: 8.5,
          comentario: 'Boa segurança e sobriedade.',
        },
        estrutura_concisao: {
          nota: 8.0,
          comentario: 'Poderia quantificar melhor resultados anteriores (ex: percentual de otimização de tempo).',
        },
        empatia_inclusao: {
          nota: 8.5,
          comentario: 'Tom empático e colaborativo ao mencionar a integração interdepartamental.',
        },
        assertividade_diplomatica: {
          nota: 8.2,
          comentario: 'Posicionamento claro como articuladora de confiança.',
        },
      },
      destaquesPositivos: [
        'Uso do termo "braço direito estratégico", muito valorizado no mercado',
        'Clareza nos três pilares centrais da atuação secretarial',
      ],
      pontosMelhoria: [
        'Incluir métrica ou projeto prático que liderou durante a formação acadêmica',
        'Aprofundar o compromisso com práticas inclusivas e diversidade',
      ],
      versaoModeloCLevel:
        'Com formação sólida em Secretariado Executivo e atuação orientada à governança, assessoro lideranças C-Level com foco em blindagem de tempo decisório e diplomacia institucional. Desenvolvi protocolos de gestão documental que reduziram em 25% o ciclo de deliberações em meu último projeto.',
      diagnosticoVoz:
        'Ritmo controlado (135 PPM). Recomendamos modular a entonação no final das frases para não parecer decoreba.',
      proximoDesafio: 'Exercício de resposta ética sobre confidencialidade fiduciária.',
    },
  },
];
