import { useState, useEffect } from 'react';
import { TICKER_MESSAGES } from '../data/padConfig';

interface HeaderProps {
  currentMode: string;
  activePadCount: number;
  lastTriggeredKey: string | null;
  lastTriggeredLabel: string | null;
}

export function Header({ currentMode, activePadCount, lastTriggeredKey, lastTriggeredLabel }: HeaderProps) {
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const modeColors: Record<string, string> = {
    synth: '#FFE500',
    meme: '#FF2D78',
    coding: '#00F5FF',
  };

  const modeColor = modeColors[currentMode] ?? '#FFE500';

  return (
    <header className="w-full">
      {/* Main header bar */}
      <div
        className="border-b-[3px] border-[#0a0a0a] px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ backgroundColor: modeColor, transition: 'background-color 0.3s ease' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-[#0a0a0a] leading-none tracking-tighter glitch-text">
            ⚡ BRUTBOARD
          </span>
          <span
            className="
              text-[9px] font-black text-[#0a0a0a] uppercase
              border-[2px] border-[#0a0a0a] px-1.5 py-0.5
              font-mono tracking-widest
            "
          >
            v1.0
          </span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active pads counter */}
          <div className="border-[2px] border-[#0a0a0a] bg-[#0a0a0a] text-[#FFE500] px-2 py-1 text-[10px] font-mono font-bold">
            PADS: {activePadCount}/26
          </div>

          {/* Last triggered */}
          {lastTriggeredKey && (
            <div className="border-[2px] border-[#0a0a0a] bg-[#0a0a0a] text-[#00FF88] px-2 py-1 text-[10px] font-mono font-bold animate-pulse">
              ▶ [{lastTriggeredKey.toUpperCase()}] {lastTriggeredLabel}
            </div>
          )}

          {/* Mode indicator */}
          <div
            className="border-[2px] border-[#0a0a0a] px-2 py-1 text-[10px] font-mono font-bold bg-[#0a0a0a]"
            style={{ color: modeColor }}
          >
            MODE: {currentMode.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="ticker-tape bg-[#0a0a0a] py-1.5 overflow-hidden">
        <div className="marquee-inner text-[10px] font-mono text-[#FFE500] tracking-widest font-bold">
          {TICKER_MESSAGES.map((msg, i) => (
            <span key={i} className="mx-8">{msg}</span>
          ))}
          {/* Repeat for seamless loop */}
          {TICKER_MESSAGES.map((msg, i) => (
            <span key={`r${i}`} className="mx-8">{msg}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
