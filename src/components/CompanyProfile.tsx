import React from 'react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Users,
  TrendingUp,
  Award,
  Mic,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  Compass,
  ArrowRight,
  Eye,
  Ear,
  Cpu,
} from 'lucide-react';

interface CompanyProfileProps {
  onStartTraining: () => void;
  onOpenVoiceStudio: () => void;
}

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  onStartTraining,
  onOpenVoiceStudio,
}) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Profissionalismo',
      tagline: 'Ética & Governança C-Level',
      description:
        'Postura corporativa impecável, discrição absoluta, etiqueta internacional e domínio dos ritos e protocolos que regem a alta administração.',
    },
    {
      icon: Cpu,
      title: 'Inovação',
      tagline: 'IA Integrada ao Secretariado',
      description:
        'Pioneirismo no uso de Inteligência Artificial para análise fonética em tempo real, redação executiva e automação inteligente de rotinas.',
    },
    {
      icon: Users,
      title: 'Conexões',
      tagline: 'Network & Diplomacia',
      description:
        'Desenvolvimento de redes de relacionamento de alto valor, mediação de conflitos, Comunicação Não-Violenta (CNV) e pontes multissetoriais.',
    },
    {
      icon: TrendingUp,
      title: 'Resultados',
      tagline: 'Planejar • Organizar • Conquistar',
      description:
        'Comunicação persuasiva, concisa e orientada a decisões estratégicas de alto impacto, garantindo entregas consistentes e mensuráveis.',
    },
  ];

  const accessibilityCommitments = [
    {
      icon: Ear,
      title: 'Acessibilidade para Pessoas Surdas',
      items: [
        'Dicionário corporativo integrado em Libras (Língua Brasileira de Sinais)',
        'Legendas sincronizadas em tempo real para todas as falas da IA',
        'Transcrição automática do áudio gravado nos treinos e exercícios',
        'Instruções e feedback 100% visuais em texto estruturado',
      ],
    },
    {
      icon: Eye,
      title: 'Acessibilidade para Pessoas Cegas ou Baixa Visão',
      items: [
        'Compatibilidade total com leitores de tela (normas ARIA e WCAG 2.1)',
        'Áudio-descrição dos elementos visuais e cenários corporativos',
        'Navegação completa por comandos de voz e atalhos de teclado (mãos livres)',
        'Feedback sonoro detalhado das auditorias avaliativas e sintetizador de voz',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Institutional Header Card (Executive Deep Navy with Golden Glow) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#071933] via-[#092248] to-[#050e1d] border-2 border-[#facc15]/35 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#facc15]/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Official Logo in Proportionate, Crisp White Scale */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 p-2 rounded-2xl bg-white border-2 border-[#facc15]/70 shadow-xl flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
              alt="Logo Oficial SENIA – Secretariado Executivo, Network e IA"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050e1d]/80 border border-[#facc15]/40 text-xs font-semibold text-[#fef08a] mb-2.5">
              <Building2 className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Perfil Institucional da Empresa</span>
            </div>

            <h1 className="font-senia text-3xl sm:text-5xl font-black text-white tracking-wider leading-tight">
              SENIA
            </h1>
            <p className="text-sm sm:text-base text-[#fef08a] font-semibold mt-1 font-sans">
              Secretariado Executivo, Network e Inteligência Artificial
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2">
              &ldquo;Desenvolvendo competências para o seu futuro.&rdquo;
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-[#0f2d57] text-[#fef08a] border border-[#facc15]/30 text-xs font-medium">
                Solução Principal: Oratória Executiva Inclusiva
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#07152b] text-slate-200 border border-[#facc15]/20 text-xs font-medium">
                Planejar • Organizar • Conquistar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1 COM FUNDO BRANCO: Quem Somos, Missão & Visão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col justify-between text-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Quem Somos & Origem</span>
            </div>
            <h2 className="font-heading text-2xl font-semibold text-[#071933] mb-4">
              A Nova Fronteira do Secretariado Executivo
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
              <p>
                A <strong className="text-[#071933] font-semibold">SENIA</strong> é uma iniciativa educacional e tecnológica que nasceu
                para suprir a necessidade de uma formação de excelência para o <strong>Secretariado Executivo</strong> em um mundo
                acelerado por redes complexas de governança e pela <strong>Inteligência Artificial</strong>.
              </p>
              <p>
                Historicamente posicionado no coração das organizações, o profissional de secretariado executivo atua hoje como
                assessor estratégico direto de conselhos de administração, comitês executivos e presidências. Para liderar nesse
                cenário, a voz, o protocolo, a empatia e a fluência tecnológica tornaram-se competências indispensáveis.
              </p>
              <p>
                Com a <strong>Oratória Executiva Inclusiva</strong> como sua solução prioritária, a SENIA proporciona um ambiente
                prático de simulação onde o aluno treina com IA, recebe avaliações com notas de 0 a 10 e aprimora sua autoridade
                diplomática com respeito total à diversidade humana.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Foco em Competências C-Level</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Auditoria Rigorosa com IA</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Conformidade Ética & Inclusiva</span>
            </span>
          </div>
        </div>

        {/* Missão, Visão e Diretriz (Cards Brancos com Acentos Azuis e Dourados) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
            <h3 className="text-xs font-bold text-amber-800 font-heading uppercase tracking-wider flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Missão Institucional</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
              Capacitar estudantes e profissionais de Secretariado Executivo para atuar com autoridade serena, eloquência inclusiva
              e domínio prático de IA, transformando a comunicação em instrumento de liderança e impacto.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
            <h3 className="text-xs font-bold text-amber-800 font-heading uppercase tracking-wider flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Visão de Futuro</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
              Consolidar-se como o ecossistema educacional de referência no desenvolvimento de competências humanas e tecnológicas
              integradas ao Secretariado Executivo e à alta gestão empresarial.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071933] border border-[#facc15]/40 text-center text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fef08a] mb-1">
              Diretriz Prática de Ação
            </p>
            <p className="text-base sm:text-lg font-heading font-semibold text-white tracking-wide">
              Planejar • Organizar • Conquistar
            </p>
            <p className="text-xs text-amber-200/80 font-medium mt-1">
              O método SENIA aplicado em cada simulação corporativa.
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2 COM FUNDO CLARO: Os 4 Pilares da Empresa */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-lg">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            Pilares de Excelência
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#071933] mt-3">
            Os 4 Pilares da Marca SENIA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            Valores inegociáveis que orientam cada módulo e interação pedagógica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#071933] text-[#facc15] flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#071933] font-heading">{pillar.title}</h3>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">{pillar.tagline}</p>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#071933] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Padrão Corporativo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 3: A Solução: Oratória Executiva Inclusiva (Fundo Branco Equilibrado) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-slate-200 shadow-xl text-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-xs font-bold text-amber-900 border border-amber-200 mb-3">
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>Solução Integrada SENIA</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#071933]">
            Oratória Executiva Inclusiva
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
            A oratória é mais do que técnicas vocais: no Secretariado Executivo, ela é a capacidade de mediar conversas de alto
            nível, transmitir sínteses precisas sob pressão, manter serenidade em momentos de crise e garantir que todas as vozes
            sejam ouvidas e respeitadas.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <p className="font-heading text-base font-semibold text-[#071933]">1. Dicção & Fonética</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Exercícios direcionados de articulação, ritmo ideal (130-150 PPM) e eliminação de vícios de linguagem.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <p className="font-heading text-base font-semibold text-[#071933]">2. Simulações C-Level</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Cenários imersivos de ata sob pressão, entrevistas de assessoria internacional e mediação de crises.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <p className="font-heading text-base font-semibold text-[#071933]">3. Avaliação de 0 a 10</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Critérios rigorosos de clareza, concisão, empatia, assertividade e inteligência emocional com feedback imediato.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenVoiceStudio}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#050e1d]" />
            <span>Treinar no Estúdio de Voz</span>
            <ArrowRight className="w-4 h-4 text-[#050e1d]" />
          </button>

          <button
            onClick={onStartTraining}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#071933] font-semibold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#071933]" />
            <span>Ver Módulos de Treinamento</span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 4: Compromisso com Inclusão & Acessibilidade (Fundo Branco Suave) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-md">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200 mb-2">
          <HeartHandshake className="w-4 h-4 text-amber-600" />
          <span>Acessibilidade Universal & Compromisso Social</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#071933] mb-2">
          Inclusão que Abraça Todas as Potencialidades
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-3xl mb-6">
          A SENIA foi estruturada desde o primeiro dia para que ninguém seja deixado para trás. Nossas tecnologias pedagógicas
          atendem aos mais rigorosos padrões de acessibilidade visual, auditiva e motora.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessibilityCommitments.map((acc, idx) => {
            const Icon = acc.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#071933] text-[#facc15] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[#071933]">{acc.title}</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {acc.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
