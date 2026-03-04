import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPECIMEN_DATA, Specimen } from '@/lib/specimens'
import { cn } from '@/lib/utils'

function DecryptText({ text, isHovering, onComplete }: { text: string; isHovering: boolean; onComplete: () => void }) {
  const [displayText, setDisplayText] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
  
  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text)
      return
    }

    let iterations = 0
    const interval = setInterval(() => {
      setDisplayText(text
        .split('')
        .map((letter, index) => {
          if (index < iterations) return text[index]
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        onComplete()
      }

      // Faster speed: increase iteration step
      iterations += 1 
    }, 15)

    return () => clearInterval(interval)
  }, [isHovering, text])

  return <>{displayText}</>
}

// Smart Grid Component
function SmartGrid({ targetRect }: { targetRect: DOMRect | null }) {
  // Default to center if no target, but keep lines visible or hidden?
  // User said "basic animation that rearranges itself".
  // If no hover, maybe center lines? Or hidden?
  // Hidden is cleaner for "get rid of the grid".
  const [lines, setLines] = useState<{ x: string | number, y: string | number, opacity: number }>({ x: '50%', y: '50%', opacity: 0 })

  useEffect(() => {
    if (targetRect) {
      const x = targetRect.left + targetRect.width / 2
      const y = targetRect.top + targetRect.height / 2
      setLines({ x, y, opacity: 0.3 })
    } else {
      setLines({ x: '50%', y: '50%', opacity: 0 })
    }
  }, [targetRect])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Vertical Line */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[1px] bg-white/20"
        animate={{ left: lines.x, opacity: lines.opacity }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />
      {/* Horizontal Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-white/20"
        animate={{ top: lines.y, opacity: lines.opacity }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />
    </div>
  )
}

function Card({ specimen, idx, onHover, onLeave }: { specimen: Specimen, idx: number, onHover: (r: DOMRect, c: string) => void, onLeave: () => void }) {
  const [isHovering, setIsHovering] = useState(false)
  const [colorRevealed, setColorRevealed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.03, ease: 'easeOut' }}
      onMouseEnter={() => {
        setIsHovering(true)
        setColorRevealed(false) 
        if (cardRef.current) onHover(cardRef.current.getBoundingClientRect(), specimen.hex)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        setColorRevealed(false)
        onLeave()
      }}
    >
      <div
        className={cn(
          "group relative h-full p-6 border border-white/5 bg-white/[0.01]",
          "backdrop-blur-sm overflow-hidden transition-all duration-500",
          "hover:bg-white/[0.03] hover:border-white/20"
        )}
        data-thermal-hover="true"
      >
        {/* Top Section: Technical Data */}
        <div className="flex justify-between items-start mb-12">
          <span className="text-xs font-mono tracking-widest text-white/40 group-hover:text-white transition-colors duration-300">
            {specimen.code}
          </span>
          <span className="text-[9px] font-mono tracking-wider text-white/20 uppercase">
            {specimen.category}
          </span>
        </div>

        {/* Bottom Section: Name & Visual Hex */}
        <div className="space-y-6">
          <h3 className="text-lg font-light tracking-wide text-white/90 font-[var(--font-archivo)] min-h-[3rem]">
            <DecryptText 
              text={specimen.chemicalName} 
              isHovering={isHovering} 
              onComplete={() => setColorRevealed(true)}
            />
          </h3>
          
          {/* The Physical Pigment Sample - Wider and Longer */}
          <div className="w-full relative h-8 bg-white/5 overflow-hidden">
             <motion.div 
               className="h-full w-full"
               initial={{ x: '-101%' }}
               animate={{ x: colorRevealed ? '0%' : '-101%' }}
               transition={{ duration: 0.4, ease: 'circOut' }}
               style={{ 
                 backgroundColor: specimen.hex,
                 boxShadow: `0 0 20px ${specimen.hex}60`
               }}
             />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-white/30 transition-colors">
              HEX REFERENCE
            </span>
            <span className="text-[10px] font-mono text-white/30 group-hover:text-white/70 transition-colors">
              {specimen.hex}
            </span>
          </div>
        </div>

        {/* SCI-FI SCANNER LINE */}
        <div 
          className="absolute left-0 top-0 w-full h-[1px] opacity-0 group-hover:animate-scan"
          style={{
            background: `linear-gradient(90deg, transparent, ${specimen.hex}, transparent)`,
            boxShadow: `0 0 8px ${specimen.hex}`
          }}
        />
      </div>
    </motion.div>
  )
}

export default function CollectionGrid({ category, onClose, onHoverColor }: { category: 'organic' | 'inorganic', onClose: () => void, onHoverColor: (color: string | null) => void }) {
  const dataset = SPECIMEN_DATA.filter((s) => s.category === category)
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    return () => onHoverColor(null)
  }, [])

  return (
    <motion.div 
      className="fixed inset-0 z-[70] bg-[#020202]/98 backdrop-blur-xl w-full h-full overflow-y-auto overscroll-contain"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* BACKGROUND: Smart Rearranging Grid */}
      <SmartGrid targetRect={hoveredRect} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:px-12">
        <div className="flex justify-between items-end mb-20 border-b border-[#FCFBF8]/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-[#FCFBF8] uppercase font-[var(--font-archivo)]">
            {category} <span className="text-[#FCFBF8]/30">REGISTRY</span>
          </h2>
          <button 
            data-thermal-hover="true"
            onClick={onClose} 
            className="text-[10px] tracking-widest text-[#FCFBF8]/50 hover:text-white uppercase font-mono transition-colors pb-2"
          >
            [Close_Terminal]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataset.map((specimen, idx) => (
             <Card 
               key={specimen.id} 
               specimen={specimen} 
               idx={idx} 
               onHover={(rect, color) => {
                 setHoveredRect(rect)
                 onHoverColor(color)
               }}
               onLeave={() => {
                 setHoveredRect(null)
                 onHoverColor(null)
               }}
             />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
