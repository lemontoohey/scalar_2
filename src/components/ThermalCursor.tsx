'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useVelocity, useTransform } from 'framer-motion';
import { useColor } from '@/context/ColorContext';

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
}

export default function ThermalCursor() {
  const { activeHex } = useColor(); // Neural Link
  const isTouch = useIsTouchDevice();
  const [isVisible, setIsVisible] = useState(false); // Fix 0,0 fly-in bug
  
  // Spring Physics 
  const cursorX = useSpring(0, { damping: 25, stiffness: 200, mass: 0.8 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 200, mass: 0.8 });
  
  const xVelocity = useVelocity(cursorX);
  const yVelocity = useVelocity(cursorY);
  
  // SOUL PHYSICS: Euclidean Magnitude for "Total Speed" squashing
  const scale = useTransform(
    [xVelocity, yVelocity],
    ([xv, yv]) => {
      const velocity = Math.hypot(xv as number, yv as number);
      // Map 0 -> 1500 velocity to scale 1 -> 0.6
      const range = Math.min(velocity / 1500, 1); 
      return 1 - (range * 0.4);
    }
  );
  
  // Shear only on X for speed sensation
  const skewX = useTransform(xVelocity, [-1000, 1000], [25, -25]);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // First move creates "Existence" - prevents top-left spawn glitch
      if (!isVisible) setIsVisible(true); 
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const active =
        t.tagName === 'BUTTON' ||
        t.tagName === 'A' ||
        !!t.closest('button') ||
        !!t.closest('a') ||
        t.hasAttribute('data-thermal-hover');
      setIsHovering(active);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
        skewX,
        scale,
      }}
    >
      <motion.div
        initial={false}
        animate={isHovering || activeHex ? 'active' : 'idle'}
        variants={{
          idle: {
            width: 12,
            height: 12,
            opacity: 0.8,
            backgroundColor: '#FCFBF8',
            mixBlendMode: 'difference' as const,
          },
          active: {
            width: 80,
            height: 80,
            opacity: 1,
            backgroundColor: activeHex || '#A80000',
            mixBlendMode: 'normal' as const,
          },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm"
      >
        {(isHovering || activeHex) && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: activeHex
                ? `radial-gradient(circle, ${activeHex}00 0%, ${activeHex}40 100%)`
                : 'radial-gradient(circle, rgba(168,0,0,0) 0%, rgba(168,0,0,0.4) 100%)',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
