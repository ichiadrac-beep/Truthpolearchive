/** No sky hum. No audio-reactive glimmer. */
export function armHum() {}
export function duckHum(_active?: boolean) {}
export function tickHumLevel() {
  return 0;
}
export function isHumMuted() {
  return true;
}
export function setHumMuted(_next: boolean) {}
export function toggleHum() {}
export function subscribeHum(_fn: () => void) {
  return () => {};
}
