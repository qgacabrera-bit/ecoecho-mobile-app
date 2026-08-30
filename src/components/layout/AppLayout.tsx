import React from 'react';
import { useDevice } from '../../context/DeviceContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Info, 
  HelpCircle, 
  Settings, 
  Sun, 
  BatteryCharging, 
  Radio
} from 'lucide-react';
import { PWAInstallBanner } from './PWAInstallBanner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, telemetry } = useDevice();

  // Desktop Navigation Items
  const desktopNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  // Mobile Bottom Navigation (Dashboard in center)
  const mobileNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isCenter: true },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-app-bg text-app-textDark flex flex-col antialiased font-sans relative">
      
      {/* Ambient Rice Field Background Layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}rice_field_bg.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-forest-950/5 via-transparent to-forest-950/10" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-forest-950/95 text-white border-b border-forest-800 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Brand Logo & Title */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-white/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img 
                  src={`${import.meta.env.BASE_URL}EcoLogo-removebg.png`} 
                  alt="EcoEcho Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black tracking-tight text-white">EcoEcho</span>
                  <span className="bg-solar-500 text-forest-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-forest-300 font-medium hidden xs:block">
                  Rice Field Pest Deterrent
                </p>
              </div>
            </div>

            {/* Center: Clean Floating Desktop Navigation Items */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-solar-500 text-forest-950 shadow-sm'
                        : 'text-forest-200 hover:text-white hover:bg-forest-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-forest-950' : 'text-forest-300'}`} />
                    <span>{item.label}</span>
                    {item.id === 'dashboard' && telemetry.activeJammingPulse && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Hardware Telemetry Badges */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Solar Badge */}
              <div className="hidden sm:flex items-center space-x-1.5 bg-solar-500/15 border border-solar-400/30 text-solar-400 px-2.5 py-1 rounded-xl text-xs font-bold">
                <Sun className="w-3.5 h-3.5 text-solar-400" />
                <span className="font-mono">5.0V</span>
              </div>

              {/* Battery Badge */}
              <div className="flex items-center space-x-1.5 bg-forest-900 border border-forest-800 text-forest-200 px-2.5 py-1 rounded-xl text-xs font-bold">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{telemetry.batteryLevel}%</span>
              </div>

              {/* ESP32 Status Pill */}
              <div className="flex items-center space-x-1.5 bg-forest-900 border border-forest-800 px-2.5 py-1 rounded-xl text-xs font-semibold">
                <span className={`w-2 h-2 rounded-full ${
                  telemetry.connectionStatus === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`} />
                <span className="font-bold text-white text-[11px]">ESP32</span>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 pb-24 md:pb-8 space-y-4 sm:space-y-6">
        <PWAInstallBanner />
        {children}
      </main>

      {/* 100% Opaque, High-Contrast Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-950 border-t border-forest-800 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCenter = 'isCenter' in item && item.isCenter;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none ${
                  isActive 
                    ? 'text-solar-400' 
                    : 'text-forest-200 hover:text-white'
                }`}
              >
                {/* Icon Container */}
                <div className={`flex items-center justify-center rounded-xl transition-all ${
                  isCenter
                    ? isActive 
                      ? 'w-11 h-11 bg-solar-500 text-forest-950 shadow-lg shadow-solar-500/30 ring-2 ring-solar-400/50' 
                      : 'w-11 h-11 bg-forest-900 text-white border border-forest-700 shadow-md'
                    : 'w-8 h-8'
                }`}>
                  <Icon className={`${isCenter ? 'w-5 h-5' : 'w-5 h-5'} ${
                    !isCenter ? (isActive ? 'text-solar-400' : 'text-forest-200') : ''
                  }`} />
                </div>

                {/* High-Contrast Crisp Label */}
                <span className={`text-[11px] font-black mt-1 tracking-tight truncate max-w-[64px] ${
                  isActive ? 'text-solar-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-forest-200'
                }`}>
                  {item.label}
                </span>

                {/* Subtle Active Indicator Dot for non-center items */}
                {!isCenter && isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-solar-400 mt-0.5 shadow-sm shadow-solar-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Clean Desktop Footer */}
      <footer className="hidden md:block border-t border-app-border bg-white py-4 px-6 text-center text-xs text-forest-600 font-medium">
        EcoEcho Field Station • Solar Powered Bio-Acoustic Rice Protection • 0% Chemicals
      </footer>

    </div>
  );
};
