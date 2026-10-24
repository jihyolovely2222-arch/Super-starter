import React from 'react';
import { Member } from '../types';
import { Trophy, Info, Edit2, Trash2 } from 'lucide-react';

interface PodiumStageProps {
  members: Member[];
  onViewDetails: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export const PodiumStage: React.FC<PodiumStageProps> = ({
  members,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  // Sort members by rank ascending
  const sorted = [...members].sort((a, b) => a.rank - b.rank);

  const rank1 = sorted.find((m) => m.rank === 1) || sorted[0];
  const otherMembers = sorted.filter((m) => m.id !== rank1?.id);

  // Group other members into pairs of 2
  const pairs: Member[][] = [];
  for (let i = 0; i < otherMembers.length; i += 2) {
    pairs.push(otherMembers.slice(i, i + 2));
  }

  // Styling based on rank
  const getRankTheme = (rank: number) => {
    if (rank === 1) {
      return {
        cardBorder: 'border-amber-400/80 gold-glow',
        pedestalBg: 'from-amber-600/30 via-slate-800 to-slate-950 border-amber-400/60',
        textRank: 'text-amber-400',
      };
    }
    if (rank === 2) {
      return {
        cardBorder: 'border-slate-300/80 silver-glow',
        pedestalBg: 'from-slate-400/20 via-slate-800 to-slate-950 border-slate-300/50',
        textRank: 'text-slate-200',
      };
    }
    if (rank === 3) {
      return {
        cardBorder: 'border-amber-700/80 bronze-glow',
        pedestalBg: 'from-amber-800/20 via-slate-800 to-slate-950 border-amber-700/50',
        textRank: 'text-amber-600',
      };
    }
    return {
      cardBorder: 'border-white/10 hover:border-purple-500/40',
      pedestalBg: 'from-slate-800/80 via-slate-900 to-slate-950 border-white/15',
      textRank: 'text-sky-400',
    };
  };

  const renderMemberPodiumUnit = (member: Member, pedestalHeight: string = 'h-24') => {
    const theme = getRankTheme(member.rank);

    return (
      <div
        key={member.id}
        className="flex flex-col items-center justify-end relative group w-full"
      >
        {/* Profile Card Sitting on the Pedestal */}
        <div
          className={`w-full max-w-[240px] p-4 rounded-2xl bg-slate-900/90 border ${theme.cardBorder} backdrop-blur-md shadow-xl text-center mb-2 flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-1`}
        >
          {/* Member Name, Nickname & Country */}
          <div>
            <h4 className="text-base font-bold text-white truncate leading-snug">
              {member.nameTh}
            </h4>
            <p className="text-xs text-pink-400 font-semibold mt-0.5">
              ({member.nickname})
            </p>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {member.country}
            </p>
            <p className="text-[11px] text-purple-300 truncate mt-1 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
              {member.role || 'Member'}
            </p>
            {member.finalVotes && (
              <p className="text-[11px] font-mono tabular-nums text-amber-300 font-medium mt-1.5">
                {member.finalVotes.toLocaleString()} โหวต
              </p>
            )}
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-white/5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onViewDetails(member)}
              className="p-1 text-slate-400 hover:text-white"
              title="ดูโปรไฟล์"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(member)}
              className="p-1 text-slate-400 hover:text-sky-300"
              title="แก้ไข"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="p-1 text-slate-400 hover:text-rose-400"
              title="ลบ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* แท่งโพเดียมพร้อมอันดับแค่นั้น (Clean Pedestal Block with Rank Only) */}
        <div
          className={`w-full max-w-[240px] ${pedestalHeight} rounded-t-2xl border-t border-x bg-gradient-to-b ${theme.pedestalBg} backdrop-blur-md flex items-center justify-center shadow-2xl relative`}
        >
          <span className={`text-3xl sm:text-4xl font-black font-mono tabular-nums tracking-wider ${theme.textRank}`}>
            #{member.rank}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stage Arena Container */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Ambient Stage Spotlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Simple Stage Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>DEBUT PODIUM STAGE · {members.length} สมาชิก</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Seishun Academy Debut Podium
          </h3>
        </div>

        {/* Podium Stage Structure:
            - TOP: Rank 1 Solo
            - BELOW: Pairs (Rank 2 & 3, Rank 4 & 5, Rank 6 & 7, Rank 8 & 9) */}
        <div className="space-y-8 max-w-4xl mx-auto relative z-10">
          
          {/* 1. อันดับที่ 1 (เดี่ยวตรงกลางบนสุด) */}
          {rank1 && (
            <div className="flex justify-center">
              <div className="w-full max-w-[260px] flex justify-center">
                {renderMemberPodiumUnit(rank1, 'h-36 sm:h-44')}
              </div>
            </div>
          )}

          {/* 2. จัดเรียงเป็นคู่ๆ (In Pairs) */}
          <div className="space-y-6">
            {pairs.map((pair, index) => {
              // Graduated step heights for each pair
              const pairStepHeights = [
                'h-28 sm:h-34', // Pair 1 (Rank 2 & 3)
                'h-22 sm:h-28', // Pair 2 (Rank 4 & 5)
                'h-18 sm:h-22', // Pair 3 (Rank 6 & 7)
                'h-14 sm:h-18', // Pair 4 (Rank 8 & 9)
              ];
              const currentHeight = pairStepHeights[index] || 'h-14 sm:h-16';

              return (
                <div key={index} className="flex justify-center">
                  <div
                    className={`grid gap-4 sm:gap-8 w-full max-w-lg mx-auto ${
                      pair.length === 1 ? 'grid-cols-1 max-w-[240px]' : 'grid-cols-2'
                    }`}
                  >
                    {pair.map((member) => (
                      <div key={member.id} className="flex justify-center">
                        {renderMemberPodiumUnit(member, currentHeight)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
