import React, { useState } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { Download, X, Smartphone, WifiOff, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { pwaInstallPrompt, installPwa, isInstalled, isOnline } = useDevice();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  const handleInstall = async () => {
    const ok = await installPwa();
    if (ok) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="bg-amber-500/90 text-amber-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>Field Offline Mode Active — Cached telemetry & local AI models operational</span>
          </div>
          <span className="bg-amber-950/20 px-2 py-0.5 rounded text-[10px] font-mono">PWA Offline</span>
        </div>
      )}

      {/* Install Banner */}
      {!isInstalled && !dismissed && pwaInstallPrompt && (
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 border border-forest-700/60 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center space-x-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-forest-700/60 border border-forest-500/40 flex items-center justify-center text-solar-400 shrink-0 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-forest-50 flex items-center gap-1.5">
                Install EcoEcho App
                <span className="bg-solar-500 text-forest-950 font-bold text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-forest-200/90 leading-tight">
                Add to your phone's Home Screen for instant field monitoring & offline access.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 z-10 shrink-0">
            <button
              onClick={handleInstall}
              className="bg-solar-500 hover:bg-solar-400 active:scale-95 text-forest-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-forest-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Background subtle glow */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-solar-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="bg-forest-800 text-forest-100 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg border border-forest-600">
          <CheckCircle2 className="w-4 h-4 text-solar-400" />
          <span>EcoEcho installed successfully! You can launch it from your home screen.</span>
        </div>
      )}
    </div>
  );
};
