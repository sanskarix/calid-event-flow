
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { Header } from '..//components/Header';

export interface HeaderMeta {
  title: string;
  description?: string;
}

export const Settings = () => {
  const [headerMeta, setHeaderMeta] = useState<HeaderMeta>({
    title: '',
    description: '',
  });  
  const location = useLocation();
  const navigate = useNavigate();
  const isRootSettings = location.pathname === '/settings';

  useEffect(() => {
    if (isRootSettings) {
      navigate('/settings/profile', { replace: true });
    }
  }, [isRootSettings, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <SettingsSidebar />
      <div className="flex-1 ml-64">
       <Header metaData={headerMeta}/>          
        <main className="relative z-0">
          <Outlet context={{ setHeaderMeta }}/>
        </main>
      </div>
    </div>
  );
};
