import React from 'react';
import { Member } from '../types';
import { Crown, Sparkles, Star, Edit2, Trash2, Info } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onViewDetails: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // Border & badge styling based on rank
  let rankBorder = 'border-white/10 hover:border-purple-500/40';
  let rankBadgeBg = 'bg-slate-800 text-slate-300 border border-white/10';
  let rankIcon = null;

  if (member.rank === 1) {
    rankBorder = 'border-amber-400/80 shadow-lg shadow-amber-500/10 gold-glow';
    rankBadgeBg = 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md';
    rankIcon = <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />;
  } else if (member.rank === 2) {
    rankBorder = 'border-slate-300/80 shadow-md shadow-slate-300/10 silver-glow';
    rankBadgeBg = 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-extrabold shadow-md';
    rankIcon = <Sparkles className="w-3 h-3 text-slate-950" />;
  } else if (member.rank === 3) {
    rankBorder = 'border-amber-700/80 shadow-md shadow-amber-700/10 bronze-glow';
    rankBadgeBg = 'bg-gradient-to-r from-amber-700 to-yellow-800 text-white font-extrabold shadow-md';
    rankIcon = <Star className="w-3 h-3 text-white fill-white" />;
  }

  return (
    <div
      className={`group relative rounded-3xl p-6 border ${rankBorder} bg-slate-900/60 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/90`}
    >
      <div>
        {/* Top Header: Rank, Country, and Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 rounded-xl ${rankBadgeBg} flex items-center justify-center text-sm tabular-nums`}
              title={`อันดับที่ ${member.rank}`}
            >
              {rankIcon ? (
                <span className="flex items-center gap-0.5 font-bold">
                  #{member.rank}
                </span>
              ) : (
                `#${member.rank}`
              )}
            </span>

            <span className="bg-slate-950/90 text-xs px-2.5 py-1 rounded-lg border border-white/10 text-slate-200 font-medium">
              {member.country}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onViewDetails(member)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-purple-300 transition-colors"
              title="ดูข้อมูลละเอียด"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(member)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-sky-300 transition-colors"
              title="แก้ไขข้อมูล"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
              title="ลบสมาชิก"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Name & Identity */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-xl font-bold text-white group-hover:text-pink-200 transition-colors leading-snug">
              {member.nameTh}
            </h3>
            <span className="text-sm font-semibold text-pink-400">
              ({member.nickname})
            </span>
          </div>

          {member.nameEn && (
            <p className="text-xs text-slate-400 font-light tracking-wide">
              {member.nameEn}
            </p>
          )}
        </div>
      </div>

      {/* Role & Votes Footer */}
      <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-purple-300 font-medium bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
            <Star className="w-3 h-3 text-purple-400" />
            <span className="truncate max-w-[200px]">{member.role || 'Member'}</span>
          </span>

          {member.mbti && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-white/5">
              {member.mbti}
            </span>
          )}
        </div>

        {member.finalVotes && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>คะแนนโหวตไฟนอล:</span>
            <span className="font-mono tabular-nums text-white font-medium">
              {member.finalVotes.toLocaleString()} โหวต
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
