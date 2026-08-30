import React from 'react';
import { DeviceStatusHeader } from '../components/dashboard/DeviceStatusHeader';
import { LiveCameraFeed } from '../components/dashboard/LiveCameraFeed';
import { ModeSwitcher } from '../components/dashboard/ModeSwitcher';
import { DetectionLog } from '../components/dashboard/DetectionLog';
import { useDevice } from '../context/DeviceContext';
import { 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Volume2, 
  Bug, 
  Leaf, 
  ArrowUpRight 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { setActiveTab, triggerTestSweep, isTestingSweep } = useDevice();

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      
      {/* 1. Device Status Telemetry Header */}
      <DeviceStatusHeader />

      {/* 2. Main Live Feed & AI Vision Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left 7 Cols: Live Camera Feed with AI Bounding Box Layer */}
        <div className="lg:col-span-7 space-y-4">
          <LiveCameraFeed />
        </div>

        {/* Right 5 Cols: Mode Switcher & Acoustic Jamming Control */}
        <div className="lg:col-span-5 space-y-4">
          <ModeSwitcher />

          {/* Quick Eco & Safety Impact Summary Banner */}
          <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 border border-forest-700/60 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-solar-400 font-bold text-xs">
                <Leaf className="w-4 h-4" />
                <span>Ecosystem Safe Deterrence</span>
              </div>
              <p className="text-xs text-forest-100 font-medium">
                0% Chemicals • 0% Toxins • 20–45 kHz Ultrasonic Waves
              </p>
            </div>
            <button
              onClick={() => setActiveTab('about')}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Learn how it works"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Live Pest Detection Log Feed */}
      <DetectionLog />

    </div>
  );
};
