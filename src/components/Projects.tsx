import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Section from "./Section";
import ProjectQuickLook from "./ProjectQuickLook";
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

/** Tracks the lg breakpoint so the horizontal deck only engages on desktop. */
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

/** Horizontal gap between slides — must match the track's gap-8. */
const DECK_GAP = 32;

/**
 * Apple-style horizontal gallery: the deck pins below the nav and cards
 * travel sideways as the visitor scrolls vertically, with an amber progress
 * hairline underneath. Falls back to a plain vertical stack on mobile and
 * under reduced motion.
 */
function HorizontalDeck({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (project: Project) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const [slideWidth, setSlideWidth] = useState(0);

  const horizontal = desktop && !reduce;
  /* Every slide is exactly one holder wide, so the total sideways travel
     is a clean (slide + gap) per extra card. */
  const shift = slideWidth > 0 ? (slideWidth + DECK_GAP) * (projects.length - 1) : 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => setSlideWidth(holderRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [horizontal]);

  if (!horizontal) {
    return (
      <div ref={containerRef} className="flex flex-col gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} onOpen={() => onOpen(project)} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[240vh]">
      <div className="sticky top-24">
        <div ref={holderRef} className="overflow-hidden">
          <motion.div style={{ x }} className="flex w-max gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="shrink-0"
                style={slideWidth ? { width: slideWidth } : undefined}
              >
                <ProjectCard project={project} onOpen={() => onOpen(project)} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Deck progress hairline */}
        <div className="relative mt-6 h-px overflow-hidden bg-line">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-0 origin-left bg-brand"
          />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section
      id="projects"
      index="03"
      title="Projects"
      sub="Selected work — designed, built, and deployed end to end. Click a card for a closer look."
    >
      <HorizontalDeck projects={PROJECTS} onOpen={setSelected} />
      <ProjectQuickLook project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
