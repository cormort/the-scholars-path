import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Lightbulb, ChevronRight, Calendar } from 'lucide-react';
import { Article } from '../../../types';
import { Card } from '../../ui/Card';

interface InsightsViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const InsightsView = ({ articles, onSelectArticle }: InsightsViewProps) => {
  // Filter articles that have insights generated
  const articlesWithInsights = articles.filter(art => art.insight && art.insight.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-headline font-bold text-primary italic">語言洞察流</h2>
        <p className="text-on-surface-variant font-bold opacity-60 mt-1">
          從您的學習歷程中彙整的專家點評與文化脈絡
        </p>
      </header>

      {articlesWithInsights.length > 0 ? (
        <div className="space-y-6">
          {articlesWithInsights.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                className="p-8 border-[#e5e1d5] hover:border-primary/20 transition-all bg-white relative group cursor-pointer"
                onClick={() => onSelectArticle(art)}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={14} className="text-on-surface-variant/40" />
                      <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{art.readTime}</span>
                    </div>
                    <h3 className="text-xl font-headline font-bold text-primary mb-4 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant/60">
                      <span>{art.category}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>{art.level}</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 md:border-l border-primary/5 md:pl-8 relative">
                    <div className="absolute -top-2 -right-2 text-primary/5 group-hover:text-secondary/10 transition-colors">
                      <BrainCircuit size={80} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb size={18} className="text-secondary" />
                      <span className="text-xs font-black uppercase tracking-widest text-secondary">專家深度點評</span>
                    </div>
                    
                    <p className="text-primary/80 leading-[1.8] font-medium italic relative z-10">
                      {art.insight}
                    </p>
                    
                    <div className="mt-6 flex justify-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        重新閱讀原文 <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
          <BrainCircuit size={48} className="mb-4" />
          <h3 className="text-xl font-bold italic">目前尚無已生成的洞察</h3>
          <p className="text-xs uppercase tracking-widest mt-2 font-black">
            點擊課程中的「語言洞察」按鈕，專家分析將會彙整於此
          </p>
        </div>
      )}
    </motion.div>
  );
};
