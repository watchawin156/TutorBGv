import React, { useRef } from 'react';
import { X, Calendar, Clock, Check, MapPin } from 'lucide-react';
import { Course } from '../functions/types';

interface SelectCourseTimetableModalProps {
  show: boolean;
  onClose: () => void;
  courses: Course[];
  onSelect: (course: Course) => void;
  selectedCourseId?: string;
}

const DAY_COLORS: { [key: string]: { bg: string, text: string, accent: string, border: string, solid: string } } = {
  'จันทร์': { bg: 'bg-[#FFFDE7]', text: 'text-[#FBC02D]', accent: 'bg-[#FBC02D]', border: 'border-[#FBC02D]', solid: 'bg-[#FBC02D]' },
  'อังคาร': { bg: 'bg-[#FDF2F8]', text: 'text-[#EC4899]', accent: 'bg-[#EC4899]', border: 'border-[#EC4899]', solid: 'bg-[#EC4899]' },
  'พุธ': { bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', accent: 'bg-[#22C55E]', border: 'border-[#22C55E]', solid: 'bg-[#22C55E]' },
  'พฤหัสบดี': { bg: 'bg-[#FFF7ED]', text: 'text-[#F97316]', accent: 'bg-[#F97316]', border: 'border-[#F97316]', solid: 'bg-[#F97316]' },
  'ศุกร์': { bg: 'bg-[#F0F9FF]', text: 'text-[#0EA5E9]', accent: 'bg-[#0EA5E9]', border: 'border-[#0EA5E9]', solid: 'bg-[#0EA5E9]' },
  'เสาร์': { bg: 'bg-[#FAF5FF]', text: 'text-[#A855F7]', accent: 'bg-[#A855F7]', border: 'border-[#A855F7]', solid: 'bg-[#A855F7]' },
  'อาทิตย์': { bg: 'bg-[#FEF2F2]', text: 'text-[#EF4444]', accent: 'bg-[#EF4444]', border: 'border-[#EF4444]', solid: 'bg-[#EF4444]' },
};

export const SelectCourseTimetableModal: React.FC<SelectCourseTimetableModalProps> = ({ show, onClose, courses, onSelect, selectedCourseId }) => {
  const timetableRef = useRef<HTMLDivElement>(null);
  if (!show) return null;

  const timeToPercent = (timeStr: string) => {
    try {
      const parts = timeStr.split('-');
      if (parts.length < 2) return { left: '0%', width: '15%' };
      const startStr = parts[0].trim().replace('.', ':');
      const endStr = parts[1].trim().replace('.', ':');
      const parseTime = (str: string) => { 
        const parts = str.split(':');
        const hours = parseInt(parts[0]);
        const mins = parts.length > 1 ? parseInt(parts[1]) : 0;
        return hours * 60 + (isNaN(mins) ? 0 : mins); 
      };
      const baseStart = 8 * 60;
      const baseEnd = 20 * 60;
      const totalMins = baseEnd - baseStart;
      const startMins = parseTime(startStr);
      const endMins = parseTime(endStr);
      if (!Number.isFinite(startMins) || !Number.isFinite(endMins) || endMins <= startMins) {
        return { left: '0%', width: '15%' };
      }
      const leftRaw = ((startMins - baseStart) / totalMins) * 100;
      const widthRaw = ((endMins - startMins) / totalMins) * 100;
      const left = Math.min(100, Math.max(0, leftRaw));
      const width = Math.min(100 - left, Math.max(5, widthRaw));
      return { left: `${left}%`, width: `${width}%` };
    } catch (e) {
      return { left: '0%', width: '10%' };
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex animate-in fade-in duration-300">
      <div className="w-full h-[100dvh] flex flex-col">
        <div className="px-6 py-4 flex items-center justify-between shrink-0 bg-white border-b border-[#d9dee3]">
          <div className="flex items-center gap-2 text-[#566a7f]">
             <Calendar size={20} className="text-[#696cff]" />
             <h3 className="text-[18px] font-semibold leading-none">คัดเลือกรายวิชาจากตารางสอน</h3>
          </div>
          <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-hidden bg-white flex flex-col min-h-0">
          
          {/* Mobile View: Row Layout */}
          <div className="md:hidden flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 p-4 h-full relative z-10 bg-[#f8f9fa]">
             {courses.map((course, idx) => {
               const COURSE_IMAGES = [
                  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
               ];
               const courseImage = COURSE_IMAGES[course.id % COURSE_IMAGES.length];
               const isSelected = selectedCourseId === course.id.toString();

               return (
                 <div
                     key={course.id} 
                     className={`bg-white rounded-2xl p-3 border ${isSelected ? 'border-[#696cff] ring-1 ring-[#696cff]' : 'border-slate-100'} shadow-sm overflow-hidden flex flex-row cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md items-stretch relative`}
                     onClick={() => onSelect(course)}
                  >
                     {isSelected && (
                       <div className="absolute top-2 right-2 bg-[#696cff] text-white rounded-full p-1 shadow-sm z-10">
                          <Check size={14} className="stroke-[3px]" />
                       </div>
                     )}
                     <div className="flex w-full gap-3">
                        <div className="w-[100px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                           <img src={courseImage} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/10 text-white flex items-center">
                              <span className="text-[10px] font-bold leading-tight">ห้อง {course.room}</span>
                           </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 py-0.5">
                           <div className="flex items-start justify-between mb-1">
                              <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#566a7f] leading-snug line-clamp-2 pr-4">{course.name}</h3>
                           </div>
                           <span className="text-[12px] text-[#a1acb8] truncate mb-2">แอดมิน ติวเตอร์แอพ</span>
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
                                      <span className="text-[11px] font-medium">-</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[#a1acb8]">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                      <span className="text-[11px] font-medium">{course.sessions} ชม.</span>
                                  </div>
                              </div>
                              <span className="text-[12px] font-bold text-[#696cff]">฿{course.price?.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               );
             })}
             {courses.length === 0 && (
                <div className="text-center text-[#a1acb8] mt-10 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">ไม่พบรายวิชาในตารางสอน</div>
             )}
          </div>

          {/* Desktop View: Grid */}
          <div ref={timetableRef} className="hidden md:flex flex-1 flex-col overflow-auto bg-white min-h-0 relative">
            <div className="min-w-[800px] flex flex-col flex-1">
              {/* Time Header */}
              <div className="sticky top-0 z-30 grid grid-cols-[100px_1fr] bg-white border-b border-[#d9dee3] text-[#566a7f] text-[13px] font-bold uppercase shrink-0">
              <div className="p-3 border-r border-[#d9dee3] flex items-center justify-center sticky left-0 z-40 bg-white">วัน/เวลา</div>
              <div className="relative h-[48px]">
                {/* Hourly Labels */}
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(h => {
                  const baseStart = 8 * 60;
                  const baseEnd = 20 * 60;
                  const pos = ((h * 60 - baseStart) / (baseEnd - baseStart)) * 100;
                  if (pos > 100) return null;
                  return (
                    <span key={h} className="absolute top-[14px] -translate-x-1/2 text-[10px] font-bold text-[#566a7f]" style={{ left: `${pos}%` }}>
                      {h.toString().padStart(2, '0')}:00
                    </span>
                  )
                })}
                {/* Half-hour Dots */}
                {[8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5].map(h => {
                  const baseStart = 8 * 60;
                  const baseEnd = 20 * 60;
                  const pos = ((h * 60 - baseStart) / (baseEnd - baseStart)) * 100;
                  if (pos > 100) return null;
                  return (
                    <div key={h} className="absolute top-[34px] -translate-x-1/2 w-1 h-1 rounded-full bg-[#d9dee3]" style={{ left: `${pos}%` }} />
                  )
                })}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 divide-y divide-[#d9dee3] overflow-hidden">
              {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'].map((day) => {
                const dayStyle = DAY_COLORS[day];
                return (
                  <div key={day} className={`grid grid-cols-[100px_1fr] flex-1 min-h-[60px] lg:min-h-[80px] relative`}>
                    <div className={`sticky left-0 z-20 ${dayStyle.bg} flex items-center justify-center font-bold ${dayStyle.text} border-r border-[#d9dee3] text-[14px]`}>
                      {day}
                    </div>
                    <div className="relative bg-white h-full p-2">
                       {/* Grid lines */}
                       <div className="absolute inset-0 flex justify-between pointer-events-none px-12 lg:px-16">
                          {[...Array(7)].map((_, i) => <div key={i} className="w-px h-full bg-[#f8f9fa]" />)}
                       </div>
                       
                       <div className="relative w-full h-full">
                          {courses.flatMap(c => (c.schedule || []).filter(s => s.day === day).map((slot, i) => {
                             const style = timeToPercent(slot.time);
                             const isSelected = selectedCourseId === c.id.toString();
                             return (
                                <div 
                                  key={`${c.id}-${day}-${i}`}
                                  onClick={() => onSelect(c)}
                                  className={`absolute inset-y-0.5 border rounded-lg px-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] hover:z-20 hover:shadow-2xl overflow-hidden ${
                                    isSelected 
                                    ? 'bg-[#696cff] border-[#696cff] text-white z-20 shadow-[0_4px_12px_rgba(105,108,255,0.4)]' 
                                    : `bg-white border-[#d9dee3] ${dayStyle.text} hover:border-[#696cff] z-10 shadow-sm`
                                  }`}
                                  style={{ left: style.left, width: style.width }}
                                >
                                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-r-full ${dayStyle.solid} opacity-100`} />
                                  
                                  <div className={`text-[12px] font-semibold leading-tight truncate w-full ${isSelected ? 'text-white' : 'text-[#566a7f]'}`}>
                                    {c.name}
                                  </div>
                                  <div className="flex items-center justify-center gap-2 mt-0.5">
                                    <div className={`text-[10px] flex items-center gap-1 ${isSelected ? 'text-indigo-100' : dayStyle.text}`}>
                                      <Clock size={10} className="stroke-[2px]" /> <span>{slot.time}</span>
                                    </div>
                                    <div className={`text-[10px] flex items-center gap-1 ${isSelected ? 'text-indigo-200' : 'text-[#a1acb8]'}`}>
                                      <MapPin size={10} className="stroke-[2px]" /> <span>{c.room}</span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                     <div className="absolute top-1 right-1 bg-white text-[#696cff] rounded-full p-0.5 shadow-sm">
                                        <Check size={8} className="stroke-[3px]" />
                                     </div>
                                  )}
                                </div>
                             )
                          }))}

                          {/* Lunch Break Slot (12:00 - 13:00) */}
                          <div 
                            className="absolute inset-y-0.5 bg-slate-50 border border-dashed border-[#d9dee3] rounded-lg flex flex-col items-center justify-center px-4 overflow-hidden z-10 pointer-events-none"
                            style={{ ...timeToPercent('12:00-13:00'), opacity: 0.6 }}
                          >
                             <div className="flex flex-col items-center text-center">
                                <span className={`text-[10px] font-semibold text-[#a1acb8] leading-none mb-0.5`}>12:00 - 13:00</span>
                                <span className={`text-[11px] font-semibold text-[#566a7f] flex items-center gap-1`}>🕒 พักเที่ยง</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )
              })}
            </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-[#d9dee3] flex justify-end bg-slate-50/50 shrink-0">
           <button 
             onClick={onClose} 
             type="button"
             disabled={!selectedCourseId}
             className={`px-5 py-2 rounded-md font-medium text-[14px] transition-all flex items-center justify-center gap-3 ${
               selectedCourseId ? 'bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_4px_12px_rgba(105,108,255,0.4)] hover:-translate-y-[1px]' : 'bg-white border border-[#d9dee3] text-[#a1acb8] cursor-not-allowed shadow-none'
             }`}
           >
              ตกลงเลือกวิชานี้
           </button>
        </div>
      </div>
    </div>
  );
};
