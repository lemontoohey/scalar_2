'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CureSequenceShader from '@/components/CureSequenceShader'

export default function Home() {
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    // 1600ms timer guarantees synchronization with WebGL uTime flash
    const t = setTimeout(() => setShowButtons(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* Z-0: Ambient Backglow */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(74,0,0,0.5)_0%,rgba(31,5,16,0.3)_40%,transparent_80%)]" />

      {/* Z-10: Bulletproof WebGL Render Wrapper */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-80 mix-blend-screen" style={{ transform: 'translateZ(0)' }}>
        <CureSequenceShader />
      </div>

      {/* Z-50: Interface and Interactivity Layers */}
      <section className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
        
        <div className="text-center mt-[-8vh] pointer-events-auto z-10" style={{ textShadow: '0 0 40px rgba(168, 0, 0, 0.4)' }}>
          <motion.h1
            data-thermal-hover="true"
            className="text-7xl md:text-9xl font-light tracking-[0.4em] text-[#FCFBF8]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            style={{ fontFamily: 'var(--font-archivo)' }}
          >
            Scalar
          </motion.h1>
          <motion.p
            data-thermal-hover="true"
            className="text-lg md:text-xl font-light tracking-[0.6em] lowercase text-[#FCFBF8]/80 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
            style={{ fontFamily: 'var(--font-archivo)' }}
          >
            ordinance of depth
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-[25vh] flex justify-center gap-12 w-full pointer-events-auto z-20"
          initial={{ opacity: 0, y: 15 }}
          animate={showButtons ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button data-thermal-hover="true" className="font-light tracking-[0.4em] text-[#FCFBF8]/60 hover:text-white p-4 transition-colors lowercase font-['var(--font-archivo)']">
            [organic]
          </button>
          <button data-thermal-hover="true" className="font-light tracking-[0.4em] text-[#FCFBF8]/60 hover:text-white p-4 transition-colors lowercase font-['var(--font-archivo)']">
            [inorganic]
          </button>
        </motion.div>

      </section>
    </main>
  )
}
