import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project } from "./ProjectCard";
import { lenisStart, lenisStop } from "./SmoothScroll";

/**
 * Full-screen case-file overlay. Shares a layoutId with the project card,
 * so the card visually morphs into this panel and back. Esc / backdrop /
 * close button all dismiss it; page scroll is paused while open.
 */
export default function ProjectQuickLook({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    lenisStop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenisStart();
    };
  }, [project, onClose]);

  const dark = project?.dark ?? false;

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-[105] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — case details`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-ink/30 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.article
            layoutId={`project-${project.title}`}
            className={`relative mx-auto my-[5vh] w-[min(1000px,94vw)] overflow-hidden rounded-[2rem] border shadow-lift ${
              dark ? "border-white/10 bg-noir text-paper" : "border-line bg-card"
            }`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close quick look"
              className={`absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                dark
                  ? "border-white/20 bg-noir/60 text-paper hover:border-brand hover:text-brand"
                  : "border-line-strong bg-card/80 text-mute hover:border-brand hover:text-ink"
              }`}
            >
              <X size={17} aria-hidden />
            </button>

            {/* Artwork, enlarged */}
            <div className="p-4 pb-0 md:p-6 md:pb-0">
              <div className="h-[260px] md:h-[320px]">{project.art}</div>
            </div>

            <div className="p-8 md:p-12">
              <p className="font-mono text-[13px]">
                <span className="text-brand">{project.index}</span>
                <span
                  className={`ml-3 uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-dim"}`}
                >
                  {project.kicker}
                </span>
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
                {project.title}
              </h3>
              <p
                className={`mt-4 max-w-2xl text-lg leading-relaxed ${
                  dark ? "text-[#a6a6af]" : "text-mute"
                }`}
              >
                {project.summary}
              </p>

              <div className="mt-10 grid gap-10 md:grid-cols-5">
                <div className="md:col-span-3">
                  <h4
                    className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
                      dark ? "text-white/50" : "text-dim"
                    }`}
                  >
                    Highlights
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {project.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={`flex gap-3 text-[15px] leading-relaxed ${
                          dark ? "text-[#b3b3bc]" : "text-mute"
                        }`}
                      >
                        <span
                          aria-hidden
                          className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-brand"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h4
                    className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
                      dark ? "text-white/50" : "text-dim"
                    }`}
                  >
                    Stack
                  </h4>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className={`rounded-full border px-3 py-1 font-mono text-xs ${
                          dark
                            ? "border-white/10 bg-white/5 text-[#a6a6af]"
                            : "border-line bg-paper text-mute"
                        }`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener"
                      className={`btn h-10 px-5 text-[13px] ${
                        dark
                          ? "border border-white/20 text-paper hover:border-brand hover:text-brand"
                          : "btn-outline"
                      }`}
                    >
                      <Github size={15} aria-hidden />
                      GitHub
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener"
                        className={`btn h-10 px-5 text-[13px] ${
                          dark
                            ? "border border-white/20 text-paper hover:border-brand hover:text-brand"
                            : "btn-outline"
                        }`}
                      >
                        <ExternalLink size={15} aria-hidden />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      )}
    </AnimatePresence>
  );
}
