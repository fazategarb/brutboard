import { SoundPad } from './SoundPad';
import { PAD_CONFIGS } from '../data/padConfig';
import type { SoundMode } from '../types';

interface PadGridProps {
  activePads: Set<string>;
  mode: SoundMode;
  onTrigger: (key: string) => void;
  onRelease: (key: string) => void;
}

export function PadGrid({ activePads, mode, onTrigger, onRelease }: PadGridProps) {
  // 26 letter pads arranged in 5 rows (keyboard-like layout)
  const rows = [
    PAD_CONFIGS.slice(0, 5),    // A S D F G (first 5 keys: a,s,d,f,g)
    PAD_CONFIGS.slice(5, 10),   // H J K L Q
    PAD_CONFIGS.slice(10, 15),  // W E R T Y
    PAD_CONFIGS.slice(15, 20),  // U I O P Z
    PAD_CONFIGS.slice(20, 26),  // X C V B N M
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
        >
          {row.map((pad) => (
            <SoundPad
              key={pad.key}
              padKey={pad.key}
              label={pad.label}
              color={(pad as any).color}
              textColor={(pad as any).textColor ?? 'text-[#0a0a0a]'}
              isPressed={activePads.has(pad.key)}
              mode={mode}
              onTrigger={onTrigger}
              onRelease={onRelease}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
