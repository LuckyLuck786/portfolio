import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Variant = "default" | "link" | "view";

const SIZE: Record<Variant, number> = { default: 32, link: 48, view: 72 };

/**
 * Custom cursor: a precise dot plus a trailing ring that morphs by context —
 * grows over links, becomes an amber "View ↗" bubble over project cards.
 * Only mounts on fine-pointer devices without prefers-reduced-motion.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element;
      if (target.closest?.('[data-cursor="view"]')) setVariant("view");
      else if (target.closest?.("a, button")) setVariant("link");
      else setVariant("default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  const size = SIZE[variant];

  return (
    <>
      {/* Center dot — blend-difference stays visible on light and dark. */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        animate={{ opacity: visible && variant !== "view" ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[125] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      {/* Trailing ring, morphing per hover target */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          opacity: visible ? 1 : 0,
          backgroundColor: variant === "view" ? "#f5a623" : "rgba(245,166,35,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`pointer-events-none fixed left-0 top-0 z-[124] flex items-center justify-center rounded-full ${
          variant === "view" ? "" : "border border-white mix-blend-difference"
        }`}
      >
        {variant === "view" && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
            View ↗
          </span>
        )}
      </motion.div>
    </>
  );
}
