import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, ConversationSession } from '../types';
import { api, speakText, stopSpeaking } from '../services/api';

const STORAGE_KEY_SESSIONS = 'senia_ai_chat_sessions_v1';
const STORAGE_KEY_ACTIVE_SESSION = 'senia_ai_active_session_v1';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'model',
  content: `Olá! Sou o **Assistente Inteligente SENIA**, seu copiloto de inteligência artificial especializado em **Secretariado Executivo, Network e Oratória Executiva Inclusiva**.

Estou aqui para responder às suas dúvidas e apoiar sua formação executiva. Você pode me perguntar sobre:
- **Oratória & Dicção:** Técnicas de projeção vocal, cadência ideal (130-150 PPM) e eliminação de cacoetes.
- **Governança & Alta Gestão:** Protocolo de reuniões C-Level, redação protocolar de atas e etiqueta corporativa.
- **Comunicação Inclusiva:** Práticas de Comunicação Não-Violenta (CNV), empatia ativa e acolhimento à diversidade.
- **Inovação & IA no Secretariado:** Como integrar Inteligência Artificial nas rotinas estratégicas de assessoria.
- **A Iniciativa SENIA:** Propósito, pilares e diretriz *"Planejar • Organizar • Conquistar"*.

Como posso ajudar você hoje? Digite sua pergunta ou use o microfone para falar comigo por voz!`,
  timestamp: new Date().toISOString(),
};

interface IntelligentAssistantProps {
  onStartExercise?: (exerciseId: string) => void;
  onNavigateTab?: (tab: any) => void;
  speechEnabledDefault?: boolean;
}

