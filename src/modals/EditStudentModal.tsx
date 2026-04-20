import React from 'react';
import { X, Trash2, User, Phone, BookOpen, Save } from 'lucide-react';
import { Student } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface EditStudentModalProps {
  show: boolean;
  onClose: () => void;
  editingStudent: Student | null;
  setEditingStudent: (student: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteClick: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ show, onClose, editingStudent, setEditingStudent, onSubmit, onDeleteClick }) => {
  if (!show || !editingStudent) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className={`${FONT.H4} font-black text-slate-900`}>แก้ไขข้อมูลนักเรียน</h3>
            <p className={`text-slate-900 ${FONT.LABEL}`}>อัปเดตข้อมูลของ {editingStudent.name}</p>
          </div>
          <button onClick={onClose} type="button" className="p-2.5 hover:bg-slate-50 text-slate-900 hover:text-slate-900 rounded-xl transition-all"><X size={22} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                 <User size={14} className="text-sky-500" /> คำนำหน้า
              </label>
              <select required value={editingStudent.prefix} onChange={e => setEditingStudent({...editingStudent, prefix: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-2xl px-4 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all appearance-none cursor-pointer`}>
                <option value="เด็กชาย">เด็กชาย</option>
                <option value="เด็กหญิง">เด็กหญิง</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                 <User size={14} className="text-sky-500" /> ชื่อ-นามสกุล
              </label>
              <input required type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-2xl px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                  <User size={14} className="text-sky-500" /> ชื่อเล่น
               </label>
               <input required type="text" value={editingStudent.nickname} onChange={e => setEditingStudent({...editingStudent, nickname: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-2xl px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all`} placeholder="มีนา / น้อย / มด..." />
            </div>
            <div className="space-y-2">
               <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                  <BookOpen size={14} className="text-sky-500" /> ระดับชั้น
               </label>
               <select value={editingStudent.grade} onChange={e => setEditingStudent({...editingStudent, grade: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-2xl px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all appearance-none cursor-pointer`}>
                 {[
                   'อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3',
                   'ประถมศึกษา 1', 'ประถมศึกษา 2', 'ประถมศึกษา 3', 'ประถมศึกษา 4', 'ประถมศึกษา 5', 'ประถมศึกษา 6',
                   'มัธยมศึกษา 1', 'มัธยมศึกษา 2', 'มัธยมศึกษา 3', 'มัธยมศึกษา 4', 'มัธยมศึกษา 5', 'มัธยมศึกษา 6'
                 ].map(g => (
                    <option key={g} value={g}>{g}</option>
                 ))}
               </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
               <Phone size={14} className="text-sky-500" /> เบอร์โทรผู้ปกครอง
            </label>
            <input required type="text" value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-2xl px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all`} />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onDeleteClick} className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
               <Trash2 size={18} /> ลบ
            </button>
            <button type="submit" className={`flex-[2] gradient-emerald text-white ${FONT.LABEL_BLACK} py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2 hover:scale-[1.02]`}>
               <Save size={18} /> บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
