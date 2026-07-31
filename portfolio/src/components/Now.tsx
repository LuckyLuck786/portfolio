import { motion } from "motion/react";
import { fadeRise, VIEWPORT } from "../lib/motion";

/**
 * Slim "Now" strip — a live-feeling status line.
 * TODO: Personalize these items with whatever you're building/learning right now.
 */
export default function Now() {
  return (
    <section aria-label="What I'm doing now" className="border-y border-line bg-card/50">
      <motion.div
        variants={fadeRise}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="container-page flex flex-wrap items-center gap-x-5 gap-y-2 py-6 font-mono text-[13px]"
      >
        <span className="uppercase tracking-[0.25em] text-accent">Now</span>
        <span aria-hidden className="h-px w-6 bg-line-strong" />
        <p className="text-mute">
          Shipping full-stack, applied-AI projects{" "}
          <span aria-hidden className="text-line-strong">
            ·
          </span>{" "}
          sharpening RL &amp; LLM orchestration{" "}
          <span aria-hidden className="text-line-strong">
            ·
          </span>{" "}
          CS coursework in Bengaluru
          <span aria-hidden className="ml-1 animate-pulse text-brand">
            ▍
          </span>
        </p>
      </motion.div>
    </section>
  );
}
