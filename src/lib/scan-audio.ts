let ctx: AudioContext | null = null;
let voicesLoaded = false;

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
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.getVoices();
    if (!voicesLoaded) {
      speechSynthesis.addEventListener("voiceschanged", () => {
        voicesLoaded = true;
      });
    }
  }
  return c;
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.93 + white * 0.07;
    data[i] = last;
  }
  return buffer;
}

export function playScanSound(durationSec: number): () => void {
  const c = unlockAudio();
  if (!c) return () => {};
  const now = c.currentTime;
  const master = c.createGain();
  master.gain.value = 0.28;
  master.connect(c.destination);

  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, durationSec + 0.1);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 6;
  bp.frequency.setValueAtTime(620, now);
  bp.frequency.exponentialRampToValueAtTime(2400, now + durationSec * 0.7);
  bp.frequency.exponentialRampToValueAtTime(1100, now + durationSec);
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, now);
  ng.gain.exponentialRampToValueAtTime(0.55, now + 0.06);
  ng.gain.setValueAtTime(0.42, now + durationSec - 0.18);
  ng.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  noise.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  noise.start(now);
  noise.stop(now + durationSec);

  const drone = c.createOscillator();
  drone.type = "sine";
  drone.frequency.setValueAtTime(48, now);
  drone.frequency.linearRampToValueAtTime(86, now + durationSec);
  const dg = c.createGain();
  dg.gain.setValueAtTime(0.0001, now);
  dg.gain.exponentialRampToValueAtTime(0.22, now + 0.12);
  dg.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  drone.connect(dg);
  dg.connect(master);
  drone.start(now);
  drone.stop(now + durationSec);

  const ticks = 32;
  for (let i = 0; i < ticks; i++) {
    const t = now + (i / ticks) * (durationSec - 0.08);
    const osc = c.createOscillator();
    osc.type = "square";
    osc.frequency.value = 1560 + i * 38;
    const g = c.createGain();
    const peak = 0.045 + (i / ticks) * 0.05;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  return () => {
    try {
      master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.04);
    } catch {
      /* already closed */
    }
  };
}

export function playLockClick() {
  const c = unlockAudio();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
  const g = c.createGain();
  g.gain.setValueAtTime(0.24, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

function pickMaleVoice() {
  const voices = speechSynthesis.getVoices();
  const scored = voices
    .filter((v) => /^en/i.test(v.lang))
    .map((v) => {
      const n = v.name.toLowerCase();
      let score = 0;
      if (/male|daniel|david|alex|fred|gordon|arthur|george|james|thomas|rishi|mark|roy|steve|microsoft david|google uk english male/.test(n)) score += 4;
      if (/google/.test(n)) score += 2;
      if (/en-gb|en_gb|en-us|en_us/.test(v.lang)) score += 1;
      if (/female|samantha|karen|moira|tessa|zira|susan|siri|fiona|karen|victoria/.test(n)) score -= 5;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? voices.find((v) => /^en/i.test(v.lang)) ?? voices[0];
}

export function playAccessGrantedVoice(): Promise<void> {
  if (typeof speechSynthesis === "undefined") return Promise.resolve();
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance("Access granted.");
  utter.rate = 0.72;
  utter.pitch = 0.48;
  utter.volume = 1;
  utter.lang = "en-US";
  const voice = pickMaleVoice();
  if (voice) utter.voice = voice;
  return new Promise((resolve) => {
    const done = () => resolve();
    utter.onend = done;
    utter.onerror = done;
    speechSynthesis.speak(utter);
    window.setTimeout(done, 2600);
  });
}


export function preloadScanAudio() {
  if (typeof window === "undefined") return;
  try {
    const a = new Audio("/audio/scan.mp3");
    a.preload = "auto";
    a.load();
  } catch {
    /* ignore */
  }
  try {
    const b = new Audio("/audio/access-granted.mp3");
    b.preload = "auto";
    b.load();
  } catch {
    /* ignore */
  }
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.getVoices();
  }
}
