import React, { useState, useEffect } from 'react';
import { Season } from '../types';
import { X, Disc } from 'lucide-react';

interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seasonData: Partial<Season>, editId?: string) => void;
  editingSeason?: Season | null;
}

export const SeasonModal: React.FC<SeasonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSeason,
}) => {
  const [seasonName, setSeasonName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'girl_group' | 'boy_group' | 'co_ed'>('girl_group');
  const [fandomName, setFandomName] = useState('');

  useEffect(() => {
    if (editingSeason) {
      setSeasonName(editingSeason.seasonName || '');
      setGroupName(editingSeason.groupName || '');
      setGroupType(editingSeason.groupType || 'girl_group');
      setFandomName(editingSeason.fandomName || '');
    } else {
      setSeasonName('');
      setGroupName('');
      setGroupType('girl_group');
      setFandomName('');
    }
  }, [editingSeason, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        seasonName: seasonName.trim(),
        groupName: groupName.trim(),
        groupType,
        fandomName: fandomName.trim() || undefined,
      },
      editingSeason ? editingSeason.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Disc className="w-5 h-5 text-pink-400" />
          <span>{editingSeason ? 'แก้ไขข้อมูลซีซัน' : 'เพิ่มซีซันใหม่'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ชื่อซีซัน (Season Name) <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น Season 2, Season 3: Global"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ชื่อวงเดบิวต์ (Group Name) <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น SAIL9, ORBIT-X"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ประเภทวง
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value as any)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="girl_group">เกิร์ลกรุป (Girl Group)</option>
                <option value="boy_group">บอยกรุป (Boy Group)</option>
                <option value="co_ed">วงผสม (Co-ed Group)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ชื่อแฟนคลับ (Fandom Name)
            </label>
            <input
              type="text"
              placeholder="เช่น Anchors, Cosmo"
              value={fandomName}
              onChange={(e) => setFandomName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 shadow-lg shadow-pink-500/20 transition-opacity"
            >
              {editingSeason ? 'บันทึกการแก้ไข' : 'สร้างซีซันใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
