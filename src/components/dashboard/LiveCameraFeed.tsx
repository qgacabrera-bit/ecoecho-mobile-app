import React, { useState, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { AIDetectionOverlay } from './AIDetectionOverlay';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Target, 
  ShieldAlert, 
  Check, 
  Radio,
  Wifi
} from 'lucide-react';

export const LiveCameraFeed: React.FC = () => {
  const { 
    detections, 
    telemetry, 
    config 
  } = useDevice();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isSnapshotCaptured, setIsSnapshotCaptured] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dedicated AI-annotated live stream URL from ESP32 camera
  const aiAnnotatedStreamUrl = `${config.aiServerUrl}/api/annotated-stream`;

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
              <Wifi className="w-3 h-3 text-emerald-400" />
              ESP32 Field Camera
            </span>
          </div>

          {detections.length > 0 && (
            <span className="bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>{detections.length} Pest{detections.length > 1 ? 's' : ''} Detected</span>
            </span>
          )}
        </div>

        {/* Right: Camera Action Controls */}
        <div className="flex items-center space-x-2">
          
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
          /* Live Stream from ESP32 via AI Server */
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={aiAnnotatedStreamUrl}
              alt="ESP32 Live Field Camera"
              className="w-full h-full object-cover select-none"
              onError={() => setStreamError(true)}
            />
            <AIDetectionOverlay detections={detections} />
          </div>
        ) : (
          /* Offline Fallback */
          <div className="absolute inset-0 bg-forest-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
            <ShieldAlert className="w-10 h-10 text-solar-400" />
            <h4 className="text-base font-black text-white">ESP32 Camera Stream Offline</h4>
            <p className="text-xs text-forest-200 max-w-sm">
              Waiting for frames from the ESP32 field station. Please ensure your ESP32-CAM is powered and streaming.
            </p>
            <button
              onClick={() => setStreamError(false)}
              className="bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reconnect Stream</span>
            </button>
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
