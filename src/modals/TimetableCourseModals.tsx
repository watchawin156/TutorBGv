import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Users,
  X,
  User,
  Clock,
  Layout,
  UserCheck,
  Undo2,
  Search,
  DollarSign,
  Hash,
} from "lucide-react";

import { DatePickerModal } from "./DatePickerModal";
import { CourseWithStudents } from "../functions/types";
import { formatThaiDate } from "../functions/utils";
import { FONT } from "../functions/fontsize";

const DAY_THEMES: {
  [key: string]: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    solid: string;
  };
} = {
  จันทร์: {
    bg: "bg-[#FFFDE7]",
    text: "text-[#FBC02D]",
    accent: "bg-[#FBC02D]",
    border: "border-[#FBC02D]",
    solid: "bg-[#FBC02D]",
  },
  อังคาร: {
    bg: "bg-[#FDF2F8]",
    text: "text-[#EC4899]",
    accent: "bg-[#EC4899]",
    border: "border-[#EC4899]",
    solid: "bg-[#EC4899]",
  },
  พุธ: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#22C55E]",
    accent: "bg-[#22C55E]",
    border: "border-[#22C55E]",
    solid: "bg-[#22C55E]",
  },
  พฤหัสบดี: {
    bg: "bg-[#FFF7ED]",
    text: "text-[#F97316]",
    accent: "bg-[#F97316]",
    border: "border-[#F97316]",
    solid: "bg-[#F97316]",
  },
  ศุกร์: {
    bg: "bg-[#F0F9FF]",
    text: "text-[#0EA5E9]",
    accent: "bg-[#0EA5E9]",
    border: "border-[#0EA5E9]",
    solid: "bg-[#0EA5E9]",
  },
  เสาร์: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    accent: "bg-blue-600",
    border: "border-blue-600",
    solid: "bg-blue-600",
  },
  อาทิตย์: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#EF4444]",
    accent: "bg-[#EF4444]",
    border: "border-[#EF4444]",
    solid: "bg-[#EF4444]",
  },
};

interface TimetableAttendanceModalProps {
  show: boolean;
  onClose: () => void;
  course: CourseWithStudents | null;
  onCheckAttendance: (
    studentId: number,
    courseId: number,
    date: string,
  ) => void;
  onUndoAttendance: (studentId: number, courseId: number, date: string) => void;
}

export const TimetableAttendanceModal: React.FC<
  TimetableAttendanceModalProps
