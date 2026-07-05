import { useRef } from "react";
import type { MotionValue } from "motion/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Section from "./Section";
import { scaleIn } from "../lib/motion";
import { trackSpot } from "../lib/spotlight";

const FACTS = [
  { label: "Location", value: "Bengaluru, India" },
  { label: "Focus", value: "Applied AI · Secure systems · Full-stack" },
  { label: "Currently", value: "CS student & full-stack developer" },
];

/* The statement, split into segments so key phrases stay emphasized. */
const SEGMENTS: { text: string; strong?: boolean }[] = [
  { text: "I’m a Computer Science student and full-stack developer who ships" },
  { text: "production-grade systems", strong: true },
  { text: "across React, Node.js, Django, and MySQL. My work spans" },
  { text: "applied AI", strong: true },
  { text: "— RAG pipelines, multi-model LLM orchestration, and reinforcement learning — with a strong grounding in" },
  { text: "secure engineering", strong: true },
  { text: "(JWT/RBAC) and self-hosted Linux infrastructure. I’m driven by" },
  { text: "end-to-end ownership", strong: true },
  { text: ": designing, building, and deploying real projects." },
];

const WORDS = SEGMENTS.flatMap((segment) =>
  segment.text
    .split(" ")
    .filter(Boolean)
    .map((word) => ({ word, strong: segment.strong ?? false })),
);

function Word({
  word,
  strong,
  i,
  progress,
  reduce,
}: {
  word: string;
  strong: boolean;
  i: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const start = i / WORDS.length;
  const end = (i + 1) / WORDS.length;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <motion.span
      style={reduce ? undefined : { opacity }}
      className={strong ? "font-semibold text-ink" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

/** The paragraph lights up word by word as it scrolls through the viewport. */
function RevealParagraph() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <p
      ref={ref}
      className="text-xl font-medium leading-relaxed tracking-[-0.01em] text-mute md:text-2xl md:leading-[1.6]"
    >
      {WORDS.map((w, i) => (
        <Word key={i} word={w.word} strong={w.strong} i={i} progress={scrollYProgress} reduce={reduce} />
      ))}
    </p>
  );
}

export default function About() {
  return (
    <Section id="about" index="01" title="About">
      <motion.div
        variants={scaleIn}
        onMouseMove={trackSpot}
        className="spot tile grid gap-12 p-8 md:grid-cols-12 md:p-14"
      >
        <div className="md:col-span-8">
          <RevealParagraph />
        </div>

        <aside className="space-y-6 self-center border-line pl-0 md:col-span-4 md:border-l md:pl-8">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                {fact.label}
              </p>
              <p className="mt-1.5 text-sm font-medium text-ink">{fact.value}</p>
            </div>
          ))}
        </aside>
      </motion.div>
    </Section>
  );
}
