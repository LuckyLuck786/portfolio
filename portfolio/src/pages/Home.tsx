import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Nav from "../components/Nav";
import HudRail from "../components/HudRail";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Now from "../components/Now";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { scrollToId } from "../components/SmoothScroll";

export default function Home({ introDone }: { introDone: boolean }) {
  const { hash } = useLocation();

  /* Deep links like /#projects (e.g. "All projects" from a case study):
     wait for the wipe curtain to lift, then glide to the section. */
  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToId(hash.slice(1)), 500);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <Nav />
      <HudRail />

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
    </>
  );
}
