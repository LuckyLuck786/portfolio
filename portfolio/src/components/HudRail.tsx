import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../lib/motion";

const SECTIONS = [
  { id: "about", index: "01", label: "About" },
  { id: "skills", index: "02", label: "Skills" },
  { id: "projects", index: "03", label: "Projects" },
  { id: "achievements", index: "04", label: "Achievements" },
  { id: "contact", index: "05", label: "Contact" },
];

/**
 * Fixed instrument rail on the left edge (wide screens only): a mechanical
 * flip counter showing the current section number, dot shortcuts to each
 * section, and a vertical mono label.
 */
export default function HudRail() {
  const [current, setCurrent] = useState("00");

  useEffect(() => {
    const els = ["top", ...SECTIONS.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = SECTIONS.find((s) => s.id === entry.target.id);
          setCurrent(section ? section.index : "00");
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex">
      {/* Flip counter */}
      <div
        aria-hidden
        className="relative h-[1.3em] w-[2ch] overflow-hidden font-mono text-[12px] font-semibold text-accent"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "-110%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0 text-center"
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </div>

      <span aria-hidden className="h-8 w-px bg-line-strong" />

      {/* Dot shortcuts */}
      <nav aria-label="Section shortcuts" className="flex flex-col items-center gap-3">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={section.label}
            className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              current === section.index
                ? "scale-150 bg-brand"
                : "bg-line-strong hover:bg-dim"
            }`}
          />
        ))}
      </nav>

      <span aria-hidden className="h-8 w-px bg-line-strong" />

      <span
        aria-hidden
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim [writing-mode:vertical-rl]"
      >
        Portfolio
      </span>
    </div>
  );
}
