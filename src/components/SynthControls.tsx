import { useCallback, useEffect, useRef } from 'react';
import type { SynthParams } from '../types';

interface SynthControlsProps {
  onParamChange: (params: Partial<SynthParams>) => void;
  synthParams: SynthParams;
}

const OSC_TYPES: OscillatorType[] = ['sawtooth', 'square', 'sine', 'triangle'];

const OSC_LABELS: Record<OscillatorType, string> = {
  sawtooth: 'SAW',
  square: 'SQR',
  sine: 'SIN',
  triangle: 'TRI',
  custom: 'CUST',
};

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  color: string;
  onChange: (v: number) => void;
}

function Knob({ label, value, min, max, step = 1, color, onChange }: KnobProps) {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startValue = useRef(value);

  const normalized = (value - min) / (max - min);
  const rotation = -135 + normalized * 270; // -135deg to +135deg

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startValue.current = value;
    document.body.style.cursor = 'ns-resize';
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = (startY.current - e.clientY) / 100;
      const range = max - min;
      const newValue = Math.min(max, Math.max(min, startValue.current + delta * range));
      const stepped = step < 1 ? newValue : Math.round(newValue / step) * step;
      onChange(stepped);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [min, max, step, onChange]);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Knob dial */}
      <div
        className="relative w-12 h-12 rounded-full border-[3px] border-[#0a0a0a] cursor-ns-resize select-none"
        style={{ backgroundColor: color, boxShadow: '3px 3px 0px #0a0a0a' }}
        onMouseDown={handleMouseDown}
      >
        {/* Indicator line */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-0.5 h-4 bg-[#0a0a0a] origin-bottom" style={{ marginTop: '-8px' }} />
        </div>
      </div>
      {/* Label */}
      <span className="text-[8px] font-black text-[#f5f5f0] font-mono uppercase tracking-widest text-center leading-none">
        {label}
      </span>
      <span className="text-[8px] font-bold text-[#888] font-mono">
        {typeof value === 'number' && value < 10 ? value.toFixed(2) : Math.round(value)}
      </span>
    </div>
  );
}

export function SynthControls({ onParamChange, synthParams }: SynthControlsProps) {
  return (
    <div
      className="border-[3px] border-[#0a0a0a] bg-[#111] p-3 flex flex-col gap-3"
      style={{ boxShadow: '4px 4px 0px #FFE500' }}
    >
      {/* Panel title */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-[#FFE500] font-mono uppercase tracking-widest">
          ⚙ SYNTH ENGINE
        </span>
        <div className="flex-1 h-[2px] bg-[#FFE500]" />
      </div>

      {/* Oscillator type selector */}
      <div>
        <span className="text-[9px] font-bold text-[#888] font-mono uppercase block mb-1.5">OSC TYPE</span>
        <div className="flex gap-1.5">
          {OSC_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onParamChange({ oscillatorType: type })}
              className={`
                flex-1 py-1 border-[2px] border-[#0a0a0a]
                text-[9px] font-black font-mono
                cursor-pointer
                transition-all duration-75
              `}
              style={{
                backgroundColor: synthParams.oscillatorType === type ? '#FFE500' : '#1a1a1a',
                color: synthParams.oscillatorType === type ? '#0a0a0a' : '#888',
                boxShadow: synthParams.oscillatorType === type ? '2px 2px 0px #0a0a0a' : '2px 2px 0px #333',
              }}
            >
              {OSC_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Knobs row */}
      <div className="flex justify-around">
        <Knob
          label="ATTACK"
          value={synthParams.attack}
          min={0.001}
          max={0.5}
          step={0.001}
          color="#FF2D78"
          onChange={(v) => onParamChange({ attack: v })}
        />
        <Knob
          label="RELEASE"
          value={synthParams.release}
          min={0.05}
          max={2}
          step={0.01}
          color="#00F5FF"
          onChange={(v) => onParamChange({ release: v })}
        />
        <Knob
          label="FILTER"
          value={synthParams.filterFreq}
          min={200}
          max={8000}
          step={10}
          color="#AAFF00"
          onChange={(v) => onParamChange({ filterFreq: v })}
        />
        <Knob
          label="RESO"
          value={synthParams.filterQ}
          min={0.1}
          max={20}
          step={0.1}
          color="#FF6B00"
          onChange={(v) => onParamChange({ filterQ: v })}
        />
        <Knob
          label="VOL"
          value={synthParams.volume}
          min={0}
          max={1}
          step={0.01}
          color="#8B00FF"
          onChange={(v) => onParamChange({ volume: v })}
        />
      </div>
    </div>
  );
}
