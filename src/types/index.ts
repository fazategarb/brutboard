// TypeScript interfaces for BRUTBOARD

export type SoundMode = 'synth' | 'meme' | 'coding';

export interface PadConfig {
  key: string;         // keyboard key (a-z, etc.)
  label: string;       // display label
  color: string;       // Tailwind bg color class
  noteFreq?: number;   // frequency in Hz for synth mode
  soundUrl?: string;   // URL for audio sample
}

export interface ModeConfig {
  id: SoundMode;
  label: string;
  emoji: string;
  color: string;       // active color
  description: string;
}

export interface SynthParams {
  oscillatorType: OscillatorType;
  attack: number;
  release: number;
  filterFreq: number;
  filterQ: number;
  volume: number;
}

export interface VisualizerBar {
  id: number;
  height: number;
  color: string;
}

export interface ActivePad {
  key: string;
  timestamp: number;
}
