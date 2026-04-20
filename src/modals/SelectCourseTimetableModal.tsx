import React, { useRef } from 'react';
import { X, Calendar, Clock, Check, MapPin } from 'lucide-react';
import { Course } from '../functions/types';
import { FONT } from '../functions/fontsize';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-2 lg:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-[1400px] max-h-[96vh] flex flex-col overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-4 lg:p-5 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-[14px] shadow-2xl shadow-slate-200 flex items-center justify-center">
              <Calendar size={20} className="stroke-[2.5px]" />
            </div>
            <h3 className="text-[20px] lg:text-[22px] font-black text-slate-900 leading-none">คัดเลือกรายวิชาจากตารางสอน</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-50 hover:bg-rose-50 text-slate-900 hover:text-rose-500 rounded-xl transition-all flex items-center justify-center"><X size={18} className="stroke-[3px]" /></button>
        </div>
        
        <div className="flex-1 overflow-hidden bg-slate-50/15 p-2 lg:p-4 flex flex-col min-h-0">
          <div ref={timetableRef} className="flex-1 flex flex-col border border-slate-100/50 rounded-[28px] overflow-hidden bg-white shadow-figma-soft min-h-0 relative">
            {/* Time Header */}
            <div className={`sticky top-0 z-30 grid grid-cols-[100px_1fr] bg-slate-900 text-white ${FONT.CAPTION_BLACK} uppercase shrink-0`}>
              <div className="p-3 border-r border-slate-800 flex items-center justify-center sticky left-0 z-40 bg-slate-900">วัน/เวลา</div>
              <div className="relative h-[48px]">
                {/* Hourly Labels */}
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(h => {
                  const baseStart = 8 * 60;
                  const baseEnd = 20 * 60;
                  const pos = ((h * 60 - baseStart) / (baseEnd - baseStart)) * 100;
                  if (pos > 100) return null;
                  return (
                    <span key={h} className={`absolute top-[14px] -translate-x-1/2 ${FONT.MICRO_BLACK} text-slate-900`} style={{ left: `${pos}%` }}>
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
                    <div key={h} className="absolute top-[34px] -translate-x-1/2 w-1 h-1 rounded-full bg-slate-700" style={{ left: `${pos}%` }} />
                  )
                })}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 divide-y divide-slate-100 overflow-hidden">
              {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'].map((day) => {
                const dayStyle = DAY_COLORS[day];
                return (
                  <div key={day} className={`grid grid-cols-[100px_1fr] flex-1 min-h-[60px] lg:min-h-[80px] relative`}>
                    <div className={`sticky left-0 z-20 ${dayStyle.bg} flex items-center justify-center font-black ${dayStyle.text} border-r border-slate-100 text-[14px]`}>
                      {day}
                    </div>
                    <div className="relative bg-white h-full p-2">
                       {/* Grid lines */}
                       <div className="absolute inset-0 flex justify-between pointer-events-none px-12 lg:px-16">
                          {[...Array(7)].map((_, i) => <div key={i} className="w-px h-full bg-slate-50" />)}
                       </div>
                       
                       <div className="relative w-full h-full">
                          {courses.flatMap(c => (c.schedule || []).filter(s => s.day === day).map((slot, i) => {
                             const style = timeToPercent(slot.time);
                             const isSelected = selectedCourseId === c.id.toString();
                             return (
                                <div 
                                  key={`${c.id}-${day}-${i}`}
                                  onClick={() => onSelect(c)}
                                  className={`absolute inset-y-0.5 border rounded-[12px] px-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] hover:z-20 hover:shadow-2xl overflow-hidden ${
                                    isSelected 
                                    ? 'bg-sky-600 border-sky-400 text-white z-20 shadow-xl shadow-sky-200 ring-2 ring-sky-50' 
                                    : `bg-white border-slate-100 ${dayStyle.text} hover:border-[#0EA5E9] z-10 shadow-sm`
                                  }`}
                                  style={{ left: style.left, width: style.width }}
                                >
                                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-r-full ${dayStyle.solid} opacity-100`} />
                                  
                                  <div className={`${FONT.CAPTION_BLACK} leading-tight truncate w-full ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {c.name}
                                  </div>
                                  <div className="flex items-center justify-center gap-2 mt-0.5">
                                    <div className={`${FONT.NANO} flex items-center gap-1 ${isSelected ? 'text-sky-100' : dayStyle.text}`}>
                                      <Clock size={10} className="stroke-[3px]" /> <span>{slot.time}</span>
                                    </div>
                                    <div className={`${FONT.NANO} flex items-center gap-1 ${isSelected ? 'text-sky-200' : 'text-slate-900'}`}>
                                      <MapPin size={10} className="stroke-[3px] opacity-70" /> <span>{c.room}</span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                     <div className="absolute top-1 right-1 bg-white text-sky-600 rounded-lg p-0.5 shadow-sm">
                                        <Check size={10} className="stroke-[4px]" />
                                     </div>
                                  )}
                                </div>
                             )
                          }))}

                          {/* Lunch Break Slot (12:00 - 13:00) */}
                          <div 
                            className="absolute inset-y-0.5 bg-slate-50 border border-dashed border-slate-200 rounded-[12px] flex flex-col items-center justify-center px-4 overflow-hidden z-10 pointer-events-none"
                            style={{ ...timeToPercent('12:00-13:00'), opacity: 0.6 }}
                          >
                             <div className="flex flex-col items-center text-center">
                                <span className={`${FONT.NANO} text-slate-900 leading-none mb-0.5`}>12:00 - 13:00</span>
                                <span className={`${FONT.MICRO_BLACK} text-slate-900 flex items-center gap-1`}>🕒 พักเที่ยง</span>
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
        
        <div className="p-6 lg:p-7 border-t border-slate-50 flex justify-center bg-white shrink-0">
           <button 
             onClick={onClose} 
             type="button"
             disabled={!selectedCourseId}
             className={`w-full max-w-md py-4 font-black rounded-[24px] transition-all shadow-2xl active:scale-95 text-[18px] flex items-center justify-center gap-3 ${
               selectedCourseId ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200' : 'bg-slate-100 text-slate-900 cursor-not-allowed shadow-none'
             }`}
           >
              ตกลงเลือกวิชานี้
           </button>
        </div>
      </div>
    </div>
  );
};
