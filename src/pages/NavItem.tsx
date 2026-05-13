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

export const NavItem: React.FC<NavItemProps> = ({ 
  id, 
  icon: Icon, 
  label, 
  activeTab, 
  setActiveTab, 
  isSidebarHovered
}) => {
  const isActive = activeTab === id;
  
  const activeStyles = 'bg-indigo-50 text-indigo-600 shadow-sm font-semibold';
    
  const inactiveStyles = 'text-slate-500 hover:bg-slate-50 hover:text-slate-800';

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center transition-all duration-300 rounded-xl ${
        isSidebarHovered ? 'px-4 py-3 gap-3' : 'p-3 mx-1 justify-center'
      } ${
        isActive ? activeStyles : inactiveStyles
      }`}
    >
      <Icon size={20} className={`${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} shrink-0`} />
      <span className={`${FONT.BODY_SM} ${isActive ? 'font-bold' : 'font-medium'} whitespace-nowrap transition-all duration-300 ${
        isSidebarHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 absolute'
      }`}>
         {label}
      </span>
      {isActive && isSidebarHovered && (
        <div className="ml-auto w-[6px] h-[6px] rounded-full bg-indigo-500 shadow-sm" />
      )}
    </button>
  );
};

