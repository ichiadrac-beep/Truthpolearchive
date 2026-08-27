/** Intentionally inert. Restore file 3 working has no sky hum. */
export function armHum() {}
export function duckHum(_active?: boolean) {}
export function tickHumLevel() {
  return 0.18;
}
export function isHumMuted() {
  return true;
}
export function setHumMuted(_next: boolean) {}
export function toggleHum() {}
export function subscribeHum(_fn: () => void) {
  return () => {};
}
