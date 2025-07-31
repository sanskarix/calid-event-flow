
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface HeaderMeta {
  title: string;
  description?: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  onTitleChange?: (title: string) => void;
}

export const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [headerMeta, setHeaderMeta] = useState<HeaderMeta>({
    title: '',
    description: '',
  });  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-1 ml-64">
          <Header metaData={headerMeta}/>          
          <main className="relative z-0">
            <Outlet context={{ setHeaderMeta }}/>
          </main>
        </div>
      </div>
    </div>
  );
};
