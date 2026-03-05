'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useColor } from '@/context/ColorContext';

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
}

export default function ThermalCursor() {
  const { activeHex } = useColor(); 
  const isTouch = useIsTouchDevice();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Raw Mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // CONFIG: High stiffness on hover (snap), lower on move (lag)
  // Layer 1 (White Core) - Tight
  const x1 = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const y1 = useSpring(mouseY, { damping: 30, stiffness: 400 });

  // Layer 2 (Middle) - Subtle Lag
  const x2 = useSpring(mouseX, { damping: 30, stiffness: 300 });
  const y2 = useSpring(mouseY, { damping: 30, stiffness: 300 });

  // Layer 3 (Mist) - Visual Lag (only separates when moving fast)
  const x3 = useSpring(mouseX, { damping: 40, stiffness: 200 });
  const y3 = useSpring(mouseY, { damping: 40, stiffness: 200 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const hover = (e: MouseEvent) => {
       const t = e.target as HTMLElement;
       setIsHovering(!!(t.closest('a') || t.closest('button') || t.hasAttribute('data-thermal-hover')));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', hover);
    return () => {
       window.removeEventListener('mousemove', move);
       window.removeEventListener('mouseover', hover);
    }
  }, [isVisible, mouseX, mouseY]);

  if (isTouch || !isVisible) return null;

  const targetColor = activeHex || '#A80000'; // Pigment or Scalar Red

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen">
       {/* LAYER 3: TOP (Red/Pigment) - The Main Bloom */}
       <motion.div
        style={{ x: x3, y: y3 }} // Heaviest lag
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          // EXPAND on hover to cover the other layers
          width: isHovering ? 80 : 30,
          height: isHovering ? 80 : 30,
          // Solidify on hover
          opacity: isHovering ? 1 : 0.4,
          backgroundColor: targetColor,
          filter: isHovering ? 'blur(10px)' : 'blur(20px)'
        }}
        transition={{ duration: 0.5 }}
       />

       {/* LAYER 2: MIDDLE (Azo Orange) - The Bridge */}
       <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          // CONTRACT/HIDE on hover (Assimilated into the bloom)
          width: isHovering ? 0 : 20, 
          height: isHovering ? 0 : 20,
          opacity: isHovering ? 0 : 0.5,
          backgroundColor: '#D98700',
          filter: 'blur(8px)'
        }}
        transition={{ duration: 0.3 }}
       />

       {/* LAYER 1: BOTTOM (White Light) - The Spark */}
       <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90"
        animate={{
          // SNAP to center of bloom on hover
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          opacity: isHovering ? 0 : 1, // Hides when solid bloom appears
          filter: 'blur(3px)'
        }}
        transition={{ duration: 0.2 }}
       />
    </div>
  )
}
