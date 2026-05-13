import React, { useState, useRef } from 'react';
import { X, Clock, BookOpen, Trash2, AlertTriangle, ArrowLeftRight, ArrowLeft } from 'lucide-react';
import { FONT } from '../functions/fontsize';
import { Student, Course, CourseSession } from '../functions/types';

interface StudentCoursesModalProps {
  show: boolean;
  student: Student | null;
  courses: Course[];
  onClose: () => void;
  onRemoveRegistration?: (courseId: number) => void;
  onRegister?: (student: Student, courseId?: number) => void;
}

export const StudentCoursesModal: React.FC<StudentCoursesModalProps> = ({ show, student, courses, onClose, onRemoveRegistration, onRegister }) => {
  const [selectedCourseHistory, setSelectedCourseHistory] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmText, setConfirmText] = useState("");

  if (!show || !student) return null;

  // Render detail view if a course is selected
  if (selectedCourseHistory !== null) {
    const course = courses.find(c => c.id === selectedCourseHistory);
    const sessionDetail = student.courseSessions.find(cs => cs.courseId === selectedCourseHistory);
    const attendance = (student.attendanceLog || []).filter(log => log.courseId === selectedCourseHistory);

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-lg w-full h-full md:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300 max-h-[100dvh] md:max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white shrink-0">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setSelectedCourseHistory(null); setConfirmDeleteId(null); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold text-[#566a7f] line-clamp-1">{course?.name || 'ไม่พบวิชา'}</h3>
                  <p className="text-[13px] text-[#a1acb8]">ประวัติการเรียน (คงเหลือ {sessionDetail?.balance || 0} ครั้ง)</p>
                </div>
             </div>
             
             <button onClick={() => { setSelectedCourseHistory(null); onClose(); }} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors shrink-0">
                <X size={20} />
             </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50 flex-1">
             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">วันที่เข้าเรียน ({attendance.length})</h4>
             
             {attendance.length > 0 ? (
               <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                  {attendance.map((log, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                       <span className="text-[14px] font-medium text-slate-700">ครั้งที่ {i + 1}</span>
                       <span className="text-[14px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{new Date(log.date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="bg-white rounded-xl border border-slate-100 border-dashed py-8 flex flex-col items-center justify-center text-slate-400">
                  <Clock size={24} className="mb-2 opacity-20" />
                  <span className="text-[14px]">ยังไม่มีประวัติการเช็คชื่อ</span>
               </div>
             )}

             {/* Removed onRemoveRegistration block from history list */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg w-full h-full md:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-[100dvh] md:max-h-[90vh]">
        
        {/* Sneat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
           <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <h3 className="text-[18px] font-semibold text-[#566a7f]">วิชาที่ลงทะเบียนเรียน</h3>
              </div>
              <p className="text-[13px] text-[#a1acb8] mt-1">
                <span className="font-semibold text-[#566a7f]">{student.name}</span> (น้อง{student.nickname})
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              {onRegister && (
                 <button 
                    onClick={() => { onClose(); onRegister(student); }}
                    className="px-4 py-2 rounded-md bg-[#696cff] hover:bg-[#5f61e6] text-white text-[14px] font-medium transition-all shadow-[0_4px_12px_rgba(105,108,255,0.4)] hidden sm:block"
                 >
                    + ลงวิชาเรียน
                 </button>
              )}
              <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors shrink-0">
                <X size={20} />
              </button>
           </div>
        </div>
        {/* Mobile Header Register Button */}
        {onRegister && (
          <div className="sm:hidden px-6 py-3 border-b border-slate-100 bg-white">
             <button 
                onClick={() => { onClose(); onRegister(student); }}
                className="w-full py-2.5 rounded-md bg-[#696cff] text-white text-[14px] font-medium shadow-sm flex justify-center items-center gap-2"
             >
                <BookOpen size={16} /> ลงวิชาเรียนเพิ่ม
             </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50/50 flex-1">
           <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {/* Hint removed */}
              {student.courseSessions.map((session: CourseSession, sIndex: number) => {
                 const course = courses.find(c => c.id === session.courseId);
                 const total = session.totalSessions || 1;
                 const percent = (session.balance / total) * 100;
                 let borderColorClass = 'border-emerald-500/80'; // >= 76%
                 if (percent <= 25) {
                   borderColorClass = 'border-rose-500/80';
                 } else if (percent <= 75) {
                   borderColorClass = 'border-amber-500/80';
                 }

                 return (
                    <div key={sIndex} className="flex flex-col">
                       <div 
                          onClick={() => setSelectedCourseHistory(session.courseId)}
                          className="w-full bg-white rounded-lg p-3 sm:p-4 flex items-center justify-between cursor-pointer select-none transition-transform duration-200 border border-transparent hover:border-slate-300 shadow-[0_2px_14px_rgba(0,0,0,0.03)] active:scale-[0.98] active:bg-slate-50"
                       >
                             <div className="flex items-center gap-3 w-full">
                                {(() => {
                                   const avatarColors = [
                                      'bg-[#e6e6ff] text-[#696cff]', // Primary
                                      'bg-[#fff2d6] text-[#ffab00]', // Warning
                                      'bg-[#d7f5fc] text-[#03c3ec]',  // Info
                                      'bg-[#ffe2e3] text-[#ff3e1d]', // Danger
                                      'bg-[#e8fadf] text-[#71dd37]' // Success
                                   ];
                                   const avatarClass = avatarColors[sIndex % avatarColors.length];
                                   return (
                                     <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarClass}`}>
                                       {course?.name ? course.name.charAt(0) : '?'}
                                     </div>
                                   );
                                })()}
                                
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className={`font-semibold text-[#566a7f] text-[15px] truncate`}>{course?.name || 'ไม่พบวิชา'}</span>
                                    <span className="text-[13px] text-[#a1acb8] truncate">ห้อง {course?.room || '-'}</span>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                   {(() => {
                                      const strokeColors = [
                                         'stroke-[#696cff]',
                                         'stroke-[#ffab00]',
                                         'stroke-[#03c3ec]',
                                         'stroke-[#ff3e1d]',
                                         'stroke-[#71dd37]'
                                      ];
                                      const strokeClass = strokeColors[sIndex % strokeColors.length];
                                      const percentage = total > 0 ? Math.round((session.balance / total) * 100) : 0;
                                      const circleDasharray = 100.53; // 2 * pi * 16
                                      const circleOffset = circleDasharray - (percentage / 100) * circleDasharray;
                                      
                                      return (
                                        <div className="flex items-center gap-2">
                                           <div className="text-right flex flex-col items-end">
                                              <span className="text-[13px] font-semibold text-[#566a7f] whitespace-nowrap">{session.balance} ครั้ง</span>
                                              {onRegister && (
                                              <button
                                                 onClick={(e) => { e.stopPropagation(); onClose(); onRegister(student, session.courseId); }}
                                                 className="text-[11px] font-semibold text-[#696cff] hover:text-[#5f61e6] hover:underline"
                                              >
                                                 + ต่อวิชา
                                              </button>
                                              )}
                                           </div>
                                           <div className="relative w-9 h-9 flex items-center justify-center">
                                              <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                                                 <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                                                 <circle 
                                                   cx="18" 
                                                   cy="18" 
                                                   r="16" 
                                                   fill="none" 
                                                   className={`${strokeClass}`} 
                                                   strokeWidth="3" 
                                                   strokeDasharray={circleDasharray} 
                                                   strokeDashoffset={circleOffset}
                                                   strokeLinecap="round"
                                                 />
                                              </svg>
                                           </div>
                                           {onRemoveRegistration && (
                                              <button
                                                 onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(session.courseId); setConfirmText(""); }}
                                                 className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                                              >
                                                 <Trash2 size={16} />
                                              </button>
                                           )}
                                        </div>
                                      );
                                   })()}
                                </div>
                             </div>
                       </div>
                       {confirmDeleteId === session.courseId && onRemoveRegistration && (
                           <div className="mt-2 bg-rose-50 p-2 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                             <input
                               type="text"
                               value={confirmText}
                               onChange={(e) => setConfirmText(e.target.value)}
                               className="flex-1 bg-white border border-rose-200 rounded-md px-3 py-1.5 text-[13px] outline-none placeholder:text-rose-300"
                               placeholder="พิมพ์: ยืนยัน"
                               autoFocus
                               onClick={(e) => e.stopPropagation()}
                             />
                             <button
                               onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); setConfirmText(""); }}
                               className="px-3 py-1.5 bg-white text-slate-600 rounded-md text-[13px] font-bold border border-slate-200"
                             >
                               ยกเลิก
                             </button>
                             <button
                               onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirmText !== "ยืนยัน") return;
                                  onRemoveRegistration(session.courseId);
                                  setConfirmDeleteId(null);
                                  setConfirmText("");
                               }}
                               disabled={confirmText !== "ยืนยัน"}
                               className={`px-3 py-1.5 rounded-md text-[13px] font-bold transition-colors ${confirmText === "ยืนยัน" ? "bg-rose-500 text-white" : "bg-rose-500/50 text-white/80 cursor-not-allowed"}`}
                             >
                               ยืนยัน
                             </button>
                           </div>
                       )}
                    </div>
                 );
              })}
              {student.courseSessions.length === 0 && (
                 <div className={`col-span-full py-12 text-center text-slate-600 ${FONT.LABEL} italic bg-white rounded-xl border border-slate-100 border-dashed`}>
                    ยังไม่มีคอร์สที่ลงทะเบียนไว้
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
