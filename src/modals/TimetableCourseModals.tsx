import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  MapPin,
  Users,
  X,
  User,
  Clock,
  Layout,
  UserCheck,
  Undo2
} from 'lucide-react';

import { DatePickerModal } from './DatePickerModal';
import { CourseWithStudents } from '../functions/types';
import { formatThaiDate } from '../functions/utils';
import { FONT } from '../functions/fontsize';

const DAY_THEMES: { [key: string]: { bg: string, text: string, accent: string, border: string, solid: string } } = {
  'จันทร์': { bg: 'bg-[#FFFDE7]', text: 'text-[#FBC02D]', accent: 'bg-[#FBC02D]', border: 'border-[#FBC02D]', solid: 'bg-[#FBC02D]' },
  'อังคาร': { bg: 'bg-[#FDF2F8]', text: 'text-[#EC4899]', accent: 'bg-[#EC4899]', border: 'border-[#EC4899]', solid: 'bg-[#EC4899]' },
  'พุธ': { bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]', accent: 'bg-[#22C55E]', border: 'border-[#22C55E]', solid: 'bg-[#22C55E]' },
  'พฤหัสบดี': { bg: 'bg-[#FFF7ED]', text: 'text-[#F97316]', accent: 'bg-[#F97316]', border: 'border-[#F97316]', solid: 'bg-[#F97316]' },
  'ศุกร์': { bg: 'bg-[#F0F9FF]', text: 'text-[#0EA5E9]', accent: 'bg-[#0EA5E9]', border: 'border-[#0EA5E9]', solid: 'bg-[#0EA5E9]' },
  'เสาร์': { bg: 'bg-[#FAF5FF]', text: 'text-[#A855F7]', accent: 'bg-[#A855F7]', border: 'border-[#A855F7]', solid: 'bg-[#A855F7]' },
  'อาทิตย์': { bg: 'bg-[#FEF2F2]', text: 'text-[#EF4444]', accent: 'bg-[#EF4444]', border: 'border-[#EF4444]', solid: 'bg-[#EF4444]' },
};

interface TimetableAttendanceModalProps {
  show: boolean;
  onClose: () => void;
  course: CourseWithStudents | null;
  onCheckAttendance: (studentId: number, courseId: number, date: string) => void;
  onUndoAttendance: (studentId: number, courseId: number, date: string) => void;
}

export const TimetableAttendanceModal: React.FC<TimetableAttendanceModalProps> = ({
  show,
  onClose,
  course,
  onCheckAttendance,
  onUndoAttendance,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [toggledNames, setToggledNames] = useState<Set<number>>(new Set());
  const [swipeOffset, setSwipeOffset] = useState<Record<number, number>>({});
  const touchStartX = useRef<Record<number, number>>({});
  const [viewDate, setViewDate] = useState(new Date());


  useEffect(() => {
    if (!show) {
      setIsFlipped(false);
      setSwipeOffset({});
      setToggledNames(new Set());
      setViewDate(new Date());
    }
  }, [show, course?.id]);

  const toggleName = (id: number) => {
    setToggledNames(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!show || !course) return null;

  const checkedCount = course.students.filter((student) =>
    (student.attendanceLog || []).some((log) => log.courseId === course.id && log.date === attendanceDate)
  ).length;

  const startSwipe = (id: number, x: number) => { touchStartX.current[id] = x; };

  const moveSwipe = (id: number, x: number, isChecked: boolean) => {
    if (!isChecked) return;
    const diff = x - touchStartX.current[id];
    if (diff < 0) {
      setSwipeOffset((prev) => ({ ...prev, [id]: diff }));
    }
  };

  const endSwipe = (id: number, studentId: number) => {
    const offset = swipeOffset[id] || 0;
    if (offset < -140) {
      onUndoAttendance(studentId, course.id, attendanceDate);
    }
    setSwipeOffset((prev) => ({ ...prev, [id]: 0 }));
  };

  // Calendar Logic for Side 2

  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  const handleDateSelect = (day: number) => {
    const y = viewDate.getFullYear();
    const m = (viewDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    setAttendanceDate(`${y}-${m}-${d}`);
    setIsFlipped(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div
        className="relative w-full max-w-xl transition-all duration-1000 select-none"
        style={{ perspective: '2000px', height: '640px' }}
      >
        <div
          className="w-full h-full relative transition-all duration-700 shadow-2xl rounded-[48px]"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}
        >
          {/* SIDE 1: STUDENT LIST */}
          <div className="absolute inset-0 w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <div className="bg-white w-full h-full rounded-[48px] overflow-hidden flex flex-col border border-slate-100 relative shadow-2xl">
              <div className="p-8 border-b border-slate-100 bg-white flex flex-col gap-6 shrink-0 relative">
                <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-900 hover:text-rose-500 rounded-2xl transition-all flex items-center justify-center border border-slate-100">
                  <X size={20} className="stroke-[3px]" />
                </button>
                <div className="flex items-center gap-5 pr-12">
                   <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200 shrink-0">
                     <BookOpen size={32} className="stroke-[2.5px]" />
                   </div>
                   <div>
                     <h2 className={`${FONT.H2} text-slate-900 leading-none`}>{course.name}</h2>
                   </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                         <Users size={20} className="stroke-[2.5px]" />
                      </div>
                      <div>
                         <h3 className={`${FONT.BODY_LG} font-black text-slate-900 leading-none`}>รายชื่อนักเรียน</h3>
                         <p className={`text-slate-900 ${FONT.LABEL} uppercase mt-1`}>รายชื่อสมาชิกในกลุ่มเรียนนี้ • มาเรียน {checkedCount}/{course.students.length}</p>
                      </div>
                   </div>
                   <div
                     onClick={() => setIsFlipped(true)}
                     className="flex flex-col items-end cursor-pointer group bg-white border border-slate-200 rounded-xl p-2 px-3 hover:border-sky-400 hover:bg-sky-50 transition-all active:scale-95 shadow-sm shrink-0"
                   >
                     <p className={`${FONT.MICRO} font-black text-slate-900 uppercase mb-0.5 group-hover:text-sky-600`}>วันที่กำลังเช็กชื่อ</p>
                     <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-sky-600" />
                       <span className={`${FONT.BODY_MD} font-black text-slate-900 uppercase`}>{formatThaiDate(attendanceDate)}</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {course?.students && course.students.length > 0 ? (
                  course.students.map((student, i) => {
                    if (!student) return null;
                    const offset = swipeOffset[student.id] || 0;
                    const isChecked = (student.attendanceLog || []).some(
                      (log) => log && log.courseId === course.id && log.date === attendanceDate
                    );
                    const session = (student.courseSessions || []).find(s => s && s.courseId === course.id);
                    const balance = session?.balance ?? 0;

                    return (
                      <div key={student.id} className="relative overflow-hidden rounded-3xl">
                        <div className={`absolute inset-0 bg-rose-500 flex items-center justify-end px-8 text-white ${FONT.LABEL_BLACK} transition-opacity duration-200 ${offset < -20 ? 'opacity-100' : 'opacity-0'}`}>ยกเลิกเช็กชื่อ</div>
                        <div
                          className={`p-3 rounded-2xl border transition-all duration-300 relative z-10 flex items-center justify-between gap-3 ${isChecked ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                          style={{ transform: `translateX(${offset}px)` }}
                          onTouchStart={(e) => startSwipe(student.id, e.touches[0].clientX)}
                          onTouchMove={(e) => moveSwipe(student.id, e.touches[0].clientX, isChecked)}
                          onTouchEnd={() => endSwipe(student.id, student.id)}
                          onMouseDown={(e) => startSwipe(student.id, e.clientX)}
                          onMouseMove={(e) => e.buttons === 1 && moveSwipe(student.id, e.clientX, isChecked)}
                          onMouseUp={() => endSwipe(student.id, student.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center ${FONT.LABEL_BLACK} text-slate-900 shrink-0`}>{i + 1}</div>
                            <div className="min-w-0 cursor-pointer select-none active:scale-95 transition-transform" onClick={() => toggleName(student.id)}>
                              <h4 className={`text-slate-900 ${FONT.BODY_MD} font-black truncate leading-none`}>
                                {toggledNames.has(student.id) ? student.name : `น้อง${student.nickname || student.name}`}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <p className={`${FONT.CAPTION_BLACK} ${balance <= 2 ? 'text-rose-500 font-black' : 'text-slate-900'}`}>{balance} ครั้ง</p>
                            {isChecked ? (
                              <button onClick={() => onUndoAttendance(student.id, course.id, attendanceDate)} className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                                <CheckCircle size={20} className="stroke-[3px]" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onCheckAttendance(student.id, course.id, attendanceDate)}
                                disabled={balance <= 0}
                                className={`px-4 py-2 rounded-xl font-black ${FONT.LABEL_SM_BLACK} transition-all border-2 ${balance > 0 ? 'text-sky-600 border-sky-100 bg-white hover:bg-sky-50 active:scale-90 hover:border-sky-300' : 'text-slate-300 border-slate-50 bg-slate-50/30 cursor-not-allowed'}`}
                              >
                                {balance > 0 ? 'มาเรียน' : 'หมด'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`flex flex-col items-center justify-center h-full gap-4 text-slate-900 opacity-20 ${FONT.BODY_LG} font-black`}>
                    <Users size={64} />
                    <p>ยังไม่มีรายชื่อนักเรียน</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white border-t border-slate-100 flex justify-center shrink-0">
                <button
                  onClick={onClose}
                  className={`w-full py-4 rounded-2xl bg-slate-900 text-white ${FONT.BODY_MD} font-black hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200`}
                >
                  เสร็จสิ้นเรียบร้อย
                </button>
              </div>
            </div>
          </div>

          {/* SIDE 2: CALENDAR SELECTOR */}
          <div className="absolute inset-0 w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="bg-white w-full h-full rounded-[48px] overflow-hidden flex flex-col border border-slate-100 shadow-2xl relative">
              <div className="p-8 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsFlipped(false)} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                    <ArrowLeft size={24} className="stroke-[3px]" />
                  </button>
                  <div>
                    <h3 className={`${FONT.H5} font-black leading-none`}>เลือกวันที่เช็กชื่อ</h3>
                    <p className={`text-white ${FONT.MICRO} font-black uppercase mt-1.5`}>เลือกวันที่ต้องการเช็กชื่อ</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-rose-500 transition-colors"><X size={28} /></button>
              </div>

              <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-900">
                <div className="w-full max-w-sm bg-slate-50 rounded-[40px] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={handlePrevMonth} className="w-12 h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center"><ArrowLeft size={20} className="stroke-[3.5px]" /></button>
                    <h4 className={`${FONT.H5} text-slate-900`}>{months[viewDate.getMonth()]} {viewDate.getFullYear() + 543}</h4>
                    <button onClick={handleNextMonth} className="w-12 h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center rotate-180"><ArrowLeft size={20} className="stroke-[3.5px]" /></button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map(d => <div key={d} className={`text-center ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase`}>{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(getFirstDay(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => <div key={`empty-${i}`} />)}
                    {[...Array(getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => {
                      const d = i + 1;
                      const fullDate = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                      const isSelected = attendanceDate === fullDate;
                      const isToday = new Date().toLocaleDateString('en-CA') === fullDate;

                      return (
                        <button
                          key={d}
                          onClick={() => handleDateSelect(d)}
                          className={`w-full aspect-square rounded-xl flex items-center justify-center ${FONT.BODY_MD} font-black transition-all active:scale-90 ${isSelected ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' :
                            isToday ? 'bg-slate-900 text-white shadow-xl' :
                              'bg-white text-slate-900 hover:bg-sky-50 hover:text-sky-600'
                            }`}
                        >
                          {d}
                          {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-sky-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 text-center space-y-2 text-slate-900">
                  <p className={`font-bold ${FONT.LABEL_SM} uppercase`}>วันที่กำลังเช็กชื่อ</p>
                  <p className={`${FONT.H3} text-slate-900`}>{formatThaiDate(attendanceDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TimetableCourseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  course: CourseWithStudents | null;
  onOpenCoursePage: (courseId: number) => void;
}

export const TimetableCourseDetailsModal: React.FC<TimetableCourseDetailsModalProps> = ({
  show,
  onClose,
  course,
  onOpenCoursePage,
}) => {
  const [toggledNames, setToggledNames] = useState<Set<number>>(new Set());

  const toggleName = (id: number) => {
    setToggledNames(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!show || !course) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] border border-slate-100">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200">
              <BookOpen size={32} className="stroke-[2.5px]" />
            </div>
            <div>
              <h2 className={`${FONT.H2} text-slate-900 leading-none`}>{course.name}</h2>
              <p className={`text-slate-900 ${FONT.CAPTION_BLACK} mt-2 uppercase`}>ข้อมูลคอร์สเรียนและตารางเวลา</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95 border border-slate-100"
          >
            <X size={28} className="stroke-[3px]" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-8 lg:p-10 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
            {/* Col 1: Course Info */}
            <div className="lg:col-span-6 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Users size={24} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className={`${FONT.MICRO} font-black text-slate-900 leading-none mb-1.5 uppercase`}>นักเรียน</p>
                    <p className={`${FONT.H4} text-slate-900 leading-none`}>{course.students.length} คน</p>
                  </div>
                </div>

                <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={24} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className={`${FONT.MICRO} font-black text-slate-900 leading-none mb-1.5 uppercase`}>ราคาสุทธิ</p>
                    <p className={`${FONT.H5} text-emerald-600 leading-none`}>฿{course.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className={`${FONT.MICRO} font-black text-slate-900 leading-none mb-1.5 uppercase`}>ห้องเรียน</p>
                    <p className={`${FONT.H5} text-slate-900 leading-none`}>ห้อง {course.room}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-figma-soft space-y-6">
                <h3 className={`flex items-center gap-3 ${FONT.BODY_MD} font-black text-slate-900 border-b border-slate-50 pb-5 uppercase`}>
                  <Clock size={20} className="text-slate-900 stroke-[3px]" />
                  ตารางเรียนรายสัปดาห์
                </h3>
                <div className="space-y-3">
                  {course.schedule.map((schedule, i) => {
                    const theme = DAY_THEMES[schedule.day] || { text: 'text-slate-900', solid: 'bg-slate-900' };
                    return (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-sky-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${theme.solid} shadow-lg shadow-current`} />
                          <span className={`${FONT.BODY_LG} font-black ${theme.text}`}>{schedule.day}</span>
                        </div>
                        <span className={`${FONT.BODY_MD} font-black text-slate-900 leading-none`}>{schedule.time} น.</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Col 2: Student List */}
            <div className="lg:col-span-6 flex flex-col min-h-0 bg-white rounded-[40px] border border-slate-100 shadow-figma-soft overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <UserCheck size={22} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className={`${FONT.BODY_LG} font-black text-slate-900 leading-none`}>รายชื่อนักเรียน</h3>
                    <p className={`text-slate-900 ${FONT.LABEL} uppercase mt-1`}>รายชื่อสมาชิกในกลุ่มเรียนนี้</p>
                  </div>
                </div>
                <span className={`${FONT.LABEL_BLACK} text-white bg-slate-900 px-5 py-2 rounded-full shadow-lg shadow-slate-100`}>{course.students.length} คน</span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/20">
                <div className="grid grid-cols-1 gap-4">
                  {course?.students && course.students.length > 0 ? (
                    course.students.map((student, i) => {
                      if (!student) return null;
                      const session = (student.courseSessions || []).find((s) => s && s.courseId === course.id);
                      const balance = session?.balance ?? 0;
                      return (
                        <div key={student.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-sm hover:border-sky-400 hover:shadow-xl hover:shadow-sky-50 transition-all group/item">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${FONT.LABEL_SM_BLACK} text-slate-900 shrink-0 border border-slate-100 group-hover/item:bg-sky-50 group-hover/item:text-sky-600 transition-colors`}>{(i + 1).toString().padStart(2, '0')}</div>
                            <div
                              className="min-w-0 cursor-pointer select-none active:scale-95 transition-transform"
                              onClick={() => toggleName(student.id)}
                            >
                              <p className={`text-slate-900 ${FONT.BODY_MD} font-black truncate leading-none`}>
                                {toggledNames.has(student.id) ? student.name : `น้อง${student.nickname || student.name}`}
                              </p>
                              <p className={`${FONT.MICRO} font-bold text-sky-600 mt-1 uppercase`}>
                                {toggledNames.has(student.id) ? '● ชื่อจริง' : '● ชื่อเก๋ไก่'}
                              </p>
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full ${FONT.CAPTION_BLACK} shrink-0 border-2 ${balance <= 2 ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-lg shadow-rose-50' : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-lg shadow-emerald-50'}`}>
                            {balance} ครั้ง
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-20 text-center text-slate-900 font-black border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center gap-6 m-4 bg-white">
                      <Users size={64} className="stroke-[1.5px]" />
                      <div className="space-y-1">
                        <p className={`${FONT.BODY_LG} text-slate-900`}>ยังไม่มีนักเรียนลงทะเบียน</p>
                        <p className={`${FONT.LABEL} text-slate-900`}>สามารถเพิ่มนักเรียนได้ที่หน้าข้อมูลนักเรียน</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0 bg-white">
                <button
                  onClick={() => onOpenCoursePage(course.id)}
                  className={`flex-[2] gradient-blue text-white ${FONT.LABEL_BLACK} py-5 rounded-[24px] transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-3 hover:scale-[1.02]`}
                >
                  <UserCheck size={24} className="stroke-[3px]" />
                  เริ่มบันทึกเช็คชื่อ
                </button>
                <button
                  onClick={onClose}
                  className={`flex-1 bg-slate-50 hover:bg-rose-50 text-slate-900 hover:text-rose-500 ${FONT.LABEL_BLACK} py-5 rounded-[24px] transition-all border border-slate-100 uppercase`}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
