import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, ExternalLink, X } from "lucide-react";
import { EASE } from "../lib/motion";
import { lenisStart, lenisStop } from "./SmoothScroll";

/** Any résumé button anywhere calls this to open the inline viewer. */
export function openResume() {
  window.dispatchEvent(new Event("resume:open"));
}

/**
 * Inline résumé viewer: the PDF opens in a styled modal instead of a bare
 * browser tab, with download / new-tab escape hatches. Listens for the
 * "resume:open" window event.
 */
export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("resume:open", onOpen);
    return () => window.removeEventListener("resume:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    lenisStop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenisStart();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[108] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/30 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative flex h-[88vh] w-[min(880px,96vw)] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-lift"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <p className="font-mono text-[13px] text-mute">
                résumé<span className="text-accent">.pdf</span>
              </p>
              <div className="flex items-center gap-2">
                <a href="/resume.pdf" download className="btn btn-primary h-9 px-4 text-[13px]">
                  <Download size={14} aria-hidden />
                  Download
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline hidden h-9 px-4 text-[13px] sm:inline-flex"
                >
                  <ExternalLink size={14} aria-hidden />
                  New tab
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close résumé"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-mute transition-colors hover:border-brand hover:text-ink"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
            </div>

            <iframe src="/resume.pdf" title="Résumé PDF" className="w-full flex-1 bg-paper" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
