import React from 'react';
import { X, TrendingDown, DollarSign, Calendar, Edit2, Plus } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface AddExpenseModalProps {
  show: boolean;
  onClose: () => void;
  expenseData: { category: string, amount: string, description: string, date: string };
  setExpenseData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ show, onClose, expenseData, setExpenseData, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-slate-100">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-white text-rose-800">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20"><TrendingDown size={32} /></div>
            <div>
              <h3 className={`${FONT.H2} font-extrabold`}>เพิ่มรายการรายจ่าย</h3>
              <p className={`text-rose-900 ${FONT.BODY_SM} mt-1`}>กรอกรายละเอียดค่าใช้จ่ายต่างๆ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-rose-100/30 text-rose-600 rounded-2xl transition-all hover:rotate-90"><X size={24} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>หมวดหมู่</label>
              <select value={expenseData.category} onChange={e => setExpenseData({...expenseData, category: e.target.value})} className={`w-full bg-slate-50 border-none rounded-[20px] px-6 py-5 ${FONT.BODY_MD} focus:ring-4 focus:ring-rose-100 outline-none appearance-none cursor-pointer text-slate-900`}>
                <option value="">เลือกหมวดหมู่...</option>
                <option value="ค่าเช่าที่">ค่าเช่าที่</option>
                <option value="ค่าน้ำ/ค่าไฟ">ค่าน้ำ/ค่าไฟ</option>
                <option value="ค่าสื่อการสอน">ค่าสื่อการสอน</option>
                <option value="ค่าจ้าง">ค่าจ้าง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>ยอดเงินรายจ่าย (บาท)</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-rose-50 text-rose-500 rounded-xl group-focus-within:bg-rose-600 group-focus-within:text-white transition-all duration-300"><DollarSign size={18} /></div>
                <input required type="number" value={expenseData.amount} onChange={e => setExpenseData({...expenseData, amount: e.target.value})} className={`w-full bg-slate-50 border-none rounded-[20px] pl-16 pr-6 py-5 ${FONT.BODY_MD} focus:ring-4 focus:ring-rose-100 outline-none text-slate-900`} placeholder="0.00" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>รายละเอียด</label>
            <div className="relative group">
              <div className="absolute left-5 top-8 p-2 bg-rose-50 text-rose-500 rounded-xl group-focus-within:bg-rose-600 group-focus-within:text-white transition-all duration-300"><Edit2 size={18} /></div>
              <textarea required rows={3} value={expenseData.description} onChange={e => setExpenseData({...expenseData, description: e.target.value})} className={`w-full bg-slate-50 border-none rounded-[20px] pl-16 pr-6 py-5 ${FONT.BODY_MD} focus:ring-4 focus:ring-rose-100 outline-none text-slate-900`} placeholder="ระบุรายละเอียด..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>วันที่ทำรายการ</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-rose-50 text-rose-500 rounded-xl group-focus-within:bg-rose-600 group-focus-within:text-white transition-all duration-300"><Calendar size={18} /></div>
              <input type="date" value={expenseData.date} onChange={e => setExpenseData({...expenseData, date: e.target.value})} className={`w-full bg-slate-50 border-none rounded-[20px] pl-16 pr-6 py-5 ${FONT.BODY_MD} focus:ring-4 focus:ring-rose-100 outline-none text-slate-900`} />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className={`flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 ${FONT.LABEL} py-5 rounded-[24px] transition-all`}>ยกเลิก</button>
            <button type="submit" className={`flex-1 bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white ${FONT.LABEL_BLACK} py-5 rounded-[24px] transition-all shadow-xl shadow-rose-200 active:scale-95 hover:scale-[1.02]`}><Plus size={20} className="inline mr-1 mb-1" /> ยืนยันรายจ่าย</button>
          </div>
        </form>
      </div>
    </div>
  );
};
