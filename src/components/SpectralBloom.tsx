'use client';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { computeSpectralLayers } from '@/lib/utils';

export default function SpectralBloom({ hex }: { hex: string | null }) {
  const [isIgnited, setIgnited] = useState(false);

  const { core, corona, atmosphere } = useMemo(
    () => computeSpectralLayers(hex || '#000000'),
    [hex]
  );

  useEffect(() => {
    setIgnited(false);
  }, [hex]);

  if (!hex) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* LAYER 1: ATMOSPHERE (Deep) */}
      <motion.div
        key={`atm-${hex}`}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={
          isIgnited
            ? {
                opacity: [0.3, 0.5, 0.3],
                scaleX: [1, 1.3, 1],
                scaleY: [1, 1.1, 1],
              }
            : { opacity: 1 }
        }
        transition={
          isIgnited
            ? {
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : { duration: 0.8 }
        }
        onAnimationComplete={() => {
          if (!isIgnited) setIgnited(true);
        }}
        style={{
          mixBlendMode: 'screen',
          background: `radial-gradient(ellipse at 50% 60%, ${atmosphere} 0%, transparent 80%)`,
          filter: 'blur(80px)',
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        }}
      />

      {/* LAYER 2: CORONA (Mid) */}
      <motion.div
        key={`cor-${hex}`}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${corona} 0%, transparent 50%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* LAYER 3: CORE (Hot) */}
      <motion.div
        key={`core-${hex}`}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isIgnited
            ? {
                scale: [0.8, 0.95, 0.8],
                opacity: [0.8, 1, 0.8],
              }
            : { opacity: 1, scale: 0.8 }
        }
        transition={
          isIgnited
            ? {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : { duration: 0.6 }
        }
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${core} 0%, transparent 20%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}
