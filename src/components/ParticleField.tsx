import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

const SPACING = 28;
const REPEL_RADIUS = 130;

/**
 * Hero backdrop: a canvas grid of dots that scatter away from the cursor
 * (flashing amber while displaced) and spring back home. Paints a single
 * static frame under prefers-reduced-motion; pauses while offscreen.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let inView = true;
    const mouse = { x: -1e4, y: -1e4 };

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const disp = Math.hypot(d.x - d.ox, d.y - d.oy);
        ctx.fillStyle =
          disp > 2
            ? `rgba(245,166,35,${Math.min(0.25 + disp / 40, 0.9)})`
            : "#d6d2c6";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function rebuild() {
      if (!canvas || !ctx) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
        }
      }
      render();
    }

    function step() {
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0.01) {
          const force = ((1 - dist / REPEL_RADIUS) * 5) / dist;
          d.vx += dx * force;
          d.vy += dy * force;
        }
        d.vx += (d.ox - d.x) * 0.03;
        d.vy += (d.oy - d.y) * 0.03;
        d.vx *= 0.85;
        d.vy *= 0.85;
        d.x += d.vx;
        d.y += d.vy;
      }
      render();
      if (inView) raf = requestAnimationFrame(step);
    }

    rebuild();
    window.addEventListener("resize", rebuild);

    if (reduce) {
      return () => window.removeEventListener("resize", rebuild);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => {
      const wasInView = inView;
      inView = entry.isIntersecting;
      if (inView && !wasInView) raf = requestAnimationFrame(step);
    });
    observer.observe(canvas);
    raf = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_65%_60%_at_50%_38%,black_25%,transparent_78%)]"
    />
  );
}
