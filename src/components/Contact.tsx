import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, FileDown, Github, Linkedin, Mail } from "lucide-react";
import Section from "./Section";
import Magnetic from "./Magnetic";
import { scaleIn } from "../lib/motion";

const EMAIL = "shaik.luqman28@gmail.com";
/* Gmail compose opens reliably in any browser — mailto: silently no-ops when
   the visitor has no desktop mail client configured. */
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable (permissions / non-secure context) — no-op. */
    }
  }

  return (
    <Section id="contact" index="05" title="Contact">
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-[2rem] bg-noir px-6 py-16 text-center text-paper md:px-16 md:py-24"
      >
        {/* Backdrop: faint grid + warm glow rising from the bottom */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 [background-image:radial-gradient(circle,#26262e_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]" />
          <div className="absolute bottom-[-14rem] left-1/2 h-[28rem] w-[44rem] -ml-[22rem] rounded-full bg-brand/15 blur-[120px]" />
        </div>

        <div className="relative">
          <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-brand">
            Get in touch
          </p>
          <h3 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.025em] md:text-5xl">
            Let’s build something real<span className="text-brand">.</span>
          </h3>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-[#a6a6af]">
            Have a role, a project, or a hard problem worth solving? My inbox is open.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href={GMAIL_COMPOSE}
                target="_blank"
                rel="noopener"
                className="btn btn-primary h-12 px-7"
              >
                <Mail size={16} aria-hidden />
                {EMAIL}
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email address copied" : "Copy email address"}
                className={`btn h-12 w-12 border px-0 transition-colors ${
                  copied
                    ? "border-brand text-brand"
                    : "border-white/20 text-paper hover:border-brand hover:text-brand"
                }`}
              >
                {copied ? <Check size={17} aria-hidden /> : <Copy size={16} aria-hidden />}
              </button>
            </Magnetic>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href="https://github.com/LuckyLuck786"
                target="_blank"
                rel="noopener"
                className="btn border border-white/20 text-paper hover:border-brand hover:text-brand"
              >
                <Github size={16} aria-hidden />
                GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://linkedin.com/in/luqman-shaik"
                target="_blank"
                rel="noopener"
                className="btn border border-white/20 text-paper hover:border-brand hover:text-brand"
              >
                <Linkedin size={16} aria-hidden />
                LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener"
                className="btn border border-white/20 text-paper hover:border-brand hover:text-brand"
              >
                <FileDown size={16} aria-hidden />
                Résumé
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
