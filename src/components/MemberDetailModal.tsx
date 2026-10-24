import React from 'react';
import { Member } from '../types';
import { X, Crown, Sparkles, Star, Calendar, Edit2 } from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onEdit,
}) => {
  if (!member) return null;

  let rankMedal = 'bg-slate-800 text-slate-300 border-white/10';
  let medalIcon = null;

  if (member.rank === 1) {
    rankMedal = 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black gold-glow';
    medalIcon = <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />;
  } else if (member.rank === 2) {
    rankMedal = 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-bold silver-glow';
    medalIcon = <Sparkles className="w-4 h-4 text-slate-950" />;
  } else if (member.rank === 3) {
    rankMedal = 'bg-gradient-to-r from-amber-700 to-yellow-800 text-white font-bold bronze-glow';
    medalIcon = <Star className="w-4 h-4 fill-white text-white" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 relative z-10">
          {/* Header Medallion & Country */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 shadow-md ${rankMedal}`}>
              {medalIcon}
              <span>อันดับที่ #{member.rank}</span>
            </span>

            <span className="bg-slate-800 border border-white/10 px-2.5 py-1 rounded-xl text-xs text-slate-200 font-medium">
              {member.country}
            </span>
          </div>

          {/* Names */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {member.nameTh}
            </h2>
            <p className="text-base font-semibold text-pink-400 mt-0.5">
              ชื่อเล่น: {member.nickname}
              {member.nameEn && (
                <span className="text-slate-400 font-normal text-sm ml-2">
                  ({member.nameEn})
                </span>
              )}
            </p>
          </div>

          {/* Role & Specs */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
              <Star className="w-3.5 h-3.5 text-purple-400" />
              <span>{member.role || 'Member'}</span>
            </div>

            {member.mbti && (
              <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                MBTI: <strong className="text-sky-300">{member.mbti}</strong>
              </div>
            )}

            {member.birthDate && (
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>วันเกิด: {member.birthDate}</span>
              </div>
            )}
          </div>

          {/* Final votes */}
          {member.finalVotes && (
            <div className="p-3 bg-slate-850 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">คะแนนโหวตรอบชิงชนะเลิศ:</span>
              <p className="text-xl font-bold font-mono text-amber-300 tabular-nums mt-0.5">
                {member.finalVotes.toLocaleString()} <span className="text-xs font-normal text-slate-400">โหวต</span>
              </p>
            </div>
          )}

          {/* Notes */}
          {member.notes && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                หมายเหตุ / ข้อมูลเพิ่มเติม
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {member.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
          <button
            onClick={() => {
              onClose();
              onEdit(member);
            }}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>แก้ไขข้อมูลสมาชิก</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
