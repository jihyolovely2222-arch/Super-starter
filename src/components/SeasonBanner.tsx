import React from 'react';
import { Season } from '../types';
import { Plus, Edit2, Trash2, Heart } from 'lucide-react';

interface SeasonBannerProps {
  seasons: Season[];
  activeSeason: Season;
  onSelectSeason: (id: string) => void;
  onOpenAddSeason: () => void;
  onEditSeason: (season: Season) => void;
  onDeleteSeason: (id: string) => void;
  onOpenAddMember: () => void;
}

export const SeasonBanner: React.FC<SeasonBannerProps> = ({
  seasons,
  activeSeason,
  onSelectSeason,
  onOpenAddSeason,
  onEditSeason,
  onDeleteSeason,
  onOpenAddMember,
}) => {
  return (
    <div className="relative rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 bg-slate-900/70 backdrop-blur-xl overflow-hidden shadow-xl">
      {/* Subtle background glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -top-20 w-60 h-60 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Season Selector Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 mb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 whitespace-nowrap font-medium mr-1">
            เลือกซีซัน:
          </span>
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSeason(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                s.id === activeSeason.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/5'
              }`}
            >
              {s.seasonName} · {s.groupName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenAddSeason}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มซีซันใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Banner Content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="space-y-2">
          {/* Metadata items rendered with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-pink-400 uppercase tracking-wider">
              {activeSeason.seasonName}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-sky-300 font-medium">
              {activeSeason.members.length} สมาชิกเดบิวต์
            </span>
            {activeSeason.fandomName && (
              <>
                <span className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1 text-amber-300/90 font-medium">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400/40" />
                  แฟนดอม: {activeSeason.fandomName}
                </span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wider">
              {activeSeason.groupName}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end shrink-0">
          <button
            onClick={onOpenAddMember}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสมาชิก</span>
          </button>

          <button
            onClick={() => onEditSeason(activeSeason)}
            className="bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>แก้ไขซีซัน</span>
          </button>

          {seasons.length > 1 && (
            <button
              onClick={() => onDeleteSeason(activeSeason.id)}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors"
              title="ลบซีซันนี้"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
