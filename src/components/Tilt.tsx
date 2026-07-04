import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type TiltProps = {
  children: ReactNode;
  /** Maximum tilt in degrees. */
  max?: number;
  className?: string;
};

/**
 * 3D tilt micro-interaction: the card leans toward the cursor and springs
 * flat on leave. Fully disabled when prefers-reduced-motion is set.
 */
export default function Tilt({ children, max = 7, className }: TiltProps) {
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 220, damping: 18 });
  const springRy = useSpring(ry, { stiffness: 220, damping: 18 });

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const py = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rx.set(-py * max);
    ry.set(px * max);
  }

  function onPointerLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX: springRx, rotateY: springRy, transformPerspective: 800 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}
