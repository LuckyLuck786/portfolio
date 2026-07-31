import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

const NAME = "shaik.luqman_";
const TYPE_MS = 70;

/**
 * Intro overture: the name types out in mono on a dark curtain, which then
 * lifts to reveal the hero. Skipped entirely under prefers-reduced-motion.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";

    const typer = window.setInterval(
      () => setTyped((t) => Math.min(t + 1, NAME.length)),
      TYPE_MS,
    );
    const exitAt = NAME.length * TYPE_MS + 500;
    const exitTimer = window.setTimeout(() => setExiting(true), exitAt);
    const doneTimer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      onDone();
    }, exitAt + 800);

    return () => {
      window.clearInterval(typer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = "";
    };
    // onDone is stable for the lifetime of the overlay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-noir"
    >
      <p className="font-mono text-2xl text-paper md:text-4xl">
        {NAME.slice(0, typed)}
        <span className="animate-pulse text-brand">▍</span>
      </p>
      <p className="absolute bottom-8 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
        Portfolio — Bengaluru
      </p>
    </motion.div>
  );
}
