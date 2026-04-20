import React from 'react';
import { X, Calendar, DollarSign, History, BookOpen } from 'lucide-react';
import { Student, Course } from '../functions/types';
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-slate-100 font-sans">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white text-slate-800">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20"><History size={32} /></div>
            <div>
              <h3 className={`${FONT.H2} font-extrabold text-slate-900`}>ประวัติการชำระเงิน</h3>
              <p className={`text-slate-900 ${FONT.BODY_SM} mt-1`}>{student.name} ({student.nickname})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-all hover:rotate-90"><X size={24} /></button>
        </div>
        
        <div className="p-10 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
          {student.history.length === 0 && <p className={`text-center py-20 bg-slate-50 rounded-3xl ${FONT.LABEL_BLACK} text-slate-900`}>ยังไม่มีประวัติการลงทะเบียน</p>}
          {student.history.map(entry => {
            const course = courses.find(c => c.id === entry.courseId);
            return (
              <div key={entry.id} className="flex flex-col p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm"><BookOpen size={24} /></div>
                    <span className={`${FONT.BODY_LG} font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors`}>{course ? course.name : 'ไม่ระบุวิชา'}</span>
                  </div>
                  <span className={`bg-sky-50 text-sky-600 px-3 py-1 rounded-lg ${FONT.LABEL_BLACK} uppercase shadow-sm`}>ชำระเงินเรียบร้อยแล้ว</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-3 text-slate-900 ${FONT.LABEL}">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {entry.date}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5"><DollarSign size={14} /> ID: {entry.id}</span>
                  </div>
                  <span className={`${FONT.H5} font-black text-slate-900`}>{entry.amount.toLocaleString()} <span className={`${FONT.LABEL} text-slate-900`}>บาท</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
