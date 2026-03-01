import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getEsSlugs } from './articles/registry';

const STORAGE_KEY = 'ambient-music';
const VOL_DEFAULT = 0.3;
const VOL_CHAT_OPEN = 0.1;
const FADE_MS = 600;
const BAR_COUNT = 4;
const FFT_SIZE = 256;

/*
 * Audio analysis of ambient-loop.mp3 (Uncharted Worlds):
 *
 * Band energy (RMS dB, stable body 30-90s):
 *   Sub-bass  60-200Hz:  avg -20.8 dB  (range ~4 dB at 100ms)
 *   Bass     200-500Hz:  avg -21.3 dB  (range ~1 dB — nearly flat)
 *   Low-mid  500-1200Hz: avg -25.7 dB  (range ~2 dB — slow oscillations)
 *   Mid     1200-3000Hz: avg -35.2 dB  (range ~2 dB — very quiet)
 *   High    3000-16kHz:  avg -43.5 dB  (negligible)
 *
 * Key finding: This is a pad/drone track. No beats, no transients.
 * Dynamic range per-band at 100ms is 1-4 dB — imperceptible as bar movement.
 *
 * Strategy: Map these micro-variations into visible bar motion by:
 * 1. Per-band normalization using measured floor/ceiling
 * 2. Aggressive power curve (^0.3) to expand tiny differences
 * 3. Frame-to-frame delta detection for "swell" sensing
 * 4. Staggered per-bar phase offsets so bars never move in unison
 * 5. Smooth interpolation for organic, breathing movement
 */

// Per-band calibration from analysis (dB values in the stable body)
// [floor, ceiling] — real measured range at 100ms resolution
const BAND_CALIBRATION = [
  { lo: 60, hi: 200, floor: -24, ceil: -18, label: 'sub-bass' },
  { lo: 200, hi: 500, floor: -20, ceil: -17, label: 'bass' },
  { lo: 500, hi: 1200, floor: -23, ceil: -20, label: 'low-mid' },
  { lo: 1200, hi: 3000, floor: -32, ceil: -28, label: 'mid' },
];

// Map frequency in Hz to FFT bin index (at 48kHz sample rate, FFT_SIZE=256)
function hzToBin(hz: number): number {
  return Math.round(hz / (48000 / FFT_SIZE));
}

function fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
  const start = audio.volume;
  const diff = target - start;
  const steps = 20;
  const stepMs = ms / steps;
  let step = 0;
  const interval = setInterval(() => {
    step++;
    audio.volume = Math.max(0, Math.min(1, start + diff * (step / steps)));
    if (step >= steps) clearInterval(interval);
  }, stepMs);
}

