'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'; 
import { useContext, useRef } from 'react';

// Specialized transition wrapper that triggers the liquid glass effect
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Freeze the router context to keep the old page mounted during exit animation
  // (Standard Next.js + Framer Motion pattern)
  
  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: 'url(#liquid-glass)' }}
        animate={{ 
          opacity: 1, 
          filter: 'none',
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }}
        exit={{ 
          opacity: 0, 
          filter: 'url(#liquid-glass)',
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }}
        className="w-full h-full"
      >
         {children}
      </motion.div>
    </AnimatePresence>
  );
}
