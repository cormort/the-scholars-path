import React from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface SynthesisPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSynthesize: () => void;
  isSynthesizing: boolean;
}

export const SynthesisPanel = ({ 
  inputText, 
  setInputText, 
  onSynthesize, 
  isSynthesizing 
}: SynthesisPanelProps) => (
  <Card className="mb-12 p-8 border-[#e5e1d5]">
    <h2 className="text-xl font-headline font-semibold mb-6 flex items-center gap-3 text-primary">
      <PlusCircle size={24} className="text-secondary" />
      生成新翻譯練習
    </h2>
    <div className="flex flex-col md:flex-row gap-4">
      <textarea 
        className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg p-5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all text-lg resize-none font-medium text-primary placeholder:text-on-surface-variant/40" 
        placeholder="在此粘貼日文文本或文章網址..." 
        rows={1}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button 
        variant="secondary"
        size="lg"
        onClick={onSynthesize}
        disabled={isSynthesizing || !inputText.trim()}
        className="gap-2 min-w-[200px]"
        isLoading={isSynthesizing}
      >
        {!isSynthesizing && <Sparkles size={20} />}
        開始合成
      </Button>
    </div>
    <p className="mt-4 text-xs text-on-surface-variant/60 font-medium">
      提示：您可以貼入新聞摘要、文學片段或日常對話。
    </p>
  </Card>
);
