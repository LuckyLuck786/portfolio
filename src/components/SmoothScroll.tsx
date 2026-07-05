import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import Lenis from "lenis";

/* Module-level handle so overlays (quick look, command palette) can pause
   scrolling, and so programmatic navigation shares the same easing. */
let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function lenisStop() {
  lenis?.stop();
}

export function lenisStart() {
  lenis?.start();
}

/** Scrolls to an element by id — through Lenis when active, native otherwise. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "top" ? 0 : -80;
  if (lenis) lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Lenis inertia scrolling: the weighted glide-and-settle feel. Also takes
 * over anchor-link navigation so in-page jumps share the same easing.
 * Disabled entirely under prefers-reduced-motion (native scroll remains).
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    /* Native CSS smooth scrolling would fight Lenis' easing. */
    document.documentElement.style.scrollBehavior = "auto";
    /* Higher lerp = tighter tracking of the wheel — smooth without lag. */
    lenis = new Lenis({ lerp: 0.16 });

    let raf = requestAnimationFrame(function loop(time) {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    });

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
      document.documentElement.style.scrollBehavior = "";
    };
  }, [reduce]);

  return null;
}
