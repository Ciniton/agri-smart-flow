
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
  Smartphone,
  BarChart,
  Bell,
  UserRound,
  Menu,
  Droplets
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/', description: 'Back to home' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', description: 'System overview' },
    { icon: Waves, label: 'Irrigation', path: '/irrigation', description: 'Manage irrigation schedules' },
    { icon: Map, label: 'Mapping', path: '/mapping', description: 'Field and zone layouts' },
    { icon: Smartphone, label: 'Devices', path: '/devices', description: 'Manage connected devices' },
    { icon: BarChart, label: 'Reports', path: '/reports', description: 'Data analysis and reporting' },
    { icon: Bell, label: 'Alerts', path: '/alerts', description: 'System notifications' },
    { icon: UserRound, label: 'Profile', path: '/profile', description: 'User account settings' },
    { icon: Settings, label: 'Settings', path: '/settings', description: 'System configuration' },
    { icon: HelpCircle, label: 'Help', path: '/help', description: 'Get support' },
  ];

  if (isMobile) {
    return (
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-2 left-2 z-20" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-primary/5 to-background border-r border-primary/10">
          <ScrollArea className="h-full py-6">
            <div className="flex justify-center mb-6 pt-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">IrriTech Pro</h1>
              </div>
            </div>
            <div className="px-3 py-2">
              {navItems.map((item) => (
                <Link to={item.path} key={item.label} onClick={closeSidebar}>
                  <div 
                    className={cn(
                      "group flex items-center space-x-2 rounded-md p-2 transition-all duration-200",
                      location.pathname === item.path 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      location.pathname === item.path 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <div>
                      <span className="text-sm font-medium">{item.label}</span>
                      {location.pathname === item.path && (
                        <p className="text-xs opacity-80">{item.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="px-4 py-2">
              <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                <p className="text-xs text-muted-foreground text-center">
                  IrriTech Pro v1.0<br />
                  <span className="text-primary text-xs">Connected to 12 devices</span>
                </p>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-primary/5 to-background border-r border-primary/10">
      <ScrollArea className="h-full py-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">IrriTech Pro</h1>
          </div>
        </div>
        <div className="px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <Link to={item.path} key={item.label}>
              <div 
                className={cn(
                  "group flex items-center space-x-2 rounded-md p-2 mb-1 transition-all duration-200",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  location.pathname === item.path 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                <div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {location.pathname === item.path && (
                    <p className="text-xs opacity-80">{item.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="px-4 py-2">
          <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              IrriTech Pro v1.0<br />
              <span className="text-primary text-xs">Connected to 12 devices</span>
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
