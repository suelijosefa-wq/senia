import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { api, speakText, stopSpeaking } from '../services/api';

interface MentorChatDrawerProps {
  onStartExercise?: (exerciseId: string) => void;
  autoSpeak: boolean;
}

export const MentorChatDrawer: React.FC<MentorChatDrawerProps> = ({ autoSpeak }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'model',
      content:
        'Olá! Sou a Dra. Helena Valença, sua Mentora Executiva na SENIA. Minha missão é guiar sua jornada em oratória executiva, comunicação inclusiva e liderança estratégica no Secretariado Executivo. Como posso apoiar você hoje? Gostaria de treinar um discurso, esclarecer normas de protocolo cerimonial ou realizar um aquecimento vocal?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyForApi = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendChatMessage(text, historyForApi, 'Secretariado Executivo & Oratória');
      const aiReply = res.reply || 'Compreendo perfeitamente sua colocação.';

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: aiReply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, modelMsg]);

      if (autoSpeak) {
        setPlayingMessageId(modelMsg.id);
        speakText(aiReply, 1.0, () => setPlayingMessageId(null));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'Peço escusas, houve uma oscilação na conexão com a assessoria da Mentora. Por favor, reformule sua questão ou tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeak = (msgId: string, content: string) => {
    if (playingMessageId === msgId) {
      stopSpeaking();
      setPlayingMessageId(null);
    } else {
      stopSpeaking();
      setPlayingMessageId(msgId);
      speakText(content, 1.0, () => setPlayingMessageId(null));
    }
  };

  const quickPrompts = [
    'Como evitar o nervosismo antes de ler a ata no Conselho?',
    'Quais pronomes de tratamento corretos usar em sessão solene?',
    'Exercício rápido de 1 minuto para aquecer a dicção',
    'Como interromper educadamente uma discussão inflamada na diretoria?',
    'Diferença entre comunicação assertiva e agressiva no secretariado',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mentor Header Profile */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#091f3d] to-[#050e1d] border border-[#facc15]/30 blue-card-glow mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-cinzel text-3xl font-extrabold shadow-xl">
              H
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#050e1d] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-[#fef08a]" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Dra. Helena Valença
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#07152b] text-[#facc15] border border-[#facc15]/40">
                Mentora Executiva IA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#fef08a] font-serif-luxury mt-1">
              Especialista em Comunicação Diplomática, Oratória Inclusiva e Governança C-Level
            </p>
            <p className="text-xs text-slate-300 font-body mt-2 leading-relaxed">
              Disponível para orientar simulações de fala, postura protocolar, Comunicação Não-Violenta (CNV) e
              superação da ansiedade oratória.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wider font-bold text-[#facc15] mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-[#facc15]" />
          <span>Sugestões de Consulta Rápida:</span>
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-[#071933] hover:bg-[#0e2c56] border border-[#facc15]/25 text-xs text-slate-200 whitespace-nowrap transition-colors cursor-pointer hover:border-[#facc15]/60 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="p-6 rounded-3xl bg-[#071933] border border-[#facc15]/25 blue-card-glow flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-bold text-xs shrink-0 mt-1 shadow-md">
                    H
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isModel
                      ? 'bg-[#0a2040] border border-[#facc15]/30 text-slate-100 shadow-sm font-body'
                      : 'gold-gradient-bg text-[#050e1d] font-medium shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {isModel ? 'Dra. Helena Valença' : 'Você (Estudante)'}
                    </span>

                    {isModel && (
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          playingMessageId === msg.id
                            ? 'bg-[#facc15] text-[#050e1d]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Ouvir resposta em voz alta"
                      >
                        {playingMessageId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  <span className="text-[9px] opacity-60 block mt-2 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {!isModel && (
                  <div className="w-8 h-8 rounded-xl bg-[#0f2d57] border border-[#facc15]/30 flex items-center justify-center text-[#facc15] font-bold text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-bold text-xs">
                H
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#0a2040] border border-[#facc15]/30 text-xs text-[#fef08a] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#facc15] animate-spin" />
                <span>Dra. Helena está formulando a orientação executiva...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Message Box */}
        <div className="mt-4 pt-3 border-t border-[#facc15]/20 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pergunte à Mentora Helena sobre oratória, simulações ou etiqueta corporativa..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#050e1d] border border-[#facc15]/30 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15]/60"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
            className="p-3 rounded-xl gold-gradient-bg text-[#050e1d] font-bold hover:brightness-110 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
