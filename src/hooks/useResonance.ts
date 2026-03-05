'use client';
import { useEffect, useRef } from 'react';

export function useResonance(hexColor: string, isActive: boolean) {
  const audioCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const harmonicRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const constantRef = useRef<ConstantSourceNode | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isActive) {
      if (audioCtx.current && audioCtx.current.state === 'running') {
         // ramp down to silence
         gainNode.current?.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.5);
         setTimeout(() => {
             audioCtx.current?.suspend();
         }, 500);
      }
      return;
    }

    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const hexNum = parseInt(hexColor.replace('#', ''), 16);
        const baseFreq = 60 + (hexNum % 40);

        const fundamental = audioCtx.current.createOscillator();
        const harmonic = audioCtx.current.createOscillator();
        const lfo = audioCtx.current.createOscillator();
        const harmGain = audioCtx.current.createGain();
        const mainGain = audioCtx.current.createGain();
        const lfoDepth = audioCtx.current.createGain();
        const constant = audioCtx.current.createConstantSource();

        fundamental.type = 'sine';
        fundamental.frequency.value = baseFreq;
        harmonic.type = 'sine';
        harmonic.frequency.value = baseFreq * 2;

        lfo.type = 'sine';
        lfo.frequency.value = 0.2;
        lfoDepth.gain.value = 0.03;
        constant.offset.value = 0.03;

        mainGain.gain.value = 0;
        harmGain.gain.value = 0.03;

        lfo.connect(lfoDepth);
        lfoDepth.connect(harmGain.gain);
        constant.connect(harmGain.gain);

        fundamental.connect(mainGain);
        harmonic.connect(harmGain);
        harmGain.connect(mainGain);
        mainGain.connect(audioCtx.current.destination);

        fundamental.start();
        harmonic.start();
        lfo.start();
        constant.start();

        gainNode.current = mainGain;
        oscRef.current = fundamental;
        harmonicRef.current = harmonic;
        lfoRef.current = lfo;
        constantRef.current = constant;
      }
      
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }

      if (gainNode.current && audioCtx.current) {
        gainNode.current.gain.setTargetAtTime(0.06, audioCtx.current.currentTime, 3.0);
      }
    };

    // User must interact first, so attach to a click/mousemove listener on mount
    const handleInteract = () => {
        initAudio();
        window.removeEventListener('mousemove', handleInteract);
        window.removeEventListener('click', handleInteract);
    }

    window.addEventListener('mousemove', handleInteract);
    window.addEventListener('click', handleInteract);
    
    return () => {
        window.removeEventListener('mousemove', handleInteract);
        window.removeEventListener('click', handleInteract);
        const ctx = audioCtx.current;
        const gain = gainNode.current;
        const osc = oscRef.current;
        const harmonic = harmonicRef.current;
        const lfo = lfoRef.current;
        const constant = constantRef.current;
        if (gain && ctx) {
            gain.gain.setTargetAtTime(0, ctx.currentTime, 1.5);
        }
        setTimeout(() => {
            osc?.stop();
            osc?.disconnect();
            harmonic?.stop();
            harmonic?.disconnect();
            lfo?.stop();
            constant?.stop();
            ctx?.close();
            if (audioCtx.current === ctx) audioCtx.current = null;
            if (gainNode.current === gain) gainNode.current = null;
            if (oscRef.current === osc) oscRef.current = null;
            if (harmonicRef.current === harmonic) harmonicRef.current = null;
            if (lfoRef.current === lfo) lfoRef.current = null;
            if (constantRef.current === constant) constantRef.current = null;
        }, 1600);
    };
  }, [hexColor, isActive]);
}
