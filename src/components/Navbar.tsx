import React from 'react';
import { ViewMode } from '../types';
import { Trophy, Users, Plus, Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onOpenAddMember: () => void;
  onOpenAddSeason: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewChange,
  onOpenAddMember,
  onOpenAddSeason,
  onOpenBackup,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-400 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-rose-400 via-purple-300 to-sky-400 bg-clip-text text-transparent whitespace-nowrap">
              SEISHUN ACADEMY
            </span>
            <p className="text-[11px] text-slate-400 font-light hidden sm:block leading-none mt-0.5">
              Debut Group Archive & Hall of Fame
            </p>
          </div>
        </div>

        {/* Zone 2: View Switchers (Cards & Podium only, table removed) */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs shrink-0">
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ทำเนียบสมาชิก</span>
          </button>

          <button
            onClick={() => onViewChange('podium')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'podium'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>สเตจโพเดียม</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBackup}
            title="สำรองข้อมูล / นำเข้า JSON"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddMember}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสมาชิก</span>
          </button>
        </div>

      </div>
    </header>
  );
};
