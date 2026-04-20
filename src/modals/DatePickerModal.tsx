import React, { useEffect, useState } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface DatePickerModalProps {
  show: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelect: (date: string) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({ show, onClose, selectedDate, onSelect }) => {
  const toSafeDate = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };
  const [viewDate, setViewDate] = useState(() => toSafeDate(selectedDate || new Date().toISOString()));

  useEffect(() => {
    if (!show) return;
    setViewDate(toSafeDate(selectedDate || new Date().toISOString()));
  }, [show, selectedDate]);

  if (!show) return null;

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const d = today.getDate().toString().padStart(2, '0');
    onSelect(`${y}-${m}-${d}`);
    setViewDate(today);
  };

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate blank days for padding
  const blanks = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return y === currentYear && m === (currentMonth + 1) && d === day;
  };

  const handleDateSelect = (day: number) => {
    const y = currentYear;
    const m = (currentMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    onSelect(`${y}-${m}-${d}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[150] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-7 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-sky-50/30 to-white shrink-0">
          <div>
            <h3 className={`${FONT.H5} font-extrabold text-slate-900 leading-none`}>เลือกวันที่เช็คชื่อ</h3>
            <p className={`text-slate-900 ${FONT.LABEL} mt-1.5 uppercase`}>ปฏิทินเลือกวัน</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-900 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all hover:rotate-90"><X size={20} /></button>
        </div>

        <div className="p-6 md:p-8 space-y-6 flex-1 text-slate-900">
          {/* Month Selector */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><ChevronLeft size={20} /></button>
            <div className={`${FONT.BODY_LG} font-black text-slate-900`}>
              {months[currentMonth]} {currentYear + 543}
            </div>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><ChevronRight size={20} /></button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {days.map(day => (
              <div key={day} className={`text-center py-2 ${FONT.LABEL_BLACK} text-slate-900 uppercase`}>{day}</div>
            ))}
            
            {/* Blank spaces */}
            {blanks.map((_, i) => (
               <div key={`blank-${i}`} className="py-2.5" />
            ))}

            {/* Actual days */}
            {daysArray.map(day => {
               const selected = isSelected(day);
               const today = isToday(day);
               return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      py-2.5 rounded-xl ${FONT.BODY_MD} font-bold transition-all relative group
                      ${selected ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' : 'hover:bg-sky-50 text-slate-700'}
                      ${today && !selected ? 'text-sky-600' : ''}
                    `}
                  >
                    {day}
                    {today && !selected && (
                       <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-600 rounded-full" />
                    )}
                  </button>
               );
            })}
          </div>

          <div className="pt-2">
             <button 
               onClick={handleToday}
               className={`w-full bg-slate-50 hover:bg-slate-100 text-slate-800 ${FONT.BODY_MD} font-black py-4 rounded-2xl transition-all border border-slate-100`}
             >
                เลือกวันนี้
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
