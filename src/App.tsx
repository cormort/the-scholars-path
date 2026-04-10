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
import { synthesizeArticle } from './services/ai';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';

// Feature Components
import { SynthesisPanel } from './components/features/dashboard/SynthesisPanel';
import { ArticleGrid } from './components/features/dashboard/ArticleGrid';
import { LessonView } from './components/features/lesson/LessonView';

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
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSynthesize = async () => {
    if (!inputText.trim()) return;
    setIsSynthesizing(true);
    
    try {
      const result = await synthesizeArticle(inputText, apiKey);
      const newArticle: Article = {
        id: Date.now().toString(),
        title: result.title || '未命名文章',
        description: result.description || '由 AI 生成的練習內容。',
        level: result.level || 'N1',
        category: result.category || '學習',
        content: result.content || inputText,
        translationLiteral: result.translationLiteral || '',
        translationNatural: result.translationNatural || '',
        vocabulary: result.vocabulary || [],
        insight: result.insight || '',
        image: `https://picsum.photos/seed/${result.category || 'study'}/1000/600`,
        readTime: '閱讀需 5 分鐘'
      };

      setArticles([newArticle, ...articles]);
      setSelectedArticle(newArticle);
      setInputText('');
    } catch (error) {
      console.error("Synthesis failed:", error);
      alert("合成失敗，請檢查您的 API Key 設定。");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="md:pl-64 pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          <AnimatePresence mode="wait">
            {!selectedArticle ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">當前學習進度</h1>
                    <p className="text-on-surface-variant mt-2 font-bold">當前進度：已完成 N1 目標的 84%</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-black flex items-center gap-2 shadow-sm">
                      <Zap size={18} className="fill-current" /> 連續學習 34 天
                    </div>
                  </div>
                </header>

                {/* Generator Interface */}
                <SynthesisPanel 
                  inputText={inputText}
                  setInputText={setInputText}
                  onSynthesize={handleSynthesize}
                  isSynthesizing={isSynthesizing}
                />

                {/* Article Grid */}
                <ArticleGrid 
                  articles={articles} 
                  onSelectArticle={setSelectedArticle} 
                />
              </motion.div>
            ) : (
              <LessonView 
                article={selectedArticle} 
                onBack={() => setSelectedArticle(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}
