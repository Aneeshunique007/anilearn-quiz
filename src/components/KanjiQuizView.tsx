import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  FileText,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_JLPT_KANJI_DATABASE, MasterKanjiItem } from '../data/kanjiDatabase';
import { getKanjiDetails } from '../data/kanjiWords';
import { KanjiDetailsData } from '../types';
import { KanjiDetailModal } from './KanjiDetailModal';
import audio from '../utils/audio';

interface KanjiQuizViewProps {
  theme: 'dark' | 'light';
}

type LevelFilter = 'ALL' | 'N5' | 'N4' | 'N3';
type PoolSize = 10 | 20 | 30 | 'all';
type QuizDirection = 'kanji-to-meaning' | 'meaning-to-kanji' | 'mixed';

interface KanjiQuestionItem {
  item: MasterKanjiItem;
  char: string;
  meaning: string;
  jlpt: 'N5' | 'N4' | 'N3';
  onyomi: string[];
  kunyomi: string[];
  mode: 'kanji-to-meaning' | 'meaning-to-kanji';
  correctAnswer: string;
  options: string[];
}

export const KanjiQuizView: React.FC<KanjiQuizViewProps> = ({ theme }) => {
  const [level, setLevel] = useState<LevelFilter>('ALL');
  const [poolSize, setPoolSize] = useState<PoolSize>(10);
  const [direction, setDirection] = useState<QuizDirection>('kanji-to-meaning');
  const [showReadings, setShowReadings] = useState<boolean>(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);

  const [questions, setQuestions] = useState<KanjiQuestionItem[]>([]);
  const [initialTotal, setInitialTotal] = useState<number>(10);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [missedItems, setMissedItems] = useState<MasterKanjiItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeKanjiDetail, setActiveKanjiDetail] = useState<KanjiDetailsData | null>(null);

  const sourcePool = useMemo<MasterKanjiItem[]>(() => {
    if (level === 'ALL') return ALL_JLPT_KANJI_DATABASE;
    return ALL_JLPT_KANJI_DATABASE.filter((k) => k.jlpt === level);
  }, [level]);

  const byLevel = useMemo<Record<'N5' | 'N4' | 'N3', MasterKanjiItem[]>>(() => {
    return {
      N5: ALL_JLPT_KANJI_DATABASE.filter((k) => k.jlpt === 'N5'),
      N4: ALL_JLPT_KANJI_DATABASE.filter((k) => k.jlpt === 'N4'),
      N3: ALL_JLPT_KANJI_DATABASE.filter((k) => k.jlpt === 'N3'),
    };
  }, []);

  const buildQuestions = useCallback(
    (itemsPool: MasterKanjiItem[], limitToPoolSize: boolean) => {
      const shuffled = [...itemsPool].sort(() => 0.5 - Math.random());
      const count =
        !limitToPoolSize || poolSize === 'all'
          ? shuffled.length
          : Math.min(poolSize, shuffled.length);
      const chosen = shuffled.slice(0, count);

      const items: KanjiQuestionItem[] = chosen.map((item) => {
        const mode: 'kanji-to-meaning' | 'meaning-to-kanji' =
          direction === 'mixed'
            ? Math.random() < 0.5
              ? 'kanji-to-meaning'
              : 'meaning-to-kanji'
            : direction;

        const lvl = item.jlpt as 'N5' | 'N4' | 'N3';
        const sameLevelPool = byLevel[lvl].filter(
          (k) => k.char !== item.char && k.meaning !== item.meaning
        );
        const distractorSource =
          sameLevelPool.length >= 3
            ? sameLevelPool
            : ALL_JLPT_KANJI_DATABASE.filter(
                (k) => k.char !== item.char && k.meaning !== item.meaning
              );

        const pickedDistractors = [...distractorSource]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const correctAnswer = mode === 'kanji-to-meaning' ? item.meaning : item.char;
        const distractorValues = pickedDistractors.map((d) =>
          mode === 'kanji-to-meaning' ? d.meaning : d.char
        );
        const options = Array.from(new Set([correctAnswer, ...distractorValues])).sort(
          () => 0.5 - Math.random()
        );

        return {
          item,
          char: item.char,
          meaning: item.meaning,
          jlpt: lvl,
          onyomi: item.onyomi || [],
          kunyomi: item.kunyomi || [],
          mode,
          correctAnswer,
          options,
        };
      });

      setQuestions(items);
      setInitialTotal(items.length);
      setMasteredCount(0);
      setRepeatCount(0);
      setMissedItems([]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuizFinished(false);
    },
    [byLevel, poolSize, direction]
  );

  const generateQuestions = useCallback(() => {
    buildQuestions(sourcePool, true);
  }, [buildQuestions, sourcePool]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = isAnswered && selectedOption === currentQuestion?.correctAnswer;
  const progressPercent = initialTotal > 0 ? Math.round((masteredCount / initialTotal) * 100) : 0;

  // Auto-play audio when a new question loads
  useEffect(() => {
    if (autoPlayAudio && currentQuestion && !quizFinished && !isAnswered) {
      audio.speak(currentQuestion.char);
    }
  }, [autoPlayAudio, currentQuestion, quizFinished, isAnswered]);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedOption(option);
      setIsAnswered(true);

      if (option === currentQuestion.correctAnswer) {
        audio.playCorrect();
        setMasteredCount((prev) => prev + 1);
      } else {
        audio.playWrong();
        setRepeatCount((prev) => prev + 1);
        setMissedItems((prev) => {
          if (prev.some((m) => m.char === currentQuestion.char)) return prev;
          return [...prev, currentQuestion.item];
        });

        const insertOffset = Math.min(3, questions.length - currentIndex);
        const clone = [...questions];
        clone.splice(currentIndex + insertOffset, 0, {
          ...currentQuestion,
          options: [...currentQuestion.options].sort(() => 0.5 - Math.random()),
        });
        setQuestions(clone);
      }
    },
    [isAnswered, currentQuestion, questions, currentIndex]
  );

  const handleNext = useCallback(() => {
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
  }, [currentIndex, questions.length]);

  // Keyboard shortcuts: 1-4 to pick option, Enter/Space for Next
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (detailModalOpen || quizFinished || !currentQuestion) return;
      if (!isAnswered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (currentQuestion.options[idx]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[idx]);
        }
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [detailModalOpen, quizFinished, currentQuestion, isAnswered, handleSelectOption, handleNext]);

  const handleOpenDetails = (char?: string, meaning?: string, jlpt?: 'N5' | 'N4' | 'N3') => {
    const targetChar = char || currentQuestion?.char;
    const targetMeaning = meaning || currentQuestion?.meaning;
    const targetJlpt = jlpt || currentQuestion?.jlpt || 'N5';
    if (!targetChar) return;
    audio.playClick();
    const details = getKanjiDetails(targetChar, targetMeaning, targetJlpt);
    setActiveKanjiDetail(details);
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filters */}
      <div className={`rounded-2xl border p-4 sm:p-6 ${surfaceClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E3A] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              JLPT N5–N3 Kanji ({sourcePool.length} Available)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Kanji Quiz
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setAutoPlayAudio((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                autoPlayAudio
                  ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                  : pillInactive
              }`}
              title="Automatically pronounce each Kanji"
            >
              {autoPlayAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              Auto Audio
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setShowReadings((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${pillInactive}`}
            >
              {showReadings ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showReadings ? 'Hide Readings' : 'Show Readings'}
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

        <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* JLPT Level Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['ALL', 'N5', 'N4', 'N3'] as LevelFilter[]).map((lvl) => (
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
                  {size === 'all' ? `All (${sourcePool.length})` : size}
                </button>
              ))}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
              Mode:
            </span>
            {(
              [
                { id: 'kanji-to-meaning', label: 'Kanji → Meaning' },
                { id: 'meaning-to-kanji', label: 'Meaning → Kanji' },
                { id: 'mixed', label: 'Mixed' },
              ] as Array<{ id: QuizDirection; label: string }>
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setDirection(opt.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  direction === opt.id
                    ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                    : pillInactive
                }`}
              >
                {opt.label}
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
              Kanji Quiz Complete!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You mastered {initialTotal} Kanji characters
              {repeatCount > 0 ? ` (${repeatCount} repeated for review)` : ' with zero mistakes!'}.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm font-bold">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{initialTotal * 15} XP Earned
            </div>
          </div>

          {missedItems.length > 0 && (
            <div className="max-w-lg mx-auto pt-2 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kanji to Review ({missedItems.length})
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {missedItems.map((m) => (
                  <button
                    key={m.char}
                    type="button"
                    onClick={() =>
                      handleOpenDetails(m.char, m.meaning, m.jlpt as 'N5' | 'N4' | 'N3')
                    }
                    className={`px-3 py-1.5 rounded-xl border text-sm font-bold font-jp flex items-center gap-1.5 transition cursor-pointer hover:border-[#FF5E3A] ${pillInactive}`}
                    title="View Kanji details"
                  >
                    <span>{m.char}</span>
                    <span className="text-xs font-sans text-[#FF5E3A]">({m.meaning})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {missedItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  buildQuestions(missedItems, false);
                }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition cursor-pointer ${pillInactive}`}
              >
                Practice Missed ({missedItems.length})
              </button>
            )}
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
        </div>
      ) : currentQuestion ? (
        <div className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-8 space-y-5 sm:space-y-6 ${surfaceClass}`}>
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
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {currentQuestion.mode === 'kanji-to-meaning'
                  ? 'What does this Kanji mean?'
                  : 'Select the matching Kanji'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              {currentQuestion.mode === 'kanji-to-meaning' ? (
                <div
                  className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-2 flex items-center justify-center text-6xl sm:text-7xl font-black font-jp select-none ${
                    theme === 'dark'
                      ? 'bg-[#0E0E12] border-slate-800 text-white'
                      : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]'
                  }`}
                >
                  {currentQuestion.char}
                </div>
              ) : (
                <div
                  className={`px-5 py-4 sm:px-8 sm:py-6 rounded-3xl border-2 text-xl sm:text-3xl font-extrabold font-heading select-none w-full max-w-md break-words ${
                    theme === 'dark'
                      ? 'bg-[#0E0E12] border-slate-800 text-white'
                      : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]'
                  }`}
                >
                  {currentQuestion.meaning}
                </div>
              )}

              {(showReadings || isAnswered) && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-jp">
                  {currentQuestion.onyomi.length > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-[#FF5E3A] font-semibold">
                      On: {currentQuestion.onyomi.join('・')}
                    </span>
                  )}
                  {currentQuestion.kunyomi.length > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-300 font-semibold">
                      Kun: {currentQuestion.kunyomi.join('・')}
                    </span>
                  )}
                </div>
              )}

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

          {/* Options */}
          <div
            className={`grid gap-3 max-w-xl mx-auto ${
              currentQuestion.mode === 'meaning-to-kanji'
                ? 'grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isAnswer = option === currentQuestion.correctAnswer;

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
                  className={`relative py-3.5 px-4 rounded-2xl border-2 font-bold transition cursor-pointer disabled:cursor-default ${
                    currentQuestion.mode === 'meaning-to-kanji'
                      ? 'text-3xl sm:text-4xl font-jp'
                      : 'text-sm sm:text-base'
                  } ${btnStyle}`}
                >
                  <span className="absolute top-2 left-3 text-[10px] font-bold font-sans opacity-40 hidden sm:inline">
                    {idx + 1}
                  </span>
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
                  ? 'Correct! Great Kanji recall.'
                  : `Not quite — "${currentQuestion.char}" means "${currentQuestion.meaning}".`}
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenDetails()}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${pillInactive}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Details
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <KanjiDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        kanjiData={activeKanjiDetail}
        theme={theme}
      />
    </div>
  );
};
