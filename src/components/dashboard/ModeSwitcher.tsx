import React from 'react';
import { useDevice } from '../../context/DeviceContext';
import { DeviceMode } from '../../types';
import { AcousticWaveformVisualizer } from '../layout/AcousticWaveformVisualizer';
import { Radio, Zap, Sparkles, Check, Volume2, ShieldCheck } from 'lucide-react';

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode, config } = useDevice();

  const handleModeChange = async (newMode: DeviceMode) => {
    if (newMode === mode) return;
    await setMode(newMode);
  };

  const minKhz = config?.sweepMinKhz ? config.sweepMinKhz.toFixed(1) : '20.0';
  const maxKhz = config?.sweepMaxKhz ? config.sweepMaxKhz.toFixed(1) : '45.0';
  const confPct = config?.sensitivityThreshold ? (config.sensitivityThreshold * 100).toFixed(0) : '70';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-app-border shadow-sm space-y-4">
      
      {/* Header */}
      <div>
        <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-forest-700" />
          Field Protection Mode
        </h3>
        <p className="text-xs text-forest-700/80 mt-0.5">
          Choose how EcoEcho defends your crops from Brown Planthoppers.
        </p>
      </div>

      {/* 2 Big Farmer-Friendly Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Mode 1: Smart AI Shield */}
        <div
          onClick={() => handleModeChange('DYNAMIC')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
            mode === 'DYNAMIC'
              ? 'border-forest-800 bg-forest-900 text-white shadow-md'
              : 'border-forest-200 hover:border-forest-400 bg-forest-50/50 text-forest-950'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                mode === 'DYNAMIC' ? 'bg-solar-500 text-forest-950 font-bold' : 'bg-forest-200 text-forest-800'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black">Smart AI Shield</h4>
            </div>
            {mode === 'DYNAMIC' && (
              <span className="bg-solar-400 text-forest-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            )}
          </div>
          <p className={`text-xs leading-relaxed ${mode === 'DYNAMIC' ? 'text-forest-200' : 'text-forest-700'}`}>
            AI Vision identifies pest species and automatically emits the optimal targeted jamming signal. Conserves solar battery until pests appear (≥{confPct}% confidence).
          </p>
        </div>

        {/* Mode 2: Continuous Sound Sweep */}
        <div
          onClick={() => handleModeChange('AUTOMATIC')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
            mode === 'AUTOMATIC'
              ? 'border-forest-800 bg-forest-900 text-white shadow-md'
              : 'border-forest-200 hover:border-forest-400 bg-forest-50/50 text-forest-950'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                mode === 'AUTOMATIC' ? 'bg-solar-500 text-forest-950 font-bold' : 'bg-forest-200 text-forest-800'
              }`}>
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black">Continuous Shield</h4>
            </div>
            {mode === 'AUTOMATIC' && (
              <span className="bg-solar-400 text-forest-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            )}
          </div>
          <p className={`text-xs leading-relaxed ${mode === 'AUTOMATIC' ? 'text-forest-200' : 'text-forest-700'}`}>
            Continuous 24/7 frequency sweep ({minKhz}–{maxKhz} kHz) creating a permanent acoustic barrier over the field.
          </p>
        </div>

      </div>

      {/* Acoustic Waveform Visualizer */}
      <AcousticWaveformVisualizer showDetails={false} />

    </div>
  );
};
