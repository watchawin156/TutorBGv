import React from 'react';
import { X, User, Phone, BookOpen } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface AddStudentModalProps {
  show: boolean;
  onClose: () => void;
  newStudent: { name: string, prefix: string, nickname: string, grade: string, parentPhone: string };
  setNewStudent: (student: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ show, onClose, newStudent, setNewStudent, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl md:rounded-[48px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-white/50 flex flex-col p-2 md:p-2 max-h-[90vh] md:max-h-none overflow-y-auto">
        <div className="p-6 md:p-10 flex items-center justify-between shrink-0">
          <div>
            <h3 className={`${FONT.H2} text-slate-900 leading-none`}>เพิ่มนักเรียนใหม่</h3>
            <p className={`text-slate-900 ${FONT.LABEL_SM} mt-2 uppercase`}>แบบฟอร์มลงทะเบียนนักเรียน</p>
          </div>
          <button onClick={onClose} type="button" className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-xl md:rounded-2xl transition-all flex items-center justify-center border border-slate-100/50 shadow-soft shrink-0"><X size={24} className="stroke-[3px]" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="px-6 pb-6 md:px-10 md:pb-10 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className={`${FONT.LABEL_SM_BLACK} text-slate-900 uppercase ml-1`}>คำนำหน้า</label>
              <select required value={newStudent.prefix} onChange={e => setNewStudent({...newStudent, prefix: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-6 py-4 ${FONT.BODY_MD} font-black text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-50 transition-all appearance-none cursor-pointer`}>
                <option value="">เลือก...</option>
                <option value="เด็กชาย">เด็กชาย</option>
                <option value="เด็กหญิง">เด็กหญิง</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className={`${FONT.LABEL_SM_BLACK} text-slate-900 uppercase ml-1`}>ชื่อ - นามสกุล</label>
              <input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-8 py-4 ${FONT.BODY_MD} font-black text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-50 transition-all`} placeholder="กรอกชื่อ-นามสกุล..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className={`${FONT.LABEL_SM_BLACK} text-slate-900 uppercase ml-1`}>ชื่อเล่น</label>
               <input required type="text" value={newStudent.nickname} onChange={e => setNewStudent({...newStudent, nickname: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-8 py-4 ${FONT.BODY_MD} font-black text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-50 transition-all`} placeholder="เช่น น้องมิกกี้..." />
            </div>
            <div className="space-y-3">
               <label className={`${FONT.LABEL_SM_BLACK} text-slate-900 uppercase ml-1`}>ระดับชั้น</label>
               <select value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-8 py-4 ${FONT.BODY_MD} font-black text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-50 transition-all appearance-none cursor-pointer`}>
                 <option value="">เลือกคลาส...</option>
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

          <div className="space-y-3">
            <label className={`${FONT.LABEL_SM_BLACK} text-slate-900 uppercase ml-1`}>เบอร์โทรศัพท์ผู้ปกครอง</label>
            <div className="relative group">
               <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-900 group-focus-within:text-blue-500 transition-colors" />
               <input required type="text" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-16 pr-8 ${FONT.BODY_MD} font-black text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-50 transition-all`} placeholder="08x-xxx-xxxx" />
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 pt-4 md:pt-6">
            <button type="button" onClick={onClose} className={`flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 ${FONT.LABEL_BLACK} uppercase py-4 md:py-5 rounded-2xl md:rounded-[24px] transition-all`}>ยกเลิก</button>
            <button type="submit" className={`flex-[2] gradient-emerald text-white ${FONT.LABEL_BLACK} uppercase py-4 md:py-5 rounded-2xl md:rounded-[24px] transition-all shadow-xl shadow-emerald-200 active:scale-95 hover:scale-[1.02]`}>บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
};
