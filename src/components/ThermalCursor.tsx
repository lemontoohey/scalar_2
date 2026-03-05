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
       {/* LAYER 3: TOP MIST (Color) */}
       <motion.div
        style={{ x: x3, y: y3 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHovering ? 100 : 25,
          height: isHovering ? 100 : 25,
          opacity: isHovering ? 0.8 : 0.5,
          backgroundColor: targetColor,
          filter: isHovering ? 'blur(25px)' : 'blur(8px)', // Bloomy when hovering
        }}
        transition={{ duration: 0.3 }}
       />

       {/* LAYER 2: BRIDGE (Orange/Yellow oxide tint) */}
       <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHovering ? 60 : 16,
          height: isHovering ? 60 : 16,
          opacity: 0.6,
          backgroundColor: isHovering ? targetColor : '#D98700', 
          filter: isHovering ? 'blur(15px)' : 'blur(5px)',
        }}
        transition={{ duration: 0.2 }}
       />

       {/* LAYER 1: CORE (White Lightbulb) */}
       <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90"
        animate={{
          width: isHovering ? 20 : 6,
          height: isHovering ? 20 : 6,
          filter: 'blur(3px)'
        }}
        transition={{ duration: 0.1 }}
       />
    </div>
  )
}
