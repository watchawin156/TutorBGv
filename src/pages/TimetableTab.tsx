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
    <div ref={timetableRef} className="w-full h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden min-h-[500px]">

      <div className="flex-1 bg-white rounded-3xl lg:rounded-[40px] shadow-figma-soft border border-slate-100 flex flex-col overflow-y-auto overflow-x-auto custom-scrollbar">
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
            <div key={day} className="grid grid-cols-[80px_1fr] md:grid-cols-[112px_1fr] flex-1 min-h-[120px] relative group">
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
                            className={`absolute top-1.5 bottom-1.5 ${theme.bg} ${theme.border} border-l-4 rounded-xl shadow-sm hover:shadow-xl hover:scale-[101%] transition-all cursor-pointer group/card overflow-hidden z-20 flex flex-col p-2.5 min-w-[70px] max-w-full`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`
                            }}
                          >
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <h4 className="text-[16px] font-bold leading-snug text-black break-words line-clamp-2">
                                  {course.name}
                                </h4>
                                <p className={`text-[14px] font-bold ${theme.text} leading-none mt-1.5 shrink-0`}>{s.time}</p>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-80 mt-1.5 shrink-0">
                                <Users size={14} className="text-black" />
                                <span className="text-[14px] font-normal text-black leading-none">{course.students.length}</span>
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
