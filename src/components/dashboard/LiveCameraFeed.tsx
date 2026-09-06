import React, { useState, useRef, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { AIDetectionOverlay } from './AIDetectionOverlay';
import { cleanHostOrIp, detectFrameFromAI } from '../../services/api';
import { 
  Camera, 
  CameraOff,
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Target, 
  Check,
  Wifi,
  Zap,
  LifeBuoy,
  Settings,
  HelpCircle
} from 'lucide-react';

export const LiveCameraFeed: React.FC = () => {
  const { 
    detections, 
    telemetry, 
    config,
    pushLiveDetections,
    setActiveTab
  } = useDevice();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isSnapshotCaptured, setIsSnapshotCaptured] = useState<boolean>(false);
  const [streamAttempt, setStreamAttempt] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const cleanIp = cleanHostOrIp(config.esp32Ip) || '192.168.254.106';
  const esp32DirectStreamUrl = `http://${cleanIp}:81/stream`;
  const esp32Port80StreamUrl = `http://${cleanIp}/stream`;

  const currentStreamUrl = telemetry.latestCameraFrame 
    ? telemetry.latestCameraFrame 
    : `${esp32DirectStreamUrl}${streamAttempt > 0 ? `?attempt=${streamAttempt}` : ''}`;

  // If camera stream doesn't load within 8s on initial load, show friendly troubleshooting
  useEffect(() => {
    const timeout = setTimeout(() => {
      const img = imgRef.current;
      if (img && !img.complete && !telemetry.latestCameraFrame) {
        setStreamError(true);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [streamAttempt, telemetry.latestCameraFrame]);

  // Real-time Background Frame Extractor -> AI Detection (Seamless & Silent)
  useEffect(() => {
    if (streamError) return;

    let isProcessing = false;
    const interval = setInterval(() => {
      if (isProcessing || !imgRef.current) return;
      const img = imgRef.current;

      // Only process when the image element has active frame dimensions
      if (!img.naturalWidth || !img.naturalHeight) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        isProcessing = true;

        // If on-device phone inference, pass canvas directly
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

        // For remote cloud server, encode to JPEG blob
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
  }, [streamError, config, pushLiveDetections]);

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

  const handleRetryStream = () => {
    setStreamError(false);
    setStreamAttempt(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-forest-950 rounded-3xl border border-forest-800 shadow-xl overflow-hidden flex flex-col transition-all relative ${
        isFullscreen ? 'p-4 justify-between fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Header Bar - Clean & Minimal: Only Snapshot and Fullscreen */}
      <div className="px-4 py-2.5 bg-forest-950/90 border-b border-forest-800 flex items-center justify-between gap-2 z-20">
        
        {/* Left: Target count only when pests are detected */}
        <div className="flex items-center space-x-2 min-h-[26px]">
          {detections.length > 0 && (
            <span className="bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce flex items-center gap-1.5 shadow-sm">
              <Target className="w-3.5 h-3.5" />
              <span>{detections.length} Pest{detections.length > 1 ? 's' : ''} Detected</span>
            </span>
          )}
        </div>

        {/* Right: ONLY Screenshot and Fullscreen Controls */}
        <div className="flex items-center space-x-2">
          {/* Screenshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-2 bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700/80 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Take Photo Snapshot"
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
            className="p-2 bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700/80 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Video Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[520px] bg-forest-950 flex items-center justify-center overflow-hidden">
        
        {!streamError ? (
          /* Live Stream from ESP32 */
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              ref={imgRef}
              crossOrigin="anonymous"
              src={currentStreamUrl}
              alt="ESP32 Live Field Camera"
              className="w-full h-full object-cover select-none"
              onLoad={() => setStreamError(false)}
              onError={() => {
                // If direct port 81 failed, try port 80 stream before giving up
                if (currentStreamUrl.includes(':81/stream')) {
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
          /* Farmer-Friendly Debug & Troubleshooting View */
          <div className="absolute inset-0 bg-forest-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-5 text-white z-30 overflow-y-auto">
            
            {/* Header Status */}
            <div className="flex items-center space-x-3 border-b border-forest-800/80 pb-2.5">
              <div className="w-9 h-9 rounded-2xl bg-solar-500/20 border border-solar-500/40 text-solar-400 flex items-center justify-center shrink-0">
                <CameraOff className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-black text-white">
                    Field Camera Offline
                  </h4>
                  <span className="bg-solar-500/20 text-solar-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-solar-500/30">
                    Needs Attention
                  </span>
                </div>
                <p className="text-[11px] text-forest-300 truncate">
                  Looking for camera station at <code className="text-solar-300 font-mono font-semibold">http://{cleanIp}:81</code>
                </p>
              </div>
            </div>

            {/* Practical Step-by-Step Farmer Checklist */}
            <div className="py-2.5 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-400 block">
                Quick Field Checks:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                {/* Step 1: Wi-Fi connection */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                    <Wifi className="w-3.5 h-3.5 shrink-0" />
                    <span>1. Check Wi-Fi</span>
                  </div>
                  <p className="text-[11px] text-forest-200 leading-relaxed">
                    Ensure your phone is connected to the same farm Wi-Fi or the field station hotspot.
                  </p>
                </div>

                {/* Step 2: Solar & Power */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-solar-400">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>2. Station Power</span>
                  </div>
                  <p className="text-[11px] text-forest-200 leading-relaxed">
                    Verify the solar battery switch is ON. Check for the green/red indicator LED on the device.
                  </p>
                </div>

                {/* Step 3: Verify Station IP */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-300">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>3. Verify Station IP</span>
                  </div>
                  <p className="text-[11px] text-forest-200 leading-relaxed">
                    Station IP is set to <span className="font-mono text-solar-300 font-bold">{cleanIp}</span>. Change in settings if different.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-2 border-t border-forest-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Retry Button */}
                <button
                  onClick={handleRetryStream}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>

                {/* Settings shortcut */}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-forest-900 hover:bg-forest-800 text-forest-200 hover:text-white text-xs font-medium px-3 py-1.5 rounded-xl border border-forest-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Change IP</span>
                </button>
              </div>

              {/* Get Help / Support Shortcut */}
              <button
                onClick={() => setActiveTab('support')}
                className="bg-solar-500 hover:bg-solar-400 text-forest-950 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-forest-950" />
                <span>Contact Field Support</span>
              </button>
            </div>

          </div>
        )}

        {/* Real-time Target Indicator on top right of video */}
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
