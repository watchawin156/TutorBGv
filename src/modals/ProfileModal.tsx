import React, { useState } from 'react';
import { X, User, Mail, Shield, Globe, Camera, CheckCircle } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
  userProfile?: { name: string, picture: string, role: string } | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose, userProfile }) => {
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#d9dee3] bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#e6e6ff] text-[#696cff] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#566a7f] leading-none">โปรไฟล์ผู้ดูแลระบบ</h3>
              <p className="text-[13px] text-[#a1acb8] mt-1">จัดการข้อมูลส่วนตัวและการเข้าถึงระบบ</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a1acb8] hover:text-[#566a7f] transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
          {showSuccess && (
            <div className="flex items-center gap-3 bg-[#e8fadf] text-[#71dd37] px-4 py-3 rounded-md text-[14px] font-semibold shadow-sm animate-in fade-in duration-300">
              <CheckCircle size={18} /> บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="relative group">
              {userProfile?.picture ? (
                <img 
                  src={userProfile.picture} 
                  alt={userProfile.name} 
                  className="w-24 h-24 rounded-lg object-cover shadow-sm border border-[#d9dee3]"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#e6e6ff] flex items-center justify-center text-[#696cff] text-[32px] font-bold shadow-sm border border-[#e6e6ff]">
                  {userProfile?.name?.charAt(0) || 'แอดมิน'}
                </div>
              )}
              <button className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-[#d9dee3] text-[#a1acb8] hover:text-[#696cff] transition-all">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h4 className="text-[18px] font-bold text-[#566a7f] leading-tight mb-2">{userProfile?.name || 'แอดมิน ทิวเตอร์แอพ'}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#696cff] bg-[#e6e6ff] px-2 py-1 rounded-[4px]">{userProfile?.role || 'ผู้ดูแลระบบหลัก'}</span>
                <span className="w-1.5 h-1.5 bg-[#71dd37] rounded-full animate-pulse" />
                <span className="text-[12px] text-[#71dd37] font-semibold">กำลังใช้งาน</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#566a7f] ml-1 flex items-center gap-2">
                <User size={14} className="text-[#a1acb8]" /> ชื่อผู้ใช้งาน
              </label>
              <input 
                type="text" 
                defaultValue={userProfile?.name || "แอดมิน ทิวเตอร์แอพ"} 
                className="w-full bg-white border border-[#d9dee3] rounded-md py-2.5 px-4 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#566a7f] ml-1 flex items-center gap-2">
                <Mail size={14} className="text-[#a1acb8]" /> อีเมล
              </label>
              <input 
                type="email" 
                defaultValue="admin@tutorapp.com" 
                className="w-full bg-white border border-[#d9dee3] rounded-md py-2.5 px-4 text-[15px] font-medium text-[#566a7f] outline-none hover:border-[#b4bdc6] focus:border-[#696cff] focus:ring-2 focus:ring-[#696cff]/20 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
             <label className="text-[13px] font-medium text-[#566a7f] ml-1 flex items-center gap-2">
                <Globe size={14} className="text-[#a1acb8]" /> ภาษาที่ใช้งาน
             </label>
             <div className="flex items-center bg-[#f8f9fa] rounded-md p-1 w-max gap-1 border border-[#d9dee3]">
                <button className="px-6 py-2 bg-white shadow-sm rounded text-[13px] font-medium text-[#696cff] flex items-center gap-2 border border-[#d9dee3]">
                   <Globe size={16} />
                   ภาษาไทย
                </button>
                <button className="px-6 py-2 rounded text-[13px] font-medium text-[#a1acb8] hover:text-[#566a7f] transition-all">
                   ภาษาอังกฤษ
                </button>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#d9dee3] flex items-center gap-3 bg-slate-50/50 shrink-0 justify-end">
          <button 
            disabled={isSaving}
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-[#d9dee3] text-[#566a7f] font-medium hover:bg-[#f8f9fa] transition-colors text-[14px]"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-md bg-[#696cff] hover:bg-[#5f61e6] text-white font-medium transition-all text-[14px] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(105,108,255,0.4)] disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </span>
            ) : 'บันทึกข้อมูลส่วนตัว'}
          </button>
        </div>
      </div>
    </div>
  );
};
