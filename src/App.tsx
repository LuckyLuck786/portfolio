import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import SmoothScroll, { getLenis } from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import CommandPalette from "./components/CommandPalette";
import ResumeModal from "./components/ResumeModal";
import Grain from "./components/Grain";
import PageShell from "./components/PageShell";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";

/** Jump to the top instantly on every route change (before the wipe lifts). */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  /* Hero entrance waits for the preloader curtain to lift. */
  const [introDone, setIntroDone] = useState(false);
  const location = useLocation();

  return (
    /* reducedMotion="user" disables transform/layout animations for users
       with prefers-reduced-motion set, while keeping opacity fades legible. */
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollReset />
      <CustomCursor />
      <Grain />
      {!introDone && <Preloader onDone={() => setIntroDone(true)} />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[140] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
      >
        Skip to content
      </a>

      <CommandPalette />
      <ResumeModal />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageShell>
                <Home introDone={introDone} />
              </PageShell>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <PageShell>
                <CaseStudy />
              </PageShell>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Vercel Web Analytics — no-op locally, collects on Vercel deploys. */}
      <Analytics />
    </MotionConfig>
  );
}
