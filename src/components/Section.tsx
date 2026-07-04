import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { fadeRise, stagger, VIEWPORT } from "../lib/motion";

type SectionProps = {
  id: string;
  /** Mono section number, e.g. "01". */
  index: string;
  title: string;
  /** Optional one-line subtitle under the title. */
  sub?: string;
  children: ReactNode;
};

/**
 * Shared section shell: numbered mono index, large title, optional subtitle,
 * a giant outlined "ghost" index drifting on parallax behind the content,
 * and a staggered scroll-triggered reveal that child motion elements inherit.
 */
export default function Section({ id, index, title, sub, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section ref={ref} id={id} className="relative scroll-mt-24">
      {/* Oversized outlined section number, parallaxing behind the content */}
      <motion.span
        aria-hidden
        style={reduce ? undefined : { y: ghostY }}
        className="pointer-events-none absolute right-4 top-8 hidden select-none font-mono text-[9rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_#e3dfd3] sm:block md:right-8 lg:text-[13rem]"
      >
        {index}
      </motion.span>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="container-page relative py-20 md:py-28"
      >
        <motion.div variants={fadeRise}>
          <p aria-hidden className="font-mono text-sm font-medium text-accent">
            {index}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">{title}</h2>
          {sub && <p className="mt-4 max-w-xl text-lg text-mute">{sub}</p>}
        </motion.div>

        <div className="mt-12 md:mt-16">{children}</div>
      </motion.div>
    </section>
  );
}
