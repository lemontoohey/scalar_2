import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SPECIMEN_DATA, Specimen } from '@/lib/specimens'
import { cn } from '@/lib/utils'

function DecryptText({ text, isHovering, onComplete }: { text: string; isHovering: boolean; onComplete: () => void }) {
  const [displayText, setDisplayText] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
  
  useEffect(() => {
    if (!isHovering) {
      setDisplayText('') // Clear text immediately when hover ends
      return
    }

    let iterations = 0
    const interval = setInterval(() => {
      setDisplayText(text
        .split('')
        .map((letter, index) => {
          if (index < iterations) return text[index]
          if (letter === ' ') return ' '
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        onComplete()
      }

      iterations += 1 
    }, 40) // Slower animation speed (Task 5)

    return () => clearInterval(interval)
  }, [isHovering, text])

  return <>{displayText}</>
}

function Card({ specimen, idx, onHover, onLeave }: { specimen: Specimen, idx: number, onHover: (color: string) => void, onLeave: () => void }) {
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.04, ease:[0.16, 1, 0.3, 1] }}
      onMouseEnter={() => {
        setIsHovering(true)
        onHover(specimen.hex)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        onLeave()
      }}
    >
      <div
        className={cn(
          "group relative h-64 p-6 border border-white/5",
          "overflow-hidden transition-all duration-500",
          "bg-transparent hover:bg-white/[0.03] hover:border-white/20 hover:backdrop-blur-sm"
        )}
        data-thermal-hover="true"
      >
        {/* Top Right: Category (Hidden unless hovered) */}
        <div className={cn(
          "absolute top-6 right-6 text-[9px] font-mono tracking-wider text-white/20 uppercase transition-opacity duration-500",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          {specimen.category}
        </div>

        {/* Dynamic Color Code (Starts Centered -> Glides to Top Left) */}
        <div 
          className={cn(
            "absolute transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 font-mono tracking-[0.3em] uppercase pointer-events-none flex w-full",
            isHovering 
              ? "top-6 left-6 text-[11px] md:text-[13px] text-white/50 translate-x-0 translate-y-0 !w-auto" 
              : "top-1/2 left-0 -translate-y-1/2 text-[14px] md:text-[18px] text-white/40 justify-center"
          )}
        >
          {specimen.code}
        </div>

        {/* Scrambled Name (Reveals in Center) */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center px-6 text-center transition-opacity duration-500 delay-100",
          isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <h3 className="text-xl font-light tracking-wide text-white/90 font-[var(--font-archivo)] leading-snug">
            <DecryptText 
              text={specimen.name} 
              isHovering={isHovering} 
              onComplete={() => {}}
            />
          </h3>
        </div>

        {/* Bottom Prominent Color Bar & Hex (CAPILLARY ANIMATION) */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
          <div className="w-full h-2 bg-white/5 relative overflow-hidden rounded-[1px]">
            <div 
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ 
                width: isHovering ? '100%' : '4px', // Capillary action: starts as a dot, shoots outward
                backgroundColor: specimen.hex,
                boxShadow: isHovering ? `0 0 20px ${specimen.hex}A0` : 'none' 
              }}
            />
          </div>
          
          <div className={cn(
            "flex justify-between items-center text-[10px] font-mono text-white/40 transition-opacity duration-500",
            isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <span>HEX_REF</span>
            <span className="text-white/70">{specimen.hex}</span>
          </div>
        </div>

        {/* SCI-FI SCANNER LINE */}
        <div 
          className="absolute left-0 top-0 w-full h-[1px] opacity-0 group-hover:animate-scan z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${specimen.hex}, transparent)`,
            boxShadow: `0 0 8px ${specimen.hex}`
          }}
        />
      </div>
    </motion.div>
  )
}

import SmokeFluidShader from './SmokeFluidShader'

export default function CollectionGrid({ category, onClose, onHoverColor }: { category: 'organic' | 'inorganic', onClose: () => void, onHoverColor: (color: string | null) => void }) {
  const dataset = SPECIMEN_DATA.filter((s) => s.category === category)
  const [hoveredHex, setHoveredHex] = useState<string | null>(null)

  useEffect(() => {
    onHoverColor(hoveredHex)
    return () => onHoverColor(null)
  }, [hoveredHex, onHoverColor])

  return (
    <motion.div 
      className="fixed inset-0 z-[70] bg-[#040404] w-full h-full overflow-y-auto overscroll-contain"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease:[0.16, 1, 0.3, 1] }}
    >
      <style>{`
        @keyframes driftLines {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100px, -100px); }
        }
        .animate-scan {
          animation: scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* AMBIENT BACKGROUND SMOKE FLUID */}
      <div className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-90">
        <SmokeFluidShader color={hoveredHex} />
      </div>

      {/* FLUID FLOATING GRID LINES */}
      <div 
        className="fixed -inset-[100px] z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'driftLines 20s linear infinite'
        }}
      />

      <div className="relative z-10 w-full px-6 py-6 sm:px-12">
        {/* TOP NAVIGATION */}
        <div className="sticky top-0 z-50 pt-8 pb-6 mb-16 border-b border-white/10 bg-[#040404]/90 backdrop-blur-xl flex items-center justify-center">
          
          <button 
            data-thermal-hover="true"
            onClick={onClose} 
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] md:text-[11px] tracking-[0.3em] text-[#FCFBF8]/40 hover:text-white uppercase font-mono transition-colors"
          >
            [ ← SCALAR ]
          </button>

          <h2 className="text-xl md:text-3xl font-light tracking-[0.4em] uppercase font-[var(--font-archivo)] text-[#FCFBF8] flex gap-4">
            {category} <span className="text-[#A80000] drop-shadow-[0_0_12px_rgba(168,0,0,0.5)]">REGISTRY</span>
          </h2>
          
        </div>

        {/* SPECIMEN GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-24">
          {dataset.map((specimen, idx) => (
             <Card 
               key={specimen.id} 
               specimen={specimen} 
               idx={idx} 
               onHover={setHoveredHex}
               onLeave={() => setHoveredHex(null)}
             />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
