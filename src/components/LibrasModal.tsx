import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Eye,
  HandMetal,
  Volume2,
} from 'lucide-react';
import { LIBRAS_EXECUTIVE_DICTIONARY, LibrasTerm } from '../data/librasDictionary';
import { speakText } from '../services/api';

interface LibrasModalProps {
  onClose: () => void;
}

export const LibrasModal: React.FC<LibrasModalProps> = ({ onClose }) => {
  const [selectedTerm, setSelectedTerm] = useState<LibrasTerm>(LIBRAS_EXECUTIVE_DICTIONARY[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = LIBRAS_EXECUTIVE_DICTIONARY.filter((item) =>
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeakTerm = (term: LibrasTerm) => {
    speakText(
      `Termo em Libras: ${term.word}. Contexto: ${term.context}. Descrição do sinal: ${term.signalDescription}. Configuração de mão: ${term.handshape}. Movimento: ${term.movement}.`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="libras-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl bg-[#071933] rounded-3xl border-2 border-[#facc15]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#050e1d] via-[#0d2447] to-[#050e1d] border-b border-[#facc15]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gold-gradient-bg flex items-center justify-center text-[#050e1d] font-bold text-lg shadow-md">
              🤟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="libras-modal-title" className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Central & Dicionário em Libras – Secretariado Executivo
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#050e1d] text-[#facc15] border border-[#facc15]/30">
                  Língua Brasileira de Sinais
                </span>
              </div>
              <p className="text-xs text-[#fef08a] font-serif-luxury">
                Acessibilidade comunicacional, dactilologia e terminologia executiva oficial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0d2447] transition-colors cursor-pointer"
            aria-label="Fechar guia de Libras"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 text-slate-100">
          {/* Left Column: Search & Terms List */}
          <div className="md:col-span-1 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#facc15] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar termo em Libras..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050e1d] border border-[#facc15]/25 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15]"
              />
            </div>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredTerms.map((term) => {
                const isSelected = selectedTerm.id === term.id;
                return (
                  <button
                    key={term.id}
                    onClick={() => setSelectedTerm(term)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'gold-gradient-bg text-[#050e1d] font-bold shadow-md'
                        : 'bg-[#050e1d] text-slate-200 hover:bg-[#0d274f] border border-[#facc15]/15'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">{term.word}</p>
                      <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-[#050e1d]/80' : 'text-slate-400'}`}>
                        {term.context}
                      </p>
                    </div>
                    <span className="text-sm">🤟</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Sign Visualizer & Descriptions */}
          <div className="md:col-span-2 space-y-5">
            {/* Visual Avatar / Hands Card */}
            <div className="p-6 rounded-2xl bg-[#050e1d] border border-[#facc15]/30 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#facc15]">
                    Glossário Corporativo Inclusivo
                  </span>
                  <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {selectedTerm.word}
                  </h4>
                  <p className="text-xs text-slate-300 font-serif-luxury mt-1">{selectedTerm.context}</p>
                </div>

                <button
                  onClick={() => handleSpeakTerm(selectedTerm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d2447] text-[#fef08a] hover:bg-[#133361] border border-[#facc15]/30 text-xs font-semibold cursor-pointer shrink-0"
                  title="Ouvir descrição completa do sinal"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Ouvir Descrição</span>
                </button>
              </div>

              {/* Graphic Representation / Animated Avatar Simulation */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#071933] via-[#091f3d] to-[#071933] border border-[#facc15]/20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full gold-gradient-bg flex items-center justify-center text-4xl shadow-lg mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  🤟
                </div>
                <p className="text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                  Guia do Sinal em Libras
                </p>
                <p className="text-sm text-slate-200 mt-2 font-body max-w-lg leading-relaxed">
                  "{selectedTerm.signalDescription}"
                </p>
              </div>

              {/* Dactylology (Manual Alphabet Letters) */}
              <div className="mt-5 pt-4 border-t border-[#facc15]/15">
                <p className="text-[11px] uppercase font-bold text-[#facc15] mb-2">
                  Dactilologia (Soletração Manual em Libras):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTerm.spellingDactylology.map((letter, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg bg-[#0d2447] border border-[#facc15]/30 flex items-center justify-center text-xs font-bold text-[#fef08a] shadow-inner font-mono"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Specifications of the Sign */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#facc15] block">
                  Configuração de Mão
                </span>
                <p className="text-xs text-slate-200 mt-1">{selectedTerm.handshape}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#facc15] block">
                  Movimento & Ponto
                </span>
                <p className="text-xs text-slate-200 mt-1">{selectedTerm.movement}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050e1d] border border-[#facc15]/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#facc15] block">
                  Expressão Facial
                </span>
                <p className="text-xs text-slate-200 mt-1">{selectedTerm.facialExpression}</p>
              </div>
            </div>

            {/* Secretarial Inclusion Tip */}
            <div className="p-4 rounded-xl bg-[#0a2040] border border-blue-400/30 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#facc15] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-200">
                <strong className="text-[#fef08a] block mb-0.5">
                  Diretriz de Inclusão no Secretariado C-Level:
                </strong>
                Ao planejar reuniões de conselho com participantes surdos, garanta a presença do intérprete de Libras
                em ângulo visível, compartilhe pautas e termos técnicos antecipadamente e mantenha iluminação frontal
                adequada sem contra-luz.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#050e1d] border-t border-[#facc15]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-[#050e1d] text-xs sm:text-sm font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            Entendido e Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
