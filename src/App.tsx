import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TrainingHub } from './components/TrainingHub';
import { VoiceTrainingStudio } from './components/VoiceTrainingStudio';
import { StudentDashboard } from './components/StudentDashboard';
import { MentorChatDrawer } from './components/MentorChatDrawer';
import { EvaluationModal } from './components/EvaluationModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { LibrasModal } from './components/LibrasModal';
import { LiveCaptionsBar } from './components/LiveCaptionsBar';
import { VoiceCommandController } from './components/VoiceCommandController';
import { ExerciseItem, EvaluationResult, HistoryRecord, StudentProfile } from './types';
import { EXERCISES } from './data/mockCurriculum';
import {
  api,
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY,
  speakText,
  getScreenAudioDescription,
} from './services/api';
import { Sparkles, Shield, Heart, GraduationCap, Accessibility } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'hub' | 'studio' | 'dashboard' | 'chat'>('home');
  const [currentExercise, setCurrentExercise] = useState<ExerciseItem>(EXERCISES[0]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(api.getProfile());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Accessibility Modals state
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [librasModalOpen, setLibrasModalOpen] = useState(false);

  // Active evaluation modal state
  const [activeEvaluation, setActiveEvaluation] = useState<{
    evaluation: EvaluationResult;
    modelUsed: string;
    highThinkingApplied: boolean;
    studentResponse: string;
    wpm?: number;
    durationSeconds?: number;
  } | null>(null);

  // Load persistent history and accessibility settings
  useEffect(() => {
    const loadedHistory = api.getHistory();
    setHistory(loadedHistory);
    const loadedProfile = api.getProfile();
    setProfile(loadedProfile);
    const loadedAccessibility = api.getAccessibility();
    setAccessibility(loadedAccessibility);
  }, []);

  // Global Keyboard Shortcuts (Alt+1 to Alt+5, Alt+A, Alt+L, Alt+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setCurrentTab('home');
          speakText('Navegando para Página Inicial.');
        } else if (e.key === '2') {
          e.preventDefault();
          setCurrentTab('hub');
          speakText('Navegando para Módulos de Formação.');
        } else if (e.key === '3') {
          e.preventDefault();
          setCurrentTab('studio');
          speakText('Navegando para Estúdio de Treinamento.');
        } else if (e.key === '4') {
          e.preventDefault();
          setCurrentTab('dashboard');
          speakText('Navegando para Evolução do Aluno.');
        } else if (e.key === '5') {
          e.preventDefault();
          setCurrentTab('chat');
          speakText('Abrindo Mentora Virtual Helena.');
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setAccessibilityModalOpen((prev) => !prev);
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setLibrasModalOpen((prev) => !prev);
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          handleDescribeScreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTab]);

  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...accessibility, ...newSettings };
    setAccessibility(updated);
    api.saveAccessibility(updated);
  };

  const handleDescribeScreen = () => {
    const description = getScreenAudioDescription(currentTab);
    speakText(description);
  };

  const handleEvaluationComplete = (result: {
    evaluation: EvaluationResult;
    modelUsed: string;
    highThinkingApplied: boolean;
    studentResponse: string;
    wpm: number;
    durationSeconds: number;
  }) => {
    const newRecord: HistoryRecord = {
      id: `record-${Date.now()}`,
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      category: currentExercise.category,
      date: new Date().toISOString(),
      studentResponse: result.studentResponse,
      evaluation: result.evaluation,
      modelUsed: result.modelUsed,
      highThinkingApplied: result.highThinkingApplied,
      audioWpm: result.wpm,
      durationSeconds: result.durationSeconds,
    };

    const updatedHistory = api.saveHistoryRecord(newRecord);
    setHistory(updatedHistory);
    setProfile(api.getProfile());

    setActiveEvaluation({
      evaluation: result.evaluation,
      modelUsed: result.modelUsed,
      highThinkingApplied: result.highThinkingApplied,
      studentResponse: result.studentResponse,
      wpm: result.wpm,
      durationSeconds: result.durationSeconds,
    });

    if (accessibility.autoSpeakAi) {
      speakText(
        `Auditoria concluída com sucesso. Sua nota geral é ${result.evaluation.notaGeral.toFixed(
          1
        )} de 10. Você pode conferir os detalhes no painel avaliativo.`
      );
    }
  };

  const handleOpenEvaluationDetails = (record: HistoryRecord) => {
    setActiveEvaluation({
      evaluation: record.evaluation,
      modelUsed: record.modelUsed || 'gemini-4-argon',
      highThinkingApplied: record.highThinkingApplied ?? true,
      studentResponse: record.studentResponse,
      wpm: record.audioWpm,
      durationSeconds: record.durationSeconds,
    });
  };

  const handleNextExercise = () => {
    const currentIndex = EXERCISES.findIndex((e) => e.id === currentExercise.id);
    const nextIndex = (currentIndex + 1) % EXERCISES.length;
    setCurrentExercise(EXERCISES[nextIndex]);
    setActiveEvaluation(null);
    setCurrentTab('studio');
  };

  // Font size scale class
  const getFontSizeClass = () => {
    if (accessibility.fontSizeLevel === 1) return 'text-[17px]';
    if (accessibility.fontSizeLevel === 2) return 'text-[19px]';
    return 'text-[15px]';
  };

  return (
    <div
      className={`min-h-screen bg-[#050e1d] text-slate-100 flex flex-col font-body transition-all ${
        accessibility.highContrast ? 'contrast-125 brightness-110' : ''
      } ${accessibility.reducedMotion ? 'motion-reduce' : ''} ${getFontSizeClass()}`}
    >
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (accessibility.audioDescriptions) {
            speakText(getScreenAudioDescription(tab));
          }
        }}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        profile={profile}
        onOpenAccessibilityModal={() => setAccessibilityModalOpen(true)}
        onOpenLibrasModal={() => setLibrasModalOpen(true)}
        onDescribeScreen={handleDescribeScreen}
      />

      {/* Main App Content */}
      <main id="main-content" role="main" className="flex-1 pb-16 outline-none" tabIndex={-1}>
        {currentTab === 'home' && (
          <>
            <HeroBanner
              onStartTraining={() => setCurrentTab('hub')}
              onOpenVoiceStudio={() => setCurrentTab('studio')}
              onOpenChat={() => setCurrentTab('chat')}
              onViewDashboard={() => setCurrentTab('dashboard')}
              speechEnabled={accessibility.autoSpeakAi}
            />

            {/* Quick Practice teaser from Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#071933] border border-[#facc15]/25 blue-card-glow flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#facc15] mb-1">
                    <Sparkles className="w-4 h-4 text-[#facc15]" />
                    <span>Desafio em Destaque do Dia</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                    {currentExercise.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-serif-luxury mt-1">
                    {currentExercise.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setCurrentTab('studio')}
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm hover:brightness-110 shadow-lg cursor-pointer focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                    aria-label={`Iniciar Treino por Voz Agora do exercício ${currentExercise.title}`}
                  >
                    Iniciar Treino Agora
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentTab === 'hub' && (
          <TrainingHub
            onSelectExercise={(ex) => {
              setCurrentExercise(ex);
              setCurrentTab('studio');
            }}
            onOpenVoiceStudio={() => setCurrentTab('studio')}
          />
        )}

        {currentTab === 'studio' && (
          <VoiceTrainingStudio
            exercise={currentExercise}
            textTrainingOnlyDefault={accessibility.textTrainingOnly}
            onEvaluationComplete={handleEvaluationComplete}
            onSwitchExercise={() => setCurrentTab('hub')}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard
            profile={profile}
            history={history}
            onOpenEvaluationDetails={handleOpenEvaluationDetails}
            onStartNewTraining={() => setCurrentTab('hub')}
          />
        )}

        {currentTab === 'chat' && (
          <MentorChatDrawer
            autoSpeak={accessibility.autoSpeakAi}
            onStartExercise={(id) => {
              const found = EXERCISES.find((e) => e.id === id);
              if (found) setCurrentExercise(found);
              setCurrentTab('studio');
            }}
          />
        )}
      </main>

      {/* Synchronized Real-time Subtitles Bar */}
      <LiveCaptionsBar enabled={accessibility.subtitlesEnabled} />

      {/* Voice Command & Hands-Free Controller */}
      <VoiceCommandController
        active={accessibility.voiceCommandsActive}
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenAccessibilityModal={() => setAccessibilityModalOpen(true)}
        onOpenLibrasModal={() => setLibrasModalOpen(true)}
      />

      {/* Floating Quick Libras Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setLibrasModalOpen(true)}
          className="p-3.5 rounded-full gold-gradient-bg text-[#050e1d] font-bold shadow-2xl hover:scale-105 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none border-2 border-[#050e1d]"
          title="Abrir Central em Libras (Alt+L)"
          aria-label="Abrir Central de Libras"
        >
          <span className="text-xl">🤟</span>
        </button>
      </div>

      {/* Accessibility Settings Modal */}
      {accessibilityModalOpen && (
        <AccessibilityModal
          settings={accessibility}
          onUpdate={handleUpdateAccessibility}
          onClose={() => setAccessibilityModalOpen(false)}
        />
      )}

      {/* Libras Guide Modal */}
      {librasModalOpen && (
        <LibrasModal onClose={() => setLibrasModalOpen(false)} />
      )}

      {/* Active Evaluation Modal if present */}
      {activeEvaluation && (
        <EvaluationModal
          evaluation={activeEvaluation.evaluation}
          modelUsed={activeEvaluation.modelUsed}
          highThinkingApplied={activeEvaluation.highThinkingApplied}
          studentResponse={activeEvaluation.studentResponse}
          wpm={activeEvaluation.wpm}
          durationSeconds={activeEvaluation.durationSeconds}
          onClose={() => setActiveEvaluation(null)}
          onRetry={() => {
            setActiveEvaluation(null);
            setCurrentTab('studio');
          }}
          onNextExercise={handleNextExercise}
        />
      )}

      {/* Elegant Executive Footer */}
      <footer role="contentinfo" className="bg-[#030914] border-t border-[#facc15]/20 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center font-cinzel font-bold text-[#050e1d]">
              S
            </div>
            <div>
              <p className="font-cinzel font-bold text-white tracking-wider">
                SENIA – Oratória Executiva Inclusiva
              </p>
              <p className="text-[11px] text-slate-400 font-serif-luxury italic">
                Formação Pedagógica com IA para Secretariado Executivo
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Conformidade com o Código de Ética do Secretário Executivo</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Acessibilidade Universal & Comunicação Não-Violenta</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Recurso Educacional Inclusivo (MEC / NBR 9050 / WCAG 2.1)</span>
            </span>
          </div>

          <p className="text-[10px] text-slate-300">
            © 2026 SENIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
