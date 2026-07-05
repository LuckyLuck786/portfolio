import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

const SPACING = 28;
const REPEL_RADIUS = 130;
const BASE_FILL = "#d6d2c6";

/**
 * Hero backdrop: a canvas grid of dots that scatter away from the cursor
 * (flashing amber while displaced) and spring back home.
 *
 * Perf notes: dots are drawn as tiny rects (much cheaper than arc paths),
 * and the loop sleeps entirely once the grid settles and the cursor leaves —
 * it wakes on the next pointer move. Static single frame under reduced motion.
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
    let running = false;
    const mouse = { x: -1e4, y: -1e4 };

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BASE_FILL;
      for (const d of dots) {
        const disp = Math.abs(d.x - d.ox) + Math.abs(d.y - d.oy);
        if (disp > 2) {
          ctx.fillStyle = `rgba(245,166,35,${Math.min(0.25 + disp / 40, 0.9)})`;
          ctx.fillRect(d.x - 1.1, d.y - 1.1, 2.2, 2.2);
          ctx.fillStyle = BASE_FILL;
        } else {
          ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
        }
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
      let energy = 0;
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
        energy += Math.abs(d.vx) + Math.abs(d.vy);
      }
      render();

      /* Sleep once the cursor is away and the grid has settled. */
      const idle = mouse.x < -9000 && energy < 0.5;
      if (inView && !idle) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    function wake() {
      if (running || !inView) return;
      running = true;
      raf = requestAnimationFrame(step);
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
      wake();
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) wake();
    });
    observer.observe(canvas);
    wake();

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
