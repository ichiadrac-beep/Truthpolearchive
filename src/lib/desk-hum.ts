import { unlockAudio } from "@/lib/scan-audio";

const HUM_KEY = "truthpole-hum";
const TIME_BINS = 256;

let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let started = false;
let muted = readMuted();
let ducking = false;
let samples: Uint8Array<ArrayBuffer> | null = null;
let level = 0;
const listeners = new Set<() => void>();

function readMuted() {
  try {
    return localStorage.getItem(HUM_KEY) === "0";
  } catch {
    return false;
  }
}

function writeMuted(next: boolean) {
  try {
    localStorage.setItem(HUM_KEY, next ? "0" : "1");
  } catch {
    /* private mode */
  }
}

function notify() {
  for (const fn of listeners) fn();
}

function pinkBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    b0 = 0.998 * b0 + 0.022 * white;
    b1 = 0.987 * b1 + 0.03 * white;
    b2 = 0.95 * b2 + 0.048 * white;
    data[i] = (b0 + b1 + b2) * 0.42;
  }
  return buffer;
}

function ramp(node: GainNode, value: number, seconds: number) {
  const now = node.context.currentTime;
  const current = Math.max(0.0001, node.gain.value);
  node.gain.cancelScheduledValues(now);
  node.gain.setValueAtTime(current, now);
  node.gain.exponentialRampToValueAtTime(Math.max(0.0001, value), now + seconds);
}

function masterTarget() {
  if (muted) return 0.0001;
  if (ducking) return 0.18;
  return 0.9;
}

function ensureBed() {
  if (started) return;
  const ctx = unlockAudio();
  if (!ctx) return;

  const m = ctx.createGain();
  m.gain.value = 0.0001;
  const a = ctx.createAnalyser();
  a.fftSize = TIME_BINS;
  a.smoothingTimeConstant = 0.86;

  const bed = ctx.createGain();
  bed.gain.value = 0.07;

  const low = ctx.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 240;
  low.Q.value = 0.7;

  const tone = (freq: number, type: OscillatorType, gain: number, detune = 0) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = gain;
    osc.connect(g);
    g.connect(bed);
    osc.start();
  };

  tone(55, "sine", 0.55);
  tone(82.4, "sine", 0.22, -7);
  tone(110, "triangle", 0.045, 4);
  tone(27.5, "sine", 0.18);

  const noise = ctx.createBufferSource();
  noise.buffer = pinkBuffer(ctx, 4);
  noise.loop = true;
  const np = ctx.createBiquadFilter();
  np.type = "lowpass";
  np.frequency.value = 130;
  const ng = ctx.createGain();
  ng.gain.value = 0.12;
  noise.connect(np);
  np.connect(ng);
  ng.connect(bed);
  noise.start();

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain);
  lfoGain.connect(bed.gain);
  lfo.start();

  bed.connect(low);
  low.connect(a);
  a.connect(m);
  m.connect(ctx.destination);

  analyser = a;
  master = m;
  samples = new Uint8Array(new ArrayBuffer(a.fftSize));
  started = true;
  ramp(m, masterTarget(), 1.4);
}

export function armHum() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    ensureBed();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function isHumMuted() {
  return muted;
}

export function setHumMuted(next: boolean) {
  muted = next;
  writeMuted(next);
  if (!next) ensureBed();
  if (master) ramp(master, masterTarget(), 0.32);
  notify();
}

export function toggleHum() {
  setHumMuted(!muted);
}

export function duckHum(on: boolean) {
  ducking = on;
  if (master) ramp(master, masterTarget(), 0.22);
}

export function subscribeHum(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Smoothed 0–1 bed energy. Call once per animation frame. */
export function tickHumLevel() {
  if (!analyser || !samples || muted) {
    level += (0 - level) * 0.06;
    return level;
  }
  analyser.getByteTimeDomainData(samples);
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const v = ((samples[i] ?? 128) - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / samples.length);
  const target = Math.min(1, rms * 5.4);
  const k = target > level ? 0.07 : 0.045;
  level += (target - level) * k;
  return level;
}
