import { useRef } from "react";
import type { MotionValue } from "motion/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Section from "./Section";
import { scaleIn } from "../lib/motion";
import { trackSpot } from "../lib/spotlight";

const FACTS = [
  { label: "Location", value: "Bengaluru, India" },
  { label: "Focus", value: "Applied AI · Secure systems · Full-stack" },
];

const EDUCATION = [
  {
    degree: "Computer Science & Engineering",
    school: "DSATM, Bengaluru",
    schoolFull: "Dayananda Sagar Academy of Technology and Management",
    mode: "On campus · Primary degree",
  },
  {
    degree: "BS in Data Science & Applications",
    school: "IIT Madras",
    schoolFull: "Indian Institute of Technology Madras",
    mode: "Online · Second degree",
  },
];

/* The statement, split into segments so key phrases stay emphasized. */
const SEGMENTS: { text: string; strong?: boolean }[] = [
  { text: "I’m a hands-on developer who loves turning ideas into" },
  { text: "real, working products.", strong: true },
  { text: "I care about" },
  { text: "owning a problem end to end", strong: true },
  { text: "— understanding it, building the solution, and shipping something people actually use," },
  { text: "not just another prototype.", strong: true },
  { text: "I’m earning two degrees in parallel:" },
  { text: "Computer Science & Engineering at DSATM", strong: true },
  { text: "on campus, and the" },
  { text: "BS in Data Science & Applications from IIT Madras", strong: true },
  { text: "online. Curious and self-directed by nature, I’m" },
  { text: "always learning", strong: true },
  { text: "whatever the next project demands." },
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

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
              Education
            </p>
            <ul className="mt-2.5 space-y-4">
              {EDUCATION.map((item) => (
                <li key={item.school} className="flex gap-3">
                  <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <div>
                    <p className="text-sm font-medium text-ink">{item.degree}</p>
                    <p className="mt-0.5 text-sm text-mute">
                      <abbr title={item.schoolFull} className="no-underline">
                        {item.school}
                      </abbr>
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-dim">{item.mode}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </motion.div>
    </Section>
  );
}
