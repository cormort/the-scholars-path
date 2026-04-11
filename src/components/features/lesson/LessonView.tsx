import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, BrainCircuit, Bookmark, Lightbulb } from 'lucide-react';
import { Article } from '../../../types';
import { Button } from '../../ui/Button';
import { useJapaneseVoice } from '../../../hooks/useJapaneseVoice';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface LessonViewProps {
  article: Article;
  onBack: () => void;
  onFetchVocab: () => void;
  onFetchInsight: () => void;
}

export const LessonView = ({ article, onBack, onFetchVocab, onFetchInsight }: LessonViewProps) => {
  const [isFetchingVocab, setIsFetchingVocab] = React.useState(false);
  const [isFetchingInsight, setIsFetchingInsight] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const voice = useJapaneseVoice();

  const handleFetchVocab = async () => {
    setIsFetchingVocab(true);
    await onFetchVocab();
    setIsFetchingVocab(false);
  };

  const handleFetchInsight = async () => {
    setIsFetchingInsight(true);
    await onFetchInsight();
    setIsFetchingInsight(false);
  };

const handleSpeak = (text: string) => {
  if (isSpeaking) return;
  setIsSpeaking(true);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  // If a Japanese voice has been resolved, use it for higher quality.
  if (voice) utterance.voice = voice;
  // Optional: fine‑tune speed/pitch for natural feel.
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);
  window.speechSynthesis.speak(utterance);
};

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
        返回儀表板
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-12 border-[#e5e1d5] bg-white relative overflow-hidden">
             {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            
            <div className="flex justify-between items-start mb-6">
              <Badge variant="secondary">練習主題</Badge>
              <button 
                onClick={() => handleSpeak(article.content)}
                disabled={isSpeaking}
                className={`p-4 rounded-2xl bg-surface-container-low text-primary hover:bg-white transition-all shadow-sm ${isSpeaking ? 'animate-pulse' : 'active:scale-95'}`}
              >
                <Volume2 size={24} />
              </button>
            </div>

            <h2 className="text-4xl font-headline font-bold text-primary mb-10 border-b-2 border-secondary/10 pb-6 leading-tight">
              {article.title}
            </h2>
            <div className="japanese-text text-2xl text-primary font-medium leading-[2.2] space-y-8">
              <p className="whitespace-pre-wrap">{article.content}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#fdfdfd] border border-outline-variant/30 border-l-4 border-l-primary rounded-xl relative overflow-hidden shadow-sm">
              <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded mb-4 uppercase tracking-wider">字面直譯</span>
              <p className="text-primary/80 leading-relaxed italic font-medium">{article.translationLiteral}</p>
            </div>
            <div className="p-8 bg-secondary-container/20 border border-outline-variant/30 border-l-4 border-l-secondary rounded-xl relative overflow-hidden shadow-sm">
              <span className="inline-block px-3 py-1 bg-secondary/5 text-secondary text-[10px] font-bold rounded mb-4 uppercase tracking-wider">自然意譯</span>
              <p className="text-secondary font-bold leading-relaxed">{article.translationNatural}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 py-7 text-lg gap-3"
              onClick={handleFetchInsight}
              isLoading={isFetchingInsight}
              disabled={!!article.insight}
            >
              <BrainCircuit size={22} /> {article.insight ? '已分析' : '生成語言洞察'}
            </Button>
            <Button 
                variant="outline" 
                className="flex-1 py-7 text-lg gap-3"
                onClick={handleFetchVocab}
                isLoading={isFetchingVocab}
                disabled={article.vocabulary && article.vocabulary.length > 0}
            >
              <Bookmark size={22} /> {article.vocabulary?.length ? '已萃取單字' : '萃取關鍵單單字'}
            </Button>
          </div>
        </div>

        <aside className="space-y-8">
          <Card className="p-8 border-[#e5e1d5]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-bold text-primary uppercase text-xs tracking-widest">核心單詞庫</h4>
              {isFetchingVocab && <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />}
            </div>
            
            {(article.vocabulary && article.vocabulary.length > 0) ? (
              <div className="space-y-5">
                {article.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="p-5 bg-surface-container-low/40 rounded-xl border border-transparent hover:border-secondary/20 hover:bg-white transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-headline font-bold text-primary group-hover:text-secondary transition-colors cursor-pointer" onClick={() => handleSpeak(vocab.word)}>
                        {vocab.word}
                      </span>
                      <Badge variant="outline" className="bg-white">{vocab.level}</Badge>
                    </div>
                    <p className="text-xs text-on-surface-variant/50 mb-3 font-bold">{vocab.reading}</p>
                    <p className="text-sm font-bold text-primary/70">{vocab.meaning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-on-surface-variant/40 italic text-sm">
                尚未提取單字，請點擊下方的「萃取關鍵單字」。
              </div>
            )}
          </Card>

          <div className="bg-primary p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <Lightbulb size={120} />
            </div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-widest mb-6 opacity-60">AI 智能分析</h4>
            {isFetchingInsight ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-[90%]"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-[80%]"></div>
              </div>
            ) : (
              <p className="text-base leading-relaxed mb-8 font-medium">
                {article.insight || '尚未生成洞察分析。'}
              </p>
            )}
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
              <Lightbulb size={16} className="text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">專家點評</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
