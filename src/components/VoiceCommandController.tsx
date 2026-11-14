import React, { useEffect, useState, useRef } from 'react';
import { Mic, Volume2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { speakText, getScreenAudioDescription } from '../services/api';

interface VoiceCommandControllerProps {
  active: boolean;
  currentTab: string;
  onNavigate: (tab: 'home' | 'hub' | 'studio' | 'dashboard' | 'company') => void;
  onOpenAccessibilityModal: () => void;
  onOpenLibrasModal: () => void;
}

export const VoiceCommandController: React.FC<VoiceCommandControllerProps> = ({
  active,
  currentTab,
  onNavigate,
  onOpenAccessibilityModal,
  onOpenLibrasModal,
}) => {
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!active) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Navegador não suporta comandos de voz nativos.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
    };

    recognition.onresult = (event: any) => {
      const lastIndex = event.results.length - 1;
      const transcript = event.results[lastIndex][0].transcript.toLowerCase().trim();
      setLastCommand(transcript);
      handleProcessVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.warn('Voice command recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      // Auto restart if still active
      if (active) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Voice recognition start error:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
    };
  }, [active, currentTab]);

  const handleProcessVoiceCommand = (cmd: string) => {
    if (cmd.includes('início') || cmd.includes('inicio') || cmd.includes('começo') || cmd.includes('home')) {
      speakText('Navegando para a Página Inicial da SENIA.');
      onNavigate('home');
    } else if (cmd.includes('módulo') || cmd.includes('modulo') || cmd.includes('treinamento') || cmd.includes('exercício')) {
      speakText('Navegando para os Módulos de Formação Executiva.');
      onNavigate('hub');
    } else if (cmd.includes('estúdio') || cmd.includes('estudio') || cmd.includes('gravar') || cmd.includes('voz')) {
      speakText('Abrindo o Estúdio de Voz e Treinamento.');
      onNavigate('studio');
    } else if (cmd.includes('evolução') || cmd.includes('evolucao') || cmd.includes('desempenho') || cmd.includes('nota') || cmd.includes('aluno')) {
      speakText('Navegando para o Painel de Evolução do Aluno.');
      onNavigate('dashboard');
    } else if (cmd.includes('empresa') || cmd.includes('perfil') || cmd.includes('institucional') || cmd.includes('sobre')) {
      speakText('Navegando para o Perfil Institucional da Empresa SENIA.');
      onNavigate('company');
    } else if (cmd.includes('descrever') || cmd.includes('onde estou') || cmd.includes('descrição') || cmd.includes('audio')) {
      const description = getScreenAudioDescription(currentTab);
      speakText(description);
    } else if (cmd.includes('libras') || cmd.includes('língua de sinais') || cmd.includes('sinais')) {
      speakText('Abrindo o Guia e Dicionário em Libras.');
      onOpenLibrasModal();
    } else if (cmd.includes('acessibilidade') || cmd.includes('opções') || cmd.includes('ajuste')) {
      speakText('Abrindo Central de Acessibilidade Inclusiva.');
      onOpenAccessibilityModal();
    } else if (cmd.includes('ajuda') || cmd.includes('comandos')) {
      speakText(
        'Comandos de voz disponíveis: Diga "Início", "Perfil da Empresa", "Módulos", "Estúdio", "Evolução", "Descrever Tela", "Libras" ou "Acessibilidade".'
      );
    }
  };

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 right-4 z-40 max-w-xs p-3.5 rounded-2xl bg-[#071933]/95 backdrop-blur-md border border-[#facc15]/40 shadow-xl text-xs text-white flex items-center gap-3 animate-fadeIn"
    >
      <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] shrink-0 animate-pulse">
        <Mic className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1.5 font-bold text-[#fef08a]">
          <Sparkles className="w-3 h-3 text-[#facc15]" />
          <span>Navegação por Voz Ativa</span>
        </div>
        <p className="text-[11px] text-slate-300 mt-0.5">
          {lastCommand ? (
            <span>
              Último comando: <strong className="text-white">"{lastCommand}"</strong>
            </span>
          ) : (
            'Fale "Início", "Estúdio", "Módulos", "Descrever Tela"...'
          )}
        </p>
      </div>
    </div>
  );
};
