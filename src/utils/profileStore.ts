export interface QuizProfile {
  id: string;
  name: string;
  avatar: string;
  targetLevel: 'N5' | 'N4' | 'N3';
  xp: number;
  createdAt: string;
}

export interface SavedQuizSession<TQuestion, TMissed> {
  filter: string;
  direction: string;
  questions: TQuestion[];
  initialTotal: number;
  masteredKeys: string[];
  repeatCounts: Record<string, number>;
  missedItems: TMissed[];
  currentIndex: number;
  updatedAt: string;
}

const PROFILES_KEY = 'anilearn_quiz_profiles';
const ACTIVE_PROFILE_KEY = 'anilearn_quiz_active_profile_id';
const PROGRESS_PREFIX = 'anilearn_quiz_progress_';

export const AVATAR_OPTIONS = ['🌸', '🦊', '🐱', '🍡', '⛩️', '🗾', '🔥', '⭐'];

function createDefaultProfile(): QuizProfile {
  return {
    id: 'profile-default',
    name: 'Learner',
    avatar: '🌸',
    targetLevel: 'N5',
    xp: 0,
    createdAt: new Date().toISOString(),
  };
}

export const profileStore = {
  getProfiles(): QuizProfile[] {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const def = createDefaultProfile();
    localStorage.setItem(PROFILES_KEY, JSON.stringify([def]));
    localStorage.setItem(ACTIVE_PROFILE_KEY, def.id);
    return [def];
  },

  hasCustomProfiles(): boolean {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  },

  getActiveProfile(): QuizProfile {
    const profiles = this.getProfiles();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const match = profiles.find((p) => p.id === activeId);
    if (match) return match;
    localStorage.setItem(ACTIVE_PROFILE_KEY, profiles[0].id);
    return profiles[0];
  },

  setActiveProfileId(id: string): QuizProfile {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    return this.getActiveProfile();
  },

  createProfile(name: string, avatar: string, targetLevel: 'N5' | 'N4' | 'N3'): QuizProfile {
    const profiles = this.getProfiles();
    const newProfile: QuizProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || 'Learner',
      avatar: avatar || '🌸',
      targetLevel,
      xp: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...profiles, newProfile];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id);
    return newProfile;
  },

  deleteProfile(id: string): QuizProfile[] {
    const profiles = this.getProfiles().filter((p) => p.id !== id);
    // Clean up all saved quiz progress for this profile
    try {
      for (const quizKey of ['hiragana', 'katakana', 'kanji', 'words']) {
        localStorage.removeItem(`${PROGRESS_PREFIX}${id}_${quizKey}`);
      }
    } catch {}

    if (profiles.length === 0) {
      const def = createDefaultProfile();
      localStorage.setItem(PROFILES_KEY, JSON.stringify([def]));
      localStorage.setItem(ACTIVE_PROFILE_KEY, def.id);
      return [def];
    }

    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (activeId === id) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profiles[0].id);
    }
    return profiles;
  },

  addXp(profileId: string, amount: number): QuizProfile[] {
    if (amount <= 0) return this.getProfiles();
    const profiles = this.getProfiles().map((p) =>
      p.id === profileId ? { ...p, xp: (p.xp || 0) + amount } : p
    );
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    return profiles;
  },

  loadQuizState<TQuestion, TMissed>(
    profileId: string,
    quizKey: 'hiragana' | 'katakana' | 'kanji' | 'words'
  ): SavedQuizSession<TQuestion, TMissed> | null {
    try {
      const raw = localStorage.getItem(`${PROGRESS_PREFIX}${profileId}_${quizKey}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  saveQuizState<TQuestion, TMissed>(
    profileId: string,
    quizKey: 'hiragana' | 'katakana' | 'kanji' | 'words',
    state: Omit<SavedQuizSession<TQuestion, TMissed>, 'updatedAt'>
  ): void {
    try {
      localStorage.setItem(
        `${PROGRESS_PREFIX}${profileId}_${quizKey}`,
        JSON.stringify({ ...state, updatedAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error('Failed to save quiz progress:', e);
    }
  },

  clearQuizState(
    profileId: string,
    quizKey: 'hiragana' | 'katakana' | 'kanji' | 'words'
  ): void {
    try {
      localStorage.removeItem(`${PROGRESS_PREFIX}${profileId}_${quizKey}`);
    } catch {}
  },

  getProfileMasteredSummary(profileId: string): Record<'hiragana' | 'katakana' | 'kanji' | 'words', number> {
    const summary: Record<'hiragana' | 'katakana' | 'kanji' | 'words', number> = {
      hiragana: 0,
      katakana: 0,
      kanji: 0,
      words: 0,
    };
    for (const key of ['hiragana', 'katakana', 'kanji', 'words'] as const) {
      const saved = this.loadQuizState(profileId, key);
      if (saved && Array.isArray(saved.masteredKeys)) {
        summary[key] = saved.masteredKeys.length;
      }
    }
    return summary;
  },
};
