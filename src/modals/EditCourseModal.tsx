import React from 'react';
import { X, Trash2, BookOpen, MapPin, DollarSign, Calendar, Plus, Clock, Hash, Save } from 'lucide-react';
import { Course } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface EditCourseModalProps {
  show: boolean;
  onClose: () => void;
  course: Course | null;
  setCourse: (course: Course | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ show, onClose, course, setCourse, onSubmit, onDelete }) => {
  if (!show || !course) return null;
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full h-full sm:h-auto max-w-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-[100dvh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9dee3] bg-white shrink-0">
           <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold text-[#566a7f]">แก้ไขข้อมูลรายวิชา</h3>
              <span className="text-[13px] text-[#a1acb8] font-normal leading-relaxed">ปรับปรุงชื่อวิชา ห้องเรียน และวันเรียน</span>
           </div>
           <button onClick={onClose} type="button" className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 overflow-y-auto space-y-5 custom-scrollbar">
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#566a7f] ml-1">ชื่อวิชาเรียน</label>
                  <input required type="text" value={course.name} onChange={e => setCourse({...course, name: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" placeholder="เช่น คณิตศาสตร์ ม.4..." />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[13px] font-medium text-[#566a7f] ml-1">ห้องเรียน</label>
                     <input required type="text" value={course.room} onChange={e => setCourse({...course, room: e.target.value})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" placeholder="ห้อง..." />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[13px] font-medium text-[#566a7f] ml-1">จำนวนครั้งที่เรียน (คอร์ส)</label>
                     <input required type="number" value={course.sessions} onChange={e => setCourse({...course, sessions: parseInt(e.target.value) || 0})} className="w-full bg-white border border-[#d9dee3] rounded-md px-4 py-2.5 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" placeholder="เช่น 10..." />
                  </div>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#566a7f] ml-1">ราคา (บาท)</label>
                  <div className="relative group">
                     <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1acb8] group-focus-within:text-[#696cff] transition-colors" />
                     <input required type="number" value={course.price} onChange={e => setCourse({...course, price: parseInt(e.target.value) || 0})} className="w-full bg-white border border-[#d9dee3] rounded-md py-2.5 pl-11 pr-4 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]" placeholder="ราคา..." />
                  </div>
               </div>
            </div>

            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[13px] font-medium text-[#566a7f] ml-1">ตารางเรียนรายสัปดาห์</label>
                 <button type="button" onClick={() => setCourse({...course, schedule: [...course.schedule, {day: 'จันทร์', time: ''}]})} className="text-[12px] font-semibold text-[#696cff] flex items-center gap-1.5 hover:text-[#5f61e6] bg-[#696cff]/10 px-3 py-1.5 rounded-md transition-colors">
                    <Plus size={14} /> เพิ่มวันเรียน
                 </button>
              </div>
              
              <div className="space-y-3">
                {course.schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-[#d9dee3] group/item">
                     <select 
                       value={item.day}
                       onChange={(e) => {
                          const newSchedule = [...course.schedule];
                          newSchedule[index].day = e.target.value;
                          setCourse({...course, schedule: newSchedule});
                       }}
                       className="w-[100px] bg-white border border-[#d9dee3] rounded-md px-3 py-2 text-[14px] text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all cursor-pointer"
                     >
                       {days.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                     <div className="flex-1 relative group/time">
                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1acb8] group-focus-within/time:text-[#696cff] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="08.00-10.00"
                          value={item.time}
                          onChange={(e) => {
                             const newSchedule = [...course.schedule];
                             newSchedule[index].time = e.target.value;
                             setCourse({...course, schedule: newSchedule});
                          }}
                          className="w-full bg-white border border-[#d9dee3] rounded-md pl-10 pr-4 py-2 text-[14px] text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all placeholder:text-[#a1acb8]"
                        />
                     </div>
                     {course.schedule.length > 1 && (
                       <button type="button" onClick={() => setCourse({...course, schedule: course.schedule.filter((_, i) => i !== index)})} className="p-2 text-[#a1acb8] hover:text-[#ff3e1d] hover:bg-[#ffe2e3] rounded-md transition-all opacity-0 group-hover/item:opacity-100">
                          <X size={16} />
                       </button>
                     )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#d9dee3] flex gap-3 justify-end shrink-0 bg-slate-50/50">
            {onDelete && (
                <button type="button" onClick={onDelete} className="w-10 h-10 rounded-md border border-transparent text-[#ff3e1d] flex items-center justify-center hover:bg-[#ffe2e3] transition-colors">
                  <Trash2 size={20} />
                </button>
            )}
            <div className="flex-1"></div>
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]">ยกเลิก</button>
            <button type="submit" className="px-6 py-2 rounded-md font-medium text-[14px] bg-[#696cff] text-white hover:bg-[#5f61e6] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(105,108,255,0.4)] transition-all flex items-center gap-2"><Save size={16} /> บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  );
};
