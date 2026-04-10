import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Volume2, Bookmark, Filter } from 'lucide-react';
import { Article } from '../../../types';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface GlossaryViewProps {
  articles: Article[];
}

export const GlossaryView = ({ articles }: GlossaryViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  // Flatten all vocabulary from all articles
  const allVocab = useMemo(() => {
    const vocabMap = new Map();
    articles.forEach(article => {
      article.vocabulary?.forEach(v => {
        // Use word as key to avoid duplicates across articles
        vocabMap.set(v.word, { ...v, sourceTitle: article.title });
      });
    });
    return Array.from(vocabMap.values());
  }, [articles]);

  const filteredVocab = allVocab.filter(v => {
    const matchesSearch = v.word.includes(searchTerm) || v.meaning.includes(searchTerm) || v.reading.includes(searchTerm);
    const matchesLevel = levelFilter === 'All' || v.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const levels = ['All', 'N1', 'N2', 'N3', 'N4', 'N5'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary italic">累積生詞本</h2>
          <p className="text-on-surface-variant font-bold opacity-60 mt-1">
            您已從 {articles.length} 個練習中累積了 {allVocab.length} 個核心詞彙
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
            <input 
              type="text" 
              placeholder="搜尋單字、讀音或意義..."
              className="pl-10 pr-4 h-11 w-full sm:w-64 bg-white border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-outline-variant/30 rounded-xl px-3 h-11">
            <Filter size={16} className="text-on-surface-variant/40" />
            <select 
              className="bg-transparent text-sm font-bold border-none focus:ring-0 outline-none pr-4"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </header>

      {filteredVocab.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((v, idx) => (
            <motion.div
              key={v.word}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6 border-[#e5e1d5] hover:border-secondary/30 transition-all group relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Bookmark size={48} className="text-secondary" />
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-secondary opacity-60 block mb-1 uppercase tracking-tighter">
                      {v.reading}
                    </span>
                    <h3 className="text-2xl font-headline font-bold text-primary group-hover:text-secondary transition-colors">
                      {v.word}
                    </h3>
                  </div>
                  <Badge variant="outline" className="bg-surface">{v.level}</Badge>
                </div>
                
                <p className="text-primary/70 font-bold mb-4 line-clamp-2 min-h-[40px]">
                  {v.meaning}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest truncate max-w-[150px]">
                    來自: {v.sourceTitle}
                  </span>
                  <button 
                    onClick={() => handleSpeak(v.word)}
                    className="p-2 rounded-lg bg-surface-container-low text-primary hover:bg-secondary hover:text-white transition-all active:scale-95"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
          <Bookmark size={48} className="mb-4" />
          <h3 className="text-xl font-bold italic">目前無符合條件的生詞</h3>
          <p className="text-xs uppercase tracking-widest mt-2 font-black">試著調整搜尋條件或從課程中萃取更多單字</p>
        </div>
      )}
    </motion.div>
  );
};
