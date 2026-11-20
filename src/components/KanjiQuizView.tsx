import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_JLPT_KANJI_DATABASE, MasterKanjiItem } from '../data/kanjiDatabase';
import { getKanjiDetails } from '../data/kanjiWords';
import { KanjiDetailsData } from '../types';
import { KanjiDetailModal } from './KanjiDetailModal';
import audio from '../utils/audio';
import { profileStore } from '../utils/profileStore';

interface KanjiQuizViewProps {
  theme: 'dark' | 'light';
  profileId: string;
  onAddXp: (xp: number) => void;
}

type LevelFilter = 'ALL' | 'N5' | 'N4' | 'N3';
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

export const KanjiQuizView: React.FC<KanjiQuizViewProps> = ({
  theme,
  profileId,
  onAddXp,
}) => {
  const savedSession = React.useMemo(
    () => profileStore.loadQuizState<KanjiQuestionItem, MasterKanjiItem>(profileId, 'kanji'),
    [profileId]
  );
  const skipNextGenerateRef = React.useRef<boolean>(Boolean(savedSession));

  const [level, setLevel] = useState<LevelFilter>(
    (savedSession?.filter as LevelFilter) || 'ALL'
  );
  const [direction, setDirection] = useState<QuizDirection>(
    (savedSession?.direction as QuizDirection) || 'kanji-to-meaning'
  );
  const [showReadings, setShowReadings] = useState<boolean>(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const [questions, setQuestions] = useState<KanjiQuestionItem[]>(savedSession?.questions || []);
  const [initialTotal, setInitialTotal] = useState<number>(savedSession?.initialTotal || 0);
  const [masteredKeys, setMasteredKeys] = useState<string[]>(savedSession?.masteredKeys || []);
  const [repeatCounts, setRepeatCounts] = useState<Record<string, number>>(
    savedSession?.repeatCounts || {}
  );
  const [missedItems, setMissedItems] = useState<MasterKanjiItem[]>(
    savedSession?.missedItems || []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(savedSession?.currentIndex || 0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(
    Boolean(savedSession && savedSession.currentIndex >= savedSession.questions.length)
  );

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
    (itemsPool: MasterKanjiItem[]) => {
      const shuffled = [...itemsPool].sort(() => 0.5 - Math.random());

      const items: KanjiQuestionItem[] = shuffled.map((item) => {
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
      setMasteredKeys([]);
      setRepeatCounts({});
      setMissedItems([]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuizFinished(false);
    },
    [byLevel, direction]
  );

  const generateQuestions = useCallback(() => {
    buildQuestions(sourcePool);
  }, [buildQuestions, sourcePool]);

  useEffect(() => {
    if (skipNextGenerateRef.current) {
      skipNextGenerateRef.current = false;
      return;
    }
    generateQuestions();
  }, [generateQuestions]);

  // Persist progress per profile
  useEffect(() => {
    if (questions.length === 0) return;
    profileStore.saveQuizState<KanjiQuestionItem, MasterKanjiItem>(profileId, 'kanji', {
      filter: level,
      direction,
      questions,
      initialTotal,
      masteredKeys,
      repeatCounts,
      missedItems,
      currentIndex: quizFinished ? questions.length : currentIndex,
    });
  }, [
    profileId,
    level,
    direction,
    questions,
    initialTotal,
    masteredKeys,
    repeatCounts,
    missedItems,
    currentIndex,
    quizFinished,
  ]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = isAnswered && selectedOption === currentQuestion?.correctAnswer;
  const masteredCount = masteredKeys.length;
  const progressPercent = initialTotal > 0 ? Math.round((masteredCount / initialTotal) * 100) : 0;

  useEffect(() => {
    if (autoPlayAudio && currentQuestion && !quizFinished && !isAnswered) {
      audio.speak(currentQuestion.char);
    }
  }, [autoPlayAudio, currentQuestion, quizFinished, isAnswered]);

  const scheduleRepeat = useCallback(
    (q: KanjiQuestionItem, queue: KanjiQuestionItem[], fromIndex: number) => {
      const remaining = queue.length - (fromIndex + 1);
      const offset = remaining >= 5 ? 6 : queue.length - fromIndex;
      const clone = [...queue];
      clone.splice(fromIndex + offset, 0, {
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random()),
      });
      return clone;
    },
    []
  );

  const advanceOrFinish = useCallback((nextLen: number, idx: number) => {
    if (idx + 1 >= nextLen) {
      setQuizFinished(true);
      audio.playFanfare();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } });
    } else {
      setCurrentIndex(idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, []);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedOption(option);
      setIsAnswered(true);

      if (option === currentQuestion.correctAnswer) {
        audio.playCorrect();
      } else {
        audio.playWrong();
        setRepeatCounts((prev) => ({ ...prev, [currentQuestion.char]: 3 }));
        setMissedItems((prev) => {
          if (prev.some((m) => m.char === currentQuestion.char)) return prev;
          return [...prev, currentQuestion.item];
        });
        setQuestions((prev) => scheduleRepeat(currentQuestion, prev, currentIndex));
      }
    },
    [isAnswered, currentQuestion, currentIndex, scheduleRepeat]
  );

  const handleNextAfterWrong = useCallback(() => {
    audio.playClick();
    advanceOrFinish(questions.length, currentIndex);
  }, [questions.length, currentIndex, advanceOrFinish]);

  const handleRateHard = useCallback(() => {
    if (!currentQuestion) return;
    audio.playClick();
    setRepeatCounts((prev) => ({ ...prev, [currentQuestion.char]: 3 }));
    setMissedItems((prev) => {
      if (prev.some((m) => m.char === currentQuestion.char)) return prev;
      return [...prev, currentQuestion.item];
    });
    const updated = scheduleRepeat(currentQuestion, questions, currentIndex);
    setQuestions(updated);
    advanceOrFinish(updated.length, currentIndex);
  }, [currentQuestion, questions, currentIndex, scheduleRepeat, advanceOrFinish]);

  const handleRateEasy = useCallback(() => {
    if (!currentQuestion) return;
    audio.playClick();
    const remainingRepeats = repeatCounts[currentQuestion.char] || 0;

    if (remainingRepeats > 1) {
      setRepeatCounts((prev) => ({
        ...prev,
        [currentQuestion.char]: remainingRepeats - 1,
      }));
      const updated = scheduleRepeat(currentQuestion, questions, currentIndex);
      setQuestions(updated);
      advanceOrFinish(updated.length, currentIndex);
    } else {
      setRepeatCounts((prev) => {
        const next = { ...prev };
        delete next[currentQuestion.char];
        return next;
      });
      setMasteredKeys((prev) =>
        prev.includes(currentQuestion.char) ? prev : [...prev, currentQuestion.char]
      );
      onAddXp(15);
      advanceOrFinish(questions.length, currentIndex);
    }
  }, [currentQuestion, repeatCounts, questions, currentIndex, scheduleRepeat, advanceOrFinish, onAddXp]);

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    audio.playClick();
    setCurrentIndex((prev) => prev - 1);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (detailModalOpen || quizFinished || !currentQuestion) return;
      if (!isAnswered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (currentQuestion.options[idx]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[idx]);
        }
      } else if (isAnswered) {
        if (!isCorrect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleNextAfterWrong();
        } else if (isCorrect) {
          if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e') {
            e.preventDefault();
            handleRateEasy();
          } else if (e.key.toLowerCase() === 'h') {
            e.preventDefault();
            handleRateHard();
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    detailModalOpen,
    quizFinished,
    currentQuestion,
    isAnswered,
    isCorrect,
    handleSelectOption,
    handleNextAfterWrong,
    handleRateEasy,
    handleRateHard,
  ]);

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

  const currentRepeatsLeft = currentQuestion ? repeatCounts[currentQuestion.char] || 0 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filters */}
      <div className={`rounded-2xl border p-3.5 sm:p-5 ${surfaceClass}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E3A] mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              JLPT N5–N3 Kanji ({sourcePool.length} Available)
            </span>
            <h1 className="text-lg sm:text-2xl font-extrabold font-heading tracking-tight truncate">
              Kanji Quiz
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setAutoPlayAudio((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                autoPlayAudio
                  ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                  : pillInactive
              }`}
              title="Automatically pronounce each Kanji"
            >
              {autoPlayAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Auto Audio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setShowReadings((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                showReadings
                  ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                  : pillInactive
              }`}
              title={showReadings ? 'Hide Readings' : 'Show Readings'}
            >
              {showReadings ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showReadings ? 'Hide Readings' : 'Show Readings'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setFiltersOpen((prev) => !prev);
              }}
              className={`sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                filtersOpen
                  ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                  : pillInactive
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                generateQuestions();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A] hover:text-white transition cursor-pointer"
              title="Restart Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>

        <div
          className={`mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex-col gap-2.5 ${
            filtersOpen ? 'flex' : 'hidden sm:flex'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
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
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition cursor-pointer ${
                    level === lvl
                      ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                      : pillInactive
                  }`}
                >
                  {lvl === 'ALL' ? `All (${ALL_JLPT_KANJI_DATABASE.length})` : `JLPT ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mr-0.5">
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
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border whitespace-nowrap transition cursor-pointer ${
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
              You mastered all {initialTotal} Kanji characters!
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
                Marked Hard / Missed ({missedItems.length})
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
                  buildQuestions(missedItems);
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
              <div className="flex items-center gap-3">
                {currentRepeatsLeft > 0 && (
                  <span className="text-purple-500 dark:text-purple-400 font-bold">
                    {currentRepeatsLeft} repeat{currentRepeatsLeft > 1 ? 's' : ''} left
                  </span>
                )}
                <span>{progressPercent}%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#FF5E3A] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Prompt */}
          <div className="text-center py-2 sm:py-4 space-y-3">
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => audio.speak(currentQuestion.char)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Listen
                </button>
                {isAnswered && (
                  <button
                    type="button"
                    onClick={() => handleOpenDetails()}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${pillInactive}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Details
                  </button>
                )}
              </div>
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

          {/* Feedback / Recall Flow */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-3">
              {isCorrect ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold">
                      Rate recall to continue:
                    </span>
                    {currentIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#FF5E3A] transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Previous Question
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleRateHard}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-left transition cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <div>
                        <div className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                          Hard
                        </div>
                        <div className="text-[11px] text-rose-500/80 dark:text-rose-300/80">
                          Repeats 3 times
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleRateEasy}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          Easy
                        </div>
                        <div className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80">
                          {currentRepeatsLeft > 1
                            ? `${currentRepeatsLeft - 1} repeat${currentRepeatsLeft - 1 > 1 ? 's' : ''} left`
                            : 'Mark as Learned'}
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-500/40 bg-purple-500/10">
                    <RotateCcw className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300">
                        Repeat counter reset — 3 more correct repeats needed
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        Will reappear after at least 5 questions · &ldquo;{currentQuestion.char}&rdquo; means &ldquo;{currentQuestion.meaning}&rdquo;
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextAfterWrong}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
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
