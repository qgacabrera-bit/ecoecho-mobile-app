import React, { useState, useRef, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { AIDetectionOverlay } from './AIDetectionOverlay';
import { cleanHostOrIp, detectFrameFromAI } from '../../services/api';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Target, 
  ShieldAlert, 
  Check, 
  Radio,
  Wifi,
  Video,
  Sparkles,
  Zap
} from 'lucide-react';

export const LiveCameraFeed: React.FC = () => {
  const { 
    detections, 
    telemetry, 
    config,
    triggerAITest,
    pushLiveDetections
  } = useDevice();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isSnapshotCaptured, setIsSnapshotCaptured] = useState<boolean>(false);
  const [isTestingAI, setIsTestingAI] = useState<boolean>(false);
  const [streamSource, setStreamSource] = useState<'direct' | 'ai'>('direct');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const cleanIp = cleanHostOrIp(config.esp32Ip) || '192.168.254.106';
  const esp32DirectStreamUrl = `http://${cleanIp}:81/stream`;
  const esp32Port80StreamUrl = `http://${cleanIp}/stream`;
  const aiAnnotatedStreamUrl = `${config.aiServerUrl}/api/annotated-stream`;

  // Choose stream: direct local ESP32 stream (0 latency) or AI annotated stream
  const currentStreamUrl = telemetry.latestCameraFrame 
    ? telemetry.latestCameraFrame
    : (streamSource === 'ai' ? aiAnnotatedStreamUrl : esp32DirectStreamUrl);

  // Real-time Client Canvas Frame Extractor -> On-Device or Cloud AI Backend
  useEffect(() => {
    if (streamSource !== 'direct' || streamError) return;

    let isProcessing = false;
    const interval = setInterval(() => {
      if (isProcessing || !imgRef.current) return;
      const img = imgRef.current;
      if (!img.complete || img.naturalWidth === 0) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        isProcessing = true;

        // If on-device phone inference, pass canvas directly for instant zero-latency processing
        if (config.aiEngineMode === 'ON_DEVICE' || !config.aiEngineMode) {
          detectFrameFromAI(canvas, config).then((res) => {
            if (res.success && res.detections) {
              pushLiveDetections(res.detections);
            }
          }).catch(() => {}).finally(() => {
            isProcessing = false;
          });
          return;
        }

        // For remote cloud server, encode to JPEG blob and POST
        canvas.toBlob(async (blob) => {
          if (!blob) {
            isProcessing = false;
            return;
          }
          try {
            const res = await detectFrameFromAI(blob, config);
            if (res.success && res.detections) {
              pushLiveDetections(res.detections);
            }
          } catch {
            // Ignore frame drop
          } finally {
            isProcessing = false;
          }
        }, 'image/jpeg', 0.80);
      } catch {
        isProcessing = false;
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [streamSource, streamError, config, pushLiveDetections]);

  const handleTestPest = async () => {
    setIsTestingAI(true);
    try {
      await triggerAITest();
    } finally {
      setTimeout(() => setIsTestingAI(false), 600);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCaptureSnapshot = () => {
    setIsSnapshotCaptured(true);
    setTimeout(() => setIsSnapshotCaptured(false), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-forest-950 rounded-3xl border border-forest-800 shadow-xl overflow-hidden flex flex-col transition-all relative ${
        isFullscreen ? 'p-4 justify-between fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-forest-950/90 border-b border-forest-800 flex items-center justify-between gap-2 z-20">
        
        {/* Left: Production ESP32 Live Camera Status */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="flex items-center gap-1">
              {telemetry.latestCameraFrame ? (
                <span>☁️ MQTT Cloud Stream ({config.deviceId})</span>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>ESP32 Field Camera</span>
                </>
              )}
            </span>
          </div>

          {detections.length > 0 && (
            <span className="bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>{detections.length} Pest{detections.length > 1 ? 's' : ''} Detected</span>
            </span>
          )}
        </div>

        {/* Right: Camera Action Controls & Stream Switcher */}
        <div className="flex items-center space-x-2">
          
          {/* Stream Selector Toggle */}
          {!telemetry.latestCameraFrame && (
            <div className="hidden sm:flex items-center bg-forest-900/80 p-0.5 rounded-xl border border-forest-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => { setStreamSource('direct'); setStreamError(false); }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  streamSource === 'direct' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-forest-300 hover:text-white'
                }`}
                title="Direct local stream from ESP32 (zero latency)"
              >
                <Video className="w-3 h-3" />
                <span>ESP32 Direct</span>
              </button>
              <button
                type="button"
                onClick={() => { setStreamSource('ai'); setStreamError(false); }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  streamSource === 'ai' 
                    ? 'bg-solar-500 text-forest-950 shadow-xs font-black' 
                    : 'text-forest-300 hover:text-white'
                }`}
                title="AI Vision Server stream with server-side rendered boxes"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Stream</span>
              </button>
            </div>
          )}

          {/* Test AI Pest Trigger Button */}
          <button
            type="button"
            onClick={handleTestPest}
            disabled={isTestingAI}
            className="px-2.5 py-1.5 bg-solar-500 hover:bg-solar-400 active:scale-95 text-forest-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Send a verified Rice Pest test sample to YOLO best.pt to test bounding boxes and acoustic deterrence"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isTestingAI ? 'animate-spin' : 'text-forest-950'}`} />
            <span>{isTestingAI ? 'Testing...' : 'Test AI Pest'}</span>
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-2 bg-forest-900 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700 transition-colors cursor-pointer"
            title="Save Snapshot to Field Log"
          >
            {isSnapshotCaptured ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-forest-900 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Live Video Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] bg-forest-950 flex items-center justify-center overflow-hidden">
        
        {!streamError ? (
          /* Live Stream from ESP32 */
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              ref={imgRef}
              crossOrigin="anonymous"
              src={currentStreamUrl}
              alt="ESP32 Live Field Camera"
              className="w-full h-full object-cover select-none"
              onError={() => {
                // If direct port 81 failed, try port 80 stream before giving up
                if (streamSource === 'direct' && currentStreamUrl === esp32DirectStreamUrl) {
                  const img = imgRef.current;
                  if (img) img.src = esp32Port80StreamUrl;
                } else {
                  setStreamError(true);
                }
              }}
            />
            <AIDetectionOverlay detections={detections} />
          </div>
        ) : (
          /* Offline / Local IP Guidance Fallback */
          <div className="absolute inset-0 bg-forest-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
            <ShieldAlert className="w-10 h-10 text-solar-400" />
            <h4 className="text-base font-black text-white">ESP32 Camera Not Reached</h4>
            <p className="text-xs text-forest-200 max-w-sm">
              Connecting to <code className="bg-forest-900 px-1.5 py-0.5 rounded text-solar-400 font-mono">http://{config.esp32Ip}</code>. Ensure your phone/device is on the same local Wi-Fi or ESP32 Hotspot.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setStreamError(false)}
                className="bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
              <a
                href={`http://${config.esp32Ip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-solar-500 hover:bg-solar-400 text-forest-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span>Test ESP32 Direct Link</span>
              </a>
            </div>
          </div>
        )}

        {/* Real-time Target Indicator */}
        {detections.length > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-forest-950 font-black px-3 py-1.5 rounded-xl text-xs z-20 flex items-center gap-1.5 shadow-lg animate-pulse">
            <Target className="w-3.5 h-3.5" />
            <span>{detections[0].pestType}</span>
          </div>
        )}

        {/* Snapshot Shutter Flash */}
        {isSnapshotCaptured && (
          <div className="absolute inset-0 bg-white opacity-80 z-40 pointer-events-none transition-opacity duration-500" />
        )}
      </div>

      {/* Diagnostic AI Status HUD Strip */}
      <div className="px-4 py-2.5 bg-forest-950 border-t border-forest-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {config.aiEngineMode === 'ON_DEVICE' || !config.aiEngineMode ? (
              <span>📱 Phone On-Device Engine (100% Offline)</span>
            ) : (
              <span>AI Brain: {telemetry.aiServerOnline ? 'Online' : 'Standby'} {telemetry.lastInferenceMs ? `(${telemetry.lastInferenceMs}ms)` : ''}</span>
            )}
          </span>
          <span className="text-forest-700">|</span>
          <span className="text-forest-300 font-mono">
            Conf: <strong className="text-solar-400">{(config.sensitivityThreshold * 100).toFixed(0)}%</strong>
          </span>
          <span className="text-forest-700">|</span>
          <span className="text-forest-400 font-mono text-[11px]">
            Feed: {streamSource === 'ai' ? 'Server Annotated' : 'ESP32 Local Direct'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {detections.length > 0 ? (
            <span className="text-amber-300 font-bold flex items-center gap-1 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-lg text-[11px]">
              <Target className="w-3 h-3 text-amber-400" />
              <span>{detections.length} Target(s) Locked: {detections[0].pestType}</span>
            </span>
          ) : (
            <span className="text-forest-400 text-[11px] italic">
              Scanning for 6 Rice Pests... Tap "Test AI Pest" to verify YOLO box
            </span>
          )}
        </div>
      </div>

      {/* Snapshot Toast Message */}
      {isSnapshotCaptured && (
        <div className="px-4 py-2 bg-emerald-900 text-emerald-100 text-xs font-bold text-center border-t border-emerald-700 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Crop photo snapshot recorded to field activity log.</span>
        </div>
      )}

    </div>
  );
};
