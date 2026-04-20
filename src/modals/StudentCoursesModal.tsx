import React from 'react';
import { X, Clock, BookOpen } from 'lucide-react';
import { FONT } from '../functions/fontsize';
import { Student, Course, CourseSession } from '../functions/types';

interface StudentCoursesModalProps {
  show: boolean;
  student: Student | null;
  courses: Course[];
  onClose: () => void;
}

export const StudentCoursesModal: React.FC<StudentCoursesModalProps> = ({ show, student, courses, onClose }) => {
  if (!show || !student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} className="stroke-[2.5px]" />
             </div>
             <div>
                <h3 className={`${FONT.H4} text-slate-900 leading-tight`}>วิชาที่ลงทะเบียนเรียน</h3>
                <p className={`${FONT.BODY_SM} text-slate-500 mt-1`}>
                  นักเรียน: <span className="font-bold text-slate-900">{student.name}</span> (น้อง{student.nickname})
                </p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all flex items-center justify-center border border-slate-200 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-slate-50/30 flex-1">
           <div className="grid grid-cols-1 gap-4">
              {student.courseSessions.map((session: CourseSession, sIndex: number) => {
                 const course = courses.find(c => c.id === session.courseId);
                 const isSessionLow = session.balance <= 2;
                 return (
                    <div key={sIndex} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group/course hover:border-blue-200 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${isSessionLow ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'} flex items-center justify-center shrink-0`}>
                             <Clock size={24} className="stroke-[2.5px]" />
                          </div>
                          <div className="min-w-0">
                             <p className={`${FONT.LABEL_BLACK} text-slate-900 truncate`}>{course?.name || 'ไม่พบวิชา'}</p>
                             <p className={`${FONT.NANO_BLACK} text-slate-400 uppercase mt-0.5`}>ห้อง {course?.room || '-'}</p>
                          </div>
                       </div>
                       <div className="text-right shrink-0">
                          <p className={`${FONT.BODY_MD} font-black ${isSessionLow ? 'text-rose-500' : 'text-slate-900'}`}>{session.balance} / {session.totalSessions}</p>
                          <p className={`${FONT.NANO_BLACK} text-slate-400 uppercase mt-0.5`}>คงเหลือ (ครั้ง)</p>
                       </div>
                    </div>
                 );
              })}
              {student.courseSessions.length === 0 && (
                 <div className={`col-span-full py-12 text-center text-slate-400 ${FONT.LABEL} italic bg-white rounded-3xl border border-slate-100 border-dashed`}>
                    ยังไม่มีคอร์สที่ลงทะเบียนไว้
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
