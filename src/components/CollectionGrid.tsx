import { useState } from 'react'
import { motion } from 'framer-motion'
import { SPECIMEN_DATA } from '@/lib/specimens'
import { cn } from '@/lib/utils'

export default function CollectionGrid({ category, onClose }: { category: 'organic' | 'inorganic', onClose: () => void }) {
  const dataset = SPECIMEN_DATA.filter((s) => s.category === category);
  const [hoveredHex, setHoveredHex] = useState<string | null>(null)

  return (
    <motion.div 
      className="fixed inset-0 z-[70] bg-[#020202]/98 backdrop-blur-xl w-full h-full overflow-y-auto overscroll-contain"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* BACKGROUND 1: Moving Technical Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'panGrid 60s linear infinite',
          position: 'fixed' // Fixed so it doesn't scroll with content if desired, or absolute to scroll
        }}
      />

      {/* BACKGROUND 2: Ambient Hex Resonance Glow */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: hoveredHex ? 0.15 : 0,
          background: hoveredHex 
            ? `radial-gradient(circle at 50% 50%, ${hoveredHex} 0%, transparent 60%)` 
            : 'transparent',
          position: 'fixed' // Fixed to viewport
        }}
      />

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
             <motion.div 
               key={specimen.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: idx * 0.03, ease: 'easeOut' }}
               onMouseEnter={() => setHoveredHex(specimen.hex)}
               onMouseLeave={() => setHoveredHex(null)}
             >
                <div
                  className={cn(
                    "group relative h-full p-6 border border-white/5 bg-white/[0.01]",
                    "backdrop-blur-sm cursor-crosshair overflow-hidden transition-all duration-500",
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
                  <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide text-white/90 font-[var(--font-archivo)]">
                      {specimen.name}
                    </h3>
                    
                    {/* The Physical Pigment Sample */}
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-1 rounded-full shadow-lg transition-transform duration-500 group-hover:scale-x-150 group-hover:origin-left"
                        style={{ 
                          backgroundColor: specimen.hex,
                          boxShadow: `0 0 10px ${specimen.hex}80`
                        }}
                      />
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
          ))}
        </div>
      </div>
    </motion.div>
  )
}
