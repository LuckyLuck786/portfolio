import { ArrowUp, FileDown, Github, Linkedin, Mail } from "lucide-react";
import Signature from "./Signature";
import { openResume } from "./ResumeModal";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/LuckyLuck786", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/luqman-shaik", Icon: Linkedin },
  {
    label: "Email",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=shaik.luqman28@gmail.com",
    Icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      {/* Hand-signed ending */}
      <div className="container-page flex justify-center pt-16">
        <Signature />
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="font-mono text-xs text-dim">
          © {new Date().getFullYear()} Shaik Luqman — Bengaluru, India
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener"
                className="p-2 text-dim transition-colors hover:text-accent"
              >
                <Icon size={17} strokeWidth={1.75} />
              </a>
            ))}
            <button
              type="button"
              onClick={openResume}
              aria-label="Résumé"
              className="p-2 text-dim transition-colors hover:text-accent"
            >
              <FileDown size={17} strokeWidth={1.75} />
            </button>
          </div>

          <span aria-hidden className="h-4 w-px bg-line-strong" />

          <a
            href="#top"
            className="group flex items-center gap-1.5 font-mono text-xs text-dim transition-colors hover:text-accent"
          >
            Back to top
            <ArrowUp
              size={13}
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
