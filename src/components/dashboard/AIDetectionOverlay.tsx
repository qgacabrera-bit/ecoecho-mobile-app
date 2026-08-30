import React from 'react';
import { AIDetectionEvent } from '../../types';
import { useDevice } from '../../context/DeviceContext';
import { Target, Zap, AlertCircle } from 'lucide-react';

interface OverlayProps {
  detections: AIDetectionEvent[];
}

export const AIDetectionOverlay: React.FC<OverlayProps> = ({ detections }) => {
  const { mode, telemetry, isTestingSweep } = useDevice();
  const isJamming = telemetry.activeJammingPulse || isTestingSweep;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Dynamic HUD scan line */}
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent shadow-[0_0_8px_#52B788] animate-scan pointer-events-none opacity-60" />

      {/* Grid crosshair at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-30 flex items-center justify-center">
        <div className="w-8 h-[1px] bg-emerald-400" />
        <div className="h-8 w-[1px] bg-emerald-400 absolute" />
      </div>

      {/* Bounding Box Overlays */}
      {detections.map((detection) => {
        const { bbox, id, pestType, confidence, scientificName } = detection;
        const isBPH = pestType === 'Brown Planthopper';
        const borderColor = isJamming 
          ? 'border-solar-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]' 
          : (isBPH ? 'border-emerald-400 shadow-[0_0_10px_rgba(82,183,136,0.6)]' : 'border-amber-400');
        const badgeBg = isJamming ? 'bg-solar-500 text-forest-950' : 'bg-forest-900/90 text-emerald-300';

        return (
          <div
            key={id}
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              left: `${bbox.x}%`,
              top: `${bbox.y}%`,
              width: `${bbox.width}%`,
              height: `${bbox.height}%`,
            }}
          >
            {/* Ultrasonic pulse ripples if jammed */}
            {isJamming && (
              <div className="absolute inset-0 -m-3 rounded-xl border-2 border-solar-400/80 animate-ping pointer-events-none" />
            )}

            {/* Bounding Box Frame */}
            <div className={`w-full h-full border-2 ${borderColor} rounded-lg relative transition-all duration-200`}>
              
              {/* Corner targeting brackets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

              {/* Top AI Tag / Label */}
              <div className="absolute -top-7 left-0 whitespace-nowrap z-20">
                <div className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md ${badgeBg}`}>
                  {isJamming ? (
                    <Zap className="w-2.5 h-2.5 text-forest-950 animate-bounce" />
                  ) : (
                    <Target className="w-2.5 h-2.5 text-emerald-400" />
                  )}
                  <span>{pestType}</span>
                  <span className="font-mono font-bold">{(confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Bottom Acoustic Status Tag */}
              <div className="absolute -bottom-5 left-0 whitespace-nowrap z-20">
                <div className="bg-forest-950/85 text-forest-200 text-[9px] font-mono px-1.5 py-0.2 rounded border border-forest-700/60 flex items-center gap-1">
                  <span>{isJamming ? '⚡ Jamming (20-45kHz)' : '🎯 AI Lock'}</span>
                  <span className="text-forest-400 italic">[{scientificName}]</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
