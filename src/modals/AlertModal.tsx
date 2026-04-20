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
      <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} className="stroke-[2.5px]" />
        </div>
        <h3 className={`${FONT.H4} text-slate-900 mb-2`}>แจ้งเตือนระบบ</h3>
        <p className={`${FONT.BODY_SM} text-slate-500 leading-relaxed max-w-[260px]`}>{message}</p>
        
        <button 
          onClick={onClose} 
          className={`mt-8 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 ${FONT.BODY_MD} font-black rounded-2xl transition-all active:scale-95`}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};
