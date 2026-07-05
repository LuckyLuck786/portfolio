import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/**
 * Hand-signed ending: the name "writes" itself left to right in a script
 * face (clip-path reveal), then an amber flourish underlines it. Static
 * under prefers-reduced-motion.
 */
export default function Signature() {
  const reduce = useReducedMotion();

  return (
    <div className="relative inline-block select-none" role="img" aria-label="Shaik Luqman — signature">
      <motion.p
        aria-hidden
        initial={reduce ? undefined : { clipPath: "inset(-20% 100% -20% 0)" }}
        whileInView={reduce ? undefined : { clipPath: "inset(-20% 0% -20% 0)" }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        className="-rotate-2 font-[Caveat,cursive] text-5xl font-semibold text-ink md:text-6xl"
      >
        Shaik Luqman
      </motion.p>

      <svg viewBox="0 0 300 24" fill="none" aria-hidden className="absolute -bottom-2 left-0 w-full">
        <motion.path
          d="M6 14 C70 20 150 5 294 12"
          stroke="#f5a623"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.7 }}
        />
      </svg>
    </div>
  );
}
