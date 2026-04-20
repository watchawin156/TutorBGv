import React, { useState } from 'react';
import { X, User, Mail, Shield, Globe, Camera, CheckCircle } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!show) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-sky-50/30 to-white shrink-0">
          <div>
            <h3 className={`${FONT.H3} text-slate-900`}>โปรไฟล์ผู้ดูแลระบบ</h3>
            <p className={`text-slate-900 ${FONT.LABEL} mt-1`}>จัดการข้อมูลส่วนตัวและการเข้าถึงระบบ</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-900 hover:text-slate-900 rounded-2xl transition-all hover:rotate-90"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          {showSuccess && (
            <div className={`flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl ${FONT.LABEL_BLACK} animate-in fade-in zoom-in duration-300`}>
              <CheckCircle size={20} /> บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว
            </div>
          )}

          <div className="flex items-center gap-8 mb-4">
            <div className="relative group">
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white ${FONT.H1} shadow-xl shadow-sky-100 ring-4 ring-white`}>
                แอดมิน
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg text-slate-900 hover:text-sky-600 hover:scale-110 transition-all">
                <Camera size={20} />
              </button>
            </div>
            <div>
              <h4 className={`${FONT.H4} text-slate-900 leading-tight`}>แอดมิน ทิวเตอร์แอพ</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sky-600 ${FONT.LABEL} bg-sky-50 px-3 py-1 rounded-lg`}>ผู้ดูแลระบบหลัก</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className={`text-emerald-500 ${FONT.LABEL}`}>กำลังใช้งาน</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-3">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                <User size={14} className="text-sky-500" /> ชื่อผู้ใช้งาน
              </label>
              <input 
                type="text" 
                defaultValue="แอดมิน ทิวเตอร์แอพ" 
                className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 ${FONT.BODY_MD} text-slate-900 outline-none focus:bg-white focus:border-sky-500 focus:ring-8 focus:ring-sky-100 transition-all`} 
              />
            </div>
            <div className="space-y-3">
              <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                <Mail size={14} className="text-sky-500" /> อีเมล
              </label>
              <input 
                type="email" 
                defaultValue="admin@tutorapp.com" 
                className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 ${FONT.BODY_MD} text-slate-900 outline-none focus:bg-white focus:border-sky-500 focus:ring-8 focus:ring-sky-100 transition-all`} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
             <label className={`${FONT.LABEL_BLACK} text-slate-900 uppercase ml-1 flex items-center gap-2`}>
                <Globe size={14} className="text-sky-500" /> ภาษาที่ใช้งาน
             </label>
             <div className="flex items-center bg-slate-50 rounded-3xl p-2 w-max gap-2 border border-slate-100">
                <button className={`px-8 py-3 bg-white shadow-md rounded-2xl ${FONT.LABEL_BLACK} text-slate-900 flex items-center gap-3`}>
                   <Globe size={20} className="text-sky-500" />
                   ภาษาไทย
                </button>
                <button className={`px-8 py-3 rounded-2xl ${FONT.LABEL_BLACK} text-slate-900 hover:text-slate-900 transition-all`}>
                   ภาษาอังกฤษ
                </button>
             </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-t border-slate-50 flex items-center gap-4 bg-slate-50/20 shrink-0">
          <button 
            disabled={isSaving}
            onClick={onClose}
            className={`flex-1 bg-white hover:bg-slate-50 text-slate-900 ${FONT.LABEL} py-4 rounded-[20px] transition-all border border-slate-200`}
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-[2] bg-gradient-to-br from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white ${FONT.LABEL_BLACK} py-4 rounded-[20px] transition-all shadow-xl shadow-sky-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </span>
            ) : 'บันทึกข้อมูลส่วนตัว'}
          </button>
        </div>
      </div>
    </div>
  );
};
