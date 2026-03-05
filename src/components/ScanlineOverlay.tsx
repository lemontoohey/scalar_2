'use client';
import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  const totalTime = 4.6;

  // The Vertical Scan
  const dropTransition = {
    duration: totalTime,
    repeat: Infinity,
    ease: "linear",
    repeatDelay: 0
  };

  // The Glitch Logic: Lags at 30% and 70% down screen
  const rgbLag = {
    y: [0, 0, -20, 0, 0, -15, 0, 0], // Lags UP (stays behind) then snaps back
    opacity: [0.3, 0.3, 0.1, 0.3, 0.3, 0.1, 0.3, 0.3], // Fades out during lag
  };

  const lagTransition = {
    duration: totalTime,
    repeat: Infinity,
    ease: "linear",
    times: [0, 0.3, 0.35, 0.4, 0.7, 0.75, 0.8, 1] // Specific timestamps for the glitch
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden mix-blend-screen">
      {/* Tightly packed container traveling down */}
      <motion.div 
         className="absolute left-0 w-full"
         initial={{ top: '-10%' }}
         animate={{ top: '110%' }}
         transition={dropTransition}
      >
          {/* Red Edge - Lags behind slightly more */}
          <motion.div 
            className="w-full h-[1px] bg-[#ff0000] blur-[1px]" 
            animate={{ y: [0, 0, -25, 0, 0, -18, 0, 0], opacity: [0.3, 0.3, 0.1, 0.3, 0.3, 0.1, 0.3, 0.3] }}
            transition={lagTransition}
          />
          
          {/* Green Center - Reference (No lag) */}
          <motion.div className="w-full h-[2px] bg-[#00ff00] opacity-20 blur-[0.5px] mt-[1px]" />
          
          {/* White Core - Bright */}
          <div className="w-full h-[1px] bg-white opacity-60 shadow-[0_0_10px_rgba(255,255,255,0.4)] -mt-[1px]" />

          {/* Blue Leading Edge - Runs ahead? No, lags less */}
          <motion.div 
             className="w-full h-[2px] bg-[#0000ff] blur-[2px] mt-[1px]" 
             animate={rgbLag}
             transition={lagTransition}
          />
      </motion.div>
    </div>
  )
}
