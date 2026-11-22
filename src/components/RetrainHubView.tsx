import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Search,
  Volume2,
  Languages,
  BookOpen,
  BookA,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { ALL_JLPT_KANJI_DATABASE } from '../data/kanjiDatabase';
import { KANJI_WORKBOOK_DAYS } from '../data/kanjiWorkbookDays';
import { ALL_JLPT_WORDS_DATABASE } from '../data/wordsDatabase';
import { profileStore } from '../utils/profileStore';
import audio from '../utils/audio';

type CategoryKey = 'hiragana' | 'katakana' | 'kanji' | 'words';

interface RetrainItem {
  key: string;
  prompt: string;
  answer: string;
  speakText: string;
  badge: string;
  subtext?: string;
}

interface RetrainQuestion {
  item: RetrainItem;
  options: string[];
}

interface RetrainHubViewProps {
  profileId: string;
  theme: 'dark' | 'light';
  onBack: () => void;
  onAddXp: (xp: number) => void;
}

const SET_SIZE = 100;

export const RetrainHubView: React.FC<RetrainHubViewProps> = ({
  profileId,
  theme,
  onBack,
  onAddXp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('hiragana');
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active retrain quiz state
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainQuestions, setRetrainQuestions] = useState<RetrainQuestion[]>([]);
  const [retrainIdx, setRetrainIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [retrainFinished, setRetrainFinished] = useState<boolean>(false);

  // Build lookup maps for each category
  const allItemsByCategory = useMemo<Record<CategoryKey, RetrainItem[]>>(() => {
    const learnedHira = profileStore.getLearnedList(profileId, 'hiragana');
    const learnedKata = profileStore.getLearnedList(profileId, 'katakana');
    const learnedKanji = profileStore.getLearnedList(profileId, 'kanji');
    const learnedWords = profileStore.getLearnedList(profileId, 'words');

    const hiraMap = new Map<string, RetrainItem>();
    for (const [cat, list] of Object.entries(HIRAGANA_DATA)) {
      for (const k of list) {
        hiraMap.set(k.char, {
          key: k.char,
          prompt: k.char,
          answer: k.romaji,
          speakText: k.char,
          badge: cat,
          subtext: k.example,
        });
      }
    }

    const kataMap = new Map<string, RetrainItem>();
    for (const [cat, list] of Object.entries(KATAKANA_DATA)) {
      for (const k of list) {
        kataMap.set(k.char, {
          key: k.char,
          prompt: k.char,
          answer: k.romaji,
          speakText: k.char,
          badge: cat,
          subtext: k.example,
        });
      }
    }

    const kanjiMap = new Map<string, RetrainItem>();
    for (const k of ALL_JLPT_KANJI_DATABASE) {
      kanjiMap.set(k.char, {
        key: k.char,
        prompt: k.char,
        answer: k.meaning,
        speakText: k.kunyomi?.[0] || k.onyomi?.[0] || k.char,
        badge: k.jlpt,
        subtext: [...(k.onyomi || []), ...(k.kunyomi || [])].join('・') || undefined,
      });
    }
    for (const d of KANJI_WORKBOOK_DAYS) {
      for (const wk of d.kanji) {
        if (!kanjiMap.has(wk.char)) {
          kanjiMap.set(wk.char, {
            key: wk.char,
            prompt: wk.char,
            answer: wk.meaning,
            speakText: wk.reading || wk.char,
            badge: wk.level,
            subtext: wk.reading || undefined,
          });
        }
      }
    }

    const wordMap = new Map<string, RetrainItem>();
    for (const w of ALL_JLPT_WORDS_DATABASE) {
      wordMap.set(w.word, {
        key: w.word,
        prompt: w.word,
        answer: w.meaning,
        speakText: w.reading || w.word,
        badge: w.jlpt,
        subtext: `${w.reading} (${w.romaji})`,
      });
    }

    const mapKeys = (keys: string[], map: Map<string, RetrainItem>) =>
      keys.map((k) => map.get(k)).filter((v): v is RetrainItem => Boolean(v));

    return {
      hiragana: mapKeys(learnedHira, hiraMap),
      katakana: mapKeys(learnedKata, kataMap),
      kanji: mapKeys(learnedKanji, kanjiMap),
      words: mapKeys(learnedWords, wordMap),
    };
  }, [profileId]);

  // Fallback distractor pool for retrain quiz
  const distractorAnswersByCategory = useMemo<Record<CategoryKey, string[]>>(() => {
    return {
      hiragana: Array.from(
        new Set(
          [...HIRAGANA_DATA.basic, ...HIRAGANA_DATA.dakuten, ...HIRAGANA_DATA.yoon].map(
            (k) => k.romaji
          )
        )
      ),
      katakana: Array.from(
        new Set(
          [...KATAKANA_DATA.basic, ...KATAKANA_DATA.dakuten, ...KATAKANA_DATA.yoon].map(
            (k) => k.romaji
          )
        )
      ),
      kanji: Array.from(new Set(ALL_JLPT_KANJI_DATABASE.map((k) => k.meaning))),
      words: Array.from(new Set(ALL_JLPT_WORDS_DATABASE.map((w) => w.meaning))),
    };
  }, []);

  const currentItems = allItemsByCategory[selectedCategory];

  const sets = useMemo(() => {
    const chunks: Array<{ index: number; start: number; end: number; items: RetrainItem[] }> = [];
    for (let i = 0; i < currentItems.length; i += SET_SIZE) {
      const slice = currentItems.slice(i, i + SET_SIZE);
      chunks.push({
        index: chunks.length,
        start: i + 1,
        end: i + slice.length,
        items: slice,
      });
    }
    return chunks;
  }, [currentItems]);

  const activeSet = sets[selectedSetIndex] || sets[0] || null;

  const filteredSetItems = useMemo(() => {
    if (!activeSet) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeSet.items;
    return activeSet.items.filter(
      (item) =>
        item.prompt.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.subtext && item.subtext.toLowerCase().includes(q)) ||
        item.badge.toLowerCase().includes(q)
    );
  }, [activeSet, searchQuery]);

  const startRetrainSet = () => {
    if (!activeSet || activeSet.items.length === 0) return;
    audio.playClick();
    const distractorPool = distractorAnswersByCategory[selectedCategory];
    const shuffled = [...activeSet.items].sort(() => 0.5 - Math.random());

    const qs: RetrainQuestion[] = shuffled.map((item) => {
      const distractors = distractorPool
        .filter((a) => a !== item.answer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = Array.from(new Set([item.answer, ...distractors])).sort(
        () => 0.5 - Math.random()
      );
      return { item, options };
    });

    setRetrainQuestions(qs);
    setRetrainIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setRetrainFinished(false);
    setIsRetraining(true);
  };

  const currentRetrainQ = retrainQuestions[retrainIdx];

  const handleSelectRetrainOption = useCallback(
    (opt: string) => {
      if (isAnswered || !currentRetrainQ) return;
      setSelectedOption(opt);
      setIsAnswered(true);
      if (opt === currentRetrainQ.item.answer) {
        audio.playCorrect();
        setCorrectCount((prev) => prev + 1);
      } else {
        audio.playWrong();
      }
    },
    [isAnswered, currentRetrainQ]
  );

  const handleNextRetrain = useCallback(() => {
    audio.playClick();
    if (retrainIdx + 1 >= retrainQuestions.length) {
      setRetrainFinished(true);
      onAddXp(correctCount * 5);
      audio.playFanfare();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } });
    } else {
      setRetrainIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [retrainIdx, retrainQuestions.length, correctCount, onAddXp]);

  useEffect(() => {
    if (!isRetraining || retrainFinished || !currentRetrainQ) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (currentRetrainQ.options[idx]) {
          e.preventDefault();
          handleSelectRetrainOption(currentRetrainQ.options[idx]);
        }
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextRetrain();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isRetraining,
    retrainFinished,
    currentRetrainQ,
    isAnswered,
    handleSelectRetrainOption,
    handleNextRetrain,
  ]);

  const surfaceClass =
    theme === 'dark'
      ? 'bg-[#17171C] border-slate-800 text-white'
      : 'bg-white border-slate-200/80 text-[#1A1A1F] shadow-sm';

  const subCardClass =
    theme === 'dark'
      ? 'bg-[#0E0E12] border-slate-800 text-white'
      : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]';

  const categories: Array<{
    id: CategoryKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'hiragana', label: 'HIRAGANA', icon: Languages },
    { id: 'katakana', label: 'KATAKANA', icon: Sparkles },
    { id: 'kanji', label: 'KANJI', icon: BookA },
    { id: 'words', label: 'WORDS', icon: BookOpen },
  ];

  // Active Retrain Quiz Mode
  if (isRetraining) {
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl border p-4 flex items-center justify-between ${surfaceClass}`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5E3A]">
              Retrain · {selectedCategory.toUpperCase()} · Set {(activeSet?.index || 0) + 1}
            </span>
            <h2 className="text-lg font-extrabold font-heading">
              {retrainFinished
                ? 'Retrain Complete'
                : `Question ${retrainIdx + 1} of ${retrainQuestions.length}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setIsRetraining(false);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${subCardClass}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Hub
          </button>
        </div>

        {retrainFinished ? (
          <div className={`rounded-3xl border p-8 text-center space-y-5 ${surfaceClass}`}>
            <div className="w-14 h-14 rounded-2xl bg-[#FF5E3A]/15 text-[#FF5E3A] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold font-heading">
                Score: {correctCount} / {retrainQuestions.length}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                +{correctCount * 5} XP earned from retraining!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={startRetrainSet}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white font-bold text-sm transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retrain Set Again
              </button>
              <button
                type="button"
                onClick={() => setIsRetraining(false)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition cursor-pointer ${subCardClass}`}
              >
                Back to Retrain Hub
              </button>
            </div>
          </div>
        ) : currentRetrainQ ? (
          <div className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${surfaceClass}`}>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#FF5E3A] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(((retrainIdx + (isAnswered ? 1 : 0)) / retrainQuestions.length) * 100)}%`,
                }}
              />
            </div>

            <div className="text-center py-2 space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/10 text-[#FF5E3A]">
                {currentRetrainQ.item.badge}
              </span>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`min-w-28 px-6 py-4 rounded-3xl border-2 text-4xl sm:text-5xl font-black font-jp select-none ${subCardClass}`}
                >
                  {currentRetrainQ.item.prompt}
                </div>
                <button
                  type="button"
                  onClick={() => audio.speak(currentRetrainQ.item.speakText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Listen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {currentRetrainQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isAnswer = opt === currentRetrainQ.item.answer;
                let style = `${subCardClass} hover:border-[#FF5E3A]/60`;
                if (isAnswered) {
                  if (isAnswer) {
                    style =
                      'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400';
                  } else if (isSelected) {
                    style = 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400';
                  } else {
                    style = 'opacity-50 ' + subCardClass;
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectRetrainOption(opt)}
                    className={`relative py-3 px-4 rounded-2xl border-2 font-bold text-sm sm:text-base transition cursor-pointer disabled:cursor-default ${style}`}
                  >
                    <span className="absolute top-2 left-3 text-[10px] font-bold opacity-40 hidden sm:inline">
                      {idx + 1}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <span className="text-xs sm:text-sm font-bold">
                  {selectedOption === currentRetrainQ.item.answer
                    ? 'Correct!'
                    : `Answer: ${currentRetrainQ.item.answer}`}
                </span>
                <button
                  type="button"
                  onClick={handleNextRetrain}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold transition cursor-pointer"
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
  }

  // Main Retrain Hub View
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Retrain Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Mastered items organized into modular 100-item retention sets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition cursor-pointer shrink-0 ${surfaceClass} hover:border-[#FF5E3A]`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* 2x2 Category Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = allItemsByCategory[cat.id].length;
          const setCount = Math.ceil(count / SET_SIZE);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCategory(cat.id);
                setSelectedSetIndex(0);
                setSearchQuery('');
              }}
              className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                isSelected
                  ? 'border-[#FF5E3A] bg-[#FF5E3A]/10'
                  : `${surfaceClass} hover:border-[#FF5E3A]/40`
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#FF5E3A]/20 text-[#FF5E3A]'
                    : 'bg-slate-500/10 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold tracking-wide">
                  {cat.label}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      count > 0
                        ? 'bg-[#FF5E3A] text-white'
                        : 'bg-slate-500/15 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count} Learned
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {setCount === 0
                    ? '0 Sets (100 Qs)'
                    : `${setCount} Set${setCount > 1 ? 's' : ''} (100 Qs)`}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sets & Items Panel */}
      <div className={`rounded-3xl border p-4 sm:p-5 space-y-4 ${surfaceClass}`}>
        {sets.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-bold">
              No learned {selectedCategory} items yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mark items as <strong>Easy</strong> in the {selectedCategory} quiz to unlock 100-item
              retrain sets here.
            </p>
          </div>
        ) : (
          <>
            {/* Set Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {sets.map((s) => {
                const isSetActive = activeSet?.index === s.index;
                const partial =
                  s.items.length < SET_SIZE ? ` (${s.items.length}/${SET_SIZE})` : '';
                return (
                  <button
                    key={s.index}
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setSelectedSetIndex(s.index);
                    }}
                    className={`px-3.5 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
                      isSetActive
                        ? 'border-[#FF5E3A] bg-[#FF5E3A]/15 text-[#FF5E3A]'
                        : `${subCardClass} hover:border-slate-500`
                    }`}
                  >
                    Set {s.index + 1}
                    {partial}{' '}
                    <span className="opacity-70 font-normal ml-1">
                      {s.start} – {s.end}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Start Retrain CTA */}
            {activeSet && (
              <button
                type="button"
                onClick={startRetrainSet}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5E3A] hover:bg-[#E84E29] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Start Retrain ({activeSet.items.length} Qs)
              </button>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search items in Set ${(activeSet?.index || 0) + 1}...`}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-xs sm:text-sm outline-none focus:border-[#FF5E3A] ${subCardClass}`}
              />
            </div>

            {/* Item Cards */}
            <div className="space-y-2.5">
              {filteredSetItems.map((item, idx) => (
                <div
                  key={item.key}
                  className={`rounded-2xl border p-4 space-y-2.5 ${subCardClass}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/15 text-[#FF5E3A]">
                        #{(activeSet?.start || 1) + idx}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-500 dark:text-slate-300 uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => audio.speak(item.speakText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Listen
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black font-jp">
                      {item.prompt}
                    </span>
                    {item.subtext && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-jp">
                        {item.subtext}
                      </span>
                    )}
                  </div>

                  <div className="px-3.5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="uppercase tracking-wider text-[10px] mr-2 opacity-80">
                      ANSWER:
                    </span>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
