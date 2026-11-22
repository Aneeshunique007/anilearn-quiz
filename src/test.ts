declare const process: { cwd: () => string; exit: (code: number) => never };
declare const require: (id: string) => any;
const fs = require('node:fs');
const path = require('node:path');

const assert = {
  equal<T>(actual: T, expected: T, msg?: string) {
    if (actual !== expected) {
      throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },
  deepEqual(actual: unknown, expected: unknown, msg?: string) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },
  ok(cond: unknown, msg?: string) {
    if (!cond) throw new Error(msg || 'Assertion failed');
  },
};
import { HIRAGANA_DATA, KATAKANA_DATA } from './data/kanaData';
import { ALL_JLPT_KANJI_DATABASE, KANJI_N5_LIST, KANJI_N4_LIST, KANJI_N3_LIST } from './data/kanjiDatabase';
import { KANJI_WORKBOOK_DAYS } from './data/kanjiWorkbookDays';
import { ALL_JLPT_WORDS_DATABASE, WORDS_N5_LIST, WORDS_N4_LIST, WORDS_N3_LIST } from './data/wordsDatabase';
import { formatKanjiReading, getKanjiPronunciation, kanaToRomaji } from './utils/romaji';
import { profileStore } from './utils/profileStore';
import { quizSupabase } from './utils/supabaseClient';

// Polyfill localStorage & window for Node test environment
const memoryStorage = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  get length() {
    return memoryStorage.size;
  },
  clear() {
    memoryStorage.clear();
  },
  getItem(key: string) {
    return memoryStorage.has(key) ? memoryStorage.get(key)! : null;
  },
  key(index: number) {
    return Array.from(memoryStorage.keys())[index] ?? null;
  },
  removeItem(key: string) {
    memoryStorage.delete(key);
  },
  setItem(key: string, value: string) {
    memoryStorage.set(key, String(value));
  },
};

(globalThis as unknown as { window: { dispatchEvent: () => boolean } }).window = {
  dispatchEvent: () => true,
};
(globalThis as unknown as { CustomEvent: unknown }).CustomEvent = class CustomEvent {
  type: string;
  detail: unknown;
  constructor(type: string, init?: { detail?: unknown }) {
    this.type = type;
    this.detail = init?.detail;
  }
};

let passed = 0;
function test(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
      console.log(`PASS: ${name}`);
    });
}

