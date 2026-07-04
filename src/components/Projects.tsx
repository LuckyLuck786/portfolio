import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import type { Project } from "./ProjectCard";
import { EASE } from "../lib/motion";

/* ---------------------------------------------------------------------------
 * Bespoke card artwork — each project gets its own animated visual identity,
 * built from its real feature set. All loops are gated on reduced motion.
 * ------------------------------------------------------------------------- */

/** MetroFlow: a live route drawing itself across a dotted map, with stops. */
function MetroFlowArt() {
  const reduce = useReducedMotion();

  const route =
    "M30 258 C96 236 120 176 176 150 C226 126 260 128 300 96 C330 72 356 52 392 34";

  /* Stop positions as percentages of the 420×300 viewBox (HTML overlay). */
  const stops = [
    { left: "7.1%", top: "86%", pulse: false, delay: 0 },
    { left: "41.9%", top: "50%", pulse: true, delay: 0 },
    { left: "71.4%", top: "32%", pulse: false, delay: 0 },
    { left: "93.3%", top: "11.3%", pulse: true, delay: 1.1 },
  ];

  return (
    <div
      aria-hidden
      className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-line bg-paper"
    >
      {/* Map dot grid */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,#d8d5ca_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* Route: dashed "planned" ghost + amber line drawing itself in */}
      <svg
        viewBox="0 0 420 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={route}
          fill="none"
          stroke="#ddd9ce"
          strokeWidth={2.5}
          strokeDasharray="6 8"
          vectorEffect="non-scaling-stroke"
        />
        {reduce ? (
          <path
            d={route}
            fill="none"
            stroke="#f5a623"
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <motion.path
            d={route}
            fill="none"
            stroke="#f5a623"
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.4 }}
          />
        )}
      </svg>

      {/* Bus stops (HTML overlay so circles never distort) */}
      {stops.map((stop) => (
        <span
          key={stop.left}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: stop.left, top: stop.top }}
        >
          <span className="relative block h-2.5 w-2.5 rounded-full border-2 border-brand bg-card">
            {stop.pulse && !reduce && (
              <motion.span
                className="absolute -inset-1 rounded-full bg-brand/30"
                animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: stop.delay }}
              />
            )}
          </span>
        </span>
      ))}

      {/* Mono status badges */}
      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-line bg-card/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute shadow-card backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        Live · Kanakapura Rd
      </span>
      <span className="absolute bottom-4 right-4 rounded-full border border-line bg-card/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute shadow-card backdrop-blur">
        NN-TSP · Haversine
      </span>
    </div>
  );
}

/** Suraksha: a radar sweep over concentric rings with pulsing hotspots. */
function SurakshaArt() {
  const reduce = useReducedMotion();

  const hotspots = [
    { left: "30%", top: "38%", delay: 0 },
    { left: "62%", top: "58%", delay: 0.7 },
    { left: "48%", top: "26%", delay: 1.4 },
  ];

  return (
    <div
      aria-hidden
      className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#16161c]"
    >
      {/* Faint dark grid */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,#2a2a33_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* Concentric radar rings + rotating sweep */}
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2">
        {["0", "12%", "24%", "36%"].map((inset) => (
          <div key={inset} className="absolute rounded-full border border-white/10" style={{ inset }} />
        ))}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {!reduce && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg, rgba(245,166,35,0.22), transparent 75deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
      </div>

      {/* Pulsing crime hotspots */}
      {hotspots.map((spot) => (
        <span key={spot.left} className="absolute" style={{ left: spot.left, top: spot.top }}>
          <span className="relative block h-2 w-2 rounded-full bg-brand">
            {!reduce && (
              <motion.span
                className="absolute -inset-0.5 rounded-full bg-brand/40"
                animate={{ scale: [1, 4], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: spot.delay }}
              />
            )}
          </span>
        </span>
      ))}

      {/* Mono status badges */}
      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur">
        AI Triage · 5-Tier Fallback
      </span>
      <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur">
        JWT · RBAC · Rate-Limited
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "MetroFlow",
    kicker: "Live Transit & Logistics",
    summary: "Full-stack real-time bus-tracking and navigation platform for Bengaluru.",
    bullets: [
      "Live bus tracking with real-time rerouting over Socket.IO, mapping real Kanakapura Road route geometry on interactive Leaflet maps.",
      "Nearest-Neighbor TSP route optimization with Haversine distance calculations and a cost/savings analytics view.",
      "Role-based admin and user interfaces backed by a Spring Boot (Java) service layer.",
    ],
    tags: ["React 18", "TypeScript", "Spring Boot", "Socket.IO", "Leaflet.js", "Tailwind CSS"],
    // TODO: Replace with the real MetroFlow repository URL.
    github: "https://github.com/LuckyLuck786",
    art: <MetroFlowArt />,
  },
  {
    index: "02",
    title: "Suraksha",
    kicker: "Civic Safety & Crime Reporting",
    summary:
      "Full-stack public-safety platform with AI-driven triage and geospatial hotspot analytics.",
    bullets: [
      "Five-tier LLM fallback chain (Llama 3.3 70B, Qwen, Cerebras, Gemini, offline engine) for resilient complaint classification that never hard-fails.",
      "Haversine-based geospatial clustering to surface crime hotspots on an interactive Leaflet dashboard.",
      "Secured with JWT auth, role-based access control, rate limiting, and anonymous reporting.",
    ],
    tags: ["Django REST Framework", "React 18", "Leaflet.js", "Chart.js", "JWT"],
    // TODO: Replace with the real Suraksha repository URL.
    github: "https://github.com/LuckyLuck786",
    dark: true,
    flip: true,
    art: <SurakshaArt />,
  },
];

/** Tracks the lg breakpoint so card stacking only engages on desktop. */
function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

function StackItem({
  project,
  i,
  total,
  progress,
  enabled,
}: {
  project: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
  enabled: boolean;
}) {
  /* Earlier cards settle slightly smaller as the next card slides over them. */
  const targetScale = 1 - (total - 1 - i) * 0.05;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);

  return (
    <div className="lg:sticky" style={{ top: `calc(6rem + ${i * 26}px)` }}>
      <motion.div style={enabled ? { scale } : undefined} className="origin-top">
        <ProjectCard project={project} />
      </motion.div>
    </div>
  );
}

/** Apple-style deck: each card pins below the nav while the next covers it. */
function CardStack({ projects }: { projects: Project[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={listRef} className="flex flex-col gap-8">
      {projects.map((project, i) => (
        <StackItem
          key={project.title}
          project={project}
          i={i}
          total={projects.length}
          progress={scrollYProgress}
          enabled={desktop && !reduce}
        />
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      title="Projects"
      sub="Selected work — designed, built, and deployed end to end."
    >
      <CardStack projects={PROJECTS} />
    </Section>
  );
}
