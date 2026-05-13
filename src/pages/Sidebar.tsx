import React from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  PieChart, 
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Wallet,
  LogOut
} from 'lucide-react';
import { NavItem } from './NavItem';
import { FONT } from '../functions/fontsize';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarHovered: boolean;
  setIsSidebarHovered: (hovered: boolean) => void;
  userProfile?: { name: string, picture: string, role: string } | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarHovered, 
  setIsSidebarHovered,
  userProfile,
  onLogout
}) => {
  const [isPinned, setIsPinned] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutGrid },
    { id: 'timetable', label: 'ตารางเรียน', icon: Calendar },
    { id: 'students', label: 'นักเรียน', icon: Users },
    { id: 'courses', label: 'คอร์สเรียน', icon: BookOpen },
    { id: 'finance', label: 'การเงิน', icon: PieChart },
  ];

  return (
    <aside 
      onMouseEnter={() => !isPinned && setIsSidebarHovered(true)}
      onMouseLeave={() => !isPinned && setIsSidebarHovered(false)}
      className={`hidden lg:flex flex-col bg-white transition-all duration-500 ease-in-out relative z-[100] group/sidebar shrink-0 border-r border-slate-100 shadow-sm ${
        isSidebarHovered || isPinned ? 'w-64' : 'w-[80px]'
      }`}
    >
      <button 
        onClick={() => {
          const next = !isPinned;
          setIsPinned(next);
          setIsSidebarHovered(next);
        }}
        className={`absolute top-10 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg z-[110] transition-all duration-300 hover:scale-110 active:scale-90 ${
          isPinned || isSidebarHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}
      >
        {isPinned ? <ChevronLeft size={14} className="text-slate-600" /> : <ChevronRight size={14} className="text-slate-600" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center transition-all duration-500 ${
        isSidebarHovered || isPinned ? 'px-8 py-8 gap-4' : 'p-4 justify-center py-8'
      }`}>
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20" 
          style={{ background: 'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)' }}
        >
           <LayoutGrid size={22} className="stroke-[2.5px]" />
        </div>
        <span className={`${FONT.H5} text-slate-800 font-extrabold whitespace-nowrap transition-all duration-300 tracking-tight ${
            isSidebarHovered || isPinned ? 'opacity-100' : 'opacity-0 w-0 absolute'
        }`}>
          Tutor<span className="text-indigo-600">M</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4">
        {menuItems.map(item => (
          <NavItem
            key={item.id}
            {...item}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarHovered={isSidebarHovered || isPinned}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className={`mt-auto transition-all duration-500 border-t border-slate-100 ${
        isSidebarHovered || isPinned ? 'p-6' : 'p-4'
      }`}>
        <div className={`flex items-center gap-3 ${
            isSidebarHovered || isPinned ? '' : 'justify-center'
        }`}>
            {userProfile?.picture ? (
              <img 
                src={userProfile.picture} 
                alt={userProfile.name} 
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold shadow-sm">
                  {userProfile?.name?.charAt(0) || 'A'}
              </div>
            )}
            
            {(isSidebarHovered || isPinned) && (
                <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                    <p className={`${FONT.LABEL_BLACK} text-slate-800 truncate`}>{userProfile?.name || 'Admin User'}</p>
                    <p className={`${FONT.NANO_BLACK} text-slate-500 truncate uppercase tracking-wider`}>{userProfile?.role || 'Administrator'}</p>
                </div>
            )}
            
            {(isSidebarHovered || isPinned) && onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                title="ออกจากระบบ"
              >
                <LogOut size={18} />
              </button>
            )}
        </div>
      </div>
    </aside>
  );
};
