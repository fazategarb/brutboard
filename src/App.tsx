import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { PadGrid } from './components/PadGrid';
import { ModeSelector } from './components/ModeSelector';
import { AudioVisualizer } from './components/AudioVisualizer';
import { SynthControls } from './components/SynthControls';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useKeyboard } from './hooks/useKeyboard';
import { PAD_CONFIGS, DEFAULT_SYNTH_PARAMS, MEME_LABEL_MAP, CODING_LABEL_MAP } from './data/padConfig';
import type { SoundMode, SynthParams } from './types';

const VALID_KEYS = new Set(PAD_CONFIGS.map((p) => p.key));
const MODE_KEYS: Record<string, SoundMode | 'visualizer'> = {
  '1': 'meme',
  '2': 'coding',
  '3': 'visualizer',
  '4': 'synth',
};

function App() {
  const [activePads, setActivePads] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<SoundMode>('synth');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [synthParams, setSynthParams] = useState<SynthParams>(DEFAULT_SYNTH_PARAMS);
  const [lastTriggered, setLastTriggered] = useState<{ key: string; label: string } | null>(null);
  const lastTriggeredTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { triggerPad, getAnalyserData, updateSynthParams } = useAudioEngine();

  // ─── Get pad label for current mode ───────────────────────────────────────
  const getPadLabel = useCallback((key: string): string => {
    if (mode === 'meme') return MEME_LABEL_MAP[key] ?? key.toUpperCase();
    if (mode === 'coding') return CODING_LABEL_MAP[key] ?? key.toUpperCase();
    return key.toUpperCase();
  }, [mode]);

  // ─── Trigger a pad ─────────────────────────────────────────────────────────
  const handleTrigger = useCallback((key: string) => {
    if (!VALID_KEYS.has(key)) return;

    const pad = PAD_CONFIGS.find((p) => p.key === key);
    if (!pad) return;

    setActivePads((prev) => new Set([...prev, key]));
    triggerPad(key, pad.noteFreq ?? 440, mode);

    // Update last triggered display
    const label = getPadLabel(key);
    setLastTriggered({ key, label });
    if (lastTriggeredTimer.current) clearTimeout(lastTriggeredTimer.current);
    lastTriggeredTimer.current = setTimeout(() => setLastTriggered(null), 2000);
  }, [mode, triggerPad, getPadLabel]);

  // ─── Release a pad ─────────────────────────────────────────────────────────
  const handleRelease = useCallback((key: string) => {
    setActivePads((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  // ─── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((key: string) => {
    // Mode switching keys
    if (MODE_KEYS[key]) {
      const action = MODE_KEYS[key];
      if (action === 'visualizer') {
        setShowVisualizer((v) => !v);
      } else {
        setMode(action as SoundMode);
      }
      return;
    }
    handleTrigger(key);
  }, [handleTrigger]);

  const handleKeyUp = useCallback((key: string) => {
    handleRelease(key);
  }, [handleRelease]);

  useKeyboard({ onKeyDown: handleKeyDown, onKeyUp: handleKeyUp });

  // ─── Synth param change ────────────────────────────────────────────────────
  const handleParamChange = useCallback((params: Partial<SynthParams>) => {
    setSynthParams((prev) => {
      const next = { ...prev, ...params };
      updateSynthParams(next);
      return next;
    });
  }, [updateSynthParams]);

  // ─── Mode background color ─────────────────────────────────────────────────
  const modeBg: Record<SoundMode, string> = {
    synth: '#1a1600',
    meme: '#1a0010',
    coding: '#001a1a',
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: modeBg[mode], transition: 'background-color 0.4s ease' }}
    >
      {/* Header */}
      <Header
        currentMode={mode}
        activePadCount={activePads.size}
        lastTriggeredKey={lastTriggered?.key ?? null}
        lastTriggeredLabel={lastTriggered?.label ?? null}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0">

        {/* ── Left panel: Pad Grid ── */}
        <section className="flex-1 p-3 sm:p-4 flex flex-col gap-3">

          {/* Mode selector */}
          <ModeSelector
            currentMode={mode}
            onModeChange={setMode}
            showVisualizer={showVisualizer}
            onToggleVisualizer={() => setShowVisualizer((v) => !v)}
          />

          {/* Visualizer */}
          <AnimatePresence>
            {showVisualizer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ overflow: 'hidden' }}
              >
                <AudioVisualizer
                  getAnalyserData={getAnalyserData}
                  isVisible={showVisualizer}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pad grid */}
          <PadGrid
            activePads={activePads}
            mode={mode}
            onTrigger={handleTrigger}
            onRelease={handleRelease}
          />
        </section>

        {/* ── Right panel: Synth Controls (only in synth mode) ── */}
        <AnimatePresence>
          {mode === 'synth' && (
            <motion.aside
              className="lg:w-72 p-3 sm:p-4 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-[#333] flex flex-col gap-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SynthControls
                synthParams={synthParams}
                onParamChange={handleParamChange}
              />

              {/* Keyboard shortcuts reference */}
              <div
                className="border-[3px] border-[#333] p-3 bg-[#0d0d0d]"
                style={{ boxShadow: '4px 4px 0px #333' }}
              >
                <span className="text-[10px] font-black text-[#888] font-mono uppercase tracking-widest block mb-2">
                  ⌨ KEYBOARD SHORTCUTS
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    { key: '1', desc: 'Switch → Meme Mode' },
                    { key: '2', desc: 'Switch → Code Mode' },
                    { key: '3', desc: 'Toggle Visualizer' },
                    { key: '4', desc: 'Switch → Synth Mode' },
                    { key: 'A–Z', desc: 'Play pads' },
                  ].map(({ key, desc }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="
                          text-[9px] font-mono font-black text-[#0a0a0a] bg-[#FFE500]
                          border-[2px] border-[#0a0a0a] px-1.5 py-0.5 min-w-[32px] text-center
                        "
                        style={{ boxShadow: '1px 1px 0px #0a0a0a' }}
                      >
                        {key}
                      </span>
                      <span className="text-[9px] font-mono text-[#666]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer credit */}
              <div className="mt-auto">
                <div className="border-[2px] border-[#333] p-2 bg-[#0a0a0a]">
                  <p className="text-[8px] font-mono text-[#444] text-center uppercase tracking-widest">
                    ⚡ Built with React + TS + Tailwind v4.1
                  </p>
                  <p className="text-[8px] font-mono text-[#333] text-center uppercase tracking-widest mt-0.5">
                    Web Audio API + Framer Motion
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Fun mode info panel for meme / coding modes */}
        <AnimatePresence>
          {mode !== 'synth' && (
            <motion.aside
              className="lg:w-64 p-3 sm:p-4 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-[#333] flex flex-col gap-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Last triggered big display */}
              <div
                className="border-[3px] border-[#0a0a0a] p-4 flex flex-col items-center justify-center min-h-[120px] text-center"
                style={{
                  backgroundColor: mode === 'meme' ? '#FF2D78' : '#00F5FF',
                  boxShadow: '6px 6px 0px #0a0a0a',
                }}
              >
                {lastTriggered ? (
                  <motion.div
                    key={lastTriggered.key + lastTriggered.label}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-4xl">{lastTriggered.label.split(' ')[0]}</span>
                    <span className="text-[11px] font-black text-[#0a0a0a] uppercase tracking-tight">
                      [{lastTriggered.key.toUpperCase()}] {lastTriggered.label.replace(/^[^\s]+\s/, '')}
                    </span>
                  </motion.div>
                ) : (
                  <span className="text-[10px] font-black text-[#0a0a0a] opacity-60 uppercase tracking-widest">
                    {mode === 'meme' ? '🤡 Press any key!' : '💻 Trigger a bug!'}
                  </span>
                )}
              </div>

              {/* Mode description */}
              <div className="border-[3px] border-[#333] p-3 bg-[#0d0d0d]" style={{ boxShadow: '4px 4px 0px #333' }}>
                <p className="text-[10px] font-mono font-black uppercase tracking-widest text-[#888] mb-1">
                  {mode === 'meme' ? '🤡 MEME MODE' : '💻 CODING ERR MODE'}
                </p>
                <p className="text-[9px] font-mono text-[#555] leading-relaxed">
                  {mode === 'meme'
                    ? 'Each pad plays a unique meme-inspired synthesized sound. Press keys rapidly for maximum chaos.'
                    : 'Each pad simulates a coding disaster sound. Perfect for when production is on fire.'}
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
