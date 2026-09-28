import { motion } from 'framer-motion';
import { MODES } from '../data/padConfig';
import type { SoundMode } from '../types';

interface ModeSelectorProps {
  currentMode: SoundMode;
  onModeChange: (mode: SoundMode) => void;
  showVisualizer: boolean;
  onToggleVisualizer: () => void;
}

const MODE_BG: Record<SoundMode, string> = {
  synth: '#FFE500',
  meme: '#FF2D78',
  coding: '#00F5FF',
};

export function ModeSelector({ currentMode, onModeChange, showVisualizer, onToggleVisualizer }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {MODES.map((m) => {
        const isActive = currentMode === m.id;
        return (
          <motion.button
            key={m.id}
            className={`
              px-3 py-1.5
              border-[3px] border-[#0a0a0a]
              font-[Lexend_Mega] font-black text-[10px] sm:text-xs
              text-[#0a0a0a]
              uppercase tracking-tight
              cursor-pointer
              flex items-center gap-1.5
            `}
            style={{
              backgroundColor: isActive ? MODE_BG[m.id] : '#1a1a1a',
              color: isActive ? '#0a0a0a' : '#f5f5f0',
              boxShadow: isActive ? '2px 2px 0px #0a0a0a' : '4px 4px 0px #0a0a0a',
            }}
            onClick={() => onModeChange(m.id)}
            whileHover={{ x: -1, y: -1, boxShadow: '5px 5px 0px #0a0a0a' }}
            whileTap={{ x: 2, y: 2, boxShadow: '1px 1px 0px #0a0a0a' }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            aria-pressed={isActive}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
            {isActive && (
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Divider */}
      <div className="w-[3px] h-8 bg-[#333] hidden sm:block" />

      {/* Visualizer toggle */}
      <motion.button
        className="
          px-3 py-1.5
          border-[3px] border-[#0a0a0a]
          font-[Lexend_Mega] font-black text-[10px] sm:text-xs
          uppercase tracking-tight
          cursor-pointer
          flex items-center gap-1.5
        "
        style={{
          backgroundColor: showVisualizer ? '#AAFF00' : '#1a1a1a',
          color: showVisualizer ? '#0a0a0a' : '#f5f5f0',
          boxShadow: showVisualizer ? '2px 2px 0px #0a0a0a' : '4px 4px 0px #0a0a0a',
        }}
        onClick={onToggleVisualizer}
        whileHover={{ x: -1, y: -1, boxShadow: '5px 5px 0px #0a0a0a' }}
        whileTap={{ x: 2, y: 2, boxShadow: '1px 1px 0px #0a0a0a' }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        🌈 VIZ {showVisualizer ? 'ON' : 'OFF'}
      </motion.button>
    </div>
  );
}
