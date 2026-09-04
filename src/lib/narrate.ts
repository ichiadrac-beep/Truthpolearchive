/** Desk narrator — cinematic storyteller. Browser synth is fallback only. */

function pickStorytellerVoice(voices: SpeechSynthesisVoice[]) {
  const score = (voice: SpeechSynthesisVoice) => {
    const name = `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
    let n = 0;
    if (/en-us|en_us/.test(name)) n += 4;
    else if (/^en/.test(voice.lang.toLowerCase())) n += 2;
    if (
      /google us english|microsoft (andrew|guy|davis|ryan|steffan|james)|aaron|alex|daniel|david|fred|tom|nathan|gordon/.test(
        name,
      )
    ) {
      n += 8;
    }
    if (/premium|neural|natural|online/.test(name)) n += 3;
    if (/male|man\b/.test(name)) n += 3;
    if (/female|woman|zira|samantha|siri|karen|moira|veena|susan|linda|salli|jenny|aria/.test(name)) n -= 12;
    return n;
  };
  if (!voices.length) return null;
  return [...voices].sort((a, b) => score(b) - score(a))[0] ?? null;
}

function waitForVoices(synth: SpeechSynthesis) {
  const have = synth.getVoices();
  if (have.length) return Promise.resolve(have);
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const done = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 600);
  });
}

export async function fetchNarration(text: string, signal?: AbortSignal): Promise<Blob | null> {
  try {
    const res = await fetch("/api/read-aloud", {
      method: "POST",
      headers: { Accept: "audio/mpeg", "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal,
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.includes("audio")) return null;
    const blob = await res.blob();
    if (blob.size < 800) return null;
    return blob;
  } catch {
    return null;
  }
}

export async function speakBrowser(text: string, onEnd: () => void): Promise<() => void> {
  const synth = window.speechSynthesis;
  if (!synth) {
    onEnd();
    return () => {};
  }
  const voices = await waitForVoices(synth);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  utterance.pitch = 0.82;
  utterance.voice = pickStorytellerVoice(voices);
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  synth.cancel();
  synth.speak(utterance);
  return () => synth.cancel();
}
