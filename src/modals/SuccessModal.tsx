import React from 'react';
import { CheckCircle, X, ShoppingBag, User, CreditCard } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: { label: string, value: string }[];
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ show, onClose, title, message, details }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col items-center p-8 text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-100 animate-bounce">
          <CheckCircle size={40} className="stroke-[3px]" />
        </div>
        
        <h3 className={`${FONT.H4} text-slate-900 mb-2`}>{title}</h3>
        <p className={`text-slate-900 ${FONT.LABEL} mb-6 leading-relaxed px-4`}>{message}</p>
        
        {details && details.length > 0 && (
          <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 space-y-3">
            {details.map((item, i) => (
              <div key={i} className={`flex justify-between items-center ${FONT.LABEL_SM}`}>
                <span className="text-slate-900 font-bold flex items-center gap-2">
                   {item.label === 'วิชา' ? <ShoppingBag size={12} /> : item.label === 'น้อง' ? <User size={12} /> : <CreditCard size={12} />}
                   {item.label}
                </span>
                <span className={`text-slate-900 ${FONT.LABEL_SM_BLACK}`}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={onClose} 
          className={`w-full bg-slate-900 hover:bg-slate-800 text-white ${FONT.LABEL_BLACK} py-4 rounded-2xl transition-all shadow-lg active:scale-95`}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};
