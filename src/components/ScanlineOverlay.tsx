'use client';
import { motion } from 'framer-motion'

const initialStyle = { top: '0%' } as const
const animateStyle = { top: '110%' } as const

export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden">
      <motion.div
        className="w-full h-[2px] bg-white/[0.03] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        initial={initialStyle}
        animate={animateStyle}
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
