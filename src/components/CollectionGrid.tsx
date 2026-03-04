import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    }, 20)

    return () => clearInterval(interval)
  }, [isHovering, text])

  return <>{displayText}</>
}

function Card({ specimen, idx, onHover, onLeave }: { specimen: Specimen, idx: number, onHover: (color: string) => void, onLeave: () => void }) {
  const[isHovering, setIsHovering] = useState(false)
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
          "group relative h-64 p-6 border border-white/5 bg-[#080808]",
          "overflow-hidden transition-all duration-500",
          "hover:bg-[#111111] hover:border-white/20"
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
            "absolute transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 font-mono tracking-widest pointer-events-none",
            isHovering 
              ? "top-6 left-6 text-xs text-white/50 translate-x-0 translate-y-0" 
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] text-3xl text-white/80"
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

        {/* Bottom Prominent Color Bar & Hex */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
          <div 
            className="w-full h-3 rounded-[1px] transition-transform duration-500 group-hover:scale-y-[1.2] origin-bottom"
            style={{ 
              backgroundColor: specimen.hex,
              boxShadow: `0 0 15px ${specimen.hex}90` // 90 is hex alpha for ~56% opacity
            }}
          />
          
          <div className={cn(
            "flex justify-between items-center text-[10px] font-mono text-white/40 transition-opacity duration-500",
            isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <span>HEX</span>
            <span className="text-white/70">{specimen.hex}</span>
          </div>
        </div>

        {/* SCI-FI SCANNER LINE */}
        <div 
          className="absolute left-0 top-0 w-full h-[1px] opacity-0 group-hover:animate-scan z-20"
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
  const [hoveredHex, setHoveredHex] = useState<string | null>(null)

  // Sync internal state to App.tsx cursor
  useEffect(() => {
    onHoverColor(hoveredHex)
    return () => onHoverColor(null)
  },[hoveredHex, onHoverColor])

  return (
    <motion.div 
      className="fixed inset-0 z-[70] bg-[#040404] w-full h-full overflow-y-auto overscroll-contain"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease:[0.16, 1, 0.3, 1] }}
    >
      {/* CSS For Fluid Background Lines */}
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

      {/* AMBIENT BACKGROUND BLOOM */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-700 pointer-events-none mix-blend-screen"
        style={{
          opacity: hoveredHex ? 0.6 : 0, // Stronger bloom
          background: hoveredHex 
            ? `radial-gradient(circle at 50% 50%, ${hoveredHex} 0%, transparent 65%)` 
            : 'transparent',
        }}
      />

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:px-12">
        {/* TOP NAVIGATION */}
        <div className="flex justify-between items-end mb-16 border-b border-[#FCFBF8]/10 pb-6 pt-4 sticky top-0 bg-[#040404]/80 backdrop-blur-md z-50">
          <button 
            data-thermal-hover="true"
            onClick={onClose} 
            className="text-2xl md:text-3xl font-light tracking-[0.4em] text-[#FCFBF8] hover:text-white uppercase font-[var(--font-archivo)] transition-colors"
          >
            SCALAR
          </button>
          <span className="text-[10px] tracking-widest text-[#FCFBF8]/30 uppercase font-mono pb-1">
            [ {category}_REGISTRY ]
          </span>
        </div>

        {/* SPECIMEN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-24">
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
