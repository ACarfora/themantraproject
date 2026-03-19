'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type SoundType = 'rain' | 'ocean' | 'forest' | 'bowls';

interface AudioState {
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Creates a buffer of noise (white/brown) for ambient sound synthesis.
 */
function createNoiseBuffer(ctx: AudioContext, duration: number, brown = false): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        // Brown noise: integrate white noise
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else {
        data[i] = white;
      }
    }
  }

  return buffer;
}

/**
 * Build a synthesis graph for each ambient sound type.
 * Returns a cleanup function.
 */
function buildSynthGraph(
  ctx: AudioContext,
  type: SoundType,
  gainNode: GainNode
): (() => void) {
  const nodes: AudioNode[] = [];

  if (type === 'rain') {
    // Rain: filtered white noise + occasional drip oscillators
    const noiseBuffer = createNoiseBuffer(ctx, 4, false);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 800;
    bandpass.Q.value = 0.5;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 200;

    source.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    source.start();

    nodes.push(source, bandpass, highpass);

    // Soft low rumble
    const rumbleBuffer = createNoiseBuffer(ctx, 4, true);
    const rumble = ctx.createBufferSource();
    rumble.buffer = rumbleBuffer;
    rumble.loop = true;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.15;
    const rumbleLp = ctx.createBiquadFilter();
    rumbleLp.type = 'lowpass';
    rumbleLp.frequency.value = 150;
    rumble.connect(rumbleLp);
    rumbleLp.connect(rumbleGain);
    rumbleGain.connect(gainNode);
    rumble.start();
    nodes.push(rumble, rumbleLp, rumbleGain);
  }

  if (type === 'ocean') {
    // Ocean: brown noise with slow LFO on filter frequency
    const noiseBuffer = createNoiseBuffer(ctx, 4, true);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 400;
    lp.Q.value = 1;

    // LFO for wave-like sweep
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08; // slow wave rhythm
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(lp.frequency);
    lfo.start();

    source.connect(lp);
    lp.connect(gainNode);
    source.start();

    nodes.push(source, lp, lfo, lfoGain);
  }

  if (type === 'forest') {
    // Forest: gentle brown noise base + soft high chirp oscillators
    const noiseBuffer = createNoiseBuffer(ctx, 4, true);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 500;
    bp.Q.value = 0.3;

    const forestGain = ctx.createGain();
    forestGain.gain.value = 0.6;

    source.connect(bp);
    bp.connect(forestGain);
    forestGain.connect(gainNode);
    source.start();

    nodes.push(source, bp, forestGain);

    // Soft wind layer
    const windBuffer = createNoiseBuffer(ctx, 4, false);
    const wind = ctx.createBufferSource();
    wind.buffer = windBuffer;
    wind.loop = true;
    const windLp = ctx.createBiquadFilter();
    windLp.type = 'lowpass';
    windLp.frequency.value = 300;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.2;

    // Slow modulation for rustling effect
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.15;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.12;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windGain.gain);
    windLfo.start();

    wind.connect(windLp);
    windLp.connect(windGain);
    windGain.connect(gainNode);
    wind.start();

    nodes.push(wind, windLp, windGain, windLfo, windLfoGain);
  }

  if (type === 'bowls') {
    // Singing bowls: layered sine tones with slow beating
    const frequencies = [174, 261.6, 396, 528];
    const bowlNodes: AudioNode[] = [];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Slight detune for natural beating
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq + 0.5;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.08 / (i + 1);

      // Slow tremolo
      const trem = ctx.createOscillator();
      trem.type = 'sine';
      trem.frequency.value = 0.1 + i * 0.03;
      const tremGain = ctx.createGain();
      tremGain.gain.value = 0.03 / (i + 1);
      trem.connect(tremGain);
      tremGain.connect(oscGain.gain);
      trem.start();

      osc.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      osc2.start();

      bowlNodes.push(osc, osc2, oscGain, trem, tremGain);
    });

    nodes.push(...bowlNodes);
  }

  return () => {
    nodes.forEach((node) => {
      try {
        node.disconnect();
        if ('stop' in node && typeof node.stop === 'function') {
          (node as OscillatorNode | AudioBufferSourceNode).stop();
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

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const teardown = useCallback(() => {
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

    // Tear down any previous graph
    teardown();

    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    ctxRef.current = ctx;
    gainRef.current = gain;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    cleanupRef.current = buildSynthGraph(ctx, soundType as SoundType, gain);
    setIsPlaying(true);
  }, [soundType, volume, teardown]);

  const pause = useCallback(() => {
    teardown();
    setIsPlaying(false);
  }, [teardown]);

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
    if (gainRef.current) {
      gainRef.current.gain.setTargetAtTime(clamped, gainRef.current.context.currentTime, 0.05);
    }
  }, []);

  // Stop on unmount
  useEffect(() => teardown, [teardown]);

  // Stop when sound type changes while playing
  useEffect(() => {
    if (isPlaying) {
      teardown();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType]);

  return { isPlaying, volume, play, pause, toggle, setVolume };
}
