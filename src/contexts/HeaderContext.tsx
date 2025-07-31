// src/contexts/HeaderContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type HeaderMeta = {
  title: string;
  description?: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
};

type HeaderContextType = {
  headerMeta: HeaderMeta;
  setHeaderMeta: (meta: HeaderMeta) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerMeta, setHeaderMeta] = useState<HeaderMeta>({ title: '', description: '' });

  return (
    <HeaderContext.Provider value={{ headerMeta, setHeaderMeta }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider');
  return ctx;
};
