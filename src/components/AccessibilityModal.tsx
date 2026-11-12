import React from 'react';
import {
  X,
  Eye,
  Ear,
  Brain,
  Type,
  Volume2,
  Mic,
  Subtitles,
  Keyboard,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { AccessibilitySettings } from '../services/api';
import { speakText } from '../services/api';

interface AccessibilityModalProps {
  settings: AccessibilitySettings;
  onUpdate: (newSettings: Partial<AccessibilitySettings>) => void;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  settings,
  onUpdate,
  onClose,
}) => {
  // Preset profiles for quick application
  const applyProfile = (type: 'blind' | 'deaf' | 'neuro') => {
    if (type === 'blind') {
      onUpdate({
        highContrast: true,
        fontSizeLevel: 2,
        autoSpeakAi: true,
        voiceCommandsActive: true,
        audioDescriptions: true,
        subtitlesEnabled: true,
        textTrainingOnly: false,
      });
      speakText('Perfil para Baixa Visão e Leitores de Tela aplicado com sucesso.');
    } else if (type === 'deaf') {
      onUpdate({
        subtitlesEnabled: true,
        librasActive: true,
        textTrainingOnly: true,
        autoSpeakAi: false,
        voiceCommandsActive: false,
      });
    } else if (type === 'neuro') {
      onUpdate({
        reducedMotion: true,
        fontSizeLevel: 1,
        highContrast: false,
        subtitlesEnabled: true,
      });
    }
  };

  const handleResetDefaults = () => {
    onUpdate({
      fontSizeLevel: 0,
      highContrast: false,
      autoSpeakAi: false,
      voiceCommandsActive: false,
      audioDescriptions: false,
      subtitlesEnabled: true,
      librasActive: false,
      textTrainingOnly: false,
      reducedMotion: false,
      speechRate: 1.0,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-[#071933] rounded-3xl border-2 border-[#facc15]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#050e1d] via-[#0d2447] to-[#050e1d] border-b border-[#facc15]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 id="accessibility-modal-title" className="font-heading text-lg sm:text-xl font-semibold text-white">
                Central de Acessibilidade & Inclusão Universal
              </h3>
              <p className="text-xs text-[#fef08a] font-medium">
                Recursos para pessoas com deficiência visual, auditiva, motora ou neurodivergência
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0d2447] transition-colors cursor-pointer"
            aria-label="Fechar Central de Acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-100">
          {/* Quick Profiles Section */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#facc15] tracking-wider mb-3">
              Perfis Rápidos de Acessibilidade Assistiva:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => applyProfile('blind')}
                className="p-3.5 rounded-2xl bg-[#050e1d] hover:bg-[#0d274f] border border-[#facc15]/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5 text-[#facc15]">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-bold">Baixa Visão / Cego</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Comandos de voz, narração automática, áudio-descrição e alto contraste.
                </p>
              </button>

              <button
                onClick={() => applyProfile('deaf')}
                className="p-3.5 rounded-2xl bg-[#050e1d] hover:bg-[#0d274f] border border-[#facc15]/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5 text-[#facc15]">
                  <Ear className="w-4 h-4" />
                  <span className="text-xs font-bold">Surdo / Auditivo</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Legendas contínuas, treino textual, Libras e sinalização visual.
                </p>
              </button>

              <button
                onClick={() => applyProfile('neuro')}
                className="p-3.5 rounded-2xl bg-[#050e1d] hover:bg-[#0d274f] border border-[#facc15]/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5 text-[#facc15]">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs font-bold">Foco & Neurodivergência</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Redução de animações, leitura concentrada e instruções lineares.
                </p>
              </button>
            </div>
          </div>

          {/* Granular Toggles */}
          <div className="space-y-4 pt-4 border-t border-[#facc15]/15">
            <h4 className="text-xs uppercase font-bold text-[#facc15] tracking-wider mb-2">
              Ajustes Individuais:
            </h4>

            {/* Font scale */}
            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="text-xs font-bold text-white">Tamanho da Fonte da Interface</p>
                  <p className="text-[11px] text-slate-400">Amplia textos de leitura e formulários</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#071933] p-1 rounded-xl border border-[#facc15]/30">
                {[
                  { level: 0, label: 'Normal' },
                  { level: 1, label: 'Grande' },
                  { level: 2, label: 'Muito Grande' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => onUpdate({ fontSizeLevel: item.level })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      settings.fontSizeLevel === item.level
                        ? 'gold-gradient-bg text-[#050e1d] font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white">Modo de Alto Contraste</p>
                <p className="text-[11px] text-slate-400">Aumenta nitidez e luminosidade dos elementos</p>
              </div>
              <button
                onClick={() => onUpdate({ highContrast: !settings.highContrast })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.highContrast ? 'bg-[#facc15]' : 'bg-slate-700'
                }`}
                aria-label="Alternar modo de alto contraste"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#050e1d] absolute top-0.5 transition-transform ${
                    settings.highContrast ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Subtitles Enabled */}
            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Subtitles className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="text-xs font-bold text-white">Legendas Visuais em Tempo Real</p>
                  <p className="text-[11px] text-slate-400">Exibe caixa de texto de qualquer fala reproduzida</p>
                </div>
              </div>
              <button
                onClick={() => onUpdate({ subtitlesEnabled: !settings.subtitlesEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.subtitlesEnabled ? 'bg-[#facc15]' : 'bg-slate-700'
                }`}
                aria-label="Alternar legendas em tempo real"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#050e1d] absolute top-0.5 transition-transform ${
                    settings.subtitlesEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Voice Commands */}
            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="text-xs font-bold text-white">Navegação e Comandos por Voz</p>
                  <p className="text-[11px] text-slate-400">
                    Controle o app falando "Início", "Estúdio", "Módulos", "Mentora", etc.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextVal = !settings.voiceCommandsActive;
                  onUpdate({ voiceCommandsActive: nextVal });
                  if (nextVal) {
                    speakText('Navegação e comandos por voz ativados.');
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.voiceCommandsActive ? 'bg-[#facc15]' : 'bg-slate-700'
                }`}
                aria-label="Alternar navegação por voz"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#050e1d] absolute top-0.5 transition-transform ${
                    settings.voiceCommandsActive ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Text-only Training Mode */}
            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white">Modo 100% Textual para Exercícios</p>
                <p className="text-[11px] text-slate-400">
                  Ideal para pessoas surdas ou sem microfone: prioriza digitação e orientações visuais
                </p>
              </div>
              <button
                onClick={() => onUpdate({ textTrainingOnly: !settings.textTrainingOnly })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.textTrainingOnly ? 'bg-[#facc15]' : 'bg-slate-700'
                }`}
                aria-label="Alternar modo de treino 100% textual"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#050e1d] absolute top-0.5 transition-transform ${
                    settings.textTrainingOnly ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="p-4 rounded-2xl bg-[#050e1d] border border-[#facc15]/20">
            <div className="flex items-center gap-2 text-xs font-bold text-[#facc15] mb-2.5">
              <Keyboard className="w-4 h-4 text-[#facc15]" />
              <span>Teclas de Atalho Rápidas:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + 1:</span> Início
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + 2:</span> Módulos
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + 3:</span> Estúdio
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + 4:</span> Evolução
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + 5:</span> Mentora
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + A:</span> Acessibilidade
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + L:</span> Guia Libras
              </div>
              <div className="p-2 rounded-lg bg-[#071933] border border-[#facc15]/15">
                <span className="font-mono text-[#fef08a] font-bold">Alt + D:</span> Descrever Tela
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#050e1d] border-t border-[#facc15]/20 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-[#050e1d] text-xs sm:text-sm font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
