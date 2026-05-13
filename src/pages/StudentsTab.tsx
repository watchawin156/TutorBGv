import React, { useState, useMemo } from "react";
import {
  Plus,
  Phone,
  Clock,
  Edit2,
  RotateCcw,
  Wallet,
  History as HistoryIcon,
  Calendar,
  AlertTriangle,
  RefreshCw,
  User,
  Users,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { formatThaiDate } from "../functions/utils";
import { FONT } from "../functions/fontsize";
import { Student, Course } from "../functions/types";

import { StudentCoursesModal } from "../modals/StudentCoursesModal";

interface StudentsTabProps {
  searchQuery?: string;
  filterGrade?: string;
  filterBalance?: string;
  students: Student[];
  courses: Course[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onRegister: (student: Student, courseId?: number) => void;
  onRemoveCourseRegistration: (studentId: number, courseId: number) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  searchQuery = "",
  filterGrade = "all",
  filterBalance = "all",
  students,
  courses,
  onAddStudent,
  onEditStudent,
  onRegister,
  onRemoveCourseRegistration,
}) => {
  const [selectedStudentForCourses, setSelectedStudentForCourses] =
    useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          student.name.toLowerCase().includes(query) ||
          student.nickname.toLowerCase().includes(query) ||
          student.parentPhone.includes(searchQuery);
        if (!matchesSearch) return false;
      }

      if (filterGrade !== "all" && student.grade !== filterGrade) return false;

      const hasCourses = student.courseSessions.length > 0;
      let lowestSession = null;
      if (hasCourses) {
        lowestSession = [...student.courseSessions].sort(
          (a, b) => a.balance - b.balance,
        )[0];
      }

      if (filterBalance !== "all") {
        if (filterBalance === "empty") {
          if (!hasCourses || lowestSession!.balance > 0) return false;
        } else if (filterBalance === "low") {
          if (
            !lowestSession ||
            lowestSession.balance === 0 ||
            lowestSession.balance > lowestSession.totalSessions * 0.25
          )
            return false;
        } else if (filterBalance === "normal") {
          if (
            !lowestSession ||
            lowestSession.balance <= lowestSession.totalSessions * 0.25
          )
            return false;
        } else if (filterBalance === "none") {
          if (hasCourses) return false;
        }
      }

      return true;
    });
  }, [students, filterGrade, filterBalance, searchQuery]);

  return (
    <div className="h-full flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-0">
        {/* Desktop View */}
        <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto hide-scrollbar sm:custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[#a1acb8] text-[13px] font-semibold uppercase min-w-[200px]">
                  นักเรียน
                </th>
                <th className="px-6 py-4 text-[#a1acb8] text-[13px] font-semibold uppercase w-32">
                  ระดับชั้น
                </th>
                <th className="px-6 py-4 text-[#a1acb8] text-[13px] font-semibold uppercase w-40 max-w-[160px]">
                  การติดต่อ
                </th>
                <th className="px-6 py-4 text-[#a1acb8] text-[13px] font-semibold uppercase w-40">
                  สถานะคลาสเรียน
                </th>
                <th className="px-6 py-4 text-[#a1acb8] text-[13px] font-semibold uppercase w-24 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student, index) => {
                const hasCourses = student.courseSessions.length > 0;
                let minBalance = 0;
                let lowestSession = null;
                if (hasCourses) {
                  const sortedSessions = [...student.courseSessions].sort(
                    (a, b) => a.balance - b.balance,
                  );
                  lowestSession = sortedSessions[0];
                  minBalance = lowestSession.balance;
                }

                const isLowQuota =
                  lowestSession &&
                  lowestSession.balance <= lowestSession.totalSessions * 0.25;

                const avatarColors = [
                  "bg-[#e6e6ff] text-[#696cff]", // Primary
                  "bg-[#e8fadf] text-[#71dd37]", // Success
                  "bg-[#ffe2e3] text-[#ff3e1d]", // Danger
                  "bg-[#fff2d6] text-[#ffab00]", // Warning
                  "bg-[#d7f5fc] text-[#03c3ec]", // Info
                ];
                const avatarClass =
                  avatarColors[student.id % avatarColors.length];

                return (
                  <React.Fragment key={student.id}>
                    <tr
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedStudentForCourses(student)}
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarClass}`}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <span
                              className={`font-semibold text-[#566a7f] text-[15px] truncate`}
                            >
                              {student.name}
                            </span>
                            <span className="text-[13px] text-[#a1acb8] truncate">
                              ชื่อเล่น: น้อง{student.nickname}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <span className="text-[15px] text-[#697a8d] whitespace-nowrap">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex justify-start">
                          <a
                            href={`tel:${student.parentPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-[#697a8d] hover:text-[#696cff] transition-colors w-fit whitespace-nowrap"
                          >
                            <span className="text-[15px]">
                              {student.parentPhone}
                            </span>
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          {isLowQuota ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#ff3e1d] shadow-[0_0_0_2px_rgba(255,62,29,0.2)]"></span>
                              <span className="text-[14px] text-[#566a7f] font-semibold">
                                เหลือ {minBalance} ครั้ง{" "}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#71dd37] shadow-[0_0_0_2px_rgba(113,221,55,0.2)]"></span>
                              <span className="text-[14px] text-[#566a7f] font-semibold">
                                เหลือ {minBalance} ครั้ง
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <div className="flex justify-center relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditStudent(student);
                              }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1acb8] hover:bg-slate-50 hover:text-[#696cff] transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="p-20 text-center">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className={`${FONT.H4} text-[#566a7f] mb-2`}>
                ยังไม่มีนักเรียน
              </h3>
              <p className={`${FONT.LABEL_SM} text-[#a1acb8] uppercase`}>
                เพิ่มนักเรียนคนแรกของคุณเพื่อเริ่มต้น
              </p>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col h-full bg-white relative shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-[15px] font-bold text-[#566a7f]">
              นักเรียน
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
            <div className="flex flex-col divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const avatarColors = [
                    "bg-[#e6e6ff] text-[#696cff]",
                    "bg-[#e8fadf] text-[#71dd37]",
                    "bg-[#ffe2e3] text-[#ff3e1d]",
                    "bg-[#fff2d6] text-[#ffab00]",
                    "bg-[#d7f5fc] text-[#03c3ec]",
                  ];
                  const avatarClass = avatarColors[student.id % avatarColors.length];
                  
                  return (
                    <div 
                      key={student.id} 
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudentForCourses(student)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] shrink-0 ${avatarClass}`}>
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-semibold text-[#566a7f] text-[15px] truncate`}>
                            {student.name}
                          </span>
                          <span className="text-[13px] text-[#a1acb8] truncate">
                            ชื่อเล่น: น้อง{student.nickname}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditStudent(student);
                        }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-[#a1acb8] active:bg-slate-100 active:text-[#696cff] transition-colors shrink-0"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Users size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className={`${FONT.H4} text-[#566a7f] mb-2`}>
                    ยังไม่มีนักเรียน
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StudentCoursesModal
        show={selectedStudentForCourses !== null}
        student={selectedStudentForCourses}
        courses={courses}
        onClose={() => setSelectedStudentForCourses(null)}
        onRemoveRegistration={(courseId) => {
          if (selectedStudentForCourses) {
            onRemoveCourseRegistration(selectedStudentForCourses.id, courseId);
          }
        }}
        onRegister={onRegister}
      />
    </div>
  );
};
