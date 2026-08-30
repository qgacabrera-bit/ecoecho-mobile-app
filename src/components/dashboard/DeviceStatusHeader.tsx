import React, { useState } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sun, 
  BatteryCharging, 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Clock, 
  Cpu, 
  Zap,
  Leaf
} from 'lucide-react';

export const DeviceStatusHeader: React.FC = () => {
  const { telemetry, detections, detectionHistory, mode, isTestingSweep, config } = useDevice();
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const isAlarmOrJamming = detections.length > 0 || telemetry.activeJammingPulse || isTestingSweep;
  const minKhz = config?.sweepMinKhz ? config.sweepMinKhz.toFixed(1) : '20.0';
  const maxKhz = config?.sweepMaxKhz ? config.sweepMaxKhz.toFixed(1) : '45.0';
  const confPct = config?.sensitivityThreshold ? (config.sensitivityThreshold * 100).toFixed(0) : '70';

  return (
    <div className="space-y-3">
      
      {/* 1. Primary Big Field Protection Status Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isAlarmOrJamming
          ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-amber-500/80 text-white animate-pulse'
          : 'bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 border-forest-800 text-white'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isAlarmOrJamming 
              ? 'bg-amber-500 text-forest-950' 
              : 'bg-emerald-500 text-forest-950'
          }`}>
            {isAlarmOrJamming ? (
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {isAlarmOrJamming ? 'Pest Detected — Acoustic Deterrent Active' : 'Field Protected — EcoEcho Shield Standing Guard'}
              </h2>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                isAlarmOrJamming ? 'bg-amber-400 text-forest-950' : 'bg-emerald-400 text-forest-950'
              }`}>
                {isAlarmOrJamming ? 'Repelling' : 'Protected'}
              </span>
            </div>
            <p className="text-xs text-forest-200/90 mt-0.5">
              {isAlarmOrJamming 
                ? `AI model identified target pest — transmitting bio-acoustic jamming wave (${telemetry.currentFrequencyKhz.toFixed(1)} kHz).`
                : mode === 'DYNAMIC' 
                ? `Smart AI camera scanning crop canopy (≥${confPct}% Confidence). ML automatically tunes deterrent frequency upon pest detection.`
                : `Continuous ${minKhz}–${maxKhz} kHz eco-friendly sound sweep is active across the field perimeter.`}
            </p>
          </div>
        </div>

        {/* Technician toggle button */}
        <button
          onClick={() => setShowTechDetails(!showTechDetails)}
          className="self-end sm:self-center text-xs font-semibold text-forest-300 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <span>{showTechDetails ? 'Hide Technical Info' : 'Technical Details'}</span>
          {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Three Simple, Clean Field Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Card 1: Protection Mode & Status */}
        <div className="bg-white rounded-2xl p-4 border border-app-border shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600">
              Protection Mode
            </span>
            <div className="text-sm font-black text-forest-950">
              {mode === 'DYNAMIC' ? 'Smart AI Shield' : 'Continuous Sweep'}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {mode === 'DYNAMIC' ? `ML Auto-Tuned Signal (≥${confPct}% Conf)` : `${minKhz}–${maxKhz} kHz Perimeter Shield`}
            </p>
          </div>
        </div>

        {/* Card 2: Solar & Battery */}
        <div className="bg-white rounded-2xl p-4 border border-app-border shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-solar-100 text-solar-800 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600">
              Solar & Battery
            </span>
            <div className="text-sm font-black text-forest-950 flex items-center gap-1.5">
              <span>{telemetry.batteryLevel}% Charged</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-solar-800 font-medium flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-solar-600" />
              <span>Solar Powered • Battery Good</span>
            </p>
          </div>
        </div>

        {/* Card 3: Pests Repelled Today */}
        <div className="bg-white rounded-2xl p-4 border border-app-border shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600">
              Pest Activity
            </span>
            <div className="text-sm font-black text-forest-950">
              {detectionHistory.length === 0 ? 'Zero Pests Detected' : `${detectionHistory.length} Events Handled`}
            </div>
            <p className="text-[11px] text-forest-600">
              {detectionHistory.length === 0 ? 'Your field is currently clean' : 'All targets repelled safely'}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Collapsible Technical / Engineering Details (Hidden by default for simplicity) */}
      {showTechDetails && (
        <div className="p-4 bg-forest-950 text-white rounded-2xl border border-forest-800 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
          <div>
            <span className="text-forest-400 block text-[10px] uppercase">Device Station IP</span>
            <span className="font-bold text-forest-200">{telemetry.esp32Ip}</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[10px] uppercase">Current Sound Wave</span>
            <span className="font-bold text-solar-300">{telemetry.currentFrequencyKhz.toFixed(1)} kHz</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[10px] uppercase">Station Uptime</span>
            <span className="font-bold text-forest-200">{formatUptime(telemetry.uptimeSeconds)}</span>
          </div>
          <div>
            <span className="text-forest-400 block text-[10px] uppercase">AI Model</span>
            <span className="font-bold text-emerald-300">best.pt (≥70% Conf)</span>
          </div>
        </div>
      )}

    </div>
  );
};
