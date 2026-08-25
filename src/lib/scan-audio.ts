let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
  return c;
}

function noiseBuffer(c: AudioContext, seconds: number, color: "white" | "pink" = "pink") {
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === "white") {
      data[i] = white;
    } else {
      b0 = 0.997 * b0 + 0.029 * white;
      b1 = 0.985 * b1 + 0.032 * white;
      b2 = 0.95 * b2 + 0.05 * white;
      data[i] = (b0 + b1 + b2) * 0.55;
    }
  }
  return buffer;
}

function envGain(c: AudioContext, t0: number, attack: number, hold: number, release: number, peak: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
  g.gain.setValueAtTime(Math.max(0.0002, peak), t0 + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
  return g;
}

/** Premium biometric scan — analog-style soundboard, no samples, no TTS. */
export function playScanSound(durationSec: number): () => void {
  const c = unlockAudio();
  if (!c) return () => {};
  const now = c.currentTime;
  const dur = Math.max(0.6, durationSec);
  const master = c.createGain();
  master.gain.value = 0.32;
  master.connect(c.destination);

  const whoosh = c.createBufferSource();
  whoosh.buffer = noiseBuffer(c, dur + 0.15);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 180;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 3.4;
  bp.frequency.setValueAtTime(420, now);
  bp.frequency.exponentialRampToValueAtTime(2800, now + dur * 0.72);
  bp.frequency.exponentialRampToValueAtTime(900, now + dur);
  const wg = envGain(c, now, 0.05, dur - 0.28, 0.22, 0.38);
  whoosh.connect(hp);
  hp.connect(bp);
  bp.connect(wg);
  wg.connect(master);
  whoosh.start(now);
  whoosh.stop(now + dur + 0.02);

  const drone = c.createOscillator();
  drone.type = "sine";
  drone.frequency.setValueAtTime(46, now);
  drone.frequency.linearRampToValueAtTime(78, now + dur);
  const dg = envGain(c, now, 0.1, dur - 0.32, 0.2, 0.2);
  drone.connect(dg);
  dg.connect(master);
  drone.start(now);
  drone.stop(now + dur);

  const fifth = c.createOscillator();
  fifth.type = "triangle";
  fifth.frequency.setValueAtTime(92, now);
  fifth.frequency.linearRampToValueAtTime(156, now + dur);
  const fg = envGain(c, now, 0.14, dur - 0.4, 0.22, 0.07);
  fifth.connect(fg);
  fg.connect(master);
  fifth.start(now);
  fifth.stop(now + dur);

  const pings = 22;
  for (let i = 0; i < pings; i++) {
    const t = now + 0.05 + (i / pings) * (dur - 0.18);
    const osc = c.createOscillator();
    osc.type = "sine";
    const base = 1240 + (i % 5) * 185 + i * 18;
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * 1.65, t + 0.07);
    const g = envGain(c, t, 0.004, 0.012, 0.07, 0.042 + (i / pings) * 0.05);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 4200;
    osc.connect(lp);
    lp.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  for (let i = 0; i < 6; i++) {
    const t = now + dur * (0.12 + i * 0.14);
    const click = c.createOscillator();
    click.type = "square";
    click.frequency.value = 2100 - i * 90;
    const cg = envGain(c, t, 0.002, 0.006, 0.03, 0.028);
    click.connect(cg);
    cg.connect(master);
    click.start(t);
    click.stop(t + 0.04);
  }

  const lockT = now + dur - 0.16;
  for (const freq of [523.25, 659.25, 783.99]) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = envGain(c, lockT, 0.01, 0.05, 0.12, 0.09);
    osc.connect(g);
    g.connect(master);
    osc.start(lockT);
    osc.stop(lockT + 0.2);
  }

  return () => {
    try {
      master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.05);
    } catch {
      /* already closed */
    }
  };
}

export function playLockClick() {
  const c = unlockAudio();
  if (!c) return;
  const now = c.currentTime;
  const master = c.createGain();
  master.gain.value = 0.28;
  master.connect(c.destination);
  for (const [freq, peak, len] of [
    [180, 0.22, 0.18],
    [920, 0.16, 0.09],
    [1840, 0.08, 0.05],
  ] as const) {
    const osc = c.createOscillator();
    osc.type = freq < 400 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + len);
    const g = envGain(c, now, 0.004, 0.02, len, peak);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + len + 0.02);
  }
}

