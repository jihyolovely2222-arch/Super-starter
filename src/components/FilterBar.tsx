import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { Member } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  sortBy: 'rank-asc' | 'rank-desc' | 'name' | 'votes';
  onSortChange: (sort: 'rank-asc' | 'rank-desc' | 'name' | 'votes') => void;
  allMembers: Member[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onSelectCountry,
  sortBy,
  onSortChange,
  allMembers,
}) => {
  // Compute counts per nationality
  const countryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allMembers.forEach((m) => {
      const c = m.country || 'ไม่ระบุ';
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [allMembers]);

  const countries = Object.keys(countryCounts);

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่อ, ชื่อเล่น, สัญชาติ, ตำแหน่ง..."
            className="w-full bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 whitespace-nowrap">เรียง:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="rank-asc" className="bg-slate-900 text-white">อันดับ (1 → ล่าสุด)</option>
              <option value="rank-desc" className="bg-slate-900 text-white">อันดับ (ล่าสุด → 1)</option>
              <option value="votes" className="bg-slate-900 text-white">คะแนนโหวต (มาก → น้อย)</option>
              <option value="name" className="bg-slate-900 text-white">ชื่อ (ก-ฮ / A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Nationality Filter Chips (Functional filter buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1">
          สัญชาติ:
        </span>
        <button
          onClick={() => onSelectCountry('')}
          className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 font-medium ${
            selectedCountry === ''
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          ทั้งหมด ({allMembers.length})
        </button>

        {countries.map((c) => (
          <button
            key={c}
            onClick={() => onSelectCountry(selectedCountry === c ? '' : c)}
            className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 font-medium ${
              selectedCountry === c
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {c} <span className="opacity-70 tabular-nums font-mono text-[11px]">({countryCounts[c]})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
