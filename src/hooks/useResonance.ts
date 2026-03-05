'use client';
import { useEffect, useRef } from 'react';

export function useResonance(hexColor: string, isActive: boolean) {
  const audioCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const harmonicRef = useRef<OscillatorNode | null>(null);

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
        const baseFreq = 65 + (hexNum % 60); // Raised floor for laptop speakers (C2)

        const osc = audioCtx.current.createOscillator();
        const harmonic = audioCtx.current.createOscillator();
        const localGain = audioCtx.current.createGain();
        gainNode.current = localGain;
        oscRef.current = osc;
        harmonicRef.current = harmonic;

        osc.type = 'sine';
        osc.frequency.value = baseFreq;
        harmonic.type = 'sine';
        harmonic.frequency.value = baseFreq * 2; // First harmonic for laptop speakers

        localGain.gain.value = 0;
        osc.connect(localGain);
        harmonic.connect(localGain);
        localGain.connect(audioCtx.current.destination);

        osc.start();
        harmonic.start();
      }
      
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }

      // Fade in
      if (gainNode.current && audioCtx.current) {
         gainNode.current.gain.setTargetAtTime(0.05, audioCtx.current.currentTime, 2.0);
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
        if (gainNode.current && audioCtx.current) {
            gainNode.current.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.1);
        }
        oscRef.current?.stop();
        oscRef.current?.disconnect();
        harmonicRef.current?.stop();
        harmonicRef.current?.disconnect();
        audioCtx.current?.close();
        audioCtx.current = null;
        gainNode.current = null;
        oscRef.current = null;
        harmonicRef.current = null;
    };
  }, [hexColor, isActive]);
}
