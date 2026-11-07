import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Mic,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { HistoryRecord, StudentProfile } from '../types';

interface StudentDashboardProps {
  profile: StudentProfile;
  history: HistoryRecord[];
  onOpenEvaluationDetails: (record: HistoryRecord) => void;
  onStartNewTraining: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  history,
  onOpenEvaluationDetails,
  onStartNewTraining,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Calculate pillar averages across all history records
  const pillarStats = React.useMemo(() => {
    if (history.length === 0) {
      return {
        diccao: 9.0,
        tom: 8.8,
        estrutura: 8.5,
        empatia: 8.9,
        assertividade: 8.7,
      };
    }

    let diccaoSum = 0;
    let tomSum = 0;
    let estruturaSum = 0;
    let empatiaSum = 0;
    let assertividadeSum = 0;

    history.forEach((h) => {
      diccaoSum += h.evaluation.criterios.diccao_clareza.nota;
      tomSum += h.evaluation.criterios.tom_postura_executiva.nota;
      estruturaSum += h.evaluation.criterios.estrutura_concisao.nota;
      empatiaSum += h.evaluation.criterios.empatia_inclusao.nota;
      assertividadeSum += h.evaluation.criterios.assertividade_diplomatica.nota;
    });

    const count = history.length;
    return {
      diccao: Number((diccaoSum / count).toFixed(1)),
      tom: Number((tomSum / count).toFixed(1)),
      estrutura: Number((estruturaSum / count).toFixed(1)),
      empatia: Number((empatiaSum / count).toFixed(1)),
      assertividade: Number((assertividadeSum / count).toFixed(1)),
    };
  }, [history]);

