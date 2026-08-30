/**
 * Web Audio API Acoustic Frequency Sweep Synthesizer
 * Plays an audible sweep representation (scaled down for human ears ~ 1.5kHz to 6.5kHz)
 * to demonstrate how the ESP32's 30 kHz - 45 kHz ultrasonic frequency modulation sounds and operates.
 */

let audioCtx: AudioContext | null = null;
let currentOsc: OscillatorNode | null = null;
let currentGain: GainNode | null = null;

export function playAudibleSweepSimulation(durationSeconds: number = 3.5, onFrequencyChange?: (hz: number) => void): () => void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Stop any existing sound
    stopAudibleSweepSimulation();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    
    // Sweep from 1200Hz to 6800Hz and back to emulate ultrasonic frequency sweep
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(6200, now + durationSeconds * 0.45);
    osc.frequency.exponentialRampToValueAtTime(2200, now + durationSeconds * 0.85);
    osc.frequency.exponentialRampToValueAtTime(1400, now + durationSeconds);

    // Filter to keep tone smooth and pleasant
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(7000, now);

    // Gain envelope with smooth attack and release
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.15);
    gain.gain.setValueAtTime(0.2, now + durationSeconds - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds);

    currentOsc = osc;
    currentGain = gain;

    // Track frequency changes for UI animation callback
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= durationSeconds) {
        clearInterval(interval);
      } else {
        const ratio = elapsed / durationSeconds;
        const simulatedUltrasonicKhz = 30 + Math.sin(ratio * Math.PI * 2) * 7.5 + 7.5;
        onFrequencyChange?.(Number(simulatedUltrasonicKhz.toFixed(1)));
      }
    }, 80);

    return () => {
      clearInterval(interval);
      stopAudibleSweepSimulation();
    };
  } catch (err) {
    console.warn('[EcoEcho Audio] Web Audio API playback not allowed or not supported:', err);
    return () => {};
  }
}

export function stopAudibleSweepSimulation(): void {
  if (currentOsc) {
    try {
      currentOsc.stop();
      currentOsc.disconnect();
    } catch {
      // Ignore if already stopped
    }
    currentOsc = null;
  }
  if (currentGain) {
    try {
      currentGain.disconnect();
    } catch {
      // Ignore
    }
    currentGain = null;
  }
}
