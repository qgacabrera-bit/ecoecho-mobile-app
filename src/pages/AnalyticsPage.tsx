import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Bug, 
  Droplet, 
  ShieldCheck, 
  Sun, 
  DollarSign, 
  Calendar, 
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Radio
} from 'lucide-react';

const sevenDayPestData = [
  { day: 'Mon', date: 'Aug 24', bph: 142, other: 24, total: 166, jammingBursts: 158 },
  { day: 'Tue', date: 'Aug 25', bph: 185, other: 31, total: 216, jammingBursts: 202 },
  { day: 'Wed', date: 'Aug 26', bph: 120, other: 18, total: 138, jammingBursts: 130 },
  { day: 'Thu', date: 'Aug 27', bph: 240, other: 42, total: 282, jammingBursts: 271 }, // Spike
  { day: 'Fri', date: 'Aug 28', bph: 98, other: 15, total: 113, jammingBursts: 108 },  // Repelled
  { day: 'Sat', date: 'Aug 29', bph: 74, other: 12, total: 86, jammingBursts: 81 },
  { day: 'Sun', date: 'Aug 30', bph: 45, other: 8, total: 53, jammingBursts: 50 },
];

const chemicalSprayComparisonData = [
  { category: 'Week 1', traditionalSprays: 4, ecoEchoSprays: 0, chemicalSavedLiters: 16 },
  { category: 'Week 2', traditionalSprays: 5, ecoEchoSprays: 0, chemicalSavedLiters: 20 },
  { category: 'Week 3', traditionalSprays: 4, ecoEchoSprays: 0, chemicalSavedLiters: 16 },
  { category: 'Week 4', traditionalSprays: 6, ecoEchoSprays: 0, chemicalSavedLiters: 24 },
];

const hourlyPestActivityData = [
  { time: '00:00', activity: 8, jammingKhz: 32 },
  { time: '04:00', activity: 14, jammingKhz: 34 },
  { time: '06:00', activity: 68, jammingKhz: 42 }, // Dawn flight peak
  { time: '08:00', activity: 42, jammingKhz: 38 },
  { time: '12:00', activity: 12, jammingKhz: 31 },
  { time: '16:00', activity: 54, jammingKhz: 40 },
  { time: '18:00', activity: 92, jammingKhz: 44 }, // Dusk flight peak
  { time: '20:00', activity: 61, jammingKhz: 39 },
  { time: '22:00', activity: 22, jammingKhz: 33 },
];

