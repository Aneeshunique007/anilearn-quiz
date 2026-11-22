import { useState, useEffect, useCallback } from 'react';
import { QuizLayout, QuizTab } from './components/QuizLayout';
import { KanaQuizView } from './components/KanaQuizView';
import { KanjiQuizView } from './components/KanjiQuizView';
import { WordsQuizView } from './components/WordsQuizView';
import { RetrainHubView } from './components/RetrainHubView';
import { ReviewPageView } from './components/ReviewPageView';
import { QuizHomeView } from './components/QuizHomeView';
import { ProfileModal } from './components/ProfileModal';
import { profileStore, QuizProfile } from './utils/profileStore';
import { quizSupabase, CloudAccountUser } from './utils/supabaseClient';

export function App() {
  const [activeTab, setActiveTab] = useState<QuizTab>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('anilearn_quiz_theme') as 'dark' | 'light') || 'light';
  });

  const [profiles, setProfiles] = useState<QuizProfile[]>(() => profileStore.getProfiles());
  const [activeProfile, setActiveProfile] = useState<QuizProfile>(() =>
    profileStore.getActiveProfile()
  );
  const [cloudUser, setCloudUser] = useState<CloudAccountUser | null>(() => quizSupabase.getUser());
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(
    () => !quizSupabase.getUser()
  );
  const [retrainOpen, setRetrainOpen] = useState<boolean>(false);
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);
  const [syncVersion, setSyncVersion] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('anilearn_quiz_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const pullCloudProgress = useCallback(
    async (user: CloudAccountUser | null, profileId: string) => {
      if (!user) return;
      await quizSupabase.pullAndMerge(user, profileId);
      setProfiles(profileStore.getProfiles());
      setActiveProfile(profileStore.getActiveProfile());
      setSyncVersion((v) => v + 1);
    },
    []
  );

  useEffect(() => {
    const u = quizSupabase.getUser();
    setCloudUser(u);
    if (u) pullCloudProgress(u, activeProfile.id);
  }, [activeProfile.id, pullCloudProgress]);

  // Auto-push debounced whenever local quiz progress saves
  useEffect(() => {
    const onProgressSaved = () => {
      quizSupabase.schedulePush(cloudUser, activeProfile.id);
    };
    window.addEventListener('anilearn_quiz_progress_saved', onProgressSaved);
    return () => window.removeEventListener('anilearn_quiz_progress_saved', onProgressSaved);
  }, [cloudUser, activeProfile.id]);

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
      quizSupabase.schedulePush(cloudUser, activeProfile.id);
    },
    [activeProfile.id, cloudUser]
  );

  return (
    <QuizLayout
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setRetrainOpen(false);
        setReviewOpen(false);
        setActiveTab(tab);
      }}
      onGoHome={() => {
        setRetrainOpen(false);
        setReviewOpen(false);
        setActiveTab('home');
      }}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      activeProfile={activeProfile}
      onOpenProfileModal={() => setProfileModalOpen(true)}
      isRetrainOpen={retrainOpen}
      onToggleRetrain={() => {
        setReviewOpen(false);
        setRetrainOpen((prev) => !prev);
      }}
      isReviewOpen={reviewOpen}
      onToggleReview={() => {
        setRetrainOpen(false);
        setReviewOpen((prev) => !prev);
      }}
    >
      {reviewOpen ? (
        <ReviewPageView
          key={`review-${activeProfile.id}-${syncVersion}`}
          profileId={activeProfile.id}
          theme={theme}
          onBack={() => setReviewOpen(false)}
          onAddXp={handleAddXp}
        />
      ) : retrainOpen ? (
        <RetrainHubView
          key={`retrain-${activeProfile.id}-${syncVersion}`}
          profileId={activeProfile.id}
          theme={theme}
          onBack={() => setRetrainOpen(false)}
          onAddXp={handleAddXp}
        />
      ) : activeTab === 'home' ? (
        <QuizHomeView
          key={`home-${activeProfile.id}-${syncVersion}`}
          profile={activeProfile}
          theme={theme}
          onSelectQuiz={(tab) => setActiveTab(tab)}
          onOpenRetrain={() => setRetrainOpen(true)}
          onOpenReview={() => setReviewOpen(true)}
        />
      ) : (
        <>
          {activeTab === 'hiragana' && (
            <KanaQuizView
              key={`hiragana-${activeProfile.id}-${syncVersion}`}
              script="hiragana"
              theme={theme}
              profileId={activeProfile.id}
              onAddXp={handleAddXp}
            />
          )}
          {activeTab === 'katakana' && (
            <KanaQuizView
              key={`katakana-${activeProfile.id}-${syncVersion}`}
              script="katakana"
              theme={theme}
              profileId={activeProfile.id}
              onAddXp={handleAddXp}
            />
          )}
          {activeTab === 'kanji' && (
            <KanjiQuizView
              key={`kanji-${activeProfile.id}-${syncVersion}`}
              theme={theme}
              profileId={activeProfile.id}
              onAddXp={handleAddXp}
            />
          )}
          {activeTab === 'words' && (
            <WordsQuizView
              key={`words-${activeProfile.id}-${syncVersion}`}
              theme={theme}
              profileId={activeProfile.id}
              onAddXp={handleAddXp}
            />
          )}
        </>
      )}

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        cloudUser={cloudUser}
        onSyncNow={async () => {
          if (cloudUser) {
            await quizSupabase.pushNow(cloudUser, activeProfile.id);
          }
        }}
        onCloudAuthSuccess={async (user) => {
          setCloudUser(user);
          if (user) await pullCloudProgress(user, activeProfile.id);
        }}
        theme={theme}
      />
    </QuizLayout>
  );
}

export default App;
