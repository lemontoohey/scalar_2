import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <motion.div
        className="w-full h-[2px] bg-white/[0.03] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        initial={{ top: '0%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 12,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0
        }}
        style={{ position: 'absolute', left: 0 }}
      />
    </div>
  )
}
