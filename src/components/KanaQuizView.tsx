import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  FileText,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_DATA, KATAKANA_DATA, KanaChar } from '../data/kanaData';
import { getKanaDetails, KanaDetailsData } from '../data/kanaWords';
import { KanaDetailModal } from './KanaDetailModal';
import audio from '../utils/audio';

interface KanaQuizViewProps {
  script: 'hiragana' | 'katakana';
  theme: 'dark' | 'light';
}

type CategoryFilter = 'all' | 'basic' | 'dakuten' | 'yoon';
type PoolSize = 10 | 30 | 'all';

interface QuestionItem {
  char: string;
  romaji: string;
  scriptLabel: 'Hiragana' | 'Katakana';
  options: string[];
}

export const KanaQuizView: React.FC<KanaQuizViewProps> = ({ script, theme }) => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [poolSize, setPoolSize] = useState<PoolSize>(10);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [initialTotal, setInitialTotal] = useState<number>(10);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeKanaDetail, setActiveKanaDetail] = useState<KanaDetailsData | null>(null);

  const scriptTitle = script === 'hiragana' ? 'Hiragana' : 'Katakana';

  const sourcePool = useMemo<KanaChar[]>(() => {
    const group = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    if (category === 'basic') return group.basic;
    if (category === 'dakuten') return group.dakuten;
    if (category === 'yoon') return group.yoon;
    return [...group.basic, ...group.dakuten, ...group.yoon];
  }, [script, category]);

  const allRomajis = useMemo(() => {
    const group = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    return Array.from(
      new Set([...group.basic, ...group.dakuten, ...group.yoon].map((k) => k.romaji))
    );
  }, [script]);

  const generateQuestions = useCallback(() => {
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
    const count = poolSize === 'all' ? shuffled.length : Math.min(poolSize, shuffled.length);
    const chosen = shuffled.slice(0, count);

    const items: QuestionItem[] = chosen.map((item) => {
      const distractors = allRomajis
        .filter((r) => r !== item.romaji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [item.romaji, ...distractors].sort(() => 0.5 - Math.random());
      return {
        char: item.char,
        romaji: item.romaji,
        scriptLabel: script === 'hiragana' ? 'Hiragana' : 'Katakana',
        options,
      };
    });

    setQuestions(items);
    setInitialTotal(items.length);
    setMasteredCount(0);
    setRepeatCount(0);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  }, [sourcePool, allRomajis, poolSize, script]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = isAnswered && selectedOption === currentQuestion?.romaji;
  const progressPercent = initialTotal > 0 ? Math.round((masteredCount / initialTotal) * 100) : 0;

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option === currentQuestion.romaji;
    if (correct) {
      audio.playCorrect();
      setMasteredCount((prev) => prev + 1);
    } else {
      audio.playWrong();
      setRepeatCount((prev) => prev + 1);
      // Spaced repeat: re-insert missed character later in queue
      const insertOffset = Math.min(3, questions.length - currentIndex);
      const clone = [...questions];
      clone.splice(currentIndex + insertOffset, 0, {
        ...currentQuestion,
        options: [...currentQuestion.options].sort(() => 0.5 - Math.random()),
      });
      setQuestions(clone);
    }
  };

  const handleNext = () => {
    audio.playClick();
    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true);
      audio.playFanfare();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleOpenDetails = () => {
    if (!currentQuestion) return;
    audio.playClick();
    const details = getKanaDetails(
      currentQuestion.char,
      currentQuestion.romaji,
      currentQuestion.scriptLabel
    );
    setActiveKanaDetail(details);
    setDetailModalOpen(true);
  };

  const surfaceClass =
    theme === 'dark'
      ? 'bg-[#17171C] border-slate-800 text-white'
      : 'bg-white border-slate-200/80 text-[#1A1A1F] shadow-sm';

  const pillInactive =
    theme === 'dark'
      ? 'bg-[#0E0E12] text-slate-300 border-slate-800 hover:border-slate-700'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300';

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${surfaceClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E3A] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {scriptTitle} Recognition Drill
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              {scriptTitle} Quiz
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              generateQuestions();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A] hover:text-white transition cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Quiz
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'basic', 'dakuten', 'yoon'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer capitalize ${
                  category === cat
                    ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                    : pillInactive
                }`}
              >
                {cat === 'all' ? 'All Kana' : cat}
              </button>
            ))}
          </div>

          {/* Pool Size */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
              Questions:
            </span>
            {([10, 30, 'all'] as PoolSize[]).map((size) => (
              <button
                key={String(size)}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setPoolSize(size);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  poolSize === size
                    ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                    : pillInactive
                }`}
              >
                {size === 'all' ? 'All' : size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Card */}
      {quizFinished ? (
        <div className={`rounded-3xl border p-8 sm:p-10 text-center space-y-6 ${surfaceClass}`}>
          <div className="w-16 h-16 rounded-2xl bg-[#FF5E3A]/15 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              {scriptTitle} Quiz Complete!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You mastered all {initialTotal} {scriptTitle.toLowerCase()} characters
              {repeatCount > 0 ? ` (${repeatCount} repeated for review)` : ' with zero mistakes!'}.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm font-bold">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{initialTotal * 10} XP Earned
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              generateQuestions();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>
        </div>
      ) : currentQuestion ? (
        <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${surfaceClass}`}>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>
                Mastered {masteredCount} of {initialTotal}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#FF5E3A] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Prompt Character */}
          <div className="text-center py-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Select the matching Romaji
            </p>
            <div className="inline-flex flex-col items-center justify-center gap-3">
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-2 flex items-center justify-center text-6xl sm:text-7xl font-black font-jp select-none ${
                  theme === 'dark'
                    ? 'bg-[#0E0E12] border-slate-800 text-white'
                    : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]'
                }`}
              >
                {currentQuestion.char}
              </div>
              <button
                type="button"
                onClick={() => audio.speak(currentQuestion.char)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              const isAnswer = option === currentQuestion.romaji;

              let btnStyle =
                theme === 'dark'
                  ? 'bg-[#0E0E12] border-slate-800 hover:border-[#FF5E3A]/60 text-white'
                  : 'bg-[#FAF7F5] border-slate-200 hover:border-[#FF5E3A]/60 text-[#1A1A1F]';

              if (isAnswered) {
                if (isAnswer) {
                  btnStyle =
                    'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400';
                } else {
                  btnStyle =
                    theme === 'dark'
                      ? 'bg-[#0E0E12]/50 border-slate-800/50 text-slate-500'
                      : 'bg-slate-50 border-slate-200/50 text-slate-400';
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`py-4 px-5 rounded-2xl border-2 text-lg font-extrabold tracking-wide transition cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    isCorrect
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isCorrect
                    ? 'Correct! Nice work.'
                    : `Not quite — "${currentQuestion.char}" is "${currentQuestion.romaji}". We'll review it again soon.`}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleOpenDetails}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${pillInactive}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Details
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <KanaDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        kanaData={activeKanaDetail}
        theme={theme}
      />
    </div>
  );
};
