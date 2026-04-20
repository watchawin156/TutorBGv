import React, { useState } from 'react';
import { X, BookOpen, CreditCard, Plus, Calendar, Clock, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
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
  'เสาร์': { bg: 'bg-[#FAF5FF]', text: 'text-[#A855F7]', accent: 'bg-[#A855F7]', border: 'border-[#A855F7]', solid: 'bg-[#A855F7]' },
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="relative w-full select-none flex items-center justify-center max-h-[100vh]">
        <div 
          className="relative transition-all duration-300 shadow-2xl rounded-[40px] overflow-hidden bg-white ring-1 ring-slate-900/5"
          style={{ 
            width: isFlipped ? '96vw' : '640px',
            maxWidth: isFlipped ? '1600px' : '1000px',
            height: isFlipped ? '95vh' : 'auto'
          }}
        >
          {/* FRONT SIDE: ENROLLMENT FORM */}
          {!isFlipped && (
            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white w-full h-full overflow-hidden flex flex-col">
              
              {/* Premium Header */}
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl gradient-purple flex items-center justify-center text-white shadow-lg shadow-purple-200">
                      <Plus size={24} className="stroke-[2.5px]" />
                   </div>
                   <div>
                     <h3 className={`${FONT.H3} text-slate-900 leading-tight`}>ลงทะเบียนเรียน</h3>
                     <p className={`text-slate-500 ${FONT.LABEL_SM} mt-0.5 uppercase`}>เพิ่มคอร์สเรียนใหม่ให้นักเรียน</p>
                   </div>
                </div>
                <button onClick={onClose} type="button" className="w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all flex items-center justify-center"><X size={20} /></button>
              </div>

              <form onSubmit={onSubmit} className="flex-1 overflow-hidden p-8 flex flex-col gap-6 bg-slate-50/30">
                {/* Course Selection */}
                <div className="space-y-2">
                  <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>รายวิชาที่ต้องการลงทะเบียน</label>
                  {!selectedCourse ? (
                    <button 
                      type="button" 
                      onClick={() => setIsFlipped(true)}
                      className="w-full p-6 rounded-[24px] border border-slate-200 bg-white hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100/50 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                            <BookOpen size={20} />
                         </div>
                         <span className={`${FONT.BODY_LG} font-black text-slate-400 group-hover:text-slate-900 transition-colors`}>คลิกเพื่อเลือกวิชาจากตารางสอน...</span>
                      </div>
                      <ArrowLeft size={20} className="text-slate-300 group-hover:text-purple-500 rotate-180 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="bg-white border border-purple-200 rounded-[24px] p-6 shadow-xl shadow-purple-100/40 relative overflow-hidden animate-in fade-in duration-300 group/card">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                       <div className="flex justify-between items-start relative z-10">
                          <div className="flex gap-5">
                             <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0"><BookOpen size={26} className="stroke-[2.5px]" /></div>
                             <div>
                                <h4 className={`${FONT.H4} text-slate-900 leading-tight mb-2`}>{selectedCourse.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                   <span className={`px-3 py-1.5 bg-slate-100 rounded-xl ${FONT.LABEL_BLACK} text-slate-700 flex items-center gap-1.5`}><MapPin size={12} /> ห้อง {selectedCourse.room}</span>
                                   {selectedCourse.schedule.map((s: any, i: number) => <span key={i} className={`px-3 py-1.5 bg-purple-50 rounded-xl ${FONT.LABEL_BLACK} text-purple-700 flex items-center gap-1.5`}><Clock size={12} /> {s.day} {s.time} น.</span>)}
                                </div>
                             </div>
                          </div>
                          <button type="button" onClick={() => setIsFlipped(true)} className={`text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition-all ${FONT.LABEL_BLACK}`}>เปลี่ยนวิชา</button>
                       </div>
                    </div>
                  )}
                </div>

                {existingSession && existingSession.balance > 0 && (
                   <div className="bg-amber-50/80 border border-amber-200/60 rounded-[20px] p-5 flex gap-4 animate-in fade-in duration-300">
                      <div className="text-amber-500 mt-0.5"><Clock size={20} className="stroke-[2.5px]" /></div>
                      <div>
                         <p className={`${FONT.LABEL_BLACK} text-amber-900 leading-tight`}>นักเรียนมีเวลาเรียนวิชานี้เหลืออยู่ {existingSession.balance} ครั้ง</p>
                         <p className={`text-amber-700/80 ${FONT.CAPTION_BLACK} mt-1`}>การลงทะเบียนครั้งนี้จะนำจำนวนครั้งใหม่ไปบวกเพิ่มจากยอดเดิมโดยอัตโนมัติ</p>
                      </div>
                   </div>
                )}

                {/* Date & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                  <div className="space-y-2">
                    <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>วันที่ลงทะเบียน</label>
                    <div 
                      onClick={() => setShowDatePicker(true)}
                      className="w-full bg-white border border-slate-200 rounded-[20px] px-6 py-4 cursor-pointer hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-50 transition-all flex items-center gap-4 group/date"
                    >
                      <Calendar size={20} className="text-slate-400 group-hover/date:text-purple-500 transition-colors shrink-0" />
                      <span className={`${FONT.BODY_LG} font-black text-slate-900`}>{formatThaiDateNumeric(regisData.date)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>ยอดชำระเงินจริง (บาท)</label>
                    <div className="relative group/input">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-purple-500 transition-colors"><CreditCard size={18} /></div>
                       <input 
                         required 
                         type="number" 
                         value={regisData.amount} 
                         onChange={e => setRegisData((prev: any) => ({...prev, amount: e.target.value}))} 
                         className={`w-full bg-white border border-slate-200 rounded-[20px] pl-14 pr-4 py-4 ${FONT.BODY_LG} font-black text-slate-900 outline-none hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all`} 
                         placeholder="0.00" 
                       />
                       <button type="button" onClick={() => selectedCourse && setRegisData((p: any) => ({...p, amount: selectedCourse.price.toString()}))} className={`absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg ${FONT.NANO_BLACK} uppercase transition-colors ${!selectedCourse ? 'opacity-0 pointer-events-none' : ''}`}>ใช้ราคาเต็ม</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1`}>หมายเหตุ (ถ้ามี)</label>
                  <input 
                    type="text" 
                    value={regisData.note || ''} 
                    onChange={e => setRegisData((prev: any) => ({...prev, note: e.target.value}))} 
                    className={`w-full bg-white border border-slate-200 rounded-[20px] px-6 py-4 ${FONT.BODY_LG} text-slate-900 outline-none hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all`} 
                    placeholder="เช่น ค้างชำระส่วนที่เหลือ..." 
                  />
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-4 shrink-0">
                   <button type="button" onClick={onClose} className={`flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 ${FONT.LABEL_BLACK} py-4 rounded-[20px] transition-all`}>ยกเลิก</button>
                   <button 
                     type="submit" 
                     disabled={!regisData.courseId}
                     className={`flex-[2] py-4 rounded-[20px] ${FONT.LABEL_BLACK} transition-all active:scale-95 flex items-center justify-center gap-2 ${regisData.courseId ? 'gradient-purple text-white shadow-xl shadow-purple-200 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                   >
                     <CheckCircle2 size={20} /> ยืนยันการลงทะเบียน
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
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900">
                  <div className="flex items-center gap-6">
                     <button type="button" onClick={() => setIsFlipped(false)} className="w-12 h-12 bg-white/10 text-white rounded-[20px] hover:bg-white/20 transition-all flex items-center justify-center shadow-lg"><ArrowLeft size={24} className="stroke-[2.5px]" /></button>
                     <div>
                        <h3 className="text-[14px] font-black text-white leading-none">คัดเลือกรายวิชาเรียน</h3>
                        <p className="text-[14px] text-sky-400/80 font-bold mt-1.5 uppercase leading-none">เลือกตารางเรียน</p>
                     </div>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 bg-white/10 text-white rounded-[16px] hover:bg-rose-500 transition-all flex items-center justify-center"><X size={20} /></button>
               </div>

               <div className="flex-1 overflow-hidden p-8 bg-slate-50/50">
                  <div className="bg-white w-full h-full rounded-[40px] border border-slate-200 shadow-figma-soft overflow-hidden flex flex-col">
                    {/* Time Header */}
                    <div className="grid grid-cols-[100px_1fr] bg-slate-50/50 border-b border-slate-100 shrink-0">
                      <div className="p-4 border-r border-slate-100 text-[14px] font-black text-slate-900 uppercase flex items-center justify-center">วัน / เวลา</div>
                      <div className="flex divide-x divide-slate-100/50">
                        {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].slice(0, -1).map(h => (
                          <div key={h} className="flex-1 p-4 text-center">
                            <span className="text-[14px] font-black text-slate-900">{h.toString().padStart(2, '0')}:00</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Content: Days */}
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
                                {courses.flatMap(c => (c.schedule || []).filter(s => s.day === day).map((slot: any, i: number) => {
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
                                      className={`absolute top-1 bottom-1 border-l-4 rounded-xl px-2 py-1 shadow-sm hover:shadow-xl hover:scale-[1.01] flex flex-col items-center justify-center cursor-pointer transition-all z-20 ${isActive ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-200 ring-4 ring-sky-50' : `${style.bg} ${style.border} text-slate-800`}`}
                                      style={{ left: `${left}%`, width: `${width}%`, minWidth: '40px' }}
                                    >
                                      <p className={`text-[14px] font-black truncate w-full text-center leading-tight mb-0.5 px-0.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                                      <p className={`text-[14px] font-black w-full text-center leading-none inline-flex items-center justify-center gap-1 shrink-0 ${isActive ? 'opacity-90' : style.text}`}>{slot.time}</p>
                                    </div>
                                  );
                                }))}

                                {/* Lunch break */}
                                <div className="absolute top-1 bottom-1 border border-dashed border-slate-200 bg-slate-50/80 rounded-xl flex items-center justify-center opacity-70 pointer-events-none" style={{ left: `${((12 - 8) / 12) * 100}%`, width: `${(1 / 12) * 100}%` }}>
                                   <span className="text-[14px] font-black text-slate-500 -rotate-90 whitespace-nowrap">พักเบรค</span>
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
