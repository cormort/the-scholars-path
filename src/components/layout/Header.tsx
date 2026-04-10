import React from 'react';
import { Search, Settings, User } from 'lucide-react';

export const Header = ({ onOpenSettings }: { onOpenSettings: () => void }) => (
  <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-md z-50 border-b border-outline-variant/30">
    <div className="flex items-center gap-2">
      <span className="text-2xl font-headline font-bold tracking-tight text-primary">學者之路</span>
    </div>
    <div className="hidden md:flex items-center gap-8">
      <nav className="flex gap-6 text-sm font-bold">
        <a className="text-primary hover:text-secondary transition-colors" href="#">學習概覽</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">文章列表</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">社群討論</a>
      </nav>
      <div className="flex items-center gap-2">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95"><Search size={20} /></button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95"
        >
          <Settings size={20} />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95"><User size={20} /></button>
      </div>
    </div>
  </header>
);
