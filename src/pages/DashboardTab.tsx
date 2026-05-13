import React, { useMemo } from 'react';
import { Users, BookOpen, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Student, Course, Transaction } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface DashboardTabProps {
  students: Student[];
  courses: Course[];
  transactions: Transaction[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export const DashboardTab: React.FC<DashboardTabProps> = ({ students, courses, transactions }) => {
  const activeCoursesCount = courses.length;
  const totalStudentsCount = students.length;

  const studentsByGrade = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      counts[s.grade] = (counts[s.grade] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [students]);

  const financialData = useMemo(() => {
    // Group by month
    const monthly: Record<string, { income: number, expense: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[monthYear]) {
        monthly[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthly[monthYear].income += t.amount;
      } else {
        monthly[monthYear].expense += t.amount;
      }
    });

    return Object.entries(monthly).map(([name, data]) => {
      const d = new Date(name);
      return {
        name: d.toLocaleString('th-TH', { month: 'short', year: '2-digit' }),
        รายรับ: data.income,
        รายจ่าย: data.expense,
        monthYear: name
      };
    }).sort((a, b) => a.monthYear.localeCompare(b.monthYear)).slice(-6); // Last 6 months
  }, [transactions]);

  return (
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto hide-scrollbar gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-2 gap-3 lg:gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-slate-500 mb-1 lg:mb-2 line-clamp-1">จำนวนนักเรียนทั้งหมด</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-indigo-600 font-extrabold">{totalStudentsCount} <span className="text-[13px] sm:text-base lg:text-lg font-bold text-slate-500">คน</span></h3>
          </div>
          <div className="hidden sm:flex w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-indigo-50 text-indigo-600 items-center justify-center shrink-0">
            <Users size={24} className="stroke-[2.5px] lg:w-[28px] lg:h-[28px]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-slate-500 mb-1 lg:mb-2 line-clamp-1">วิชาที่กำลังเปิดสอน</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-sky-600 font-extrabold">{activeCoursesCount} <span className="text-[13px] sm:text-base lg:text-lg font-bold text-slate-500">วิชา</span></h3>
          </div>
          <div className="hidden sm:flex w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-sky-50 text-sky-600 items-center justify-center shrink-0">
            <BookOpen size={24} className="stroke-[2.5px] lg:w-[28px] lg:h-[28px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 min-h-0 lg:min-h-min">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
          <h3 className={`${FONT.H5} text-slate-800 mb-6 font-bold`}>นักเรียนแยกตามชั้นปี</h3>
          <div className="flex-1 w-full">
            <div className="flex flex-col gap-5">
              {studentsByGrade.length === 0 ? (
                <div className="text-center text-slate-500 py-8">ไม่มีข้อมูลนักเรียน</div>
              ) : (
                studentsByGrade.map((grade, index) => {
                  const percent = totalStudentsCount > 0 ? (grade.value / totalStudentsCount) * 100 : 0;
                  return (
                    <div key={grade.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className={`${FONT.DATA_REG} font-bold text-slate-800`}>{grade.name || 'ไม่ระบุ'}</span>
                        <span className={`${FONT.DATA_REG} text-slate-600`}>{grade.value} คน</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percent}%`, backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col h-full">
          <h3 className={`${FONT.H5} text-slate-800 mb-6 font-bold`}>สรุปรายรับ - รายจ่าย (6 เดือนย้อนหลัง)</h3>
          <div className="flex-1 w-full">
            <div className="flex flex-col gap-6">
              {financialData.length === 0 ? (
                <div className="text-center text-slate-500 py-8">ไม่มีข้อมูลการเงิน</div>
              ) : (
                financialData.map((data, index) => {
                  const maxVal = Math.max(...financialData.map(d => Math.max(d.รายรับ, d.รายจ่าย))) || 1;
                  const incomePercent = (data.รายรับ / maxVal) * 100;
                  const expensePercent = (data.รายจ่าย / maxVal) * 100;
                  return (
                    <div key={data.name} className="flex flex-col gap-3">
                      <span className={`${FONT.DATA_REG} font-bold text-slate-800`}>{data.name}</span>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-14 sm:w-16 shrink-0 text-emerald-600 text-xs font-bold whitespace-nowrap">รายรับ</div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden flex items-center">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${incomePercent}%` }} />
                          </div>
                          <div className="w-16 sm:w-20 text-right shrink-0 text-slate-600 text-xs">฿{data.รายรับ.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-14 sm:w-16 shrink-0 text-rose-500 text-xs font-bold whitespace-nowrap">รายจ่าย</div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden flex items-center">
                            <div className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${expensePercent}%` }} />
                          </div>
                          <div className="w-16 sm:w-20 text-right shrink-0 text-slate-600 text-xs">฿{data.รายจ่าย.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
