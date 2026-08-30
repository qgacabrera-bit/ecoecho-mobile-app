import React, { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';

interface WaveformProps {
  height?: number;
  showDetails?: boolean;
}

export const AcousticWaveformVisualizer: React.FC<WaveformProps> = ({ 
  height = 56, 
  showDetails = true 
}) => {
  const { telemetry, mode, isTestingSweep, config } = useDevice();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const minKhz = config?.sweepMinKhz ?? 20.0;
  const maxKhz = config?.sweepMaxKhz ?? 45.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const isJamming = telemetry.activeJammingPulse || isTestingSweep;
      const freqKhz = telemetry.currentFrequencyKhz;
      
      // Calculate wave parameters based on actual configured sweep range
      const range = maxKhz - minKhz || 1;
      const baseFreq = 0.04 + (Math.max(0, freqKhz - minKhz) / range) * 0.08;
      const amplitude = isJamming ? h * 0.38 : (mode === 'DYNAMIC' ? h * 0.22 : h * 0.28);
      const waveSpeed = isJamming ? 0.24 : 0.08;

      // Draw background reference grid
      ctx.strokeStyle = 'rgba(45, 106, 79, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(width, h / 2);
      ctx.stroke();

      // Secondary harmonics wave
      ctx.beginPath();
      ctx.strokeStyle = isJamming ? 'rgba(245, 158, 11, 0.4)' : 'rgba(82, 183, 136, 0.35)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x++) {
        const y = h / 2 + Math.sin(x * baseFreq * 1.5 + phase * 1.2) * (amplitude * 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Primary ultrasonic acoustic waveform
      ctx.beginPath();
      ctx.strokeStyle = isJamming 
        ? '#F59E0B' // Solar amber for jamming pulse
        : '#52B788'; // Leaf green for standard sweep
      ctx.lineWidth = isJamming ? 3 : 2;
      ctx.shadowBlur = isJamming ? 10 : 4;
      ctx.shadowColor = isJamming ? '#F59E0B' : '#52B788';

      for (let x = 0; x < width; x++) {
        const y = h / 2 + Math.sin(x * baseFreq + phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      phase += waveSpeed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [telemetry.activeJammingPulse, telemetry.currentFrequencyKhz, isTestingSweep, mode, minKhz, maxKhz]);

  return (
    <div className="w-full bg-forest-950/70 border border-forest-800/40 rounded-xl p-3 backdrop-blur-md overflow-hidden relative shadow-inner">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            telemetry.activeJammingPulse || isTestingSweep 
              ? 'bg-solar-400 animate-ping' 
              : 'bg-forest-500 animate-pulse'
          }`} />
          <span className="font-mono text-forest-200 font-semibold tracking-wide uppercase text-[11px]">
            {telemetry.activeJammingPulse || isTestingSweep 
              ? '⚡ Active Pest-Repelling Sound' 
              : (mode === 'AUTOMATIC' ? '📡 Pitch-Shifting Sound Shield' : '🎯 AI Vision Guard (Silent Standby)')}
          </span>
        </div>
        {showDetails && (
          <div className="font-mono text-solar-400 font-bold bg-forest-900/90 px-2 py-0.5 rounded border border-forest-700/50">
            {telemetry.currentFrequencyKhz.toFixed(1)} kHz
          </div>
        )}
      </div>

      <div className="relative w-full h-[52px] flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={420} 
          height={52} 
          className="w-full h-full block"
        />
        
        {/* Dynamic configured frequency tags */}
        <div className="absolute left-2 bottom-1 text-[9px] font-mono text-forest-400/80">
          {minKhz.toFixed(1)} kHz (Min)
        </div>
        <div className="absolute right-2 bottom-1 text-[9px] font-mono text-forest-400/80">
          {maxKhz.toFixed(1)} kHz (Max)
        </div>
      </div>
    </div>
  );
};