export const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({
  onStartExercise,
  onNavigateTab,
  speechEnabledDefault = false,
}) => {
  // Sessions state (ChatGPT style conversation list)
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (raw) {
        const parsed: ConversationSession[] = JSON.parse(raw);
        if (parsed.length > 0) {
          setSessions(parsed);
          const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_SESSION);
          const found = parsed.find((s) => s.id === savedActiveId) || parsed[0];
          setActiveSessionId(found.id);
          setMessages(found.messages);
          return;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar sessões de chat:', e);
    }

    // Default first session
    const firstSession: ConversationSession = {
      id: `session-${Date.now()}`,
      title: 'Boas-vindas à SENIA',
      createdAt: new Date().toISOString(),
      messages: [INITIAL_WELCOME_MESSAGE],
    };
    setSessions([firstSession]);
    setActiveSessionId(firstSession.id);
    setMessages([INITIAL_WELCOME_MESSAGE]);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
        if (activeSessionId) {
          localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, activeSessionId);
        }
      } catch (e) {
        console.warn('Erro ao salvar sessões de chat:', e);
      }
    }
  }, [sessions, activeSessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Create a new conversation session
  const handleStartNewConversation = () => {
    stopSpeaking();
    setPlayingMessageId(null);
    setApiError(null);
    setVoiceError(null);

    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      title: 'Nova Conversa',
      createdAt: new Date().toISOString(),
      messages: [INITIAL_WELCOME_MESSAGE],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setInputText('');
    setSidebarOpen(false);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Switch to an existing session
  const handleSelectSession = (sessionId: string) => {
    stopSpeaking();
    setPlayingMessageId(null);
    setApiError(null);
    const selected = sessions.find((s) => s.id === sessionId);
    if (selected) {
      setActiveSessionId(selected.id);
      setMessages(selected.messages);
      setSidebarOpen(false);
    }
  };

  // Delete a session
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      const freshSession: ConversationSession = {
        id: `session-${Date.now()}`,
        title: 'Nova Conversa',
        createdAt: new Date().toISOString(),
        messages: [INITIAL_WELCOME_MESSAGE],
      };
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
      setMessages([INITIAL_WELCOME_MESSAGE]);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      }
    }
  };

  // Send message to Gemini backend API
  const handleSendMessage = async (textOverride?: string) => {
    const text = (textOverride !== undefined ? textOverride : inputText).trim();
    if (!text || isLoading) return;

    setApiError(null);
    setVoiceError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    // Update session title if it's the first user question
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isFirstUserMessage = s.messages.filter((m) => m.role === 'user').length === 0;
          const newTitle = isFirstUserMessage
            ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
            : s.title;
          return {
            ...s,
            title: newTitle,
            messages: updatedMessages,
          };
        }
        return s;
      })
    );

    try {
      // Format history for the server API
      const historyForApi = updatedMessages
        .filter((m) => m.id !== 'welcome-msg') // exclude pure system greeting from prompt chain
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await api.sendChatMessage(
        text,
        historyForApi,
        'Secretariado Executivo, Network e Oratória Executiva Inclusiva'
      );

      const aiReply = res.reply || 'Compreendo perfeitamente sua consideração.';

      const assistantMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: aiReply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update in session state
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: finalMessages } : s))
      );

      // Auto speak if enabled
      if (speechEnabledDefault) {
        setPlayingMessageId(assistantMessage.id);
        speakText(aiReply, 1.0, () => setPlayingMessageId(null));
      }
    } catch (err: any) {
      console.error('Erro na resposta da IA:', err);
      const errMsg = err?.message || 'Falha na conexão com a inteligência artificial.';
      setApiError(errMsg);

      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Houve uma oscilação na comunicação com a API da Inteligência Artificial (${errMsg}).\n\nPor favor, certifique-se de que a conexão esteja ativa ou reformule sua pergunta. Esta plataforma está conectada diretamente ao modelo Gemini para garantir respostas genuínas de alta qualidade.`,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, fallbackMessage];
      setMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: finalMessages } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Interaction: Speech-to-Text using Web Speech API
  const handleToggleVoiceInput = () => {
    if (isRecordingVoice) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Seu navegador não suporta reconhecimento de voz nativo. Digite sua pergunta.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Erro de reconhecimento de voz:', event.error);
        if (event.error !== 'no-speech') {
          setVoiceError(`Aviso de voz: ${event.error}`);
        }
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e: any) {
      console.error('Falha ao iniciar microfone:', e);
      setVoiceError('Não foi possível acessar o microfone.');
      setIsRecordingVoice(false);
    }
  };

  // Text-to-Speech playback for accessibility
  const handleToggleSpeech = (msgId: string, content: string) => {
    if (playingMessageId === msgId) {
      stopSpeaking();
      setPlayingMessageId(null);
    } else {
      stopSpeaking();
      setPlayingMessageId(msgId);
      speakText(content, 1.0, () => setPlayingMessageId(null));
    }
  };

  // Copy text to clipboard
  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Suggested prompt starters
  const quickPrompts = [
    {
      category: 'Iniciativa SENIA',
      prompt: 'O que significa SENIA e qual é a proposta para o Secretariado Executivo?',
    },
    {
      category: 'Oratória & Dicção',
      prompt: 'Como manter a cadência de 130 a 150 PPM e evitar nervosismo ao falar?',
    },
    {
      category: 'Governança C-Level',
      prompt: 'Como o Secretariado Executivo deve redigir atas de reuniões estratégicas com alta diretoria?',
    },
    {
      category: 'IA & Inovação',
      prompt: 'De que maneira a Inteligência Artificial pode apoiar a tomada de decisões no secretariado?',
    },
    {
      category: 'Comunicação Não-Violenta',
      prompt: 'Como aplicar os 4 passos da CNV para mediar atritos entre gestores?',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Container with Modern Balanced White & Navy Palette */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row h-[720px] max-h-[82vh]">
        {/* Mobile Header / Sidebar Toggle */}
        <div className="md:hidden p-3.5 bg-[#071933] text-white flex items-center justify-between border-b border-[#facc15]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                alt="SENIA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-cinzel text-xs font-bold text-white">Assistente Inteligente</p>
              <p className="text-[10px] text-[#fef08a]">SENIA IA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartNewConversation}
              className="p-1.5 rounded-lg bg-[#0f2d57] text-[#fef08a] border border-[#facc15]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Nova Conversa"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0f2d57] text-white text-xs font-medium cursor-pointer"
              aria-label="Abrir histórico de conversas"
            >
              Histórico ({sessions.length})
            </button>
          </div>
        </div>

        {/* Left Sidebar: Conversation History (ChatGPT Style) */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:flex flex-col w-full md:w-72 bg-[#071933] border-r border-slate-200/20 text-white p-4 shrink-0 transition-all z-20`}
        >
          {/* New Chat Button */}
          <button
            onClick={handleStartNewConversation}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#fde047] via-[#facc15] to-[#ca8a04] text-[#050e1d] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-105 shadow-md transition-all cursor-pointer mb-4"
            aria-label="Iniciar nova conversa com o assistente"
          >
            <Plus className="w-4 h-4 text-[#050e1d]" />
            <span>Nova Conversa</span>
          </button>

          {/* History Label */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Histórico de Conversas</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0f2d57] text-[#fef08a]">
              {sessions.length}
            </span>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#0f2d57] text-[#fef9c3] border border-[#facc15]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0a2040] hover:text-white'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSession(session.id);
                    }
                  }}
                  aria-label={`Conversa: ${session.title}`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#facc15]' : 'text-slate-400'}`}
                    />
                    <span className="truncate">{session.title}</span>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 rounded transition-opacity cursor-pointer"
                      title="Excluir conversa"
                      aria-label="Excluir conversa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Institutional Brand Badge at Sidebar Bottom */}
          <div className="mt-4 pt-3 border-t border-[#facc15]/20 text-[11px] text-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
              <span className="font-bold text-white">IA Gemini Ativa</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Secretariado Executivo, Network e Oratória Executiva Inclusiva.
            </p>
          </div>
        </aside>

        {/* Main Conversation Canvas (Balanced Crisp White Canvas) */}
        <main
          className="flex-1 flex flex-col bg-white overflow-hidden relative"
          role="region"
          aria-label="Área de conversação com o Assistente Inteligente"
        >
          {/* Top Bar inside Canvas */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                  alt="Logo Oficial SENIA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-cinzel text-base font-extrabold text-[#071933]">
                    Assistente Inteligente SENIA
                  </h2>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    IA Executiva
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-body">
                  Secretariado Executivo, Network e Oratória Executiva Inclusiva
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartNewConversation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#071933] text-xs font-semibold border border-slate-200 transition-colors shadow-sm cursor-pointer"
                title="Começar uma nova conversa limpa"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#071933]" />
                <span>Limpar / Nova</span>
              </button>
            </div>
          </div>

          {/* Error Banner if any */}
          {apiError && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{apiError}</span>
              </div>
              <button
                onClick={() => setApiError(null)}
                className="font-bold underline text-amber-900 text-[11px] cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/50 to-white">
            {messages.map((msg, index) => {
              const isModel = msg.role === 'model';
              const isFirst = index === 0 && isModel;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isModel ? 'justify-start' : 'justify-end'}`}
                >
                  {isModel && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-200 p-0.5 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                        alt="Logo SENIA"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isModel
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-[#071933] text-white font-medium'
                    }`}
                  >
                    {/* Header of message bubble */}
                    <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-100">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isModel ? 'text-[#071933]' : 'text-[#fef08a]'
                        }`}
                      >
                        {isModel ? 'Assistente SENIA' : 'Você'}
                      </span>

                      {isModel && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copiar texto da resposta"
                            aria-label="Copiar texto da resposta"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleSpeech(msg.id, msg.content)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              playingMessageId === msg.id
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title="Ouvir resposta em voz alta (Acessibilidade)"
                            aria-label="Ouvir resposta em voz alta"
                          >
                            {playingMessageId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap font-body leading-relaxed space-y-2">
                      {msg.content}
                    </div>

                    {/* Quick prompt cards on first welcome message */}
                    {isFirst && (
                      <div className="mt-5 pt-4 border-t border-slate-200">
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Perguntas Sugeridas para Começar:</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {quickPrompts.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(item.prompt)}
                              className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 text-xs text-slate-700 transition-all cursor-pointer group"
                            >
                              <span className="text-[10px] font-bold text-amber-700 block uppercase tracking-wider mb-0.5">
                                {item.category}
                              </span>
                              <span className="group-hover:text-[#071933] font-medium leading-tight line-clamp-2">
                                {item.prompt}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={`text-[9px] block mt-2 text-right ${
                        isModel ? 'text-slate-400' : 'text-slate-300'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {!isModel && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#071933] text-[#fef08a] flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-200 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                    alt="Logo SENIA"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span className="font-medium">O Assistente SENIA está elaborando a resposta com IA...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice status error warning */}
          {voiceError && (
            <div className="px-4 py-1.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{voiceError}</span>
              <button
                onClick={() => setVoiceError(null)}
                className="underline font-bold text-[11px] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Input Area (ChatGPT Floating Bar Style) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative rounded-2xl bg-white border border-slate-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all shadow-sm"
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder="Faça uma pergunta sobre oratória, secretariado, governança ou SENIA... (Pressione Enter para enviar)"
                className="w-full pt-3 px-4 pb-2 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 resize-none outline-none font-body"
                aria-label="Campo para digitar sua pergunta ao Assistente Inteligente SENIA"
              />

              <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {/* Voice input button */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isRecordingVoice
                        ? 'bg-rose-500 text-white animate-pulse shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                    title={isRecordingVoice ? 'Parar gravação de voz' : 'Falar por voz (Ditado)'}
                    aria-label={isRecordingVoice ? 'Parar gravação de voz' : 'Falar por voz'}
                  >
                    {isRecordingVoice ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Ouvindo...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-amber-600" />
                        <span className="hidden sm:inline">Gravar Pergunta</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Pressione Enter para enviar • Shift+Enter para nova linha
                  </span>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fde047] via-[#facc15] to-[#ca8a04] text-[#050e1d] font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Enviar pergunta"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5 text-[#050e1d]" />
                </button>
              </div>
            </form>

            <p className="text-[10px] text-center text-slate-500 mt-2">
              Assistente Inteligente SENIA com IA Gemini • Respostas voltadas à formação de Secretariado Executivo, Network e Oratória.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
