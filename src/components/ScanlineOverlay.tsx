'use client';
import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  const totalTime = 4.6;

  // RGB OFFSET: Drift slowly (to -15px), Snap back instantly (to 0)
  const lagKeyframes = {
    y: [0, 0, -15, 0, 0, -25, 0, 0], // Drifts behind
    opacity: [0.15, 0.15, 0, 0.15, 0.15, 0, 0.15, 0.15] // Transparent Ghosting
  };

  const lagTransition = {
    duration: totalTime, // Master loop time
    repeat: Infinity,
    ease: "linear",
    // The snap: Spend time moving AWAY, then minimal time RETURNING
    times: [0, 0.2, 0.35, 0.36, 0.7, 0.85, 0.86, 1] 
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden mix-blend-screen opacity-50">
      {/* Container Drop */}
      <motion.div 
         className="absolute left-0 w-full"
         initial={{ top: '-10%' }}
         animate={{ top: '110%' }}
         transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
      >
          {/* Red Leading Edge - More separation */}
          <motion.div 
            className="w-full h-[1px] bg-red-500 blur-[2px] opacity-40"
            animate={lagKeyframes}
            transition={lagTransition}
          />
          {/* Green - Stable */}
          <div className="w-full h-[1px] bg-green-500 opacity-20 blur-[1px] mt-[1px]" />
          
          {/* White Core - Ultra Tight */}
          <div className="w-full h-[1px] bg-white opacity-40 shadow-[0_0_5px_rgba(255,255,255,0.2)] -mt-[1px]" />

          {/* Blue - The Drag */}
          <motion.div 
             className="w-full h-[2px] bg-blue-600 blur-[4px] opacity-30 mt-[2px]"
             animate={lagKeyframes}
             transition={{ ...lagTransition, delay: 0.05 }} // Slight offset from red
          />
      </motion.div>
    </div>
  )
}
