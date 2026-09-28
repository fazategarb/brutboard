import { useEffect, useRef, useCallback } from 'react';
import { VIZ_COLORS } from '../data/padConfig';

interface AudioVisualizerProps {
  getAnalyserData: () => Uint8Array | null;
  isVisible: boolean;
}

export function AudioVisualizer({ getAnalyserData, isVisible }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const smoothDataRef = useRef<Float32Array | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = getAnalyserData();
    const width = canvas.width;
    const height = canvas.height;

    // Initialize smooth data
    if (!smoothDataRef.current || smoothDataRef.current.length !== (data?.length ?? 32)) {
      smoothDataRef.current = new Float32Array(data?.length ?? 32).fill(0);
    }

    // Clear with slight trail effect for glow feel
    ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
    ctx.fillRect(0, 0, width, height);

    if (data) {
      const barCount = Math.min(data.length, 24);
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        // Smooth the data
        const target = data[i] / 255;
        smoothDataRef.current![i] += (target - smoothDataRef.current![i]) * 0.4;
        const smoothed = smoothDataRef.current![i];

        const barHeight = Math.max(4, smoothed * height * 0.9);
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        const color = VIZ_COLORS[i % VIZ_COLORS.length];

        // Neon glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;

        // Draw bar with brutalist border effect
        ctx.fillRect(x, y, barWidth, barHeight);

        // Top cap (neo-brut style)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth, 3);

        // Draw left border of bar
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(x + barWidth - 2, y, 2, barHeight);
      }
    } else {
      // Idle animation: breathing bars
      const barCount = 24;
      const barWidth = (width / barCount) - 2;
      const now = Date.now() / 1000;

      for (let i = 0; i < barCount; i++) {
        const t = Math.sin(now * 2 + i * 0.5) * 0.5 + 0.5;
        const barHeight = 4 + t * 8;
        const x = i * (barWidth + 2);
        const y = height - barHeight;
        const color = VIZ_COLORS[i % VIZ_COLORS.length];

        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [getAnalyserData]);

  useEffect(() => {
    if (!isVisible) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }

    // Set canvas dimensions
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isVisible, draw]);

  if (!isVisible) return null;

  return (
    <div className="w-full border-[3px] border-[#0a0a0a] bg-[#0a0a0a] relative" style={{ boxShadow: '4px 4px 0px #FFE500' }}>
      {/* Header label */}
      <div className="absolute top-1 left-2 z-10 flex items-center gap-2">
        <span className="text-[#FFE500] text-[9px] font-black font-mono tracking-widest uppercase">
          ◉ FREQ ANALYZER
        </span>
        <span className="inline-flex gap-0.5">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '80px', display: 'block' }}
      />
    </div>
  );
}
