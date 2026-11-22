import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { profileStore } from './profileStore';

const SUPABASE_CONFIG_KEY = 'anilearn_quiz_supabase_config';
const CLOUD_USER_KEY = 'anilearn_quiz_cloud_user';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) {
    return (import.meta as unknown as { env: Record<string, string> }).env[key] || '';
  }
  return '';
};

export interface CloudAccountUser {
  email: string;
  displayName: string;
}

export interface CloudQuizAccountRow {
  email: string;
  password?: string;
  display_name: string | null;
  xp: number;
  hiragana_state: unknown;
  katakana_state: unknown;
  kanji_state: unknown;
  words_state: unknown;
  updated_at: string;
}

class QuizSupabaseService {
  private client: SupabaseClient | null = null;
  private url: string = getEnvVar('VITE_SUPABASE_URL');
  private anonKey: string = getEnvVar('VITE_SUPABASE_ANON_KEY');
  private syncTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if ((!this.url || !this.anonKey) && typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.url && parsed?.anonKey) {
            this.url = parsed.url;
            this.anonKey = parsed.anonKey;
          }
        }
      } catch {}
    }

    if (this.url && this.anonKey) {
      try {
        this.client = createClient(this.url, this.anonKey);
      } catch (err) {
        console.warn('[Supabase] Init failed:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public isConfigured(): boolean {
    return this.client !== null;
  }

  public configure(url: string, anonKey: string): boolean {
    this.url = url.trim();
    this.anonKey = anonKey.trim();
    try {
      localStorage.setItem(
        SUPABASE_CONFIG_KEY,
        JSON.stringify({ url: this.url, anonKey: this.anonKey })
      );
    } catch {}
    this.init();
    return this.isConfigured();
  }

  public getUser(): CloudAccountUser | null {
    try {
      const raw = localStorage.getItem(CLOUD_USER_KEY);
      return raw ? (JSON.parse(raw) as CloudAccountUser) : null;
    } catch {
      return null;
    }
  }

  private setUser(user: CloudAccountUser | null) {
    try {
      if (user) {
        localStorage.setItem(CLOUD_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CLOUD_USER_KEY);
      }
    } catch {}
  }

  public async signUp(email: string, password: string, displayName: string): Promise<CloudAccountUser> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];

    const { data: existing, error: checkError } = await this.client
      .from('quiz_accounts')
      .select('email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (checkError) throw new Error(checkError.message);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const { error: insertError } = await this.client.from('quiz_accounts').insert([
      {
        email: cleanEmail,
        password,
        display_name: cleanName,
        xp: 0,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (insertError) throw new Error(insertError.message);

    const user: CloudAccountUser = { email: cleanEmail, displayName: cleanName };
    this.setUser(user);
    return user;
  }

  public async signIn(email: string, password: string): Promise<CloudAccountUser> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await this.client
      .from('quiz_accounts')
      .select('email, password, display_name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No account found with this email. Please create an account first.');
    if (data.password !== password) throw new Error('Incorrect password.');

    const user: CloudAccountUser = {
      email: data.email,
      displayName: data.display_name || cleanEmail.split('@')[0],
    };
    this.setUser(user);
    return user;
  }

  public signOut() {
    this.setUser(null);
  }

  public async pullAndMerge(
    user: CloudAccountUser,
    localProfileId: string
  ): Promise<{ xp: number } | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('quiz_accounts')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Pull failed:', error.message);
      return null;
    }

    if (!data) {
      await this.pushNow(user, localProfileId);
      return null;
    }

    const row = data as CloudQuizAccountRow;
    const profiles = profileStore.getProfiles();
    const localProfile = profiles.find((p) => p.id === localProfileId);
    const localXp = localProfile?.xp || 0;
    const mergedXp = Math.max(localXp, row.xp || 0);

    if (mergedXp > localXp) {
      profileStore.addXp(localProfileId, mergedXp - localXp);
    }

    const stateMap: Array<{
      key: 'hiragana' | 'katakana' | 'kanji' | 'words';
      cloudState: unknown;
    }> = [
      { key: 'hiragana', cloudState: row.hiragana_state },
      { key: 'katakana', cloudState: row.katakana_state },
      { key: 'kanji', cloudState: row.kanji_state },
      { key: 'words', cloudState: row.words_state },
    ];

    for (const { key, cloudState } of stateMap) {
      if (cloudState && typeof cloudState === 'object') {
        const cloudObj = cloudState as {
          questions?: unknown[];
          masteredKeys?: string[];
          learnedKeys?: string[];
          updatedAt?: string;
        };
        for (const k of cloudObj.learnedKeys || cloudObj.masteredKeys || []) {
          profileStore.markItemLearned(localProfileId, key, k);
        }
        const localObj = profileStore.loadQuizState(localProfileId, key);

        if (!localObj) {
          if (Array.isArray(cloudObj.questions) && cloudObj.questions.length > 0) {
            profileStore.saveQuizState(localProfileId, key, cloudObj as never);
          }
        } else {
          const localMastered = localObj.masteredKeys?.length || 0;
          const cloudMastered = cloudObj.masteredKeys?.length || 0;
          if (
            cloudMastered > localMastered ||
            (cloudMastered === localMastered &&
              (cloudObj.updatedAt || '') > (localObj.updatedAt || ''))
          ) {
            if (Array.isArray(cloudObj.questions) && cloudObj.questions.length > 0) {
              profileStore.saveQuizState(localProfileId, key, cloudObj as never);
            }
          }
        }
      }
    }

    return { xp: mergedXp };
  }

  public async pushNow(user: CloudAccountUser, localProfileId: string): Promise<boolean> {
    if (!this.client) return false;
    const profiles = profileStore.getProfiles();
    const active = profiles.find((p) => p.id === localProfileId);

    const buildStatePayload = (key: 'hiragana' | 'katakana' | 'kanji' | 'words') => {
      const s = profileStore.loadQuizState(localProfileId, key);
      const learnedKeys = profileStore.getLearnedList(localProfileId, key);
      return s ? { ...s, learnedKeys } : learnedKeys.length > 0 ? { learnedKeys } : null;
    };

    const payload = {
      display_name: user.displayName || active?.name || user.email,
      xp: active?.xp || 0,
      hiragana_state: buildStatePayload('hiragana'),
      katakana_state: buildStatePayload('katakana'),
      kanji_state: buildStatePayload('kanji'),
      words_state: buildStatePayload('words'),
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client
      .from('quiz_accounts')
      .update(payload)
      .eq('email', user.email);

    if (error) {
      console.warn('[Supabase] Push failed:', error.message);
      return false;
    }
    return true;
  }

  public schedulePush(user: CloudAccountUser | null, localProfileId: string) {
    if (!this.client || !user) return;
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => {
      this.pushNow(user, localProfileId).catch(() => {});
    }, 1500);
  }
}

export const quizSupabase = new QuizSupabaseService();
