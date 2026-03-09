'use client';

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Specimen } from '@/lib/specimens'

export default function ShopScreen({ specimen }: { specimen: Specimen }) {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant') || 'soup' // Default to soup if not present
  
  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-[#030F08] text-[#FCFBF8] overflow-hidden flex flex-col items-center justify-center overscroll-contain touch-pan-y" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* THE SMOKE CLEARING TRANSITION */}
      <motion.div 
        className="absolute inset-0 z-[210] pointer-events-none will-change-[transform,opacity]"
        style={{ backgroundColor: specimen.hex }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      {/* TOP LEFT BACK TO LANDING BUTTON (z-[220] above smoke z-[210]) */}
      <div className="absolute top-12 left-12 z-[220]">
          <Link 
            href={`/specimen/${specimen.code}`}
            data-thermal-hover="true"
            className="min-h-[44px] flex items-center text-lg md:text-2xl font-light tracking-[0.4em] text-[#FCFBF8]/60 hover:text-white uppercase font-[var(--font-archivo)] transition-colors"
            aria-label={`Back to ${specimen.code} Specimen`}
        >
          SCALAR
        </Link>
      </div>

      {/* SHOP CONTENT (Staggers in smoothly after smoke clears) */}
      <motion.div 
        className="relative z-30 max-w-2xl w-full px-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="text-[10px] text-[#A80000] font-mono tracking-widest uppercase mb-8">
          // SECURE_CHECKOUT_INITIALIZED
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.1em] uppercase font-[var(--font-archivo)] mb-2" style={{ color: specimen.hex }}>
          {specimen.code}
        </h1>
        <h2 className="text-base sm:text-lg md:text-xl text-white/50 tracking-[0.2em] font-mono uppercase mb-12">
          {specimen.chemicalName}
        </h2>

        <div className="border border-white/10 bg-white/[0.02] p-8 text-left mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: specimen.hex }} />
           <p className="text-xs font-mono text-white/40 mb-2 uppercase">Selected Architecture</p>
           <p className="text-lg font-mono text-white/90 uppercase tracking-widest">[ SYS_0{variant === 'soup' ? '1' : '2'} : {variant === 'soup' ? 'SUB-5 MICRON SOUP' : "ROTHKO'S UV-FLASH"} ]
           </p>
        </div>

        <button className="w-full min-h-[44px] py-6 border border-white/20 hover:border-[#A80000] hover:bg-[#A80000]/10 transition-all duration-300 group" aria-label="Proceed to Payment">
          <span className="text-[11px] tracking-[0.3em] font-mono text-white/70 group-hover:text-[#A80000] transition-colors">
            [ PROCEED_TO_PAYMENT ]
          </span>
        </button>
      </motion.div>
    </motion.div>
  )
}
