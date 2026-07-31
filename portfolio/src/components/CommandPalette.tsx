import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  Copy,
  FileDown,
  FolderOpen,
  Github,
  Hash,
  Linkedin,
  Mail,
  Search,
} from "lucide-react";
import { EASE } from "../lib/motion";
import { lenisStart, lenisStop, scrollToId } from "./SmoothScroll";
import { openResume } from "./ResumeModal";

type Action = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  keywords?: string;
  /** Scroll to this home-page section (navigates home first if needed). */
  sectionId?: string;
  /** Navigate to this route. */
  to?: string;
  /** Arbitrary side effect. */
  run?: () => void;
};

const ACTIONS: Action[] = [
  { id: "about", label: "Go to About", hint: "01", icon: Hash, sectionId: "about" },
  { id: "skills", label: "Go to Skills", hint: "02", icon: Hash, sectionId: "skills" },
  { id: "projects", label: "Go to Projects", hint: "03", icon: Hash, keywords: "work", sectionId: "projects" },
  { id: "achievements", label: "Go to Achievements", hint: "04", icon: Hash, keywords: "hackathon ctf paper", sectionId: "achievements" },
  { id: "contact", label: "Go to Contact", hint: "05", icon: Hash, keywords: "email touch", sectionId: "contact" },
  {
    id: "case-metroflow",
    label: "Open MetroFlow case study",
    hint: "↗",
    icon: FolderOpen,
    keywords: "transit bus project",
    to: "/projects/metroflow",
  },
  {
    id: "case-suraksha",
    label: "Open Suraksha case study",
    hint: "↗",
    icon: FolderOpen,
    keywords: "safety crime project",
    to: "/projects/suraksha",
  },
  {
    id: "email",
    label: "Write me an email",
    hint: "Gmail",
    icon: Mail,
    keywords: "gmail compose contact",
    run: () => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=shaik.luqman28@gmail.com", "_blank", "noopener"),
  },
  {
    id: "copy-email",
    label: "Copy email address",
    hint: "Copy",
    icon: Copy,
    keywords: "clipboard gmail",
    run: () => void navigator.clipboard.writeText("shaik.luqman28@gmail.com"),
  },
  {
    id: "github",
    label: "Open GitHub",
    hint: "↗",
    icon: Github,
    keywords: "code repos",
    run: () => window.open("https://github.com/LuckyLuck786", "_blank", "noopener"),
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    hint: "↗",
    icon: Linkedin,
    run: () => window.open("https://linkedin.com/in/luqman-shaik", "_blank", "noopener"),
  },
  {
    id: "resume",
    label: "View résumé",
    hint: "PDF",
    icon: FileDown,
    keywords: "cv resume download",
    run: openResume,
  },
  { id: "top", label: "Back to top", hint: "↑", icon: ArrowUp, sectionId: "top" },
];

/**
 * Linear-style ⌘K command palette: jump to sections (from any page), open
 * case studies, copy the email, view the résumé. Also opens via the nav's
 * "⌘K" chip, which dispatches a "cmdk:open" window event.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.filter((a) =>
      `${a.label} ${a.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      lenisStop();
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      lenisStart();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setActiveIdx(0), [query]);

  function runAction(action: Action) {
    setOpen(false);
    if (action.sectionId) {
      /* On the home page, glide there; from a case study, navigate home
         with a hash — Home scrolls once the wipe lifts. */
      if (document.getElementById(action.sectionId)) scrollToId(action.sectionId);
      else navigate(`/#${action.sectionId}`);
    } else if (action.to) {
      navigate(action.to);
    } else {
      action.run?.();
    }
  }

  function onInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = results[activeIdx];
      if (action) runAction(action);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Command menu">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="relative mx-auto mt-[16vh] w-[min(560px,92vw)] overflow-hidden rounded-2xl border border-line bg-card shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="shrink-0 text-dim" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                className="h-14 w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-dim"
              />
              <kbd className="shrink-0 rounded-md border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-dim">
                esc
              </kbd>
            </div>

            <ul className="max-h-[320px] overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-sm text-dim">
                  No matching commands
                </li>
              )}
              {results.map((action, i) => (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={() => runAction(action)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                      i === activeIdx ? "bg-paper text-ink" : "text-mute"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <action.icon
                        size={15}
                        aria-hidden
                        className={i === activeIdx ? "text-accent" : "text-dim"}
                      />
                      {action.label}
                    </span>
                    <span className="font-mono text-[11px] text-dim">{action.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
