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
  Cpu,
  Building2,
  Bot,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../services/api';

interface HeroBannerProps {
  onStartTraining: () => void;
  onOpenVoiceStudio: () => void;
  onOpenChat: () => void;
  onViewDashboard: () => void;
  onViewCompanyProfile?: () => void;
  speechEnabled: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartTraining,
  onOpenVoiceStudio,
  onOpenChat,
  onViewDashboard,
  onViewCompanyProfile,
  speechEnabled,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const welcomeMessage =
    'Bem-vindos à SENIA – Secretariado Executivo, Network e Inteligência Artificial. Desenvolvendo competências para o seu futuro. A Oratória Executiva Inclusiva é uma de nossas soluções fundamentais, transformando estudantes e profissionais em líderes articulados, empáticos e seguros. Treine sua dicção, enfrente simulações de conselho e receba auditorias criteriosas da nossa inteligência artificial com notas de zero a dez.';

  const handleToggleWelcomeSpeech = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(welcomeMessage, 1.0, () => setIsPlayingAudio(false));
    }
  };

  const brandPillars = [
    {
      icon: ShieldCheck,
      title: 'Profissionalismo',
      tagline: 'Ética & Governança C-Level',
      description: 'Postura executiva, protocolo internacional, discrição e excelência em assessoria da alta administração.',
      badge: 'Pilar 01',
    },
    {
      icon: Cpu,
      title: 'Inovação',
      tagline: 'IA Avançada & Futuro',
      description: 'Adoção prática de Inteligência Artificial generativa para otimização de rotinas e análise fonética.',
      badge: 'Pilar 02',
    },
    {
      icon: Users,
      title: 'Conexões',
      tagline: 'Network & Diplomacia',
      description: 'Construção de pontes corporativas duradouras, comunicação não-violenta e articulação estratégica multissetorial.',
      badge: 'Pilar 03',
    },
    {
      icon: TrendingUp,
      title: 'Resultados',
      tagline: 'Planejar • Organizar • Conquistar',
      description: 'Oratória focada na tomada de decisões estratégicas, liderança persuasiva e entrega de valor consistente.',
      badge: 'Pilar 04',
    },
  ];

  return (
    <section className="relative overflow-hidden py-8 md:py-14 bg-gradient-to-b from-[#050e1d] via-[#091b36] to-[#0a1c36]">
      {/* Decorative corporate glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#facc15]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Announcement Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2447] border border-[#facc15]/35 text-xs font-semibold text-[#fef08a] shadow-md">
            <Sparkles className="w-4 h-4 text-[#facc15] animate-spin" style={{ animationDuration: '8s' }} />
            <span>SENIA • Secretariado Executivo, Network e Inteligência Artificial</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onViewCompanyProfile && (
              <button
                onClick={onViewCompanyProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0d2447] hover:bg-[#12315e] text-[#fef08a] border border-[#facc15]/30 transition-all cursor-pointer"
                title="Conhecer o Perfil Institucional da Empresa SENIA"
              >
                <Building2 className="w-3.5 h-3.5 text-[#facc15]" />
                <span>Perfil da Empresa</span>
              </button>
            )}

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
              <span>{isPlayingAudio ? 'Parar Áudio' : 'Ouvir Apresentação (Voz)'}</span>
            </button>
          </div>
        </div>

        {/* Hero Grid: Highlights Focused on Content, Company Presentation & Inclusive Speech */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Title, Subtitle and Actions */}
          <div className="lg:col-span-7">
            <div className="inline-block mb-3 px-3 py-1 rounded-lg bg-[#facc15]/15 border border-[#facc15]/40 text-xs font-bold uppercase tracking-widest text-[#fef08a]">
              Solução Educacional: Oratória Executiva Inclusiva
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.18]">
              A Voz que Articula, Inspira e <span className="gold-gradient-text">Conduz a Alta Gestão</span>.
            </h1>

            <p className="mt-3 text-sm sm:text-base text-amber-200/90 font-serif-luxury italic font-medium">
              &ldquo;Desenvolvendo competências para o seu futuro.&rdquo;
            </p>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-body">
              A <strong className="text-white font-semibold">SENIA</strong> é a iniciativa pioneira voltada ao{' '}
              <span className="text-[#fef08a] font-medium">Secretariado Executivo, Network e Inteligência Artificial</span>,
              oferecendo a <em>Oratória Executiva Inclusiva</em> como ambiente prático de formação.
              Desenvolva dicção impecável, enfrente simulações de reuniões e entrevistas de alta governança e receba auditorias
              criteriosas da IA com notas de 0 a 10.
            </p>

            {/* Directive Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#091830] border border-[#facc15]/30 text-xs text-slate-200">
              <span className="text-[#facc15] font-bold">Diretriz Executiva:</span>
              <span className="font-serif-luxury italic font-semibold text-white">Planejar • Organizar • Conquistar</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenVoiceStudio}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm sm:text-base hover:brightness-110 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#050e1d]/80 cursor-pointer"
              >
                <Mic className="w-5 h-5 text-[#050e1d]" />
                <span>Gravar e Analisar Voz</span>
                <ArrowRight className="w-4 h-4 text-[#050e1d]" />
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0f2d57] hover:bg-[#163e77] text-[#fef08a] font-bold text-sm sm:text-base border border-[#facc15]/40 transition-colors shadow-md cursor-pointer"
              >
                <Bot className="w-5 h-5 text-[#facc15]" />
                <span>Assistente Inteligente (IA)</span>
              </button>

              <button
                onClick={onStartTraining}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-[#0c2242] text-slate-200 hover:text-white font-medium text-sm sm:text-base transition-colors cursor-pointer"
              >
                <Compass className="w-5 h-5 text-[#facc15]" />
                <span>Explorar Módulos</span>
              </button>
            </div>
          </div>

          {/* Interactive Executive Speech & AI Simulator Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#071933] border-2 border-[#facc15]/35 p-5 sm:p-6 shadow-2xl shadow-[#050e1d]/90 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#facc15]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2d57] text-[#facc15] flex items-center justify-center">
                    <Mic className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
                      Simulador de Oratória Executiva
                    </p>
                    <p className="text-[10px] text-[#fef08a]">Auditoria Pedagógica com IA</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#facc15]/15 text-[#fef08a] border border-[#facc15]/30 font-semibold">
                  Ao Vivo
                </span>
              </div>

              {/* Simulated Waveform & Cadence */}
              <div className="my-5 p-4 rounded-2xl bg-[#050e1d] border border-[#facc15]/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">Análise de Ritmo Vocálico</span>
                  <span className="font-bold text-[#facc15]">142 PPM (Ideal C-Level)</span>
                </div>
                <div className="flex items-center justify-between gap-1 h-10 px-2 py-1 rounded-xl bg-[#091a33]/60">
                  {[35, 60, 45, 80, 65, 90, 50, 75, 40, 85, 95, 70, 55, 60, 80, 65, 45, 90, 75, 60, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-[#facc15]/40 to-[#facc15]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Real-time Assessment Scores */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a2040] border border-[#facc15]/25">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#facc15]" />
                    <span className="text-xs font-semibold text-white">Nota Global de Comunicação</span>
                  </div>
                  <span className="font-cinzel text-base font-extrabold text-[#fef08a]">9.6 / 10</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[#061427] border border-[#facc15]/15">
                    <p className="text-[10px] text-slate-300">Dicção</p>
                    <p className="text-xs font-bold text-white mt-0.5">9.8</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#061427] border border-[#facc15]/15">
                    <p className="text-[10px] text-slate-300">Concisão</p>
                    <p className="text-xs font-bold text-white mt-0.5">9.5</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#061427] border border-[#facc15]/15">
                    <p className="text-[10px] text-slate-300">Empatia / CNV</p>
                    <p className="text-xs font-bold text-white mt-0.5">9.6</p>
                  </div>
                </div>
              </div>

              {/* Inclusive Badges and Quick Trigger */}
              <div className="mt-4 pt-3 border-t border-[#facc15]/20 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Libras, Voz & Transcrição</span>
                </div>
                <button
                  onClick={onOpenVoiceStudio}
                  className="text-xs font-bold text-[#fef08a] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Experimentar Estúdio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip (Balanced Navy Strip) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#07152b]/95 border border-[#facc15]/25 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">0 a 10</p>
              <p className="text-xs text-slate-300 font-medium">Auditoria com IA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">4 Pilares</p>
              <p className="text-xs text-slate-300 font-medium">Estratégicos SENIA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">Tempo Real</p>
              <p className="text-xs text-slate-300 font-medium">Ritmo, Fonética & PPM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2d57] flex items-center justify-center text-[#facc15]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white font-cinzel">100% Inclusiva</p>
              <p className="text-xs text-slate-300 font-medium">Libras, Áudio & Voz</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 1 COM FUNDO BRANCO: Apresentação da Empresa SENIA */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-slate-200/90 shadow-2xl text-slate-800">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Proportionate, elegant official logo badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-2xl bg-white border border-amber-300 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                alt="Logo Oficial SENIA – Secretariado Executivo, Network e IA"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 mb-2">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Sobre a SENIA</span>
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#071933] leading-tight">
                SENIA – Secretariado Executivo, Network e Inteligência Artificial
              </h2>

              <p className="text-xs sm:text-sm text-amber-800 font-serif-luxury italic font-semibold mt-1">
                &ldquo;Desenvolvendo competências para o seu futuro&rdquo; • Planejar • Organizar • Conquistar
              </p>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-body max-w-3xl">
                A SENIA é uma iniciativa de vanguarda projetada para capacitar profissionais e estudantes de Secretariado Executivo
                para atuarem como assessores de alta performance. A <strong>Oratória Executiva Inclusiva</strong> é uma de nossas
                soluções centrais, aliando tecnologia generativa com inteligência emocional e diplomacia corporativa.
              </p>
            </div>

            {onViewCompanyProfile && (
              <div className="shrink-0 w-full md:w-auto">
                <button
                  onClick={onViewCompanyProfile}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#071933] hover:bg-[#0c2447] text-[#fef08a] font-bold text-xs sm:text-sm border border-[#facc15]/40 transition-all shadow-md cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#facc15]" />
                  <span>Conhecer Perfil da Empresa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 2 COM FUNDO CLARO: Os 4 Pilares da Marca SENIA */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
              Fundamentos da Marca
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#071933] mt-3">
              Os 4 Pilares da Identidade SENIA
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-serif-luxury italic">
              Desenvolvendo competências para o seu futuro através de Secretariado Executivo, Network e IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#071933] text-[#facc15] flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#071933] font-cinzel">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5 font-sans">
                      {pillar.tagline}
                    </p>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs text-[#071933] font-semibold gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Competência Integrada</span>
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
