import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  PieChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bell,
  MoreHorizontal,
  UserCheck,
  Layout,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CourseWithStudents } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface TimetableTabProps {
  courses: CourseWithStudents[];
  timetableRef: React.RefObject<HTMLDivElement>;
  onViewCourse: (course: any) => void;
  onCheckAttendance: (course: any) => void;
}

const DAY_THEMES: { [key: string]: { bg: string, text: string, accent: string, border: string, solid: string } } = {
  'จันทร์': { bg: 'bg-[#FFFDE7]', text: 'text-[#FBC02D]', accent: 'bg-[#FBC02D]', border: 'border-[#FBC02D]', solid: 'bg-[#FBC02D]' },
  'อังคาร': { bg: 'bg-[#FDF2F8]', text: 'text-[#EC4899]', accent: 'bg-[#EC4899]', border: 'border-[#EC4899]', solid: 'bg-[#EC4899]' },
  'พุธ': { bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', accent: 'bg-[#22C55E]', border: 'border-[#22C55E]', solid: 'bg-[#22C55E]' },
  'พฤหัสบดี': { bg: 'bg-[#FFF7ED]', text: 'text-[#F97316]', accent: 'bg-[#F97316]', border: 'border-[#F97316]', solid: 'bg-[#F97316]' },
  'ศุกร์': { bg: 'bg-[#F0F9FF]', text: 'text-[#0EA5E9]', accent: 'bg-[#0EA5E9]', border: 'border-[#0EA5E9]', solid: 'bg-[#0EA5E9]' },
  'เสาร์': { bg: 'bg-[#FAF5FF]', text: 'text-[#A855F7]', accent: 'bg-[#A855F7]', border: 'border-[#A855F7]', solid: 'bg-[#A855F7]' },
  'อาทิตย์': { bg: 'bg-[#FEF2F2]', text: 'text-[#EF4444]', accent: 'bg-[#EF4444]', border: 'border-[#EF4444]', solid: 'bg-[#EF4444]' },
};

export const TimetableTab: React.FC<TimetableTabProps> = ({ courses, timetableRef, onViewCourse, onCheckAttendance }) => {
  const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 to 20:00
  const START_H = 8;
  const TOTAL_H = 12;

  const parseTime = (timeStr: string) => {
    try {
      const parts = timeStr.split('-');
      if (parts.length < 2) return { start: 8, end: 9 };
      const startStr = parts[0].trim().replace('.', ':');
      const endStr = parts[1].trim().replace('.', ':');
      
      const parseSingleTime = (str: string) => {
        const [h, m] = str.split(':').map(Number);
        return h + (m || 0) / 60;
      };

      return {
        start: parseSingleTime(startStr),
        end: parseSingleTime(endStr)
      };
    } catch (e) {
      return { start: 8, end: 9 };
    }
  };

  return (
    <div ref={timetableRef} className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden md:min-h-[500px]">
      
      {/* Mobile View: Vertical List */}
      <div className="md:hidden flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6 pt-2 h-full relative z-10">
         {weekDays.map(day => {
            const dayCourses = courses.flatMap(c => 
               c.schedule.filter(s => s.day === day).map(s => ({ course: c, slot: s }))
            );
            if (dayCourses.length === 0) return null;

            // sort by start time
            dayCourses.sort((a, b) => parseTime(a.slot.time).start - parseTime(b.slot.time).start);
            const theme = DAY_THEMES[day] || { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-200' };

            return (
               <div key={day} className="flex flex-col gap-3">
                  <h3 className={`${FONT.H5} ${theme.text} mb-1 flex items-center gap-2`}>
                     <div className={`w-3 h-3 rounded-full ${theme.solid || 'bg-slate-900'}`} />
                     วัน{day}
                  </h3>
                  <div className="flex flex-col gap-3">
                     {dayCourses.map(({ course, slot }, idx) => (
                        <div 
                           key={`${course.id}-${idx}`}
                           onClick={() => onViewCourse(course)}
                           className={`p-4 rounded-xl ${theme.bg} ${theme.border} border-l-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg active:scale-95 transition-all flex flex-col justify-between gap-3 border-y border-r border-y-transparent border-r-transparent`}
                        >
                           <div className="flex flex-col min-w-0">
                              <h4 className={`text-[15px] font-black text-slate-800 leading-tight break-words line-clamp-3`}>{course.name}</h4>
                              <div className="flex items-center gap-2 mt-1.5">
                                 <Clock size={14} className={theme.text} />
                                 <span className={`text-[14px] font-bold ${theme.text} leading-none`}>{slot.time}</span>
                              </div>
                           </div>
                           <div className="flex items-center justify-between mt-1 shrink-0">
                               <div className="flex items-center gap-1.5 opacity-80 text-slate-700">
                                  <Users size={16} className="text-slate-700" />
                                  <span className={`text-[14px] font-medium leading-none`}>{course.students.length}</span>
                               </div>
                               <button
                                  onClick={(e) => { e.stopPropagation(); onCheckAttendance(course); }}
                                  className={`w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all shrink-0`}
                               >
                                  <UserCheck size={14} />
                               </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );
         })}
         {courses.length === 0 && (
            <div className="text-center text-slate-400 mt-10">ยังไม่มีตารางเรียน</div>
         )}
      </div>

      {/* Desktop View: Grid Timeline */}
      <div className="hidden md:flex flex-1 bg-white xl:rounded-2xl shadow-sm border border-slate-100 flex-col overflow-y-auto overflow-x-auto custom-scrollbar lg:mx-0">
        {/* ส่วนหัว: ช่วงเวลา */}
        <div className="grid grid-cols-[80px_1fr] md:grid-cols-[112px_1fr] min-w-[800px] lg:min-w-0 border-b border-slate-50 bg-slate-50/50 shrink-0">
          <div className={`p-3 md:p-5 border-r border-slate-50 ${FONT.CAPTION_BLACK} text-slate-900 uppercase flex items-center justify-center text-xs md:text-sm`}>วัน / เวลา</div>
          <div className="flex divide-x divide-slate-100">
            {hours.slice(0, -1).map(h => (
              <div key={h} className="flex-1 p-3 md:p-5 text-center">
                <span className={`${FONT.CAPTION_BLACK} text-slate-900 text-xs md:text-sm`}>{h.toString().padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* ส่วนเนื้อหา: วันต่างๆ */}
        <div className="flex-1 flex flex-col divide-y divide-slate-50 overflow-hidden min-w-[800px] lg:min-w-0 bg-white">
          {weekDays.map(day => (
            <div key={day} className="grid grid-cols-[80px_1fr] md:grid-cols-[112px_1fr] flex-1 min-h-[140px] relative group">
              {/* คอลัมน์วัน */}
              <div className="border-r border-slate-50 flex items-center justify-center shrink-0 bg-slate-50/20">
                <span className={`${FONT.LABEL_BLACK} ${DAY_THEMES[day]?.text || 'text-slate-800'}`}>{day}</span>
              </div>

              {/* ตารางเวลาและคาร์ดวิชาเรียน */}
              <div className="relative w-full h-full overflow-hidden">
                {/* เส้นแบ่งเวลาแนวตั้ง */}
                <div className="absolute inset-0 flex divide-x divide-slate-50/30 pointer-events-none">
                  {hours.slice(0, -1).map(h => (
                    <div key={h} className="flex-1" />
                  ))}
                </div>

                {/* กล่องใส่คาร์ดวิชาเรียน */}
                <div className="absolute inset-0">
                  {courses.map(course => (
                    course.schedule
                      .filter(s => s.day === day)
                      .map((s, idx) => {
                        const { start, end } = parseTime(s.time);
                        // Clamp times between 8 and 20
                        const sTime = Math.max(START_H, Math.min(START_H + TOTAL_H, start));
                        const eTime = Math.max(sTime, Math.min(START_H + TOTAL_H, end));

                        const left = ((sTime - START_H) / TOTAL_H) * 100;
                        const width = ((eTime - sTime) / TOTAL_H) * 100;
                        const theme = DAY_THEMES[day] || { bg: 'bg-slate-50', text: 'text-slate-900', solid: 'bg-slate-900', border: 'border-slate-200' };

                        return (
                          <div
                            key={`${course.id}-${idx}`}
                            onClick={() => onViewCourse(course)}
                            className={`absolute top-1.5 bottom-1.5 ${theme.bg} ${theme.border} border-l-[6px] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group/card overflow-hidden z-20 flex flex-col justify-between py-2.5 px-3 min-w-[80px] border-y border-r border-y-transparent border-r-transparent`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`
                            }}
                          >
                            <div className="flex flex-col flex-1 min-h-0 mb-1">
                                <h4 className="text-[13px] lg:text-[14px] font-black leading-tight text-slate-800 break-words line-clamp-3">
                                  {course.name}
                                </h4>
                                <p className={`text-[12px] lg:text-[13px] font-bold ${theme.text} leading-none mt-1.5 shrink-0`}>{s.time}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto shrink-0 w-full relative">
                                <div className="flex items-center gap-1.5 opacity-80 text-slate-700">
                                    <Users size={16} className="text-slate-700" />
                                    <span className="text-[14px] font-medium leading-none mt-0.5">{course.students.length}</span>
                                </div>
                                <button
                                   onClick={(e) => { e.stopPropagation(); onCheckAttendance(course); }}
                                   title="เช็กชื่อ"
                                   className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all shrink-0 ml-2"
                                >
                                   <UserCheck size={14} />
                                </button>
                            </div>
                          </div>
                        );
                      })
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
