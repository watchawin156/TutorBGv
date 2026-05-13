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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-none md:rounded-xl w-full h-full md:h-auto max-w-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300 border-0 md:border border-[#d9dee3] flex flex-col max-h-[100dvh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#d9dee3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[#566a7f]">
            <CalendarIcon size={20} className="text-[#696cff]" />
            <h3 className="text-[18px] font-semibold leading-none">เลือกวันที่เช็คชื่อ</h3>
          </div>
          <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-all"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 flex-1 text-slate-900 overflow-y-auto">
          {/* Month Selector */}
          <div className="flex items-center justify-between">
            <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-[#f8f9fa] rounded-md transition-all text-[#a1acb8] hover:text-[#566a7f] border border-transparent hover:border-[#d9dee3]"><ChevronLeft size={20} /></button>
            <div className="text-[15px] font-semibold text-[#566a7f]">
              {months[currentMonth]} {currentYear + 543}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-[#f8f9fa] rounded-md transition-all text-[#a1acb8] hover:text-[#566a7f] border border-transparent hover:border-[#d9dee3]"><ChevronRight size={20} /></button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {/* Weekday headers */}
            {days.map(day => (
              <div key={day} className="text-center py-2 text-[12px] font-bold text-[#566a7f] uppercase">{day}</div>
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
                  <div key={day} className="flex justify-center">
                    <button
                      onClick={() => handleDateSelect(day)}
                      className={`
                        w-9 h-9 rounded-full text-[14px] font-medium transition-all flex items-center justify-center relative
                        ${selected ? 'bg-[#696cff] text-white shadow-[0_4px_12px_rgba(105,108,255,0.4)]' : 'hover:bg-[#f8f9fa] text-[#566a7f]'}
                        ${today && !selected ? 'text-[#696cff] font-bold' : ''}
                      `}
                    >
                      {day}
                    </button>
                  </div>
               );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#d9dee3] bg-slate-50/50 shrink-0">
           <button 
             onClick={handleToday}
             className="w-full bg-white hover:bg-[#f8f9fa] text-[#566a7f] text-[15px] font-medium py-2.5 rounded-md transition-all border border-[#d9dee3]"
           >
              เลือกวันนี้
           </button>
        </div>
      </div>
    </div>
  );
};
