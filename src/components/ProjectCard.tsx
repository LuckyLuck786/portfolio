import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Github, Maximize2 } from "lucide-react";
import { scaleIn, VIEWPORT } from "../lib/motion";
import { trackSpot } from "../lib/spotlight";

export type Project = {
  /** Mono index shown on the card, e.g. "01". */
  index: string;
  title: string;
  /** URL slug for the dedicated case-study page (/projects/<slug>). */
  slug: string;
  /** Short mono descriptor next to the index. */
  kicker: string;
  summary: string;
  bullets: string[];
  tags: string[];
  github: string;
  /** Optional live-demo URL — renders a second button when present. */
  live?: string;
  /** Dark "product card" treatment (near-black, amber accents). */
  dark?: boolean;
  /** Put the artwork on the left on desktop. */
  flip?: boolean;
  /** Bespoke decorative visual rendered beside the copy. */
  art: ReactNode;
  /** Pinned-story chapters shown on the case-study page. */
  chapters?: { kicker: string; title: string; body: string }[];
  /** Architecture flow node labels for the case-study diagram. */
  flow?: string[];
};

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  /** Opens the quick-look overlay (whole card is clickable; links excluded). */
  onOpen?: () => void;
}) {
  const dark = project.dark ?? false;

  const s = dark
    ? {
        card: "border-white/10 bg-noir text-paper shadow-lift",
        kicker: "text-white/50",
        summary: "text-[#a6a6af]",
        bullet: "text-[#b3b3bc]",
        tag: "border-white/10 bg-white/5 text-[#a6a6af]",
        button: "border border-white/20 text-paper hover:border-brand hover:text-brand",
      }
    : {
        card: "border-line bg-card shadow-card",
        kicker: "text-dim",
        summary: "text-mute",
        bullet: "text-mute",
        tag: "border-line bg-paper text-mute",
        button: "btn-outline",
      };

  return (
    <motion.article
      layoutId={`project-${project.title}`}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      data-cursor="view"
      onMouseMove={trackSpot}
      onClick={(e) => {
        /* Whole card opens the quick look, except real links/buttons. */
        if ((e.target as Element).closest("a, button")) return;
        onOpen?.();
      }}
      className={`spot relative cursor-pointer overflow-hidden rounded-[2rem] border ${s.card}`}
    >
      {/* Warm glow bleeding into the dark card */}
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-brand/15 blur-[100px]"
        />
      )}

      <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className={project.flip ? "lg:order-2" : undefined}>
          <p className="font-mono text-[13px]">
            <span className="text-brand">{project.index}</span>
            <span className={`ml-3 uppercase tracking-[0.18em] ${s.kicker}`}>{project.kicker}</span>
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            {project.title}
          </h3>

          <p className={`mt-4 text-lg leading-relaxed ${s.summary}`}>{project.summary}</p>

          <ul className="mt-6 space-y-3">
            {project.bullets.map((bullet) => (
              <li key={bullet} className={`flex gap-3 text-[15px] leading-relaxed ${s.bullet}`}>
                <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-brand" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies used">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className={`rounded-full border px-3 py-1 font-mono text-xs ${s.tag}`}
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/projects/${project.slug}`}
              className={`btn h-10 px-5 text-[13px] ${s.button}`}
            >
              Case study
              <ArrowUpRight size={15} aria-hidden />
            </Link>
            <a
              href={project.github}
              target="_blank"
              rel="noopener"
              className={`btn h-10 px-5 text-[13px] ${s.button}`}
            >
              <Github size={15} aria-hidden />
              GitHub
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener"
                className={`btn h-10 px-5 text-[13px] ${s.button}`}
              >
                <ExternalLink size={15} aria-hidden />
                Live
              </a>
            )}
            {onOpen && (
              <button
                type="button"
                onClick={onOpen}
                className={`btn h-10 px-5 text-[13px] ${s.button}`}
              >
                <Maximize2 size={15} aria-hidden />
                Quick look
              </button>
            )}
          </div>
        </div>

        <div className={`h-full ${project.flip ? "lg:order-1" : ""}`}>{project.art}</div>
      </div>
    </motion.article>
  );
}
