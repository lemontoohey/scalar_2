'use client';
import { useEffect, useRef } from 'react';

export function useResonance(hexColor: string, isActive: boolean) {
  const audioCtx = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const activeOscillators = useRef<(OscillatorNode | ConstantSourceNode)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isActive) {
      if (audioCtx.current && audioCtx.current.state === 'running' && masterGain.current) {
        masterGain.current.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.5);
        setTimeout(() => {
          audioCtx.current?.suspend();
        }, 1500);
      }
      return;
    }

    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const ctx = audioCtx.current;

        const hexNum = parseInt(hexColor.replace('#', ''), 16);
        const baseFreq = 35 + (hexNum % 20);

        masterGain.current = ctx.createGain();
        masterGain.current.gain.value = 0;
        masterGain.current.connect(ctx.destination);

        const leftSub = ctx.createOscillator();
        const rightSub = ctx.createOscillator();
        const leftPanner = ctx.createStereoPanner();
        const rightPanner = ctx.createStereoPanner();
        const subGain = ctx.createGain();

        leftSub.type = 'sine';
        rightSub.type = 'sine';
        leftSub.frequency.value = baseFreq - 0.25;
        rightSub.frequency.value = baseFreq + 0.25;

        leftPanner.pan.value = -0.5;
        rightPanner.pan.value = 0.5;
        subGain.gain.value = 0.6;

        leftSub.connect(leftPanner);
        leftPanner.connect(subGain);
        rightSub.connect(rightPanner);
        rightPanner.connect(subGain);
        subGain.connect(masterGain.current!);

        const textureOsc = ctx.createOscillator();
        const textureFilter = ctx.createBiquadFilter();
        const textureGain = ctx.createGain();

        textureOsc.type = 'triangle';
        textureOsc.frequency.value = baseFreq;

        textureFilter.type = 'lowpass';
        textureFilter.frequency.value = baseFreq * 2.5;
        textureFilter.Q.value = 1;

        textureGain.gain.value = 0.15;

        textureOsc.connect(textureFilter);
        textureFilter.connect(textureGain);
        textureGain.connect(masterGain.current!);

        const breathOsc = ctx.createOscillator();
        const breathGain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const breathConstant = ctx.createConstantSource();

        breathOsc.type = 'sine';
        breathOsc.frequency.value = baseFreq * 1.5;

        lfo.type = 'sine';
        lfo.frequency.value = 0.1;

        breathGain.gain.value = 0;
        lfoGain.gain.value = 0.1;

        breathConstant.offset.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(breathGain.gain);
        breathConstant.connect(breathGain.gain);
        breathOsc.connect(breathGain);
        breathGain.connect(masterGain.current!);

        leftSub.start();
        rightSub.start();
        textureOsc.start();
        breathOsc.start();
        lfo.start();
        breathConstant.start();

        activeOscillators.current = [leftSub, rightSub, textureOsc, breathOsc, lfo, breathConstant];
      }

      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }

      if (masterGain.current && audioCtx.current) {
        masterGain.current.gain.setTargetAtTime(0.4, audioCtx.current.currentTime, 1.5);
      }
    };

    const handleInteract = () => {
      initAudio();
      window.removeEventListener('mousemove', handleInteract);
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('scroll', handleInteract);
    };

    window.addEventListener('mousemove', handleInteract);
    window.addEventListener('click', handleInteract);
    window.addEventListener('scroll', handleInteract);

    return () => {
      window.removeEventListener('mousemove', handleInteract);
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('scroll', handleInteract);

      if (masterGain.current && audioCtx.current) {
        masterGain.current.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.1);

        setTimeout(() => {
          activeOscillators.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          activeOscillators.current = [];
          audioCtx.current?.close();
          audioCtx.current = null;
          masterGain.current = null;
        }, 500);
      }
    };
  }, [hexColor, isActive]);
}
