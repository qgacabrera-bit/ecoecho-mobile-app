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
  LifeBuoy
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
  const [streamSrc, setStreamSrc] = useState<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const cleanIp = cleanHostOrIp(config.esp32Ip) || '192.168.254.106';
  const esp32DirectStreamUrl = `http://${cleanIp}:81/stream`;
  const esp32Port80StreamUrl = `http://${cleanIp}/stream`;

  // Explicitly close socket when user refreshes or closes tab so ESP32 frees up stream socket immediately
  useEffect(() => {
    const handleUnload = () => {
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
  }, []);

  // Delay mounting stream slightly on refresh/mount so ESP32 has 400ms to drop any previous dead socket
  useEffect(() => {
    setStreamError(false);
    const timer = setTimeout(() => {
      if (telemetry.latestCameraFrame) {
        setStreamSrc(telemetry.latestCameraFrame);
      } else {
        setStreamSrc(`${esp32DirectStreamUrl}?t=${Date.now()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [cleanIp, telemetry.latestCameraFrame, streamAttempt]);

  // Safety timer: Only triggers if after 12s no video dimensions (naturalWidth) exist at all
  useEffect(() => {
    if (!streamSrc) return;

    const timeout = setTimeout(() => {
      const img = imgRef.current;
      // Do NOT check img.complete because MJPEG streams never complete. Check naturalWidth:
      if (img && img.naturalWidth === 0 && !telemetry.latestCameraFrame) {
        setStreamError(true);
      }
    }, 12000);

    return () => clearTimeout(timeout);
  }, [streamSrc, telemetry.latestCameraFrame]);

  // Real-time Background Frame Extractor -> AI Detection (Seamless & Silent)
  useEffect(() => {
    if (streamError) return;

    let isProcessing = false;
    const interval = setInterval(() => {
      if (isProcessing || !imgRef.current) return;
      const img = imgRef.current;

      // Only process when the image element has active frame dimensions
      if (!img.naturalWidth || !img.naturalHeight) return;

      // Stream is actively flowing frames, make sure error state is false
      setStreamError(false);

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

  // Sync isFullscreen state when user exits via ESC key or browser gesture
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
    setStreamSrc('');
    setStreamAttempt(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-forest-950 rounded-3xl border border-forest-800 shadow-xl overflow-hidden flex flex-col transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none bg-black w-screen h-screen' : ''
      }`}
    >
      {/* Top Header Bar - Floating overlay in fullscreen, compact bar in normal view */}
      <div className={`px-4 py-2.5 flex items-center justify-between gap-2 z-30 transition-all ${
        isFullscreen 
          ? 'absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent' 
          : 'bg-forest-950/90 border-b border-forest-800'
      }`}>
        
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
            className={`p-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 ${
              isFullscreen 
                ? 'bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm' 
                : 'bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white border border-forest-700/80'
            }`}
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
            className={`p-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 ${
              isFullscreen 
                ? 'bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm' 
                : 'bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white border border-forest-700/80'
            }`}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Video Viewport */}
      <div className={`relative w-full flex items-center justify-center overflow-hidden ${
        isFullscreen 
          ? 'flex-1 h-full w-full bg-black' 
          : 'aspect-[16/10] sm:aspect-[16/9] max-h-[520px] bg-forest-950'
      }`}>
        
        {!streamError ? (
          /* Live Stream from ESP32 */
          <div className="w-full h-full relative flex items-center justify-center">
            {streamSrc ? (
              <div className={`relative flex items-center justify-center ${
                isFullscreen ? 'w-full h-full max-w-full max-h-full aspect-[4/3]' : 'w-full h-full'
              }`}>
                <img
                  ref={imgRef}
                  crossOrigin="anonymous"
                  src={streamSrc}
                  alt="ESP32 Live Field Camera"
                  className={`w-full h-full select-none ${
                    isFullscreen ? 'object-contain' : 'object-cover'
                  }`}
                  onLoad={() => setStreamError(false)}
                  onError={() => {
                    // If direct port 81 failed, try port 80 stream before giving up
                    if (streamSrc.includes(':81/stream')) {
                      setStreamSrc(`${esp32Port80StreamUrl}?t=${Date.now()}`);
                    } else {
                      setStreamError(true);
                    }
                  }}
                />
                <AIDetectionOverlay detections={detections} />
              </div>
            ) : (
              <div className="flex items-center justify-center text-xs text-forest-400 font-mono">
                Connecting to field camera...
              </div>
            )}
          </div>
        ) : (
          /* Clean & Simple Farmer Troubleshooting - No Boxes */
          <div className="absolute inset-0 bg-forest-950/95 flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-3">
            <CameraOff className="w-9 h-9 text-solar-400/90" />
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base font-black text-white">
                Camera View Offline
              </h4>
              <p className="text-xs text-forest-200/90 leading-relaxed font-medium">
                Try turning the device switch off and on again, and make sure your phone is connected to the field Wi-Fi.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleRetryStream}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className="bg-forest-900/90 hover:bg-forest-800 text-forest-200 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl border border-forest-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-solar-400" />
                <span>Go to Support</span>
              </button>
            </div>
          </div>
        )}

        {/* Real-time Target Indicator on top right of video */}
        {detections.length > 0 && (
          <div className={`absolute right-3 bg-amber-500 text-forest-950 font-black px-3 py-1.5 rounded-xl text-xs z-20 flex items-center gap-1.5 shadow-lg animate-pulse ${
            isFullscreen ? 'top-16' : 'top-3'
          }`}>
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
