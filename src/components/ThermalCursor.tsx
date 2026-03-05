'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useVelocity, useTransform } from 'framer-motion';
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
  
  // RAW MOUSE INPUT
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // PHYSICS: 3 LAYERS OF DRAG
  // Layer 1 (White - Heavy/Fast): Anchors the cursor
  const spring1Config = { damping: 25, stiffness: 300, mass: 0.5 };
  const x1 = useSpring(mouseX, spring1Config);
  const y1 = useSpring(mouseY, spring1Config);

  // Layer 2 (Azo/Orange - Floatier): Drags behind
  const spring2Config = { damping: 30, stiffness: 200, mass: 0.8 };
  const x2 = useSpring(mouseX, spring2Config);
  const y2 = useSpring(mouseY, spring2Config);

  // Layer 3 (Scalar Red - Mist): Most resistance/lag
  const spring3Config = { damping: 40, stiffness: 150, mass: 1.2 };
  const x3 = useSpring(mouseX, spring3Config);
  const y3 = useSpring(mouseY, spring3Config);

  // VELOCITY DEFORMATION (Based on the lead spring)
  const vX = useVelocity(x1);
  const vY = useVelocity(y1);
  const scale = useTransform([vX, vY], ([vx, vy]) => {
     const v = Math.hypot(vx as number, vy as number);
     return Math.max(1 - v / 3000, 0.6); // Gentle squash
  });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, mouseX, mouseY]);

  if (isTouch || !isVisible) return null;

  const isActive = !!activeHex;
  const targetColor = activeHex || '#A80000';

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen">
       {/* LAYER 3: TOP MIST (SCALAR RED / PIGMENT) - The Laggard */}
       <motion.div
        style={{ x: x3, y: y3, scale }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isActive ? 100 : 30,
          height: isActive ? 100 : 30,
          opacity: isActive ? 0.6 : 0.4,
          backgroundColor: targetColor, 
          filter: 'blur(15px)'
        }}
        transition={{ duration: 0.8, ease: "circOut" }}
       />

       {/* LAYER 2: MIDDLE MIST (AZO/ORANGE) - Bridge Color */}
       <motion.div
        style={{ x: x2, y: y2, scale }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
            width: isActive ? 60 : 20,
            height: isActive ? 60 : 20,
            opacity: 0.5,
            backgroundColor: isActive ? targetColor : '#D98700', 
            filter: 'blur(8px)'
        }}
        transition={{ duration: 0.6 }}
       />

       {/* LAYER 1: BOTTOM/CORE (LIGHTBULB WHITE) - The Lead */}
       <motion.div
        style={{ x: x1, y: y1, scale }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80"
        animate={{
            width: isActive ? 20 : 6,
            height: isActive ? 20 : 6,
            filter: 'blur(4px)'
        }}
        transition={{ duration: 0.4 }}
       />
    </div>
  )
}
