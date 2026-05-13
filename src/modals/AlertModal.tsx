import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface AlertModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-12 h-12 bg-[#ffe2e3] text-[#ff3e1d] rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-[18px] font-semibold text-[#566a7f] mb-1">แจ้งเตือนระบบ</h3>
        <p className="text-[14px] text-[#a1acb8] leading-relaxed mb-6">{message}</p>
        
        <button 
          onClick={onClose} 
          className="w-full py-2.5 bg-[#696cff] hover:bg-[#5f61e6] text-white text-[15px] font-medium rounded-md transition-all active:scale-95 shadow-[0_4px_12px_rgba(105,108,255,0.4)]"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};
