export type DeviceMode = 'AUTOMATIC' | 'DYNAMIC';

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'RECONNECTING';

export type CameraSource = 'WEBCAM' | 'ESP32' | 'SIMULATED';

export interface DeviceTelemetry {
  connectionStatus: ConnectionStatus;
  esp32Ip: string;
  wsUrl: string;
  batteryLevel: number; // 0 - 100%
  batteryVoltage: number; // e.g. 4.15V
  solarVoltage: number; // 5.0V indicator
  solarCurrentMa: number; // e.g. 380 mA
  solarPowerMw: number; // e.g. 1900 mW
  isCharging: boolean;
  uptimeSeconds: number;
  firmwareVersion: string;
  wifiRssi: number; // e.g. -62 dBm
  currentFrequencyKhz: number; // 20 - 45 kHz
  isSweepActive: boolean;
  activeJammingPulse: boolean;
  lastPingTimestamp: number;
  cpuTemperatureC: number;
  freeHeapKb: number;
  aiServerOnline: boolean;
  modelName: string;
  fps: number;
  lastInferenceMs: number;
  cameraSource?: CameraSource;
  webcamIndex?: number;
  cameraConnected?: boolean;
  webcamConnected?: boolean;
}

export interface BoundingBox {
  x: number; // Percentage 0-100 from left
  y: number; // Percentage 0-100 from top
  width: number; // Percentage 0-100 width
  height: number; // Percentage 0-100 height
}

export type PestType = 
  | 'Brown Planthopper' 
  | 'Green Leafhopper' 
  | 'Leaf Folder'
  | 'Rice Bug'
  | 'Rice Stem Borer' 
  | 'Whorl Maggot'
  | 'Zigzag Leafhopper';

export interface AIDetectionEvent {
  id: string;
  timestamp: string;
  pestType: PestType | string;
  scientificName: string;
  confidence: number; // 0.00 to 1.00
  bbox: BoundingBox;
  actionTaken: string;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  coordinates: string; // e.g. "Sector A-3"
  isDeterred: boolean;
}

export interface DailyAnalytics {
  day: string; // e.g. "Mon", "Tue"
  date: string;
  detections: number;
  brownPlanthopperCount: number;
  otherPestsCount: number;
  jammingEvents: number;
  sprayEventsActual: number;
  sprayEventsTraditional: number;
  chemicalPesticideSavedLiters: number;
  costSavedPhp: number;
  solarYieldWh: number;
  batteryAvgPct: number;
}

export interface SupportTicket {
  id: string;
  farmerName: string;
  contactNumber: string;
  locationSector: string;
  issueCategory: 'HARDWARE_REPAIR' | 'FIRMWARE_CALIBRATION' | 'BATTERY_SOLAR' | 'AI_CAMERA_CLEANING' | 'GENERAL_INQUIRY';
  urgency: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  description: string;
  createdAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface DeviceConfig {
  esp32Ip: string;
  wsUrl: string;
  aiApiEndpoint: string;
  aiServerUrl: string;
  cameraSource: CameraSource;
  webcamIndex: number;
  useSimulatedHardware: boolean;
  sweepMinKhz: number;
  sweepMaxKhz: number;
  sweepCycleSeconds: number;
  dynamicBurstDurationMs: number;
  sensitivityThreshold: number;
  soundAlarmEnabled: boolean;
}
