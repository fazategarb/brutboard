import { motion } from 'framer-motion';
import type { SoundMode } from '../types';
import { MEME_LABEL_MAP, CODING_LABEL_MAP } from '../data/padConfig';
import { MEME_SOUND_CONFIG, CODING_SOUND_CONFIG } from '../data/soundConfig';

interface SoundPadProps {
  padKey: string;
  label: string;
  color: string;       // bg color class
  textColor: string;
  isPressed: boolean;
  mode: SoundMode;
  onTrigger: (key: string) => void;
  onRelease: (key: string) => void;
}

export function SoundPad({
  padKey,
  label,
  color,
  textColor,
  isPressed,
  mode,
  onTrigger,
  onRelease,
}: SoundPadProps) {
  const getDisplayLabel = () => {
    if (mode === 'meme') return MEME_LABEL_MAP[padKey] ?? label;
    if (mode === 'coding') return CODING_LABEL_MAP[padKey] ?? label;
    return label;
  };

  const getTooltip = () => {
    if (mode === 'meme') return MEME_SOUND_CONFIG[padKey]?.description;
    if (mode === 'coding') return CODING_SOUND_CONFIG[padKey]?.description;
    return null;
  };

  const displayLabel = getDisplayLabel();
  const tooltip = getTooltip();
  const isMemeOrCoding = mode !== 'synth';

  // Spring animation variants for the neo-brut press effect
  const padVariants = {
    idle: {
      x: 0,
      y: 0,
      boxShadow: '4px 4px 0px #0a0a0a',
      scale: 1,
    },
    hover: {
      x: -2,
      y: -2,
      boxShadow: '6px 6px 0px #0a0a0a',
      scale: 1.02,
    },
    pressed: {
      x: 3,
      y: 3,
      boxShadow: '1px 1px 0px #0a0a0a',
      scale: 0.97,
    },
  };

  return (
    <motion.div
      className={`
        ${color} ${textColor}
        relative flex flex-col items-center justify-center
        rounded-none border-[3px] border-[#0a0a0a]
        cursor-pointer select-none
        font-[Lexend_Mega] font-black
        min-h-[80px] sm:min-h-[90px]
        overflow-hidden
        group
      `}
      variants={padVariants}
      initial="idle"
      animate={isPressed ? 'pressed' : 'idle'}
      whileHover={isPressed ? 'pressed' : 'hover'}
      transition={{
        type: 'spring',
        stiffness: 600,
        damping: 20,
        mass: 0.5,
      }}
      onMouseDown={() => onTrigger(padKey)}
      onMouseUp={() => onRelease(padKey)}
      onMouseLeave={() => onRelease(padKey)}
      onTouchStart={(e) => { e.preventDefault(); onTrigger(padKey); }}
      onTouchEnd={(e) => { e.preventDefault(); onRelease(padKey); }}
      title={tooltip ?? undefined}
    >
      {/* Key label badge */}
      <span
        className="
          absolute top-1 left-1.5
          text-[9px] font-black opacity-70
          font-[Space_Mono]
          leading-none
        "
      >
        {padKey.toUpperCase()}
      </span>

      {/* Main label */}
      <span
        className={`
          text-center leading-tight px-1
          ${isMemeOrCoding ? 'text-[10px] sm:text-[11px]' : 'text-[20px] sm:text-[24px]'}
          font-black
        `}
      >
        {displayLabel}
      </span>

      {/* Pressed flash overlay */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Ripple on press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 border-[3px] border-white"
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
