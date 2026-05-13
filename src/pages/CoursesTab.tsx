import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, ChevronRight, MoreHorizontal, Search } from 'lucide-react';
import { Course, Student } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface CoursesTabProps {
   searchQuery?: string;
   courses: Course[];
   students: Student[];
   teacherName?: string;
   onEditCourse: (course: Course) => void;
   onCheckAttendance: (studentId: number, courseId: number, date: string) => void;
   onUndoAttendance: (studentId: number, courseId: number, date: string) => void;
   onEditStudent: (student: Student) => void;
   onDeleteStudent: (studentId: number) => void;
   onCourseClick?: (course: Course) => void;
}

const DAY_COLORS: { [key: string]: { bg: string, text: string, dot: string, border: string } } = {
   'จันทร์': { bg: 'bg-amber-50/60', text: 'text-amber-600', dot: 'bg-amber-400', border: 'border-amber-200/50' },
   'อังคาร': { bg: 'bg-rose-50/60', text: 'text-rose-600', dot: 'bg-rose-400', border: 'border-rose-200/50' },
   'พุธ': { bg: 'bg-emerald-50/60', text: 'text-emerald-600', dot: 'bg-emerald-400', border: 'border-emerald-200/50' },
   'พฤหัสบดี': { bg: 'bg-orange-50/60', text: 'text-orange-600', dot: 'bg-orange-400', border: 'border-orange-200/50' },
   'ศุกร์': { bg: 'bg-sky-50/60', text: 'text-sky-600', dot: 'bg-sky-400', border: 'border-sky-200/50' },
   'เสาร์': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400', border: 'border-blue-200' },
   'อาทิตย์': { bg: 'bg-red-50/60', text: 'text-red-600', dot: 'bg-red-400', border: 'border-red-200/50' },
};

const COURSE_GRADIENTS = [
   'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
   'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
   'linear-gradient(135deg, #334155 0%, #475569 100%)',
   'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
   'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
   'linear-gradient(135deg, #059669 0%, #047857 100%)',
];

