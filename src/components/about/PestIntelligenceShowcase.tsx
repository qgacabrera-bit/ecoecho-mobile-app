import React, { useState } from 'react';
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
  Info,
  Radio,
  Sparkles
} from 'lucide-react';

interface PestProfile {
  id: number;
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
      name: "Brown Planthopper",
      localName: "Kayumangging Ngusong Kabayo",
      scientificName: "Nilaparvata lugens",
      threatLevel: "CRITICAL",
      threatBadge: "bg-rose-600 text-white font-black",
      damageLoss: "Up to 100% Crop Loss (Hopperburn)",
      symptoms: [
        "Hopperburn: Circular patches of rice plants turn yellow, dry up, and die rapidly",
        "Spreads deadly viral diseases that stunt plant growth",
        "Large swarms suck sap from lower rice stems"
      ],
      damageDescription: "These pests attack in massive swarms at the base of rice stems. They suck out plant sap until entire fields dry up and collapse in just a few days if left untreated.",
      acousticDefense: "The station emits high-pitch acoustic pulses that scramble their communication and mating calls, forcing them to stop feeding and fly away from your field.",
      targetFrequency: "24.5 kHz – 38.0 kHz",
      imagePlaceholder: "Brown Planthopper on Rice Stalk",
      imageAlt: "Brown Planthopper adult feeding on lower rice stem"
    },
    {
      id: 1,
      name: "Green Leafhopper",
      localName: "Berdeng Ngusong Kabayo",
      scientificName: "Nephotettix virescens",
      threatLevel: "CRITICAL",
      threatBadge: "bg-rose-600 text-white font-black",
      damageLoss: "50% – 80% Yield Loss (Tungro Disease)",
      symptoms: [
        "Carries the dreaded Tungro virus: Leaves turn orange-yellow and plants stay stunted",
        "Rice heads emerge late or produce empty, useless grains",
        "Feeds on leaf tips and young stalks"
      ],
      damageDescription: "Even a small number of green leafhoppers can spread the devastating Tungro disease across your whole field, ruining your harvest before grains can form.",
      acousticDefense: "Focused directional sound triggers their natural danger flight response, driving leafhoppers out of the rice canopy before they can spread viruses.",
      targetFrequency: "28.0 kHz – 42.0 kHz",
      imagePlaceholder: "Green Leafhopper on Rice Leaf",
      imageAlt: "Green Leafhopper perched on green rice canopy"
    },
    {
      id: 2,
      name: "Rice Stem Borer",
      localName: "Ubod ng Palay / Aksip",
      scientificName: "Scirpophaga incertulas",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-600 text-white font-black",
      damageLoss: "30% – 60% Crop Damage (Whiteheads)",
      symptoms: [
        "'Deadhearts': Center shoots wither and die during early tillering",
        "'Whiteheads': Grain heads turn empty white during harvest stage",
        "Worms bore holes and eat the inside of rice stems"
      ],
      damageDescription: "Stem borer caterpillars bore directly into the center of the rice stem, cutting off nutrients from the inside. When heads turn white, zero grains can be harvested.",
      acousticDefense: "Targeted frequencies irritate adult moths and disrupt egg-laying, preventing worms from ever hatching and boring into your crop stems.",
      targetFrequency: "22.0 kHz – 36.0 kHz",
      imagePlaceholder: "Rice Stem Borer Damage & Larva",
      imageAlt: "Stem borer moth and rice stem deadheart damage"
    },
    {
      id: 3,
      name: "Rice Leaf Folder",
      localName: "Maniniklop ng Dahon",
      scientificName: "Cnaphalocrocis medinalis",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-600 text-white font-black",
      damageLoss: "25% – 50% Leaf Destruction",
      symptoms: [
        "Leaves are folded lengthwise and tied together with silk threads",
        "White transparent streaks appear where green leaf tissue was eaten",
        "Damaged leaves cannot feed grain panicles"
      ],
      damageDescription: "Caterpillars roll the green leaf blade into a tube, hide inside, and scrape away the green tissue. Severe attacks leave entire rice fields looking white and scorched.",
      acousticDefense: "Rapid sound vibrations agitate the leaves, discouraging moths from landing and disrupting caterpillar feeding inside rolled leaves.",
      targetFrequency: "30.0 kHz – 44.0 kHz",
      imagePlaceholder: "Rice Leaf Folder Folded Blade",
      imageAlt: "Folded rice leaf blade showing green tissue scraping"
    },
    {
      id: 4,
      name: "Rice Bug (Harang)",
      localName: "Atangya / Harang / Gandang Palay",
      scientificName: "Leptocorisa oratorius",
      threatLevel: "HIGH",
      threatBadge: "bg-amber-600 text-white font-black",
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
      name: "Rice Hispa",
      localName: "Hispa ng Palay (Spiny Beetle)",
      scientificName: "Dicladispa armigera",
      threatLevel: "MODERATE",
      threatBadge: "bg-emerald-700 text-white font-black",
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

  const currentPest = pests[selectedPestId] || pests[0];

  const handleNext = () => {
    setSelectedPestId((prev) => (prev + 1) % pests.length);
  };

  const handlePrev = () => {
    setSelectedPestId((prev) => (prev - 1 + pests.length) % pests.length);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-app-border shadow-sm space-y-5">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300/80 px-3 py-1 rounded-full text-xs font-black text-amber-950 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-900" />
            <span>Target Rice Pests & Crop Damage</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-forest-950">
            Pest Profiles & Defense Guide
          </h3>
          <p className="text-xs text-forest-900 font-medium mt-0.5">
            Select a pest below to see the crop damage it causes and how EcoEcho's sound stops them.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono text-forest-900 font-black mr-1">
            {selectedPestId + 1} / {pests.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-forest-100 hover:bg-forest-200 border border-forest-300 text-forest-950 font-bold transition-colors cursor-pointer"
            title="Previous Pest"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-forest-100 hover:bg-forest-200 border border-forest-300 text-forest-950 font-bold transition-colors cursor-pointer"
            title="Next Pest"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-Contrast Interactive Pest Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {pests.map((pest) => {
          const isSelected = selectedPestId === pest.id;
          return (
            <button
              key={pest.id}
              onClick={() => setSelectedPestId(pest.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-forest-950 text-white border-forest-900 shadow-md scale-[1.02]'
                  : 'bg-forest-50 hover:bg-forest-100 text-forest-950 border-forest-300'
              }`}
            >
              <Bug className={`w-4 h-4 ${isSelected ? 'text-solar-400' : 'text-forest-700'}`} />
              <span>{pest.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Pest Profile Detail Card */}
      <div className="bg-gradient-to-br from-forest-50 via-white to-forest-50/50 rounded-3xl p-5 sm:p-7 border border-forest-200 shadow-sm space-y-6">
        
        {/* Top Header: Common Name + Local Filipino Name */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-forest-200 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xl sm:text-2xl font-black text-forest-950">
                {currentPest.name}
              </h4>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${currentPest.threatBadge}`}>
                {currentPest.threatLevel} THREAT
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
              <span className="bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-lg border border-amber-300">
                Local: {currentPest.localName}
              </span>
              <span className="text-forest-700 font-mono text-[11px]">
                (Scientific: {currentPest.scientificName})
              </span>
            </div>
          </div>

          {/* Maximum Potential Damage Loss Pill */}
          <div className="bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5 text-rose-950 shrink-0">
            <TrendingDown className="w-5 h-5 text-rose-700 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-900 block leading-none">
                Potential Damage If Untreated
              </span>
              <span className="text-sm font-black text-rose-950">
                {currentPest.damageLoss}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Picture Box | Right Practical Damage & Sound Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left (5 Cols): Pest Picture Frame */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-forest-950 border border-forest-800 shadow-md aspect-video sm:aspect-4/3 flex flex-col items-center justify-center p-4 text-center group">
              
              {/* Visual Icon Box */}
              <div className="w-16 h-16 rounded-3xl bg-forest-900 border border-forest-700 flex items-center justify-center text-solar-400 mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Bug className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-black text-white">{currentPest.imagePlaceholder}</h5>
                <p className="text-xs text-forest-200 font-bold">
                  {currentPest.localName}
                </p>
              </div>

              {/* Photo Caption */}
              <div className="absolute bottom-2 inset-x-2 bg-forest-950/95 px-2.5 py-1 rounded-xl text-[10px] text-forest-100 border border-forest-800 truncate font-medium">
                📷 {currentPest.imageAlt}
              </div>

              {/* AI Optical Eye Detection Badge */}
              <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-forest-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Eye className="w-3.5 h-3.5" />
                <span>AI Vision Recognized</span>
              </div>
            </div>

            {/* Repelling Frequency */}
            <div className="bg-white p-3 rounded-2xl border border-forest-200 shadow-sm flex items-center justify-between text-xs">
              <span className="text-forest-950 font-bold">Repelling Sound Pitch:</span>
              <span className="font-mono font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                {currentPest.targetFrequency}
              </span>
            </div>
          </div>

          {/* Right (7 Cols): Plain English Crop Damage & Acoustic Solution */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* How It Attacks Crops */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>How This Pest Damages Your Rice Crop</span>
              </h5>
              <p className="text-xs sm:text-sm text-forest-950 leading-relaxed font-medium">
                {currentPest.damageDescription}
              </p>
            </div>

            {/* Key Field Symptoms */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                <span>What to Look for in the Field</span>
              </h5>
              <div className="space-y-2">
                {currentPest.symptoms.map((symptom, sIdx) => (
                  <div key={sIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-forest-950 bg-white p-3 rounded-xl border border-forest-200 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How EcoEcho Stops It */}
            <div className="bg-forest-950 text-white p-4 sm:p-5 rounded-2xl border border-forest-800 space-y-2 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-solar-500/20 text-solar-400 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <h5 className="text-xs sm:text-sm font-black text-solar-300 uppercase tracking-wider">
                  How EcoEcho's Sound Repels This Pest
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-forest-100 leading-relaxed font-medium">
                {currentPest.acousticDefense}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
