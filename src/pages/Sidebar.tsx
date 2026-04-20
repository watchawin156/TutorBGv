import React from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  PieChart, 
  LayoutGrid,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { NavItem } from './NavItem';
import { FONT } from '../functions/fontsize';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarHovered: boolean;
  setIsSidebarHovered: (hovered: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarHovered, 
  setIsSidebarHovered
}) => {
  const [isPinned, setIsPinned] = React.useState(false);

  const menuItems = [
    { id: 'timetable', label: 'ตารางเรียน', icon: Calendar },
    { id: 'students', label: 'นักเรียน', icon: Users },
    { id: 'courses', label: 'คอร์สเรียน', icon: BookOpen },
    { id: 'finance', label: 'การเงิน', icon: PieChart },
  ];

  return (
    <aside 
      onMouseEnter={() => !isPinned && setIsSidebarHovered(true)}
      onMouseLeave={() => !isPinned && setIsSidebarHovered(false)}
      className={`hidden lg:flex flex-col bg-white transition-all duration-500 ease-in-out relative z-[100] group/sidebar shrink-0 border-r border-slate-100 ${
        isSidebarHovered || isPinned ? 'w-64' : 'w-[80px]'
      }`}
    >
      <button 
        onClick={() => {
          const next = !isPinned;
          setIsPinned(next);
          setIsSidebarHovered(next);
        }}
        className={`absolute top-10 -right-3 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg z-[110] transition-all duration-300 hover:scale-110 active:scale-90 ${
          isPinned || isSidebarHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}
      >
        {isPinned ? <ChevronLeft size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center transition-all duration-500 ${
        isSidebarHovered || isPinned ? 'px-8 py-8 gap-4' : 'p-4 justify-center py-8'
      }`}>
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200" 
          style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' }}
        >
           <LayoutGrid size={22} className="stroke-[2.5px]" />
        </div>
        <span className={`${FONT.H5} text-slate-800 whitespace-nowrap transition-all duration-300 ${
          isSidebarHovered || isPinned ? 'opacity-100' : 'opacity-0 w-0 absolute'
        }`}>
          Tutor<span className="text-blue-500">M</span>
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
    </aside>
  );
};
