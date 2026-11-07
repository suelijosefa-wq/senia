import React, { useState, useEffect } from 'react';
import { Subtitles, X, Volume2 } from 'lucide-react';
import { stopSpeaking } from '../services/api';

interface LiveCaptionsBarProps {
  enabled: boolean;
}

export const LiveCaptionsBar: React.FC<LiveCaptionsBarProps> = ({ enabled }) => {
  const [captionText, setCaptionText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const handleCaptionEvent = (e: any) => {
      const detail = e.detail;
      if (detail) {
        setCaptionText(detail.text || '');
        setIsSpeaking(!!detail.isPlaying);
      }
    };

    window.addEventListener('senia_speech_caption', handleCaptionEvent);
    return () => {
      window.removeEventListener('senia_speech_caption', handleCaptionEvent);
    };
  }, []);

  if (!enabled || !captionText) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Legendas em tempo real"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl p-4 rounded-2xl bg-[#050e1d]/95 backdrop-blur-md border-2 border-[#facc15] shadow-2xl flex items-start gap-3.5 animate-fadeIn"
    >
      <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-[#050e1d] shrink-0 mt-0.5">
        <Subtitles className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#0f2d57] text-[#fef08a] border border-[#facc15]/30 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#facc15] animate-pulse" />
            Legenda em Tempo Real (Áudio Audível)
          </span>
        </div>
        <p className="text-sm sm:text-base font-medium text-white leading-relaxed font-body">
          {captionText}
        </p>
      </div>

      <button
        onClick={() => {
          stopSpeaking();
          setCaptionText('');
        }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0f2d57] transition-colors cursor-pointer"
        aria-label="Fechar legenda e interromper áudio"
        title="Fechar legenda"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
