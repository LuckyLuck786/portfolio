import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

type ScrambleTextProps = {
  text: string;
  /** Gate the animation (e.g. wait for the preloader to finish). */
  start?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
};

/**
 * Terminal-style decode: characters cycle through random glyphs and resolve
 * left to right. Width is reserved with an invisible copy so nothing shifts.
 * Renders the plain text instantly under prefers-reduced-motion.
 */
export default function ScrambleText({
  text,
  start = true,
  delay = 0,
  duration = 900,
  className,
}: ScrambleTextProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setDisplay(text);
      setDone(true);
      return;
    }

    let raf = 0;
    let startTime: number | null = null;
    const timer = window.setTimeout(() => {
      const step = (t: number) => {
        if (startTime === null) startTime = t;
        const p = Math.min((t - startTime) / duration, 1);
        const resolved = Math.floor(p * text.length);
        let out = text.slice(0, resolved);
        for (let i = resolved; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (p < 1) raf = requestAnimationFrame(step);
        else setDone(true);
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [start, reduce, text, delay, duration]);

  return (
    <span className={`relative inline-block ${className ?? ""}`} aria-label={text}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden>
        {done ? text : display}
      </span>
    </span>
  );
}
