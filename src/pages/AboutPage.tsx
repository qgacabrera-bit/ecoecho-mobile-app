import React from 'react';
import { useDevice } from '../context/DeviceContext';
import { 
  Radio, 
  Leaf, 
  Sun, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  Play, 
  Square,
  Activity,
  Heart,
  Bird,
  Droplet,
  Bug
} from 'lucide-react';
import { AcousticWaveformVisualizer } from '../components/layout/AcousticWaveformVisualizer';
import { HardwareExplodedView } from '../components/about/HardwareExplodedView';
import { PestIntelligenceShowcase } from '../components/about/PestIntelligenceShowcase';

export const AboutPage: React.FC = () => {
  const { isTestingSweep, triggerTestSweep, stopTestSweep, activeTestFrequency } = useDevice();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 border border-forest-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-forest-800/80 border border-forest-600/50 px-3 py-1 rounded-full text-xs font-bold text-solar-400">
            <Radio className="w-3.5 h-3.5" />
            <span>Multi-Species Acoustic Crop Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Protecting Rice Crops Through Sound, Not Poison.
          </h2>
          <p className="text-sm text-forest-200/90 leading-relaxed">
            EcoEcho is a self-sustaining, solar-powered acoustic deterrent and AI pest monitoring system engineered to eradicate destructive rice pest infestations without synthetic chemical sprays.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Pest Threat Intelligence & Biology Center (The Problem & Threats) */}
      <PestIntelligenceShowcase />

      {/* 3D Hardware Exploded View Interactive Section (The Engineering Solution) */}
      <HardwareExplodedView />

      {/* Acoustic Waveform Demonstration Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-app-border shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-black text-forest-950">
              Ultrasonic Frequency Modulation Pattern
            </h3>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              20.0 – 45.0 kHz
            </span>
          </div>
          <p className="text-xs text-forest-700/80 mt-0.5">
            Continuous non-linear oscillating sweep projected across the field perimeter to prevent acoustic habituation across diverse insect species.
          </p>
        </div>

        <AcousticWaveformVisualizer height={64} showDetails={true} />
      </div>

      {/* Ecosystem Safety Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-app-border shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-black text-forest-950">
              Safety Verification & Ecosystem Impact
            </h4>
          </div>

          <p className="text-xs text-forest-700 leading-relaxed mb-3">
            EcoEcho is engineered strictly above the audible thresholds of humans and beneficial wildlife, ensuring zero environmental harm:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-forest-50 p-3 rounded-2xl border border-forest-100">
              <div className="font-bold text-forest-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Honeybees</span>
              </div>
              <p className="text-[11px] text-forest-600">Unaffected. Auditory range maxes out below 10 kHz.</p>
            </div>
            <div className="bg-forest-50 p-3 rounded-2xl border border-forest-100">
              <div className="font-bold text-forest-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Field Workers</span>
              </div>
              <p className="text-[11px] text-forest-600">Completely silent to human ears (Human hearing limit: 20 kHz).</p>
            </div>
            <div className="bg-forest-50 p-3 rounded-2xl border border-forest-100">
              <div className="font-bold text-forest-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Waterways</span>
              </div>
              <p className="text-[11px] text-forest-600">Zero synthetic chemical runoff into irrigation canals.</p>
            </div>
            <div className="bg-forest-50 p-3 rounded-2xl border border-forest-100">
              <div className="font-bold text-forest-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Local Birds</span>
              </div>
              <p className="text-[11px] text-forest-600">Beneficial predators unaffected and unharmed.</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-forest-100 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% bio-safe, non-lethal acoustic deterrent verified safe for beneficial pollinators and soil microbiomes.</span>
        </div>
      </div>

    </div>
  );
};
