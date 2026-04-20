import React from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface DeleteConfirmModalProps {
  show: boolean;
  onClose: () => void;
  confirmText: string;
  setConfirmText: (text: string) => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ show, onClose, confirmText, setConfirmText, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-rose-100">
        <div className="p-10 border-b border-rose-50 flex flex-col items-center justify-center bg-rose-50/30 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm"><AlertCircle size={32} /></div>
          <h3 className={`${FONT.H4} text-rose-900 leading-tight`}>ยืนยันการลบข้อมูล</h3>
          <p className={`text-rose-900 ${FONT.LABEL} mt-2`}>พิมพ์คำว่า <span className="text-rose-600 px-1 italic">"ยืนยัน"</span> เพื่อดำเนินการต่อ</p>
        </div>
        
        <div className="p-10 space-y-6">
          <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center ${FONT.BODY_LG} font-black focus:ring-4 focus:ring-rose-50/50 focus:border-rose-200 transition-all outline-none text-slate-900`} placeholder="......." />
          <div className="flex gap-4">
            <button onClick={onClose} className={`flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 ${FONT.LABEL_BLACK} py-4 rounded-xl transition-all`}>ยกเลิก</button>
            <button onClick={onConfirm} disabled={confirmText !== 'ยืนยัน'} className={`flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-30 disabled:grayscale text-white ${FONT.LABEL_BLACK} py-4 rounded-xl transition-all shadow-xl shadow-rose-100`}>ยืนยันการลบ</button>
          </div>
        </div>
      </div>
    </div>
  );
};
