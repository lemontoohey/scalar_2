'use client';
import { motion } from 'framer-motion';
import { getGlowColor } from '@/lib/utils';

export default function SpectralBloom({ hex }: { hex: string | null }) {
  if (!hex) return null;

  const hotColor = getGlowColor(hex, 0.3);
  const warmColor = getGlowColor(hex, 0.05);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* LAYER 1: The "Atmosphere" - Fast fill, then slow drift */}
      <motion.div
        key={`atm-${hex}`}
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at 50% 50%, ${hex} 0%, transparent 80%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* LAYER 2: The "Corona" - The Main Color Body */}
      <motion.div
        key={`cor-${hex}`}
        className="absolute inset-0 opacity-60"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: [0, 0.8, 0.6],
          scale: [0.4, 1.2, 1.1]
        }}
        transition={{
          duration: 3,
          times: [0, 0.2, 1],
          ease: "easeOut"
        }}
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${warmColor} 0%, transparent 60%)`,
          filter: 'blur(50px)',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-full h-full"
        />
      </motion.div>

      {/* LAYER 3: The "Core" - The Ignition Spark */}
      <motion.div
        key={`core-${hex}`}
        className="absolute inset-0 opacity-90"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${hotColor} 0%, transparent 25%)`,
          filter: 'blur(25px)',
        }}
      />
    </div>
  )
}
