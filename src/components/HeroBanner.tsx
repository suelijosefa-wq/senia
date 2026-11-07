import React from 'react';
import {
  Mic,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Compass,
  ArrowRight,
  Headphones,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../services/api';

interface HeroBannerProps {
  onStartTraining: () => void;
  onOpenVoiceStudio: () => void;
  onOpenChat: () => void;
  onViewDashboard: () => void;
  speechEnabled: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartTraining,
  onOpenVoiceStudio,
  onOpenChat,
  onViewDashboard,
  speechEnabled,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const welcomeMessage =
    'Bem-vindos à SENIA – Oratória Executiva Inclusiva. Uma plataforma pedagógica pioneira dedicada a transformar estudantes e profissionais de Secretariado Executivo em líderes articulados, empáticos e seguros. Treine sua dicção, enfrente simulações de conselho e receba auditorias criteriosas da nossa inteligência artificial com notas de zero a dez.';

  const handleToggleWelcomeSpeech = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(welcomeMessage, 1.0, () => setIsPlayingAudio(false));
    }
  };

  const pillars = [
    {
      icon: Mic,
      title: 'Dicção & Fonética C-Level',
      description: 'Articulação sem esforço vocal, cadência ideal (130-150 PPM) e eliminação de cacoetes e vícios linguísticos.',
      badge: 'Treino de Voz',
    },
    {
      icon: ShieldCheck,
      title: 'Simulação de Entrevistas',
      description: 'Cenários reais de seleção para assessorias de diretoria, presidência e órgãos multilaterais.',
      badge: 'Carreira',
    },
    {
      icon: Users,
      title: 'Reuniões & Crises Corporativas',
      description: 'Ata sob pressão, mediação de interrupções, gestão de imprevistos e assertividade diplomática.',
      badge: 'Prática Real',
    },
    {
      icon: Award,
      title: 'Liderança & Inclusão Ativa',
      description: 'Comunicação Não-Violenta (CNV), acolhimento à diversidade, acessibilidade e inteligência emocional.',
      badge: 'Humanização',
    },
  ];

  return (
    <section className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-b from-[#050e1d] via-[#091b36] to-[#050e1d]">
      {/* Decorative corporate glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#facc15]/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2447] border border-[#facc15]/35 text-xs font-semibold text-[#fef08a] shadow-md">
            <Sparkles className="w-4 h-4 text-[#facc15] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Plataforma Oficial de Oratória para Secretariado Executivo</span>
          </div>

          <button
            onClick={handleToggleWelcomeSpeech}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-[#facc15] text-[#050e1d] font-bold animate-pulse'
                : 'bg-[#0b1c38] text-slate-300 hover:text-white border border-[#facc15]/30'
            }`}
            title="Ouvir apresentação da plataforma em voz alta"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? 'Parar Áudio de Boas-Vindas' : 'Ouvir Apresentação (Voz)'}</span>
          </button>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl">
          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            A Voz que Articula, Inspira e <span className="gold-gradient-text">Conduz a Alta Gestão</span>.
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-300 font-serif-luxury leading-relaxed max-w-3xl">
            A <strong className="text-[#fef08a] font-semibold">SENIA</strong> é um ecossistema educacional com inteligência
            artificial projetado sob medida para o <em>Secretariado Executivo</em>. Desenvolva autoridade serena,
            clareza fonética e liderança diplomática por meio de simulações vocais e auditorias avaliativas de 0 a 10.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenVoiceStudio}
              className="flex items-center gap-3 px-6 py-3.5 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm sm:text-base hover:brightness-110 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#050e1d]/80 cursor-pointer"
            >
              <Mic className="w-5 h-5 text-[#050e1d]" />
              <span>Gravar e Analisar Voz</span>
              <ArrowRight className="w-4 h-4 text-[#050e1d]" />
            </button>

            <button
              onClick={onStartTraining}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#0f2d57] hover:bg-[#163e77] text-slate-100 font-semibold text-sm sm:text-base border border-[#facc15]/40 hover:border-[#facc15] transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#facc15]" />
              <span>Explorar Módulos Práticos</span>
            </button>

            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-[#0c2242] text-[#fef08a] font-medium text-sm sm:text-base transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#facc15]" />
              <span>Falar com a Mentora IA</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#07152b]/90 border border-[#facc15]/25 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">0 a 10</p>
              <p className="text-xs text-slate-300 font-medium">Rubrica C-Level com IA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">5 Pilares</p>
              <p className="text-xs text-slate-300 font-medium">Competências Integradas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">Tempo Real</p>
              <p className="text-xs text-slate-300 font-medium">Análise de Ritmo & PPM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">Inclusiva</p>
              <p className="text-xs text-slate-300 font-medium">CNV & Acessibilidade</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs uppercase font-bold tracking-widest text-[#facc15]">Metodologia de Excelência</p>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
              Os Pilares da Formação Executiva SENIA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-[#0b1c38]/85 border border-[#facc15]/20 hover:border-[#facc15]/50 hover:bg-[#0f274d] transition-all duration-300 blue-card-glow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#132f5b] border border-[#facc15]/30 flex items-center justify-center text-[#facc15] group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#07152b] text-[#facc15] border border-[#facc15]/25">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#fef08a] transition-colors font-cinzel">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#facc15]/15 flex items-center text-xs text-[#facc15] font-semibold gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>Critério Avaliativo Rigoroso</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
