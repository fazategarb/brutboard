import type { PadConfig, ModeConfig, SynthParams } from '../types';

// ─── Note frequencies (Equal Temperament, C3–E5) ───────────────────────────
const NOTE_FREQS: Record<string, number> = {
  a: 130.81, // C3
  s: 146.83, // D3
  d: 164.81, // E3
  f: 174.61, // F3
  g: 196.00, // G3
  h: 220.00, // A3
  j: 246.94, // B3
  k: 261.63, // C4 (middle C)
  l: 293.66, // D4
  q: 329.63, // E4
  w: 349.23, // F4
  e: 392.00, // G4
  r: 440.00, // A4
  t: 493.88, // B4
  y: 523.25, // C5
  u: 587.33, // D5
  i: 659.25, // E5
  o: 698.46, // F5
  p: 783.99, // G5
  z: 880.00, // A5
  x: 987.77, // B5
  c: 1046.50,// C6
  v: 1174.66,// D6
  b: 1318.51,// E6
  n: 1396.91,// F6
  m: 1567.98,// G6
};

// ─── Pad color palette (neon cycling) ──────────────────────────────────────
const PAD_COLORS = [
  'bg-[#FFE500]',
  'bg-[#FF2D78]',
  'bg-[#00F5FF]',
  'bg-[#00FF88]',
  'bg-[#FF6B00]',
  'bg-[#8B00FF]',
  'bg-[#AAFF00]',
  'bg-[#FF1A1A]',
  'bg-[#FFE500]',
  'bg-[#FF2D78]',
  'bg-[#00F5FF]',
  'bg-[#00FF88]',
  'bg-[#FF6B00]',
  'bg-[#8B00FF]',
  'bg-[#AAFF00]',
  'bg-[#FF1A1A]',
  'bg-[#FFE500]',
  'bg-[#FF2D78]',
  'bg-[#00F5FF]',
  'bg-[#00FF88]',
  'bg-[#FF6B00]',
  'bg-[#8B00FF]',
  'bg-[#AAFF00]',
  'bg-[#FF1A1A]',
  'bg-[#FFE500]',
  'bg-[#FF2D78]',
];

const PAD_TEXT_COLORS = [
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
  'text-[#0a0a0a]',
  'text-[#f5f5f0]',
];

const KEYS = 'asdfghjklqwertyuiopzxcvbnm'.split('');

// ─── Meme Mode Labels ────────────────────────────────────────────────────────
const MEME_LABELS: Record<string, string> = {
  a: '🤡 BRUH',   s: '💀 SKULL',  d: '🗿 STONE',  f: '😤 NPC',
  g: '🐸 PEPE',   h: '🎺 SAD',    j: '🤯 MIND=\u2205', k: '😭 CRYING',
  l: '🤙 SHEESH', q: '💅 SLAY',   w: '👀 SUS',    e: '🦆 QUACK',
  r: '🍳 EGG',    t: '🐱 NYAN',   y: '🎵 DING',   u: '🚨 ALERT',
  i: '💥 BOOM',   o: '🤤 DROOL',  p: '👾 ALIEN',  z: '🧠 BRAIN',
  x: '☕ COPIUM',  c: '🌶️ SPICY',  v: '🥴 WOOZY', b: '😂 ROFL',
  n: '🐧 LINUX',  m: '🗑️ TRASH',
};

// ─── Coding Error Mode Labels ────────────────────────────────────────────────
const CODING_LABELS: Record<string, string> = {
  a: '❌ ERR', s: '🚨 BUG', d: '☠️ NULL', f: '🔥 FIRE',
  g: '💾 GIT', h: '📦 NPM', j: '🌀 LOOP', k: '🔑 KEY',
  l: '⚡ LINT', q: '🛑 STOP', w: '⚠️ WARN', e: '📝 LOG',
  r: '🔃 PUSH', t: '📤 PR', y: '✅ CI', u: '🐛 DEBUG',
  i: '💡 IDEA', o: '🔍 GREP', p: '🧪 TEST', z: '🚀 DEPLOY',
  x: '💣 CRASH', c: '📋 COPY', v: '📜 DOCS', b: '🧩 BUILD',
  n: '🔔 NOTIF', m: '🎉 MERGE',
};

export const PAD_CONFIGS: PadConfig[] = KEYS.map((key, i) => ({
  key,
  label: key.toUpperCase(),
  color: PAD_COLORS[i],
  textColor: PAD_TEXT_COLORS[i],
  noteFreq: NOTE_FREQS[key],
})) as PadConfig[];

// ─── Special action pads ─────────────────────────────────────────────────────
export const SPECIAL_PADS = [
  { key: '1', label: '🤡 MEME', color: 'bg-[#FF2D78]', textColor: 'text-[#f5f5f0]', action: 'meme' },
  { key: '2', label: '💻 CODE', color: 'bg-[#00F5FF]', textColor: 'text-[#0a0a0a]', action: 'coding' },
  { key: '3', label: '🌈 VIZ', color: 'bg-[#AAFF00]', textColor: 'text-[#0a0a0a]', action: 'visualizer' },
  { key: '4', label: '🎹 SYNTH', color: 'bg-[#FFE500]', textColor: 'text-[#0a0a0a]', action: 'synth' },
];

export const MEME_LABEL_MAP = MEME_LABELS;
export const CODING_LABEL_MAP = CODING_LABELS;

// ─── Mode definitions ────────────────────────────────────────────────────────
export const MODES: ModeConfig[] = [
  { id: 'synth', label: 'SYNTH', emoji: '🎹', color: '#FFE500', description: 'Oscillator Synthesizer' },
  { id: 'meme', label: 'MEME', emoji: '🤡', color: '#FF2D78', description: 'Viral Meme Sounds' },
  { id: 'coding', label: 'CODE ERR', emoji: '💻', color: '#00F5FF', description: 'Coding SFX & Errors' },
];

// ─── Default synth params ────────────────────────────────────────────────────
export const DEFAULT_SYNTH_PARAMS: SynthParams = {
  oscillatorType: 'sawtooth',
  attack: 0.01,
  release: 0.3,
  filterFreq: 2000,
  filterQ: 5,
  volume: 0.6,
};

// ─── Ticker messages ─────────────────────────────────────────────────────────
export const TICKER_MESSAGES = [
  '⚡ BRUTBOARD — NEO-BRUTALIST SOUNDBOARD',
  '🎹 PRESS A-Z TO PLAY NOTES',
  '🤡 PRESS 1 FOR MEME MODE',
  '💻 PRESS 2 FOR CODING ERROR MODE',
  '🌈 PRESS 3 TO TOGGLE VISUALIZER',
  '🎹 PRESS 4 FOR SYNTH MODE',
  '⚡ MADE WITH REACT + TYPESCRIPT + TAILWIND v4.1',
];

// ─── Neon colors for visualizer ──────────────────────────────────────────────
export const VIZ_COLORS = [
  '#FFE500', '#FF2D78', '#00F5FF', '#00FF88',
  '#FF6B00', '#8B00FF', '#AAFF00', '#FF1A1A',
];
