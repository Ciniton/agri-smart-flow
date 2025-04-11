
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="fixed z-10">
        <Sidebar />
      </div>
      
      <main className={`transition-all duration-300 pt-4 pb-8 px-4 w-full ${isMobile ? 'mt-14 ml-0' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
