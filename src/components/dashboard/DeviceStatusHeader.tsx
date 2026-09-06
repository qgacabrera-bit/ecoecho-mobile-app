import React, { useState } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const DeviceStatusHeader: React.FC = () => {
  const { telemetry, detections, mode, isTestingSweep, config } = useDevice();
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const isAlarmOrJamming = detections.length > 0 || telemetry.activeJammingPulse || isTestingSweep;
  const minKhz = config?.sweepMinKhz ? config.sweepMinKhz.toFixed(1) : '20.0';
  const maxKhz = config?.sweepMaxKhz ? config.sweepMaxKhz.toFixed(1) : '45.0';

  return (
    <div className="space-y-2">
      {/* Sleek, Compact Low-Profile Status Strip */}
      <div className={`px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-2xl border transition-all shadow-xs flex items-center justify-between gap-2.5 ${
        isAlarmOrJamming
          ? 'bg-amber-950/90 border-amber-500/80 text-white animate-pulse'
          : 'bg-forest-950/90 backdrop-blur-sm border-forest-800/80 text-white'
      }`}>
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isAlarmOrJamming 
              ? 'bg-amber-500 text-forest-950' 
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isAlarmOrJamming ? (
              <ShieldAlert className="w-4 h-4 animate-bounce" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 text-xs">
            <span className="font-bold text-white tracking-tight shrink-0">
              {isAlarmOrJamming ? 'Pest Detected' : 'Field Protected'}
            </span>
            <span className="hidden xs:inline text-forest-500">•</span>
            <span className="text-forest-200/90 text-[11px] truncate">
              {isAlarmOrJamming
                ? `Repelling pest at ${telemetry.currentFrequencyKhz.toFixed(1)} kHz`
                : mode === 'DYNAMIC'
                ? 'Smart AI Camera Active'
                : `Continuous Sound Sweep (${minKhz}–${maxKhz} kHz)`}
            </span>
          </div>
        </div>

        {/* Minimal Info Toggle */}
        <button
          onClick={() => setShowTechDetails(!showTechDetails)}
          className="text-[11px] font-medium text-forest-300 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Technical details"
        >
          <span className="hidden sm:inline">{showTechDetails ? 'Hide Info' : 'Details'}</span>
          <span className="sm:hidden">{showTechDetails ? 'Close' : 'Info'}</span>
          {showTechDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Collapsible Technical Details */}
      {showTechDetails && (
        <div className="p-3 bg-forest-950 text-white rounded-2xl border border-forest-800 text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in duration-200">
          <div>
            <span className="text-forest-400 block text-[9px] uppercase">Device IP</span>
            <span className="font-bold text-forest-200">{telemetry.esp32Ip}</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[9px] uppercase">Sound Wave</span>
            <span className="font-bold text-solar-300">{telemetry.currentFrequencyKhz.toFixed(1)} kHz</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[9px] uppercase">Uptime</span>
            <span className="font-bold text-forest-200">{formatUptime(telemetry.uptimeSeconds)}</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[9px] uppercase">AI Engine</span>
            <span className="font-bold text-emerald-300">best.onnx (On-Device)</span>
          </div>
        </div>
      )}
    </div>
  );
};
