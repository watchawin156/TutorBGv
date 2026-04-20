import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Receipt, MoreHorizontal, Users, BookOpen, ArrowUpRight } from 'lucide-react';
import { Transaction, Student, Course } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface FinanceTabProps {
  stats: { income: number; expense: number; balance: number };
  transactions: Transaction[];
  onAddExpense?: () => void;
  students: Student[];
  courses: Course[];
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ stats, transactions, onAddExpense, students, courses }) => {
    const txsWithBalance = useMemo(() => {
        let currentBalance = stats.balance;
        return transactions.map((tx) => {
            const rowBalance = currentBalance;
            if (tx.type === 'income') {
                currentBalance -= tx.amount;
            } else {
                currentBalance += tx.amount;
            }
            return { ...tx, runningBalance: rowBalance };
        });
    }, [transactions, stats.balance]);

    return (
      <div className="h-full flex flex-col space-y-4 lg:space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
         
         {/* Activity Stats */}
         <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="gradient-emerald rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-emerald-200 group hover:scale-[1.02] transition-all cursor-pointer">
               <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <TrendingUp size={24} className="stroke-[2.5px]" />
                     </div>
                     <div>
                        <p className={`text-white/90 ${FONT.LABEL_SM} uppercase`}>รายรับทั้งหมด</p>
                        <span className={`${FONT.H3} leading-none tracking-tight`}>฿{stats.income.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-rose-500 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-rose-200 group hover:scale-[1.02] transition-all cursor-pointer">
               <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <TrendingDown size={24} className="stroke-[2.5px]" />
                     </div>
                     <div>
                        <p className={`text-white/90 ${FONT.LABEL_SM} uppercase`}>รายจ่ายทั้งหมด</p>
                        <span className={`${FONT.H3} leading-none tracking-tight`}>฿{stats.expense.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Recent Transactions List */}
         <div className="flex-1 rounded-3xl md:rounded-[32px] border border-slate-100 bg-white shadow-figma-soft overflow-hidden flex flex-col min-h-0">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 gap-4 sm:gap-0 bg-white shrink-0">
               <div>
                  <h3 className={`${FONT.H5} text-slate-900`}>ประวัติการเงิน</h3>
                  <p className={`${FONT.LABEL_SM_BLACK} text-slate-900 mt-1 uppercase`}>รายการเคลื่อนไหวล่าสุด</p>
               </div>
               <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors shrink-0">
                  <MoreHorizontal size={20} className="md:w-6 md:h-6" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white">
               <table className="w-full text-left flex-col border-collapse">
                  <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b border-slate-100">
                     <tr>
                        <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-24 md:w-32`}>วันที่</th>
                        <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase`}>รายละเอียดรายการ</th>
                        <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-emerald-600 uppercase w-24 md:w-32 text-right`}>รายรับ</th>
                        <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-rose-600 uppercase w-24 md:w-32 text-right`}>รายจ่าย</th>
                        <th className={`p-4 md:p-6 ${FONT.LABEL_SM_BLACK} text-slate-900 uppercase w-28 md:w-36 text-right pr-4 md:pr-8`}>คงเหลือ</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {txsWithBalance.map((tx) => {
                        const linkedStudent = tx.metadata?.studentId ? students.find(s => s.id === tx.metadata!.studentId) : null;
                        const linkedCourse = tx.metadata?.courseId ? courses.find(c => c.id === tx.metadata!.courseId) : null;
                        const displayDescription = linkedStudent && linkedCourse 
                           ? `ลงทะเบียนเรียน: ${linkedCourse.name} (นักเรียน: ${linkedStudent.name})${tx.metadata?.note ? ` [หมายเหตุ: ${tx.metadata.note}]` : ''}` 
                           : tx.description;

                        return (
                           <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors group">
                              <td className={`p-4 md:p-6 ${FONT.DATA_REG} text-slate-500 whitespace-nowrap`}>
                                 {tx.date}
                              </td>
                              <td className="p-4 md:p-6">
                                 <span className={`${FONT.BODY_LG} font-bold text-slate-900 block truncate`}>{displayDescription}</span>
                                 <span className="text-[12px] text-slate-400 mt-1 block truncate">{tx.category}</span>
                              </td>
                              <td className="p-4 md:p-6 text-right">
                                 {tx.type === 'income' ? (
                                     <span className={`${FONT.BODY_MD} font-black text-emerald-500 block truncate`}>
                                         {tx.amount.toLocaleString()}
                                     </span>
                                 ) : '-'}
                              </td>
                              <td className="p-4 md:p-6 text-right">
                                 {tx.type === 'expense' ? (
                                     <span className={`${FONT.BODY_MD} font-black text-rose-500 block truncate`}>
                                         {tx.amount.toLocaleString()}
                                     </span>
                                 ) : '-'}
                              </td>
                              <td className="p-4 md:p-6 text-right pr-4 md:pr-8">
                                 <span className={`${FONT.BODY_MD} font-black text-slate-900 block truncate`}>
                                    {tx.runningBalance.toLocaleString()}
                                 </span>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
               {transactions.length === 0 && (
                  <div className="p-12 text-center text-slate-400 font-bold bg-white">
                     ยังไม่มีรายการเคลื่อนไหว
                  </div>
               )}
            </div>
         </div>
      </div>
    );
 };
export default FinanceTab;
