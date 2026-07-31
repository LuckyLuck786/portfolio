import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { PROJECTS } from "../components/Projects";
import type { Project } from "../components/ProjectCard";
import Footer from "../components/Footer";
import { openResume } from "../components/ResumeModal";
import { EASE, fadeRise, fadeRiseSm, scaleIn, stagger, VIEWPORT } from "../lib/motion";

/* ---------------------------------------------------------------------------
 * Stage-driven story artwork — the pinned visual builds up as the reader
 * scrolls through the chapters (stage 0 → 2), Apple product-page style.
 * ------------------------------------------------------------------------- */

const ROUTE = "M30 258 C96 236 120 176 176 150 C226 126 260 128 300 96 C330 72 356 52 392 34";
const OPTIMIZED = "M30 258 C130 200 240 150 392 34";

const STOPS = [
  { left: "7.1%", top: "82%" },
  { left: "41.9%", top: "47.5%" },
  { left: "71.4%", top: "30.5%" },
  { left: "93.3%", top: "10.8%" },
];

function StoryBadge({
  show,
  className,
  children,
  dark = false,
}: {
  show: boolean;
  className: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <motion.span
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`absolute flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur ${
        dark
          ? "border-white/10 bg-white/5 text-white/60"
          : "border-line bg-card/85 text-mute shadow-card"
      } ${className}`}
    >
      {children}
    </motion.span>
  );
}

/** MetroFlow: route draws (ch.1), stops go live (ch.2), optimizer overlays (ch.3). */
function MetroStoryArt({ stage }: { stage: number }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle,#d8d5ca_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <svg viewBox="0 0 420 315" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d={ROUTE}
          fill="none"
          stroke="#ddd9ce"
          strokeWidth={2.5}
          strokeDasharray="6 8"
          vectorEffect="non-scaling-stroke"
        />
        {/* Chapter 1: the live route draws itself */}
        <motion.path
          d={ROUTE}
          fill="none"
          stroke="#f5a623"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        />
        {/* Chapter 3: the optimizer's alternative */}
        <motion.path
          d={OPTIMIZED}
          fill="none"
          stroke="#f5a623"
          strokeWidth={2}
          strokeDasharray="3 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          animate={{ opacity: stage >= 2 ? 0.9 : 0, pathLength: stage >= 2 ? 1 : 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>

      {/* Chapter 2: the stops come online */}
      {STOPS.map((stop, i) => (
        <motion.span
          key={stop.left}
          animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.4 }}
          transition={{ duration: 0.4, ease: EASE, delay: stage >= 1 ? i * 0.08 : 0 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: stop.left, top: stop.top }}
        >
          <span className="relative block h-2.5 w-2.5 rounded-full border-2 border-brand bg-card">
            {i === 1 && stage >= 1 && !reduce && (
              <motion.span
                className="absolute -inset-1 rounded-full bg-brand/30"
                animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </span>
        </motion.span>
      ))}

      <StoryBadge show={stage >= 1} className="left-4 top-4">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        Live · Kanakapura Rd
      </StoryBadge>
      <StoryBadge show={stage >= 2} className="bottom-4 right-4">
        NN-TSP · Haversine
      </StoryBadge>
      <StoryBadge show={stage >= 2} className="bottom-4 left-4">
        Cost / savings view
      </StoryBadge>
    </div>
  );
}

const LLM_CHAIN = ["Llama 3.3 70B", "Qwen", "Cerebras", "Gemini", "Offline"];
const SECURITY = ["JWT auth", "RBAC", "Rate limiting", "Anonymous reports"];
const HOTSPOTS = [
  { left: "32%", top: "38%", delay: 0 },
  { left: "58%", top: "62%", delay: 0.7 },
  { left: "48%", top: "30%", delay: 1.4 },
];

