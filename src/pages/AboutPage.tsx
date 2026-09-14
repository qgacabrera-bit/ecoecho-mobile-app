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
  Bug,
  VolumeX,
  Zap
} from 'lucide-react';
import { HardwareExplodedView } from '../components/about/HardwareExplodedView';
import { PestIntelligenceShowcase } from '../components/about/PestIntelligenceShowcase';

export const AboutPage: React.FC = () => {
  const { isTestingSweep, triggerTestSweep, stopTestSweep, activeTestFrequency } = useDevice();

  return (
    <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-300 pb-6">
      
      {/* Hero Banner - Compact & Mobile-First */}
      <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-2xl p-4 sm:p-6 border border-forest-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-forest-800/80 border border-forest-600/50 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-solar-400">
            <Radio className="w-3 h-3" />
            <span>Crop Defense for Rice Fields</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
            Protecting Rice Crops Through Sound, Not Poison.
          </h2>
          <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed font-medium">
            EcoEcho is a solar-powered field station that uses high-pitch sound and smart cameras to stop destructive rice insects — without spraying expensive, toxic chemicals.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 w-60 h-60 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* WFEO Project Motivation & Showcase Video */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-app-border shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300/80 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold mb-1">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Our Motivation • WFEO Global Showcase</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-forest-950">
              Learn More About the EcoEcho Project
            </h3>
            <p className="text-xs text-forest-700/90 leading-relaxed font-medium mt-0.5">
              Watch our official presentation on acoustic pest defense and bio-stimulant technology engineered for Philippine rice farmers.
            </p>
          </div>
        </div>

        {/* Responsive Video Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-forest-200 bg-forest-950">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/XkTVsAm7gHA"
            title="EcoEcho: Acoustic Pest Defense & Bio-Stimulant Technology"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {/* Interactive Pest Threat Intelligence & Biology Center (The Problem & Threats) */}
      <PestIntelligenceShowcase />

      {/* 3D Hardware Exploded View Interactive Section (The Engineering Solution) */}
      <HardwareExplodedView />


      {/* High-Contrast Ecosystem Safety Grid */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-app-border shadow-xs space-y-3">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-black text-forest-950">
              100% Safe for Farmers, Honeybees & Wildlife
            </h4>
          </div>

          <p className="text-xs text-forest-900 leading-relaxed mb-3 font-medium">
            EcoEcho uses sound that only rice pests can hear. It is completely inaudible and harmless to humans and beneficial farm animals:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-forest-50/90 p-3.5 rounded-2xl border border-forest-200">
              <div className="font-black text-forest-950 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Honeybees</span>
              </div>
              <p className="text-[11px] text-forest-900 font-medium">Safe. Honeybees cannot hear these sound frequencies.</p>
            </div>
            <div className="bg-forest-50/90 p-3.5 rounded-2xl border border-forest-200">
              <div className="font-black text-forest-950 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Field Workers</span>
              </div>
              <p className="text-[11px] text-forest-900 font-medium">Completely silent to human ears. Zero headache or noise.</p>
            </div>
            <div className="bg-forest-50/90 p-3.5 rounded-2xl border border-forest-200">
              <div className="font-black text-forest-950 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Irrigation Water</span>
              </div>
              <p className="text-[11px] text-forest-900 font-medium">Zero chemical runoff into drinking water or fish canals.</p>
            </div>
            <div className="bg-forest-50/90 p-3.5 rounded-2xl border border-forest-200">
              <div className="font-black text-forest-950 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Birds & Pets</span>
              </div>
              <p className="text-[11px] text-forest-900 font-medium">Beneficial birds and farm dogs are unharmed.</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-forest-100 text-xs text-forest-950 font-bold flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-chemical, non-lethal acoustic technology safe for farm workers and rice field ecosystems.</span>
        </div>
      </div>

      {/* Manual Sound Sweep Audio Simulator Tool */}
      <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-2xl p-4 sm:p-5 border border-forest-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Volume2 className="w-5 h-5 text-solar-400 shrink-0" />
              <h3 className="text-base font-black text-white">
                Sound Sweep Audio Simulator
              </h3>
              <span className="bg-solar-500/20 text-solar-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-solar-400/30">
                Audible Simulation Only
              </span>
            </div>
            <p className="text-xs text-forest-200/90 leading-relaxed font-medium">
              Real EcoEcho ultrasonic frequencies operate between <strong className="text-white">20.0 kHz and 45.0 kHz</strong>, which are completely inaudible to human ears. This tool plays an <strong className="text-solar-300">audible simulation</strong> through your phone or computer speaker to demonstrate how the pitch continuously shifts to prevent insects from adapting.
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isTestingSweep ? (
              <button
                type="button"
                onClick={stopTestSweep}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Simulation</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerTestSweep(4)}
                className="bg-solar-500 hover:bg-solar-400 text-forest-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4 text-forest-950" />
                <span>Listen to Sound Sweep (4s)</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Frequency Meter while sweep is active */}
        {isTestingSweep && (
          <div className="p-3 bg-forest-900/90 rounded-xl border border-solar-400/40 flex items-center justify-between text-xs animate-pulse">
            <span className="text-forest-200 font-medium">Simulated Frequency Sweep:</span>
            <span className="font-mono font-black text-solar-400 text-sm">{activeTestFrequency.toFixed(1)} kHz</span>
          </div>
        )}
      </div>

    </div>
  );
};
