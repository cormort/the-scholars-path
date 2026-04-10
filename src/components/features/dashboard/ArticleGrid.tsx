import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileText } from 'lucide-react';
import { Article } from '../../../types';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  key?: React.Key;
}

const ArticleCard = ({ article, onClick }: ArticleCardProps) => (
  <Card 
    onClick={onClick}
    className="group cursor-pointer overflow-hidden h-full flex flex-col"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        src={article.image} 
        alt={article.title}
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <Badge variant="primary">{article.level}</Badge>
        <Badge variant="surface">{article.category}</Badge>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl font-headline font-bold text-primary mb-3 line-clamp-2 leading-tight">
        {article.title}
      </h3>
      <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed mb-6 font-medium">
        {article.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
        <span className="text-xs font-bold text-on-surface-variant/40 tracking-widest uppercase">
          {article.readTime}
        </span>
        <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  </Card>
);

export const ArticleGrid = ({ articles, onSelectArticle }: { articles: Article[], onSelectArticle: (a: Article) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {articles.map((article) => (
      <ArticleCard 
        key={article.id} 
        article={article} 
        onClick={() => onSelectArticle(article)} 
      />
    ))}
    <Card className="border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/20 min-h-[360px]">
      <div className="w-16 h-16 rounded-full bg-[#f0ede3] flex items-center justify-center mb-6 text-on-surface-variant/30">
        <FileText size={32} />
      </div>
      <h4 className="font-headline font-bold text-primary">分析更多文本</h4>
      <p className="text-xs text-on-surface-variant/60 mt-3 max-w-[200px] leading-relaxed font-medium">
        貼入新聞報導或隨筆，生成專屬您的個性化日語課程。
      </p>
    </Card>
  </div>
);
