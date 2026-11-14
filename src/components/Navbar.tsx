import React from 'react';
import {
  Sparkles,
  Mic,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
  Accessibility,
  Ear,
  Eye,
  Building2,
} from 'lucide-react';
import { AccessibilitySettings } from '../services/api';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'hub' | 'studio' | 'dashboard' | 'company';
  onSelectTab: (tab: 'home' | 'hub' | 'studio' | 'dashboard' | 'company') => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  profile: StudentProfile;
  onOpenAccessibilityModal: () => void;
  onOpenLibrasModal: () => void;
  onDescribeScreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  accessibility,
  onUpdateAccessibility,
  profile,
  onOpenAccessibilityModal,
  onOpenLibrasModal,
  onDescribeScreen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleFontSize = () => {
    const nextLevel = (accessibility.fontSizeLevel + 1) % 3;
    onUpdateAccessibility({ fontSizeLevel: nextLevel });
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: GraduationCap, shortcut: 'Alt+1' },
    { id: 'company', label: 'Perfil da Empresa', icon: Building2, shortcut: 'Alt+3' },
    { id: 'hub', label: 'Módulos', icon: Sparkles, shortcut: 'Alt+4' },
    { id: 'studio', label: 'Estúdio de Voz', icon: Mic, shortcut: 'Alt+5' },
    { id: 'dashboard', label: 'Evolução', icon: LayoutDashboard, shortcut: 'Alt+6' },
  ] as const;

  return (
    <>
      {/* Skip to Main Content Link for screen readers and keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#facc15] focus:text-[#050e1d] focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-white"
      >
        Pular para o conteúdo principal (Atalho)
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 bg-[#050e1d]/95 backdrop-blur-md border-b border-[#facc15]/20 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand Identity */}
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 sm:gap-3.5 group text-left focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none rounded-xl p-1 cursor-pointer shrink-0"
              aria-label="Ir para a Página Inicial da SENIA – Secretariado Executivo, Network e IA"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 p-1 rounded-xl bg-white border border-[#facc15]/60 shadow-md group-hover:scale-105 group-hover:border-[#facc15] transition-all duration-300 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_11.30.04_AM__1__a3f09429.jpeg"
                  alt="Logo Oficial SENIA – Secretariado Executivo, Network e IA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-senia text-2xl sm:text-3xl font-extrabold tracking-wider gold-gradient-text leading-none">
                    SENIA
                  </span>
                  <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#10294e] text-[#fef08a] border border-[#facc15]/30 whitespace-nowrap">
                    Secretariado • Network • IA
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 tracking-wide font-medium leading-tight mt-0.5">
                  Oratória Executiva Inclusiva
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navegação Principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={`${item.label} (${item.shortcut})`}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none ${
                      isActive
                        ? 'bg-[#0f2d57] text-[#fef9c3] border border-[#facc15]/40 gold-glow shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#0c2242]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#facc15]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Accessibility Hub + Libras + Audio Description */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Libras Direct Quick Button */}
              <button
                onClick={onOpenLibrasModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0d2447] hover:bg-[#133361] text-xs font-bold text-[#fef08a] border border-[#facc15]/30 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none shadow-sm"
                title="Abrir Dicionário e Guia em Libras (Alt+L)"
                aria-label="Abrir Dicionário e Guia em Libras"
              >
                <span className="text-sm">🤟</span>
                <span className="hidden sm:inline">Libras</span>
              </button>

              {/* Audio Description Button */}
              <button
                onClick={onDescribeScreen}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0d2447] hover:bg-[#133361] text-xs font-semibold text-slate-200 hover:text-white border border-[#facc15]/30 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none"
                title="Ouvir descrição em áudio da tela atual (Alt+D)"
                aria-label="Ouvir áudio-descrição da tela"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#facc15]" />
                <span className="hidden md:inline">Descrever Tela</span>
              </button>

              {/* Central Accessibility Modal Trigger */}
              <button
                onClick={onOpenAccessibilityModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gold-gradient-bg text-[#050e1d] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-md focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                title="Abrir Central Completa de Acessibilidade (Alt+A)"
                aria-label="Abrir Central de Acessibilidade"
              >
                <Accessibility className="w-4 h-4 text-[#050e1d]" />
                <span className="hidden sm:inline">Acessibilidade</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0c2242] focus-visible:ring-4 focus-visible:ring-[#facc15] focus-visible:outline-none"
                aria-label="Abrir menu de navegação"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#07152b] border-b border-[#facc15]/30 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f2d57] text-[#fef9c3] border border-[#facc15]/50'
                      : 'text-slate-300 hover:bg-[#0c2242] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#facc15]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.shortcut}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
