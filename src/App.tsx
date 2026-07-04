import { MotionConfig } from "motion/react";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    /* reducedMotion="user" disables transform/layout animations for users
       with prefers-reduced-motion set, while keeping opacity fades legible. */
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  );
}
