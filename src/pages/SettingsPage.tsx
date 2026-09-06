import React, { useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import { 
  Wifi, 
  Zap, 
  Save, 
  CheckCircle2, 
  Square, 
  RotateCcw, 
  Smartphone, 
  Volume2
} from 'lucide-react';
import { AcousticWaveformVisualizer } from '../components/layout/AcousticWaveformVisualizer';
import { cleanHostOrIp } from '../services/api';
import { DeviceConfig } from '../types';

export const SettingsPage: React.FC = () => {
  const { 
    config, 
    updateConfig, 
    isTestingSweep, 
    triggerTestSweep, 
    stopTestSweep,
    installPwa,
    isInstalled,
    pwaInstallPrompt 
  } = useDevice();

  const [formConfig, setFormConfig] = useState<DeviceConfig>({
    esp32Ip: cleanHostOrIp(config.esp32Ip) || '192.168.254.106',
    wsUrl: config.wsUrl || 'ws://192.168.254.106:81',
    mqttBrokerUrl: '',
    deviceId: config.deviceId || 'ECOECHO-01',
    aiApiEndpoint: '',
    aiServerUrl: '',
    cameraSource: 'ESP32',
    webcamIndex: 0,
    useSimulatedHardware: config.useSimulatedHardware,
    sweepMinKhz: config.sweepMinKhz,
    sweepMaxKhz: config.sweepMaxKhz,
    sweepCycleSeconds: config.sweepCycleSeconds ?? 4,
    dynamicBurstDurationMs: config.dynamicBurstDurationMs,
    sensitivityThreshold: config.sensitivityThreshold ?? 0.70,
    soundAlarmEnabled: config.soundAlarmEnabled,
    aiEngineMode: 'ON_DEVICE'
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIp = cleanHostOrIp(formConfig.esp32Ip) || '192.168.254.106';
    const sanitizedConfig: DeviceConfig = {
      ...formConfig,
      esp32Ip: cleanIp,
      wsUrl: `ws://${cleanIp}:81`,
      aiEngineMode: 'ON_DEVICE'
    };
    setFormConfig(sanitizedConfig);
    updateConfig(sanitizedConfig);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults: DeviceConfig = {
      esp32Ip: '192.168.254.106',
      wsUrl: 'ws://192.168.254.106:81',
      mqttBrokerUrl: '',
      deviceId: 'ECOECHO-01',
      aiApiEndpoint: '',
      aiServerUrl: '',
      cameraSource: 'ESP32',
      webcamIndex: 0,
      useSimulatedHardware: true,
      sweepMinKhz: 20.0,
      sweepMaxKhz: 45.0,
      sweepCycleSeconds: 4,
      dynamicBurstDurationMs: 2500,
      sensitivityThreshold: 0.70,
      soundAlarmEnabled: true,
      aiEngineMode: 'ON_DEVICE'
    };
    setFormConfig(defaults);
    updateConfig(defaults);
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300 pb-6 max-w-5xl mx-auto">
      
      {/* 1. Header Card - Compact & Clean */}
      <div className="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-app-border shadow-xs flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black text-forest-950 truncate">Field Station Settings</h2>
            <span className="bg-emerald-100 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
              Active Guard
            </span>
          </div>
          <p className="text-[11px] text-forest-700 font-medium mt-0.5">
            Calibrate detection sensitivity, sound waves, and field station IP.
          </p>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 border bg-emerald-50 text-emerald-900 border-emerald-300 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">📱 On-Device AI Active</span>
          <span className="sm:hidden">AI Active</span>
        </span>
      </div>

      {/* 2. Main Calibration Controls Form */}
      <form onSubmit={handleSave} className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-app-border shadow-xs space-y-4">
        
        {/* Pest Detection Sensitivity Slider */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
                Pest Detection Alert Sensitivity
              </h4>
              <p className="text-xs text-forest-600">
                Controls how strictly the camera confirms bugs before sounding alarms. Balanced (70%) ignores swaying leaves and wind.
              </p>
            </div>
            <span className={`self-start sm:self-auto font-mono text-xs font-black border px-3 py-1 rounded-xl shrink-0 ${
              formConfig.sensitivityThreshold >= 0.85
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : formConfig.sensitivityThreshold <= 0.45
                ? 'bg-blue-100 text-blue-950 border-blue-300'
                : 'bg-solar-100 text-solar-950 border-solar-300'
            }`}>
              {formConfig.sensitivityThreshold <= 0.45
                ? `High Sensitivity (${(formConfig.sensitivityThreshold * 100).toFixed(0)}%)`
                : formConfig.sensitivityThreshold >= 0.85
                ? `Strict Confirmation (${(formConfig.sensitivityThreshold * 100).toFixed(0)}%)`
                : `Balanced Guard (${(formConfig.sensitivityThreshold * 100).toFixed(0)}%)`}
            </span>
          </div>

          <input
            type="range"
            min="0.30"
            max="0.95"
            step="0.05"
            value={formConfig.sensitivityThreshold}
            onChange={(e) => setFormConfig({ ...formConfig, sensitivityThreshold: parseFloat(e.target.value) })}
            className="w-full accent-forest-700 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-forest-600 font-medium">
            <span>Catches Subtle Movement (30%)</span>
            <span className="font-black text-forest-950">Balanced (Recommended 70%)</span>
            <span>Confirmed Pests Only (95%)</span>
          </div>
        </div>

        {/* Ultrasonic Frequency Sliders */}
        <div className="border-t border-forest-100 pt-3.5 space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Ultrasonic Sound Shield Range (kHz)
            </h4>
            <p className="text-xs text-forest-600 mt-0.5">
              Eco-friendly bio-acoustic waves (20–45 kHz) repel rice pests safely without chemicals, noise disturbance, or harming crops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-forest-900">Starting Sound Wave</span>
                <span className="font-mono text-forest-700">{formConfig.sweepMinKhz.toFixed(1)} kHz</span>
              </div>
              <input
                type="range"
                min="20"
                max="30"
                step="0.5"
                value={formConfig.sweepMinKhz}
                onChange={(e) => setFormConfig({ ...formConfig, sweepMinKhz: Math.max(20, parseFloat(e.target.value)) })}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-forest-500 font-mono mt-0.5">
                <span>20.0 kHz (Minimum)</span>
                <span>30.0 kHz</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-forest-900">Peak Deterrent Wave</span>
                <span className="font-mono text-solar-700">{formConfig.sweepMaxKhz.toFixed(1)} kHz</span>
              </div>
              <input
                type="range"
                min="35"
                max="45"
                step="0.5"
                value={formConfig.sweepMaxKhz}
                onChange={(e) => setFormConfig({ ...formConfig, sweepMaxKhz: Math.min(45, parseFloat(e.target.value)) })}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-forest-500 font-mono mt-0.5">
                <span>35.0 kHz</span>
                <span>45.0 kHz (Maximum)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ESP32 Hardware Connection Section */}
        <div className="bg-forest-50/80 border border-forest-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-forest-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              ESP32 Field Station Connection
            </h4>
          </div>
          <p className="text-[11px] text-forest-600">
            Enter the local Wi-Fi or Hotspot IP address of your ESP32-CAM device.
          </p>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              ESP32 Field Station IP Address
            </label>
            <input
              type="text"
              required
              value={formConfig.esp32Ip}
              onChange={(e) => setFormConfig({ ...formConfig, esp32Ip: e.target.value })}
              placeholder="e.g. 192.168.254.106"
              className="w-full px-3 py-2 bg-white border border-forest-200 rounded-xl text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-forest-100">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-4 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-forest-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-solar-500 hover:bg-solar-400 text-forest-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Settings successfully applied to field station!</span>
          </div>
        )}

        {resetMessage && (
          <div className="p-3 bg-solar-100 border border-solar-300 text-solar-900 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-solar-700" />
            <span>Configuration reset to factory defaults!</span>
          </div>
        )}
      </form>

      {/* 3. Safe Sound Test Tool */}
      <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-5 sm:p-6 rounded-3xl border border-forest-800 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-solar-400" />
              <h3 className="text-base font-black text-white">Manual Sound Test Tool</h3>
            </div>
            <p className="text-xs text-forest-200 mt-0.5">
              Audition the acoustic sweep safely through an audible test tone simulator.
            </p>
          </div>

          <div className="shrink-0">
            {isTestingSweep ? (
              <button
                type="button"
                onClick={stopTestSweep}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Sound Test</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerTestSweep(4)}
                className="bg-solar-500 hover:bg-solar-400 text-forest-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Volume2 className="w-4 h-4 text-forest-950" />
                <span>Test Sound Sweep (4s)</span>
              </button>
            )}
          </div>
        </div>

        <AcousticWaveformVisualizer showDetails={false} />
      </div>

      {/* 4. Mobile App Install Card */}
      {!isInstalled && (
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-app-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-solar-100 text-solar-800 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-forest-950">Install EcoEcho on your Phone</h4>
              <p className="text-xs text-forest-600">Access field camera and alerts directly from your home screen.</p>
            </div>
          </div>
          {pwaInstallPrompt && (
            <button
              type="button"
              onClick={installPwa}
              className="bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Install App
            </button>
          )}
        </div>
      )}

    </div>
  );
};
