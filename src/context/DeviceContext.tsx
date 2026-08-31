import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  DeviceConfig, 
  DeviceMode, 
  DeviceTelemetry, 
  AIDetectionEvent, 
  PestType 
} from '../types';
import { 
  getDefaultConfig, 
  saveDeviceConfig, 
  fetchDeviceStatus, 
  toggleDeviceMode, 
  getAIDetections, 
  generateLiveSimulationEvent,
  triggerFrequencyTest as apiTriggerTest
} from '../services/api';
import mqtt, { MqttClient } from 'mqtt';
import { playAudibleSweepSimulation } from '../services/audioSimulator';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface DeviceContextType {
  telemetry: DeviceTelemetry;
  mode: DeviceMode;
  setMode: (mode: DeviceMode) => Promise<void>;
  detections: AIDetectionEvent[];
  detectionHistory: AIDetectionEvent[];
  config: DeviceConfig;
  updateConfig: (newConfig: Partial<DeviceConfig>) => void;
  isTestingSweep: boolean;
  activeTestFrequency: number;
  triggerTestSweep: (durationSeconds?: number) => Promise<void>;
  stopTestSweep: () => void;
  isSimulatingPests: boolean;
  setIsSimulatingPests: (val: boolean) => void;
  triggerManualDetection: (pestType?: PestType | string) => void;
  pushLiveDetections: (newDetections: AIDetectionEvent[]) => void;
  clearDetectionLog: () => void;
  pwaInstallPrompt: BeforeInstallPromptEvent | null;
  installPwa: () => Promise<boolean>;
  isInstalled: boolean;
  isOnline: boolean;
  activeTab: 'dashboard' | 'analytics' | 'about' | 'support' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'about' | 'support' | 'settings') => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<DeviceConfig>(getDefaultConfig);
  const [mode, setModeState] = useState<DeviceMode>('AUTOMATIC');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'about' | 'support' | 'settings'>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // PWA install state
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Test sweep state
  const [isTestingSweep, setIsTestingSweep] = useState<boolean>(false);
  const [activeTestFrequency, setActiveTestFrequency] = useState<number>(30.0);
  const [stopAudioCallback, setStopAudioCallback] = useState<(() => void) | null>(null);

  // AI Pest Detection state (Real best.pt detections)
  const [isSimulatingPests, setIsSimulatingPests] = useState<boolean>(false);
  const [detections, setDetections] = useState<AIDetectionEvent[]>([]);
  const [detectionHistory, setDetectionHistory] = useState<AIDetectionEvent[]>([]);

  // Telemetry state
  const [telemetry, setTelemetry] = useState<DeviceTelemetry>({
    connectionStatus: 'ONLINE',
    esp32Ip: config.esp32Ip,
    wsUrl: config.wsUrl,
    batteryLevel: 92,
    batteryVoltage: 4.18,
    solarVoltage: 5.04,
    solarCurrentMa: 380,
    solarPowerMw: 1915,
    isCharging: true,
    uptimeSeconds: 42100,
    firmwareVersion: 'v2.4.1-AcousticPro',
    wifiRssi: -54,
    currentFrequencyKhz: 36.5,
    isSweepActive: true,
    activeJammingPulse: false,
    lastPingTimestamp: Date.now(),
    cpuTemperatureC: 33.5,
    freeHeapKb: 218,
    aiServerOnline: false,
    modelName: 'best.pt (YOLO Rice Pest Model)',
    fps: 0,
    lastInferenceMs: 0
  });

  // Listen to PWA install prompts
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPwaInstallPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update configuration
  const updateConfig = (newConfig: Partial<DeviceConfig>) => {
    setConfigState(prev => {
      const updated = { ...prev, ...newConfig };
      saveDeviceConfig(updated);
      return updated;
    });
  };

  // Push detections from live inference (Webcam, Browser, Upload)
  const pushLiveDetections = useCallback((newDetections: AIDetectionEvent[]) => {
    setDetections(newDetections);
    if (newDetections.length > 0) {
      setDetectionHistory(prev => {
        const combined = [...newDetections, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique.slice(0, 50);
      });

      // Trigger dynamic acoustic jamming if Brown Planthopper is detected
      const hasBPH = newDetections.some(d => String(d.pestType).toLowerCase().includes('planthopper'));
      if (mode === 'DYNAMIC' && hasBPH) {
        setTelemetry(prev => ({
          ...prev,
          activeJammingPulse: true,
          currentFrequencyKhz: 42.5
        }));
        setTimeout(() => {
          setTelemetry(prev => ({ ...prev, activeJammingPulse: false }));
        }, 2200);
      }
    }
  }, [mode]);

  // Poll device telemetry and live AI detections from best.pt
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const data = await fetchDeviceStatus(config);
        setTelemetry(prev => ({
          ...data,
          uptimeSeconds: prev.uptimeSeconds + 1,
          currentFrequencyKhz: isTestingSweep ? activeTestFrequency : data.currentFrequencyKhz
        }));

        // If Python AI server is online, fetch live detections from best.pt
        if (data.aiServerOnline) {
          const live = await getAIDetections(config, mode);
          pushLiveDetections(live);
        }
      } catch (err) {
        console.error('[EcoEcho] Telemetry poll error:', err);
      }
    };

    poll();
    intervalId = setInterval(poll, 1200);
    return () => clearInterval(intervalId);
  }, [config, isTestingSweep, activeTestFrequency, mode, pushLiveDetections]);

  // Real-time Cloud MQTT Client (HiveMQ / EMQX WSS)
  useEffect(() => {
    if (!config.mqttBrokerUrl || !config.deviceId) return;

    let client: MqttClient | null = null;
    try {
      client = mqtt.connect(config.mqttBrokerUrl, {
        clientId: `ecoecho_web_${Math.random().toString(16).substring(2, 9)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 4000
      });

      client.on('connect', () => {
        setTelemetry(prev => ({ ...prev, mqttConnected: true }));
        const topicFilter = `ecoecho/${config.deviceId}/#`;
        client?.subscribe(topicFilter, (err) => {
          if (!err) {
            console.log(`[EcoEcho MQTT] Subscribed to ${topicFilter}`);
          }
        });
      });

      client.on('message', (topic, payload) => {
        try {
          const str = payload.toString();
          if (topic.endsWith('/camera')) {
            const frameSrc = str.startsWith('data:image') ? str : `data:image/jpeg;base64,${str}`;
            setTelemetry(prev => ({ 
              ...prev, 
              latestCameraFrame: frameSrc, 
              cameraConnected: true,
              connectionStatus: 'ONLINE' 
            }));
          } else if (topic.endsWith('/status')) {
            const data = JSON.parse(str);
            setTelemetry(prev => ({
              ...prev,
              batteryLevel: data.battery ?? prev.batteryLevel,
              solarVoltage: data.solar ?? prev.solarVoltage,
              currentFrequencyKhz: data.freq ?? prev.currentFrequencyKhz,
              connectionStatus: 'ONLINE',
              lastPingTimestamp: Date.now()
            }));
          } else if (topic.endsWith('/detections')) {
            const data = JSON.parse(str);
            if (Array.isArray(data)) {
              pushLiveDetections(data);
            }
          }
        } catch {
          // Ignore parse errors on raw binary/truncated messages
        }
      });

      client.on('offline', () => {
        setTelemetry(prev => ({ ...prev, mqttConnected: false }));
      });

      client.on('error', () => {
        setTelemetry(prev => ({ ...prev, mqttConnected: false }));
      });
    } catch {
      // MQTT init fallback
    }

    return () => {
      if (client) {
        try {
          client.end(true);
        } catch {}
      }
    };
  }, [config.mqttBrokerUrl, config.deviceId, pushLiveDetections]);

  // Toggle Device Mode
  const setMode = async (newMode: DeviceMode) => {
    setModeState(newMode);
    await toggleDeviceMode(newMode, config);
  };

  // Manual Trigger Detection (for simulation testing button only)
  const triggerManualDetection = useCallback((pestType: PestType | string = 'Brown Planthopper') => {
    const event = generateLiveSimulationEvent(mode);
    event.pestType = pestType;
    event.scientificName = pestType === 'Brown Planthopper' ? 'Nilaparvata lugens' : (
      pestType === 'Green Leafhopper' ? 'Nephotettix virescens' : 'Scirpophaga incertulas'
    );
    event.confidence = 0.982;
    event.actionTaken = mode === 'DYNAMIC' 
      ? 'Acoustic Jamming Active (43.5 kHz)' 
      : 'Automatic Sweep Active (38.0 kHz)';
    
    setDetections(prev => [event, ...prev.slice(0, 2)]);
    setDetectionHistory(prev => [event, ...prev].slice(0, 50));

    if (mode === 'DYNAMIC') {
      setTelemetry(prev => ({
        ...prev,
        activeJammingPulse: true,
        currentFrequencyKhz: 43.5
      }));
      setTimeout(() => {
        setTelemetry(prev => ({ ...prev, activeJammingPulse: false }));
      }, 2500);
    }
  }, [mode]);

  const clearDetectionLog = () => {
    setDetectionHistory([]);
    setDetections([]);
  };

  const triggerTestSweep = async (durationSeconds: number = 3.5) => {
    if (isTestingSweep) return;
    setIsTestingSweep(true);

    await apiTriggerTest(config, durationSeconds * 1000);

    const stopAudio = playAudibleSweepSimulation(durationSeconds, (khz) => {
      setActiveTestFrequency(khz);
      setTelemetry(prev => ({ ...prev, currentFrequencyKhz: khz, activeJammingPulse: true }));
    });
    setStopAudioCallback(() => stopAudio);

    setTimeout(() => {
      setIsTestingSweep(false);
      setStopAudioCallback(null);
      setTelemetry(prev => ({ ...prev, activeJammingPulse: false }));
    }, durationSeconds * 1000);
  };

  const stopTestSweep = () => {
    if (stopAudioCallback) {
      stopAudioCallback();
      setStopAudioCallback(null);
    }
    setIsTestingSweep(false);
    setTelemetry(prev => ({ ...prev, activeJammingPulse: false }));
  };

  const installPwa = async (): Promise<boolean> => {
    if (!pwaInstallPrompt) return false;
    try {
      await pwaInstallPrompt.prompt();
      const choice = await pwaInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setPwaInstallPrompt(null);
        return true;
      }
    } catch (err) {
      console.error('[EcoEcho PWA] Install error:', err);
    }
    return false;
  };

  return (
    <DeviceContext.Provider
      value={{
        telemetry,
        mode,
        setMode,
        detections,
        detectionHistory,
        config,
        updateConfig,
        isTestingSweep,
        activeTestFrequency,
        triggerTestSweep,
        stopTestSweep,
        isSimulatingPests,
        setIsSimulatingPests,
        triggerManualDetection,
        pushLiveDetections,
        clearDetectionLog,
        pwaInstallPrompt,
        installPwa,
        isInstalled,
        isOnline,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
