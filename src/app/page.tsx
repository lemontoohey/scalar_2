'use client';
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ScanlineOverlay from '@/components/ScanlineOverlay'

const CureSequenceShader = dynamic(() => import('@/components/CureSequenceShader'), { ssr: false })

export default function Home() {
  const [showButtons, setShowButtons] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSubBass = useCallback(() => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const masterBus = ctx.createGain()
    const delayNode = ctx.createDelay(1.0)
    const delayFeedback = ctx.createGain()

    delayNode.delayTime.value = 0.35
    delayFeedback.gain.value = 0.3
    delayNode.connect(delayFeedback)
    delayFeedback.connect(delayNode)
    delayNode.connect(masterBus)

    masterBus.gain.value = 0.9
    masterBus.connect(ctx.destination)

    const spark = ctx.createOscillator()
    const sparkGain = ctx.createGain()
    spark.type = 'triangle'
    spark.frequency.setValueAtTime(1200, ctx.currentTime)
    spark.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05)
    sparkGain.gain.setValueAtTime(0, ctx.currentTime)
    sparkGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005)
    sparkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    spark.connect(sparkGain)
    sparkGain.connect(masterBus)

    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(65, ctx.currentTime)
    sub.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8)
    subGain.gain.setValueAtTime(0, ctx.currentTime)
    subGain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.02)
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    sub.connect(subGain)
    subGain.connect(masterBus)

    const ring = ctx.createOscillator()
    const ringGain = ctx.createGain()
    ring.type = 'sine'
    ring.frequency.setValueAtTime(220, ctx.currentTime)
    ringGain.gain.setValueAtTime(0, ctx.currentTime)
    ringGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)
    ringGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3)
    ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    ring.connect(ringGain)
    ringGain.connect(masterBus)
    ringGain.connect(delayNode)

    spark.start(ctx.currentTime)
    sub.start(ctx.currentTime)
    ring.start(ctx.currentTime)
    spark.stop(ctx.currentTime + 0.1)
    sub.stop(ctx.currentTime + 1.6)
    ring.stop(ctx.currentTime + 1.6)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const unlockAudio = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }
    }
    window.addEventListener('click', unlockAudio, { once: true })
    window.addEventListener('mousemove', unlockAudio, { once: true })
    window.addEventListener('touchstart', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    const t = setTimeout(() => {
      setShowButtons(true)
      playSubBass()
    }, 3500)

    return () => {
      clearTimeout(t)
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('mousemove', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [playSubBass])

  return (
    <main 
      className="relative w-full h-[100dvh] overflow-hidden bg-[#030F08] text-[#FCFBF8] selection:bg-red-900 selection:text-white"
      onClick={() => {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
          audioContextRef.current.resume()
        }
      }}
    >
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(74,0,0,0.7)_0%,rgba(31,5,16,0.3)_40%,transparent_80%)]" />
      <div className="absolute inset-0 z-10 pointer-events-none opacity-80 mix-blend-screen" style={{ transform: 'translateZ(0)' }}>
        <CureSequenceShader />
      </div>

      <ScanlineOverlay />

      <section className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center mt-[-8vh] pointer-events-auto z-10" style={{ textShadow: '0 0 40px rgba(168, 0, 0, 0.4)', transform: 'translateX(-1%)' }}>
          <motion.h1
            className="text-5xl sm:text-7xl md:text-9xl font-light tracking-[0.4em] text-[#FCFBF8] font-[var(--font-archivo)]"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 4.0, delay: 0.5, ease: 'easeOut' }}
          >
            SCALAR
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl font-light tracking-[0.6em] lowercase text-[#FCFBF8]/80 mt-4 font-[var(--font-archivo)]"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 3.5, delay: 1.5, ease: 'easeOut' }}
          >
            ordinance of depth
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-[25vh] flex justify-center gap-16 w-full pointer-events-auto z-20"
          initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(12px)' }}
          animate={showButtons ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 15, scale: 0.9, filter: 'blur(12px)' }}
          transition={{ duration: 1.5, ease:[0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/organic"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[11px] md:text-[13px] tracking-[0.3em] text-[#FCFBF8]/40 hover:text-white uppercase font-mono transition-colors pb-2"
            aria-label="View Organic Specimens"
            data-thermal-hover
          >
            [ ORGANIC ]
          </Link>
          <Link
            href="/inorganic"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[11px] md:text-[13px] tracking-[0.3em] text-[#FCFBF8]/40 hover:text-white uppercase font-mono transition-colors pb-2"
            aria-label="View Inorganic Specimens"
            data-thermal-hover
          >
            [ INORGANIC ]
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