const WELCOME_KEY = "tp-welcome-once";

function alreadyWelcomed() {
  try {
    return sessionStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
}

function markWelcomed() {
  try {
    sessionStorage.setItem(WELCOME_KEY, "1");
  } catch {
    /* private mode */
  }
}

/**
 * One-shot alien “Welcome” — low Jarvis cadence, metallic formants, no TTS / no AI voice.
 * Plays at most once per browser session.
 */
export function playWelcomeOnce(): Promise<void> {
  if (alreadyWelcomed()) return Promise.resolve();
  markWelcomed();
  const c = unlockAudio();
  if (!c) return Promise.resolve();
  const now = c.currentTime;
  const master = c.createGain();
  master.gain.value = 0.42;
  master.connect(c.destination);

  // Glottal source ~ Jarvis baritone, slight downward cadence
  const source = c.createOscillator();
  source.type = "sawtooth";
  source.frequency.setValueAtTime(98, now);
  source.frequency.linearRampToValueAtTime(86, now + 1.15);
  source.frequency.linearRampToValueAtTime(78, now + 1.55);

  const buzz = c.createBiquadFilter();
  buzz.type = "lowpass";
  buzz.Q.value = 0.7;
  buzz.frequency.setValueAtTime(720, now);
  buzz.frequency.linearRampToValueAtTime(980, now + 0.35);
  buzz.frequency.linearRampToValueAtTime(640, now + 1.55);

  // Two formants walking through WEL-COME
  const f1 = c.createBiquadFilter();
  f1.type = "bandpass";
  f1.Q.value = 9;
  f1.frequency.setValueAtTime(320, now); // W/U
  f1.frequency.linearRampToValueAtTime(530, now + 0.28); // EH
  f1.frequency.linearRampToValueAtTime(400, now + 0.55); // L
  f1.frequency.linearRampToValueAtTime(700, now + 0.78); // K burst
  f1.frequency.linearRampToValueAtTime(380, now + 1.05); // UH
  f1.frequency.linearRampToValueAtTime(280, now + 1.5); // M

  const f2 = c.createBiquadFilter();
  f2.type = "bandpass";
  f2.Q.value = 8;
  f2.frequency.setValueAtTime(780, now);
  f2.frequency.linearRampToValueAtTime(1840, now + 0.28);
  f2.frequency.linearRampToValueAtTime(1200, now + 0.55);
  f2.frequency.linearRampToValueAtTime(2100, now + 0.78);
  f2.frequency.linearRampToValueAtTime(860, now + 1.05);
  f2.frequency.linearRampToValueAtTime(1100, now + 1.5);

  const alien = c.createOscillator();
  alien.type = "sine";
  alien.frequency.value = 38;
  const ring = c.createGain();
  ring.gain.value = 0.18;

  const dry = c.createGain();
  dry.gain.setValueAtTime(0.0001, now);
  dry.gain.exponentialRampToValueAtTime(0.9, now + 0.08);
  dry.gain.setValueAtTime(0.85, now + 1.15);
  dry.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);

  source.connect(buzz);
  buzz.connect(f1);
  buzz.connect(f2);
  f1.connect(dry);
  f2.connect(dry);
  alien.connect(ring);
  ring.connect(dry.gain);
  dry.connect(master);

  // Air / room tail
  const air = c.createBufferSource();
  air.buffer = noiseBuffer(c, 1.8);
  const airF = c.createBiquadFilter();
  airF.type = "bandpass";
  airF.frequency.value = 1400;
  airF.Q.value = 0.8;
  const ag = envGain(c, now, 0.05, 1.2, 0.4, 0.06);
  air.connect(airF);
  airF.connect(ag);
  ag.connect(master);

  source.start(now);
  alien.start(now);
  air.start(now);
  source.stop(now + 1.7);
  alien.stop(now + 1.7);
  air.stop(now + 1.8);

  return new Promise((resolve) => {
    window.setTimeout(resolve, 1750);
  });
}

/** @deprecated kept so older scan hooks compile; routes to the one-shot welcome. */
export function playAccessGrantedVoice(): Promise<void> {
  return playWelcomeOnce();
}

export function preloadScanAudio() {
  unlockAudio();
}
