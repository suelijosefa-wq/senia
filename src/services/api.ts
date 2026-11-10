import { EvaluationResult, HistoryRecord, StudentProfile } from '../types';
import { INITIAL_HISTORY, INITIAL_STUDENT_PROFILE } from '../data/mockCurriculum';

const STORAGE_KEYS = {
  HISTORY: 'senia_student_history_v2',
  PROFILE: 'senia_student_profile_v2',
  ACCESSIBILITY: 'senia_accessibility_settings_v2',
};

export interface AccessibilitySettings {
  fontSizeLevel: number; // 0 = normal (15px), 1 = grande (17px), 2 = muito grande (19px)
  highContrast: boolean;
  autoSpeakAi: boolean;
  voiceCommandsActive: boolean; // Comandos e navegação por voz
  audioDescriptions: boolean; // Descrições sonoras de elementos visuais
  subtitlesEnabled: boolean; // Legendas em tempo real
  librasActive: boolean; // Exibição do guia e avatar de Libras
  textTrainingOnly: boolean; // Modo de treino 100% por texto (para surdos ou sem microfone)
  reducedMotion: boolean;
  speechRate: number; // 0.8 to 1.2
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSizeLevel: 0,
  highContrast: false,
  autoSpeakAi: false,
  voiceCommandsActive: false,
  audioDescriptions: false,
  subtitlesEnabled: true, // Habilitado por padrão para inclusão universal
  librasActive: false,
  textTrainingOnly: false,
  reducedMotion: false,
  speechRate: 1.0,
};

export const api = {
  // Chat with Mentora Helena Valença
  async sendChatMessage(message: string, history: { role: string; content: string }[], moduleContext = 'Geral') {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history, moduleContext }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro na comunicação com a Mentora');
    }
    return res.json();
  },

  // Deep evaluation of student response (high-thinking gemini-4-argon)
  async evaluateResponse(params: {
    exerciseTitle: string;
    exerciseType: string;
    promptScenario: string;
    expectedCompetencies: string[];
    studentResponse: string;
    audioMetrics?: { wpm?: number; durationSeconds?: number; fillerCount?: number };
  }): Promise<{
    evaluation: EvaluationResult;
    modelUsed: string;
    highThinkingApplied: boolean;
    evaluatedAt: string;
  }> {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao avaliar resposta com a IA');
    }
    return res.json();
  },

  // Generate dynamic executive scenario
  async generateScenario(category: string, difficulty: string) {
    const res = await fetch('/api/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, difficulty }),
    });
    if (!res.ok) {
      throw new Error('Falha ao gerar cenário');
    }
    return res.json();
  },

  // Local storage management for persistent student history
  getHistory(): HistoryRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY));
        return INITIAL_HISTORY;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_HISTORY;
    }
  },

  saveHistoryRecord(record: HistoryRecord): HistoryRecord[] {
    const current = this.getHistory();
    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

    // Update profile metrics
    this.updateProfileAfterExercise(record.evaluation.notaGeral);
    return updated;
  },

  getProfile(): StudentProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_STUDENT_PROFILE));
        return INITIAL_STUDENT_PROFILE;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  },

  updateProfileAfterExercise(newScore: number): StudentProfile {
    const prof = this.getProfile();
    const history = this.getHistory();
    const total = history.length;
    const sum = history.reduce((acc, h) => acc + h.evaluation.notaGeral, 0);
    const avg = total > 0 ? Number((sum / total).toFixed(1)) : newScore;

    // Badges check
    const updatedBadges = prof.badges.map((b) => {
      if (b.id === 'b1' && newScore >= 9.0) return { ...b, unlocked: true };
      if (b.id === 'b5' && total >= 5) return { ...b, unlocked: true };
      return b;
    });

    const updatedProfile: StudentProfile = {
      ...prof,
      totalExercisesCompleted: total,
      averageScore: avg,
      badges: updatedBadges,
    };

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    return updatedProfile;
  },

  getAccessibility(): AccessibilitySettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
      if (!raw) return DEFAULT_ACCESSIBILITY;
      return { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_ACCESSIBILITY;
    }
  },

  saveAccessibility(settings: AccessibilitySettings) {
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
  },
};

// Dispatch caption event for real-time visual subtitles (for Deaf & Hearing Impaired users)
function notifyCaption(text: string, isPlaying: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('senia_speech_caption', {
        detail: { text, isPlaying },
      })
    );
  }
}

// Web Speech API text-to-speech helper with subtitles dispatch
export function speakText(text: string, rate = 1.0, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    notifyCaption(text, false);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Prefer natural pt-BR voice if available
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(
    (v) =>
      v.lang.startsWith('pt') &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Luciana') ||
        v.name.includes('Francisca'))
  );
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  notifyCaption(text, true);

  utterance.onend = () => {
    notifyCaption('', false);
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    notifyCaption('', false);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifyCaption('', false);
  }
}

// Audio descriptions of the visual screens for blind or low-vision users
export function getScreenAudioDescription(tab: string): string {
  switch (tab) {
    case 'home':
      return 'Você está na Página Inicial da SENIA – Oratória Executiva Inclusiva. A tela exibe o título principal "A Voz que Articula, Inspira e Conduz a Alta Gestão", três botões de ação: Gravar e Analisar Voz, Explorar Módulos e Falar com a Mentora. Logo abaixo, quatro cartões apresentam os pilares: Dicção C-Level, Entrevistas, Reuniões e Liderança Inclusiva, além de um desafio em destaque pronto para treino.';
    case 'hub':
      return 'Você está na Central de Módulos de Formação Executiva. Há seis filtros de categorias: Todos, Dicção, Entrevistas, Reuniões, Comunicação e Liderança com Comunicação Não-Violenta. Há um botão para Gerar Desafio Inédito com IA e cartões com detalhes de tempo e competências de cada exercício.';
    case 'studio':
      return 'Você está no Estúdio de Voz e Treinamento. No centro, há o painel do exercício atual, um visualizador sonoro em ondas, botão para iniciar gravação ou alternar para modo de digitação por texto, campo com transcrição simultânea de sua fala, e à direita métricas de palavras por minuto e competências auditadas.';
    case 'dashboard':
      return 'Você está no Painel de Evolução do Aluno. A tela apresenta o perfil do estudante, média geral de notas de 0 a 10, número de exercícios concluídos, ofensiva de treino em dias, barras de progresso das cinco competências executivas, medalhas de mérito e o histórico detalhado de todas as auditorias realizadas.';
    case 'company':
      return 'Você está no Perfil da Empresa SENIA – Secretariado Executivo, Network e Inteligência Artificial. A tela exibe a logo oficial da SENIA em tamanho proporcional e elegante, a apresentação institucional, missão, visão de futuro, a diretriz Planejar, Organizar, Conquistar, os quatro pilares da marca e os compromissos de acessibilidade universal.';
    case 'chat':
      return 'Você está no canal da Mentora Executiva IA, Dra. Helena Valença. Há sugestões de perguntas rápidas, histórico da conversa com balões de diálogo e campo de texto com botão de envio para orientações de oratória, respiração e etiqueta corporativa.';
    default:
      return 'Plataforma SENIA – Oratória Executiva Inclusiva.';
  }
}
