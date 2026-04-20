import React from 'react';
import { X, BookOpen, MapPin, DollarSign, Calendar, Plus, Clock, Hash } from 'lucide-react';
import { Course } from '../functions/types';
import { FONT } from '../functions/fontsize';

interface AddCourseModalProps {
  show: boolean;
  onClose: () => void;
  newCourse: { name: string, room: string, price: string, sessions: string, schedule: { day: string; time: string }[] };
  setNewCourse: (course: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ show, onClose, newCourse, setNewCourse, onSubmit }) => {
  if (!show) return null;
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className={`${FONT.H5} lg:${FONT.H4} text-slate-900`}>เพิ่มรายวิชาใหม่</h3>
            <p className={`text-slate-900 ${FONT.LABEL}`}>ตั้งค่าชื่อวิชา ห้องเรียน และวันเรียน</p>
          </div>
          <button onClick={onClose} type="button" className="p-2.5 hover:bg-slate-50 text-slate-900 hover:text-slate-900 rounded-xl transition-all"><X size={22} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                   <BookOpen size={14} className="text-sky-500" /> ชื่อวิชาเรียน
                </label>
                <input required type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="เช่น คณิตศาสตร์ ม.4..." />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                      <MapPin size={14} className="text-sky-500" /> ห้องเรียน
                   </label>
                   <input required type="text" value={newCourse.room} onChange={e => setNewCourse({...newCourse, room: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="ห้อง..." />
                </div>
                <div className="space-y-2">
                   <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                      <Hash size={14} className="text-sky-500" /> จำนวนครั้งที่เรียน (คอร์ส)
                   </label>
                   <input required type="number" value={newCourse.sessions} onChange={e => setNewCourse({...newCourse, sessions: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="เช่น 10..." />
                </div>
             </div>
             
             <div className="space-y-2">
                <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                   <DollarSign size={14} className="text-sky-500" /> ราคา (บาท)
                </label>
                <input required type="number" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} className={`w-full bg-slate-50 border border-transparent rounded-[18px] px-6 py-3.5 ${FONT.BODY_SM} text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all shadow-sm`} placeholder="ราคา..." />
             </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
               <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                  <Calendar size={14} className="text-sky-500" /> ตารางเรียนรายสัปดาห์
               </label>
               <button type="button" onClick={() => setNewCourse({...newCourse, schedule: [...newCourse.schedule, {day: 'จันทร์', time: ''}]})} className={`${FONT.LABEL_SM_BLACK} text-sky-600 flex items-center gap-1.5 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl transition-colors border border-sky-100`}>
                  <Plus size={14} className="stroke-[3px]" /> เพิ่มวันเรียน
               </button>
            </div>
            
            <div className="space-y-3">
              {newCourse.schedule.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-[18px] border border-slate-100/50 group/item">
                   <select 
                     value={item.day}
                     onChange={(e) => {
                        const newSchedule = [...newCourse.schedule];
                        newSchedule[index].day = e.target.value;
                        setNewCourse({...newCourse, schedule: newSchedule});
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
                           const newSchedule = [...newCourse.schedule];
                           newSchedule[index].time = e.target.value;
                           setNewCourse({...newCourse, schedule: newSchedule});
                        }}
                        className={`w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 ${FONT.LABEL} text-slate-900 outline-none focus:border-sky-500 transition-all shadow-sm`}
                      />
                   </div>
                   {newCourse.schedule.length > 1 && (
                     <button type="button" onClick={() => setNewCourse({...newCourse, schedule: newCourse.schedule.filter((_: any, i: number) => i !== index)})} className="p-2 text-slate-900 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100">
                        <X size={18} />
                     </button>
                   )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 shrink-0 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className={`flex-1 bg-white hover:bg-slate-50 text-slate-900 ${FONT.LABEL} py-4 rounded-[20px] transition-all border border-slate-100`}>ยกเลิก</button>
            <button type="submit" className={`flex-[2] gradient-blue text-white ${FONT.LABEL_BLACK} py-4 rounded-[20px] transition-all shadow-xl shadow-blue-200 active:scale-95 hover:scale-[1.02]`}>บันทึกรายวิชา</button>
          </div>
        </form>
      </div>
    </div>
  );
};
