export type ModuleCategory =
  | 'diccao'
  | 'entrevistas'
  | 'reunioes'
  | 'comunicacao'
  | 'lideranca_empatia';

export interface ExerciseItem {
  id: string;
  category: ModuleCategory;
  title: string;
  subtitle: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Master Executivo';
  scenario: string;
  roleContext: string;
  instructions: string[];
  expectedCompetencies: string[];
  sampleAudioPrompt?: string;
  recommendedDurationSeconds: number;
}

export interface CriterionScore {
  nota: number;
  comentario: string;
}

export interface EvaluationResult {
  notaGeral: number;
  criterios: {
    diccao_clareza: CriterionScore;
    tom_postura_executiva: CriterionScore;
    estrutura_concisao: CriterionScore;
    empatia_inclusao: CriterionScore;
    assertividade_diplomatica: CriterionScore;
  };
  destaquesPositivos: string[];
  pontosMelhoria: string[];
  versaoModeloCLevel: string;
  diagnosticoVoz: string;
  proximoDesafio: string;
}

export interface HistoryRecord {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  category: ModuleCategory;
  date: string;
  studentResponse: string;
  evaluation: EvaluationResult;
  modelUsed?: string;
  highThinkingApplied?: boolean;
  audioWpm?: number;
  durationSeconds?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface StudentProfile {
  name: string;
  registration: string;
  course: string;
  institution: string;
  levelTitle: string;
  totalExercisesCompleted: number;
  averageScore: number;
  streakDays: number;
  badges: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }[];
}
