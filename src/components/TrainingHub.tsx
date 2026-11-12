import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  Search,
  ShieldCheck,
  Users,
  Award,
  Layers,
  HeartHandshake,
  ArrowRight,
  Clock,
  CheckCircle2,
  BrainCircuit,
} from 'lucide-react';
import { ExerciseItem, ModuleCategory } from '../types';
import { EXERCISES } from '../data/mockCurriculum';
import { api } from '../services/api';

interface TrainingHubProps {
  onSelectExercise: (exercise: ExerciseItem) => void;
  onOpenVoiceStudio: () => void;
}

export const TrainingHub: React.FC<TrainingHubProps> = ({
  onSelectExercise,
  onOpenVoiceStudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [customExercises, setCustomExercises] = useState<ExerciseItem[]>([]);

  const allExercises = [...customExercises, ...EXERCISES];

  const filteredExercises = allExercises.filter((ex) => {
    const matchesCategory = selectedCategory === 'todos' || ex.category === selectedCategory;
    const matchesQuery =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = [
    { id: 'todos', label: 'Todos os Módulos', icon: Layers, count: allExercises.length },
    {
      id: 'diccao',
      label: '1. Dicção & Pronúncia',
      icon: Mic,
      count: allExercises.filter((e) => e.category === 'diccao').length,
    },
    {
      id: 'entrevistas',
      label: '2. Entrevistas Executivas',
      icon: ShieldCheck,
      count: allExercises.filter((e) => e.category === 'entrevistas').length,
    },
    {
      id: 'reunioes',
      label: '3. Reuniões & Governança',
      icon: Users,
      count: allExercises.filter((e) => e.category === 'reunioes').length,
    },
    {
      id: 'comunicacao',
      label: '4. Comunicação & Redação',
      icon: Award,
      count: allExercises.filter((e) => e.category === 'comunicacao').length,
    },
    {
      id: 'lideranca_empatia',
      label: '5. Liderança, Empatia & CNV',
      icon: HeartHandshake,
      count: allExercises.filter((e) => e.category === 'lideranca_empatia').length,
    },
  ];

  const handleGenerateCustomScenario = async () => {
    setIsGeneratingScenario(true);
    try {
      const categoryName =
        selectedCategory === 'todos' ? 'Simulação de Reunião com Alta Diretoria' : selectedCategory;
      const res = await api.generateScenario(categoryName, 'Avançado');

      const newExercise: ExerciseItem = {
        id: `custom-${Date.now()}`,
        category: (selectedCategory === 'todos' ? 'reunioes' : selectedCategory) as ModuleCategory,
        title: res.titulo || 'Cenário Inédito de Governança',
        subtitle: `Desafio formulado pela IA: ${res.empresaContexto || 'Holding Empresarial'}`,
        level: 'Master Executivo',
        scenario: `${res.dilema}\n\nPersonagens envolvidos: ${(res.personagens || []).join(', ')}.`,
        roleContext: 'Secretário(a) Executivo(a) C-Level em plantão de crise.',
        instructions: [
          res.instrucaoFala || 'Responda com postura sóbria, respeitando as prioridades do conselho.',
          'Articule com clareza a proposta de encaminhamento.',
          'Mantenha ritmo entre 130 e 150 PPM.',
        ],
        expectedCompetencies: res.criteriosSucesso || [
          'Assertividade executiva',
          'Inteligência emocional',
          'Liderança mediadora',
        ],
        sampleAudioPrompt: res.instrucaoFala,
        recommendedDurationSeconds: res.tempoRecomendadoSegundos || 60,
      };

      setCustomExercises([newExercise, ...customExercises]);
      onSelectExercise(newExercise);
      onOpenVoiceStudio();
    } catch (err) {
      console.error('Error generating scenario:', err);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hub Hero Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0b203f] to-[#050e1d] border border-[#facc15]/30 blue-card-glow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07152b] border border-[#facc15]/30 text-xs font-semibold text-[#fef08a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
            <span>Matriz Pedagógica de Secretariado Executivo</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Módulos de Treinamento Executivo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif-luxury mt-1 max-w-2xl">
            Escolha um desafio corporativo real para praticar sua oratória, dicção, inteligência emocional e liderança.
            Grave sua fala para receber uma auditoria com nota de 0 a 10.
          </p>
        </div>

        {/* Generate Dynamic Scenario AI Button */}
        <button
          onClick={handleGenerateCustomScenario}
          disabled={isGeneratingScenario}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl gold-gradient-bg text-[#050e1d] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#050e1d]/70 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isGeneratingScenario ? (
            <>
              <Sparkles className="w-4 h-4 text-[#050e1d] animate-spin" />
              <span>Criando Cenário Inédito com IA...</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4 text-[#050e1d]" />
              <span>Gerar Desafio Inédito com IA</span>
            </>
          )}
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Horizontal Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'gold-gradient-bg text-[#050e1d] shadow-md font-bold'
                    : 'bg-[#071933] text-slate-300 hover:text-white hover:bg-[#0d274f] border border-[#facc15]/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#050e1d]' : 'text-[#facc15]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#050e1d]/20 text-[#050e1d]' : 'bg-[#050e1d] text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#facc15] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por termo ou cenário..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#071933] border border-[#facc15]/25 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15]/60"
          />
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          return (
            <div
              key={exercise.id}
              className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {exercise.level}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{exercise.recommendedDurationSeconds}s</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-[#071933] group-hover:text-amber-800 transition-colors leading-snug">
                  {exercise.title}
                </h3>
                <p className="text-xs text-amber-700 font-serif-luxury italic mt-1 font-semibold">{exercise.subtitle}</p>

                <p className="text-xs text-slate-600 font-body leading-relaxed mt-3 line-clamp-3">
                  {exercise.scenario}
                </p>

                {/* Expected Competencies */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Competências:</p>
                  <div className="space-y-1">
                    {exercise.expectedCompetencies.slice(0, 2).map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium truncate">{exercise.roleContext}</span>
                <button
                  onClick={() => {
                    onSelectExercise(exercise);
                    onOpenVoiceStudio();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#071933] hover:bg-[#0c2447] text-[#fef08a] font-bold text-xs transition-all cursor-pointer shadow-sm group-hover:scale-105 shrink-0"
                >
                  <Mic className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Treinar Agora</span>
                  <ArrowRight className="w-3 h-3 text-[#facc15]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
