import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Specimen } from '@/lib/specimens'
import { cn } from '@/lib/utils'

// --- 3D MOLECULAR LATTICE ---
function LatticeShape({ hexColor, phase, specimenCode }: { hexColor: string, phase: string, specimenCode: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const charSum = specimenCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const shapeType = charSum % 5
    switch(shapeType) {
      case 0: return <icosahedronGeometry args={[2.2, 0]} />
      case 1: return <octahedronGeometry args={[2.5, 0]} />
      case 2: return <dodecahedronGeometry args={[2.0, 0]} />
      case 3: return <torusKnotGeometry args={[1.5, 0.4, 64, 8]} />
      case 4: default: return <tetrahedronGeometry args={[2.5, 0]} />
    }
  }, [specimenCode])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Smoothly accelerate to a massive speed right before the mist morph
    let targetSpeed = 0.2
    if (phase === 'spinning') targetSpeed = 15.0 // Intense spin
    
    meshRef.current.rotation.y += delta * targetSpeed
    meshRef.current.rotation.x += delta * (targetSpeed * 0.8)

    const material = meshRef.current.material as THREE.MeshBasicMaterial
    const isDyed = phase !== 'falling'
    
    const targetColor = new THREE.Color(isDyed ? hexColor : '#222222')
    material.color.lerp(targetColor, delta * 4)
    material.opacity = THREE.MathUtils.lerp(material.opacity, isDyed ? 0.9 : 0.1, delta * 3)
  })

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshBasicMaterial wireframe transparent opacity={0.1} color="#222222" />
    </mesh>
  )
}

// --- TYPEWRITER HOOK ---
function TypewriterText({ text, start, delayMs = 0, speed = 15, className, style }: { text: string, start: boolean, delayMs?: number, speed?: number, className?: string, style?: any }) {
  const[displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!start) return
    const t = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delayMs)
    return () => clearTimeout(t)
  }, [text, start, delayMs, speed])

  return <span className={className} style={style}>{displayed}</span>
}

