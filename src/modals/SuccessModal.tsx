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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300 flex flex-col items-center p-6 text-center">
        <div className="w-16 h-16 bg-[#e8fadf] rounded-full flex items-center justify-center text-[#71dd37] mb-6">
          <CheckCircle size={32} />
        </div>
        
        <h3 className="text-[20px] font-semibold text-[#566a7f] mb-2">{title}</h3>
        <p className="text-[14px] text-[#a1acb8] mb-6 leading-relaxed px-4">{message}</p>
        
        {details && details.length > 0 && (
          <div className="w-full bg-slate-50/50 border border-[#d9dee3] rounded-md p-4 mb-6 space-y-3">
            {details.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[13px]">
                <span className="text-[#a1acb8] font-medium flex items-center gap-2">
                   {item.label === 'วิชา' ? <ShoppingBag size={14} /> : item.label === 'น้อง' ? <User size={14} /> : <CreditCard size={14} />}
                   {item.label}
                </span>
                <span className="text-[#566a7f] font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={onClose} 
          className="w-full bg-[#696cff] hover:bg-[#5f61e6] text-white text-[15px] font-medium py-2.5 rounded-md transition-all shadow-[0_4px_12px_rgba(105,108,255,0.4)] hover:-translate-y-[1px]"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};
