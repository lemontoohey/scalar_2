'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type ColorContextType = {
  activeHex: string | null;
  setGlobalColor: (hex: string | null) => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [activeHex, setActiveHex] = useState<string | null>(null);

  // setGlobalColor wraps the setter to allow for potential future "smoothing" logic
  const setGlobalColor = (hex: string | null) => {
    setActiveHex(hex);
  };

  return (
    <ColorContext.Provider value={{ activeHex, setGlobalColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
}
