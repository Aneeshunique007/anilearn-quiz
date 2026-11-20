import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { profileStore } from './profileStore';

const SUPABASE_CONFIG_KEY = 'anilearn_quiz_supabase_config';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) {
    return (import.meta as unknown as { env: Record<string, string> }).env[key] || '';
  }
  return '';
};

export interface CloudQuizProgressRow {
  user_id: string;
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
        this.client = createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'anilearn_quiz_sb_auth',
          },
        });
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

  public async getUser(): Promise<User | null> {
    if (!this.client) return null;
    const { data } = await this.client.auth.getUser();
    return data.user || null;
  }

  public onAuthStateChange(cb: (user: User | null) => void): () => void {
    if (!this.client) return () => {};
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      cb(session?.user || null);
    });
    return () => data.subscription.unsubscribe();
  }

  public async signUp(email: string, password: string, displayName: string) {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { data, error } = await this.client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() || email.split('@')[0] },
      },
    });
    if (error) throw error;
    return data;
  }

  public async signIn(email: string, password: string) {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    return data;
  }

  public async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
  }

  public async pullAndMerge(user: User, localProfileId: string): Promise<{ xp: number } | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('quiz_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Pull failed:', error.message);
      return null;
    }

    if (!data) {
      // First time on cloud: push current local progress up
      await this.pushNow(user, localProfileId);
      return null;
    }

    const row = data as CloudQuizProgressRow;
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
          updatedAt?: string;
        };
        const localObj = profileStore.loadQuizState(localProfileId, key);

        if (!localObj) {
          if (Array.isArray(cloudObj.questions) && cloudObj.questions.length > 0) {
            profileStore.saveQuizState(localProfileId, key, cloudObj as never);
          }
        } else {
          // Keep whichever has more mastered items (or newer timestamp on tie)
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

  public async pushNow(user: User, localProfileId: string): Promise<boolean> {
    if (!this.client) return false;
    const profiles = profileStore.getProfiles();
    const active = profiles.find((p) => p.id === localProfileId);

    const payload: CloudQuizProgressRow = {
      user_id: user.id,
      display_name:
        (user.user_metadata?.display_name as string) || active?.name || user.email || 'Learner',
      xp: active?.xp || 0,
      hiragana_state: profileStore.loadQuizState(localProfileId, 'hiragana'),
      katakana_state: profileStore.loadQuizState(localProfileId, 'katakana'),
      kanji_state: profileStore.loadQuizState(localProfileId, 'kanji'),
      words_state: profileStore.loadQuizState(localProfileId, 'words'),
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client
      .from('quiz_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn('[Supabase] Push failed:', error.message);
      return false;
    }
    return true;
  }

  public schedulePush(user: User | null, localProfileId: string) {
    if (!this.client || !user) return;
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => {
      this.pushNow(user, localProfileId).catch(() => {});
    }, 1500);
  }
}

export const quizSupabase = new QuizSupabaseService();
