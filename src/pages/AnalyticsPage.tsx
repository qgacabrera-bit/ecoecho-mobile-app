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
  Zap
} from 'lucide-react';

const sevenDayPestData = [
  { day: 'Mon', date: 'Aug 24', bph: 142, other: 24, total: 166, jammingBursts: 158 },
  { day: 'Tue', date: 'Aug 25', bph: 185, other: 31, total: 216, jammingBursts: 202 },
  { day: 'Wed', date: 'Aug 26', bph: 120, other: 18, total: 138, jammingBursts: 130 },
  { day: 'Thu', date: 'Aug 27', bph: 240, other: 42, total: 282, jammingBursts: 271 },
  { day: 'Fri', date: 'Aug 28', bph: 98, other: 15, total: 113, jammingBursts: 108 },
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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-forest-950">Field Analytics & Eco Impact</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Pest & Spray Trends
            </span>
          </div>
          <p className="text-xs text-forest-700/80 mt-0.5">
            Acoustic deterrence efficacy, pesticide elimination metrics, and solar telemetry.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-forest-50 p-1 rounded-2xl border border-forest-200/80 text-xs font-bold self-start sm:self-auto">
          {(['7D', '30D', 'SEASON'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-forest-700 hover:text-forest-950'
              }`}
            >
              {range === '7D' ? 'Last 7 Days' : range === '30D' ? 'Last 30 Days' : 'Full Crop Season'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Chemical Sprays Reduced */}
        <div className="bg-white p-4 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Spray Events Target
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-forest-950">0 Sprays</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> 100%
              </span>
            </div>
            <p className="text-[11px] text-forest-600 mt-0.5">Target: 0% Toxic Chemical Sprays</p>
          </div>
        </div>

        {/* 2. Total Pests Deterred */}
        <div className="bg-white p-4 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
              Pests Jammed (7D)
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-forest-950">1,054</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -68% infestation
              </span>
            </div>
            <p className="text-[11px] text-forest-600 mt-0.5">904 Brown Planthoppers</p>
          </div>
        </div>

        {/* 3. Estimated Cost Savings */}
        <div className="bg-white p-4 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-solar-800">
              Chemical Cost Saved
            </span>
            <div className="w-8 h-8 rounded-xl bg-solar-100 flex items-center justify-center text-solar-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-forest-950">₱34,500</span>
              <span className="text-xs font-bold text-emerald-600">($615)</span>
            </div>
            <p className="text-[11px] text-forest-600 mt-0.5">76 Liters pesticide averted</p>
          </div>
        </div>

        {/* 4. Acoustic Transducer Uptime */}
        <div className="bg-white p-4 rounded-3xl border border-app-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
              Deterrence Efficiency
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-forest-950">97.4%</span>
              <span className="text-xs font-bold text-emerald-600">Optimal</span>
            </div>
            <p className="text-[11px] text-forest-600 mt-0.5">20-45 kHz Jamming Success</p>
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Chart 1: Pest Detections Over Last 7 Days (Instructions.md Requirement) */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-forest-950">
                Pest Detections Over Last 7 Days
              </h3>
              <p className="text-xs text-forest-700/80">
                Daily Brown Planthopper (BPH) and other pest counts.
              </p>
            </div>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              BPH Focus
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sevenDayPestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bphGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2ECE6" vertical={false} />
                <XAxis dataKey="day" stroke="#587366" fontSize={11} tickLine={false} />
                <YAxis stroke="#587366" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#132A20', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#74C69D' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="bph" 
                  name="Brown Planthopper" 
                  stroke="#1B4332" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#bphGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="other" 
                  name="Other Field Pests" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#otherGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Spray Events Reduced (Target: 0%) (Instructions.md Requirement) */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-forest-950">
                Spray Events Reduced (Target: 0%)
              </h3>
              <p className="text-xs text-forest-700/80">
                Comparison of chemical sprays required vs. traditional farming.
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Zero Chemical Goal
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chemicalSprayComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2ECE6" vertical={false} />
                <XAxis dataKey="category" stroke="#587366" fontSize={11} tickLine={false} />
                <YAxis stroke="#587366" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#132A20', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#74C69D' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar 
                  dataKey="traditionalSprays" 
                  name="Traditional Chemical Sprays" 
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

        {/* Chart 3: Hourly Diurnal Flight Peak Activity vs Acoustic Sweep Frequency */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-forest-950">
              Diurnal Flight Hours vs. Acoustic Frequency
            </h3>
            <p className="text-xs text-forest-700/80">
              Pests spike during dawn/dusk hours (6 AM & 6 PM). Frequency sweeps dynamically scale up to 45 kHz.
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyPestActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2ECE6" vertical={false} />
                <XAxis dataKey="time" stroke="#587366" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#587366" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} tickLine={false} domain={[25, 50]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#132A20', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#74C69D' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="activity" 
                  name="Pest Activity Index" 
                  stroke="#1B4332" 
                  strokeWidth={3} 
                  dot={{ fill: '#1B4332', r: 3 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="jammingKhz" 
                  name="Acoustic Frequency (kHz)" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  dot={{ fill: '#F59E0B', r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Solar Harvesting & 5V Stability */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-forest-950">
                Solar Yield & Battery Level (5V Rail)
              </h3>
              <p className="text-xs text-forest-700/80">
                Photovoltaic energy generated and LiFePO4 battery percentage over 7 days.
              </p>
            </div>
            <span className="bg-solar-100 text-solar-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              5.0V Self-Sustained
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solarEnergyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2ECE6" vertical={false} />
                <XAxis dataKey="day" stroke="#587366" fontSize={11} tickLine={false} />
                <YAxis stroke="#587366" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#132A20', borderRadius: '12px', border: '1px solid #2D6A4F', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#74C69D' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="solarYieldWh" 
                  name="Solar Yield (Watt-hours)" 
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
