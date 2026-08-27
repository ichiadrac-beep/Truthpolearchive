import { unlockAudio } from "@/lib/scan-audio";

let gate: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let armed = false;
let lastBuzz = 0;

function ensure() {
  if (armed) return gate;
  const ctx = unlockAudio();
  if (!ctx) return null;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.45), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (i % 3 === 0 ? 1 : 0.35);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2100;
  bp.Q.value = 1.1;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.value = 0.0001;
  src.connect(hp);
  hp.connect(bp);
  bp.connect(g);
  g.connect(ctx.destination);
  src.start();
  gate = g;
  filter = bp;
  armed = true;
  return g;
}

function ramp(node: GainNode, value: number, seconds: number) {
  const now = node.context.currentTime;
  const current = Math.max(0.0001, node.gain.value);
  node.gain.cancelScheduledValues(now);
  node.gain.setValueAtTime(current, now);
  node.gain.exponentialRampToValueAtTime(Math.max(0.0001, value), now + seconds);
}

function buzz(ms: number | number[]) {
  try {
    const now = performance.now();
    if (typeof ms === "number" && now - lastBuzz < 52) return;
    lastBuzz = now;
    navigator.vibrate?.(ms);
  } catch {
    /* no haptic */
  }
}

export function startScratchFx() {
  const g = ensure();
  if (g) ramp(g, 0.038, 0.04);
  buzz(11);
}

export function moveScratchFx(speed: number) {
  const g = ensure();
  if (g) {
    const peak = 0.022 + Math.min(0.04, speed * 0.0016);
    ramp(g, peak, 0.05);
  }
  if (filter) {
    const now = filter.context.currentTime;
    const freq = 1600 + Math.min(2400, speed * 28);
    filter.frequency.setTargetAtTime(freq, now, 0.04);
  }
  buzz(7);
}

export function stopScratchFx() {
  if (gate) ramp(gate, 0.0001, 0.12);
}

export function revealScratchFx() {
  if (gate) ramp(gate, 0.0001, 0.08);
  buzz([10, 32, 16]);
}

export function sampleWear(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let gone = 0;
  let n = 0;
  for (let i = 3; i < data.length; i += 16) {
    const a = data[i] ?? 0;
    gone += a < 28 ? 1 : a < 140 ? 0.5 : 0;
    n += 1;
  }
  return n ? Math.min(1, gone / n) : 0;
}
