import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { EASE } from "../lib/motion";
import { openResume } from "./ResumeModal";

const LINKS = [
  { index: "01", label: "About", href: "#about" },
  { index: "02", label: "Skills", href: "#skills" },
  { index: "03", label: "Projects", href: "#projects" },
  { index: "04", label: "Achievements", href: "#achievements" },
  { index: "05", label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  /* Thin amber page-progress bar along the very top edge. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scrollspy: light up the link whose section crosses the viewport middle. */
  useEffect(() => {
    const ids = ["top", ...LINKS.map((l) => l.href.slice(1))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === "top" ? "" : `#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-paper/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-brand"
      />

      <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="font-mono text-sm font-medium text-ink" aria-label="Shaik Luqman — back to top">
          shaik.luqman<span className="text-accent">_</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`group font-mono text-[13px] transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-mute"
                  }`}
                >
                  <span
                    className={`mr-1.5 transition-colors group-hover:text-accent ${
                      isActive ? "text-accent" : "text-accent/70"
                    }`}
                  >
                    {link.index}
                  </span>
                  {link.label}
                </a>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
              aria-label="Open command menu"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line-strong bg-card/70 px-3 font-mono text-[12px] text-mute transition-colors hover:border-brand hover:text-ink"
            >
              {typeof navigator !== "undefined" && /Mac/i.test(navigator.platform) ? "⌘" : "Ctrl"} K
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={openResume}
              className="btn btn-dark h-9 px-5 font-mono text-[13px]"
            >
              Résumé
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 rounded-md p-2 text-mute transition-colors hover:text-ink md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <ul className="container-page flex flex-col py-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.href ? "true" : undefined}
                    className={`flex items-center gap-3 py-3 font-mono text-sm transition-colors hover:text-ink ${
                      active === link.href ? "text-ink" : "text-mute"
                    }`}
                  >
                    <span className="text-accent/80">{link.index}</span>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openResume();
                  }}
                  className="flex w-full items-center gap-3 py-3 font-mono text-sm text-mute transition-colors hover:text-ink"
                >
                  <span className="text-accent/80">↗</span>
                  Résumé
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
