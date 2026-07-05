import type { MouseEvent } from "react";

/**
 * Updates --spot-x/--spot-y on the element so a `.spot` border glow tracks
 * the pointer. Pair with the `.spot` class from index.css:
 * `<div className="spot" onMouseMove={trackSpot}>`.
 */
export function trackSpot(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
}