/** Suraksha: fallback chain (ch.1), hotspot radar (ch.2), security row (ch.3). */
function SurakshaStoryArt({ stage }: { stage: number }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#16161c] p-6 shadow-card">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle,#2a2a33_1px,transparent_1px)] [background-size:22px_22px]"
      />

      {/* Chapter 1: five-tier fallback chain */}
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          Complaint → 5-tier triage
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
          {LLM_CHAIN.map((model, i) => (
            <span key={model} className="flex items-center gap-2">
              <motion.span
                initial={reduce ? undefined : { opacity: 0, y: 8 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4, ease: EASE }}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                  i === 0
                    ? "border-brand/60 bg-brand/10 text-brand"
                    : "border-white/10 bg-white/5 text-[#c9c9d1]"
                }`}
              >
                {model}
              </motion.span>
              {i < LLM_CHAIN.length - 1 && (
                <span aria-hidden className="text-white/30">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Chapter 2: hotspot radar */}
      <motion.div
        animate={{ opacity: stage >= 1 ? 1 : 0.12 }}
        transition={{ duration: 0.5 }}
        className="relative my-4 flex-1"
      >
        <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2">
          {["0", "22%", "44%"].map((inset) => (
            <div key={inset} className="absolute rounded-full border border-white/10" style={{ inset }} />
          ))}
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
        </div>
        {HOTSPOTS.map((spot) => (
          <span key={spot.left} className="absolute" style={{ left: spot.left, top: spot.top }}>
            <span className="relative block h-1.5 w-1.5 rounded-full bg-brand">
              {stage >= 1 && !reduce && (
                <motion.span
                  className="absolute -inset-0.5 rounded-full bg-brand/40"
                  animate={{ scale: [1, 4], opacity: [0.6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: spot.delay }}
                />
              )}
            </span>
          </span>
        ))}
        <p className="absolute bottom-0 right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          Haversine clustering
        </p>
      </motion.div>

      {/* Chapter 3: security posture */}
      <motion.div
        animate={{ opacity: stage >= 2 ? 1 : 0.12 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          Security posture
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SECURITY.map((item) => (
            <span
              key={item}
              className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 font-mono text-[11px] text-brand"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Pinned storytelling scaffold
 * ------------------------------------------------------------------------- */

type StoryArt = (props: { stage: number }) => React.ReactNode;

function Chapter({
  chapter,
  i,
  onActive,
}: {
  chapter: { kicker: string; title: string; body: string };
  i: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <div ref={ref} className="flex min-h-[75vh] flex-col justify-center py-10">
      <p className="font-mono text-[13px]">
        <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
        <span className="ml-3 uppercase tracking-[0.18em] text-dim">{chapter.kicker}</span>
      </p>
      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
        {chapter.title}
      </h3>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">{chapter.body}</p>
    </div>
  );
}

function PinnedStory({ project, Art }: { project: Project; Art: StoryArt }) {
  const [stage, setStage] = useState(0);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
      {/* Mobile: static, fully-built artwork above the chapters */}
      <div className="mb-10 lg:hidden">
        <Art stage={2} />
      </div>

      {/* Desktop: artwork pins and builds up chapter by chapter */}
      <div className="hidden lg:block">
        <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center">
          <div className="w-full">
            <Art stage={stage} />
          </div>
        </div>
      </div>

      <div>
        {project.chapters?.map((chapter, i) => (
          <Chapter key={chapter.title} chapter={chapter} i={i} onActive={setStage} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Page chrome + sections
 * ------------------------------------------------------------------------- */

function CaseNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-mono text-sm font-medium text-ink" aria-label="Shaik Luqman — home">
          shaik.luqman<span className="text-accent">_</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/#projects"
            className="flex items-center gap-1.5 font-mono text-[13px] text-mute transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} aria-hidden />
            All projects
          </Link>
          <button
            type="button"
            onClick={openResume}
            className="btn btn-dark h-9 px-5 font-mono text-[13px]"
          >
            Résumé
          </button>
        </div>
      </div>
    </header>
  );
}

function FlowDiagram({ nodes }: { nodes: string[] }) {
  return (
    <motion.ol
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="mt-10 flex flex-col items-start gap-3 md:flex-row md:items-center"
    >
      {nodes.map((node, i) => (
        <motion.li key={node} variants={fadeRiseSm} className="flex items-center gap-3">
          <span className="rounded-xl border border-line bg-card px-4 py-3 font-mono text-[13px] text-mute shadow-card">
            {node}
          </span>
          {i < nodes.length - 1 && (
            <ArrowRight
              size={16}
              aria-hidden
              className="ml-1 shrink-0 rotate-90 text-brand md:rotate-0"
            />
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  const next = PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const Art: StoryArt = project.slug === "metroflow" ? MetroStoryArt : SurakshaStoryArt;

  return (
    <div id="top">
      <CaseNav />

      <main className="pt-28 md:pt-36">
        {/* Title block */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="container-page">
          <motion.p variants={fadeRise} className="font-mono text-[13px]">
            <span className="text-brand">{project.index}</span>
            <span className="ml-3 uppercase tracking-[0.18em] text-dim">{project.kicker}</span>
          </motion.p>
          <motion.h1
            variants={fadeRise}
            className="mt-4 text-5xl font-semibold tracking-[-0.03em] md:text-7xl"
          >
            {project.title}
          </motion.h1>
          <motion.p
            variants={fadeRise}
            className="mt-6 max-w-2xl text-xl leading-relaxed text-mute"
          >
            {project.summary}
          </motion.p>
          <motion.div variants={fadeRise} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={project.github} target="_blank" rel="noopener" className="btn btn-primary">
              <Github size={16} aria-hidden />
              View on GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Overview artwork, full width */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="container-page mt-14"
        >
          <div className="h-[320px] md:h-[420px]">{project.art}</div>
        </motion.div>

        {/* Pinned chapter storytelling */}
        <section className="container-page mt-20 md:mt-24" aria-label="Project story">
          <PinnedStory project={project} Art={Art} />
        </section>

        {/* Architecture */}
        {/* TODO: Drop real screenshots or architecture diagrams into this section. */}
        <section className="container-page mt-16 md:mt-20" aria-label="Architecture">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.p variants={fadeRise} className="font-mono text-sm font-medium text-accent">
              Architecture
            </motion.p>
            <motion.h2
              variants={fadeRise}
              className="mt-3 text-3xl font-semibold tracking-[-0.02em] md:text-4xl"
            >
              How it fits together
            </motion.h2>
          </motion.div>
          {project.flow && <FlowDiagram nodes={project.flow} />}
        </section>

        {/* Stack */}
        <section className="container-page mt-16 md:mt-20" aria-label="Stack">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.p variants={fadeRise} className="font-mono text-sm font-medium text-accent">
              Stack
            </motion.p>
            <motion.ul variants={fadeRise} className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </section>

        {/* Next project */}
        <section className="container-page mb-8 mt-20 md:mt-28">
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <Link
              to={`/projects/${next.slug}`}
              className="group tile flex items-center justify-between rounded-[2rem] p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:p-14"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                  Next project
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent md:text-5xl">
                  {next.title}
                </p>
              </div>
              <ArrowRight
                size={36}
                aria-hidden
                className="shrink-0 text-dim transition-all duration-300 group-hover:translate-x-2 group-hover:text-brand"
              />
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
