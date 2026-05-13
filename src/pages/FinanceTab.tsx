import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  MoreHorizontal,
  Users,
  BookOpen,
  ArrowUpRight,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
} from "lucide-react";
import { Transaction, Student, Course } from "../functions/types";
import { formatThaiDateNumeric } from "../functions/utils";
import { FONT } from "../functions/fontsize";

interface FinanceTabProps {
  searchQuery?: string;
  selectedMonth?: string;
  stats: { income: number; expense: number; balance: number };
  transactions: Transaction[];
  onAddTransaction?: () => void;
  students: Student[];
  courses: Course[];
}

export const FinanceTab: React.FC<FinanceTabProps> = ({
  searchQuery = "",
  selectedMonth = "all",
  stats,
  transactions,
  onAddTransaction,
  students,
  courses,
}) => {
  const txsWithBalance = useMemo(() => {
    let currentBalance = stats.balance;
    return transactions.map((tx) => {
      const rowBalance = currentBalance;
      if (tx.type === "income") {
        currentBalance -= tx.amount;
      } else {
        currentBalance += tx.amount;
      }
      return { ...tx, runningBalance: rowBalance };
    });
  }, [transactions, stats.balance]);

  const filteredTransactions = useMemo(() => {
    let filtered = txsWithBalance;

    if (selectedMonth !== "all") {
      filtered = filtered.filter((tx) => {
        const date = new Date(tx.date);
        const monthNames = [
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
        const mStr = `${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`;
        return mStr === selectedMonth;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((tx) => {
        const note = tx.metadata?.note || tx.description || "";
        let details = "";
        if (tx.type === "income" && tx.metadata) {
          const s = tx.metadata.studentId
            ? students.find((st) => st.id === tx.metadata!.studentId)
            : null;
          const c = tx.metadata.courseId
            ? courses.find((co) => co.id === Number(tx.metadata!.courseId))
            : null;
          details =
            `${s ? s.name + " " + s.nickname : ""} ${c ? c.name : ""}`.toLowerCase();
        }
        return note.toLowerCase().includes(query) || details.includes(query);
      });
    }

    return filtered;
  }, [txsWithBalance, selectedMonth, searchQuery, students, courses]);

  return (
    <div className="h-full flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      {/* Mobile Compact View */}
      <div className="md:hidden bg-white rounded-2xl p-3 border border-slate-100 shadow-sm shrink-0 mb-3 flex flex-row items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
        <div className="flex flex-col shrink-0 min-w-0 pr-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            ยอดเงินคงเหลือ
          </span>
          <span className="text-[18px] font-black text-indigo-600 leading-none mt-1 break-words">
            ฿{(stats.balance || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-3 sm:gap-4 border-l border-slate-100 pl-3 sm:pl-4 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              รายรับ
            </span>
            <span className="text-[14px] font-bold text-sky-500 leading-none mt-1">
              ฿{(stats.income || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              รายจ่าย
            </span>
            <span className="text-[14px] font-bold text-rose-500 leading-none mt-1">
              ฿{(stats.expense || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Original View */}
      <div className="hidden md:block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shrink-0 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end pb-4 border-b border-slate-100/80">
            <div>
              <span className="text-[12px] uppercase font-bold text-slate-500 mb-1 tracking-wider block">
                ยอดเงินคงเหลือ
              </span>
              <h2 className="text-3xl font-black text-indigo-600 tracking-tight leading-none mt-1">
                ฿{(stats.balance || 0).toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              {/* Optional: Add month label */}
              {selectedMonth !== "all" && (
                <span className="text-xs font-bold text-slate-400">
                  ด. {selectedMonth}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[12px] uppercase font-bold text-slate-500 mb-1 tracking-wider block">
                รายรับ
              </span>
              <span className={`${FONT.H4} font-black text-sky-500`}>
                ฿{(stats.income || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[12px] uppercase font-bold text-slate-500 mb-1 tracking-wider block">
                รายจ่าย
              </span>
              <span className={`${FONT.H4} font-black text-rose-500`}>
                ฿{(stats.expense || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-3 md:mb-4">
        <h3 className={`${FONT.H4} text-slate-900 w-full md:w-auto`}>
          ประวัติรายการ
        </h3>
      </div>

      <div className="flex-1 bg-white rounded-2xl sm:rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-[14px] font-bold text-slate-500">
            ประวัติรายการ
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar sm:custom-scrollbar bg-white">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 h-full">
              <Receipt size={32} className="mb-2 opacity-20" />
              <span className="text-[14px] font-medium">
                {searchQuery
                  ? "ไม่พบรายการที่ค้นหา"
                  : selectedMonth === "all"
                    ? "ยังไม่มีรายการเคลื่อนไหว"
                    : `ไม่มีรายการในเดือน ${selectedMonth}`}
              </span>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-50">
              {filteredTransactions.map((tx) => {
                const linkedStudent = tx.metadata?.studentId
                  ? students.find((s) => s.id === tx.metadata!.studentId)
                  : null;
                const linkedCourse = tx.metadata?.courseId
                  ? courses.find((c) => c.id === tx.metadata!.courseId)
                  : null;

                const detail =
                  linkedStudent && linkedCourse
                    ? `${linkedStudent.name} • ${linkedCourse.name}`
                    : linkedStudent
                      ? `${linkedStudent.name} • ${tx.category}`
                      : tx.description;

                const isIncome = tx.type === "income";

                const avatarColors = [
                  "bg-indigo-50 text-indigo-600",
                  "bg-emerald-50 text-emerald-600",
                  "bg-rose-50 text-rose-600",
                  "bg-amber-50 text-amber-600",
                  "bg-sky-50 text-sky-600",
                ];
                const avatarClass = isIncome
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-rose-50 text-rose-600";

                return (
                  <div
                    key={tx.id}
                    className="p-4 flex items-center justify-between transition-colors hover:bg-slate-50/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-4">
                      <div
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-[14px] md:text-[15px] shrink-0 ${avatarClass}`}
                      >
                        {tx.category.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-700 text-[14px] md:text-[15px] truncate">
                          {tx.category}
                        </span>
                        <span className="text-[13px] text-slate-400 truncate">
                          {detail}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`text-[14px] font-bold ${isIncome ? "text-indigo-600" : "text-rose-600"} whitespace-nowrap`}
                      >
                        {isIncome ? "" : "-"}฿{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {formatThaiDateNumeric(tx.date)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FinanceTab;
