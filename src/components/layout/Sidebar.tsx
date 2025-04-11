
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Waves,
  Map,
  Smartphone, // Replacing Devices2
  BarChart, // Replacing FileBarGraph
  Bell,
  UserRound
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Waves, label: 'Irrigation', path: '/irrigation' },
    { icon: Map, label: 'Mapping', path: '/mapping' },
    { icon: Smartphone, label: 'Devices', path: '/devices' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: UserRound, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Home className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64">
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            {navItems.map((item) => (
              <Link to={item.path} key={item.label} onClick={closeSidebar}>
                <div className={cn(
                  "flex items-center space-x-2 rounded-md p-2 hover:bg-secondary",
                  location.pathname === item.path ? "bg-secondary" : ""
                )}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
