'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticText({ text, className, color }: { text: string, className?: string, color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 });
  };

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })} 
      className={`flex ${className}`} 
      style={{ color }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{ x: mousePos.x * 0.1, y: mousePos.y * 0.1, rotateZ: mousePos.x * 0.05 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
