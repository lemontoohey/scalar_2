import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Specimen } from '@/lib/specimens'
import { cn } from '@/lib/utils'

// --- 3D MOLECULAR LATTICE ---
function LatticeShape({ hexColor, isDyed, isHoveringCart }: { hexColor: string, isDyed: boolean, isHoveringCart: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // 1. Rotation Logic (Spins faster on hover)
    const targetSpeed = isHoveringCart ? 2.5 : 0.2
    meshRef.current.rotation.y += delta * targetSpeed
    meshRef.current.rotation.x += delta * (targetSpeed * 0.8)

    // 2. Color & Opacity Logic (Grey/Faint -> Dyed -> Flaring)
    const material = meshRef.current.material as THREE.MeshBasicMaterial
    const targetColor = new THREE.Color(isDyed ? hexColor : '#222222')
    
    if (isHoveringCart && isDyed) {
      targetColor.lerp(new THREE.Color('#ffffff'), 0.5) // Flare up intensely
    }

    material.color.lerp(targetColor, delta * 4)
    material.opacity = THREE.MathUtils.lerp(material.opacity, isDyed ? 0.9 : 0.1, delta * 3)
  })

  return (
    <mesh ref={meshRef}>
      {/* Icosahedron represents a molecular/crystal structure */}
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial wireframe transparent opacity={0.1} color="#222222" />
    </mesh>
  )
}

// --- TYPEWRITER HOOK ---
function TypewriterText({ text, start, delayMs = 0, speed = 15, className, style }: { text: string, start: boolean, delayMs?: number, speed?: number, className?: string, style?: React.CSSProperties }) {
  const [displayed, setDisplayed] = useState('')

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
  },[text, start, delayMs, speed])

  return <span className={className} style={style}>{displayed}</span>
}

// --- MAIN COMPONENT ---
export default function SpecimenDetail({ specimen, onClose }: { specimen: Specimen, onClose: () => void }) {
  const [isDyed, setIsDyed] = useState(false)
  const [startTyping, setStartTyping] = useState(false)
  const [isHoveringCart, setIsHoveringCart] = useState(false)

  // Trigger the dye and typing just as the waterfall passes the center of the screen
  useEffect(() => {
    const sequence = setTimeout(() => {
      setIsDyed(true)
      setStartTyping(true)
    }, 1100) // 1.1 seconds after mount
    return () => clearTimeout(sequence)
  },[])

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#020202] text-[#FCFBF8] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* 1. BACKGROUND ARCHITECTURE GRID */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 2. THE WATERFALL WASH OVERLAY */}
      <motion.div
        className="absolute left-0 right-0 z-50 pointer-events-none"
        style={{
          height: '150vh', // Massive block of color
          background: `linear-gradient(to bottom, transparent 0%, ${specimen.hex} 15%, ${specimen.hex} 85%, transparent 100%)`
        }}
        initial={{ top: '-150vh' }}
        animate={{ top: '100vh' }}
        transition={{ duration: 2.4, ease:[0.64, 0, 0.78, 0] }} // Accelerates and decelerates beautifully
      />

      {/* 3. 3D MOLECULAR LATTICE & BLOOM */}
      <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:pr-[15vw] pointer-events-none">
        {/* CSS Flare underneath the 3D model */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-700"
          style={{ 
            background: isDyed ? specimen.hex : 'transparent', 
            opacity: isHoveringCart ? 0.7 : 0.15,
            transform: isHoveringCart ? 'scale(1.2)' : 'scale(1)'
          }} 
        />
        <div className="w-[600px] h-[600px]">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
             <LatticeShape hexColor={specimen.hex} isDyed={isDyed} isHoveringCart={isHoveringCart} />
          </Canvas>
        </div>
      </div>

      {/* 4. INTERFACE & TYPOGRAPHY */}
      <div className="relative z-30 h-full w-full flex flex-col pt-12 px-8 md:px-20 max-w-6xl mx-auto">
        
        {/* Top Nav: Back Button */}
        <button 
          onClick={onClose} 
          className="self-start text-[11px] tracking-[0.3em] text-[#FCFBF8]/40 hover:text-white uppercase font-mono transition-colors"
        >
          [ ← SCALAR ]
        </button>

        {/* Content Block */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl pointer-events-none">
          {/* HEADING (Color Code) */}
          <div className="h-[80px] md:h-[120px]">
            <TypewriterText 
              text={specimen.code} 
              start={startTyping} 
              delayMs={0}
              speed={40}
              className="text-7xl md:text-9xl font-light tracking-[0.1em] uppercase font-[var(--font-archivo)] drop-shadow-2xl"
              style={{ color: specimen.hex }} // The code title matches the pigment
            />
          </div>

          {/* SUBHEADING (Chemical Name) */}
          <div className="h-[30px] mt-4">
            <TypewriterText 
              text={specimen.chemicalName} 
              start={startTyping} 
              delayMs={500} // Starts typing half a second after the heading
              className="text-sm md:text-base text-white/50 tracking-[0.2em] font-mono uppercase"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="min-h-[100px] mt-8">
            <TypewriterText 
              text={specimen.description} 
              start={startTyping} 
              delayMs={1500} // Starts typing after the subheading finishes
              speed={10} // Faster typing for the body paragraph
              className="text-lg md:text-xl text-white/80 font-light leading-relaxed font-[var(--font-archivo)]"
            />
          </div>

          {/* ADD TO CART BUTTON */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: startTyping ? 1 : 0 }}
            transition={{ delay: 3.5, duration: 1 }} // Fades in exactly when typing finishes
            className="mt-16 pointer-events-auto w-fit"
          >
            <button 
              onMouseEnter={() => setIsHoveringCart(true)}
              onMouseLeave={() => setIsHoveringCart(false)}
              className={cn(
                "group relative px-8 py-4 border transition-all duration-300",
                isHoveringCart ? "border-white/80 bg-white/5" : "border-white/20 bg-transparent"
              )}
            >
              <span className={cn(
                "text-[11px] tracking-[0.3em] font-mono transition-colors duration-300",
                isHoveringCart ? "text-white" : "text-white/50"
              )}>
                [ ADD_TO_CART ]
              </span>
              
              {/* Sci-fi scanner bracket corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}
