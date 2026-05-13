import React from 'react';
import { X, Calendar, DollarSign, History, BookOpen } from 'lucide-react';
import { Student, Course } from '../functions/types';
import { formatThaiDateNumeric } from '../functions/utils';
import { FONT } from '../functions/fontsize';

interface HistoryModalProps {
  show: boolean;
  onClose: () => void;
  student: Student | null;
  courses: Course[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ show, onClose, student, courses }) => {
  if (!show || !student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full h-full sm:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-[100dvh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3] bg-white shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#e6e6ff] text-[#696cff] flex items-center justify-center">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#566a7f] leading-none">ประวัติการชำระเงิน</h3>
                <span className="text-[13px] text-[#a1acb8] mt-1">{student.name} ({student.nickname})</span>
              </div>
           </div>
           <button onClick={onClose} type="button" className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
          {student.history.length === 0 && <div className="text-center py-12 text-[15px] text-[#a1acb8]">ยังไม่มีประวัติการลงทะเบียน</div>}
          {student.history.map(entry => {
            const course = courses.find(c => c.id === entry.courseId);
            return (
               <div key={entry.id} className="flex flex-col p-4 bg-white border border-[#d9dee3] rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#e6e6ff] text-[#696cff] flex items-center justify-center shrink-0"><BookOpen size={16} /></div>
                    <span className="font-semibold text-[15px] text-[#566a7f]">{course ? course.name : 'ไม่ระบุวิชา'}</span>
                  </div>
                  <span className="bg-[#e8fadf] text-[#71dd37] px-2 py-1 rounded-[4px] text-[12px] font-semibold shadow-sm">ชำระเงินเรียบร้อยแล้ว</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#d9dee3] pt-3">
                  <div className="flex items-center gap-3 text-[13px] text-[#a1acb8]">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatThaiDateNumeric(entry.date)}</span>
                    <span className="w-[3px] h-[3px] bg-[#d9dee3] rounded-full" />
                    <span className="flex items-center gap-1.5"><DollarSign size={14} /> ID: {entry.id}</span>
                  </div>
                  <span className="font-bold text-[16px] text-[#696cff]">{entry.amount.toLocaleString()} <span className="font-normal text-[13px] text-[#a1acb8]">บาท</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
