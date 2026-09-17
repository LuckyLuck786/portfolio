/** True when the primary input is touch (phones, most tablets). False at build-time prerender. */
export function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}
