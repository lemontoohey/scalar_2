import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Specimen } from '@/lib/specimens'

function DecryptText({ baseCode, decodedName, isHovering }: { baseCode: string; decodedName: string; isHovering: boolean }) {
  const [displayText, setDisplayText] = useState(baseCode)

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(baseCode)
      return
    }

    let iter = 0;
    const finalString = `${baseCode} // ${decodedName.toUpperCase()}`
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*'
    
    const interval = setInterval(() => {
      setDisplayText(finalString.split('').map((letter, index) => {
        if(index < iter) return letter;
        return letters[Math.floor(Math.random() * letters.length)]
      }).join(''))
      
      if(iter >= finalString.length) clearInterval(interval);
      iter += 1/2; // Adjust decoding speed
    }, 20);

    return () => clearInterval(interval);
  }, [isHovering, baseCode, decodedName])

  return <>{displayText}</>
}

export default function SpecimenCard({ data }: { data: Specimen }) {
  const [hovered, setHovered] = useState(false)

  // Dynamically invert text color to stay legible over bright colors vs deep blacks
  const getBrightness = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000
  }
  const textColor = getBrightness(data.hex) > 130 ? '#000502' : '#FCFBF8'

  return (
    <motion.div
      data-thermal-hover="true"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative w-full aspect-[4/3] md:aspect-square flex items-end p-4 cursor-pointer overflow-hidden group border border-[#FCFBF8]/10"
      style={{ backgroundColor: data.hex }}
    >
      {/* 1. Fluid Background Shimmer (Animates permanently, accelerates on hover) */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.8) 100%)',
          backgroundSize: '200% 200%' 
        }}
        animate={{ 
          backgroundPosition: hovered ? ['0% 0%', '100% 100%', '0% 0%'] : ['20% 20%', '80% 80%', '20% 20%'],
          opacity: hovered ? 0.6 : 0.2
        }}
        transition={{ duration: hovered ? 4 : 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* 2. Glass Inset Shadow Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none transition-shadow duration-700 group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />

      {/* 3. Text Decryption Interface */}
      <div 
        className="relative z-10 w-full"
        style={{ color: textColor, fontFamily: 'var(--font-archivo)' }}
      >
        <motion.p 
          className="font-mono text-xs md:text-[11px] font-medium tracking-widest break-all line-clamp-2 drop-shadow-md"
        >
          <DecryptText baseCode={data.code} decodedName={data.name} isHovering={hovered} />
        </motion.p>
      </div>
    </motion.div>
  )
}
