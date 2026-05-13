import React from 'react';
import { X, TrendingDown, TrendingUp, DollarSign, Calendar, Edit2 } from 'lucide-react';

interface AddTransactionModalProps {
  show: boolean;
  onClose: () => void;
  transactionData: { type: 'income' | 'expense', category: string, amount: string, description: string, date: string };
  setTransactionData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ show, onClose, transactionData, setTransactionData, onSubmit }) => {
  if (!show) return null;

  const INCOME_CATEGORIES = ["ค่าเรียน", "ค่าหนังสือ", "ค่าอุปกรณ์", "อื่นๆ"];
  const EXPENSE_CATEGORIES = ["ค่าเช่าที่", "ค่าน้ำ/ค่าไฟ", "ค่าสื่อการสอน", "ค่าจ้าง", "อื่นๆ"];

  const currentCategories = transactionData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const themeColor = transactionData.type === 'income' ? '#696cff' : '#ff3e1d';
  const themeBg = transactionData.type === 'income' ? 'bg-[#696cff]/10' : 'bg-[#ff3e1d]/10';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full h-full sm:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-[100dvh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3] bg-white shrink-0">
           <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold text-[#566a7f]">เพิ่มรายการ{transactionData.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</h3>
              <span className="text-[13px] text-[#a1acb8] font-normal leading-relaxed">กรอกรายละเอียด{transactionData.type === 'income' ? 'รายรับ' : 'รายจ่าย'}ต่างๆ</span>
           </div>
           <button onClick={onClose} type="button" className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 overflow-y-auto space-y-5 custom-scrollbar">
            {/* Type Selector */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTransactionData({...transactionData, type: 'income', category: ''})}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${transactionData.type === 'income' ? 'bg-white text-[#696cff] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <TrendingUp size={16} />
                รายรับ
              </button>
              <button
                type="button"
                onClick={() => setTransactionData({...transactionData, type: 'expense', category: ''})}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${transactionData.type === 'expense' ? 'bg-white text-[#ff3e1d] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <TrendingDown size={16} />
                รายจ่าย
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#566a7f] ml-1">หมวดหมู่</label>
                <select 
                  value={transactionData.category} 
                  onChange={e => setTransactionData({...transactionData, category: e.target.value})} 
                  className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] transition-all"
                  style={{ borderColor: transactionData.category ? themeColor : '#d9dee3' }}
                >
                  <option value="">เลือกหมวดหมู่...</option>
                  {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#566a7f] ml-1">ยอดเงิน (บาท)</label>
                <div className="relative group">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1acb8] transition-colors" style={{ color: transactionData.amount ? themeColor : '#a1acb8' }} />
                  <input 
                    required 
                    type="number" 
                    value={transactionData.amount} 
                    onChange={e => setTransactionData({...transactionData, amount: e.target.value})} 
                    className="w-full bg-white border border-[#d9dee3] rounded-md pl-11 pr-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] transition-all placeholder:text-[#a1acb8]" 
                    placeholder="0.00"
                    style={{ borderColor: transactionData.amount ? themeColor : '#d9dee3' }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#566a7f] ml-1">รายละเอียด</label>
              <div className="relative group">
                <Edit2 size={18} className="absolute left-4 top-3 text-[#a1acb8] transition-colors" style={{ color: transactionData.description ? themeColor : '#a1acb8' }} />
                <textarea 
                  required 
                  rows={2} 
                  value={transactionData.description} 
                  onChange={e => setTransactionData({...transactionData, description: e.target.value})} 
                  className="w-full bg-white border border-[#d9dee3] rounded-md pl-11 pr-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] transition-all placeholder:text-[#a1acb8] resize-none" 
                  placeholder="ระบุรายละเอียด..." 
                  style={{ borderColor: transactionData.description ? themeColor : '#d9dee3' }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#566a7f] ml-1">วันที่ทำรายการ</label>
              <div className="relative group">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1acb8] transition-colors" />
                <input 
                  type="date" 
                  value={transactionData.date} 
                  onChange={e => setTransactionData({...transactionData, date: e.target.value})} 
                  className="w-full bg-white border border-[#d9dee3] rounded-md pl-11 pr-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] transition-all text-[#566a7f]" 
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#d9dee3] flex gap-3 justify-end shrink-0 bg-slate-50/50">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]">ยกเลิก</button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-md font-medium text-[14px] text-white transition-all hover:-translate-y-[1px]"
              style={{ backgroundColor: themeColor }}
            >
              ยืนยัน{transactionData.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
