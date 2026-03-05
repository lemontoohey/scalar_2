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
        className="absolute left-0 w-full h-[4px] bg-red-500 opacity-30 blur-[1px]"
        initial={{ top: '-1%' } as any}
        animate={{ top: '109%' } as any}
        transition={transition}
      />
      {/* Green Chromatic Center */}
      <motion.div
        className="absolute left-0 w-full h-[2px] bg-green-500 opacity-40 blur-[0.5px]"
        initial={{ top: '-1.2%' } as any}
        animate={{ top: '108.8%' } as any}
        transition={transition}
      />
      {/* White Core (The Data) */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-[#ffffff] opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        initial={{ top: '-1.5%' } as any}
        animate={{ top: '108.5%' } as any}
        transition={transition}
      />
      {/* Blue Trailing Edge (The "Cold" Trail) */}
      <motion.div
        className="absolute left-0 w-full h-[6px] bg-blue-600 opacity-20 blur-[3px]"
        initial={{ top: '-2%' } as any}
        animate={{ top: '108%' } as any}
        transition={transition}
      />
    </div>
  )
}
