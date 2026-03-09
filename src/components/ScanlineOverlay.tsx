'use client';
import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden mix-blend-screen opacity-20">
      <motion.div 
         className="absolute left-0 w-full h-[1px] bg-white opacity-10"
         initial={{ top: '-10%' }}
         animate={{ top: '110%' }}
         transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
