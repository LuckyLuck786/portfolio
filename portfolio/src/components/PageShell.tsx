import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE } from "../lib/motion";

/**
 * Route transition wrapper: a noir curtain covers the page on exit and
 * lifts away on enter. Pair with AnimatePresence mode="wait" around Routes.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="initial" animate="enter" exit="exit">
      {children}

      {/* Wipe curtain */}
      <motion.div
        aria-hidden
        variants={{
          initial: { y: 0 },
          enter: { y: "-100%", transition: { duration: 0.6, ease: EASE, delay: 0.05 } },
          exit: { y: 0, transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] } },
        }}
        className="pointer-events-none fixed inset-0 z-[115] bg-noir"
      />
    </motion.div>
  );
}
