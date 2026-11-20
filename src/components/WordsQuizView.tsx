import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_JLPT_WORDS_DATABASE } from '../data/wordsDatabase';
import { WordItem } from '../types';
import audio from '../utils/audio';

interface WordsQuizViewProps {
  theme: 'dark' | 'light';
}

type LevelFilter = 'ALL' | 'N5' | 'N4';
type PoolSize = 10 | 20 | 30 | 'all';

interface WordQuestionItem {
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  jlpt: string;
  pos: string;
  options: string[];
}

export const WordsQuizView: React.FC<WordsQuizViewProps> = ({ theme }) => {
  const [level, setLevel] = useState<LevelFilter>('ALL');
  const [poolSize, setPoolSize] = useState<PoolSize>(10);
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [questions, setQuestions] = useState<WordQuestionItem[]>([]);
  const [initialTotal, setInitialTotal] = useState<number>(10);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const sourcePool = useMemo<WordItem[]>(() => {
    if (level === 'ALL') return ALL_JLPT_WORDS_DATABASE;
    return ALL_JLPT_WORDS_DATABASE.filter((w) => w.jlpt === level);
  }, [level]);

  const allMeanings = useMemo(
    () => Array.from(new Set(ALL_JLPT_WORDS_DATABASE.map((w) => w.meaning))),
    []
  );

  const generateQuestions = useCallback(() => {
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
    const count = poolSize === 'all' ? shuffled.length : Math.min(poolSize, shuffled.length);
    const chosen = shuffled.slice(0, count);

    const items: WordQuestionItem[] = chosen.map((item) => {
      const distractors = allMeanings
        .filter((m) => m !== item.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [item.meaning, ...distractors].sort(() => 0.5 - Math.random());
      return {
        word: item.word,
        reading: item.reading,
        romaji: item.romaji,
        meaning: item.meaning,
        jlpt: item.jlpt,
        pos: item.pos,
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
  }, [sourcePool, allMeanings, poolSize]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = isAnswered && selectedOption === currentQuestion?.meaning;
  const progressPercent = initialTotal > 0 ? Math.round((masteredCount / initialTotal) * 100) : 0;

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.meaning) {
      audio.playCorrect();
      setMasteredCount((prev) => prev + 1);
    } else {
      audio.playWrong();
      setRepeatCount((prev) => prev + 1);
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
              JLPT Vocabulary ({sourcePool.length} Words)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Words Quiz
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setShowFurigana((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${pillInactive}`}
            >
              {showFurigana ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showFurigana ? 'Hide Reading' : 'Show Reading'}
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                generateQuestions();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A] hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart Quiz
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* JLPT Level */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'N5', 'N4'] as LevelFilter[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setLevel(lvl);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  level === lvl
                    ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                    : pillInactive
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>

          {/* Pool Size */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
              Questions:
            </span>
            {([10, 20, 30, 'all'] as PoolSize[]).map((size) => (
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
              Words Quiz Complete!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You mastered {initialTotal} vocabulary words
              {repeatCount > 0 ? ` (${repeatCount} repeated for review)` : ' with zero mistakes!'}.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm font-bold">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{initialTotal * 12} XP Earned
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
          {/* Progress */}
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

          {/* Prompt */}
          <div className="text-center py-4 space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/10 text-[#FF5E3A]">
                {currentQuestion.jlpt}
              </span>
              {currentQuestion.pos && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-500 dark:text-slate-400">
                  {currentQuestion.pos}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className={`px-8 py-6 rounded-3xl border-2 text-4xl sm:text-5xl font-black font-jp select-none ${
                  theme === 'dark'
                    ? 'bg-[#0E0E12] border-slate-800 text-white'
                    : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]'
                }`}
              >
                {currentQuestion.word}
              </div>

              {(showFurigana || isAnswered) && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-jp">
                  {currentQuestion.reading} ({currentQuestion.romaji})
                </p>
              )}

              <button
                type="button"
                onClick={() => audio.speak(currentQuestion.reading || currentQuestion.word)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer mt-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              const isAnswer = option === currentQuestion.meaning;

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
                  className={`py-3.5 px-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span
                className={`text-sm font-bold ${
                  isCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isCorrect
                  ? 'Correct! Well done.'
                  : `Not quite — "${currentQuestion.word}" means "${currentQuestion.meaning}".`}
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer self-end sm:self-auto"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
