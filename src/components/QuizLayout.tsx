import React, { useState } from 'react';
import { Sun, Moon, Menu, X, RotateCcw } from 'lucide-react';
import audio from '../utils/audio';
import { QuizProfile } from '../utils/profileStore';

export type QuizTab = 'hiragana' | 'katakana' | 'kanji' | 'words';

interface QuizLayoutProps {
  activeTab: QuizTab;
  onSelectTab: (tab: QuizTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeProfile: QuizProfile;
  onOpenProfileModal: () => void;
  isRetrainOpen: boolean;
  onToggleRetrain: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{ id: QuizTab; label: string }> = [
  { id: 'hiragana', label: 'Hiragana Quiz' },
  { id: 'katakana', label: 'Katakana Quiz' },
  { id: 'kanji', label: 'Kanji Quiz' },
  { id: 'words', label: 'Words Quiz' },
];

export const QuizLayout: React.FC<QuizLayoutProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  activeProfile,
  onOpenProfileModal,
  isRetrainOpen,
  onToggleRetrain,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: QuizTab) => {
    audio.playClick();
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors relative overflow-x-hidden selection:bg-[#FF5E3A] selection:text-white ${
        theme === 'dark' ? 'bg-[#0E0E12] text-slate-100' : 'bg-[#FAF7F5] text-[#1A1A1F]'
      }`}
    >
      {/* Soft Warm Radial Glow matching AniLearn */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] lg:w-[900px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-[#FF5E3A]/15 via-[#FFA07A]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* TOP STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#0E0E12]/90 border-slate-800'
            : 'bg-[#FAF7F5]/90 border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Left: Brand Logo */}
          <button
            type="button"
            onClick={() => handleTabClick('hiragana')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF5E3A] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-base font-jp tracking-tighter">あ</span>
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight font-heading group-hover:text-[#FF5E3A] transition-colors">
              AniLearn Quiz{' '}
              <span className="text-[#FF5E3A] text-[10px] sm:text-xs font-semibold uppercase ml-0.5 tracking-wider hidden sm:inline">
                日本語
              </span>
            </span>
          </button>

          {/* Center: 4 Quiz Headings Only (Desktop) */}
          <nav
            aria-label="Quiz Navigation"
            className={`hidden md:flex items-center p-1 rounded-full border text-xs sm:text-sm font-semibold shadow-xs gap-1 ${
              theme === 'dark'
                ? 'bg-[#17171C]/90 border-slate-800'
                : 'bg-white/90 border-slate-200/80 shadow-2xs'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`px-4 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FF5E3A] text-white shadow-sm shadow-orange-500/25 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#FF5E3A] hover:bg-orange-500/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Retrain Button + Profile Pill + Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onToggleRetrain();
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isRetrainOpen
                  ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                  : theme === 'dark'
                    ? 'bg-[#17171C] border-slate-800 text-slate-200 hover:border-[#FF5E3A]/60'
                    : 'bg-white border-slate-200 text-[#1A1A1F] hover:border-[#FF5E3A]/60'
              }`}
              title="Open Retrain Hub"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Retrain</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onOpenProfileModal();
              }}
              className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#17171C] border-slate-800 text-slate-100 hover:border-[#FF5E3A]/60'
                  : 'bg-white border-slate-200 text-[#1A1A1F] hover:border-[#FF5E3A]/60'
              }`}
              title="Switch or create learner profile"
            >
              <span className="text-sm leading-none">{activeProfile.avatar}</span>
              <span className="max-w-[80px] sm:max-w-[110px] truncate">{activeProfile.name}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FF5E3A]/15 text-[#FF5E3A]">
                {activeProfile.xp || 0} XP
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onToggleTheme();
              }}
              aria-label="Toggle theme"
              className={`p-2 rounded-xl border transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#17171C] border-slate-800 text-amber-400 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className={`md:hidden p-2 rounded-xl border transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#17171C] border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile 4-Tab Bar (fits without horizontal scroll) */}
        <nav
          aria-label="Mobile Quiz Navigation"
          className={`md:hidden border-t px-2 py-1.5 grid grid-cols-4 gap-1 ${
            theme === 'dark'
              ? 'bg-[#0E0E12]/95 border-slate-800'
              : 'bg-[#FAF7F5]/95 border-slate-200/80'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`px-1.5 py-1.5 rounded-full text-[11px] font-semibold text-center truncate transition cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5E3A] text-white font-bold shadow-xs'
                    : theme === 'dark'
                      ? 'bg-[#17171C] text-slate-300 border border-slate-800'
                      : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {item.label.replace(' Quiz', '')}
              </button>
            );
          })}
        </nav>

        {/* Mobile Dropdown Menu (4 Quiz Headings Only) */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t px-4 py-3 flex flex-col gap-1.5 ${
              theme === 'dark'
                ? 'bg-[#17171C] border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FF5E3A] text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-[#FF5E3A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {children}
      </main>
    </div>
  );
};