// --- MAIN COMPONENT ---
export default function SpecimenDetail({ specimen, onClose, onGoToShop }: { specimen: Specimen, onClose: () => void, onGoToShop: (specimen: Specimen, variant: string) => void }) {
  const[phase, setPhase] = useState<'falling' | 'dyed' | 'spinning' | 'mist' | 'flooding'>('falling')
  const[startTyping, setStartTyping] = useState(false)
  
  const [selectedVariant, setSelectedVariant] = useState<'soup' | 'rothko' | null>(null)
  const [showTechStack, setShowTechStack] = useState(false)

  // Timeline Sequence
  useEffect(() => {
    // 1. Smoke starts clearing, lattice absorbs color
    const t1 = setTimeout(() => {
      setPhase('dyed')
      setStartTyping(true)
    }, 1000) 
    
    // 2. Spins incredibly fast for 1.5s
    const t2 = setTimeout(() => setPhase('spinning'), 2500) 
    
    // 3. Transforms into ethereal hanging mist
    const t3 = setTimeout(() => setPhase('mist'), 4000) 

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  },[])

  const handleAddToCart = () => {
    if (!selectedVariant) return
    setPhase('flooding')
    setTimeout(() => {
      onGoToShop(specimen, selectedVariant)
    }, 1500)
  }

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#020202] text-[#FCFBF8] overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <style>{`
        @keyframes morphMist {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
          34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(120deg) scale(1.05); }
          67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(240deg) scale(0.95); }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
        }
        .animate-morph { animation: morphMist 12s ease-in-out infinite alternate; }
      `}</style>

      {/* THE SMOKE CLEARING REVEAL (Matches Shop Screen transition) */}
      <motion.div 
        className="absolute inset-0 z-[110] pointer-events-none"
        style={{ backgroundColor: specimen.hex }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 3.0, ease: "easeOut" }}
      />

      {/* 3D LATTICE & ETHEREAL MIST */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:pr-[15vw] pointer-events-none"
        animate={{ 
          x: showTechStack ? -250 : 0, // Pushed LEFT when tech stack opens on the RIGHT
          opacity: showTechStack ? 0.9 : 1 // Keep opacity high to see it under the glass
        }}
        transition={{ duration: 0.8, ease:[0.16, 1, 0.3, 1] }}
      >
        {/* Ethereal Mist (Radial gradient for softer edges) */}
        <motion.div 
          className="absolute w-[600px] h-[600px] animate-morph pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${specimen.hex} 0%, ${specimen.hex}60 40%, transparent 70%)` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            phase === 'flooding' ? { opacity: 1, scale: 20, filter: 'blur(20px)' } : // Floods the screen
            phase === 'mist' ? { opacity: 0.5, scale: 1.4, filter: 'blur(60px)' } : // Hangs in air, wide radius
            { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: phase === 'flooding' ? 1.5 : 2.5, ease: "easeInOut" }}
        />

        {/* 3D Canvas */}
        <AnimatePresence>
          {(phase === 'falling' || phase === 'dyed' || phase === 'spinning') && (
            <motion.div key="lattice-canvas" exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 1 }} className="w-[600px] h-[600px] absolute">
              <Canvas camera={{ position:[0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <LatticeShape hexColor={specimen.hex} phase={phase} specimenCode={specimen.code} />
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MAIN INTERFACE */}
      <div className="relative z-30 h-full w-full flex flex-col pt-12 px-8 md:px-20 max-w-7xl mx-auto overflow-y-auto pb-24">
        
        {/* Top Nav */}
        <div className="flex justify-between items-start w-full">
          {/* Red Scalar Back Button */}
          <button 
            onClick={onClose} 
            className="text-[11px] tracking-[0.3em] text-[#A80000] hover:text-[#ff3333] uppercase font-mono transition-colors"
          >
            [ ← {specimen.category}_REGISTRY ]
          </button>
          
          <button 
            onClick={() => setShowTechStack(!showTechStack)}
            className="text-[11px] tracking-[0.3em] text-white/50 hover:text-white uppercase font-mono transition-colors border border-white/20 px-4 py-2 hover:bg-white/5"
          >
            {showTechStack ? "[ CLOSE_ARCHITECTURE ]" : "[ VIEW_TECH_STACK ]"}
          </button>
        </div>

        {/* Content Block */}
        <motion.div className="flex-1 flex flex-col justify-center max-w-xl mt-12">
          <div className="h-[80px] md:h-[110px]">
            <TypewriterText 
              text={specimen.code} start={startTyping} delayMs={0} speed={40}
              className="text-7xl md:text-9xl font-light tracking-[0.1em] uppercase font-[var(--font-archivo)] drop-shadow-2xl"
              style={{ color: specimen.hex }} 
            />
          </div>

          <div className="h-[30px] mt-2">
            <TypewriterText 
              text={specimen.chemicalName} start={startTyping} delayMs={500}
              className="text-sm md:text-base text-white/50 tracking-[0.2em] font-mono uppercase"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: startTyping ? 1 : 0 }} transition={{ delay: 1.5, duration: 1 }}
            className="mt-6 text-lg md:text-xl text-white/80 font-light leading-relaxed font-[var(--font-archivo)]"
          >
            {specimen.description}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: startTyping ? 1 : 0, y: startTyping ? 0 : 20 }} transition={{ delay: 2, duration: 1 }}
            className="mt-12 space-y-4"
          >
            <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Select System Architecture
            </div>

            <button 
              onClick={() => setSelectedVariant('soup')}
              className={cn("w-full text-left p-4 border transition-all duration-300 relative overflow-hidden group", selectedVariant === 'soup' ? `border-[${specimen.hex}] bg-white/10` : "border-white/10 hover:border-white/30")}
            >
              {selectedVariant === 'soup' && <div className="absolute inset-0 opacity-20" style={{ backgroundColor: specimen.hex }} />}
              <h4 className="text-sm font-mono tracking-widest text-white mb-2 relative z-10">[ SYS_01 : SUB-5 MICRON SOUP ]</h4>
              <p className="text-xs text-white/60 font-light leading-relaxed relative z-10">Traditional binders replaced with self-crosslinking molecular suspension. Massive internal surface area yields unprecedented chroma and refractive depth.</p>
            </button>

            <button 
              onClick={() => setSelectedVariant('rothko')}
              className={cn("w-full text-left p-4 border transition-all duration-300 relative overflow-hidden group", selectedVariant === 'rothko' ? `border-[${specimen.hex}] bg-white/10` : "border-white/10 hover:border-white/30")}
            >
              {selectedVariant === 'rothko' && <div className="absolute inset-0 opacity-20" style={{ backgroundColor: specimen.hex }} />}
              <h4 className="text-sm font-mono tracking-widest text-white mb-2 relative z-10">[ SYS_02 : ROTHKO'S UV-FLASH ]</h4>
              <p className="text-xs text-white/60 font-light leading-relaxed relative z-10">Achieve a 50-layer stack in one session. "Infinite Open Time" to work the material, followed by "Instant Solidification" via UV-light for glass-like clarity.</p>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: startTyping ? 1 : 0 }} transition={{ delay: 2.5, duration: 1 }}
            className="mt-12 w-fit"
          >
            <button 
              disabled={!selectedVariant || phase === 'flooding'}
              onClick={handleAddToCart}
              className={cn("group relative px-8 py-4 border transition-all duration-300",
                !selectedVariant ? "border-white/10 opacity-50 cursor-not-allowed" : "border-white/20 hover:border-white/80 hover:bg-white/5"
              )}
            >
              <span className={cn("text-[11px] tracking-[0.3em] font-mono transition-colors duration-300",
                !selectedVariant ? "text-white/30" : "text-white/70 group-hover:text-white"
              )}>
                {selectedVariant ? `[ ADD_TO_CART : ${selectedVariant.toUpperCase()} ]` : '[ SELECT_SYSTEM_FIRST ]'}
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* SLIDE-OUT TECH STACK OVERLAY (From the RIGHT, Transparent Glassmorphism) */}
      <AnimatePresence>
        {showTechStack && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.7, ease:[0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 w-full md:w-[45%] h-full bg-[#020202]/30 backdrop-blur-xl border-l border-white/10 z-40 overflow-y-auto p-12 md:p-20"
          >
            <h3 className="text-2xl font-light tracking-[0.3em] text-white mb-12 uppercase font-[var(--font-archivo)] mt-12">
              System <span className="text-white/30">Architecture</span>
            </h3>

            <div className="mb-16 relative z-10">
              <div className="text-[10px] text-[#A80000] font-mono tracking-widest uppercase mb-6">// OPTICAL HIERARCHY</div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">01.</span> CLARITY</div>
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">02.</span> CHROMA</div>
                <div className="flex items-center gap-4 text-sm font-mono text-white/80"><span className="text-white/30">03.</span> DEPTH</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-8 border-b border-white/10 pb-2">Compound Specifications</div>
              <div className="space-y-8 font-light text-sm leading-relaxed text-white/70 font-[var(--font-archivo)]">
                <div><span className="block text-xs font-mono tracking-widest text-white mb-1">01. SELF-CROSSLINKING MATRIX</span> UV-curable, self-crosslinking bio-polymers. Guarantees "optical fire" without the milky haze.</div>
                <div><span className="block text-xs font-mono tracking-widest text-white mb-1">02. NANO-STABILIZATION</span> Advanced dispersants prevent clumping, resulting in a mirror-like surface with unparalleled distinctness of image.</div>
                <div><span className="block text-xs font-mono tracking-widest text-white mb-1">03. PHOTONIC INITIATORS</span> Aqueous-dispersible UV initiators provide "Infinite Open Time", followed by instant deep-curing.</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
