import { FileDown, Github, Linkedin, Mail } from "lucide-react";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/LuckyLuck786", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/luqman-shaik", Icon: Linkedin },
  { label: "Email", href: "mailto:shaik.luqman28@gmail.com", Icon: Mail },
  { label: "Résumé", href: "/resume.pdf", Icon: FileDown },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="font-mono text-xs text-dim">
          © {new Date().getFullYear()} Shaik Luqman — Bengaluru, India
        </p>

        <div className="flex items-center gap-1">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}
              className="p-2 text-dim transition-colors hover:text-accent"
            >
              <Icon size={17} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