const solarEnergyData = [
  { day: 'Mon', solarYieldWh: 142, batteryAvg: 94 },
  { day: 'Tue', solarYieldWh: 158, batteryAvg: 96 },
  { day: 'Wed', solarYieldWh: 110, batteryAvg: 89 },
  { day: 'Thu', solarYieldWh: 165, batteryAvg: 98 },
  { day: 'Fri', solarYieldWh: 172, batteryAvg: 99 },
  { day: 'Sat', solarYieldWh: 148, batteryAvg: 95 },
  { day: 'Sun', solarYieldWh: 155, batteryAvg: 97 },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'SEASON'>('7D');
  const [fieldActionActive, setFieldActionActive] = useState<boolean>(false);

  const triggerPerimeterBoost = () => {
    setFieldActionActive(true);
    setTimeout(() => setFieldActionActive(false), 5000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-forest-950">Field Analytics & Savings</h2>
            <span className="bg-emerald-100 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              Live Field Data
            </span>
          </div>
          <p className="text-xs text-forest-900 font-medium mt-0.5">
            Pest repelling statistics, pesticide cost savings, and solar battery health.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-forest-100 p-1 rounded-2xl border border-forest-300 text-xs font-black self-start sm:self-auto">
          {(['7D', '30D', 'SEASON'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-forest-950 text-white shadow-sm'
                  : 'text-forest-900 hover:text-forest-950'
              }`}
            >
              {range === '7D' ? 'Last 7 Days' : range === '30D' ? 'Last 30 Days' : 'Full Season'}
            </button>
          ))}
        </div>
      </div>

      {/* ⚡ SMART FIELD ADVISORY & QUICK ACTION BANNER */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white p-4 sm:p-5 rounded-3xl border border-amber-500/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-solar-400 shrink-0 mt-0.5 shadow-inner">
            <Zap className="w-5 h-5 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-forest-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Field Advisory
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                Pest Spike Detected on Thursday (240 Bugs at 2:00 PM)
              </h4>
            </div>
            <p className="text-xs text-forest-200 mt-1 leading-relaxed font-medium">
              <strong>Action Taken:</strong> Dynamic Ultrasonic Jamming auto-engaged for 35 mins. Pest count dropped by <strong>81%</strong> back to safe levels (45 bugs).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          <button
            onClick={triggerPerimeterBoost}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
              fieldActionActive
                ? 'bg-emerald-500 text-forest-950 scale-105'
                : 'bg-solar-500 hover:bg-solar-400 text-forest-950'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{fieldActionActive ? 'Perimeter Boost Active (15m)' : 'Run 15-min Perimeter Boost'}</span>
          </button>
        </div>
      </div>

      {/* High-Contrast KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Chemical Sprays Reduced */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
              Pesticide Sprays
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-forest-950">0 Sprays</span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> 100%
              </span>
            </div>
            <p className="text-xs text-forest-900 font-bold mt-1">Target: 0% Toxic Chemical Sprays</p>
          </div>
        </div>

        {/* 2. Total Pests Deterred */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-forest-950">
              Pests Repelled (7D)
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-100 flex items-center justify-center text-forest-950 font-bold">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-forest-950">1,054</span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -68% pests
              </span>
            </div>
            <p className="text-xs text-forest-900 font-bold mt-1">904 Brown Planthoppers stopped</p>
          </div>
        </div>

        {/* 3. Estimated Cost Savings */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
              Money Saved on Spray
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-950 font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-forest-950">₱34,500</span>
              <span className="text-xs font-bold text-forest-700">($615)</span>
            </div>
            <p className="text-xs text-forest-900 font-bold mt-1">76 Liters pesticide averted</p>
          </div>
        </div>

        {/* 4. Acoustic Transducer Uptime */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-forest-950">
              Sound Shield Uptime
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-100 flex items-center justify-center text-forest-950 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-forest-950">97.4%</span>
              <span className="text-xs font-black text-emerald-700">Optimal</span>
            </div>
            <p className="text-xs text-forest-900 font-bold mt-1">24/7 Solar Off-Grid Guard</p>
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Chart 1: Pest Detections Over Last 7 Days */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-forest-950">
                Pest Detections Over Last 7 Days
              </h3>
              <p className="text-xs text-forest-900 font-medium">
                Notice the Thursday spike (240 bugs) that dropped to 45 after sound defense engaged.
              </p>
            </div>
            <span className="bg-amber-100 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
              BPH Focus
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sevenDayPestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bphGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.85}/>
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                <XAxis dataKey="day" stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D14', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#52B788' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="bph" 
                  name="Brown Planthopper (BPH)" 
                  stroke="#0B1D14" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#bphGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="other" 
                  name="Other Rice Pests" 
                  stroke="#D97706" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#otherGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Chemical Sprays Reduced vs Traditional Farming */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-forest-950">
                Spray Comparison: Traditional vs EcoEcho
              </h3>
              <p className="text-xs text-forest-900 font-medium">
                EcoEcho completely eliminated the need for chemical sprays across all 4 weeks.
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              0 Sprays Achieved
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chemicalSprayComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                <XAxis dataKey="category" stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D14', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#52B788' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '8px' }} />
                <Bar 
                  dataKey="traditionalSprays" 
                  name="Traditional Chemical Sprays (Per Week)" 
                  fill="#94A3B8" 
                  radius={[6, 6, 0, 0]} 
                />
                <Bar 
                  dataKey="ecoEchoSprays" 
                  name="EcoEcho Chemical Sprays (0 Target)" 
                  fill="#10B981" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Peak Flight Hours (Dawn & Dusk) */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-forest-950">
              Peak Pest Hours vs. Sound Defense Power
            </h3>
            <p className="text-xs text-forest-900 font-medium">
              Insects swarm at dawn (6 AM) and dusk (6 PM). EcoEcho automatically raises repelling power during these hours.
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyPestActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                <XAxis dataKey="time" stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <YAxis yAxisId="left" stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#D97706" fontSize={12} fontWeight="bold" tickLine={false} domain={[25, 50]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D14', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#52B788' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '8px' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="activity" 
                  name="Pest Activity Level" 
                  stroke="#0B1D14" 
                  strokeWidth={3} 
                  dot={{ fill: '#0B1D14', r: 4 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="jammingKhz" 
                  name="Sound Pitch (kHz)" 
                  stroke="#D97706" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  dot={{ fill: '#D97706', r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Solar Harvesting & 5V Stability */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-forest-950">
                Solar Battery Power (100% Off-Grid)
              </h3>
              <p className="text-xs text-forest-900 font-medium">
                Solar energy gathered during daytime keeps the battery at 95%+ every night.
              </p>
            </div>
            <span className="bg-solar-100 text-solar-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-solar-300">
              5.0V Constant
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solarEnergyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.85}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                <XAxis dataKey="day" stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#0F291E" fontSize={12} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D14', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#52B788' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="solarYieldWh" 
                  name="Solar Power Generated (Watt-hours)" 
                  stroke="#D97706" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#solarGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
