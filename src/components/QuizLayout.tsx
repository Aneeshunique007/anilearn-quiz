import React from 'react';
import { Sun, Moon, GraduationCap, RotateCcw } from 'lucide-react';
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
  isReviewOpen: boolean;
  onToggleReview: () => void;
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
  isReviewOpen,
  onToggleReview,
  children,
}) => {
  const handleTabClick = (tab: QuizTab) => {
    audio.playClick();
    onSelectTab(tab);
  };

  const profileInitial = (activeProfile.name?.trim()?.[0] || activeProfile.avatar || 'A').toUpperCase();

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
          {/* Left: Brand Logo + 4-Tab Pill (Desktop) */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => handleTabClick('hiragana')}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0 text-left"
              title="AniLearn Quiz"
            >
              <div className="w-9 h-9 rounded-full bg-[#FF5E3A] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-base font-jp tracking-tighter">あ</span>
              </div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight font-heading group-hover:text-[#FF5E3A] transition-colors lg:hidden xl:inline">
                AniLearn Quiz
              </span>
            </button>

            <nav
              aria-label="Quiz Navigation"
              className={`hidden md:flex items-center p-1 rounded-full border text-xs font-semibold shadow-xs gap-0.5 ${
                theme === 'dark'
                  ? 'bg-[#17171C]/90 border-slate-800'
                  : 'bg-white/90 border-slate-200/80 shadow-2xs'
              }`}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id && !isRetrainOpen && !isReviewOpen;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
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
          </div>

          {/* Right: Circular Icon Actions (Theme, Retrain, Review, Profile) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onToggleTheme();
              }}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition cursor-pointer ${
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
              onClick={() => {
                audio.playClick();
                onToggleRetrain();
              }}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
                isRetrainOpen
                  ? 'bg-[#FF5E3A] text-white border-[#FF5E3A] shadow-md shadow-orange-500/25'
                  : 'border-[#FF5E3A]/60 bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20'
              }`}
              title="Open Retrain Hub"
              aria-label="Open Retrain Hub"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onToggleReview();
              }}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
                isReviewOpen
                  ? 'bg-[#FF5E3A] text-white border-[#FF5E3A] shadow-md shadow-orange-500/25'
                  : 'border-[#FF5E3A]/60 bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20'
              }`}
              title="Open Review Page (3-Repeat Queue)"
              aria-label="Open Review Page"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onOpenProfileModal();
              }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5E3A] to-[#FF8A65] text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-orange-500/25 hover:scale-105 transition-transform cursor-pointer"
              title={`${activeProfile.name} (${activeProfile.xp || 0} XP) — Switch / Sync Account`}
              aria-label="Open Account & Profiles"
            >
              {profileInitial}
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
            const isActive = activeTab === item.id && !isRetrainOpen && !isReviewOpen;
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
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {children}
      </main>
    </div>
  );
};
