'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { computeSpectralLayers } from '@/lib/utils';

const variants = {
  initial: { opacity: 0 },
  ignite: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  breatheAtmosphere: {
    scaleX: [1, 1.3, 1],
    scaleY: [1, 1.1, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
      times: [0, 0.6, 1],
    },
  },
  breatheCore: {
    scale: [0.8, 1, 0.8],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function SpectralBloom({ hex }: { hex: string | null }) {
  if (!hex) return null;

  const { core, corona, atmosphere } = useMemo(() => computeSpectralLayers(hex), [hex]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
      <motion.div
        key={`atm-${hex}`}
        className="absolute inset-0"
        variants={variants}
        initial="initial"
        animate={['ignite', 'breatheAtmosphere']}
        style={{
          mixBlendMode: 'screen',
          background: `radial-gradient(ellipse at 50% 60%, ${atmosphere} 0%, transparent 80%)`,
          filter: 'blur(100px)',
        }}
      />
      <motion.div
        key={`cor-${hex}`}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${corona} 0%, transparent 50%)`,
          filter: 'blur(50px)',
        }}
      />
      <motion.div
        key={`core-${hex}`}
        className="absolute inset-0"
        variants={variants}
        initial="initial"
        animate={['ignite', 'breatheCore']}
        style={{
          mixBlendMode: 'plus-lighter',
          background: `radial-gradient(circle at 50% 50%, ${core} 0%, transparent 20%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}
