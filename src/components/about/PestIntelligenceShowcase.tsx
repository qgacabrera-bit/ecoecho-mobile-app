import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  TrendingDown,
  Eye,
  Radio,
  Sparkles,
  ShieldCheck
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
  imagePlaceholder: string;
  imageAlt: string;
}

export const PestIntelligenceShowcase: React.FC = () => {
  const [selectedPestId, setSelectedPestId] = useState<number>(0);

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
      imagePlaceholder: "Brown Planthopper on Rice Stalk",
      imageAlt: "Brown Planthopper adult feeding on lower rice stem"
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
      imagePlaceholder: "Green Leafhopper on Rice Leaf",
      imageAlt: "Green Leafhopper perched on green rice canopy"
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
      imagePlaceholder: "Rice Stem Borer Damage & Larva",
      imageAlt: "Stem borer moth and rice stem deadheart damage"
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
      imagePlaceholder: "Rice Leaf Folder Folded Blade",
      imageAlt: "Folded rice leaf blade showing green tissue scraping"
    },
    {
      id: 4,
      number: "5",
      name: "Rice Bug (Harang)",
      localName: "Atangya / Harang / Gandang Palay",
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
      imagePlaceholder: "Rice Bug (Atangya) on Grain Panicle",
      imageAlt: "Slender rice bug feeding on milky grain panicle"
    },
    {
      id: 5,
      number: "6",
      name: "Rice Hispa",
      localName: "Hispa ng Palay (Spiny Beetle)",
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
      imagePlaceholder: "Rice Hispa Spiny Beetle on Leaf",
      imageAlt: "Small spiny black beetle scraping leaf blade"
    }
  ];

  const prevPestIndex = (selectedPestId - 1 + pests.length) % pests.length;
  const nextPestIndex = (selectedPestId + 1) % pests.length;

  const handleNext = () => {
    setSelectedPestId((prev) => (prev + 1) % pests.length);
  };

  const handlePrev = () => {
    setSelectedPestId((prev) => (prev - 1 + pests.length) % pests.length);
  };

  return (
    <div className="bg-forest-950 text-white rounded-3xl border border-forest-800 shadow-2xl p-5 sm:p-8 space-y-6 relative overflow-hidden select-none">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-solar-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 text-center space-y-1.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-forest-900/90 border border-forest-700/80 px-3.5 py-1 rounded-full text-xs font-black text-solar-400">
          <ShieldAlert className="w-3.5 h-3.5 text-solar-400" />
          <span>Crop Threat Intelligence</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Target Pest Profiles
        </h3>
        <p className="text-xs sm:text-sm text-forest-300 font-medium">
          Slide through the 6 destructive rice pests to see their damage and how EcoEcho repels them.
        </p>
      </div>

      {/* 3D PEEKING CAROUSEL VIEWPORT */}
      <div className="relative z-10 overflow-hidden py-4 px-2 min-h-[480px] sm:min-h-[520px] flex items-center justify-center">
        
        {/* PREVIOUS CARD (PEEKING SILHOUETTE ON LEFT) */}
        <div 
          onClick={handlePrev}
          className="absolute left-0 -translate-x-[62%] sm:-translate-x-[52%] lg:-translate-x-[42%] w-[85%] sm:w-[75%] lg:w-[60%] max-w-lg bg-forest-900/70 border border-forest-700/50 rounded-3xl p-5 sm:p-6 opacity-25 hover:opacity-40 scale-85 blur-[1px] transition-all duration-500 cursor-pointer pointer-events-auto z-0"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-solar-400 font-black text-sm">{pests[prevPestIndex].number}. {pests[prevPestIndex].name}</span>
            <span className="text-[10px] text-forest-300 font-bold">{pests[prevPestIndex].localName}</span>
          </div>
          <div className="w-full aspect-video rounded-2xl bg-forest-950 border border-forest-800 flex items-center justify-center text-forest-600 mb-3">
            <Bug className="w-10 h-10 opacity-40" />
          </div>
          <p className="text-xs text-forest-400 line-clamp-2">{pests[prevPestIndex].damageDescription}</p>
        </div>

        {/* ACTIVE CENTER CARD (THE HERO IN FOCUS) */}
        <div className="relative z-20 w-full max-w-2xl bg-gradient-to-b from-forest-900/90 via-forest-950/95 to-forest-900/90 border border-forest-700/80 rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Card Top: Number + Golden Title + Threat Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-800 pb-3">
            <div>
              <h4 className="text-lg sm:text-2xl font-black text-solar-400 tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {pests[selectedPestId].number}. {pests[selectedPestId].name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                <span className="text-white font-bold bg-forest-800 px-2.5 py-0.5 rounded-lg border border-forest-700">
                  Local: {pests[selectedPestId].localName}
                </span>
                <span className="text-forest-400 font-mono text-[11px] italic">
                  ({pests[selectedPestId].scientificName})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${pests[selectedPestId].threatBadge}`}>
                {pests[selectedPestId].threatLevel} THREAT
              </span>
            </div>
          </div>

          {/* Card Middle: Image Placeholder Container */}
          <div className="relative rounded-2xl overflow-hidden bg-forest-950 border border-forest-800 shadow-inner aspect-video sm:aspect-2/1 flex flex-col items-center justify-center p-4 text-center group">
            
            {/* Visual Bug Icon Glow */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-forest-900/90 border border-forest-700 flex items-center justify-center text-solar-400 mb-2 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Bug className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h5 className="text-sm sm:text-base font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {pests[selectedPestId].imagePlaceholder}
            </h5>
            <p className="text-xs text-solar-300 font-bold mt-0.5">
              {pests[selectedPestId].localName}
            </p>

            {/* AI Vision Optical Tag */}
            <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-forest-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>YOLO Target #{pests[selectedPestId].id}</span>
            </div>

            {/* Repelling Frequency Tag */}
            <div className="absolute top-2.5 right-2.5 bg-forest-900/90 text-solar-300 border border-forest-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow-sm">
              {pests[selectedPestId].targetFrequency}
            </div>

            {/* Bottom Photo Caption */}
            <div className="absolute bottom-2 inset-x-2 bg-forest-950/90 px-3 py-1 rounded-xl text-[10px] text-forest-200 border border-forest-800 truncate font-medium">
              📷 {pests[selectedPestId].imageAlt}
            </div>
          </div>

          {/* Card Bottom: Description & Damage Impact */}
          <div className="space-y-3 pt-1">
            
            {/* Plain English Damage Description */}
            <p className="text-xs sm:text-sm text-forest-100 leading-relaxed font-medium">
              {pests[selectedPestId].damageDescription}
            </p>

            {/* Potential Damage Impact & Sound Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              
              {/* Potential Loss Badge */}
              <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded-2xl flex items-start space-x-2.5">
                <TrendingDown className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-300 block">Crop Damage Risk:</span>
                  <span className="text-xs font-black text-rose-100">{pests[selectedPestId].damageLoss}</span>
                </div>
              </div>

              {/* Acoustic Jamming Defense */}
              <div className="bg-forest-900/80 border border-solar-400/40 p-3 rounded-2xl flex items-start space-x-2.5">
                <Radio className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-solar-300 block">EcoEcho Sound Repel:</span>
                  <span className="text-xs font-medium text-forest-100">{pests[selectedPestId].acousticDefense}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* NEXT CARD (PEEKING SILHOUETTE ON RIGHT) */}
        <div 
          onClick={handleNext}
          className="absolute right-0 translate-x-[62%] sm:translate-x-[52%] lg:translate-x-[42%] w-[85%] sm:w-[75%] lg:w-[60%] max-w-lg bg-forest-900/70 border border-forest-700/50 rounded-3xl p-5 sm:p-6 opacity-25 hover:opacity-40 scale-85 blur-[1px] transition-all duration-500 cursor-pointer pointer-events-auto z-0"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-solar-400 font-black text-sm">{pests[nextPestIndex].number}. {pests[nextPestIndex].name}</span>
            <span className="text-[10px] text-forest-300 font-bold">{pests[nextPestIndex].localName}</span>
          </div>
          <div className="w-full aspect-video rounded-2xl bg-forest-950 border border-forest-800 flex items-center justify-center text-forest-600 mb-3">
            <Bug className="w-10 h-10 opacity-40" />
          </div>
          <p className="text-xs text-forest-400 line-clamp-2">{pests[nextPestIndex].damageDescription}</p>
        </div>

      </div>

      {/* BOTTOM CONTROLS (EXACT INSPIRATION: LEFT ARROW • GOLDEN BEADS • RIGHT ARROW) */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-forest-800/80 max-w-xl mx-auto px-4">
        
        {/* Left Circular Arrow */}
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 border border-forest-700 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
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
          className="w-10 h-10 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 border border-forest-700 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
          title="Next Pest"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