async function runAllTests() {
  // 1. Hiragana & Katakana Data
  await test('Hiragana has 104 unique characters (46 basic, 25 dakuten, 33 yoon) with clean romaji', () => {
    assert.equal(HIRAGANA_DATA.basic.length, 46);
    assert.equal(HIRAGANA_DATA.dakuten.length, 25);
    assert.equal(HIRAGANA_DATA.yoon.length, 33);
    const all = [...HIRAGANA_DATA.basic, ...HIRAGANA_DATA.dakuten, ...HIRAGANA_DATA.yoon];
    assert.equal(new Set(all.map((k) => k.char)).size, 104);
    for (const k of all) {
      assert.ok(k.romaji.trim().length > 0, `Empty romaji for ${k.char}`);
      assert.ok(!k.romaji.includes('/'), `Unexpected '/' in ${k.char}: ${k.romaji}`);
    }
  });

  await test('Katakana has 104 unique characters (46 basic, 25 dakuten, 33 yoon) with clean romaji', () => {
    assert.equal(KATAKANA_DATA.basic.length, 46);
    assert.equal(KATAKANA_DATA.dakuten.length, 25);
    assert.equal(KATAKANA_DATA.yoon.length, 33);
    const all = [...KATAKANA_DATA.basic, ...KATAKANA_DATA.dakuten, ...KATAKANA_DATA.yoon];
    assert.equal(new Set(all.map((k) => k.char)).size, 104);
    for (const k of all) {
      assert.ok(k.romaji.trim().length > 0, `Empty romaji for ${k.char}`);
      assert.ok(!k.romaji.includes('/'), `Unexpected '/' in ${k.char}: ${k.romaji}`);
    }
  });

  // 2. Kanji Data & Workbook Days 1-27
  await test('Kanji database has 688 entries (110 N5, 208 N4, 370 N3) with clean meanings', () => {
    assert.equal(KANJI_N5_LIST.length, 110);
    assert.equal(KANJI_N4_LIST.length, 208);
    assert.equal(KANJI_N3_LIST.length, 370);
    assert.equal(ALL_JLPT_KANJI_DATABASE.length, 688);
    for (const k of ALL_JLPT_KANJI_DATABASE) {
      assert.ok(k.meaning.trim().length > 0, `Empty meaning for ${k.char}`);
      assert.ok(!/\s+or\s+/i.test(k.meaning), `Unexpected 'or' in ${k.char}: ${k.meaning}`);
    }
  });

  await test('Kanji Workbook Days 1-27 cover 620 Kanji cleanly', () => {
    assert.equal(KANJI_WORKBOOK_DAYS.length, 27);
    const total = KANJI_WORKBOOK_DAYS.reduce((acc, d) => acc + d.kanji.length, 0);
    assert.equal(total, 620);
    for (const d of KANJI_WORKBOOK_DAYS) {
      assert.ok(d.kanji.length > 0, `Empty day ${d.day}`);
    }
  });

  await test('All 688 Kanji + 620 Workbook Kanji convert to valid Hiragana & Romaji', () => {
    for (const k of ALL_JLPT_KANJI_DATABASE) {
      const p = getKanjiPronunciation(k);
      const { hiragana, romaji } = formatKanjiReading(p);
      assert.ok(hiragana.length > 0 && !/[a-zA-Z-]/.test(hiragana), `Bad hiragana for ${k.char}: ${hiragana}`);
      assert.ok(romaji.length > 0 && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(romaji), `Bad romaji for ${k.char}: ${romaji}`);
    }
    for (const d of KANJI_WORKBOOK_DAYS) {
      for (const wk of d.kanji) {
        const { hiragana, romaji } = formatKanjiReading(wk.reading);
        assert.ok(hiragana.length > 0 && !/[a-zA-Z-]/.test(hiragana), `Bad wb hiragana for ${wk.char}`);
        assert.ok(romaji.length > 0 && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(romaji), `Bad wb romaji for ${wk.char}`);
      }
    }
    // Curated spot checks
    const ichi = ALL_JLPT_KANJI_DATABASE.find((k) => k.char === '一')!;
    assert.deepEqual(formatKanjiReading(getKanjiPronunciation(ichi)), { hiragana: 'いち', romaji: 'ichi' });
    const hito = ALL_JLPT_KANJI_DATABASE.find((k) => k.char === '人')!;
    assert.deepEqual(formatKanjiReading(getKanjiPronunciation(hito)), { hiragana: 'ひと', romaji: 'hito' });
    assert.equal(kanaToRomaji('きょう'), 'kyou');
  });

  // 3. Words Data
  await test('Words database has 1,668 entries (805 N5, 683 N4, 180 N3) with readings and clean meanings', () => {
    assert.equal(WORDS_N5_LIST.length, 805);
    assert.equal(WORDS_N4_LIST.length, 683);
    assert.equal(WORDS_N3_LIST.length, 180);
    assert.equal(ALL_JLPT_WORDS_DATABASE.length, 1668);
    for (const w of ALL_JLPT_WORDS_DATABASE) {
      assert.ok(w.reading.trim().length > 0, `Empty reading for ${w.word}`);
      assert.ok(w.meaning.trim().length > 0, `Empty meaning for ${w.word}`);
      assert.ok(!w.meaning.includes(' / '), `Unexpected '/' in ${w.word}: ${w.meaning}`);
    }
  });

  // 4. Profile Store, 3-Repeat Queue, Cumulative Learned, & XP
  await test('Profile creation, switching, XP, 3-repeat persistence, and cumulative learned tracking work', () => {
    memoryStorage.clear();
    const def = profileStore.getActiveProfile();
    assert.equal(def.name, 'Learner');

    const p2 = profileStore.createProfile('Aneesh', 'あ', 'N3');
    assert.equal(profileStore.getActiveProfile().id, p2.id);
    assert.equal(profileStore.getProfiles().length, 2);

    profileStore.addXp(p2.id, 25);
    assert.equal(profileStore.getActiveProfile().xp, 25);

    // Save quiz session with 3-repeat queue & Day 1 filter
    profileStore.saveQuizState(p2.id, 'kanji', {
      filter: 'ALL|1',
      direction: 'kanji-to-meaning',
      questions: [{ char: '人' }],
      initialTotal: 16,
      masteredKeys: ['一'],
      repeatCounts: { 人: 3 },
      missedItems: [{ char: '人' }],
      currentIndex: 0,
    });
    const loaded = profileStore.loadQuizState<{ char: string }, { char: string }>(p2.id, 'kanji');
    assert.ok(loaded);
    assert.equal(loaded.filter, 'ALL|1');
    assert.equal(loaded.repeatCounts['人'], 3);

    // Cumulative learned tracking
    profileStore.markItemLearned(p2.id, 'kanji', '一');
    profileStore.markItemLearned(p2.id, 'kanji', '一'); // idempotent
    assert.deepEqual(profileStore.getLearnedList(p2.id, 'kanji'), ['一']);
    const summary = profileStore.getProfileMasteredSummary(p2.id);
    assert.equal(summary.kanji, 1);

    // Delete profile cleans up
    const remaining = profileStore.deleteProfile(p2.id);
    assert.equal(remaining.length, 1);
    assert.equal(profileStore.getLearnedList(p2.id, 'kanji').length, 0);
  });

  // 5. Supabase Config & Sync Service
  await test('Supabase client configures and persists session cleanly', () => {
    memoryStorage.clear();
    const ok = quizSupabase.configure(
      'https://cvhcpzxyrbtjqpzsqcaw.supabase.co',
      'sb_publishable_Hbzsbs59UGJ6iXU0CppijA_YBhbu6Ew'
    );
    assert.equal(ok, true);
    assert.equal(quizSupabase.isConfigured(), true);
    assert.equal(quizSupabase.getUser(), null);
  });

  // 6. PWA & Env Files
  await test('PWA manifest, service worker, and icons exist and are valid', () => {
    const root = process.cwd();
    const manifestPath = path.join(root, 'public/manifest.webmanifest');
    const swPath = path.join(root, 'public/sw.js');
    const appleIcon = path.join(root, 'public/apple-touch-icon.png');
    const icon192 = path.join(root, 'public/icons/icon-192.png');
    const icon512 = path.join(root, 'public/icons/icon-512.png');

    assert.ok(fs.existsSync(manifestPath), 'Missing manifest.webmanifest');
    assert.ok(fs.existsSync(swPath), 'Missing sw.js');
    assert.ok(fs.existsSync(appleIcon), 'Missing apple-touch-icon.png');
    assert.ok(fs.existsSync(icon192), 'Missing icon-192.png');
    assert.ok(fs.existsSync(icon512), 'Missing icon-512.png');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.name, 'AniLearn Quiz');
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.icons.length, 2);
  });

  console.log(`\nALL ${passed} TESTS PASSED (100%)`);
}

runAllTests().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
