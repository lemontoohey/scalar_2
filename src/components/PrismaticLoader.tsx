'use client';
import { motion } from 'framer-motion';

export default function PrismaticLoader() {
  const shake = {
    x: [0, -2, 2, -1, 1, 0],
    transition: { duration: 0.2, repeat: Infinity, repeatDelay: 1 } // Glitches every second
  };
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
       <div className="relative h-12 w-[2px]">
          <motion.div animate={shake} className="absolute inset-0 bg-red-500 blur-[1px] mix-blend-screen" />
          <motion.div animate={{ ...shake, transition: { ...shake.transition, delay: 0.02 } }} className="absolute inset-0 bg-blue-500 blur-[1px] mix-blend-screen" />
          <motion.div className="absolute inset-0 bg-white shadow-[0_0_10px_white]" />
       </div>
    </div>
  )
}
