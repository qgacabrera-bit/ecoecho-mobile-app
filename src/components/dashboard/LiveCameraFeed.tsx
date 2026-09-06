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
  Check
} from 'lucide-react';

export const LiveCameraFeed: React.FC = () => {
  const { 
    detections, 
    telemetry, 
    config,
    pushLiveDetections
  } = useDevice();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isSnapshotCaptured, setIsSnapshotCaptured] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const cleanIp = cleanHostOrIp(config.esp32Ip) || '192.168.254.106';
  const esp32DirectStreamUrl = `http://${cleanIp}:81/stream`;
  const esp32Port80StreamUrl = `http://${cleanIp}/stream`;

  const currentStreamUrl = telemetry.latestCameraFrame 
    ? telemetry.latestCameraFrame 
    : esp32DirectStreamUrl;

  // Real-time Background Frame Extractor -> AI Detection (Seamless & Silent)
  useEffect(() => {
    if (streamError) return;

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

  return (
    <div 
      ref={containerRef}
      className={`bg-forest-950 rounded-3xl border border-forest-800 shadow-xl overflow-hidden flex flex-col transition-all relative ${
        isFullscreen ? 'p-4 justify-between fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Header Bar - Clean & Minimal: Only Snapshot and Fullscreen */}
      <div className="px-4 py-3 bg-forest-950/90 border-b border-forest-800 flex items-center justify-between gap-2 z-20">
        
        {/* Left: Target count only when pests are detected */}
        <div className="flex items-center space-x-2 min-h-[28px]">
          {detections.length > 0 && (
            <span className="bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-1 rounded-full animate-bounce flex items-center gap-1.5 shadow-sm">
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
            className="p-2.5 bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700/80 transition-all cursor-pointer shadow-xs active:scale-95"
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
            className="p-2.5 bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white rounded-xl border border-forest-700/80 transition-all cursor-pointer shadow-xs active:scale-95"
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
              onError={() => {
                // If direct port 81 failed, try port 80 stream before giving up
                if (currentStreamUrl === esp32DirectStreamUrl) {
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
            <h4 className="text-base font-black text-white">Camera Disconnected</h4>
            <p className="text-xs text-forest-200 max-w-sm">
              Connecting to <code className="bg-forest-900 px-1.5 py-0.5 rounded text-solar-400 font-mono">http://{config.esp32Ip}</code>. Ensure your device is connected to the same Wi-Fi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setStreamError(false)}
                className="bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
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
