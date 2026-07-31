import type { Variants } from "motion/react";

/** Signature easing — fast start, long confident settle (easeOutExpo-ish). */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Parent orchestrator: staggers direct motion children on reveal. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.02 },
  },
};

/** Tight orchestrator for word-by-word headline reveals. */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

/** Standard reveal for headings, paragraphs, and small cards. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

/** Tighter reveal for small elements (chips, list rows). */
export const fadeRiseSm: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

/** Masked rise — pair with an overflow-hidden wrapper for headline words. */
export const maskRise: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

/** Big-card entrance: rises and settles from ~97% scale, Apple-style. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Shared whileInView config: reveal once, soon after entering the viewport. */
export const VIEWPORT = { once: true, margin: "0px 0px -40px 0px" } as const;
