import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  BrainCircuit,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Mic,
  Shield,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { EvaluationResult } from '../types';
import { speakText, stopSpeaking } from '../services/api';

interface EvaluationModalProps {
  evaluation: EvaluationResult;
  modelUsed?: string;
  highThinkingApplied?: boolean;
  studentResponse: string;
  wpm?: number;
  durationSeconds?: number;
  onClose: () => void;
  onRetry: () => void;
  onNextExercise: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  evaluation,
  modelUsed = 'gemini-4-argon',
  highThinkingApplied = true,
  studentResponse,
  wpm,
  durationSeconds,
  onClose,
  onRetry,
  onNextExercise,
}) => {
  const [isPlayingModelSpeech, setIsPlayingModelSpeech] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'rubrica' | 'modelo'>('geral');

  useEffect(() => {
    // Launch gold and blue confetti if student scored >= 9.0
    if (evaluation.notaGeral >= 9.0) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#fef08a', '#2563eb', '#1e40af', '#ffffff'],
      });
    }

    return () => {
      stopSpeaking();
    };
  }, [evaluation.notaGeral]);

  const handleToggleModelSpeech = () => {
    if (isPlayingModelSpeech) {
      stopSpeaking();
      setIsPlayingModelSpeech(false);
    } else {
      setIsPlayingModelSpeech(true);
      speakText(evaluation.versaoModeloCLevel, 1.0, () => setIsPlayingModelSpeech(false));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-[#facc15] border-[#facc15] bg-[#0d274f]';
    if (score >= 7.5) return 'text-blue-300 border-blue-400 bg-[#0a1e3d]';
    if (score >= 6.0) return 'text-amber-400 border-amber-500 bg-[#2b2105]';
    return 'text-rose-400 border-rose-500 bg-[#2e0909]';
  };

  const criteriaList = [
    {
      key: 'diccao_clareza',
      label: 'Dicção & Articulação Fonética',
      icon: Mic,
      score: evaluation.criterios.diccao_clareza.nota,
      comment: evaluation.criterios.diccao_clareza.comentario,
    },
    {
      key: 'tom_postura_executiva',
      label: 'Tom & Postura C-Level',
      icon: Shield,
      score: evaluation.criterios.tom_postura_executiva.nota,
      comment: evaluation.criterios.tom_postura_executiva.comentario,
    },
    {
      key: 'estrutura_concisao',
      label: 'Estrutura Lógica & Concisão',
      icon: Layers,
      score: evaluation.criterios.estrutura_concisao.nota,
      comment: evaluation.criterios.estrutura_concisao.comentario,
    },
    {
      key: 'empatia_inclusao',
      label: 'Empatia & Linguagem Inclusiva',
      icon: HeartHandshake,
      score: evaluation.criterios.empatia_inclusao.nota,
      comment: evaluation.criterios.empatia_inclusao.comentario,
    },
    {
      key: 'assertividade_diplomatica',
      label: 'Assertividade Diplomática',
      icon: Award,
      score: evaluation.criterios.assertividade_diplomatica.nota,
      comment: evaluation.criterios.assertividade_diplomatica.comentario,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#071933] rounded-2xl sm:rounded-3xl border border-[#facc15]/35 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#050e1d] via-[#0d2447] to-[#050e1d] border-b border-[#facc15]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Auditoria de Oratória Executiva
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#050e1d] text-[#facc15] border border-[#facc15]/30">
                  <BrainCircuit className="w-3 h-3 text-[#facc15]" />
                  {highThinkingApplied ? 'Raciocínio Alto (gemini-4-argon)' : modelUsed}
                </span>
              </div>
              <p className="text-xs text-[#fef08a] font-serif-luxury">
                Avaliação individualizada com notas de 0 a 10 e diagnóstico formativo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0d2447] transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 bg-[#050e1d] border-b border-[#facc15]/20 flex gap-2">
          <button
            onClick={() => setActiveTab('geral')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'geral'
                ? 'bg-[#071933] text-[#fef08a] border-t-2 border-[#facc15]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Geral & Pontuações
          </button>
          <button
            onClick={() => setActiveTab('rubrica')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'rubrica'
                ? 'bg-[#071933] text-[#fef08a] border-t-2 border-[#facc15]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critérios Detalhados (5 Pilares)
          </button>
          <button
            onClick={() => setActiveTab('modelo')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'modelo'
                ? 'bg-[#071933] text-[#fef08a] border-t-2 border-[#facc15]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Versão Modelo C-Level
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-100">
          {activeTab === 'geral' && (
            <>
              {/* Top Score Banner */}
              <div className="p-6 rounded-2xl bg-[#050e1d] border border-[#facc15]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-cinzel shadow-xl ${getScoreColor(
                      evaluation.notaGeral
                    )}`}
                  >
                    <span className="text-3xl sm:text-4xl font-extrabold">{evaluation.notaGeral.toFixed(1)}</span>
                    <span className="text-[10px] tracking-widest uppercase font-sans font-bold">de 10.0</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#facc15]">
                      Conceito de Desempenho
                    </span>
                    <h4 className="font-cinzel text-xl font-bold text-white mt-0.5">
                      {evaluation.notaGeral >= 9.0
                        ? 'Excelência C-Level Plena'
                        : evaluation.notaGeral >= 8.0
                        ? 'Padrão Executivo Consistente'
                        : evaluation.notaGeral >= 7.0
                        ? 'Bom Domínio em Formação'
                        : 'Necessita Aperfeiçoamento'}
                    </h4>
                    <p className="text-xs text-slate-300 font-body mt-1 max-w-md">
                      {evaluation.notaGeral >= 8.0
                        ? 'Sua resposta atende com elegância aos padrões esperados para atuação em órgãos colegiados e diretorias.'
                        : 'Identificamos pontos importantes de ajuste articulatório e estrutural para elevar sua segurança vocal.'}
                    </p>
                  </div>
                </div>

                {/* Audio quick stats */}
                {wpm !== undefined && wpm > 0 && (
                  <div className="bg-[#071933] p-3.5 rounded-xl border border-[#facc15]/20 text-xs space-y-1 sm:w-48">
                    <p className="text-[#facc15] font-bold uppercase text-[10px]">Cadência Registrada</p>
                    <p className="text-lg font-bold text-white font-cinzel">
                      {wpm} <span className="text-xs font-normal text-slate-300">PPM</span>
                    </p>
                    <p className="text-[11px] text-slate-300">Duração: {durationSeconds}s</p>
                  </div>
                )}
              </div>

              {/* Destaques Positivos & Oportunidades de Melhoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Positivos */}
                <div className="p-5 rounded-2xl bg-[#0a2040] border border-blue-400/35">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-[#facc15]" />
                    <h4 className="text-sm font-bold text-white font-cinzel">Destaques Positivos</h4>
                  </div>
                  <ul className="space-y-2">
                    {evaluation.destaquesPositivos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <span className="text-[#facc15] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pontos de Melhoria */}
                <div className="p-5 rounded-2xl bg-[#291e0a] border border-amber-500/35">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white font-cinzel">Oportunidades de Melhoria</h4>
                  </div>
                  <ul className="space-y-2">
                    {evaluation.pontosMelhoria.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Vocal Diagnosis Box */}
              <div className="p-5 rounded-2xl bg-[#050e1d] border border-[#facc15]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#facc15] mb-2 uppercase tracking-wider">
                  <Mic className="w-4 h-4 text-[#facc15]" />
                  <span>Diagnóstico de Voz, Cadência e Respiração</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                  {evaluation.diagnosticoVoz}
                </p>
              </div>

              {/* Next Challenge recommendation */}
              <div className="p-4 rounded-xl bg-[#0d2447] border border-[#facc15]/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#facc15] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#fef08a] tracking-wider">
                      Próxima Progressão Pedagógica
                    </span>
                    <p className="text-xs sm:text-sm text-white font-semibold">{evaluation.proximoDesafio}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rubrica' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                A avaliação executiva SENIA analisa individualmente 5 dimensões com notas de 0 a 10:
              </p>

              {criteriaList.map((crit, idx) => {
                const Icon = crit.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 hover:border-[#facc15]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#0d2447] text-[#facc15]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white font-cinzel">{crit.label}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-24 sm:w-36 bg-[#071933] h-2.5 rounded-full overflow-hidden border border-[#facc15]/20">
                          <div
                            className="h-full gold-gradient-bg rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(crit.score * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-base font-bold text-[#fef08a] font-cinzel w-10 text-right">
                          {crit.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-body mt-2 pl-10">{crit.comment}</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'modelo' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#050e1d] border border-[#facc15]/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#facc15]" />
                    <h4 className="text-sm font-bold text-white font-cinzel">
                      Versão Modelo C-Level (Padrão Presidencial)
                    </h4>
                  </div>

                  <button
                    onClick={handleToggleModelSpeech}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isPlayingModelSpeech
                        ? 'bg-[#facc15] text-[#050e1d] animate-pulse font-bold'
                        : 'bg-[#0d2447] text-[#fef08a] hover:bg-[#133361] border border-[#facc15]/30'
                    }`}
                  >
                    {isPlayingModelSpeech ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Pausar Áudio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />
                        <span>Ouvir com Voz Natural</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#071933] border border-[#facc15]/20 text-slate-200 text-sm sm:text-base leading-relaxed font-serif-luxury italic">
                  "{evaluation.versaoModeloCLevel}"
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Observe o uso de vocabulário protocolar apurado, assertividade serena e foco no valor estratégico para a
                  governança corporativa.
                </p>
              </div>

              {/* Student's original response comparison */}
              <div className="p-4 rounded-xl bg-[#050e1d] border border-blue-900/50">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1.5">Sua fala registrada no exercício:</p>
                <p className="text-xs text-slate-300 font-body leading-relaxed whitespace-pre-wrap">
                  {studentResponse}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#050e1d] border-t border-[#facc15]/25 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d2447] hover:bg-[#133361] text-slate-200 text-xs sm:text-sm font-semibold border border-[#facc15]/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#facc15]" />
            <span>Refazer Exercício</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#0d2447] text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Fechar e Ver Histórico
            </button>

            <button
              onClick={onNextExercise}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-bg text-[#050e1d] text-xs sm:text-sm font-bold hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              <span>Avançar para Próximo Desafio</span>
              <ArrowRight className="w-4 h-4 text-[#050e1d]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
