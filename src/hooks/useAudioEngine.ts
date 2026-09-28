import { useRef, useCallback } from 'react';
import type { SynthParams, SoundMode } from '../types';
import { DEFAULT_SYNTH_PARAMS } from '../data/padConfig';

// ─── Meme sound frequencies (fun quirky tones to simulate meme sounds) ───────
const MEME_FREQS: Record<string, [number, string, number]> = {
  // [freq, oscillatorType, duration]
  a: [80, 'sawtooth', 0.4],     // BRUH - deep bass drop
  s: [200, 'square', 0.15],      // SKULL - short beep
  d: [60, 'sawtooth', 0.6],      // STONE - very low rumble
  f: [440, 'square', 0.08],      // NPC - robotic blip
  g: [330, 'sine', 0.5],         // PEPE - soft frog bloop
  h: [180, 'sawtooth', 0.8],     // SAD TROMBONE - descending
  j: [880, 'sawtooth', 0.3],     // MIND BLOWN - high pitched
  k: [220, 'sine', 0.4],         // CRYING - wobbly tone
  l: [660, 'sawtooth', 0.2],     // SHEESH - sharp
  q: [550, 'sine', 0.3],         // SLAY - smooth high
  w: [400, 'square', 0.1],       // SUS - sharp beep
  e: [300, 'sine', 0.3],         // QUACK - duck-like
  r: [250, 'sawtooth', 0.4],     // EGG - medium
  t: [523, 'sine', 0.6],         // NYAN - C note
  y: [1046, 'sine', 0.2],        // DING - high bell
  u: [200, 'square', 0.5],       // ALERT - alarm
  i: [150, 'sawtooth', 0.3],     // BOOM - bass
  o: [350, 'sine', 0.4],         // DROOL - smooth
  p: [700, 'square', 0.15],      // ALIEN - space
  z: [440, 'sine', 0.5],         // BIG BRAIN - A4
  x: [110, 'sawtooth', 0.3],     // COPIUM - deep
  c: [800, 'sawtooth', 0.2],     // SPICY - sharp
  v: [280, 'sine', 0.5],         // WOOZY - warble
  b: [600, 'square', 0.1],       // ROFL - short burst
  n: [392, 'square', 0.4],       // LINUX - steady
  m: [494, 'sawtooth', 0.2],     // TRASH - medium high
};

// ─── Coding SFX frequencies ──────────────────────────────────────────────────
const CODING_FREQS: Record<string, [number, string, number]> = {
  a: [100, 'sawtooth', 0.5],    // ERROR 500 - error buzz
  s: [200, 'square', 0.3],       // BUG - alarm
  d: [50, 'sawtooth', 0.4],      // NULL PTR - deep crash
  f: [150, 'sawtooth', 0.6],     // ON FIRE - crackling
  g: [523, 'sine', 0.2],         // GIT PUSH - success ding
  h: [300, 'square', 0.4],       // NPM - processing
  j: [220, 'square', 0.8],       // INF LOOP - repeating
  k: [400, 'square', 0.15],      // WRONG KEY - blip
  l: [350, 'sawtooth', 0.3],     // LINT - warning
  q: [80, 'square', 0.6],        // STOP - low halt
  w: [440, 'square', 0.2],       // DEPRECATE - beep
  e: [660, 'sine', 0.1],         // CONSOLE.LOG - ping
  r: [900, 'sawtooth', 0.3],     // FORCE PUSH - high danger
  t: [700, 'sine', 0.25],        // OPEN PR - medium ping
  y: [1200, 'sine', 0.3],        // CI PASS - high success
  u: [250, 'square', 0.4],       // DEBUGGER - step sound
  i: [600, 'sine', 0.3],         // IDEA - lightbulb
  o: [380, 'sine', 0.3],         // GREP - search
  p: [200, 'sawtooth', 0.5],     // UNIT TEST - fail buzz
  z: [1046, 'sine', 0.4],        // DEPLOY - launch
  x: [60, 'sawtooth', 0.7],      // SEGFAULT - deep crash
  c: [550, 'square', 0.2],       // COPY - clipboard
  v: [300, 'sine', 0.3],         // DOCS - hm sound
  b: [400, 'sawtooth', 0.4],     // BUILD - processing
  n: [800, 'square', 0.1],       // NOTIF - ping
  m: [1046, 'sine', 0.5],        // MERGED - celebration
};

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthParamsRef = useRef<SynthParams>(DEFAULT_SYNTH_PARAMS);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // ─── Initialize AudioContext (lazy, on first interaction) ───────────────
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(audioCtxRef.current.destination);
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // ─── Play synthesizer note ───────────────────────────────────────────────
  const playSynthNote = useCallback((freq: number) => {
    const ctx = getAudioContext();
    const params = synthParamsRef.current;

    const now = ctx.currentTime;

    // Oscillator
    const osc = ctx.createOscillator();
    osc.type = params.oscillatorType;
    osc.frequency.setValueAtTime(freq, now);

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(params.filterFreq, now);
    filter.Q.setValueAtTime(params.filterQ, now);

    // Envelope (VCA)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(params.volume, now + params.attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + params.attack + params.release);

    // Chain: osc → filter → gain → analyser
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(analyserRef.current ?? ctx.destination);

    osc.start(now);
    osc.stop(now + params.attack + params.release + 0.1);
  }, [getAudioContext]);

  // ─── Play quirky sound (meme / coding) ──────────────────────────────────
  const playQuirkySound = useCallback((key: string, mode: 'meme' | 'coding') => {
    const ctx = getAudioContext();
    const freqMap = mode === 'meme' ? MEME_FREQS : CODING_FREQS;
    const config = freqMap[key];
    if (!config) return;

    const [baseFreq, oscType, duration] = config;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = oscType as OscillatorType;

    // Add pitch modulation for quirkiness
    if (mode === 'meme') {
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + duration * 0.3);
    } else {
      osc.frequency.setValueAtTime(baseFreq, now);
      if (key === 'j') {
        // Infinite loop: stuttering effect
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.setValueAtTime(baseFreq * 1.2, now + 0.1);
        osc.frequency.setValueAtTime(baseFreq, now + 0.2);
      }
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Add distortion for meme sounds
    if (mode === 'meme') {
      const waveshaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (3 + 20) * x * 20 * (Math.PI / 180) / (Math.PI + 20 * Math.abs(x));
      }
      waveshaper.curve = curve;
      osc.connect(waveshaper);
      waveshaper.connect(gainNode);
    } else {
      osc.connect(gainNode);
    }

    gainNode.connect(analyserRef.current ?? ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }, [getAudioContext]);

  // ─── Main trigger function ───────────────────────────────────────────────
  const triggerPad = useCallback((key: string, freq: number, mode: SoundMode) => {
    if (mode === 'synth') {
      playSynthNote(freq);
    } else {
      playQuirkySound(key, mode);
    }
  }, [playSynthNote, playQuirkySound]);

  // ─── Get analyser data for visualizer ───────────────────────────────────
  const getAnalyserData = useCallback((): Uint8Array | null => {
    if (!analyserRef.current) return null;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  // ─── Update synth params ─────────────────────────────────────────────────
  const updateSynthParams = useCallback((params: Partial<SynthParams>) => {
    synthParamsRef.current = { ...synthParamsRef.current, ...params };
  }, []);

  return {
    triggerPad,
    getAnalyserData,
    updateSynthParams,
    analyserRef,
  };
}
