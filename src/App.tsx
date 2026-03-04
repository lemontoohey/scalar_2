import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CureSequenceShader from '@/components/CureSequenceShader'
import CollectionGrid from '@/components/CollectionGrid'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import ThermalCursor from '@/components/ThermalCursor'

export default function App() {
  const [showButtons, setShowButtons] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'organic' | 'inorganic' | null>(null)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSubBass = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      // Deep sub-bass frequency
      osc.type = 'sine'
      osc.frequency.setValueAtTime(60, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5)
      
      // Smooth envelope
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 2.0)
    } catch (e) {
      console.error('Audio play failed', e)
    }
  }

  useEffect(() => {
    // Sync: mist is 3500ms. Buttons appear at 3200ms
    const t = setTimeout(() => {
      setShowButtons(true)
      // Attempt to play audio
      playSubBass()
    }, 3200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main 
      className="relative w-full h-screen overflow-hidden bg-black text-[#FCFBF8] selection:bg-red-900 selection:text-white"
      onClick={() => {
        // Init audio context on first click to unlock for future if autoplay failed
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
          audioContextRef.current.resume()
        }
      }}
    >
      <ThermalCursor hoverColor={hoveredColor} />
      <ScanlineOverlay />
      
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
            className="text-7xl md:text-9xl font-light tracking-[0.4em] text-[#FCFBF8]"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 4.0, delay: 0.5, ease: 'easeOut' }}
            style={{ fontFamily: 'var(--font-archivo)' }}
          >
            SCALAR
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-light tracking-[0.6em] lowercase text-[#FCFBF8]/80 mt-4"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 3.5, delay: 1.5, ease: 'easeOut' }}
            style={{ fontFamily: 'var(--font-archivo)' }}
          >
            ordinance of depth
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-[25vh] flex justify-center gap-12 w-full pointer-events-auto z-20"
          initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(12px)' }}
          animate={showButtons ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 15, scale: 0.9, filter: 'blur(12px)' }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button 
            onClick={() => setActiveCategory('organic')}
            className="text-lg font-light tracking-[0.2em] text-[#FCFBF8]/60 hover:text-white p-4 transition-colors lowercase"
            style={{ fontFamily: 'var(--font-archivo)' }}
            whileHover={{ scale: 1.05, opacity: 1, textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            data-thermal-hover
          >
            [organic]
          </motion.button>
          <motion.button 
            onClick={() => setActiveCategory('inorganic')}
            className="text-lg font-light tracking-[0.2em] text-[#FCFBF8]/60 hover:text-white p-4 transition-colors lowercase"
            style={{ fontFamily: 'var(--font-archivo)' }}
            whileHover={{ scale: 1.05, opacity: 1, textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            data-thermal-hover
          >
            [inorganic]
          </motion.button>
        </motion.div>
      </section>

      {/* Z-70: Collection Grid Overlay */}
      <AnimatePresence>
        {activeCategory && (
          <CollectionGrid 
            category={activeCategory} 
            onClose={() => { setActiveCategory(null); setHoveredColor(null); }}
            onHoverColor={setHoveredColor}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
