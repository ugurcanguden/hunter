export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatScore(value: number) {
  return value.toLocaleString('en-US');
}
