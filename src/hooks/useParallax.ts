// hooks/useParallax.ts
import { useEffect, useMemo, useRef, useState } from "react";

type Style = React.CSSProperties;

export function useParallax({
  strength = 160,   // px travel at most (lower on mobile below)
  speed = 0.35,     // 0..1; smaller = slower
  clamp = true,
}: {
  strength?: number;
  speed?: number;
  clamp?: boolean;
} = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState<Style>({ transform: "translate3d(0,0,0)" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    let inView = false;

    // Cache static geometry (cheaper than getBoundingClientRect on every frame)
    let offsetTop = 0;
    let height = 0;

    const computeStatic = () => {
      // Walk up to page offsetTop (avoids layout thrash per frame)
      let y = 0;
      let n: HTMLElement | null = el;
      while (n) {
        y += n.offsetTop || 0;
        n = (n.offsetParent as HTMLElement) || null;
      }
      offsetTop = y;
      height = el.offsetHeight;
    };

    computeStatic();

    // Recompute on resize/content changes
    const ro = new ResizeObserver(() => computeStatic());
    ro.observe(el);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    // Lighter load on touch devices
    const mobileStrength = isCoarse ? Math.max(80, strength * 0.7) : strength;
    const frameSkip = isCoarse ? 2 : 1; // update every 2 frames on mobile
    let frameCount = 0;

    const update = () => {
      if (!inView) return;
      // Skip some frames on mobile
      frameCount = (frameCount + 1) % frameSkip;
      if (frameCount !== 0) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // distance between viewport center and element center
      const elementCenter = offsetTop - scrollY + height / 2;
      const viewportCenter = vh / 2;
      const delta = elementCenter - viewportCenter;

      // Normalize using viewport+height (stable across sizes)
      const span = vh + height || 1;
      const t = (delta / span) * 2; // ~-1..+1

      let offset = -t * mobileStrength * (1 - speed);
      if (clamp) {
        const cap = mobileStrength;
        if (offset > cap) offset = cap;
        if (offset < -cap) offset = -cap;
      }

      setStyle({
        transform: `translate3d(0, ${offset.toFixed(2)}px, 0)`,
        willChange: "transform",     // only set while inView
        contain: "paint",
        backfaceVisibility: "hidden" as any,
        transformStyle: "preserve-3d",
      });
    };

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(() => {
        update();
        loop();
      });
    };

    const start = () => {
      if (running) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      // Drop will-change when idle to avoid compositor pressure
      setStyle((s) => ({ ...s, willChange: undefined }));
    };

    // Only animate while visible
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        if (prefersReduced.matches) {
          setStyle({ transform: "translate3d(0,0,0)" });
          stop();
          return;
        }
        if (inView) {
          computeStatic(); // in case layout shifted before entry
          start();
        } else {
          stop();
        }
      },
      { root: null, threshold: [0, 0.01, 0.99, 1], rootMargin: "12%" }
    );

    io.observe(el);

    const onScroll = () => {
      // no-op; we run a rAF loop while visible
      // but we *do* need to respond to jumps (e.g., anchor)
      // so recalc once on scroll start:
      if (!running) return;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeStatic);

    // Respect reduced motion
    const onRM = () => {
      if (prefersReduced.matches) {
        setStyle({ transform: "translate3d(0,0,0)" });
        stop();
      } else if (inView) {
        start();
      }
    };
    prefersReduced.addEventListener?.("change", onRM);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeStatic);
      prefersReduced.removeEventListener?.("change", onRM);
    };
  }, [strength, speed, clamp]);

  return { ref, style };
}
