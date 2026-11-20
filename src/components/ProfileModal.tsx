import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Check,
  Trash2,
  Trophy,
  Cloud,
  LogOut,
  RefreshCw,
  Mail,
  Lock,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { QuizProfile, AVATAR_OPTIONS, profileStore } from '../utils/profileStore';
import { quizSupabase } from '../utils/supabaseClient';
import audio from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: QuizProfile[];
  activeProfile: QuizProfile;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, avatar: string, targetLevel: 'N5' | 'N4' | 'N3') => void;
  onDeleteProfile: (id: string) => void;
  cloudUser: User | null;
  onSyncNow: () => Promise<void>;
  onCloudAuthSuccess: () => Promise<void>;
  theme: 'dark' | 'light';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  cloudUser,
  onSyncNow,
  onCloudAuthSuccess,
  theme,
}) => {
  const [modalTab, setModalTab] = useState<'cloud' | 'local'>('cloud');

  // Local profile form
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [targetLevel, setTargetLevel] = useState<'N5' | 'N4' | 'N3'>('N5');

  // Cloud auth form
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  // Optional runtime Supabase setup if .env is not configured
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [isSbReady, setIsSbReady] = useState(() => quizSupabase.isConfigured());

  if (!isOpen) return null;

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    audio.playCorrect();
    onCreateProfile(name.trim(), avatar, targetLevel);
    setName('');
    onClose();
  };

  const handleCloudSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthInfo(null);
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const res = await quizSupabase.signUp(email, password, displayName);
        if (res.session) {
          await onCloudAuthSuccess();
          setAuthInfo('Account created and signed in!');
        } else {
          setAuthInfo('Account created! Please check your email to confirm, then sign in.');
        }
      } else {
        await quizSupabase.signIn(email, password);
        await onCloudAuthSuccess();
        setAuthInfo('Signed in and progress synced!');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfigureSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbUrl.trim() || !sbKey.trim()) return;
    const ok = quizSupabase.configure(sbUrl, sbKey);
    setIsSbReady(ok);
    if (!ok) {
      setAuthError('Invalid Supabase URL or Anon Key.');
    } else {
      setAuthError(null);
      setAuthInfo('Supabase connected! You can now sign in or create an account.');
    }
  };

  const cardBg =
    theme === 'dark'
      ? 'bg-[#17171C] border-slate-800 text-white'
      : 'bg-white border-slate-200 text-[#1A1A1F]';

  const inputBg =
    theme === 'dark'
      ? 'bg-[#0E0E12] border-slate-800 text-white placeholder-slate-500'
      : 'bg-[#FAF7F5] border-slate-200 text-[#1A1A1F] placeholder-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold font-heading">Account &amp; Profiles</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with Email to sync across devices, or use local profiles
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-slate-500/10 transition cursor-pointer"
            aria-label="Close profiles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className={`grid grid-cols-2 p-1 rounded-xl border text-xs font-bold ${
            theme === 'dark' ? 'bg-[#0E0E12] border-slate-800' : 'bg-[#FAF7F5] border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setModalTab('cloud');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              modalTab === 'cloud'
                ? 'bg-[#FF5E3A] text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Cloud Sync
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setModalTab('local');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              modalTab === 'local'
                ? 'bg-[#FF5E3A] text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Local Profiles ({profiles.length})
          </button>
        </div>

        {modalTab === 'cloud' ? (
          <div className="space-y-4">
            {!isSbReady ? (
              <form onSubmit={handleConfigureSupabase} className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-300">
                  Supabase keys are not configured in <code>.env</code> yet. Paste your Supabase
                  Project URL and Anon Key below to enable Email login &amp; cross-device sync.
                </div>
                <input
                  type="url"
                  required
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-[#FF5E3A] ${inputBg}`}
                />
                <input
                  type="text"
                  required
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  placeholder="Supabase Anon Public Key"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-[#FF5E3A] ${inputBg}`}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white font-bold text-sm transition cursor-pointer"
                >
                  Connect Supabase
                </button>
              </form>
            ) : cloudUser ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border space-y-1 ${
                    theme === 'dark'
                      ? 'bg-[#0E0E12] border-slate-800'
                      : 'bg-[#FAF7F5] border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                    Cloud Sync Active
                  </div>
                  <div className="text-sm font-bold truncate">{cloudUser.email}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Your Hiragana, Katakana, Kanji, and Words progress syncs automatically across
                    devices.
                  </div>
                </div>

                {authInfo && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    {authInfo}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={async () => {
                      setAuthLoading(true);
                      await onSyncNow();
                      setAuthInfo('Progress synced with cloud!');
                      setAuthLoading(false);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${authLoading ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await quizSupabase.signOut();
                      setAuthInfo('Signed out.');
                    }}
                    className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${inputBg}`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCloudSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                        : inputBg
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-[#FF5E3A]/15 text-[#FF5E3A] border-[#FF5E3A]/40'
                        : inputBg
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {authMode === 'signup' && (
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-[#FF5E3A] ${inputBg}`}
                  />
                )}

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-[#FF5E3A] ${inputBg}`}
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 6 characters)"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none focus:border-[#FF5E3A] ${inputBg}`}
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-semibold">
                    {authError}
                  </div>
                )}
                {authInfo && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                    {authInfo}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition cursor-pointer"
                >
                  {authLoading
                    ? 'Please wait...'
                    : authMode === 'login'
                      ? 'Log In & Sync Progress'
                      : 'Create Account & Sync'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Existing Profiles */}
            <div className="space-y-2">
              {profiles.map((p) => {
                const isActive = p.id === activeProfile.id;
                const summary = profileStore.getProfileMasteredSummary(p.id);
                const totalMastered =
                  summary.hiragana + summary.katakana + summary.kanji + summary.words;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      audio.playClick();
                      onSelectProfile(p.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border-2 transition cursor-pointer ${
                      isActive
                        ? 'border-[#FF5E3A] bg-[#FF5E3A]/10'
                        : theme === 'dark'
                          ? 'border-slate-800 bg-[#0E0E12] hover:border-slate-700'
                          : 'border-slate-200 bg-[#FAF7F5] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FF5E3A]/15 text-[#FF5E3A] flex items-center justify-center text-lg font-black font-jp shrink-0">
                        {p.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm truncate">{p.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5E3A]/15 text-[#FF5E3A]">
                            {p.targetLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                            <Trophy className="w-3 h-3" />
                            {p.xp || 0} XP
                          </span>
                          <span>{totalMastered} mastered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive && (
                        <span className="w-6 h-6 rounded-full bg-[#FF5E3A] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onDeleteProfile(p.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create New Profile */}
            <form
              onSubmit={handleLocalSubmit}
              className="pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-[#FF5E3A]" />
                Create Local Profile
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter learner name..."
                maxLength={24}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-[#FF5E3A] ${inputBg}`}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 flex-wrap">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-lg text-sm font-black font-jp flex items-center justify-center border transition cursor-pointer ${
                        avatar === av
                          ? 'border-[#FF5E3A] bg-[#FF5E3A]/15 text-[#FF5E3A] scale-105'
                          : theme === 'dark'
                            ? 'border-slate-800 bg-[#0E0E12] text-slate-300'
                            : 'border-slate-200 bg-[#FAF7F5] text-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  {(['N5', 'N4', 'N3'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        targetLevel === lvl
                          ? 'bg-[#FF5E3A] text-white border-[#FF5E3A]'
                          : theme === 'dark'
                            ? 'border-slate-800 bg-[#0E0E12] text-slate-300'
                            : 'border-slate-200 bg-[#FAF7F5] text-slate-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF5E3A] hover:bg-[#E84E29] disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition cursor-pointer disabled:cursor-not-allowed"
              >
                Create &amp; Switch Profile
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