export const CoursesTab: React.FC<CoursesTabProps> = ({
   searchQuery = '',
   courses,
   students,
   teacherName = 'แอดมิน ทิวเตอร์แอพ',
   onEditCourse,
   onCheckAttendance,
   onUndoAttendance,
   onEditStudent,
   onDeleteStudent,
   onCourseClick
}) => {
   const getThaiDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      return days[date.getDay()];
   };

   const getCourseStudents = (courseId: number) => {
      return students.filter(s => s.courseSessions.some(cs => cs.courseId === courseId));
   };

   const filteredCourses = useMemo(() => {
      if (!searchQuery) return courses;
      const query = searchQuery.toLowerCase();
      return courses.filter(course => 
         course.name.toLowerCase().includes(query) ||
         course.room?.toLowerCase().includes(query)
      );
   }, [courses, searchQuery]);

    return (
      <div className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar sm:custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <div className="space-y-4 md:space-y-6 lg:space-y-10 pb-0 sm:pb-4 lg:pb-10 pt-2 lg:pt-0">
         
         {/* Course Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredCourses.map((course, idx) => {
               const courseStudents = getCourseStudents(course.id);
               
               const COURSE_IMAGES = [
                  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
               ];
               const courseImage = COURSE_IMAGES[course.id % COURSE_IMAGES.length];
               
               const avatarColors = [
                  'bg-[#e8fadf] text-[#71dd37]',
                  'bg-[#e6e6ff] text-[#696cff]',
                  'bg-[#ffe2e3] text-[#ff3e1d]',
                  'bg-[#fff2d6] text-[#ffab00]',
                  'bg-[#d7f5fc] text-[#03c3ec]'
               ];

               return (
                  <div
                     id={`course-card-${course.id}`} 
                     key={course.id} 
                     className="bg-white rounded-2xl p-3 md:p-0 border border-slate-100 shadow-sm overflow-hidden flex flex-row md:flex-col group cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md items-stretch"
                     onClick={() => onCourseClick?.(course)}
                  >
                     {/* Mobile Only: Row Layout */}
                     <div className="flex md:hidden w-full gap-3">
                        <div className="w-[100px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                           <img src={courseImage} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/10 text-white flex items-center">
                              <span className="text-[10px] font-bold leading-tight">ห้อง {course.room}</span>
                           </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 py-0.5">
                           <div className="flex items-start justify-between mb-1">
                              <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#566a7f] leading-snug line-clamp-2 pr-1">{course.name}</h3>
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onEditCourse(course); }}
                                 className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-[#696cff] transition-colors -mr-1 -mt-1 shrink-0"
                              >
                                 <MoreHorizontal size={16} />
                              </button>
                           </div>
                           <span className="text-[12px] text-[#a1acb8] truncate mb-2">{teacherName}</span>
                           
                           <div className="flex flex-wrap gap-1 mb-auto">
                           {course.schedule && course.schedule.map((slot, i) => {
                               const tagColors = [
                                  'bg-[#e8fadf] text-[#71dd37]',
                                  'bg-[#e6e6ff] text-[#696cff]',
                                  'bg-[#d7f5fc] text-[#03c3ec]',
                                  'bg-[#fff2d6] text-[#ffab00]',
                                  'bg-[#ffe2e3] text-[#ff3e1d]'
                               ];
                               const bClass = tagColors[i % tagColors.length];
                               return (
                                  <span key={i} className={`text-[10px] sm:text-[11px] px-1.5 py-[2px] rounded-[4px] font-medium whitespace-nowrap ${bClass}`}>
                                     {slot.day} {slot.time}
                                  </span>
                               );
                           })}
                           </div>
                           
                           <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                              <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-[#a1acb8]">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                      <span className="text-[11px] font-medium">{courseStudents.length}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[#a1acb8]">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                      <span className="text-[11px] font-medium">{course.sessions} ชม.</span>
                                  </div>
                              </div>
                              <span className="text-[12px] font-bold text-[#696cff]">฿{course.price.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>

                     {/* Desktop Only: Column Layout */}
                     <div className="hidden md:flex flex-col h-full w-full">
                      {/* Header */}
                     <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 shrink-0">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-[#e6e6ff] flex items-center justify-center text-[#696cff] font-bold shrink-0 text-sm">
                               {teacherName?.charAt(0) || 'T'}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[14px] md:text-[15px] font-semibold text-[#566a7f] leading-tight truncate max-w-[150px]">{teacherName}</span>
                              <span className="text-[12px] md:text-[13px] text-[#a1acb8]">฿{course.price.toLocaleString()}</span>
                           </div>
                        </div>
                        <button 
                           onClick={(e) => { e.stopPropagation(); onEditCourse(course); }}
                           className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1acb8] hover:bg-slate-50 hover:text-[#696cff] transition-colors -mr-2"
                        >
                           <MoreHorizontal size={18} />
                        </button>
                     </div>

                     {/* Image Area */}
                     <div className="w-full h-[120px] sm:h-[160px] bg-slate-100 relative shrink-0">
                        <img src={courseImage} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
                        
                        {/* Overlaid Date/Room Badge */}
                        <div className="flex absolute -bottom-[18px] left-4 md:left-5 bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.12)] border border-[#d9dee3] flex-col justify-center items-center h-[42px] md:h-[52px] min-w-[42px] md:min-w-[52px] px-2">
                           <span className="text-[#566a7f] font-bold text-[14px] md:text-[17px] leading-tight">#{course.room}</span>
                           <span className="text-[8px] md:text-[10px] text-[#696cff] font-semibold uppercase tracking-wider">ห้อง</span>
                        </div>
                     </div>

                     {/* Content Area */}
                     <div className="px-4 md:px-5 py-4 md:pt-10 md:pb-5 flex flex-col min-w-0 flex-1 mt-3 md:mt-0">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                           <h3 className="text-[16px] md:text-[17px] font-semibold text-[#566a7f] leading-snug line-clamp-2 md:line-clamp-2">{course.name}</h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
                            {course.schedule && course.schedule.map((slot, i) => {
                               const tagColors = [
                                  'bg-[#e8fadf] text-[#71dd37]',
                                  'bg-[#e6e6ff] text-[#696cff]',
                                  'bg-[#d7f5fc] text-[#03c3ec]',
                                  'bg-[#fff2d6] text-[#ffab00]',
                                  'bg-[#ffe2e3] text-[#ff3e1d]'
                               ];
                               const bClass = tagColors[i % tagColors.length];
                               return (
                                  <span key={i} className={`text-[11px] md:text-[12px] px-2 py-0.5 rounded-[4px] md:rounded-[0.25rem] font-medium whitespace-nowrap ${bClass}`}>
                                     {slot.day} {slot.time}
                                  </span>
                               );
                            })}
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="flex flex-row items-center justify-between mt-auto">
                           <div className="flex items-center">
                              {courseStudents.slice(0, 4).map((st, i) => (
                                  <div 
                                     key={st.id} 
                                     title={st.name}
                                     className={`w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full border-[1.5px] md:border-2 border-white flex items-center justify-center text-[10px] md:text-xs font-bold -ml-[8px] md:-ml-[10px] first:ml-0 relative z-[${10-i}] shadow-sm md:shadow-[0_2px_4px_rgba(0,0,0,0.05)] md:hover:-translate-y-1 transition-transform ${avatarColors[st.id % avatarColors.length]}`}
                                  >
                                      {st.name.charAt(0)}
                                  </div>
                              ))}
                              {courseStudents.length > 4 && (
                                  <div className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full border-[1.5px] md:border-2 border-white bg-slate-100 text-[#566a7f] flex items-center justify-center text-[10px] md:text-xs font-bold -ml-[8px] md:-ml-[10px] relative z-[0] shadow-sm md:shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                                     +{courseStudents.length - 4}
                                  </div>
                              )}
                              {courseStudents.length === 0 && (
                                  <span className="text-[12px] md:text-[13px] text-[#a1acb8] ml-1 md:ml-0">ยังไม่มีผู้เรียน</span>
                              )}
                           </div>
                           
                           {/* Button is visible on both mobile and desktop now because we have space */}
                           <button className="px-3 md:px-4 py-1.5 md:py-[7px] bg-[#696cff] text-white text-[12px] md:text-[13px] font-medium rounded-lg md:rounded-[0.375rem] hover:bg-[#5f61e6] hover:shadow-[0_0.125rem_0.25rem_0_rgba(105,108,255,.4)] hover:-translate-y-[1px] transition-all">
                               ดูรายละเอียด
                           </button>
                        </div>

                        {/* Footer Icons like screenshot */}
                        <div className="flex items-center gap-4 mt-4 md:mt-5 pt-3 md:pt-4 border-t border-slate-100/60 text-[#a1acb8]">
                           <div className="flex items-center gap-1.5 hover:text-[#696cff] transition-colors cursor-pointer">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                               <span className="text-[13px] md:text-[14px] font-medium">{courseStudents.length}</span>
                           </div>
                           <div className="flex items-center gap-1.5 hover:text-[#03c3ec] transition-colors cursor-pointer">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                               <span className="text-[13px] md:text-[14px] font-medium">{course.sessions} ชม.</span>
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
