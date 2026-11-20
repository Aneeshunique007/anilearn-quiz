import { useState, useEffect, useCallback } from 'react';
import { QuizLayout, QuizTab } from './components/QuizLayout';
import { KanaQuizView } from './components/KanaQuizView';
import { KanjiQuizView } from './components/KanjiQuizView';
import { WordsQuizView } from './components/WordsQuizView';
import { ProfileModal } from './components/ProfileModal';
import { profileStore, QuizProfile } from './utils/profileStore';

export function App() {
  const [activeTab, setActiveTab] = useState<QuizTab>('hiragana');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('anilearn_quiz_theme') as 'dark' | 'light') || 'light';
  });

  const [profiles, setProfiles] = useState<QuizProfile[]>(() => profileStore.getProfiles());
  const [activeProfile, setActiveProfile] = useState<QuizProfile>(() =>
    profileStore.getActiveProfile()
  );
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('anilearn_quiz_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectProfile = (id: string) => {
    const next = profileStore.setActiveProfileId(id);
    setActiveProfile(next);
    setProfiles(profileStore.getProfiles());
  };

  const handleCreateProfile = (
    name: string,
    avatar: string,
    targetLevel: 'N5' | 'N4' | 'N3'
  ) => {
    const created = profileStore.createProfile(name, avatar, targetLevel);
    setProfiles(profileStore.getProfiles());
    setActiveProfile(created);
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profileStore.deleteProfile(id);
    setProfiles(updated);
    setActiveProfile(profileStore.getActiveProfile());
  };

  const handleAddXp = useCallback(
    (amount: number) => {
      const updated = profileStore.addXp(activeProfile.id, amount);
      setProfiles(updated);
      const refreshed = updated.find((p) => p.id === activeProfile.id);
      if (refreshed) setActiveProfile(refreshed);
    },
    [activeProfile.id]
  );

  return (
    <QuizLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      activeProfile={activeProfile}
      onOpenProfileModal={() => setProfileModalOpen(true)}
    >
      {activeTab === 'hiragana' && (
        <KanaQuizView
          key={`hiragana-${activeProfile.id}`}
          script="hiragana"
          theme={theme}
          profileId={activeProfile.id}
          onAddXp={handleAddXp}
        />
      )}
      {activeTab === 'katakana' && (
        <KanaQuizView
          key={`katakana-${activeProfile.id}`}
          script="katakana"
          theme={theme}
          profileId={activeProfile.id}
          onAddXp={handleAddXp}
        />
      )}
      {activeTab === 'kanji' && (
        <KanjiQuizView
          key={`kanji-${activeProfile.id}`}
          theme={theme}
          profileId={activeProfile.id}
          onAddXp={handleAddXp}
        />
      )}
      {activeTab === 'words' && (
        <WordsQuizView
          key={`words-${activeProfile.id}`}
          theme={theme}
          profileId={activeProfile.id}
          onAddXp={handleAddXp}
        />
      )}

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        theme={theme}
      />
    </QuizLayout>
  );
}

export default App;
