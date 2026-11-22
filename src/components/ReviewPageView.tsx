import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Search,
  Volume2,
  Check,
} from 'lucide-react';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { ALL_JLPT_KANJI_DATABASE } from '../data/kanjiDatabase';
import { KANJI_WORKBOOK_DAYS } from '../data/kanjiWorkbookDays';
import { ALL_JLPT_WORDS_DATABASE } from '../data/wordsDatabase';
import { profileStore } from '../utils/profileStore';
import audio from '../utils/audio';

type CategoryKey = 'hiragana' | 'katakana' | 'kanji' | 'words';

interface ReviewItem {
  key: string;
  prompt: string;
  answer: string;
  speakText: string;
  badge: string;
  subtext?: string;
  repeatsLeft: number;
}

interface ReviewPageViewProps {
  profileId: string;
  theme: 'dark' | 'light';
  onBack: () => void;
  onAddXp: (xp: number) => void;
}

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  kanji: 'Kanji',
  words: 'Words',
};

export const ReviewPageView: React.FC<ReviewPageViewProps> = ({
  profileId,
  theme,
  onBack,
  onAddXp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('hiragana');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshTick, setRefreshTick] = useState<number>(0);

  const reviewItemsByCategory = useMemo<Record<CategoryKey, ReviewItem[]>>(() => {
    void refreshTick;
    const hiraMap = new Map<string, Omit<ReviewItem, 'repeatsLeft'>>();
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

    const kataMap = new Map<string, Omit<ReviewItem, 'repeatsLeft'>>();
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

    const kanjiMap = new Map<string, Omit<ReviewItem, 'repeatsLeft'>>();
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

    const wordMap = new Map<string, Omit<ReviewItem, 'repeatsLeft'>>();
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

    const extractRepeats = (
      key: CategoryKey,
      lookup: Map<string, Omit<ReviewItem, 'repeatsLeft'>>
    ): ReviewItem[] => {
      const saved = profileStore.loadQuizState<unknown, unknown>(profileId, key);
      const repeats = saved?.repeatCounts || {};
      const out: ReviewItem[] = [];
      for (const [itemKey, count] of Object.entries(repeats)) {
        if (count > 0) {
          const meta = lookup.get(itemKey);
          if (meta) {
            out.push({ ...meta, repeatsLeft: count });
          }
        }
      }
      return out;
    };

    return {
      hiragana: extractRepeats('hiragana', hiraMap),
      katakana: extractRepeats('katakana', kataMap),
      kanji: extractRepeats('kanji', kanjiMap),
      words: extractRepeats('words', wordMap),
    };
  }, [profileId, refreshTick]);

  const currentList = reviewItemsByCategory[selectedCategory];

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentList;
    return currentList.filter(
      (item) =>
        item.prompt.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.subtext && item.subtext.toLowerCase().includes(q)) ||
        item.badge.toLowerCase().includes(q)
    );
  }, [currentList, searchQuery]);

  const handleMarkLearned = (itemKey: string) => {
    audio.playCorrect();
    const saved = profileStore.loadQuizState<unknown, unknown>(profileId, selectedCategory);
    if (saved) {
      const nextRepeats = { ...(saved.repeatCounts || {}) };
      delete nextRepeats[itemKey];
      const nextMastered = saved.masteredKeys.includes(itemKey)
        ? saved.masteredKeys
        : [...saved.masteredKeys, itemKey];
      profileStore.saveQuizState(profileId, selectedCategory, {
        ...saved,
        repeatCounts: nextRepeats,
        masteredKeys: nextMastered,
      });
    }
    profileStore.markItemLearned(profileId, selectedCategory, itemKey);
    const xpMap: Record<CategoryKey, number> = {
      hiragana: 10,
      katakana: 10,
      kanji: 15,
      words: 12,
    };
    onAddXp(xpMap[selectedCategory]);
    setRefreshTick((t) => t + 1);
  };

  const surfaceClass =
    theme === 'dark'
      ? 'bg-[#17171C] border-slate-800 text-white'
      : 'bg-white border-slate-200/80 text-[#1A1A1F] shadow-sm';

  const subCardClass =
    theme === 'dark'
      ? 'bg-[#0E0E12] border-slate-800 text-white'
      : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F]';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Review Page
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Spaced review and repetition for missed items to achieve complete mastery.
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

      {/* Category Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {(['hiragana', 'katakana', 'kanji', 'words'] as CategoryKey[]).map((cat) => {
          const count = reviewItemsByCategory[cat].length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                isActive
                  ? 'border-[#FF5E3A] bg-[#FF5E3A]/10 text-[#FF5E3A]'
                  : `${surfaceClass} hover:border-[#FF5E3A]/40`
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{CATEGORY_LABELS[cat]}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  count > 0
                    ? 'bg-[#FF5E3A] text-white'
                    : 'bg-slate-500/15 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search missed items..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-xs sm:text-sm outline-none focus:border-[#FF5E3A] ${surfaceClass}`}
        />
      </div>

      {/* Missed / Repeat Items List */}
      {filteredList.length === 0 ? (
        <div className={`rounded-3xl border p-8 text-center space-y-2 ${surfaceClass}`}>
          <p className="text-sm font-bold">
            No {CATEGORY_LABELS[selectedCategory]} items in your repeat queue!
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Any question you miss or mark <strong>Hard</strong> appears here until you complete all 3
            repeats.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((item, idx) => (
            <div
              key={item.key}
              className={`rounded-2xl border p-4 space-y-2.5 ${surfaceClass}`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/15 text-[#FF5E3A]">
                    #{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-500 dark:text-purple-400">
                    {item.repeatsLeft} repeat{item.repeatsLeft > 1 ? 's' : ''} left
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-500 dark:text-slate-300 uppercase">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => audio.speak(item.speakText)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FF5E3A]/10 text-[#FF5E3A] hover:bg-[#FF5E3A]/20 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Listen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkLearned(item.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition cursor-pointer"
                    title="Mark as learned and remove from Review Page"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Learned
                  </button>
                </div>
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

              <div
                className={`px-3.5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 ${subCardClass}`}
              >
                <span className="uppercase tracking-wider text-[10px] mr-2 opacity-80">
                  ANSWER:
                </span>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
