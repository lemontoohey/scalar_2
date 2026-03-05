'use client';

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SPECIMEN_DATA, Specimen } from '@/lib/specimens'
import { cn } from '@/lib/utils'
import SpectralBloom from './SpectralBloom'

const DECRYPT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'

function DecryptText({ text, isHovering, onComplete }: { text: string; isHovering: boolean; onComplete: () => void }) {
  const [displayText, setDisplayText] = useState(text)
  
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
          return DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)]
        })
        .join('')
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        onComplete()
      }

      iterations += 4
    }, 8)

    return () => clearInterval(interval)
  }, [isHovering, text, onComplete])

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
      <Link href={`/specimen/${specimen.code}`} className="block cursor-pointer">
        <div
          className="group relative min-h-[26rem] md:min-h-[20rem] flex flex-col justify-between p-6 border border-white/5 bg-transparent overflow-hidden transition-all duration-500 hover:bg-[#FCFBF8]/[0.03] hover:border-[#FCFBF8]/20 hover:backdrop-blur-sm"
          data-thermal-hover="true"
        >
          {/* Top Right: Category (Hidden unless hovered) */}
          <div className={cn(
            "absolute top-6 right-6 text-[9px] font-mono tracking-wider text-[#FCFBF8]/20 uppercase transition-opacity duration-500",
            isHovering ? "opacity-100" : "opacity-0"
          )}>
            {specimen.category}
          </div>

          {/* Dynamic Color Code: Reserved top on mobile, gliding absolute on desktop */}
          <div 
            className={cn(
              "relative md:absolute transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 font-mono tracking-[0.3em] uppercase pointer-events-none flex w-full mb-6 md:mb-0",
              isHovering 
                ? "text-[11px] md:text-[13px] text-[#FCFBF8]/50 md:top-6 md:left-6 md:translate-x-0 md:translate-y-0 md:!w-auto md:justify-start" 
                : "text-[14px] md:text-[18px] text-[#FCFBF8]/40 md:top-1/2 md:left-0 md:-translate-y-1/2 justify-center"
            )}
          >
            {specimen.code}
          </div>

          {/* Scrambled Name (Reveals in Center) */}
          <div className={cn(
            "flex-1 flex items-center justify-center px-6 text-center min-h-[3rem] transition-opacity duration-500 delay-100",
            isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <h3 className="text-xl font-light tracking-wide text-[#FCFBF8]/90 font-[var(--font-archivo)] leading-snug break-words hyphens-auto min-h-[3rem] flex items-center justify-center">
              <DecryptText 
                text={specimen.name} 
                isHovering={isHovering} 
                onComplete={() => {}}
              />
            </h3>
          </div>

          {/* Bottom Prominent Color Bar & Hex (CAPILLARY ANIMATION) */}
          <div className="flex flex-col gap-3">
            <div className="w-full h-2 bg-[#FCFBF8]/5 relative overflow-hidden rounded-[1px]">
              <div 
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  width: isHovering ? '100%' : '4px', 
                  backgroundColor: specimen.hex,
                  boxShadow: isHovering ? `0 0 20px ${specimen.hex}A0` : 'none' 
                }}
              />
            </div>
            
            <div className={cn(
              "flex justify-between items-center text-[10px] font-mono text-[#FCFBF8]/40 transition-opacity duration-500",
              isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <span>HEX_REF</span>
              <span className="text-[#FCFBF8]/70">{specimen.hex}</span>
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
      </Link>
    </motion.div>
  )
}

export default function CollectionGrid({ category }: { category: 'organic' | 'inorganic' }) {
  const dataset = SPECIMEN_DATA.filter((s) => s.category === category)
  const[hoveredHex, setHoveredHex] = useState<string | null>(null)
  
  return (
    <motion.div 
      className="fixed inset-0 z-[70] bg-[#030F08] w-full h-full overflow-y-auto overscroll-contain touch-pan-y"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease:[0.16, 1, 0.3, 1] }}
    >
      {/* CSS Styles */}
      <style>{`
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

      <SpectralBloom hex={hoveredHex} />

      <div className="relative z-10 w-full px-6 md:px-20 py-6">
        {/* TOP NAVIGATION */}
        <div className="sticky top-0 z-50 pt-6 pb-4 md:pt-12 md:pb-10 mb-8 md:mb-16 border-b border-white/[0.05] bg-[#040404]/90 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <Link 
            href="/"
            data-thermal-hover="true"
            className="relative md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 min-h-[44px] flex items-center text-[12px] md:text-2xl font-light tracking-[0.4em] text-[#FCFBF8]/40 hover:text-white uppercase font-[var(--font-archivo)] transition-all duration-300"
            aria-label="Back to Scalar Home"
          >
            SCALAR
          </Link>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase font-[var(--font-archivo)] flex items-center gap-3">
            <span className="text-[#A80000] drop-shadow-[0_0_12px_rgba(168,0,0,0.3)]">{category}</span>
            <span className="text-[#FCFBF8]/40 hidden md:inline">REGISTRY</span>
          </h2>
        </div>

        {/* SPECIMEN GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-24">
          {dataset.map((specimen, idx) => (
             <div key={specimen.id}>
               <Card 
                 specimen={specimen} 
                 idx={idx} 
                 onHover={setHoveredHex}
                 onLeave={() => setHoveredHex(null)}
               />
             </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