  const filteredHistory = history.filter((h) => {
    if (categoryFilter === 'todos') return true;
    return h.category === categoryFilter;
  });

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'diccao':
        return 'Dicção & Pronúncia';
      case 'entrevistas':
        return 'Entrevistas de Emprego';
      case 'reunioes':
        return 'Reuniões & Governança';
      case 'comunicacao':
        return 'Comunicação Profissional';
      case 'lideranca_empatia':
        return 'Liderança & Empatia';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0b1f3d] to-[#050e1d] border border-[#facc15]/30 blue-card-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-cinzel text-2xl sm:text-3xl font-extrabold shadow-xl">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">{profile.name}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#07152b] text-[#facc15] border border-[#facc15]/40">
                  {profile.levelTitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-serif-luxury mt-1">{profile.course}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {profile.institution} • Matrícula: {profile.registration}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onStartNewTraining}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl gold-gradient-bg text-[#050e1d] font-bold text-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#050e1d]/70"
            >
              <Mic className="w-4 h-4 text-[#050e1d]" />
              <span>Novo Treino Vocal</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#07152b]/85 border border-[#facc15]/20 backdrop-blur-sm">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Média Geral C-Level</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#fef08a]">
                {profile.averageScore.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 10</span>
            </div>
            <p className="text-[10px] text-yellow-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-[#facc15]" />
              <span>Alto Desempenho</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#07152b]/85 border border-[#facc15]/20 backdrop-blur-sm">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Exercícios Concluídos</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                {profile.totalExercisesCompleted}
              </span>
              <span className="text-xs text-slate-400">sessões</span>
            </div>
            <p className="text-[10px] text-[#facc15] mt-1 font-medium">Registros de evolução</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#07152b]/85 border border-[#facc15]/20 backdrop-blur-sm">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ofensiva de Treino</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-amber-300">
                {profile.streakDays}
              </span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-300 mt-1">Dias consecutivos praticando</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#07152b]/85 border border-[#facc15]/20 backdrop-blur-sm">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Medalhas de Oratória</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#facc15]">
                {profile.badges.filter((b) => b.unlocked).length}
              </span>
              <span className="text-xs text-slate-400">/ {profile.badges.length}</span>
            </div>
            <p className="text-[10px] text-[#facc15] mt-1 font-medium">Conquistas desbloqueadas</p>
          </div>
        </div>
      </div>

      {/* 2 Columns: Radar/Pillar Competencies + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Competency Pillars Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Mapeamento das 5 Competências SENIA
              </h3>
              <p className="text-xs text-slate-300 font-serif-luxury">
                Desempenho acumulado em todas as simulações e auditorias com IA
              </p>
            </div>
            <span className="text-xs text-[#facc15] font-semibold bg-[#050e1d] px-3 py-1 rounded-full border border-[#facc15]/30">
              Métricas C-Level
            </span>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">1. Dicção, Articulação & Projeção Fonética</span>
                <span className="text-[#fef08a] font-cinzel">{pillarStats.diccao.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-[#050e1d] h-3 rounded-full overflow-hidden border border-[#facc15]/20">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${pillarStats.diccao * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">2. Tom, Postura & Serenidade Executiva</span>
                <span className="text-[#fef08a] font-cinzel">{pillarStats.tom.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-[#050e1d] h-3 rounded-full overflow-hidden border border-[#facc15]/20">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${pillarStats.tom * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">3. Estrutura Lógica, Síntese & Concisão</span>
                <span className="text-[#fef08a] font-cinzel">{pillarStats.estrutura.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-[#050e1d] h-3 rounded-full overflow-hidden border border-[#facc15]/20">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${pillarStats.estrutura * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">4. Empatia, Acolhimento & Linguagem Inclusiva (CNV)</span>
                <span className="text-[#fef08a] font-cinzel">{pillarStats.empatia.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-[#050e1d] h-3 rounded-full overflow-hidden border border-[#facc15]/20">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${pillarStats.empatia * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200">5. Assertividade Diplomática & Resolução de Atritos</span>
                <span className="text-[#fef08a] font-cinzel">{pillarStats.assertividade.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-[#050e1d] h-3 rounded-full overflow-hidden border border-[#facc15]/20">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${pillarStats.assertividade * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Badges & Honors */}
        <div className="p-6 rounded-3xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#facc15]" />
            <h3 className="font-cinzel text-lg font-bold text-white">Insígnias de Mérito</h3>
          </div>

          <div className="space-y-3">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  badge.unlocked
                    ? 'bg-[#0a2040] border-[#facc15]/40'
                    : 'bg-[#050e1d]/50 border-blue-900/30 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked ? 'gold-gradient-bg text-[#050e1d]' : 'bg-[#0d2447] text-slate-500'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white font-cinzel">{badge.title}</h4>
                    {badge.unlocked && (
                      <span className="text-[9px] uppercase font-bold text-[#facc15] px-1.5 py-0.5 rounded bg-[#050e1d] border border-[#facc15]/30">
                        Conquistada
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-body mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Exercise Records Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071933] border border-[#facc15]/25 blue-card-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-cinzel text-xl font-bold text-white">Histórico Detalhado de Auditorias</h3>
            <p className="text-xs text-slate-300 font-serif-luxury">
              Acesse qualquer simulação realizada para rever o feedback, rubricas e ouvir o modelo C-Level
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#050e1d] p-1 rounded-2xl border border-[#facc15]/20">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'diccao', label: 'Dicção' },
              { id: 'entrevistas', label: 'Entrevistas' },
              { id: 'reunioes', label: 'Reuniões' },
              { id: 'comunicacao', label: 'Comunicação' },
              { id: 'lideranca_empatia', label: 'Liderança' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'gold-gradient-bg text-[#050e1d] font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of items */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-[#050e1d] border border-[#facc15]/20">
            <BookOpen className="w-8 h-8 text-[#facc15] mx-auto mb-2 opacity-70" />
            <p className="text-sm font-semibold text-white">Nenhum exercício encontrado nesta categoria.</p>
            <p className="text-xs text-slate-400 mt-1">Inicie um treino vocal agora para registrar sua primeira nota!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenEvaluationDetails(item)}
                className="group p-4 sm:p-5 rounded-2xl bg-[#050e1d] hover:bg-[#0c2242] border border-[#facc15]/20 hover:border-[#facc15]/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#0d2447] border border-[#facc15]/30 flex flex-col items-center justify-center font-cinzel text-white shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-base font-bold text-[#fef08a]">
                      {item.evaluation.notaGeral.toFixed(1)}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Nota</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#07152b] text-[#facc15] border border-[#facc15]/30">
                        {getCategoryName(item.category)}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#facc15]" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      {item.audioWpm && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#facc15]" />
                          {item.audioWpm} PPM
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#fef08a] transition-colors mt-1 font-cinzel">
                      {item.exerciseTitle}
                    </h4>
                    <p className="text-xs text-slate-300 font-body line-clamp-1 mt-0.5">
                      "{item.studentResponse}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#facc15]/10">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-[#facc15]">Ver Auditoria Completa</p>
                    <p className="text-[10px] text-slate-400">5 critérios avaliados</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#0d2447] flex items-center justify-center text-slate-300 group-hover:text-[#facc15] group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
