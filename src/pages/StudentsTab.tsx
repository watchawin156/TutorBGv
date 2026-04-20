import React, { useState } from 'react';
import { Plus, Phone, Clock, Edit2, RotateCcw, Wallet, History as HistoryIcon, Calendar, AlertTriangle, RefreshCw, User, Users, MoreHorizontal, ChevronRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatThaiDate } from '../functions/utils';
import { FONT } from '../functions/fontsize';
import { Student, Course } from '../functions/types';

import { StudentCoursesModal } from '../modals/StudentCoursesModal';

interface StudentsTabProps {
   students: Student[];
   courses: Course[];
   onAddStudent: () => void;
   onEditStudent: (student: Student) => void;
   onRegister: (student: Student, courseId?: number) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
   students,
   courses,
   onAddStudent,
   onEditStudent,
   onRegister,
}) => {
    const [selectedStudentForCourses, setSelectedStudentForCourses] = useState<Student | null>(null);

    return (
       <div className="h-full flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
         
         {/* Student List */}
         <div className="flex-1 rounded-3xl md:rounded-[32px] border border-slate-100 bg-white shadow-figma-soft overflow-hidden flex flex-col min-h-0">
               <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                  <table className="w-full text-left border-collapse table-fixed">
                     <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-12 md:w-20 text-center`}>#</th>
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase`}>นักเรียน</th>
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-24 md:w-32 text-center`}>ระดับชั้น</th>
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-32 md:w-48 text-center`}>เบอร์ผู้ปกครอง</th>
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-24 md:w-32 text-center`}>คงเหลือ</th>
                           <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-24 md:w-40 text-center`}>จัดการ</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {students.map((student, index) => {
                           const hasCourses = student.courseSessions.length > 0;
                           const minBalance = hasCourses 
                              ? Math.min(...student.courseSessions.map(cs => cs.balance))
                              : 0;
                           const isLowQuota = hasCourses && minBalance <= 2;

                           return (
                              <React.Fragment key={student.id}>
                                <tr 
                                   className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                   onClick={() => setSelectedStudentForCourses(student)}
                                >
                                   <td className={`p-4 md:p-6 text-center ${FONT.LABEL_SM_BLACK} text-slate-400`}>
                                      {(index + 1).toString().padStart(2, '0')}
                                   </td>
                                   <td className="p-4 md:p-6">
                                      <div className="flex items-center gap-2 truncate pr-2">
                                          <span className={`${FONT.STUDENT_NAME} text-slate-900 truncate`}>{student.name}</span>
                                          <span className={`${FONT.STUDENT_NAME} text-blue-500 truncate`}>(น้อง{student.nickname})</span>
                                       </div>
                                   </td>
                                   <td className="p-4 md:p-6 text-center">
                                      <span className={`${FONT.DATA_REG} text-slate-900 bg-slate-100/50 px-2 md:px-3 py-1 rounded-lg border border-slate-200/50 truncate max-w-full block w-fit mx-auto`}>
                                         {student.grade}
                                      </span>
                                   </td>
                                   <td className="p-4 md:p-6">
                                      <div className="flex justify-center">
                                         <a 
                                            href={`tel:${student.parentPhone}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors w-fit truncate max-w-full"
                                         >
                                            <Phone size={14} className="text-blue-500 opacity-60 shrink-0" />
                                            <span className={`${FONT.DATA_REG} truncate`}>{student.parentPhone}</span>
                                         </a>
                                      </div>
                                   </td>
                                   <td className="p-4 md:p-6 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                         <span className={`${FONT.DATA_REG} ${isLowQuota ? 'text-rose-500 font-black' : 'text-slate-900'}`}>
                                            {minBalance}
                                         </span>
                                         <span className={`${FONT.DATA_REG} text-slate-400 uppercase text-[12px]`}>ครั้ง</span>
                                      </div>
                                   </td>
                                   <td className="p-4 md:p-6">
                                      <div className="flex items-center justify-center gap-2 md:gap-3">
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onRegister(student); }}
                                            title="ลงทะเบียนเพิ่ม"
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95 border border-emerald-100 shrink-0"
                                         >
                                            <Plus size={16} className="md:w-[18px] md:h-[18px] stroke-[2.5px]" />
                                         </button>
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onEditStudent(student); }}
                                            title="แก้ไขข้อมูล"
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                                         >
                                            <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                                         </button>
                                       </div>
                                   </td>
                                </tr>
                              </React.Fragment>
                           );
                        })}
                     </tbody>
                  </table>
                  {students.length === 0 && (
                     <div className="p-20 text-center">
                        <Users size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className={`${FONT.H4} text-slate-900 mb-2`}>ยังไม่มีนักเรียน</h3>
                        <p className={`${FONT.LABEL_SM} text-slate-500 uppercase`}>เพิ่มนักเรียนคนแรกของคุณเพื่อเริ่มต้น</p>
                     </div>
                  )}
               </div>
            </div>

            <StudentCoursesModal 
               show={selectedStudentForCourses !== null}
               student={selectedStudentForCourses}
               courses={courses}
               onClose={() => setSelectedStudentForCourses(null)}
            />
      </div>
   );
};
