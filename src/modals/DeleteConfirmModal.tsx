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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#d9dee3]">
          <div className="flex items-center gap-2 text-[#566a7f]">
             <AlertCircle size={20} className="text-[#ff3e1d]" />
             <h3 className="text-[18px] font-semibold">ยืนยันการลบข้อมูล</h3>
          </div>
          <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <p className="text-[14px] text-[#566a7f] mb-4">พิมพ์คำว่า <strong className="text-[#ff3e1d]">"ยืนยัน"</strong> เพื่อดำเนินการต่อ</p>
          <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2 text-center text-[15px] font-medium text-[#566a7f] focus:border-[#ff3e1d] focus:ring-2 focus:ring-[#ff3e1d]/20 transition-all outline-none" placeholder="" />
        </div>

        <div className="px-6 py-4 border-t border-[#d9dee3] flex justify-end gap-3 bg-slate-50/50">
           <button onClick={onClose} className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]">ยกเลิก</button>
           <button onClick={onConfirm} disabled={confirmText !== 'ยืนยัน'} className="px-5 py-2 rounded-md bg-[#ff3e1d] disabled:opacity-50 hover:bg-[#e6381a] text-white font-medium transition-all text-[14px] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(255,62,29,0.4)] disabled:hover:translate-y-0 disabled:hover:shadow-none">ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};
