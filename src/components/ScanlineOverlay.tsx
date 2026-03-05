'use client';
import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  const transition = {
    duration: 4.6,
    delay: 0,
    ease: 'linear',
    repeat: Infinity,
    repeatDelay: 0
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden mix-blend-screen">
      {/* Red Leading Edge (The "Hot" Edge) */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-red-500 opacity-20 blur-[0.5px]"
        initial={{ top: '-1%' } as any}
        animate={{ 
          top: '109%',
          y: [0, 2, -2, 0], // Subtle vertical de-cohesion
        } as any}
        transition={{
          ...transition,
          y: { duration: 0.2, repeat: Infinity, repeatDelay: 2 }
        }}
      />
      {/* Green Chromatic Center */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-green-500 opacity-20 blur-[0.2px]"
        initial={{ top: '-1.2%' } as any}
        animate={{ top: '108.8%' } as any}
        transition={transition}
      />
      {/* White Core (The Data) */}
      <motion.div
        className="absolute left-0 w-full h-[0.5px] bg-[#ffffff] opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        initial={{ top: '-1.5%' } as any}
        animate={{ top: '108.5%' } as any}
        transition={transition}
      />
      {/* Blue Trailing Edge (The "Cold" Trail) */}
      <motion.div
        className="absolute left-0 w-full h-[2px] bg-blue-600 opacity-10 blur-[1px]"
        initial={{ top: '-2%' } as any}
        animate={{ 
          top: '108%',
          y: [0, -3, 3, 0], // Subtle vertical de-cohesion
        } as any}
        transition={{
          ...transition,
          y: { duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }
        }}
      />
    </div>
  )
}
