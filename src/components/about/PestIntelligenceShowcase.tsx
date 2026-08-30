import React, { useState, useRef } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft,
  TrendingDown,
  Radio,
  MoveHorizontal,
  ExternalLink
} from 'lucide-react';

interface PestProfile {
  id: number;
  number: string;
  name: string;
  localName: string;
  scientificName: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  threatBadge: string;
  damageLoss: string;
  symptoms: string[];
  damageDescription: string;
  acousticDefense: string;
  targetFrequency: string;
  imageSrc: string;
  imageAlt: string;
  sourceName: string;
  sourceUrl: string;
}

export const PestIntelligenceShowcase: React.FC = () => {
  const [selectedPestId, setSelectedPestId] = useState<number>(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pests: PestProfile[] = [
    {
      id: 0,
      number: "1",
      name: "Brown Planthopper",
      localName: "Kayumangging Ngusong Kabayo",
      scientificName: "Nilaparvata lugens",
      threatLevel: "CRITICAL",
      threatBadge: "bg-rose-500/20 text-rose-300 border border-rose-500/50",
      damageLoss: "Up to 100% Crop Loss (Hopperburn)",
      symptoms: [
        "Hopperburn: Circular patches of rice plants turn yellow, dry up, and collapse",
        "Spreads deadly viral diseases that stunt plant growth",
        "Dense swarms suck sap from lower rice stems"
      ],
      damageDescription: "Insects congregate in swarms at the base of rice stalks, extracting sap until entire patches of the crop collapse. Untreated swarms can wipe out entire hectarages in under 7 days.",
      acousticDefense: "The station emits high-pitch acoustic pulses that scramble their communication and mating calls, forcing them to stop feeding and vacate the field.",
      targetFrequency: "24.5 kHz – 38.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}brownplanthopper.jpg`,
      imageAlt: "Brown Planthopper (Nilaparvata lugens) on rice stem",
      sourceName: "TNAU Agritech Portal",
      sourceUrl: "https://agritech.tnau.ac.in/crop_protection/rice/crop_prot_crop_insectpest%20_cereals_paddy_12.html"
    },
    {
      id: 1,
      number: "2",
      name: "Green Leafhopper",
      localName: "Berdeng Ngusong Kabayo",
      scientificName: "Nephotettix virescens",
      threatLevel: "CRITICAL",
      threatBadge: "bg-rose-500/20 text-rose-300 border border-rose-500/50",
      damageLoss: "50% – 80% Yield Loss (Tungro Disease)",
      symptoms: [
        "Carries Tungro virus: Leaves turn orange-yellow and plants stay stunted",
        "Rice heads emerge late or produce empty, useless grains",
        "Feeds on leaf tips and young stalks"
      ],
      damageDescription: "Even a small number of green leafhoppers can spread devastating Tungro disease across your whole field, ruining your harvest before grains can form.",
      acousticDefense: "Focused directional sound triggers their danger flight response, driving leafhoppers out of the canopy before they can spread viruses.",
      targetFrequency: "28.0 kHz – 42.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}greenleafhopper.jpg`,
      imageAlt: "Green Leafhopper (Nephotettix virescens) on leaf canopy",
      sourceName: "PlantwisePlus Knowledge Bank",
      sourceUrl: "https://plantwiseplusknowledgebank.org/doi/full/10.1079/pwkb.20157800279"
    },
    {
      id: 2,
      number: "3",
      name: "Rice Stem Borer",
      localName: "Ubod ng Palay / Aksip",
      scientificName: "Scirpophaga incertulas",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-500/20 text-amber-300 border border-amber-500/50",
      damageLoss: "30% – 60% Crop Damage (Whiteheads)",
      symptoms: [
        "'Deadhearts': Center shoots wither and die during early tillering",
        "'Whiteheads': Grain heads turn empty white during harvest stage",
        "Worms bore holes and eat the inside of rice stems"
      ],
      damageDescription: "Stem borer caterpillars bore directly into the center of the rice stem, severing nutrients from the inside out. When heads turn white, zero grains can be harvested.",
      acousticDefense: "Targeted frequencies irritate adult moths and disrupt egg-laying, preventing worms from ever hatching and boring into your crop stems.",
      targetFrequency: "22.0 kHz – 36.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}stemborer.jpg`,
      imageAlt: "Yellow Stem Borer moth on rice plant",
      sourceName: "IRRI Rice Knowledge Bank",
      sourceUrl: "http://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/stem-borer"
    },
    {
      id: 3,
      number: "4",
      name: "Rice Leaf Folder",
      localName: "Maniniklop ng Dahon",
      scientificName: "Cnaphalocrocis medinalis",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-500/20 text-amber-300 border border-amber-500/50",
      damageLoss: "25% – 50% Leaf Destruction",
      symptoms: [
        "Leaves are folded lengthwise and tied together with silk threads",
        "White transparent streaks appear where green leaf tissue was eaten",
        "Damaged leaves cannot feed grain panicles"
      ],
      damageDescription: "Caterpillars roll the green leaf blade into a tube, hide inside, and scrape away the green tissue. Severe attacks leave entire fields looking white and scorched.",
      acousticDefense: "Rapid sound vibrations agitate the leaves, discouraging moths from landing and disrupting caterpillar feeding inside rolled leaves.",
      targetFrequency: "30.0 kHz – 44.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}rice%20leaf%20folder.jpg`,
      imageAlt: "Rice Leaf Folder folded blade and scraping damage",
      sourceName: "IRRI Rice Knowledge Bank",
      sourceUrl: "http://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/rice-leaffolder"
    },
    {
      id: 4,
      number: "5",
      name: "Rice Bug (Harang)",
      localName: "Atangya / Harang",
      scientificName: "Leptocorisa oratorius",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-500/20 text-amber-300 border border-amber-500/50",
      damageLoss: "40% – 70% Grain Quality Ruined",
      symptoms: [
        "Punctures and sucks milky sap from developing rice grains",
        "Leaves empty, lightweight grains with dark spots and foul odor",
        "Severely degrades rice milling quality and selling price"
      ],
      damageDescription: "Attacks right when rice grains are filling with milk. They suck the grains dry, leaving behind empty chaff and brown spots that buyers reject or downgrade heavily.",
      acousticDefense: "High-power acoustic sound targets their sensitive antennas, driving rice bugs out of your field before they can touch young grain heads.",
      targetFrequency: "26.0 kHz – 40.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}rice%20bug.jpg`,
      imageAlt: "Rice Bug (Leptocorisa oratorius) feeding on grain panicle",
      sourceName: "IRRI Rice Knowledge Bank",
      sourceUrl: "http://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/rice-bug"
    },
    {
      id: 5,
      number: "6",
      name: "Rice Hispa",
      localName: "Hispa ng Palay",
      scientificName: "Dicladispa armigera",
      threatLevel: "MODERATE",
      threatBadge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50",
      damageLoss: "20% – 45% Leaf Loss",
      symptoms: [
        "Small spiny black beetles scrape long white parallel lines on leaves",
        "Grubs tunnel inside the leaf surface, creating blistered patches",
        "Leaves wither and turn dry like paper"
      ],
      damageDescription: "Both adult spiny beetles and grubs scrape and tunnel into leaves simultaneously, drying them out and weakening the plant's ability to grow grains.",
      acousticDefense: "Acoustic resonance repels adult beetles from young rice tillers and reduces grub feeding activity across the crop canopy.",
      targetFrequency: "32.0 kHz – 45.0 kHz",
      imageSrc: `${import.meta.env.BASE_URL}rice%20hispa.jpg`,
      imageAlt: "Rice Hispa spiny black beetle on leaf blade",
      sourceName: "IRRI Rice Knowledge Bank",
      sourceUrl: "http://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/rice-hispa"
    }
  ];

  const handleNext = () => {
    setSelectedPestId((prev) => (prev + 1) % pests.length);
  };

  const handlePrev = () => {
    setSelectedPestId((prev) => (prev - 1 + pests.length) % pests.length);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = e.touches[0].clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragOffset > 45) {
      handlePrev();
    } else if (dragOffset < -45) {
      handleNext();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset > 45) {
      handlePrev();
    } else if (dragOffset < -45) {
      handleNext();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <div className="bg-forest-950 text-white rounded-3xl border border-forest-800 shadow-2xl p-4 sm:p-7 space-y-4 relative overflow-hidden select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-solar-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Minimal Header (Matching Hardware Architecture Style) */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center space-x-2 text-solar-400 font-mono text-xs font-black uppercase tracking-wider">
          <Bug className="w-4 h-4 text-solar-400" />
          <span>TARGET PEST PROFILES</span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
          Target Rice Pests & Defense
        </h3>
      </div>

      {/* 3D CONTINUOUS SLIDING STAGE */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`relative z-10 overflow-hidden py-2 min-h-[520px] sm:min-h-[550px] flex items-center justify-center perspective-[1200px] touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {pests.map((pest, idx) => {
          // Calculate cyclic relative offset (-2, -1, 0, 1, 2, 3)
          let diff = idx - selectedPestId;
          if (diff > 3) diff -= 6;
          if (diff < -2) diff += 6;

          // Responsive card step width for 1:1 tactile dragging physics
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
          const stepPx = isMobile ? 310 : 420;
          const fractionalOffset = diff + dragOffset / stepPx;
          const isCurrent = Math.abs(fractionalOffset) < 0.5;

          // Continuous 3D transforms based on finger drag
          const translateX = fractionalOffset * (isMobile ? 96 : 76);
          const scale = Math.max(0.78, 1 - Math.abs(fractionalOffset) * 0.15);
          const opacity = Math.max(0, 1 - Math.abs(fractionalOffset) * 0.65);
          const rotateY = fractionalOffset * -10;
          const zIndex = Math.round(50 - Math.abs(fractionalOffset) * 10);
          const isVisible = Math.abs(fractionalOffset) < 2.2;

          if (!isVisible) return null;

          return (
            <div
              key={pest.id}
              onClick={() => {
                if (!isCurrent && Math.abs(dragOffset) < 5) {
                  setSelectedPestId(pest.id);
                }
              }}
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity: opacity,
                zIndex: zIndex,
                transition: isDragging 
                  ? 'none' 
                  : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
              }}
              className={`absolute w-[92%] sm:w-[84%] max-w-lg bg-gradient-to-b from-forest-900/95 via-forest-950/98 to-forest-900/95 border rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl space-y-3 will-change-transform ${
                isCurrent 
                  ? 'border-forest-600/90 shadow-[0_14px_50px_rgba(0,0,0,0.85)] pointer-events-auto' 
                  : 'border-forest-800/60 cursor-pointer pointer-events-auto filter blur-[0.5px]'
              }`}
            >
              {/* Card Top: Number + Golden Title + Inline Threat Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-forest-800/80 pb-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base sm:text-lg font-black text-solar-400 tracking-tight truncate">
                    {pest.number}. {pest.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-forest-300 font-bold mt-0.5 truncate">
                    Local: {pest.localName} <span className="font-mono text-[10px] text-forest-400 font-normal">({pest.scientificName})</span>
                  </p>
                </div>

                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 mt-0.5 ${pest.threatBadge}`}>
                  {pest.threatLevel} THREAT
                </span>
              </div>

              {/* Card Middle: 100% Pure, Unobstructed Square Photo Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-forest-950 border border-forest-700/80 shadow-md w-[130px] h-[130px] sm:w-[155px] sm:h-[155px] mx-auto flex items-center justify-center group my-0.5">
                <img 
                  src={pest.imageSrc} 
                  alt={pest.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-100 contrast-105"
                  loading="lazy"
                />
              </div>

              {/* Card Bottom: Description, Damage Impact & 'Learn More' Button */}
              <div className="space-y-2.5 pt-0.5">
                <p className="text-xs text-forest-100 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                  {pest.damageDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-rose-950/50 border border-rose-500/40 p-2.5 rounded-2xl flex items-start space-x-2">
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-black uppercase text-rose-300 block">Crop Damage Risk:</span>
                      <span className="text-[11px] font-black text-rose-100">{pest.damageLoss}</span>
                    </div>
                  </div>

                  <div className="bg-forest-900/80 border border-solar-400/40 p-2.5 rounded-2xl flex items-start space-x-2">
                    <Radio className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-black uppercase text-solar-300 block">EcoEcho Sound Repel:</span>
                      <span className="text-[11px] font-medium text-forest-100">{pest.acousticDefense}</span>
                    </div>
                  </div>
                </div>

                {/* 'Learn More' Action Link Button */}
                <div className="pt-2 flex items-center justify-between border-t border-forest-800/80">
                  <span className="text-[10px] text-forest-400 font-medium truncate">
                    Source: {pest.sourceName}
                  </span>
                  <a 
                    href={pest.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-solar-500/20 hover:bg-solar-500/30 text-solar-300 hover:text-solar-200 border border-solar-400/40 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    title={`Read complete official research sheet for ${pest.name}`}
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM CONTROLS (LEFT ARROW • GOLDEN BEADS • RIGHT ARROW + SUBTLE GESTURE HINT) */}
      <div className="relative z-10 space-y-2.5 pt-2 border-t border-forest-800/80 max-w-xl mx-auto px-4">
        
        <div className="flex items-center justify-between">
          {/* Left Circular Arrow */}
          <button
            onClick={handlePrev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 border border-forest-700 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
            title="Previous Pest"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center Golden Indicator Beads */}
          <div className="flex items-center space-x-2.5">
            {pests.map((pest) => {
              const isCurrent = selectedPestId === pest.id;
              return (
                <button
                  key={pest.id}
                  onClick={() => setSelectedPestId(pest.id)}
                  className={`transition-all duration-300 cursor-pointer rounded-full ${
                    isCurrent
                      ? 'w-3.5 h-3.5 bg-solar-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`View ${pest.name}`}
                />
              );
            })}
          </div>

          {/* Right Circular Arrow */}
          <button
            onClick={handleNext}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 border border-forest-700 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
            title="Next Pest"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Swipe Hint with Reduced Opacity */}
        <p className="text-[11px] text-forest-300/60 font-medium flex items-center justify-center gap-1.5 text-center">
          <MoveHorizontal className="w-3.5 h-3.5 text-solar-400/70 animate-pulse" />
          <span>Swipe or drag horizontally to slide between pests</span>
        </p>

      </div>

    </div>
  );
};
