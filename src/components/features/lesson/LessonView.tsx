import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, BrainCircuit, Bookmark, Lightbulb } from 'lucide-react';
import { Article } from '../../../types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface LessonViewProps {
  article: Article;
  onBack: () => void;
}

export const LessonView = ({ article, onBack }: LessonViewProps) => {
  return (
    <motion.div
      key="lesson"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pb-24"
    >
      <button 
        className="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-all group" 
        onClick={onBack}
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        返回課程大綱
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reading Content */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-12 border-[#e5e1d5] bg-white">
            <Badge variant="secondary" className="mb-6">閱讀練習</Badge>
            <h2 className="text-4xl font-headline font-bold text-primary mb-10 border-b-2 border-secondary/10 pb-6 leading-tight">
              {article.title}
            </h2>
            <div className="japanese-text text-2xl text-primary font-medium leading-[2.2] space-y-8">
              <p>{article.content}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct Translation */}
            <div className="p-8 bg-[#fdfdfd] border border-outline-variant/30 border-l-4 border-l-primary rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-primary opacity-10 uppercase tracking-widest">Literal</div>
              <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded mb-4 uppercase tracking-wider">字面直譯</span>
              <p className="text-primary/80 leading-relaxed italic font-medium">{article.translationLiteral}</p>
            </div>
            {/* Natural Translation */}
            <div className="p-8 bg-secondary-container/20 border border-outline-variant/30 border-l-4 border-l-secondary rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-secondary opacity-10 uppercase tracking-widest">Natural</div>
              <span className="inline-block px-3 py-1 bg-secondary/5 text-secondary text-[10px] font-bold rounded mb-4 uppercase tracking-wider">自然意譯</span>
              <p className="text-secondary font-bold leading-relaxed">{article.translationNatural}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" className="flex-1 py-7 text-lg gap-3 shadow-lg">
              <Volume2 size={22} /> 發音指南
            </Button>
            <Button variant="outline" className="flex-1 py-7 text-lg gap-3">
              <BrainCircuit size={22} /> 語言洞察
            </Button>
          </div>
        </div>

        {/* Sidebar: Insights & Vocab */}
        <aside className="space-y-8">
          <Card className="p-8 border-[#e5e1d5]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-bold text-primary uppercase text-xs tracking-widest">核心單詞庫</h4>
              <Bookmark size={20} className="text-on-surface-variant/30" />
            </div>
            <div className="space-y-5">
              {article.vocabulary?.map((vocab, idx) => (
                <div key={idx} className="p-5 bg-surface-container-low/40 rounded-xl border border-transparent hover:border-secondary/20 hover:bg-white transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl font-headline font-bold text-primary group-hover:text-secondary transition-colors">{vocab.word}</span>
                    <Badge variant="outline" className="bg-white">{vocab.level}</Badge>
                  </div>
                  <p className="text-xs text-on-surface-variant/50 mb-3 font-bold">{vocab.reading}</p>
                  <p className="text-sm font-bold text-primary/70">{vocab.meaning}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-10 text-xs tracking-widest uppercase py-4">
              匯出至 Anki
            </Button>
          </Card>

          <div className="bg-primary p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <Lightbulb size={120} />
            </div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-widest mb-6 opacity-60">AI 智能分析</h4>
            <p className="text-base leading-relaxed mb-8 font-medium">
              {article.insight}
            </p>
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
              <Lightbulb size={16} className="text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">語法提示</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
