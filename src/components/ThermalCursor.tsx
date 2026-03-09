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

  // --- PHYSICS CONFIGURATION ---
  // LAYER 1 (Core): Must feel instantaneous (1:1 with hardware mouse)
  const spring1Config = { damping: 15, stiffness: 1200, mass: 0.1 };
  const x1 = useSpring(mouseX, spring1Config);
  const y1 = useSpring(mouseY, spring1Config);

  // LAYER 2 (Bridge): Micro-lag to create the trailing edge
  const spring2Config = { damping: 20, stiffness: 800, mass: 0.2 };
  const x2 = useSpring(mouseX, spring2Config);
  const y2 = useSpring(mouseY, spring2Config);

  // LAYER 3 (Mist): The aerodynamic wake (softest spring)
  const spring3Config = { damping: 25, stiffness: 500, mass: 0.4 };
  const x3 = useSpring(mouseX, spring3Config);
  const y3 = useSpring(mouseY, spring3Config);

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
       {/* LAYER 3: TOP MIST (The Wake) */}
       <motion.div
        style={{ x: x3, y: y3 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHovering ? 90 : 25, // Slightly tighter max bloom
          height: isHovering ? 90 : 25,
          opacity: isHovering ? 0.9 : 0.4,
          backgroundColor: targetColor,
          filter: isHovering ? 'blur(15px)' : 'blur(8px)',
        }}
        // Snappier transitions
        transition={{ duration: 0.2, ease: "easeOut" }}
       />

       {/* LAYER 2: BRIDGE (Orange/Yellow oxide tint) */}
       <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHovering ? 50 : 16,
          height: isHovering ? 50 : 16,
          opacity: 0.6,
          backgroundColor: isHovering ? targetColor : '#D98700',
          filter: isHovering ? 'blur(10px)' : 'blur(5px)',
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
       />

       {/* LAYER 1: CORE (White Lightbulb - Absolute Precision) */}
       <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{
          width: isHovering ? 0 : 5, // Tighter core
          height: isHovering ? 0 : 5,
          opacity: isHovering ? 0 : 1, 
          filter: 'blur(1px)' // Sharper
        }}
        transition={{ duration: 0.1 }}
       />
    </div>
  )
}
