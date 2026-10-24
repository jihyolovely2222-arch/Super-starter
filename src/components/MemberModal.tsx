import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { PRESET_COUNTRIES, COMMON_FLAG_EMOJIS, COMMON_ROLES } from '../data/defaultData';
import { X, Sparkles, Flag, Plus } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<Member, 'id'>, editId?: string) => void;
  editingMember?: Member | null;
  suggestedRank: number;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMember,
  suggestedRank,
}) => {
  const [rank, setRank] = useState<number>(suggestedRank);
  const [nickname, setNickname] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [country, setCountry] = useState(PRESET_COUNTRIES[0]);
  const [role, setRole] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [finalVotes, setFinalVotes] = useState<string>('');
  const [mbti, setMbti] = useState('');
  const [notes, setNotes] = useState('');

  // Flag builder mode
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [customFlag, setCustomFlag] = useState('🇹🇭');
  const [customCountryName, setCustomCountryName] = useState('');

  useEffect(() => {
    if (editingMember) {
      setRank(editingMember.rank);
      setNickname(editingMember.nickname || '');
      setNameTh(editingMember.nameTh || '');
      setNameEn(editingMember.nameEn || '');
      setCountry(editingMember.country || PRESET_COUNTRIES[0]);
      setRole(editingMember.role || '');
      setBirthDate(editingMember.birthDate || '');
      setFinalVotes(editingMember.finalVotes ? editingMember.finalVotes.toString() : '');
      setMbti(editingMember.mbti || '');
      setNotes(editingMember.notes || '');
      setShowCustomCountry(false);
    } else {
      setRank(suggestedRank);
      setNickname('');
      setNameTh('');
      setNameEn('');
      setCountry(PRESET_COUNTRIES[0]);
      setRole('');
      setBirthDate('');
      setFinalVotes('');
      setMbti('');
      setNotes('');
      setShowCustomCountry(false);
    }
  }, [editingMember, suggestedRank, isOpen]);

  if (!isOpen) return null;

  const handleApplyCustomCountry = () => {
    if (customCountryName.trim()) {
      const combined = `${customFlag} ${customCountryName.trim()}`;
      setCountry(combined);
      setShowCustomCountry(false);
      setCustomCountryName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        rank: Number(rank) || 1,
        nickname: nickname.trim(),
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim() || undefined,
        country: country.trim() || '🇹🇭 ไทย',
        role: role.trim(),
        birthDate: birthDate || undefined,
        finalVotes: finalVotes ? parseInt(finalVotes.replace(/,/g, ''), 10) : undefined,
        mbti: mbti.trim().toUpperCase() || undefined,
        notes: notes.trim() || undefined,
      },
      editingMember ? editingMember.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>{editingMember ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มข้อมูลสมาชิกเดบิวต์'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Rank & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                อันดับเดบิวต์ (Rank) <span className="text-pink-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={rank}
                onChange={(e) => setRank(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ชื่อเล่น (Nickname) <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น อาโออิ, โซระ, เฟรนด์"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Row 2: Thai Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ชื่อ-นามสกุล (ภาษาไทย) <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น มินามิ อาโออิ"
              value={nameTh}
              onChange={(e) => setNameTh(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Row 3: English Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ชื่อ-นามสกุล (ภาษาอังกฤษ)
            </label>
            <input
              type="text"
              placeholder="เช่น Aoi Minami"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Row 4: Country with Flag Picker & Custom Flag/Nationality Input */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-pink-400" />
                <span>ไอคอนธง & สัญชาติ (Country / Flag)</span>
                <span className="text-pink-400">*</span>
              </label>

              <button
                type="button"
                onClick={() => setShowCustomCountry(!showCustomCountry)}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showCustomCountry ? 'เลือกจากรายการ' : '+ เพิ่มสัญชาติ/ธงใหม่'}</span>
              </button>
            </div>

            {!showCustomCountry ? (
              <div className="space-y-2">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {PRESET_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {/* If current value is custom and not in preset */}
                  {!PRESET_COUNTRIES.includes(country) && (
                    <option value={country}>{country} (กำหนดเอง)</option>
                  )}
                </select>

                {/* Quick preset chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_COUNTRIES.slice(0, 6).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCountry(c)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        country === c
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Custom Flag & Nationality Creator */
              <div className="space-y-3 p-3 bg-slate-900/90 rounded-xl border border-purple-500/30">
                <p className="text-xs text-slate-400">
                  เลือกไอคอนธง และพิมพ์ชื่อประเทศ / สัญชาติที่ต้องการเพิ่ม:
                </p>

                {/* Flag emoji palette */}
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-slate-850 rounded-lg">
                  {COMMON_FLAG_EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setCustomFlag(emoji)}
                      className={`w-7 h-7 text-base rounded flex items-center justify-center transition-transform hover:scale-125 ${
                        customFlag === emoji ? 'bg-purple-600 shadow-sm ring-1 ring-white' : 'hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFlag}
                    onChange={(e) => setCustomFlag(e.target.value)}
                    placeholder="ธง"
                    className="w-14 text-center bg-slate-800 border border-white/10 rounded-xl py-2 text-base text-white focus:outline-none focus:border-purple-500"
                    title="พิมพ์หรือวางอีโมจิธง"
                  />
                  <input
                    type="text"
                    value={customCountryName}
                    onChange={(e) => setCustomCountryName(e.target.value)}
                    placeholder="ชื่อประเทศ เช่น สิงคโปร์, ออสเตรเลีย, บราซิล"
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomCountry}
                    disabled={!customCountryName.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0"
                  >
                    ใช้สัญชาตินี้
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>ตัวอย่างที่จะแสดง:</span>
                  <span className="text-white font-medium bg-slate-800 px-2 py-0.5 rounded border border-white/10">
                    {customFlag} {customCountryName.trim() || '(ชื่อประเทศ)'}
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-400">
              สัญชาติที่เลือกปัจจุบัน: <strong className="text-white">{country}</strong>
            </div>
          </div>

          {/* Row 5: Role & Common Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ตำแหน่งในวง (Role / Position)
            </label>
            <input
              type="text"
              placeholder="เช่น Center / Main Vocal"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 mb-2"
            />
            {/* Quick tag clickers */}
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ROLES.slice(0, 5).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(role ? `${role}, ${r}` : r)}
                  className="text-[11px] bg-slate-800/80 hover:bg-purple-900/50 hover:text-purple-300 border border-white/5 rounded-lg px-2.5 py-0.5 text-slate-400 transition-colors"
                >
                  +{r}
                </button>
              ))}
            </div>
          </div>

          {/* Row 6: Final Votes, MBTI & Birthdate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                คะแนนโหวตไฟนอล
              </label>
              <input
                type="number"
                placeholder="เช่น 1842500"
                value={finalVotes}
                onChange={(e) => setFinalVotes(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                MBTI
              </label>
              <input
                type="text"
                placeholder="เช่น ENFJ"
                maxLength={4}
                value={mbti}
                onChange={(e) => setMbti(e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                วันเกิด
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Row 7: Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              หมายเหตุ / ข้อมูลเพิ่มเติม
            </label>
            <input
              type="text"
              placeholder="หมายเหตุเพิ่มเติม..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs sm:text-sm hover:bg-slate-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium text-xs sm:text-sm hover:opacity-90 shadow-lg shadow-sky-500/20 transition-opacity"
            >
              {editingMember ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิกใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
