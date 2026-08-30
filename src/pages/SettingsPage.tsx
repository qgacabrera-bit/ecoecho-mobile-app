import React, { useState, useEffect } from 'react';
import { useDevice } from '../context/DeviceContext';
import { 
  Wifi, 
  Zap, 
  Save, 
  CheckCircle2, 
  Square, 
  RotateCcw, 
  Smartphone, 
  ShieldCheck,
  Activity,
  Bug,
  ChevronDown,
  ChevronUp,
  Radio,
  Volume2
} from 'lucide-react';
import { AcousticWaveformVisualizer } from '../components/layout/AcousticWaveformVisualizer';
import { checkAIServerStatus, updateAIServerConfig } from '../services/api';
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
    esp32Ip: config.esp32Ip,
    wsUrl: config.wsUrl,
    aiApiEndpoint: config.aiApiEndpoint,
    aiServerUrl: config.aiServerUrl || 'http://127.0.0.1:5000',
    cameraSource: 'ESP32',
    webcamIndex: 0,
    useSimulatedHardware: config.useSimulatedHardware,
    sweepMinKhz: config.sweepMinKhz,
    sweepMaxKhz: config.sweepMaxKhz,
    sweepCycleSeconds: config.sweepCycleSeconds ?? 4,
    dynamicBurstDurationMs: config.dynamicBurstDurationMs,
    sensitivityThreshold: config.sensitivityThreshold ?? 0.70,
    soundAlarmEnabled: config.soundAlarmEnabled
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<boolean>(false);
  const [showAdvancedNetwork, setShowAdvancedNetwork] = useState<boolean>(false);
  const [aiServerCheck, setAiServerCheck] = useState<{
    tested: boolean;
    online: boolean;
  }>({ tested: false, online: false });

  const testAIServer = async () => {
    const res = await checkAIServerStatus(formConfig.aiServerUrl);
    setAiServerCheck({
      tested: true,
      online: res.online
    });
  };

  useEffect(() => {
    testAIServer();
  }, [formConfig.aiServerUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formConfig);

    await updateAIServerConfig(formConfig, {
      cameraSource: 'esp32',
      confidenceThreshold: formConfig.sensitivityThreshold,
      sensitivityThreshold: formConfig.sensitivityThreshold,
      esp32Url: `http://${formConfig.esp32Ip}/capture`
    });

    setIsSaved(true);
    testAIServer();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults: DeviceConfig = {
      esp32Ip: '192.168.100.135',
      wsUrl: 'ws://192.168.100.135:81',
      aiApiEndpoint: 'http://127.0.0.1:5000/api/detect',
      aiServerUrl: 'http://127.0.0.1:5000',
      cameraSource: 'ESP32',
      webcamIndex: 0,
      useSimulatedHardware: true,
      sweepMinKhz: 30.0,
      sweepMaxKhz: 45.0,
      sweepCycleSeconds: 4,
      dynamicBurstDurationMs: 2500,
      sensitivityThreshold: 0.70,
      soundAlarmEnabled: true
    };
    setFormConfig(defaults);
    updateConfig(defaults);
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  const protectedPests = [
    { name: "Brown Planthopper", scientific: "Nilaparvata lugens", risk: "Primary Threat" },
    { name: "Green Leafhopper", scientific: "Nephotettix virescens", risk: "Tungro Vector" },
    { name: "Leaf Folder", scientific: "Cnaphalocrocis medinalis", risk: "Leaf Damage" },
    { name: "Rice Bug", scientific: "Leptocorisa oratorius", risk: "Grain Sap Feeder" },
    { name: "Rice Stem Borer", scientific: "Scirpophaga incertulas", risk: "Deadheart Pest" },
    { name: "Whorl Maggot", scientific: "Hydrellia philippina", risk: "Seedling Damage" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300 pb-6 max-w-5xl mx-auto">
      
      {/* 1. Clean Header */}
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-app-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-forest-950">Field Station & Protection Settings</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Production Active
            </span>
          </div>
          <p className="text-xs text-forest-700 mt-1">
            Calibrate detection sensitivity, acoustic frequencies, and hardware connection.
          </p>
        </div>

        {/* AI Server Status Ping */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={testAIServer}
            className="bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold px-3 py-2 rounded-xl border border-forest-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-forest-600" />
            <span>Check AI Status</span>
          </button>
          <span className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border ${
            aiServerCheck.online ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-solar-50 text-solar-900 border-solar-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${aiServerCheck.online ? 'bg-emerald-500 animate-pulse' : 'bg-solar-500'}`} />
            <span>{aiServerCheck.online ? 'AI Brain Online' : 'AI Standby'}</span>
          </span>
        </div>
      </div>

      {/* 2. Protected Rice Pests Section */}
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-app-border shadow-xs space-y-3.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-forest-950">Active Defense Targets</h3>
        </div>
        <p className="text-xs text-forest-700">
          EcoEcho's vision model is trained to spot and repel these 6 key rice pests using ultrasonic frequencies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {protectedPests.map((pest, idx) => (
            <div key={idx} className="p-3 bg-forest-50/80 border border-forest-200/80 rounded-2xl flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-200/70 text-forest-800 flex items-center justify-center font-bold">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-forest-950">{pest.name}</h4>
                  <p className="text-[10px] text-forest-600 italic">{pest.scientific}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                Protected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Calibration Controls Form */}
      <form onSubmit={handleSave} className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-app-border shadow-xs space-y-5">
        
        {/* Detection Sensitivity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
                AI Detection Sensitivity (Confidence Limit)
              </h4>
              <p className="text-xs text-forest-600">
                Filters out background field movement. 70% is the optimal balance for precision.
              </p>
            </div>
            <span className="font-mono text-xs font-black bg-solar-100 text-solar-950 border border-solar-300 px-3 py-1 rounded-xl">
              {(formConfig.sensitivityThreshold * 100).toFixed(0)}% Confidence
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
          <div className="flex justify-between text-[11px] text-forest-500 font-mono">
            <span>30% (More Sensitive)</span>
            <span className="font-bold text-forest-900">70% (Recommended)</span>
            <span>95% (Strict)</span>
          </div>
        </div>

        {/* Ultrasonic Frequency Sliders */}
        <div className="border-t border-forest-100 pt-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
            Acoustic Deterrence Frequencies (kHz)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-forest-900">Minimum Frequency</span>
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
                <span>20.0 kHz (Lower Limit)</span>
                <span>30.0 kHz</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-forest-900">Maximum Frequency</span>
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
                <span>45.0 kHz (Upper Limit)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Network Settings */}
        <div className="border-t border-forest-100 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvancedNetwork(!showAdvancedNetwork)}
            className="w-full flex items-center justify-between text-xs font-bold text-forest-700 hover:text-forest-950 py-2 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>Advanced Hardware & Network Configuration</span>
            </span>
            {showAdvancedNetwork ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvancedNetwork && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  ESP32 Field Station Local IP
                </label>
                <input
                  type="text"
                  required
                  value={formConfig.esp32Ip}
                  onChange={(e) => setFormConfig({ ...formConfig, esp32Ip: e.target.value })}
                  placeholder="e.g. 192.168.100.135"
                  className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  AI Server / Public Tunnel URL
                </label>
                <input
                  type="text"
                  required
                  value={formConfig.aiServerUrl}
                  onChange={(e) => setFormConfig({ ...formConfig, aiServerUrl: e.target.value })}
                  placeholder="e.g. http://127.0.0.1:5000 or https://xxxx.loca.lt"
                  className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>
            </div>
          )}
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
      </form>

      {/* 4. Safe Sound Test Tool */}
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

      {/* 5. Mobile App Install Card */}
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
