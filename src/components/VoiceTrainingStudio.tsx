import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  Sparkles,
  Volume2,
  Clock,
  Gauge,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  HelpCircle,
  FileText,
  VolumeX,
  Keyboard,
  Ear,
  Eye,
  Check,
} from 'lucide-react';
import { ExerciseItem, EvaluationResult } from '../types';
import { api, speakText, stopSpeaking } from '../services/api';

interface VoiceTrainingStudioProps {
  exercise: ExerciseItem;
  textTrainingOnlyDefault?: boolean;
  onEvaluationComplete: (result: {
    evaluation: EvaluationResult;
    modelUsed: string;
    highThinkingApplied: boolean;
    studentResponse: string;
    wpm: number;
    durationSeconds: number;
  }) => void;
  onSwitchExercise?: () => void;
}

export const VoiceTrainingStudio: React.FC<VoiceTrainingStudioProps> = ({
  exercise,
  textTrainingOnlyDefault = false,
  onEvaluationComplete,
  onSwitchExercise,
}) => {
  const [trainingMode, setTrainingMode] = useState<'voice' | 'text'>(
    textTrainingOnlyDefault ? 'text' : 'voice'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingModelPrompt, setIsPlayingModelPrompt] = useState(false);
  const [isSpeakingGuidelines, setIsSpeakingGuidelines] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync mode if prop changes
  useEffect(() => {
    if (textTrainingOnlyDefault) {
      setTrainingMode('text');
    }
  }, [textTrainingOnlyDefault]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Permissão de microfone negada. Você ainda pode digitar seu discurso no campo de texto.');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      stopAudioVisualizer();
      stopSpeaking();
    };
  }, []);

  // Cadence / WPM computation
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const currentWpm = recordingSeconds > 3 ? Math.round((wordCount / recordingSeconds) * 60) : 0;

  // Detect corporate filler words
  const fillerRegex = /\b(tipo assim|né|ééé|então né|aí|tipo|sabe|tá entendendo|meio que)\b/gi;
  const fillerMatches = transcript.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  // Waveform visualization
  const startAudioVisualizer = async (stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#050e1d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.8;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

          // Corporate yellow and royal blue gradient bars
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          gradient.addColorStop(0, '#fef9c3');
          gradient.addColorStop(0.45, '#facc15');
          gradient.addColorStop(1, '#1e40af');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      };

      draw();
    } catch (err) {
      console.warn('Audio visualization not available:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startAudioVisualizer(stream);

      // Start Speech Recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition start caught:', e);
        }
      }

      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(
        'Acesso ao microfone indisponível ou bloqueado. Por favor permita o microfone no navegador ou use o Modo de Treino Textual abaixo.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    stopAudioVisualizer();
    setIsRecording(false);
  };

  const handleReset = () => {
    stopRecording();
    setTranscript('');
    setRecordingSeconds(0);
    setAudioUrl(null);
    setErrorMessage(null);
  };

  const handlePlayModelPrompt = () => {
    if (isPlayingModelPrompt) {
      stopSpeaking();
      setIsPlayingModelPrompt(false);
    } else if (exercise.sampleAudioPrompt) {
      setIsPlayingModelPrompt(true);
      speakText(exercise.sampleAudioPrompt, 1.0, () => setIsPlayingModelPrompt(false));
    }
  };

  // Speak activity instructions for blind/low-vision users
  const handleSpeakGuidelines = () => {
    if (isSpeakingGuidelines) {
      stopSpeaking();
      setIsSpeakingGuidelines(false);
    } else {
      setIsSpeakingGuidelines(true);
      const textToRead = `Orientações da Atividade: ${exercise.title}. Nível: ${exercise.level}. Cenário corporativo: ${exercise.scenario}. Papel do Secretariado: ${exercise.roleContext}. Instruções práticas: ${exercise.instructions.join('. ')}. Competências esperadas: ${exercise.expectedCompetencies.join('. ')}. Tempo sugerido: ${exercise.recommendedDurationSeconds} segundos. Você pode gravar sua voz ou digitar sua resposta.`;
      speakText(textToRead, 1.0, () => setIsSpeakingGuidelines(false));
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Por favor, grave seu áudio ou digite sua fala antes de solicitar a avaliação executiva.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const result = await api.evaluateResponse({
        exerciseTitle: exercise.title,
        exerciseType: exercise.category,
        promptScenario: exercise.scenario,
        expectedCompetencies: exercise.expectedCompetencies,
        studentResponse: transcript,
        audioMetrics: {
          wpm: currentWpm,
          durationSeconds: recordingSeconds,
          fillerCount,
        },
      });

      onEvaluationComplete({
        evaluation: result.evaluation,
        modelUsed: result.modelUsed,
        highThinkingApplied: result.highThinkingApplied,
        studentResponse: transcript,
        wpm: currentWpm,
        durationSeconds: recordingSeconds,
      });
    } catch (err: any) {
      console.error('Submit evaluation error:', err);
      setErrorMessage(
        err.message || 'Houve uma falha ao contatar a inteligência avaliadora. Tente novamente em instantes.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine cadence health badge
  let cadenceLabel = 'Ritmo Moderado';
  let cadenceColor = 'text-amber-300';
  let cadenceDotColor = 'bg-amber-400';
  if (currentWpm > 0) {
    if (currentWpm < 110) {
      cadenceLabel = 'Ritmo Lento / Reflexivo';
      cadenceColor = 'text-blue-300';
      cadenceDotColor = 'bg-blue-400';
    } else if (currentWpm <= 160) {
      cadenceLabel = 'Cadência Executiva Ideal (120-160 PPM)';
      cadenceColor = 'text-yellow-400 font-semibold';
      cadenceDotColor = 'bg-[#facc15]';
    } else {
      cadenceLabel = 'Ritmo Acelerado (Atenção às Pausas)';
      cadenceColor = 'text-rose-400';
      cadenceDotColor = 'bg-rose-500';
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#071933] via-[#0d274f] to-[#071933] border border-[#facc15]/30 blue-card-glow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#051124] text-[#facc15] border border-[#facc15]/30">
                {exercise.level}
              </span>
              <span className="text-xs text-slate-300">Tempo sugerido: {exercise.recommendedDurationSeconds}s</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">{exercise.title}</h2>
            <p className="text-xs sm:text-sm text-[#fef08a] font-serif-luxury mt-1">{exercise.subtitle}</p>
          </div>

          {/* Quick Audio & Spoken Guidelines Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSpeakGuidelines}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none ${
                isSpeakingGuidelines
                  ? 'bg-[#facc15] text-[#050e1d] font-bold animate-pulse'
                  : 'bg-[#081b38] text-[#fef08a] hover:bg-[#0f2c57] border border-[#facc15]/30'
              }`}
              title="Ouvir instruções da atividade faladas em voz alta (Acessibilidade)"
              aria-label="Ouvir orientações faladas da atividade"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />
              <span>{isSpeakingGuidelines ? 'Pausar Instruções' : 'Ouvir Orientações'}</span>
            </button>

            {exercise.sampleAudioPrompt && (
              <button
                onClick={handlePlayModelPrompt}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none ${
                  isPlayingModelPrompt
                    ? 'bg-[#facc15] text-[#050e1d] animate-pulse font-bold'
                    : 'bg-[#081b38] text-[#fef08a] hover:bg-[#0f2c57] border border-[#facc15]/30'
                }`}
                title="Ouvir entonação e pronúncia modelo"
                aria-label="Ouvir exemplo modelo com voz"
              >
                {isPlayingModelPrompt ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />}
                <span>{isPlayingModelPrompt ? 'Pausar' : 'Exemplo Modelo'}</span>
              </button>
            )}

            {onSwitchExercise && (
              <button
                onClick={onSwitchExercise}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#0d2447] hover:bg-[#133361] text-slate-200 border border-[#facc15]/30 transition-colors cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none"
              >
                Trocar Desafio
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector for Hearing-Impaired / Deaf / Blind Inclusion */}
        <div className="mt-4 pt-3 border-t border-[#facc15]/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#050e1d] p-1 rounded-xl border border-[#facc15]/25">
            <button
              onClick={() => setTrainingMode('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                trainingMode === 'voice'
                  ? 'gold-gradient-bg text-[#050e1d] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Modo por Voz (Microfone)</span>
            </button>

            <button
              onClick={() => setTrainingMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                trainingMode === 'text'
                  ? 'gold-gradient-bg text-[#050e1d] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Modo Textual & Visual (Inclusivo para Surdos)</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#facc15]" />
            <span>Navegação compatível com teclado e leitores de tela</span>
          </span>
        </div>

        {/* Scenario description box */}
        <div className="mt-4 p-4 rounded-xl bg-[#050e1d]/80 border border-[#facc15]/20">
          <p className="text-xs uppercase font-bold text-[#facc15] tracking-wider mb-1">Cenário Corporativo:</p>
          <p className="text-sm text-slate-200 leading-relaxed font-body">{exercise.scenario}</p>

          <div className="mt-3 pt-3 border-t border-[#facc15]/15 flex flex-wrap gap-4 text-xs text-slate-300">
            <div>
              <strong className="text-[#fef08a]">Papel do Secretariado:</strong> {exercise.roleContext}
            </div>
          </div>
        </div>
      </div>

      {/* Recording Studio Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Waveform / Visual Step-by-Step + Editor */}
        <div className="lg:col-span-2 space-y-5">
          {trainingMode === 'voice' ? (
            /* Voice Audio Visualizer Box */
            <div className="p-6 rounded-2xl bg-[#071933] border border-[#facc15]/25 blue-card-glow relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isRecording ? 'bg-red-500 animate-ping' : 'bg-[#facc15]'
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {isRecording ? 'Microfone Ativo • Gravando' : 'Estúdio de Voz Pronto'}
                  </span>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#050e1d] border border-[#facc15]/30 text-xs font-mono font-bold text-[#facc15]">
                  <Clock className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>{formatTime(recordingSeconds)}</span>
                </div>
              </div>

              {/* Canvas for Live Audio Wave */}
              <div className="w-full h-24 bg-[#050e1d] rounded-xl border border-[#facc15]/20 flex items-center justify-center overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={96}
                  className="w-full h-full object-cover"
                />
                {!isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-medium">
                    Clique no botão amarelo abaixo para iniciar sua fala
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#050e1d]/80 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                    >
                      <Mic className="w-5 h-5 text-[#050e1d]" />
                      <span>Iniciar Gravação de Voz</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg transition-all animate-pulse cursor-pointer focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                    >
                      <Square className="w-5 h-5 fill-current" />
                      <span>Pausar / Finalizar Fala</span>
                    </button>
                  )}

                  {(transcript || audioUrl) && (
                    <button
                      onClick={handleReset}
                      disabled={isRecording}
                      className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-[#0d2447] hover:bg-[#133361] text-slate-300 hover:text-white text-xs font-medium border border-[#facc15]/25 transition-colors disabled:opacity-50 cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Recomeçar</span>
                    </button>
                  )}
                </div>

                {/* Recorded Audio Preview */}
                {audioUrl && !isRecording && (
                  <div className="flex items-center gap-2 bg-[#050e1d] px-3 py-1.5 rounded-xl border border-[#facc15]/30">
                    <span className="text-[11px] text-slate-300 font-medium">Sua gravação:</span>
                    <audio src={audioUrl} controls className="h-8 w-44" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Visual Step-by-Step Panel for Deaf/Text Students */
            <div className="p-5 rounded-2xl bg-[#071933] border border-[#facc15]/30 blue-card-glow">
              <div className="flex items-center gap-2 text-xs font-bold text-[#facc15] uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#facc15]" />
                <span>Roteiro Visual de Estruturação Textual C-Level</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                  <span className="font-bold text-[#fef08a] block mb-1">1. Abertura & Saudação</span>
                  <p className="text-slate-300 text-[11px]">Identifique-se e cumprimente as autoridades presentes com serenidade.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                  <span className="font-bold text-[#fef08a] block mb-1">2. Posição Estratégica</span>
                  <p className="text-slate-300 text-[11px]">Apresente o encaminhamento objetivo com argumentos diplomáticos claros.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                  <span className="font-bold text-[#fef08a] block mb-1">3. Conclusão & Ação</span>
                  <p className="text-slate-300 text-[11px]">Finalize indicando os próximos passos e registrando fidelidade em ata.</p>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Transcription & Editor */}
          <div className="p-6 rounded-2xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#facc15]" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  {trainingMode === 'voice'
                    ? 'Transcrição da Sua Oratória (Editável)'
                    : 'Redação da Resposta Executiva (Apoio Visual)'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {wordCount} palavras • {fillerCount} vícios identificados
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={
                trainingMode === 'voice'
                  ? 'Sua fala transcrita em tempo real aparecerá aqui. Você também pode complementar ou redigir diretamente...'
                  : 'Digite aqui sua resposta completa para a simulação executiva. A IA avaliará a estrutura, diplomacia, assertividade e inclusão...'
              }
              rows={5}
              className="w-full p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/30 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-all resize-none"
              aria-label="Campo de transcrição e texto do discurso executivo"
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit for AI Audit button */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#facc15]/15">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <BrainCircuit className="w-4 h-4 text-[#facc15]" />
                <span>Auditado por IA com Raciocínio Avançado e Rubrica C-Level</span>
              </div>

              <button
                onClick={handleSubmitEvaluation}
                disabled={isEvaluating || isRecording || !transcript.trim()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm sm:text-base hover:brightness-110 shadow-lg shadow-[#050e1d]/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-5 h-5 text-[#050e1d] animate-spin" />
                    <span>Auditando Resposta (gemini-4-argon)...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#050e1d]" />
                    <span>Avaliar Discurso (0 a 10)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Real-time Cadence & Secretarial Coaching Box */}
        <div className="space-y-5">
          {/* Live Cadence (WPM) Gauge / Visual Semáforo */}
          <div className="p-5 rounded-2xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#facc15]" />
                <h4 className="text-sm font-bold text-white font-cinzel">Semáforo Visual de Ritmo</h4>
              </div>
              <div className={`w-3 h-3 rounded-full ${cadenceDotColor} animate-pulse`} />
            </div>

            <div className="p-4 rounded-xl bg-[#050e1d] border border-[#facc15]/20 text-center">
              <p className="text-3xl font-extrabold text-[#fef08a] font-cinzel">
                {trainingMode === 'voice' ? currentWpm : Math.round(wordCount * 0.75)}{' '}
                <span className="text-xs text-slate-400 font-sans font-normal">
                  {trainingMode === 'voice' ? 'PPM' : 'palavras'}
                </span>
              </p>
              <p className={`text-xs mt-1 ${cadenceColor}`}>
                {trainingMode === 'voice' ? cadenceLabel : 'Extensão Textual Apropriada'}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-[#facc15]/10">
                <span>Duração Gravada:</span>
                <span className="font-semibold text-white">{formatTime(recordingSeconds)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#facc15]/10">
                <span>Total de Palavras:</span>
                <span className="font-semibold text-white">{wordCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Marcadores de Hesitação:</span>
                <span className={`font-semibold ${fillerCount > 0 ? 'text-amber-400' : 'text-blue-300'}`}>
                  {fillerCount} {fillerCount === 1 ? 'identificado' : 'identificados'}
                </span>
              </div>
            </div>
          </div>

          {/* Expected Competencies */}
          <div className="p-5 rounded-2xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
            <h4 className="text-xs uppercase font-bold text-[#facc15] tracking-wider mb-3">
              Competências Auditadas neste Desafio:
            </h4>
            <ul className="space-y-2.5">
              {exercise.expectedCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#facc15] shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Tips */}
          <div className="p-5 rounded-2xl bg-[#050e1d] border border-[#facc15]/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fef08a] mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Dica da Mentora Helena:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif-luxury italic">
              "Lembre-se: no Secretariado Executivo, o silêncio de 2 segundos antes de responder a uma pergunta difícil
              não demonstra dúvida, mas sim serenidade e ponderação fiduciária. Respire com o diafragma."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
