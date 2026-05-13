import React from 'react';
import { X, Trash2, User, Phone, BookOpen, Save } from 'lucide-react';
import { Student } from '../functions/types';
import { FONT } from '../functions/fontsize';
import { formatPhone } from '../functions/utils';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full h-full sm:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-[100dvh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3] bg-white shrink-0">
           <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold text-[#566a7f]">แก้ไขข้อมูลนักเรียน</h3>
              <span className="text-[13px] text-[#a1acb8] font-normal leading-relaxed">อัปเดตข้อมูลของ {editingStudent.name}</span>
           </div>
           <button onClick={onClose} type="button" className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#566a7f] ml-1">คำนำหน้า</label>
                <select required value={editingStudent.prefix} onChange={e => setEditingStudent({...editingStudent, prefix: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all cursor-pointer">
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
                  <option value="นาย">นาย</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[13px] font-medium text-[#566a7f] ml-1">ชื่อ-นามสกุล</label>
                <input required type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                 <label className="text-[13px] font-medium text-[#566a7f] ml-1">ชื่อเล่น</label>
                 <input required type="text" value={editingStudent.nickname} onChange={e => setEditingStudent({...editingStudent, nickname: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[13px] font-medium text-[#566a7f] ml-1">ระดับชั้น</label>
                 <input list="grade-list-edit" required value={editingStudent.grade} onChange={e => setEditingStudent({...editingStudent, grade: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" placeholder="พิมพ์หรือเลือกระดับชั้น..." />
                 <datalist id="grade-list-edit">
                   {[
                     'ก่อนอนุบาล',
                     'อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3',
                     'ประถมศึกษาปีที่ 1', 'ประถมศึกษาปีที่ 2', 'ประถมศึกษาปีที่ 3', 'ประถมศึกษาปีที่ 4', 'ประถมศึกษาปีที่ 5', 'ประถมศึกษาปีที่ 6',
                     'มัธยมศึกษาปีที่ 1', 'มัธยมศึกษาปีที่ 2', 'มัธยมศึกษาปีที่ 3', 'มัธยมศึกษาปีที่ 4', 'มัธยมศึกษาปีที่ 5', 'มัธยมศึกษาปีที่ 6'
                   ].map(g => (
                      <option key={g} value={g} />
                   ))}
                 </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#566a7f] ml-1">เบอร์โทรศัพท์ผู้ปกครอง</label>
              <div className="relative group">
                 <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1acb8] group-focus-within:text-[#696cff] transition-colors" />
                 <input required type="text" value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: formatPhone(e.target.value)})} className="w-full bg-white border border-[#d9dee3] rounded-md py-2.5 pl-11 pr-4 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#d9dee3] flex gap-3 justify-end shrink-0 bg-slate-50/50">
            <button type="button" onClick={onDeleteClick} className="w-10 h-10 rounded-md border border-transparent text-[#ff3e1d] flex items-center justify-center hover:bg-[#ffe2e3] transition-colors">
              <Trash2 size={20} />
            </button>
            <div className="flex-1"></div>
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]">ยกเลิก</button>
            <button type="submit" className="px-6 py-2 rounded-md font-medium text-[14px] bg-[#696cff] text-white hover:bg-[#5f61e6] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(105,108,255,0.4)] transition-all">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
};
