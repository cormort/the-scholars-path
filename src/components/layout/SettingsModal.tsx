import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isFetchingModels: boolean;
  onFetchModels: () => void;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  apiKey, 
  setApiKey,
  availableModels,
  selectedModel,
  setSelectedModel,
  isFetchingModels,
  onFetchModels
}: SettingsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden border border-outline-variant"
          >
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h3 className="text-xl font-headline font-bold text-primary">設定與配置</h3>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} className="text-on-surface-variant" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">AI 模型供應商</label>
                    <button 
                      onClick={onFetchModels}
                      disabled={isFetchingModels}
                      className={`p-1 rounded-full hover:bg-surface-container transition-all ${isFetchingModels ? 'animate-spin opacity-50' : 'active:scale-95'}`}
                      title="手動讀取最新模型"
                    >
                      <Zap size={12} className="text-primary" />
                    </button>
                  </div>
                  {isFetchingModels && <span className="text-[10px] text-primary animate-pulse font-bold">正在讀取最新模型...</span>}
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm focus:ring-2 focus:ring-primary h-12 px-4 shadow-sm font-bold disabled:opacity-50"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isFetchingModels}
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(model => (
                      <option key={model} value={model}>
                        {model.replace('models/', '').toUpperCase()}
                      </option>
                    ))
                  ) : (
                    <option value="models/gemini-1.5-flash">GEMINI-1.5-FLASH (預設)</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">API 密鑰 (Secret Key)</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm focus:ring-2 focus:ring-primary h-12 px-4 pr-12 shadow-sm" 
                    type="password" 
                    placeholder="輸入您的 API Key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Key size={18} className="absolute right-4 top-3.5 text-on-surface-variant/40" />
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  您的 API Key 將僅保存在本地瀏覽器中，不會上傳至我們的伺服器。
                </p>
              </div>

              <div className="pt-4">
                <Button variant="primary" className="w-full gap-2" onClick={onClose}>
                  <ShieldCheck size={18} />
                  儲存並驗證憑證
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
