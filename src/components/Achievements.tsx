import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Flag, ScrollText, Trophy } from "lucide-react";
import Section from "./Section";
import Tilt from "./Tilt";
import { scaleIn, stagger } from "../lib/motion";

type Achievement = {
  icon: LucideIcon;
  kicker: string;
  title: string;
  body: string;
};

const ITEMS: Achievement[] = [
  {
    icon: ScrollText,
    kicker: "Publication",
    title: "Research paper",
    body: "Authored a paper on the SafeCity Connect civic-safety architecture.",
  },
  {
    icon: Trophy,
    kicker: "Hackathons",
    title: "Orchestrate · HACKSPARK · HackAgentAIx",
    body: "HackerRank Orchestrate, Aurora Tech Fest Hackathon- HACKSPARK and HackAgentAIx (University of Essex).",
  },
  {
    icon: Flag,
    kicker: "CTF / Security",
    title: "Antraveda – Capture The Flag (CTF)",
    body: "Cryptography, digital forensics, and web exploitation.",
  },
];

export default function Achievements() {
  return (
    <Section id="achievements" index="04" title="Achievements">
      <motion.div variants={stagger} className="grid gap-5 md:grid-cols-3">
        {ITEMS.map((item) => (
          <motion.div key={item.kicker} variants={scaleIn} className="h-full">
            <Tilt className="tile h-full p-7 transition-shadow duration-300 hover:shadow-lift">
              <article>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-accent">
                  <item.icon size={19} strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                  {item.kicker}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{item.body}</p>
              </article>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
