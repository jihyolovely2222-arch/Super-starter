import React, { useState } from 'react';
import { Season } from '../types';
import { X, Download, Upload, RotateCcw, Check, Copy } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasons: Season[];
  onImport: (seasons: Season[]) => void;
  onReset: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  seasons,
  onImport,
  onReset,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(seasons, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seishun_academy_archive_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('รูปแบบ JSON ต้องเป็น Array ของ Season');
      }
      onImport(parsed);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'JSON ไม่ถูกต้อง โปรดตรวจสอบข้อมูล');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-pink-400" />
          <span>สำรอง & จัดการข้อมูล (Backup / Import)</span>
        </h3>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          ข้อมูลซีซันและสมาชิกถูกบันทึกลงในบราวเซอร์ของคุณ (localStorage) แบบอัตโนมัติ คุณสามารถดาวน์โหลดไฟล์ JSON เก็บไว้ หรือนำเข้าข้อมูลได้ที่นี่
        </p>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
            <h4 className="text-sm font-semibold text-white">ส่งออกข้อมูล (Export)</h4>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ JSON</span>
              </button>
              <button
                onClick={handleCopy}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก JSON'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
            <h4 className="text-sm font-semibold text-white">นำเข้าข้อมูล (Import JSON)</h4>
            <textarea
              rows={4}
              placeholder="วางข้อมูล JSON ที่นี่..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            {importError && (
              <p className="text-xs text-rose-400">{importError}</p>
            )}
            <button
              onClick={handleImportSubmit}
              disabled={!importText.trim()}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>นำเข้าข้อมูลนี้</span>
            </button>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="pt-2 flex justify-between items-center border-t border-white/10 text-xs text-slate-400">
            <span>ต้องการเริ่มใหม่ด้วยข้อมูลดั้งเดิม?</span>
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                  onReset();
                  onClose();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตค่าเริ่มต้น (Demo Data)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
