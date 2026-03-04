'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'url(#liquid-glass)' }}
      animate={{ opacity: 1, filter: 'none', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, filter: 'url(#liquid-glass)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
