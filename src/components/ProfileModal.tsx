import React, { useState } from 'react';
import { X, UserPlus, Check, Trash2, Trophy } from 'lucide-react';
import { QuizProfile, AVATAR_OPTIONS, profileStore } from '../utils/profileStore';
import audio from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: QuizProfile[];
  activeProfile: QuizProfile;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, avatar: string, targetLevel: 'N5' | 'N4' | 'N3') => void;
  onDeleteProfile: (id: string) => void;
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
  theme,
}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [targetLevel, setTargetLevel] = useState<'N5' | 'N4' | 'N3'>('N5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    audio.playCorrect();
    onCreateProfile(name.trim(), avatar, targetLevel);
    setName('');
    onClose();
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
        className={`w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto ${cardBg}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold font-heading">Learner Profiles</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each profile keeps its own separate quiz progress &amp; XP
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

        {/* Existing Profiles */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Switch Profile ({profiles.length})
          </div>
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
                    <div className="w-10 h-10 rounded-xl bg-[#FF5E3A]/15 flex items-center justify-center text-xl shrink-0">
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
        </div>

        {/* Create New Profile */}
        <form
          onSubmit={handleSubmit}
          className="pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-3"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-[#FF5E3A]" />
            Create New Profile
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
            {/* Avatar Picker */}
            <div className="flex items-center gap-1 flex-wrap">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition cursor-pointer ${
                    avatar === av
                      ? 'border-[#FF5E3A] bg-[#FF5E3A]/15 scale-105'
                      : theme === 'dark'
                        ? 'border-slate-800 bg-[#0E0E12]'
                        : 'border-slate-200 bg-[#FAF7F5]'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            {/* Target JLPT */}
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
    </div>
  );
};
