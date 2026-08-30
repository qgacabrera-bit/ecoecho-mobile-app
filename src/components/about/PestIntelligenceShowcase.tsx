import React, { useState } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  TrendingDown,
  Eye,
  Sparkles,
  Info,
  Radio
} from 'lucide-react';

interface PestProfile {
  id: number;
  name: string;
  scientificName: string;
  localName: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  threatColor: string;
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
      scientificName: "Nilaparvata lugens",
      localName: "Kayumangging Ngusong Kabayo",
      threatLevel: "CRITICAL",
      threatColor: "text-rose-400 bg-rose-500/20 border-rose-400/40",
      threatBadge: "bg-rose-500 text-white",
      damageLoss: "Up to 100% Total Crop Loss",
      symptoms: [
        "Hopperburn (rapid yellowing and drying of entire tillers)",
        "Transmits Rice Ragged Stunt and Grassy Stunt Viruses",
        "Dense populations feeding on lower stalk phloem sap"
      ],
      damageDescription: "Insects congregate in swarms at the base of rice stalks, extracting sap until entire circular patches of the crop collapse ('hopperburn'). Untreated swarms can wipe out entire hectarages in under 7 days.",
      acousticDefense: "20.0–45.0 kHz non-linear frequency sweeps jam abdominal acoustic vibration signals, preventing mating swarms and causing immediate feeding paralysis.",
      targetFrequency: "24.5 kHz – 38.0 kHz",
      imagePlaceholder: "Brown Planthopper on Rice Stalk",
      imageAlt: "Brown Planthopper adult feeding on lower rice stem"
    },
    {
      id: 1,
      name: "Green Leafhopper",
      scientificName: "Nephotettix virescens",
      localName: "Berdeng Ngusong Kabayo",
      threatLevel: "CRITICAL",
      threatColor: "text-rose-400 bg-rose-500/20 border-rose-400/40",
      threatBadge: "bg-rose-500 text-white",
      damageLoss: "50% – 80% Yield Reduction",
      symptoms: [
        "Primary vector for devastating Rice Tungro Bacilliform Virus",
        "Leaf tips turn vibrant orange-yellow with stunted plant growth",
        "Severely delayed panicle emergence and empty grains"
      ],
      damageDescription: "While direct sap-feeding causes leaf chlorosis, their primary danger is acting as the carrier for Tungro disease. Even low numbers can infect and ruin an entire paddy field.",
      acousticDefense: "Directional high-frequency pulses trigger escape reflexes and flight away from the canopy, eliminating vector transmission within the protected perimeter.",
      targetFrequency: "28.0 kHz – 42.0 kHz",
      imagePlaceholder: "Green Leafhopper on Rice Leaf",
      imageAlt: "Green Leafhopper vector perched on green rice canopy"
    },
    {
      id: 2,
      name: "Rice Stem Borer",
      scientificName: "Scirpophaga incertulas",
      localName: "Ubod ng Palay / Aksip",
      threatLevel: "HIGH",
      threatColor: "text-amber-400 bg-amber-500/20 border-amber-400/40",
      threatBadge: "bg-amber-500 text-forest-950",
      damageLoss: "30% – 60% Crop Destruction",
      symptoms: [
        "'Deadhearts' during tillering stage (central shoots die)",
        "'Whiteheads' during flowering stage (empty white panicles)",
        "Larval boring tunnels inside the hollow stems"
      ],
      damageDescription: "Yellow stem borer larvae bore directly into the stem center, severing vascular tissues from the inside out. Whiteheads produced during reproductive stages result in zero grain harvest.",
      acousticDefense: "Acoustic disruption interferes with adult female oviposition (egg-laying) behavior and larval sensory navigation, dramatically reducing egg cluster density.",
      targetFrequency: "22.0 kHz – 36.0 kHz",
      imagePlaceholder: "Rice Stem Borer Damage & Larva",
      imageAlt: "Stem borer moth and rice stem deadheart damage"
    },
    {
      id: 3,
      name: "Rice Leaf Folder",
      scientificName: "Cnaphalocrocis medinalis",
      localName: "Maniniklop ng Dahon",
      threatLevel: "HIGH",
      threatColor: "text-amber-400 bg-amber-500/20 border-amber-400/40",
      threatBadge: "bg-amber-500 text-forest-950",
      damageLoss: "25% – 50% Photosynthetic Loss",
      symptoms: [
        "Leaves longitudinally folded and spun together with silk threads",
        "White transparent streaks from scraped leaf epidermis",
        "Impaired photosynthesis causing poor panicle grain filling"
      ],
      damageDescription: "Larvae roll the leaf blade lengthwise and feed inside the protective fold, scraping the green chlorophyll tissue. High infestations leave fields looking white and scorched.",
      acousticDefense: "Repetitive ultrasonic vibrations vibrate the leaf surface, deterring adult moths from landing and disrupting larval silk-anchoring behavior.",
      targetFrequency: "30.0 kHz – 44.0 kHz",
      imagePlaceholder: "Rice Leaf Folder Folded Blade",
      imageAlt: "Folded rice leaf blade showing green tissue scraping"
    },
    {
      id: 4,
      name: "Rice Bug (Harang)",
      scientificName: "Leptocorisa oratorius",
      localName: "Atangya / Harang / Gandang Palay",
      threatLevel: "HIGH",
      threatColor: "text-amber-400 bg-amber-500/20 border-amber-400/40",
      damageLoss: "40% – 70% Grain Quality Loss",
      threatBadge: "bg-amber-500 text-forest-950",
      symptoms: [
        "Sucks milky sap from developing rice grains",
        "Empty, chaffy panicles and discolored brownish grain spots",
        "Characteristic pungent odor across infested paddies"
      ],
      damageDescription: "Attacks during the critical milky to dough grain development stages. Bugs puncture young grains, causing them to empty out and creating dark spotting that severely degrades market value.",
      acousticDefense: "High-dB acoustic pressure sweeps target the rice bug's sensitive antennal hearing organs, driving them out of the crop canopy before they can feed on grain clusters.",
      targetFrequency: "26.0 kHz – 40.0 kHz",
      imagePlaceholder: "Rice Bug (Atangya) on Grain Panicle",
      imageAlt: "Slender rice bug feeding on milky grain panicle"
    },
    {
      id: 5,
      name: "Rice Hispa",
      scientificName: "Dicladispa armigera",
      localName: "Hispa ng Palay",
      threatLevel: "MODERATE",
      threatColor: "text-emerald-400 bg-emerald-500/20 border-emerald-400/40",
      threatBadge: "bg-emerald-500 text-forest-950",
      damageLoss: "20% – 45% Yield Damage",
      symptoms: [
        "Adults scrape upper surface of leaf blade in parallel lines",
        "Grubs mine inside leaf tissue creating irregular white blisters",
        "Leaves wither, dry up, and turn membranous white"
      ],
      damageDescription: "Both adult spiny beetles and grubs damage leaves simultaneously. Heavy leaf epidermal mining severely reduces the crop's ability to produce photosynthetic energy.",
      acousticDefense: "Acoustic resonance induces stress reactions in mining grubs and repels adult beetles from colonizing young tillers.",
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
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-app-border shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300/60 px-3 py-1 rounded-full text-xs font-bold text-amber-900 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Crop Threat Intelligence & Biology</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-forest-950">
            Target Rice Pests & Damage Profiles
          </h3>
          <p className="text-xs text-forest-700 mt-0.5">
            Learn about each pest species, their potential crop destruction, and how EcoEcho's ultrasonic jamming neutralizes them.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono text-forest-600 font-bold mr-1">
            {selectedPestId + 1} / {pests.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-800 transition-colors cursor-pointer"
            title="Previous Pest"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-800 transition-colors cursor-pointer"
            title="Next Pest"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Pest Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {pests.map((pest) => {
          const isSelected = selectedPestId === pest.id;
          return (
            <button
              key={pest.id}
              onClick={() => setSelectedPestId(pest.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-forest-950 text-white border-forest-900 shadow-md scale-[1.02]'
                  : 'bg-forest-50/80 hover:bg-forest-100 text-forest-700 border-forest-200/80'
              }`}
            >
              <Bug className={`w-3.5 h-3.5 ${isSelected ? 'text-solar-400' : 'text-forest-500'}`} />
              <span>{pest.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Pest Profile Detail Card */}
      <div className="bg-gradient-to-br from-forest-50/50 via-white to-forest-50/30 rounded-3xl p-5 sm:p-7 border border-forest-100 shadow-sm space-y-6">
        
        {/* Top Header: Names + Threat Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-forest-100 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h4 className="text-xl sm:text-2xl font-black text-forest-950">
                {currentPest.name}
              </h4>
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${currentPest.threatBadge}`}>
                {currentPest.threatLevel} RISK
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-forest-600 mt-1">
              <span className="font-serif italic font-medium">{currentPest.scientificName}</span>
              <span>•</span>
              <span className="font-mono text-forest-700 font-bold">Local: {currentPest.localName}</span>
            </div>
          </div>

          {/* Maximum Potential Damage Loss Pill */}
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5 text-rose-900 shrink-0">
            <TrendingDown className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block leading-none">
                Potential Damage Impact
              </span>
              <span className="text-sm font-black text-rose-950 font-mono">
                {currentPest.damageLoss}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Picture Placeholder | Right Biological & Acoustic Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left (5 Cols): Pest Picture Container / Placeholder */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-forest-950 border border-forest-800 shadow-md aspect-video sm:aspect-4/3 flex flex-col items-center justify-center p-4 text-center group">
              
              {/* Visual Decorative Icon Background */}
              <div className="w-16 h-16 rounded-3xl bg-forest-900 border border-forest-700 flex items-center justify-center text-solar-400 mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Bug className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-black text-white">{currentPest.imagePlaceholder}</h5>
                <p className="text-xs text-forest-300 font-mono italic">
                  {currentPest.scientificName}
                </p>
              </div>

              {/* Photo Caption / Description */}
              <div className="absolute bottom-2 inset-x-2 bg-forest-950/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] text-forest-200 border border-forest-800 truncate">
                📷 {currentPest.imageAlt}
              </div>

              {/* AI Optical Eye Detection Badge */}
              <div className="absolute top-2.5 left-2.5 bg-emerald-500/90 text-forest-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Eye className="w-3 h-3" />
                <span>YOLOv8 Optical Class #{currentPest.id}</span>
              </div>
            </div>

            {/* Jamming Frequency Tuning Spec */}
            <div className="bg-white p-3 rounded-2xl border border-forest-100 shadow-sm flex items-center justify-between text-xs">
              <span className="text-forest-600 font-medium">Optimal Jamming Frequency:</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {currentPest.targetFrequency}
              </span>
            </div>
          </div>

          {/* Right (7 Cols): Damage Symptoms & Acoustic Solution */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* How It Attacks Crops */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Crop Damage Mechanism</span>
              </h5>
              <p className="text-xs text-forest-800 leading-relaxed">
                {currentPest.damageDescription}
              </p>
            </div>

            {/* Key Field Symptoms */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Recognized Infestation Symptoms</span>
              </h5>
              <div className="space-y-1.5">
                {currentPest.symptoms.map((symptom, sIdx) => (
                  <div key={sIdx} className="flex items-start space-x-2 text-xs text-forest-800 bg-white p-2.5 rounded-xl border border-forest-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How EcoEcho Stops It */}
            <div className="bg-forest-900 text-white p-4 rounded-2xl border border-forest-800 space-y-1.5 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-solar-500/20 text-solar-400 flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-xs font-black text-solar-300 uppercase tracking-wider">
                  How EcoEcho Acoustic Deterrent Neutralizes It
                </h5>
              </div>
              <p className="text-xs text-forest-100 leading-relaxed">
                {currentPest.acousticDefense}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