/** Equalizer bars: micro-variation amplifier for ambient music */
function EqualizerBars({ analyser }: { analyser: AnalyserNode | null }) {
  const barsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const smoothRef = useRef<number[]>(Array(BAR_COUNT).fill(0.3));
  const prevRef = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const swellRef = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const frameRef = useRef(0);
  // Auto-calibration: track min/max per band in runtime
  const minRef = useRef<number[]>(Array(BAR_COUNT).fill(255));
  const maxRef = useRef<number[]>(Array(BAR_COUNT).fill(0));

  useEffect(() => {
    if (!analyser) return;

    analyser.fftSize = FFT_SIZE;
    const bufLen = analyser.frequencyBinCount;
    dataRef.current = new Uint8Array(bufLen);

    const bands = BAND_CALIBRATION.map(b => ({
      from: hzToBin(b.lo),
      to: hzToBin(b.hi),
    }));

    const tick = () => {
      frameRef.current++;
      analyser.getByteFrequencyData(dataRef.current!);

      for (let i = 0; i < BAR_COUNT; i++) {
        const band = bands[i];

        // Average FFT bins for this band
        let sum = 0;
        let count = 0;
        for (let j = band.from; j <= band.to && j < bufLen; j++) {
          sum += dataRef.current![j];
          count++;
        }
        if (count === 0) continue;
        const rawAvg = sum / count; // 0-255

        // Auto-calibrate with enforced minimum spread
        // Fast snap to new extremes, slow decay back
        if (rawAvg < minRef.current[i]) minRef.current[i] = rawAvg;
        else minRef.current[i] += (rawAvg - minRef.current[i]) * 0.0003;
        if (rawAvg > maxRef.current[i]) maxRef.current[i] = rawAvg;
        else maxRef.current[i] -= (maxRef.current[i] - rawAvg) * 0.0003;

        // Enforce minimum spread so bars don't converge to a flat line
        // The ambient track has ~4dB real variation → ~15-20 byte units
        const spread = maxRef.current[i] - minRef.current[i];
        const minSpread = 25;
        let effMin = minRef.current[i];
        let effMax = maxRef.current[i];
        if (spread < minSpread) {
          const mid = (effMin + effMax) / 2;
          effMin = mid - minSpread / 2;
          effMax = mid + minSpread / 2;
        }

        // Normalize to 0-1
        const normalized = (rawAvg - effMin) / (effMax - effMin);
        const clamped01 = Math.max(0, Math.min(1, normalized));

        // Swell detection: rising energy → momentary boost
        const delta = clamped01 - prevRef.current[i];
        prevRef.current[i] = clamped01;
        if (delta > 0.01) {
          swellRef.current[i] = Math.min(0.3, swellRef.current[i] + delta * 2);
        } else {
          swellRef.current[i] *= 0.94;
        }

        // Phase offset per bar so they breathe independently
        const phase = Math.sin(frameRef.current * 0.015 + i * 1.8) * 0.06;

        // Map to bar height: 15% floor → 100% ceiling, full visual range
        const target = 0.15 + clamped01 * 0.7 + swellRef.current[i] + phase;
        const clamped = Math.max(0.12, Math.min(1, target));

        // Lerp for smooth movement
        smoothRef.current[i] += (clamped - smoothRef.current[i]) * 0.15;

        const bar = barsRef.current[i];
        if (bar) bar.style.height = `${smoothRef.current[i] * 100}%`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <div className="flex items-end gap-[3px] h-[18px]">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) barsRef.current[i] = el; }}
          className="w-[4px] rounded-full bg-primary"
          style={{ height: '30%' }}
        />
      ))}
    </div>
  );
}

