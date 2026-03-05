'use client';

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Specimen } from '@/lib/specimens'
import { cn, getLumaOpacity } from '@/lib/utils'
import { useResonance } from '@/hooks/useResonance'

// --- ORGANIC APPARITION TEXT COMPONENT ---
function ApparateText({ children, delay = 0, className, style }: { children: React.ReactNode, delay?: number, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 2.0, delay, ease: [0.16, 1, 0.3, 1] }} // Fast, organic settling
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// --- MAIN COMPONENT ---
export default function SpecimenDetail({ specimen }: { specimen: Specimen }) {
  const router = useRouter()
  const [phase, setPhase] = useState<'clearing' | 'idle' | 'flooding'>('clearing')
  const [selectedVariant, setSelectedVariant] = useState<'soup' | 'rothko' | null>(null)
  const [showTechStack, setShowTechStack] = useState(false)
  
  // Phase 4: Ultra-Luxury Feature 2 - Generative Resonance Soundscape
  useResonance(specimen.hex, true)

  // Timeline Sequence
  useEffect(() => {
    // Mist finishes apparating around 3.5s, text settles around 2s
    const t = setTimeout(() => setPhase('idle'), 3500) 
    return () => clearTimeout(t)
  }, [])

  const handleAddToCart = () => {
    if (!selectedVariant) return
    setPhase('flooding')
    setTimeout(() => {
      // Navigate to shop with variant
      router.push(`/shop/${specimen.code}?variant=${selectedVariant}`)
    }, 1500)
  }

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#020202] text-[#FCFBF8] overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* CSS for Mist Floating & Morphing */}
      <style>{`
        @keyframes morphMist {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg); }
          100% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(360deg); }
        }
        @keyframes floatPulse {
          0% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-40px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 0.8; }
        }
        .animate-morph { animation: morphMist 18s linear infinite alternate; }
        .animate-float-pulse { animation: floatPulse 10s ease-in-out infinite alternate; }
      `}</style>

      {/* THE SMOKE CLEARING REVEAL */}
      <motion.div 
        className="absolute inset-0 z-[110] pointer-events-none"
        style={{ backgroundColor: specimen.hex }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      />

      {/* ETHEREAL MIST (Moved to Right, Larger, Bright Center) */}
      <motion.div 
        className="absolute right-[-30vw] md:right-[-10vw] top-[5%] bottom-0 flex items-center pointer-events-none z-10 will-change-[transform,opacity]"
        initial={{ opacity: 0, scale: 1.5 }} // Apparates out of the smoke
        animate={
          phase === 'flooding' ? { opacity: getLumaOpacity(specimen.hex, 1), scale: 20 } : 
          { opacity: getLumaOpacity(specimen.hex, 1), scale: 1 }
        }
        transition={{ duration: phase === 'flooding' ? 1.5 : 4.0, ease: "easeOut" }}
      >
        <div className="animate-float-pulse">
          <motion.div 
            className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] animate-morph will-change-[transform,opacity]"
            style={{ 
              // Bright white center fading outward into the specimen color, massive blur
              background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${specimen.hex} 15%, ${specimen.hex}50 45%, transparent 75%)`,
              filter: phase === 'flooding' ? 'blur(10px)' : 'blur(100px)'
            }}
            transition={{ duration: 1.5 }}
          />
        </div>
      </motion.div>

      {/* MAIN INTERFACE */}
      <div className="relative z-30 h-full w-full flex flex-col pt-12 md:pt-20 px-6 md:px-20 max-w-7xl mx-auto overflow-y-auto pb-24 overscroll-contain touch-pan-y">
        
        {/* Top Nav */}
        <div className="flex justify-between items-start w-full">
          {/* White Scalar Back Button */}
          <Link 
            href={`/${specimen.category}`}
            className="min-h-[44px] min-w-[44px] flex items-center text-xl md:text-2xl font-light tracking-[0.4em] text-[#FCFBF8]/60 hover:text-white uppercase font-[var(--font-archivo)] transition-colors"
            aria-label={`Back to ${specimen.category} Registry`} 
            data-thermal-hover="true"
          >
            SCALAR
          </Link>
          
          <button 
            onClick={() => setShowTechStack(!showTechStack)}
            className="min-h-[44px] min-w-[44px] text-[11px] tracking-[0.3em] text-white/50 uppercase font-mono transition-all duration-300 border border-white/20 px-4 py-2 hover:border-[#A80000] hover:text-[#A80000] hover:shadow-[0_0_15px_rgba(168,0,0,0.5)] hover:bg-[#A80000]/10"
            aria-label={showTechStack ? "Close System Architecture" : "View System Architecture"}
          >
            {showTechStack ? "[ CLOSE_ARCHITECTURE ]" : "[ VIEW_TECH_STACK ]"}
          </button>
        </div>

        {/* Content Block (Replaced Typewriter with ApparateText) */}
        <div className="flex-1 flex flex-col justify-center max-w-xl mt-12">
          
          {/* Bioluminescent Pulse - Inner Light breathing from within */}
          <ApparateText delay={0.2} className="h-[80px] md:h-[110px] flex items-center">
            <style>{`
              @keyframes bioPulse {
                0%, 100% { text-shadow: 0 0 15px ${specimen.hex}40, 0 0 5px ${specimen.hex}20; opacity: 1; }
                50% { text-shadow: 0 0 45px ${specimen.hex}90, 0 0 20px ${specimen.hex}60; opacity: 1; }
              }
            `}</style>
            <span 
              className="text-5xl sm:text-7xl md:text-9xl font-light tracking-[0.1em] uppercase font-[var(--font-archivo)] will-change-[text-shadow,opacity]"
              style={{ 
                color: specimen.hex,
                animation: 'bioPulse 4s ease-in-out infinite' 
              }} 
            >
              {specimen.code}
            </span>
          </ApparateText>

          <ApparateText delay={0.4} className="h-[30px] mt-2">
            <span className="text-base sm:text-lg md:text-xl text-white/50 tracking-[0.2em] font-mono uppercase">
              {specimen.chemicalName}
            </span>
          </ApparateText>

          <ApparateText delay={0.6} className="mt-6 text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed font-[var(--font-archivo)]">
            {specimen.description}
          </ApparateText>

          <ApparateText delay={0.8} className="mt-12 space-y-4">
            <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Select System Architecture
            </div>

            <button 
              onClick={() => setSelectedVariant('soup')}
              className={cn("w-full text-left min-h-[44px] p-4 border transition-all duration-300 relative overflow-hidden group", selectedVariant === 'soup' ? `border-[${specimen.hex}] bg-white/10` : "border-white/10 hover:border-white/30")}
              aria-label="Select Sub-5 Micron Soup Architecture"
            >
              {selectedVariant === 'soup' && <div className="absolute inset-0 opacity-20" style={{ backgroundColor: specimen.hex }} />}
              <h4 className="text-sm font-mono tracking-widest text-white mb-2 relative z-10">[ SYS_01 : SUB-5 MICRON SOUP ]</h4>
              <p className="text-xs text-white/60 font-light leading-relaxed relative z-10">Traditional binders replaced with self-crosslinking molecular suspension. Massive internal surface area yields unprecedented chroma and refractive depth.</p>
            </button>

            <button 
              onClick={() => setSelectedVariant('rothko')}
              className={cn("w-full text-left min-h-[44px] p-4 border transition-all duration-300 relative overflow-hidden group", selectedVariant === 'rothko' ? `border-[${specimen.hex}] bg-white/10` : "border-white/10 hover:border-white/30")}
              aria-label="Select Rothko's UV-Flash Architecture"
            >
              {selectedVariant === 'rothko' && <div className="absolute inset-0 opacity-20" style={{ backgroundColor: specimen.hex }} />}
              <h4 className="text-sm font-mono tracking-widest text-white mb-2 relative z-10">[ SYS_02 : ROTHKO'S UV-FLASH ]</h4>
              <p className="text-xs text-white/60 font-light leading-relaxed relative z-10">Achieve a 50-layer stack in one session. "Infinite Open Time" to work the material, followed by "Instant Solidification" via UV-light for glass-like clarity.</p>
            </button>
          </ApparateText>

          <ApparateText delay={1.0} className="mt-12 w-fit">
            <button 
              disabled={!selectedVariant || phase === 'flooding'}
              onClick={handleAddToCart}
              className={cn("group relative min-h-[44px] px-8 py-4 border transition-all duration-300",
                !selectedVariant ? "border-white/10 opacity-50 cursor-not-allowed" : "border-white/20 hover:border-white/80 hover:bg-white/5"
              )}
              aria-label={selectedVariant ? `Add ${specimen.code} with ${selectedVariant.toUpperCase()} to cart` : 'Select a system architecture first'}
            >
              <span className={cn("text-[11px] tracking-[0.3em] font-mono transition-colors duration-300",
                !selectedVariant ? "text-white/30" : "text-white/70 group-hover:text-white"
              )}>
                {selectedVariant ? `[ ADD_TO_CART : ${selectedVariant.toUpperCase()} ]` : '[ SELECT_SYSTEM_FIRST ]'}
              </span>
            </button>
          </ApparateText>
        </div>
      </div>

      {/* SLIDE-OUT TECH STACK OVERLAY (Moves Over Top of Mist, Pure Glass Effect) */}
      <AnimatePresence>
        {showTechStack && (
          <>
            <motion.div
              key="tech-stack-backdrop"
              className="absolute inset-0 z-30 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTechStack(false)}
              aria-hidden="true"
            />
            <motion.div 
              key="tech-stack-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.7, ease:[0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-full md:w-[45%] h-full bg-[#020202]/10 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-40 overflow-y-auto overscroll-contain touch-pan-y pt-12 md:pt-20 px-6 md:px-12 lg:px-20 pb-12 lg:pb-20 will-change-[transform,opacity]"
            >
            <h3 className="text-2xl font-light tracking-[0.3em] text-white mb-12 uppercase font-[var(--font-archivo)] mt-12">
              System <span className="text-white/30">Architecture</span>
            </h3>

            <div className="mb-16 relative z-10">
              <div className="text-[10px] text-white/50 font-mono tracking-widest uppercase mb-6">// OPTICAL HIERARCHY</div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">01.</span> CLARITY</div>
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">02.</span> CHROMA</div>
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">03.</span> DEPTH</div>
              </div>
            </div>

            <div className="space-y-10 font-light text-sm leading-relaxed text-white/70 font-[var(--font-archivo)]">
              <div>
                <span className="block text-[11px] font-mono tracking-[0.3em] text-white mb-2">MOLECULAR BINDING</span>
                No chalk. No fillers. A pure, self-weaving polymer that cures like a sheet of optical glass.
              </div>
              <div>
                <span className="block text-[11px] font-mono tracking-[0.3em] text-white mb-2">NANO-STABILITY</span>
                Pigments suspended below 5 microns. They do not clump, they do not settle. The result is a true, unbroken mirror finish.
              </div>
              <div>
                <span className="block text-[11px] font-mono tracking-[0.3em] text-white mb-2">ON-DEMAND SOLIDIFICATION</span>
                Work the material as long as you need. Cure it instantly with UV light. Zero wait times, zero color-shift.
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
