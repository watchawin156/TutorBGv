import { LucideIcon } from 'lucide-react';
import { FONT } from '../functions/fontsize';

interface NavItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarHovered: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ id, icon: Icon, label, activeTab, setActiveTab, isSidebarHovered }) => {
  const isActive = activeTab === id;
  
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center transition-all duration-300 rounded-[20px] ${
        isSidebarHovered ? 'px-5 py-4 gap-4' : 'p-4 justify-center'
      } ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-900 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <Icon size={22} className={`${isActive ? 'stroke-[3px]' : 'stroke-[2px]'} shrink-0`} />
      <span className={`${FONT.BODY_SM} whitespace-nowrap transition-all duration-300 ${
        isSidebarHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 absolute'
      }`}>
         {label}
      </span>
      {isActive && isSidebarHovered && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6]" />
      )}
    </button>
  );
};

