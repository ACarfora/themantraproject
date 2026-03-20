'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type SoundType = 'rain' | 'waves' | 'bowls';

const FILE_SOUNDS: Record<string, string> = {
  rain: '/audio/rain.mp3',
  waves: '/audio/waves.mp3',
};

interface AudioState {
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Singing bowls: layered sine tones at healing frequencies with slow beating.
 */
function buildBowlsGraph(ctx: AudioContext, gainNode: GainNode): () => void {
  const nodes: AudioNode[] = [];
  // Root 432Hz with perfect fifths, octaves, and major thirds — warm and uplifting
  const frequencies = [108, 162, 216, 270, 324, 432];
  const cyclePeriods = [10, 11, 12, 10.5, 11.5, 10.7];

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq + 0.2;

    const baseLevel = 0.07 / (i + 1);

    // Per-voice gain that will be modulated
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0; // starts silent

    // Slow LFO to fade this voice in and out over its cycle period
    const fadeLfo = ctx.createOscillator();
    fadeLfo.type = 'sine';
    fadeLfo.frequency.value = 1 / cyclePeriods[i];
    const fadeLfoGain = ctx.createGain();
    fadeLfoGain.gain.value = baseLevel;
    fadeLfo.connect(fadeLfoGain);
    fadeLfoGain.connect(oscGain.gain);

    // DC offset so the LFO swings 0 → baseLevel*2 instead of -baseLevel → +baseLevel
    const dcOffset = ctx.createConstantSource();
    dcOffset.offset.value = baseLevel;
    dcOffset.connect(oscGain.gain);

    // Stagger the start phase — each voice enters at a different point
    // by delaying the LFO start
    const staggerDelay = (i / frequencies.length) * cyclePeriods[i];

    osc.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start();
    osc2.start();
    fadeLfo.start(ctx.currentTime + staggerDelay);
    dcOffset.start();

    nodes.push(osc, osc2, oscGain, fadeLfo, fadeLfoGain, dcOffset);
  });

  return () => {
    nodes.forEach((node) => {
      try {
        node.disconnect();
        if ('stop' in node && typeof node.stop === 'function') {
          (node as OscillatorNode).stop();
        }
      } catch {
        // Already stopped/disconnected
      }
    });
  };
}

export function useAudio(soundType: SoundType | ''): AudioState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  // For file-based sounds (rain, waves)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // For synthesized sounds (bowls)
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const FADE_DURATION = 1.5; // seconds
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teardownImmediate = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close();
    }
    ctxRef.current = null;
    gainRef.current = null;
  }, []);

  const play = useCallback(async () => {
    if (!soundType) return;

    teardownImmediate();

    if (soundType in FILE_SOUNDS) {
      const audio = new Audio(FILE_SOUNDS[soundType]);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      await audio.play();

      // Fade in
      const steps = 30;
      const stepTime = (FADE_DURATION * 1000) / steps;
      let step = 0;
      const fadeIn = setInterval(() => {
        step++;
        audio.volume = Math.min(volume, (step / steps) * volume);
        if (step >= steps) clearInterval(fadeIn);
      }, stepTime);
    } else {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      ctxRef.current = ctx;
      gainRef.current = gain;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      cleanupRef.current = buildBowlsGraph(ctx, gain);

      // Fade in
      gain.gain.setTargetAtTime(volume, ctx.currentTime, FADE_DURATION / 3);
    }

    setIsPlaying(true);
  }, [soundType, volume, teardownImmediate]);

  const pause = useCallback(() => {
    // Fade out file audio
    if (audioRef.current) {
      const audio = audioRef.current;
      const startVol = audio.volume;
      const steps = 30;
      const stepTime = (FADE_DURATION * 1000) / steps;
      let step = 0;
      const fadeOut = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVol * (1 - step / steps));
        if (step >= steps) {
          clearInterval(fadeOut);
          teardownImmediate();
        }
      }, stepTime);
      fadeTimerRef.current = setTimeout(() => teardownImmediate(), FADE_DURATION * 1000 + 100);
    }

    // Fade out synth audio
    if (gainRef.current && ctxRef.current) {
      const gain = gainRef.current;
      const ctx = ctxRef.current;
      gain.gain.setTargetAtTime(0, ctx.currentTime, FADE_DURATION / 3);
      fadeTimerRef.current = setTimeout(() => teardownImmediate(), FADE_DURATION * 1000 + 100);
    }

    if (!audioRef.current && !gainRef.current) {
      teardownImmediate();
    }

    setIsPlaying(false);
  }, [teardownImmediate]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    // Update file audio volume
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    // Update synth gain
    if (gainRef.current) {
      gainRef.current.gain.setTargetAtTime(clamped, gainRef.current.context.currentTime, 0.05);
    }
  }, []);

  // Stop on unmount
  useEffect(() => teardownImmediate, [teardownImmediate]);

  // Stop when sound type changes while playing
  useEffect(() => {
    if (isPlaying) {
      teardownImmediate();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType]);

  return { isPlaying, volume, play, pause, toggle, setVolume };
}