/** Muted state: dim bars breathing gently */
function MutedBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 18 }}>
      {[8, 13, 10, 11].map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 4,
            backgroundColor: 'hsl(var(--foreground) / 0.45)',
            transformOrigin: 'bottom',
            animation: `muted-breathe 2.5s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** N7 insignia — from official Wikimedia SVG, scaled to 20px inline */
function N7Badge() {
  return (
    <svg width="32" height="12" viewBox="0 0 652 252" aria-hidden="true">
      {/* N and 7 letterforms */}
      <path d="M37 128.5V223h24.5H86v-69.5C86 86.516 86.067 84 87.852 84c1.019 0 3.353 1.012 5.188 2.25 1.834 1.237 25.188 28.105 51.898 59.706C189 198.088 194.204 203.891 201.099 208.575c4.18 2.84 11.155 6.532 15.5 8.206C230.901 222.289 236.891 223 268.958 223H298V128.5 34h-26.5H245v66.5V167h-4.25c-4.97-.022-10.85-2.484-15.695-6.569-1.895-1.598-8.725-9.083-15.178-16.634C177.423 105.797 134.773 56.713 128.833 50.5c-3.681-3.85-9.087-8.443-12.013-10.208C107.288 34.545 103.083 34 68.29 34H37v94.5M313 56v22h79.083c43.496 0 78.934.367 78.75.816-.183.449-27.333 26.848-60.333 58.664s-66.363 64.258-74.139 71.868L322.221 223h42.299 42.299l70.591-72.12L548 78.761V56.38 34H430.5 313v22" fill="currentColor" fillRule="evenodd" />
      {/* Red triangle of the 7 */}
      <path d="M581.988 56.25L581.976 78.5 520.238 140.537c-33.956 34.12-66.23 66.633-71.719 72.25L438.538 223h92.231H623V128.5 34h-20.5H582l-.012 22.25" fill="#e42c2c" fillRule="evenodd" />
    </svg>
  );
}

/** Tooltip styled as a comm transmission */
function CommTooltip({ playing, lang, dismissed }: { playing: boolean; lang: 'es' | 'en'; dismissed?: boolean }) {
  const text = playing
    ? 'Uncharted Worlds'
    : dismissed
      ? (lang === 'es' ? 'Sin respuesta. Normandy fuera.' : 'Logging off. Normandy out.')
      : (lang === 'es' ? 'Comandante, tenemos una señal' : 'Commander, we have a signal');

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute left-full ml-3 bottom-1 whitespace-nowrap pointer-events-none"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 shadow-lg" style={{ backgroundColor: 'hsl(var(--background) / 0.97)', backdropFilter: 'blur(12px)' }}>
        <N7Badge />
        <span className="text-xs text-muted-foreground font-mono tracking-wide">
          {text}
          {!dismissed && !playing && (
            <span className="inline-block w-[2px] h-[0.85em] ml-1 align-middle relative -top-[1px]" style={{ backgroundColor: 'hsl(var(--foreground) / 0.7)', animation: 'terminal-blink 1s step-end infinite' }} />
          )}
        </span>
      </div>
    </motion.div>
  );
}

const SEEN_KEY = 'ambient-seen';
const AUTO_SHOW_DELAY = 10_000;

export default function MusicToggle() {
  const [playing, setPlaying] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'on'; } catch { return false; }
  });
  const [hovered, setHovered] = useState(false);
  const [autoShow, setAutoShow] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const interactedRef = useRef(false);
  const chatOpenRef = useRef(false);

  // Detect lang reactively from route
  const { pathname } = useLocation();
  const esSlugs = getEsSlugs();
  const lang = esSlugs.has(pathname) ? 'es' : 'en';

  useEffect(() => {
    const audio = new Audio('/audio/ambient-loop.mp3');
    audio.loop = true;
    audio.volume = VOL_DEFAULT;
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current!);
    const node = ctx.createAnalyser();
    node.fftSize = FFT_SIZE;
    node.smoothingTimeConstant = 0.5;
    node.minDecibels = -90;
    node.maxDecibels = -10;
    source.connect(node);
    node.connect(ctx.destination);
    ctxRef.current = ctx;
    setAnalyser(node);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      ensureAudioContext();
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
    try { localStorage.setItem(STORAGE_KEY, playing ? 'on' : 'off'); } catch {}
  }, [playing, ensureAudioContext]);

  // Chat ducking
  useEffect(() => {
    const handleChatDuck = (e: Event) => {
      const open = (e as CustomEvent).detail?.open;
      chatOpenRef.current = open;
      const audio = audioRef.current;
      if (!audio || !playing) return;
      fadeTo(audio, open ? VOL_CHAT_OPEN : VOL_DEFAULT, FADE_MS);
    };
    window.addEventListener('chatToggle', handleChatDuck);
    return () => window.removeEventListener('chatToggle', handleChatDuck);
  }, [playing]);

  // Auto-show "incoming transmission" after 10s (one-time)
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch {}
    if (seen || playing) return;

    const showTimer = setTimeout(() => {
      if (interactedRef.current || chatOpenRef.current) return;
      setAutoShow(true);
      setIncoming(true);
    }, AUTO_SHOW_DELAY);

    // After 6s: swap to farewell message
    const farewellTimer = setTimeout(() => {
      if (interactedRef.current) return;
      setDismissed(true);
    }, AUTO_SHOW_DELAY + 6000);

    // After 9s: dismiss everything
    const dismissTimer = setTimeout(() => {
      setAutoShow(false);
      setIncoming(false);
      setDismissed(false);
      try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
    }, AUTO_SHOW_DELAY + 9000);

    return () => { clearTimeout(showTimer); clearTimeout(farewellTimer); clearTimeout(dismissTimer); };
  }, [playing]);

  const toggle = useCallback(() => {
    interactedRef.current = true;
    setAutoShow(false);
    setIncoming(false);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
    setPlaying(p => !p);
  }, []);

  const showTooltip = hovered || autoShow;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={toggle}
      onMouseEnter={() => { setHovered(true); interactedRef.current = true; }}
      onMouseLeave={() => setHovered(false)}
      className={`fixed z-50 w-12 h-12 rounded-full flex items-center justify-center bg-card shadow-md hover:shadow-lg transition-shadow ${incoming ? 'border-2 border-primary' : 'border border-border/50'}`}
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.5rem)',
        left: 'max(1.5rem, env(safe-area-inset-left, 0px) + 0.5rem)',
      }}
      aria-label={playing ? 'Mute ambient music' : 'Play ambient music'}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.div
            key="on"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <EqualizerBars analyser={analyser} />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MutedBars />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTooltip && <CommTooltip playing={playing} lang={lang} dismissed={dismissed} />}
      </AnimatePresence>
      {/* Pulse ring — same style as chat avatar */}
      {incoming && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}
