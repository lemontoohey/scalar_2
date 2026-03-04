'use client';
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true)
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])
  return isTouch
}

export default function ThermalCursor({ hoverColor }: { hoverColor?: string | null }) {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const isTouch = useIsTouchDevice()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    const handleMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      // Only react to interactive elements
      const active = t.tagName === 'BUTTON' || t.tagName === 'A' || 
                     !!t.closest('button') || !!t.closest('a') || 
                     t.hasAttribute('data-thermal-hover')
      setIsHovering(active)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (isTouch) return null

  // Determine active color (default red or passed hex)
  // Use a slight transparency for the bloom
  const activeBloom = hoverColor 
    ? `radial-gradient(circle, ${hoverColor}99 0%, ${hoverColor}00 70%)` // 99 is ~60% alpha
    : 'radial-gradient(circle, rgba(168,0,0,0.7) 0%, rgba(168,0,0,0) 70%)'

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{ x: mousePosition.x, y: mousePosition.y }}
      transition={{ type: 'spring', mass: 0.05, stiffness: 1000, damping: 40 }}
    >
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{ x: '-50%', y: '-50%' }}
        initial={false}
        animate={isHovering || hoverColor ? {
          width: 80, height: 80,
          background: activeBloom,
          mixBlendMode: hoverColor ? 'normal' : 'screen', // Normal for opaque colors usually looks better if they are bright
        } : {
          width: 8, height: 8,
          background: 'radial-gradient(circle, rgba(252,251,248,0.9) 0%, rgba(252,251,248,0) 70%)',
          mixBlendMode: 'difference',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
