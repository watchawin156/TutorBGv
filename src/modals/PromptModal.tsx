import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface PromptModalProps {
  show: boolean;
  message: string;
  expectedWord?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ show, message, expectedWord = 'ตกลง', onConfirm, onClose }) => {
  const [input, setInput] = useState('');

  if (!show) return null;

  const handleConfirm = () => {
    if (input === expectedWord) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white popup-card rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mb-6">
            <HelpCircle size={32} className="stroke-[2.5px]" />
          </div>
          <h3 className={`${FONT.H4} text-slate-900 mb-2`}>ยืนยันการทำรายการ</h3>
          <p className={`${FONT.BODY_SM} text-slate-900 leading-relaxed whitespace-pre-line`}>{message}</p>
          
          <div className="w-full mt-6 space-y-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center ${FONT.BODY_LG} font-black focus:ring-4 focus:ring-sky-50 focus:border-sky-200 transition-all outline-none text-slate-900`} 
              placeholder={`พิมพ์คำว่า "${expectedWord}" เพื่อยืนยัน`} 
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
          <button 
            onClick={onClose} 
            className={`flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 ${FONT.LABEL_BLACK} py-4 rounded-xl transition-all active:scale-95`}
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={input !== expectedWord}
            className={`flex-1 py-4 rounded-xl ${FONT.LABEL_BLACK} transition-all active:scale-95 flex items-center justify-center gap-2 ${input === expectedWord ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <CheckCircle2 size={20} /> ยืนยัน
          </button>
        </div>

      </div>
    </div>
  );
};
