import type { PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, FileDown, Github, Linkedin, MapPin } from "lucide-react";
import Magnetic from "./Magnetic";
import { fadeRise, maskRise, stagger, staggerFast } from "../lib/motion";

const HEADLINE = "I ship production-grade systems, not prototypes.";

/* Headline words — the last two are toned down, the period carries the brand. */
const WORDS: ReactNode[] = [
  "I",
  "ship",
  "production-grade",
  "systems,",
  <span className="text-dim">not</span>,
  <span className="text-dim">
    prototypes<span className="text-brand">.</span>
  </span>,
];

/**
 * Animated hero backdrop: faint dotted grid + warm amber glows with light
 * scroll parallax. Purely decorative; parallax is disabled under reduced motion.
 */
function Backdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 800], [0, 90]);
  const glowY = useTransform(scrollY, [0, 800], [0, 160]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={reduce ? undefined : { y: gridY }}
        className="absolute inset-0 [background-image:radial-gradient(circle,#d8d5ca_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_38%,black_25%,transparent_78%)]"
      />
      <motion.div
        style={reduce ? undefined : { y: glowY }}
        className="absolute left-1/2 top-[-16rem] h-[40rem] w-[64rem] -ml-[32rem] rounded-full bg-brand/15 blur-[140px]"
      />
      <div className="absolute bottom-[-6rem] left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  /* Apple-style: hero content gently recedes as you scroll past it. */
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 480], [1, 0]);
  const rise = useTransform(scrollY, [0, 480], [0, 60]);

  /* Cursor spotlight — a warm pool of light that follows the pointer. */
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 140, damping: 26 });
  const sy = useSpring(my, { stiffness: 140, damping: 26 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(245,166,35,0.1), transparent 70%)`;

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <section
      id="top"
      onPointerMove={onPointerMove}
      className="relative flex min-h-screen items-center"
    >
      <Backdrop />
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 -z-10"
        />
      )}

      <motion.div
        style={reduce ? undefined : { opacity: fade, y: rise }}
        className="container-page pb-24 pt-28"
      >
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Eyebrow: name + location */}
          <motion.div
            variants={fadeRise}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px]"
          >
            <span className="uppercase tracking-[0.22em] text-accent">Shaik Luqman</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span className="flex items-center gap-1.5 text-mute">
              <MapPin size={13} strokeWidth={1.75} aria-hidden />
              Bengaluru, India
            </span>
          </motion.div>

          {/* Word-by-word masked headline reveal */}
          <motion.h1
            variants={staggerFast}
            aria-label={HEADLINE}
            className="mt-8 max-w-5xl text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          >
            {WORDS.map((word, i) => (
              <span
                key={i}
                aria-hidden
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom [&:not(:last-child)]:mr-[0.24em]"
              >
                <motion.span variants={maskRise} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p variants={fadeRise} className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
            Full-stack engineer building applied-AI systems, secure infrastructure, and real
            products.
          </motion.p>

          {/* CTAs + socials */}
          <motion.div
            variants={fadeRise}
            className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-5"
          >
            <Magnetic>
              <a href="#projects" className="btn btn-primary shadow-card">
                View Work
                <ArrowDown size={16} aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="/resume.pdf" target="_blank" rel="noopener" className="btn btn-outline">
                Résumé
                <FileDown size={16} aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex h-11 items-center gap-1.5 px-2 text-sm font-medium text-mute transition-colors hover:text-accent"
              >
                Get in touch
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Magnetic>

            <span aria-hidden className="hidden h-6 w-px bg-line-strong sm:block" />

            <div className="flex items-center gap-1">
              <a
                href="https://github.com/LuckyLuck786"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
                className="p-2 text-mute transition-colors hover:text-accent"
              >
                <Github size={20} strokeWidth={1.75} />
              </a>
              <a
                href="https://linkedin.com/in/luqman-shaik"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="p-2 text-mute transition-colors hover:text-accent"
              >
                <Linkedin size={20} strokeWidth={1.75} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 -ml-6"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex w-12 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-dim"
        >
          scroll
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
