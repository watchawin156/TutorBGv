import React from 'react';
import { X, BookOpen, MapPin, DollarSign, Calendar, Plus, Clock, Hash, Save } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className={`${FONT.H5} lg:${FONT.H4} text-slate-900`}>แก้ไขข้อมูลรายวิชา</h3>
            <p className={`text-slate-900 ${FONT.LABEL}`}>ปรับปรุงชื่อวิชา ห้องเรียน และวันเรียน</p>
          </div>
          <button onClick={onClose} type="button" className="p-2.5 hover:bg-slate-50 text-slate-900 hover:text-slate-900 rounded-xl transition-all"><X size={22} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                   <BookOpen size={14} className="text-sky-500" /> ชื่อวิชาเรียน
                </label>
                <input required type="text" value={course.name} onChange={e => setCourse({...course, name: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="เช่น คณิตศาสตร์ ม.4..." />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                      <MapPin size={14} className="text-sky-500" /> ห้องเรียน
                   </label>
                   <input required type="text" value={course.room} onChange={e => setCourse({...course, room: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="ห้อง..." />
                </div>
                <div className="space-y-2">
                   <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                      <Hash size={14} className="text-sky-500" /> จำนวนครั้งที่เรียน (คอร์ส)
                   </label>
                   <input required type="number" value={course.sessions} onChange={e => setCourse({...course, sessions: parseInt(e.target.value) || 0})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="เช่น 10..." />
                </div>
             </div>
             
             <div className="space-y-2">
                <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                   <DollarSign size={14} className="text-sky-500" /> ราคา (บาท)
                </label>
                <input required type="number" value={course.price} onChange={e => setCourse({...course, price: parseInt(e.target.value) || 0})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="ราคา..." />
             </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
               <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                  <Calendar size={14} className="text-sky-500" /> ตารางเรียนรายสัปดาห์
               </label>
               <button type="button" onClick={() => setCourse({...course, schedule: [...course.schedule, {day: 'จันทร์', time: ''}]})} className={`${FONT.LABEL_SM_BLACK} text-sky-600 flex items-center gap-1.5 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl transition-colors border border-sky-100`}>
                  <Plus size={14} className="stroke-[3px]" /> เพิ่มวันเรียน
               </button>
            </div>
            
            <div className="space-y-3">
              {course.schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-[18px] border border-slate-100/50 group/item">
                   <select 
                     value={item.day}
                     onChange={(e) => {
                        const newSchedule = [...course.schedule];
                        newSchedule[index].day = e.target.value;
                        setCourse({...course, schedule: newSchedule});
                     }}
                     className={`w-[100px] bg-white border border-slate-200 rounded-xl px-3 py-2 ${FONT.LABEL} text-slate-900 outline-none focus:border-sky-500 transition-all cursor-pointer shadow-sm`}
                   >
                     {days.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                   <div className="flex-1 relative">
                      <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
                      <input 
                        type="text" 
                        placeholder="08.00-10.00"
                        value={item.time}
                        onChange={(e) => {
                           const newSchedule = [...course.schedule];
                           newSchedule[index].time = e.target.value;
                           setCourse({...course, schedule: newSchedule});
                        }}
                        className={`w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 ${FONT.LABEL} text-slate-900 outline-none focus:border-sky-500 transition-all shadow-sm`}
                      />
                   </div>
                   {course.schedule.length > 1 && (
                     <button type="button" onClick={() => setCourse({...course, schedule: course.schedule.filter((_, i) => i !== index)})} className="p-2 text-slate-900 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100">
                        <X size={18} />
                     </button>
                   )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 shrink-0 sticky bottom-0 bg-white">
            {onDelete && (
              <button type="button" onClick={onDelete} className={`flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 ${FONT.LABEL} py-4 rounded-[20px] transition-all`}>
                ลบวิชานี้
              </button>
            )}
            <button type="button" onClick={onClose} className={`flex-1 bg-white hover:bg-slate-50 text-slate-900 ${FONT.LABEL} py-4 rounded-[20px] transition-all border border-slate-100`}>ยกเลิก</button>
            <button type="submit" className={`flex-[2] gradient-blue text-white ${FONT.LABEL_BLACK} py-4 rounded-[20px] transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 hover:scale-[1.02]`}><Save size={18} /> บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  );
};
