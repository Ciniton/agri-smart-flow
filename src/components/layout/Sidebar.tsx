
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Droplets, 
  Map, 
  Layers, 
  AlertCircle, 
  Settings, 
  BarChart, 
  HelpCircle,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Irrigation Control', path: '/irrigation', icon: <Droplets size={20} /> },
    { name: 'Field Mapping', path: '/mapping', icon: <Map size={20} /> },
    { name: 'Sensors & Devices', path: '/devices', icon: <Layers size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <AlertCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Help', path: '/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 z-40 h-14 w-full bg-primary flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-white"
          >
            <Menu size={24} />
          </Button>
          <h1 className="ml-3 text-white font-semibold text-lg">AgriSmartFlow</h1>
        </div>
      </div>
      
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-200",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-primary text-white w-64 flex flex-col z-40 transition-transform duration-300 ease-in-out",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
          isMobile ? "pt-14" : ""
        )}
      >
        <div className="p-4 border-b border-primary-600 hidden lg:flex items-center justify-center">
          <h1 className="text-xl font-bold">AgriSmartFlow</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary-700 text-white"
                      : "text-white/80 hover:bg-primary-700 hover:text-white"
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-600">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
              <span className="font-medium text-sm">JD</span>
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-white/70">Farm Manager</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
