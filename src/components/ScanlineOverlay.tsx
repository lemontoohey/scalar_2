'use client';
import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden">
      <motion.div
        className="w-full h-[2px] bg-white/[0.03] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        initial={{ top: '0%' } as React.CSSProperties}
        animate={{ top: '110%' } as React.CSSProperties}
        transition={{
          duration: 4.6,
          delay: 0,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0
        }}
        style={{ position: 'absolute', left: 0 }}
      />
    </div>
  )
}