> = ({ show, onClose, course, onCheckAttendance, onUndoAttendance }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
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
    setToggledNames((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!show || !course) return null;

  const checkedCount = course.students.filter((student) =>
    (student.attendanceLog || []).some(
      (log) => log.courseId === course.id && log.date === attendanceDate,
    ),
  ).length;

  const startSwipe = (id: number, x: number) => {
    touchStartX.current[id] = x;
  };

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

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const weekDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
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
    const m = (viewDate.getMonth() + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    setAttendanceDate(`${y}-${m}-${d}`);
    setIsFlipped(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex sm:items-center sm:justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full h-full sm:h-[640px] sm:max-h-[90vh] sm:max-w-xl transition-all duration-700 select-none"
        style={{ perspective: "2000px", WebkitPerspective: "2000px" }}
      >
        <div
          className="w-full h-full relative transition-all duration-700 sm:shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:rounded-xl"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "",
            WebkitTransform: isFlipped ? "rotateY(180deg)" : "",
          }}
        >
          {/* SIDE 1: STUDENT LIST */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? "pointer-events-none" : ""}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="bg-white w-full h-full sm:rounded-xl overflow-hidden flex flex-col sm:border border-slate-100 relative">
              <div className="flex flex-col shrink-0 bg-white">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#e6e6ff] text-[#696cff] flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-semibold text-[#566a7f] leading-none">
                        {course.name}
                      </h2>
                      <p className="text-[13px] text-[#a1acb8] mt-1">
                        รายชื่อและเช็คชื่อนักเรียน
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between px-6 py-3 border-b border-[#d9dee3] bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#a1acb8]" />
                    <span className="text-[13px] font-medium text-[#566a7f]">
                      มาเรียน{" "}
                      <strong className="text-[#696cff]">{checkedCount}</strong>
                      /{course.students.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="flex items-center gap-1.5 bg-white border border-[#d9dee3] rounded-md px-3 py-1.5 hover:border-[#696cff] hover:text-[#696cff] transition-all active:scale-95 shadow-sm"
                  >
                    <Calendar size={14} className="text-[#696cff]" />
                    <span className="text-[13px] font-medium text-[#566a7f]">
                      {formatThaiDate(attendanceDate)}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-slate-50/30">
                {course?.students && course.students.length > 0 ? (
                  course.students.map((student, i) => {
                    if (!student) return null;
                    const offset = swipeOffset[student.id] || 0;
                    const isChecked = (student.attendanceLog || []).some(
                      (log) =>
                        log &&
                        log.courseId === course.id &&
                        log.date === attendanceDate,
                    );
                    const session = (student.courseSessions || []).find(
                      (s) => s && s.courseId === course.id,
                    );
                    const balance = session?.balance ?? 0;

                    return (
                      <div
                        key={student.id}
                        className="relative overflow-hidden mb-3"
                      >
                        <div
                          className={`absolute inset-0 bg-rose-500 rounded-lg flex items-center justify-end px-8 text-white ${FONT.LABEL_BLACK} transition-opacity duration-200 ${offset < -20 ? "opacity-100" : "opacity-0"}`}
                        >
                          ยกเลิกเช็กชื่อ
                        </div>
                        <div
                          className={`p-4 rounded-lg shadow-[0_2px_14px_rgba(0,0,0,0.03)] border transition-all duration-300 relative z-10 flex items-center justify-between gap-3 ${isChecked ? "bg-[#f0fbf0] border-[#e8fadf]" : "bg-white border-slate-100 hover:border-slate-300"}`}
                          style={{ transform: `translateX(${offset}px)` }}
                          onTouchStart={(e) =>
                            startSwipe(student.id, e.touches[0].clientX)
                          }
                          onTouchMove={(e) =>
                            moveSwipe(
                              student.id,
                              e.touches[0].clientX,
                              isChecked,
                            )
                          }
                          onTouchEnd={() => endSwipe(student.id, student.id)}
                          onMouseDown={(e) => startSwipe(student.id, e.clientX)}
                          onMouseMove={(e) =>
                            e.buttons === 1 &&
                            moveSwipe(student.id, e.clientX, isChecked)
                          }
                          onMouseUp={() => endSwipe(student.id, student.id)}
                        >
                          {/* Avatar block */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-[14px] text-[#a1acb8] font-bold w-4 text-center shrink-0">
                              {i + 1}
                            </span>

                            {(() => {
                              const avatarColors = [
                                "bg-[#e6e6ff] text-[#696cff]", // Primary
                                "bg-[#fff2d6] text-[#ffab00]", // Warning
                                "bg-[#d7f5fc] text-[#03c3ec]", // Info
                                "bg-[#ffe2e3] text-[#ff3e1d]", // Danger
                                "bg-[#e8fadf] text-[#71dd37]", // Success
                              ];
                              const avatarClass =
                                avatarColors[student.id % avatarColors.length];
                              return (
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarClass}`}
                                >
                                  {student.name.charAt(0)}
                                </div>
                              );
                            })()}

                            <div
                              className="flex flex-col min-w-0 cursor-pointer select-none active:scale-95 transition-transform"
                              onClick={() => toggleName(student.id)}
                            >
                              <span
                                className={`font-semibold text-[#566a7f] text-[15px] truncate`}
                              >
                                {toggledNames.has(student.id)
                                  ? student.name
                                  : student.nickname || student.name}
                              </span>
                            </div>
                          </div>

                          {/* Progress and Actions block */}
                          <div className="flex items-center gap-4 shrink-0">
                            {(() => {
                              const strokeColors = [
                                "stroke-[#696cff]",
                                "stroke-[#ffab00]",
                                "stroke-[#03c3ec]",
                                "stroke-[#ff3e1d]",
                                "stroke-[#71dd37]",
                              ];
                              const strokeClass =
                                strokeColors[student.id % strokeColors.length];
                              const total =
                                session?.totalSessions || course.sessions;
                              const percentage =
                                total > 0
                                  ? Math.round((balance / total) * 100)
                                  : 0;
                              const circleDasharray = 100.53; // 2 * pi * 16
                              const circleOffset =
                                circleDasharray -
                                (percentage / 100) * circleDasharray;

                              return (
                                <div className="flex items-center gap-2">
                                  <div className="text-right hidden sm:block">
                                    <span className="text-[13px] font-semibold text-[#566a7f] whitespace-nowrap">
                                      {balance}ครั้ง
                                    </span>
                                  </div>
                                  <div className="relative w-9 h-9 flex items-center justify-center">
                                    <svg
                                      className="w-9 h-9 transform -rotate-90"
                                      viewBox="0 0 36 36"
                                    >
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className="stroke-slate-100"
                                        strokeWidth="3"
                                      />
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className={`${strokeClass}`}
                                        strokeWidth="3"
                                        strokeDasharray={circleDasharray}
                                        strokeDashoffset={circleOffset}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              );
                            })()}

                            {isChecked ? (
                              <button
                                onClick={() =>
                                  onUndoAttendance(
                                    student.id,
                                    course.id,
                                    attendanceDate,
                                  )
                                }
                                className="px-3 min-w-[70px] h-[32px] flex items-center justify-center rounded-md font-medium text-[13px] bg-[#e8fadf] text-[#71dd37] transition-colors shrink-0 border border-[#e8fadf]"
                              >
                                <CheckCircle size={16} className="mr-1" />{" "}
                                เช็คแล้ว
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  onCheckAttendance(
                                    student.id,
                                    course.id,
                                    attendanceDate,
                                  )
                                }
                                disabled={balance <= 0}
                                className={`px-3 min-w-[70px] h-[32px] rounded-md font-medium text-[13px] transition-all border ${balance > 0 ? "text-[#03c3ec] border-[#03c3ec]/20 bg-white hover:bg-[#03c3ec]/5 active:scale-95" : "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed"}`}
                              >
                                {balance > 0 ? "มาเรียน" : "หมด"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center h-full gap-4 text-slate-900 opacity-20 ${FONT.BODY_LG} font-black`}
                  >
                    <Users size={64} />
                    <p>ยังไม่มีรายชื่อนักเรียน</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-[#d9dee3] flex justify-end shrink-0 bg-slate-50/50">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-md font-medium text-[14px] bg-[#696cff] text-white hover:bg-[#5f61e6] transition-all shadow-[0_4px_12px_rgba(105,108,255,0.4)]"
                >
                  เสร็จสิ้นเรียบร้อย
                </button>
              </div>
            </div>
          </div>

          {/* SIDE 2: CALENDAR SELECTOR */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden ${!isFlipped ? "pointer-events-none" : ""}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              WebkitTransform: "rotateY(180deg)",
            }}
          >
            <div className="bg-white w-full h-full sm:rounded-xl overflow-hidden flex flex-col sm:border border-[#d9dee3] shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3] bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#566a7f] leading-none">
                      เลือกวันที่เช็กชื่อ
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-900 bg-slate-50/50">
                <div className="w-full max-w-sm bg-white rounded-lg p-6 border border-[#d9dee3] shadow-[0_2px_14px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handlePrevMonth}
                      type="button"
                      className="w-10 h-10 rounded-md bg-white border border-[#d9dee3] text-[#566a7f] hover:border-[#696cff] hover:text-[#696cff] transition-all shadow-sm flex items-center justify-center relative z-20"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <h4 className="text-[16px] font-semibold text-[#566a7f] pointer-events-none">
                      {months[viewDate.getMonth()]}{" "}
                      {viewDate.getFullYear() + 543}
                    </h4>
                    <button
                      onClick={handleNextMonth}
                      type="button"
                      className="w-10 h-10 rounded-md bg-white border border-[#d9dee3] text-[#566a7f] hover:border-[#696cff] hover:text-[#696cff] transition-all shadow-sm flex items-center justify-center relative z-20"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {weekDays.map((d) => (
                      <div
                        key={d}
                        className="text-center text-[12px] font-bold text-[#a1acb8]"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {[
                      ...Array(
                        getFirstDay(
                          viewDate.getFullYear(),
                          viewDate.getMonth(),
                        ),
                      ),
                    ].map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {[
                      ...Array(
                        getDaysInMonth(
                          viewDate.getFullYear(),
                          viewDate.getMonth(),
                        ),
                      ),
                    ].map((_, i) => {
                      const d = i + 1;
                      const fullDate = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
                      const isSelected = attendanceDate === fullDate;
                      const isToday =
                        new Date().toISOString().split("T")[0] === fullDate;

                      return (
                        <button
                          key={d}
                          onClick={() => handleDateSelect(d)}
                          className={`w-full aspect-square rounded-md flex items-center justify-center font-medium text-[14px] transition-all active:scale-90 ${
                            isSelected
                              ? "bg-[#696cff] text-white shadow-[0_4px_12px_rgba(105,108,255,0.4)]"
                              : isToday
                                ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                : "bg-transparent border border-transparent text-[#566a7f] hover:bg-[#696cff]/10 hover:text-[#696cff]"
                          }`}
                        >
                          {d}
                          {isToday && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#696cff]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
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

export const TimetableCourseDetailsModal: React.FC<
  TimetableCourseDetailsModalProps
> = ({ show, onClose, course, onOpenCoursePage }) => {
  const [toggledNames, setToggledNames] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  const toggleName = (id: number) => {
    setToggledNames((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredStudents =
    course?.students?.filter((student) => {
      if (!student) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchLower) ||
        (student.nickname?.toLowerCase() || "").includes(searchLower)
      );
    }) || [];

  if (!show || !course) return null;

  return (
    <div className="fixed inset-0 z-[200] flex sm:items-center sm:justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full h-full sm:h-[640px] sm:max-w-4xl sm:rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col sm:max-h-[85vh] sm:border border-[#d9dee3]">
        <div className="px-6 py-4 bg-white border-b border-[#d9dee3] flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-md bg-[#e6e6ff] text-[#696cff] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#566a7f] leading-none">
                {course.name}
              </h2>
              <p className="text-[13px] text-[#a1acb8] mt-1">
                ข้อมูลคอร์สเรียนและตารางเวลา
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#a1acb8] hover:text-[#566a7f] transition-colors relative z-10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-4 lg:p-8 bg-slate-50/50 flex flex-col min-h-0">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-8 h-full min-h-0">
            {/* Col 1: Course Info */}
            <div className="lg:col-span-3 shrink-0 flex flex-col gap-2 pb-0 lg:gap-3 lg:pb-0">
              {/* Mobile: Compact Grid with Icons */}
              <div className="lg:hidden flex flex-col gap-2 relative z-10 w-full mb-0">
                <div className="grid grid-cols-4 gap-1 bg-white rounded-xl p-2 border border-slate-100 shadow-sm text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users size={16} className="text-[#696cff] mb-1" />
                    <span className="text-[12px] font-black text-slate-800">
                      {course.students.length}{" "}
                      <span className="text-[10px] font-medium text-slate-500">
                        คน
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-slate-50">
                    <span className="text-emerald-500 mb-1 font-bold text-[16px] leading-[16px]">฿</span>
                    <span className="text-[12px] font-black text-emerald-600 font-mono">
                      {(course.price / 1000).toFixed(
                        course.price % 1000 === 0 ? 0 : 1,
                      )}
                      k
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-slate-50">
                    <MapPin size={16} className="text-amber-500 mb-1" />
                    <span className="text-[12px] font-black text-slate-800 truncate px-1 max-w-[100%]">
                      {course.room}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-slate-50">
                    <Hash size={16} className="text-sky-500 mb-1" />
                    <span className="text-[12px] font-black text-slate-800">
                      {course.sessions}{" "}
                      <span className="text-[10px] font-medium text-slate-500">
                        ครั้ง
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap bg-white rounded-xl py-2 px-3 border border-slate-100 shadow-sm relative min-h-[46px]">
                  {showSearch ? (
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <input
                        ref={mobileSearchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="พิมพ์เพื่อนค้นหา..."
                        className="w-full border-none outline-none bg-transparent text-[13px] text-slate-700"
                      />
                    </div>
                  ) : (
                    <>
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      {course.schedule.map((schedule, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap"
                        >
                          {schedule.day} {schedule.time}
                        </span>
                      ))}
                    </>
                  )}

                  <button
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (!showSearch) {
                        setTimeout(
                          () => mobileSearchInputRef.current?.focus(),
                          50,
                        );
                      } else {
                        setSearchQuery("");
                      }
                    }}
                    className="ml-auto w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                  >
                    {showSearch ? <X size={14} /> : <Search size={14} />}
                  </button>
                </div>
              </div>

              {/* Desktop: Original Vertical Layout */}
              <div className="hidden lg:flex flex-col gap-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    นักเรียน
                  </span>
                  <span className={`${FONT.BODY_SM} font-black text-slate-900`}>
                    {course.students.length} คน
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    ราคาสุทธิ
                  </span>
                  <span
                    className={`${FONT.BODY_SM} font-black text-emerald-600`}
                  >
                    ฿{course.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    ห้องเรียน
                  </span>
                  <span className={`${FONT.BODY_SM} font-black text-slate-900`}>
                    {course.room}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    จำนวนครั้ง
                  </span>
                  <span className={`${FONT.BODY_SM} font-black text-slate-900`}>
                    {course.sessions} ครั้ง
                  </span>
                </div>
                <div className="w-full mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    ตารางเรียนรายสัปดาห์
                  </span>
                  <div className="flex flex-col gap-y-2">
                    {course.schedule.map((schedule, i) => (
                      <div key={i} className="flex flex-col">
                        <span
                          className={`${FONT.BODY_SM} font-black text-slate-900 leading-tight`}
                        >
                          {schedule.day}
                        </span>
                        <span
                          className={`${FONT.LABEL_SM} text-slate-600 leading-tight`}
                        >
                          {schedule.time} น.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Student List */}
            <div className="lg:col-span-9 flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-[#d9dee3] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="flex flex-col bg-white relative shrink-0">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="text-[15px] font-bold text-[#566a7f]">
                    นักเรียน
                  </h3>
                  <button
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (!showSearch) {
                        setTimeout(
                          () => desktopSearchInputRef.current?.focus(),
                          50,
                        );
                      } else {
                        setSearchQuery("");
                      }
                    }}
                    className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-[#a1acb8] hover:bg-slate-50 hover:text-[#696cff] transition-colors -mr-2"
                  >
                    {showSearch ? <X size={18} /> : <Search size={18} />}
                  </button>
                </div>

                {showSearch && (
                  <div className="hidden lg:block relative group px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                    <input
                      ref={desktopSearchInputRef}
                      type="text"
                      placeholder="ค้นหาชื่อ หรือ ชื่อเล่น..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full px-4 py-[7px] bg-white border border-[#d9dee3] rounded-[0.375rem] text-[15px] text-[#697a8d] placeholder-[#b4bdc6] outline-none focus:border-[#696cff] transition-all`}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <div className="flex flex-col">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, i) => {
                      if (!student) return null;

                      const avatarColors = [
                        "bg-[#e6e6ff] text-[#696cff]", // Primary
                        "bg-[#fff2d6] text-[#ffab00]", // Warning
                        "bg-[#d7f5fc] text-[#03c3ec]", // Info
                        "bg-[#ffe2e3] text-[#ff3e1d]", // Danger
                        "bg-[#e8fadf] text-[#71dd37]", // Success
                      ];
                      const avatarClass =
                        avatarColors[student.id % avatarColors.length];

                      const session = (student.courseSessions || []).find(
                        (s) => s && s.courseId === course.id,
                      );
                      const balance = session?.balance ?? 0;
                      const total = session?.totalSessions || course.sessions;
                      const percentage =
                        total > 0 ? Math.round((balance / total) * 100) : 0;

                      const strokeColors = [
                        "stroke-[#696cff]",
                        "stroke-[#ffab00]",
                        "stroke-[#03c3ec]",
                        "stroke-[#ff3e1d]",
                        "stroke-[#71dd37]",
                      ];
                      const strokeClass =
                        strokeColors[student.id % strokeColors.length];

                      const circleDasharray = 100.53; // 2 * pi * 16
                      const circleOffset =
                        circleDasharray - (percentage / 100) * circleDasharray;

                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] shrink-0 ${avatarClass}`}
                            >
                              {student.name.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span
                                className={`font-semibold text-[#566a7f] text-[15px] truncate`}
                              >
                                {student.name}
                              </span>
                              <span className="text-[13px] text-[#a1acb8] truncate">
                                {student.nickname}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <span className="text-[13px] font-semibold text-[#566a7f] whitespace-nowrap">
                                {balance} ครั้ง{" "}
                                <span className="font-normal text-[#a1acb8] mx-0.5">
                                  :
                                </span>{" "}
                                <span className="font-normal text-[#a1acb8]">
                                  {total} ครั้ง
                                </span>
                              </span>
                            </div>
                            <div className="relative w-9 h-9 flex items-center justify-center">
                              <svg
                                className="w-9 h-9 transform -rotate-90"
                                viewBox="0 0 36 36"
                              >
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="16"
                                  fill="none"
                                  className="stroke-slate-100"
                                  strokeWidth="3"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="16"
                                  fill="none"
                                  className={`${strokeClass}`}
                                  strokeWidth="3"
                                  strokeDasharray={circleDasharray}
                                  strokeDashoffset={circleOffset}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-[#a1acb8] text-[15px]">
                      ไม่มีนักเรียนในหลักสูตรนี้
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
