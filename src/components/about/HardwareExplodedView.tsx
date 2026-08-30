import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Sun, 
  Radio, 
  Cpu, 
  Camera, 
  Shield, 
  Anchor,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ComponentItem {
  id: number;
  name: string;
  tag: string;
  icon: React.ElementType;
  description: string;
  farmerBenefit: string;
}

export const HardwareExplodedView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeComponentId, setActiveComponentId] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Lock video playback rate to 0.8x for a smooth, relaxed showcase
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.playbackRate = 0.8;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const components: ComponentItem[] = [
    {
      id: 0,
      name: "Solar Array",
      tag: "5.0V SOLAR POWER",
      icon: Sun,
      description: "A high-efficiency monocrystalline solar panel on top that continuously collects sunlight throughout the day.",
      farmerBenefit: "100% off-grid — no electrical wiring or manual battery recharging needed."
    },
    {
      id: 1,
      name: "Weather Canopy",
      tag: "MONSOON ENCLOSURE",
      icon: Shield,
      description: "An overhanging protective canopy that diverts heavy monsoon rains and sunlight away from the camera and speakers.",
      farmerBenefit: "Built to withstand harsh tropical typhoons and muddy field conditions."
    },
    {
      id: 2,
      name: "Ultrasonic Horns",
      tag: "20.0–45.0 kHz JAMMER",
      icon: Radio,
      description: "High-frequency directional sound speakers that emit acoustic pressure waves specifically tuned to repel rice pests.",
      farmerBenefit: "Safe for humans, honeybees, and livestock — 0% toxic chemical sprays."
    },
    {
      id: 3,
      name: "AI Camera Eye",
      tag: "ESP32-CAM VISION",
      icon: Camera,
      description: "A real-time optical eye that continuously scans the crop canopy to detect Brown Planthoppers, Green Leafhoppers, Stem Borers, and other destructive rice pests.",
      farmerBenefit: "Automatically identifies pests and activates targeted defense only when needed."
    },
    {
      id: 4,
      name: "Brain & Battery",
      tag: "DUAL-CORE & BMS",
      icon: Cpu,
      description: "The internal microprocessor and rechargeable battery system running the AI detection model and Wi-Fi communications.",
      farmerBenefit: "Keeps the field station guarding your crops non-stop 24 hours a day."
    },
    {
      id: 5,
      name: "Ground Stake",
      tag: "SOIL ANCHOR",
      icon: Anchor,
      description: "A reinforced, tapered spike at the bottom for quick and firm installation straight into paddy soil.",
      farmerBenefit: "Easy to press directly into wet mud and clay without special tools."
    }
  ];

  const activeComp = components.find((c) => c.id === activeComponentId) || components[0];
  const ActiveIcon = activeComp.icon;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-forest-800 shadow-2xl bg-forest-950 text-white p-4 sm:p-6 lg:p-8 min-h-[480px] sm:min-h-[640px] lg:min-h-[720px] select-none flex flex-col justify-between">
      
      {/* 1. CRYSTAL-CLEAR 100% UNCONSTRAINED 3D BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-forest-950 pointer-events-none select-none flex items-center justify-center">
        <video
          ref={videoRef}
          src="/hardware_exploded_view.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.playbackRate = 0.8;
          }}
          onError={() => setVideoError(true)}
          className="w-full h-full object-contain sm:object-cover scale-100 sm:scale-105 opacity-100 transition-opacity"
        />

        {/* Fallback Display if video file not yet saved in public folder */}
        {videoError && (
          <div className="absolute inset-0 bg-forest-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 pointer-events-auto">
            <div className="w-12 h-12 rounded-2xl bg-solar-500/20 border border-solar-400/40 flex items-center justify-center text-solar-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-black text-white">3D Exploded View Video Ready</h4>
              <p className="text-xs text-forest-300 leading-relaxed">
                Save your video as <code className="bg-forest-900 text-solar-300 px-2 py-0.5 rounded font-mono font-bold">public/hardware_exploded_view.mp4</code>
              </p>
            </div>
          </div>
        )}

        {/* Minimal Subtle Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-transparent to-forest-950/50 pointer-events-none" />
      </div>

      {/* 2. TOP HEADER (COMPACT ON MOBILE) */}
      <div className="relative z-20 flex items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-solar-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Hardware Architecture</span>
          </div>
          <h3 className="text-base sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            EcoEcho Field Station
          </h3>
        </div>

        {/* Minimal Clean Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={togglePlay}
            className="p-2 sm:p-2.5 bg-black/40 hover:bg-black/70 border border-white/20 rounded-full text-white transition-all cursor-pointer backdrop-blur-md shadow-md"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-solar-400" />}
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 sm:p-2.5 bg-black/40 hover:bg-black/70 border border-white/20 rounded-full text-white transition-all cursor-pointer backdrop-blur-md shadow-md"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* 3. COMPACT MOBILE-OPTIMIZED BOTTOM DESCRIPTION & NAVIGATION */}
      <div className="relative z-20 space-y-2.5 sm:space-y-3.5 w-full">
        
        {/* Active Component Definition (Compact, readable, space-efficient) */}
        <div className="space-y-1 animate-in fade-in duration-200 max-w-3xl">
          <div className="flex items-center space-x-2">
            <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-solar-400 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
            <h4 className="text-sm sm:text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {activeComp.name}
            </h4>
            <span className="text-[9px] sm:text-xs font-bold text-solar-400 font-mono tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              • {activeComp.tag}
            </span>
          </div>

          <p className="text-[11px] sm:text-sm text-white/95 leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium max-w-2xl">
            {activeComp.description}
          </p>

          <p className="text-[10px] sm:text-xs text-solar-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] flex items-center gap-1 sm:gap-1.5 pt-0.5 font-medium leading-tight">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-solar-400 shrink-0" />
            <span><strong className="text-white">Why it matters:</strong> {activeComp.farmerBenefit}</span>
          </p>
        </div>

        {/* Clean 3-Column Grid on Mobile / Flex on Desktop (2 Compact Rows of 3 Pills on Phone) */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2.5 pt-0.5">
          {components.map((comp) => {
            const isSelected = activeComponentId === comp.id;
            const Icon = comp.icon;

            return (
              <button
                key={comp.id}
                onClick={() => setActiveComponentId(comp.id)}
                className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-full transition-all cursor-pointer backdrop-blur-md text-center ${
                  isSelected
                    ? 'bg-solar-500 text-forest-950 font-black shadow-lg scale-105'
                    : 'bg-black/35 text-white/80 hover:text-white hover:bg-black/55 border border-white/10'
                }`}
              >
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isSelected ? 'text-forest-950' : 'text-solar-400'}`} />
                <span className="text-[10px] sm:text-xs font-bold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {comp.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
