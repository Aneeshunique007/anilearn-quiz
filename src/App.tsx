import { useState, useEffect } from 'react';
import { QuizLayout, QuizTab } from './components/QuizLayout';
import { KanaQuizView } from './components/KanaQuizView';
import { KanjiQuizView } from './components/KanjiQuizView';
import { WordsQuizView } from './components/WordsQuizView';

export function App() {
  const [activeTab, setActiveTab] = useState<QuizTab>('hiragana');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('anilearn_quiz_theme') as 'dark' | 'light') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('anilearn_quiz_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <QuizLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      theme={theme}
      onToggleTheme={handleToggleTheme}
    >
      {activeTab === 'hiragana' && (
        <KanaQuizView key="hiragana" script="hiragana" theme={theme} />
      )}
      {activeTab === 'katakana' && (
        <KanaQuizView key="katakana" script="katakana" theme={theme} />
      )}
      {activeTab === 'kanji' && <KanjiQuizView theme={theme} />}
      {activeTab === 'words' && <WordsQuizView theme={theme} />}
    </QuizLayout>
  );
}

export default App;
