import React from 'react';
import { BookOpen, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Course, Student } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface CoursesTabProps {
   courses: Course[];
   students: Student[];
   teacherName?: string;
   onEditCourse: (course: Course) => void;
   onCheckAttendance: (studentId: number, courseId: number, date: string) => void;
   onUndoAttendance: (studentId: number, courseId: number, date: string) => void;
   onEditStudent: (student: Student) => void;
   onDeleteStudent: (studentId: number) => void;
}

const DAY_COLORS: { [key: string]: { bg: string, text: string, dot: string, border: string } } = {
   'จันทร์': { bg: 'bg-amber-50/60', text: 'text-amber-600', dot: 'bg-amber-400', border: 'border-amber-200/50' },
   'อังคาร': { bg: 'bg-rose-50/60', text: 'text-rose-600', dot: 'bg-rose-400', border: 'border-rose-200/50' },
   'พุธ': { bg: 'bg-emerald-50/60', text: 'text-emerald-600', dot: 'bg-emerald-400', border: 'border-emerald-200/50' },
   'พฤหัสบดี': { bg: 'bg-orange-50/60', text: 'text-orange-600', dot: 'bg-orange-400', border: 'border-orange-200/50' },
   'ศุกร์': { bg: 'bg-sky-50/60', text: 'text-sky-600', dot: 'bg-sky-400', border: 'border-sky-200/50' },
   'เสาร์': { bg: 'bg-purple-50/60', text: 'text-purple-600', dot: 'bg-purple-400', border: 'border-purple-200/50' },
   'อาทิตย์': { bg: 'bg-red-50/60', text: 'text-red-600', dot: 'bg-red-400', border: 'border-red-200/50' },
};

const COURSE_GRADIENTS = [
   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
   'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
   'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
   'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
   'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
   'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
];

export const CoursesTab: React.FC<CoursesTabProps> = ({
   courses,
   students,
   teacherName = 'แอดมิน ทิวเตอร์แอพ',
   onEditCourse,
   onCheckAttendance,
   onUndoAttendance,
   onEditStudent,
   onDeleteStudent,
}) => {
   const getThaiDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      return days[date.getDay()];
   };

   const getCourseStudents = (courseId: number) => {
      return students.filter(s => s.courseSessions.some(cs => cs.courseId === courseId));
   };

    return (
      <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <div className="space-y-10 pb-10">
         
         {/* Course Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {courses.map((course, idx) => {
               const courseStudents = getCourseStudents(course.id);
               const gradient = idx % 3 === 0 ? 'gradient-blue' : idx % 3 === 1 ? 'gradient-emerald' : 'gradient-purple';
               
               return (
                  <div id={`course-card-${course.id}`} key={course.id} className="relative w-full transition-all duration-700 select-none min-h-[380px]">
                     
                     {/* FRONT SIDE */}
                     <div className="w-full h-full">
                        <div 
                           className={`relative overflow-hidden rounded-3xl md:rounded-[40px] p-6 md:p-8 h-full flex flex-col text-white shadow-2xl transition-all hover:scale-[1.02] ${gradient === 'gradient-blue' ? 'shadow-blue-200' : gradient === 'gradient-emerald' ? 'shadow-emerald-200' : 'shadow-purple-200'} ${gradient}`}
                        >
                           {/* Decorative background icon */}
                           <BookOpen size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" />

                           {/* Top Actions */}
                           <div className="flex items-start justify-between relative z-10 mb-8">
                              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                 <BookOpen size={28} className="stroke-[2.5px]" />
                              </div>
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onEditCourse(course); }}
                                 className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                              >
                                 <MoreHorizontal size={20} />
                              </button>
                           </div>

                           {/* Course Info */}
                           <div className="relative z-10 flex-1">
                              <h3 className={`${FONT.H3} leading-tight`}>{course.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-4">
                                 {course.schedule && course.schedule.map((slot, i) => (
                                    <span key={i} className={`${FONT.MICRO_BLACK} bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase`}>
                                       {slot.day} {slot.time}
                                    </span>
                                 ))}
                              </div>
                           </div>

                           {/* Bottom Stats Grid */}
                           <div className="relative z-10 mt-auto pt-6 border-t border-white/10">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                       <span className={`${FONT.MICRO_BLACK} text-white uppercase opacity-70`}>ห้องเรียน</span>
                                       <span className={`${FONT.BODY_MD} font-black`}>#{course.room}</span>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className={`${FONT.MICRO_BLACK} text-white uppercase opacity-70`}>นักเรียน</span>
                                       <span className={`${FONT.BODY_MD} font-black`}>{courseStudents.length} คน</span>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className={`${FONT.H4} font-black`}>${course.price.toLocaleString()}</span>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between bg-white/10 rounded-2xl p-3 backdrop-blur-md">
                                 <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-white" />
                                    <span className={`${FONT.LABEL_SM} text-white`}>{course.sessions} ชั่วโมงรวม</span>
                                 </div>
                                 <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
         </div>
      </div>
   );
};

export default CoursesTab;
