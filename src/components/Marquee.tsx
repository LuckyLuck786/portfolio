import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/* Tech keywords only — no invented claims, just texture. */
const ITEMS = [
  "React 18",
  "TypeScript",
  "Django REST",
  "Spring Boot",
  "RAG",
  "LLM Orchestration",
  "Reinforcement Learning",
  "Socket.IO",
  "MySQL",
  "Docker",
  "Linux",
  "JWT / RBAC",
];

/** Base drift speed in % of track width per second. */
const BASE_VELOCITY = 2.2;

/** Wrap v into [min, max) so the track loops seamlessly. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
}

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 text-transparent [-webkit-text-stroke:1px_#c9c4b6]">{item}</span>
          <span className="text-brand/80 [-webkit-text-stroke:0]">·</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Infinite outlined-text ticker whose speed and direction react to scroll
 * velocity. Renders as a static strip under prefers-reduced-motion.
 */
export default function Marquee() {
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });

  /* Four identical rows → wrapping at -25% loops invisibly. */
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * BASE_VELOCITY * (delta / 1000);

    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(vf);

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div aria-hidden className="select-none overflow-hidden border-y border-line py-5 md:py-6">
      <motion.div
        style={reduce ? undefined : { x }}
        className="flex whitespace-nowrap font-mono text-2xl font-semibold uppercase tracking-[0.16em] md:text-4xl"
      >
        <Row />
        <Row />
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}
