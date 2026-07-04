import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Blocks, BrainCircuit, Code2, Database, Server, ShieldCheck } from "lucide-react";
import Section from "./Section";
import { scaleIn, stagger } from "../lib/motion";

type Variant = "light" | "dark" | "brand";

type SkillGroup = {
  label: string;
  icon: LucideIcon;
  items: string[];
  variant: Variant;
  /** Bento span classes for this tile. */
  span: string;
};

/* Bento layout: one dark hero tile, one amber tile, four white tiles. */
const GROUPS: SkillGroup[] = [
  {
    label: "AI / ML",
    icon: BrainCircuit,
    items: ["RAG", "LLM Orchestration (Llama 3.3, Gemini)", "Reinforcement Learning"],
    variant: "dark",
    span: "sm:col-span-2 lg:col-span-4",
  },
  {
    label: "Tools & Security",
    icon: ShieldCheck,
    items: ["Git & GitHub", "Linux", "Docker", "JWT / RBAC"],
    variant: "brand",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    label: "Languages",
    icon: Code2,
    items: ["Python", "Java", "C", "C++", "SQL"],
    variant: "light",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    label: "Frontend",
    icon: Blocks,
    items: ["React 18", "TypeScript", "Tailwind CSS"],
    variant: "light",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    label: "Databases",
    icon: Database,
    items: ["MySQL", "Triggers", "Stored Procedures", "Schema Design"],
    variant: "light",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    label: "Backend",
    icon: Server,
    items: ["Node.js / Express", "Django REST Framework", "Spring Boot", "REST APIs"],
    variant: "light",
    span: "sm:col-span-2 lg:col-span-6",
  },
];

const TILE: Record<Variant, string> = {
  light: "tile",
  dark: "relative overflow-hidden rounded-3xl border border-white/10 bg-noir shadow-card",
  brand:
    "rounded-3xl border border-black/5 bg-gradient-to-br from-brand to-[#e59005] shadow-card",
};

const ICON_BOX: Record<Variant, string> = {
  light: "border border-line bg-paper text-accent",
  dark: "border border-white/10 bg-white/10 text-brand",
  brand: "border border-black/10 bg-white/25 text-[#4a3a09]",
};

const LABEL: Record<Variant, string> = {
  light: "text-dim",
  dark: "text-white/55",
  brand: "text-[#5c4708]",
};

const CHIP: Record<Variant, string> = {
  light: "border-line bg-paper text-mute",
  dark: "border-white/10 bg-white/5 text-[#c9c9d1]",
  brand: "border-black/10 bg-white/30 text-[#4a3a09]",
};

export default function Skills() {
  return (
    <Section id="skills" index="02" title="Skills" sub="The toolbox I reach for, grouped by layer.">
      <motion.div variants={stagger} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {GROUPS.map((group) => (
          <motion.div
            key={group.label}
            variants={scaleIn}
            className={`${TILE[group.variant]} ${group.span} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
          >
            {/* Soft amber glow inside the dark hero tile */}
            {group.variant === "dark" && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-[80px]"
              />
            )}

            <div className="relative">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${ICON_BOX[group.variant]}`}
                >
                  <group.icon size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <h3
                  className={`font-mono text-[11px] font-medium uppercase tracking-[0.22em] ${LABEL[group.variant]}`}
                >
                  {group.label}
                </h3>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className={`inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-[13px] ${CHIP[group.variant]}`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
