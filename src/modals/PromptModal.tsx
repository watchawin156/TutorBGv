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
      <div className="bg-white rounded-xl w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#d7f5fc] text-[#03c3ec] rounded-full flex items-center justify-center mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-[18px] font-semibold text-[#566a7f] mb-1">ยืนยันการทำรายการ</h3>
          <p className="text-[14px] text-[#a1acb8] leading-relaxed whitespace-pre-line mb-6">{message}</p>
          
          <div className="w-full">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-center text-[15px] font-medium text-[#566a7f] focus:border-[#03c3ec] focus:ring-2 focus:ring-[#03c3ec]/20 transition-all outline-none"
              placeholder={`พิมพ์คำว่า "${expectedWord}" เพื่อยืนยัน`} 
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#d9dee3] flex gap-3 bg-slate-50/50 justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={input !== expectedWord}
            className="px-5 py-2 rounded-md font-medium text-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-[1px] disabled:hover:translate-y-0 disabled:hover:shadow-none bg-[#03c3ec] hover:bg-[#02a9cd] text-white shadow-[0_4px_12px_rgba(3,195,236,0.4)] disabled:shadow-none"
          >
            <CheckCircle2 size={16} /> ยืนยัน
          </button>
        </div>

      </div>
    </div>
  );
};
