import { useState } from "react";
import { MotionConfig } from "motion/react";

import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import CommandPalette from "./components/CommandPalette";
import HudRail from "./components/HudRail";
import Grain from "./components/Grain";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Now from "./components/Now";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  /* Hero entrance waits for the preloader curtain to lift. */
  const [introDone, setIntroDone] = useState(false);

  return (
    /* reducedMotion="user" disables transform/layout animations for users
       with prefers-reduced-motion set, while keeping opacity fades legible. */
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CustomCursor />
      <Grain />
      {!introDone && <Preloader onDone={() => setIntroDone(true)} />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[140] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
      >
        Skip to content
      </a>

      <Nav />
      <HudRail />
      <CommandPalette />

      <main id="main">
        <Hero introDone={introDone} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Now />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  );
}
