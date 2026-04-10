import React from 'react';
import { 
  LayoutDashboard, 
  Languages, 
  GraduationCap, 
  BrainCircuit, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: '主控面板', icon: LayoutDashboard },
    { id: 'translator', label: '智能翻譯', icon: Languages },
    { id: 'courses', label: '我的課程', icon: GraduationCap },
    { id: 'insights', label: '語言洞察', icon: BrainCircuit },
    { id: 'glossary', label: '生詞本', icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full hidden md:flex flex-col py-8 w-64 bg-surface-container-low z-40 mt-16 border-r border-outline-variant/30">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-xl">學</div>
        <div>
          <p className="font-headline font-bold text-primary leading-tight">Sensei</p>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">N1 導航路徑</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group font-bold ${
              activeTab === item.id 
                ? 'bg-white text-primary shadow-sm border border-outline-variant/50' 
                : 'text-on-surface-variant hover:bg-white/50'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-secondary' : 'text-on-surface-variant/50'} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/50 rounded-lg transition-all font-bold">
          <HelpCircle size={20} />
          <span>幫助中心</span>
        </button>
      </div>
    </aside>
  );
};
