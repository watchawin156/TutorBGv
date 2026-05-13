import React, { useState } from 'react';
import { X, BookOpen, CreditCard, Plus, Calendar, Clock, MapPin, CheckCircle2, ArrowLeft, Check } from 'lucide-react';
import { Course } from '../functions/types';
import { formatThaiDateNumeric } from '../functions/utils';
import { DatePickerModal } from './DatePickerModal';
import { FONT } from '../functions/fontsize';

interface RegisterCourseModalProps {
  show: boolean;
  onClose: () => void;
  regisData: { studentId: number | null, courseId: string, amount: string, date: string, note: string };
  setRegisData: (data: any) => void;
  courses: Course[];
  students: any[];
  onSubmit: (e: React.FormEvent) => void;
}

const DAY_COLORS: { [key: string]: { bg: string, text: string, accent: string, border: string, solid: string } } = {
  'จันทร์': { bg: 'bg-[#FFFDE7]', text: 'text-[#FBC02D]', accent: 'bg-[#FBC02D]', border: 'border-[#FBC02D]', solid: 'bg-[#FBC02D]' },
  'อังคาร': { bg: 'bg-[#FDF2F8]', text: 'text-[#EC4899]', accent: 'bg-[#EC4899]', border: 'border-[#EC4899]', solid: 'bg-[#EC4899]' },
  'พุธ': { bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', accent: 'bg-[#22C55E]', border: 'border-[#22C55E]', solid: 'bg-[#22C55E]' },
  'พฤหัสบดี': { bg: 'bg-[#FFF7ED]', text: 'text-[#F97316]', accent: 'bg-[#F97316]', border: 'border-[#F97316]', solid: 'bg-[#F97316]' },
  'ศุกร์': { bg: 'bg-[#F0F9FF]', text: 'text-[#0EA5E9]', accent: 'bg-[#0EA5E9]', border: 'border-[#0EA5E9]', solid: 'bg-[#0EA5E9]' },
  'เสาร์': { bg: 'bg-blue-50', text: 'text-blue-600', accent: 'bg-blue-600', border: 'border-blue-600', solid: 'bg-blue-600' },
  'อาทิตย์': { bg: 'bg-[#FEF2F2]', text: 'text-[#EF4444]', accent: 'bg-[#EF4444]', border: 'border-[#EF4444]', solid: 'bg-[#EF4444]' },
};

export const RegisterCourseModal: React.FC<RegisterCourseModalProps> = ({ show, onClose, regisData, setRegisData, courses, students, onSubmit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  if (!show) return null;
  
  const selectedCourse = courses.find(c => c.id.toString() === regisData.courseId);
  const currentStudent = students.find(s => s.id === regisData.studentId);
  const existingSession = currentStudent?.courseSessions?.find((cs: any) => cs.courseId.toString() === regisData.courseId);

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
    } catch { return { left: '0%', width: '10%' }; }
  };

  return (
    <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center ${isFlipped ? 'p-0' : 'sm:p-4'} animate-in fade-in duration-300`}>
      <div className={`relative w-full h-full select-none flex items-center justify-center ${isFlipped ? '' : 'sm:h-auto sm:max-h-[100vh]'}`}>
        <div 
          className={`relative w-full h-full transition-all duration-300 overflow-hidden bg-white ${!isFlipped ? 'sm:w-[600px] sm:h-auto sm:rounded-xl sm:shadow-[0_4px_24px_rgba(0,0,0,0.15)] rounded-none' : 'w-[100vw] h-[100vh] rounded-none sm:rounded-none'}`}
          style={{ 
            maxWidth: isFlipped ? '100vw' : '600px',
            maxHeight: '100dvh'
          }}
        >
          {/* FRONT SIDE: ENROLLMENT FORM */}
          {!isFlipped && (
            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white w-full h-full overflow-hidden flex flex-col">
              
              {/* Sneat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                 <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-semibold text-[#566a7f]">ลงทะเบียนเรียน</h3>
                    <span className="text-[13px] text-[#a1acb8] font-normal leading-relaxed">เพิ่มคอร์สเรียน</span>
                 </div>
                 <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-white">
                {/* Course Selection */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#566a7f] ml-1">รายวิชาที่ต้องการลงทะเบียน</label>
                  {!selectedCourse ? (
                    <button 
                      type="button" 
                      onClick={() => setIsFlipped(true)}
                      className="w-full p-4 rounded-lg border border-dashed border-[#d9dee3] bg-slate-50/50 hover:border-[#696cff] hover:bg-[#696cff]/5 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-md flex items-center justify-center text-[#a1acb8] group-hover:text-[#696cff] transition-colors">
                            <BookOpen size={18} />
                         </div>
                         <span className="text-[15px] font-medium text-[#566a7f] group-hover:text-[#696cff] transition-colors">คลิกเพื่อเลือกวิชาจากตารางสอน...</span>
                      </div>
                      <ArrowLeft size={18} className="text-[#a1acb8] group-hover:text-[#696cff] rotate-180 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="bg-white border border-[#696cff]/20 rounded-lg p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] relative overflow-hidden animate-in fade-in duration-300 group/card">
                       <div className="flex justify-between items-start relative z-10">
                          <div className="flex gap-4">
                             <div className="w-12 h-12 bg-[#e6e6ff] text-[#696cff] rounded-md flex items-center justify-center shrink-0"><BookOpen size={22} /></div>
                             <div>
                                <h4 className="text-[16px] font-semibold text-[#566a7f] leading-tight mb-2">{selectedCourse.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                   <span className="px-2 py-1 bg-[#f8f9fa] rounded text-[12px] font-medium text-[#566a7f] flex items-center gap-1"><MapPin size={12} /> ห้อง {selectedCourse.room}</span>
                                   {selectedCourse.schedule.map((s: any, i: number) => <span key={i} className="px-2 py-1 bg-[#e6e6ff]/50 rounded text-[12px] font-medium text-[#696cff] flex items-center gap-1"><Clock size={12} /> {s.day} {s.time} น.</span>)}
                                </div>
                             </div>
                          </div>
                          <button type="button" onClick={() => setIsFlipped(true)} className="text-[13px] font-medium text-[#696cff] hover:underline px-2 py-1 transition-all">เปลี่ยนวิชา</button>
                       </div>
                    </div>
                  )}
                </div>

                {existingSession && existingSession.balance > 0 && (
                   <div className="bg-[#fff2d6] border border-[#fff2d6] rounded-lg p-4 flex gap-3 animate-in fade-in duration-300">
                      <div className="text-[#ffab00] mt-0.5"><Clock size={18} /></div>
                      <div>
                         <p className="text-[14px] font-semibold text-[#ffab00] leading-tight">นักเรียนมีเวลาเรียนวิชานี้เหลืออยู่ {existingSession.balance} ครั้ง</p>
                         <p className="text-[12px] text-[#ffab00]/80 mt-1">การลงทะเบียนครั้งนี้จะนำจำนวนครั้งใหม่ไปบวกเพิ่มจากยอดเดิมโดยอัตโนมัติ</p>
                      </div>
                   </div>
                )}

                {/* Date & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#566a7f] ml-1">วันที่ลงทะเบียน</label>
                    <div 
                      onClick={() => setShowDatePicker(true)}
                      className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2 cursor-pointer hover:border-[#b4bdc6] focus-within:border-[#696cff] focus-within:ring-2 focus-within:ring-[#696cff]/20 outline-none transition-all flex items-center gap-3 group/date"
                    >
                      <Calendar size={18} className="text-[#a1acb8] group-hover/date:text-[#696cff] transition-colors shrink-0" />
                      <span className="text-[15px] font-medium text-[#566a7f]">{formatThaiDateNumeric(regisData.date)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#566a7f] ml-1">ยอดชำระเงินจริง (บาท)</label>
                    <div className="relative group/input flex items-center">
                       <div className="absolute left-4 text-[#a1acb8] group-focus-within/input:text-[#696cff] transition-colors"><CreditCard size={18} /></div>
                       <input 
                         required 
                         type="number" 
                         value={regisData.amount} 
                         onChange={e => setRegisData((prev: any) => ({...prev, amount: e.target.value}))} 
                         className="w-full bg-white border border-[#d9dee3] rounded-md pl-11 pr-24 py-2 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" 
                         placeholder="0.00" 
                       />
                       <button type="button" onClick={() => selectedCourse && setRegisData((p: any) => ({...p, amount: selectedCourse.price.toString()}))} className={`absolute right-2 text-[11px] font-semibold text-[#696cff] hover:bg-[#e6e6ff] px-2 py-1 rounded transition-colors ${!selectedCourse ? 'opacity-0 pointer-events-none' : ''}`}>ใช้ราคาเต็ม</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#566a7f] ml-1">หมายเหตุ (ถ้ามี)</label>
                  <input 
                    type="text" 
                    value={regisData.note || ''} 
                    onChange={e => setRegisData((prev: any) => ({...prev, note: e.target.value}))} 
                    className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" 
                    placeholder="เช่น ค้างชำระส่วนที่เหลือ..." 
                  />
                </div>

                <div className="mt-4 pt-5 border-t border-slate-100 flex gap-3 justify-end shrink-0">
                   <button type="button" onClick={onClose} className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]">ยกเลิก</button>
                   <button 
                     type="submit" 
                     disabled={!regisData.courseId}
                     className={`px-6 py-2 rounded-md font-medium text-[14px] transition-all flex items-center justify-center gap-2 ${regisData.courseId ? 'bg-[#696cff] text-white hover:bg-[#5f61e6] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(105,108,255,0.4)]' : 'bg-slate-100 text-[#a1acb8] cursor-not-allowed'}`}
                   >
                     ยืนยันการลงทะเบียน
                   </button>
                </div>
              </form>
            </div>
            </div>
          )}

          {/* BACK SIDE: TIMETABLE SELECTOR */}
          {isFlipped && (
            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white w-full h-full flex flex-col">
               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
                 <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setIsFlipped(false)} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><ArrowLeft size={20} /></button>
                    <div>
                       <h3 className="text-[18px] font-semibold text-[#566a7f] leading-none">คัดเลือกรายวิชาเรียน</h3>
                    </div>
                 </div>
                 <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
               </div>

               <div className="flex-1 overflow-hidden p-0 md:p-6 bg-[#f8f9fa] md:bg-slate-50/50">
                  <div className="bg-white w-full h-full md:rounded-lg border-t md:border border-[#d9dee3] overflow-hidden flex flex-col relative">
                     
                     {/* Mobile View: Vertical list of cards */}
                     <div className="md:hidden flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 p-4 h-full relative z-10 bg-[#f8f9fa]">
                        {courses.map((course) => {
                          const COURSE_IMAGES = [
                             'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
                             'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                             'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
                             'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                             'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=400&q=80',
                             'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
                          ];
                          const courseImage = COURSE_IMAGES[course.id % COURSE_IMAGES.length];
                          const isActive = regisData.courseId === course.id.toString();

                          return (
                            <div
                                key={course.id} 
                                className={`bg-white rounded-2xl p-3 border ${isActive ? 'border-[#696cff] ring-1 ring-[#696cff]' : 'border-slate-100'} shadow-sm overflow-hidden flex flex-row cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md items-stretch relative`}
                                onClick={() => {
                                  setRegisData((p: any) => ({ ...p, courseId: course.id.toString(), amount: course.price.toString() }));
                                  setIsFlipped(false);
                                }}
                             >
                                {isActive && (
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
                                      {course.schedule && course.schedule.map((slot: any, i: number) => {
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

                     {/* Desktop View: Timetable Grid */}
                     <div className="hidden md:flex flex-col flex-1 overflow-auto custom-scrollbar relative">
                        <div className="min-w-[700px] flex flex-col flex-1">
                           <div className="grid grid-cols-[100px_1fr] bg-slate-50/50 border-b border-slate-100 shrink-0 sticky top-0 z-10">
                             <div className="p-4 border-r border-slate-100 text-[14px] font-black text-slate-900 uppercase flex items-center justify-center">วัน / เวลา</div>
                             <div className="flex divide-x divide-slate-100/50">
                               {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].slice(0, -1).map(h => (
                                 <div key={h} className="flex-1 p-4 text-center">
                                   <span className="text-[14px] font-black text-slate-900">{h.toString().padStart(2, '0')}:00</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                           
                           <div className="flex-1 flex flex-col divide-y divide-slate-50 overflow-hidden bg-white">
                             {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'].map(day => {
                               const style = DAY_COLORS[day] || { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-200' };
                               return (
                                 <div key={day} className="grid grid-cols-[100px_1fr] flex-1 min-h-0 relative group">
                                   {/* Day Header */}
                                   <div className="border-r border-slate-50 flex items-center justify-center shrink-0 bg-slate-50/30">
                                     <span className={`text-[14px] font-black ${style.text}`}>{day}</span>
                                   </div>

                                   {/* Timeslots Box */}
                                   <div className="relative w-full h-full overflow-hidden">
                                     {/* Grid Lines */}
                                     <div className="absolute inset-0 flex divide-x divide-slate-50/40 pointer-events-none">
                                       {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(h => (
                                         <div key={h} className="flex-1" />
                                       ))}
                                     </div>

                                     {/* Courses rendering */}
                                     <div className="absolute inset-0">
                                       {courses.flatMap((c) => (c.schedule || []).filter((s: any) => s.day === day).map((slot: any, i: number) => {
                                         let left = 0, width = 10;
                                         try {
                                           const parts = slot.time.split('-');
                                           const parseT = (s: string) => { const p = s.split(/[:.]/); return parseInt(p[0]) + (parseInt(p[1]||'0')/60); };
                                           const sT = parseT(parts[0]);
                                           const eT = parseT(parts[1]);
                                           const START_H = 8; const TOTAL_H = 12;
                                           const cl_sT = Math.max(START_H, Math.min(START_H + TOTAL_H, sT));
                                           const cl_eT = Math.max(cl_sT, Math.min(START_H + TOTAL_H, eT));
                                           left = ((cl_sT - START_H) / TOTAL_H) * 100;
                                           width = ((cl_eT - cl_sT) / TOTAL_H) * 100;
                                         } catch (e) {}

                                         const isActive = regisData.courseId === c.id.toString();
                                         
                                         return (
                                           <div 
                                             key={`${c.id}-${i}`}
                                             onClick={() => {
                                               setRegisData((p: any) => ({ ...p, courseId: c.id.toString(), amount: c.price.toString() }));
                                               setIsFlipped(false);
                                             }}
                                             className={`absolute top-1.5 bottom-1.5 border-l-[6px] rounded-xl px-2 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-[1px] flex flex-col items-center justify-center cursor-pointer transition-all z-20 overflow-hidden ${isActive ? 'bg-[#696cff] border-[#696cff] text-white shadow-[#696cff]/30 ring-2 ring-[#696cff]/20' : `${style.bg} ${style.border} text-slate-800 border-y border-r border-y-transparent border-r-transparent`}`}
                                             style={{ left: `${left}%`, width: `${width}%`, minWidth: '40px' }}
                                           >
                                             <p className={`text-[13px] font-black w-full text-center leading-tight mb-0.5 line-clamp-2 px-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                                             <p className={`text-[12px] font-bold w-full text-center leading-none inline-flex items-center justify-center gap-1 shrink-0 ${isActive ? 'text-indigo-100' : style.text}`}>{slot.time}</p>
                                           </div>
                                         );
                                       }))}

                                       {/* Lunch break */}
                                       <div className="absolute top-1 bottom-1 border border-dashed border-slate-200 bg-slate-50/80 rounded-xl flex items-center justify-center opacity-70 pointer-events-none" style={{ left: `${((12 - 8) / 12) * 100}%`, width: `${(1 / 12) * 100}%` }}>
                                          <span className="text-[14px] font-black text-slate-700 -rotate-90 whitespace-nowrap">พักเบรค</span>
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DatePickerModal 
        show={showDatePicker} 
        onClose={() => setShowDatePicker(false)} 
        selectedDate={regisData.date} 
        onSelect={(date) => {
          setRegisData((prev: any) => ({ ...prev, date }));
          setShowDatePicker(false);
        }} 
      />
    </div>
  );
};
