import React from 'react';
import {
  ArrowRight,
  Languages,
  Sparkles,
  BookA,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { QuizProfile, profileStore } from '../utils/profileStore';
import { ALL_JLPT_KANJI_DATABASE } from '../data/kanjiDatabase';
import { ALL_JLPT_WORDS_DATABASE } from '../data/wordsDatabase';
import audio from '../utils/audio';

interface QuizHomeViewProps {
  profile: QuizProfile;
  theme: 'dark' | 'light';
  onSelectQuiz: (tab: 'hiragana' | 'katakana' | 'kanji' | 'words') => void;
  onOpenRetrain: () => void;
  onOpenReview: () => void;
}

export const QuizHomeView: React.FC<QuizHomeViewProps> = ({
  profile,
  theme,
  onSelectQuiz,
  onOpenRetrain,
  onOpenReview,
}) => {
  const learnedSummary = profileStore.getProfileMasteredSummary(profile.id);

  const reviewCount = (['hiragana', 'katakana', 'kanji', 'words'] as const).reduce((acc, key) => {
    const saved = profileStore.loadQuizState<unknown, unknown>(profile.id, key);
    const repeats = saved?.repeatCounts || {};
    return acc + Object.values(repeats).filter((c) => c > 0).length;
  }, 0);

  const totalLearned =
    learnedSummary.hiragana +
    learnedSummary.katakana +
    learnedSummary.kanji +
    learnedSummary.words;

  const surfaceClass =
    theme === 'dark'
      ? 'bg-[#17171C] border-slate-800 text-white'
      : 'bg-white border-slate-200/80 text-[#1A1A1F] shadow-sm';

  const quizCards: Array<{
    id: 'hiragana' | 'katakana' | 'kanji' | 'words';
    title: string;
    jp: string;
    subtitle: string;
    learned: number;
    total: number;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'hiragana',
      title: 'Hiragana Quiz',
      jp: 'あいう',
      subtitle: 'Basic, Dakuten & Yoon',
      learned: learnedSummary.hiragana,
      total: 104,
      icon: Languages,
    },
    {
      id: 'katakana',
      title: 'Katakana Quiz',
      jp: 'アイウ',
      subtitle: 'Basic, Dakuten & Yoon',
      learned: learnedSummary.katakana,
      total: 104,
      icon: Sparkles,
    },
    {
      id: 'kanji',
      title: 'Kanji Quiz',
      jp: '漢字',
      subtitle: 'JLPT N5–N3 & Workbook Days 1–27',
      learned: learnedSummary.kanji,
      total: ALL_JLPT_KANJI_DATABASE.length,
      icon: BookA,
    },
    {
      id: 'words',
      title: 'Words Quiz',
      jp: '単語',
      subtitle: 'JLPT N5–N3 Vocabulary',
      learned: learnedSummary.words,
      total: ALL_JLPT_WORDS_DATABASE.length,
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className={`rounded-3xl border p-5 sm:p-6 ${surfaceClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E3A]">
              <Sparkles className="w-3.5 h-3.5" />
              AniLearn Quiz · 日本語
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Welcome back, {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Choose a quiz below or from the top bar to start practicing.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-[#FF5E3A]/10 border border-[#FF5E3A]/25 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF5E3A] flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" />
                Total XP
              </div>
              <div className="text-lg font-extrabold font-heading">{profile.xp || 0}</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                Mastered
              </div>
              <div className="text-lg font-extrabold font-heading">{totalLearned}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quiz Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quizCards.map((card) => {
          const Icon = card.icon;
          const pct = card.total > 0 ? Math.min(100, Math.round((card.learned / card.total) * 100)) : 0;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                audio.playClick();
                onSelectQuiz(card.id);
              }}
              className={`group rounded-2xl border p-4 text-left transition hover:border-[#FF5E3A]/70 cursor-pointer space-y-3 ${surfaceClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF5E3A]/12 text-[#FF5E3A] flex items-center justify-center font-jp font-black text-lg shrink-0 group-hover:bg-[#FF5E3A] group-hover:text-white transition">
                    {card.jp}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold font-heading group-hover:text-[#FF5E3A] transition">
                      {card.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#FF5E3A] transition shrink-0 mt-1" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>
                    {card.learned} / {card.total} learned
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#FF5E3A] font-bold">
                    Start
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#FF5E3A] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Retrain Hub & Review Queue Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onOpenRetrain();
          }}
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition hover:border-[#FF5E3A]/70 cursor-pointer ${surfaceClass}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#FF5E3A]/60 bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold font-heading">Retrain Hub</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {totalLearned} learned in 25-item sets
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#FF5E3A] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onOpenReview();
          }}
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition hover:border-[#FF5E3A]/70 cursor-pointer ${surfaceClass}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#FF5E3A]/60 bg-[#FF5E3A]/10 text-[#FF5E3A] flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold font-heading">Review Queue</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {reviewCount} item{reviewCount === 1 ? '' : 's'} in 3-repeat queue
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#FF5E3A] shrink-0" />
        </button>
      </div>
    </div>
  );
};
