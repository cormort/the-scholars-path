/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

// Types
import { Article, TabType } from './types';

// Services
import { synthesizeArticle, listAvailableModels } from './services/ai';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';

// Feature Components
import { SynthesisPanel } from './components/features/dashboard/SynthesisPanel';
import { ArticleGrid } from './components/features/dashboard/ArticleGrid';
import { LessonView } from './components/features/lesson/LessonView';
import { GlossaryView } from './components/features/glossary/GlossaryView';
import { InsightsView } from './components/features/insights/InsightsView';

// --- Mock Data (Translated to Traditional Chinese) ---

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: '夏目漱石《心》的哲學背景',
    description: '深度探討明治時代散文的語言細微差別及其現代詮釋。',
    level: 'N1',
    category: '文學',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
    readTime: '閱讀需 12 分鐘',
    content: '為了深刻理解日語文章，我們不僅需要理解上下文，還需要解讀作者在選詞中蘊含的情感。本文將探討現代文學中微妙的語義差異。',
    translationLiteral: '為了深刻地理解日語句子，有必要解讀不僅僅是脈絡，還有作者的詞語選擇中被包含的情感。',
    translationNatural: '要真正領悟日語散文的精髓，必須超越表面細節，解讀隱藏在每個詞彙選擇背後的特定情感重量。',
    vocabulary: [
      { word: '読み解く', reading: 'よみとく', meaning: '解讀；深入閱讀並理解。', level: 'N1' },
      { word: '文脈', reading: 'ぶんみゃく', meaning: '上下文；思路。', level: 'N2' },
      { word: '探求', reading: 'たんきゅう', meaning: '探求；尋找；調查。', level: 'N1' }
    ],
    insight: '動詞「読み解く」（解讀）的使用暗示了一種複雜性，這是簡單的「読む」（讀）所無法捕捉的。它建議讀者像偵探一樣，逐層揭開意義的層次。'
  },
  {
    id: '2',
    title: '日本市場的數位轉型與挑戰',
    description: '分析近期日經財務報告中使用的企業詞彙。',
    level: 'N2',
    category: '經濟',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000',
    readTime: '閱讀需 8 分鐘',
    content: '日本企業的數位轉型（DX）不僅僅是技術引進，更要求組織文化進行根本性的變革。',
    translationLiteral: '日本企業的數位轉型（DX），不僅僅停留在單純的技術導入，還要求著組織文化的根本性的變革。',
    translationNatural: '日本商業領域的數位轉型遠不止於採用新技術；它要求從根本上對企業文化進行全面的翻修。',
    vocabulary: [
      { word: '變革', reading: 'へんかく', meaning: '變革；改革。', level: 'N2' },
      { word: '根本的', reading: 'こんぽんてき', meaning: '根本的；徹底的。', level: 'N2' }
    ],
    insight: '「DX」一詞在日本商業語境中通常用來表示廣泛的策略轉變，而不僅僅是 IT 升級。'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('models/gemini-1.5-flash');
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  // Persistence: Load articles from localStorage or use initial
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('scholar_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  // Save articles whenever they change
  React.useEffect(() => {
    localStorage.setItem('scholar_articles', JSON.stringify(articles));
  }, [articles]);

  // Save API key
  React.useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  const handleFetchModels = async (key: string) => {
    if (!key || key.length < 20) return;
    setIsFetchingModels(true);
    try {
      const models = await listAvailableModels(key);
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(selectedModel)) {
        setSelectedModel(models[0]);
      }
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleUpdateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(art => art.id === id ? { ...art, ...updates } : art));
    if (selectedArticle?.id === id) {
      setSelectedArticle(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleSynthesize = async () => {
    if (!inputText.trim()) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    
    setIsSynthesizing(true);
    try {
      const result = await createBaseLesson(inputText, apiKey, selectedModel);
      const newArticle: Article = {
        id: Date.now().toString(),
        title: result.title || '新生成的練習',
        description: result.description || 'AI 分析內容',
        level: result.level || 'N2',
        category: result.category || '一般',
        content: result.content || inputText,
        translationLiteral: result.translationLiteral || '',
        translationNatural: result.translationNatural || '',
        vocabulary: [], // Start empty for on-demand
        insight: '',    // Start empty for on-demand
        image: `https://picsum.photos/seed/${Date.now()}/1000/600`,
        readTime: '閱讀需 5 分鐘'
      };

      setArticles([newArticle, ...articles]);
      setSelectedArticle(newArticle);
      setInputText('');
    } catch (error) {
      console.error("Synthesis failed:", error);
      alert("合成失敗，請確認 API Key 與模型選擇。");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleFetchVocab = async (article: Article) => {
    try {
      const vocab = await fetchVocabulary(article.content, apiKey, selectedModel);
      handleUpdateArticle(article.id, { vocabulary: vocab });
    } catch (error) {
      console.error("Vocab fetch failed:", error);
    }
  };

  const handleFetchInsight = async (article: Article) => {
    try {
      const insight = await fetchLinguisticInsight(article.content, apiKey, selectedModel);
      handleUpdateArticle(article.id, { insight });
    } catch (error) {
      console.error("Insight fetch failed:", error);
    }
  };

  const renderContent = () => {
    if (selectedArticle) {
      return (
        <LessonView 
          article={selectedArticle} 
          onBack={() => setSelectedArticle(null)}
          onFetchVocab={() => handleFetchVocab(selectedArticle)}
          onFetchInsight={() => handleFetchInsight(selectedArticle)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-4xl font-headline font-bold text-primary tracking-tight italic">當前學習進度</h1>
                <p className="text-on-surface-variant mt-2 font-bold opacity-60">探索您的個人化語言路徑</p>
              </div>
              <div className="flex gap-3">
                <div className="px-5 py-2.5 bg-secondary/10 text-secondary rounded-full text-sm font-black flex items-center gap-2 shadow-sm border border-secondary/20">
                  <Zap size={18} className="fill-current" /> 連續學習 34 天
                </div>
              </div>
            </header>
            <SynthesisPanel 
              inputText={inputText}
              setInputText={setInputText}
              onSynthesize={handleSynthesize}
              isSynthesizing={isSynthesizing}
            />
            <ArticleGrid 
              articles={articles} 
              onSelectArticle={setSelectedArticle} 
            />
          </motion.div>
        );
      case 'translator':
        return (
          <motion.div
            key="translator"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
             <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center italic">智能編譯空間</h2>
             <SynthesisPanel 
                inputText={inputText}
                setInputText={setInputText}
                onSynthesize={handleSynthesize}
                isSynthesizing={isSynthesizing}
              />
          </motion.div>
        );
      case 'courses':
        return (
          <motion.div
            key="courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-headline font-bold text-primary mb-8 border-b border-primary/10 pb-4">我的學習庫</h2>
            <ArticleGrid 
              articles={articles} 
              onSelectArticle={setSelectedArticle} 
            />
          </motion.div>
        );
      case 'insights':
        return (
          <InsightsView 
            articles={articles} 
            onSelectArticle={setSelectedArticle}
          />
        );
      case 'glossary':
        return (
          <GlossaryView 
            articles={articles}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <h2 className="text-xl font-bold italic">研發中內容...</h2>
            <p className="text-xs uppercase tracking-widest mt-2 font-black">Coming Soon in Next Update</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null); // Switch back to main tab when clicking sidebar
        }} 
      />

      <main className="md:pl-64 pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={(key) => {
          setApiKey(key);
          handleFetchModels(key);
        }}
        availableModels={availableModels}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isFetchingModels={isFetchingModels}
        onFetchModels={() => handleFetchModels(apiKey)}
      />
    </div>
  );
}
