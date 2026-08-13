"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { FrameAnimation } from "@/components/home/hero-visual/FrameAnimation";
import { TeacherScreen } from "@/components/home/hero-visual/TeacherScreen";
import {
  BOY_FRAMES,
  GIRL_FRAMES,
  HERO_FRAME_MS,
} from "@/components/home/hero-visual/heroAnimationFrames";
import { cn } from "@/lib/cn";
import "./islamic-academy-hero-visual.css";

const PARALLAX_MAX = 12;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return coarse;
}

type LayerKey = "ambient" | "decor" | "teacher" | "boy" | "girl";

const DEPTH: Record<LayerKey, number> = {
  ambient: 0.15,
  decor: 0.55,
  teacher: 0.35,
  boy: 0.85,
  girl: 0.95,
};

/**
 * Premium hero artwork: teacher in a video-call screen + boy/girl students.
 * Pure CSS/HTML shapes + supplied WebP frame loops. No copy inside.
 */
export function IslamicAcademyHeroVisual({
  className,
}: {
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Partial<Record<LayerKey, HTMLDivElement | null>>>(
    {}
  );
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const parallaxEnabled = !reducedMotion && !coarsePointer;

  const setLayer = useCallback(
    (key: LayerKey) => (node: HTMLDivElement | null) => {
      layersRef.current[key] = node;
    },
    []
  );

  useEffect(() => {
    if (!parallaxEnabled) {
      (Object.keys(DEPTH) as LayerKey[]).forEach((key) => {
        const el = layersRef.current[key];
        if (el) el.style.transform = "translate3d(0,0,0)";
      });
      return undefined;
    }

    const lerp = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;

      if (Math.abs(cur.x - tgt.x) < 0.05 && Math.abs(cur.y - tgt.y) < 0.05) {
        cur.x = tgt.x;
        cur.y = tgt.y;
      }

      (Object.keys(DEPTH) as LayerKey[]).forEach((key) => {
        const el = layersRef.current[key];
        if (!el) return;
        const d = DEPTH[key];
        el.style.transform = `translate3d(${cur.x * d}px, ${cur.y * d}px, 0)`;
      });

      rafRef.current = window.requestAnimationFrame(lerp);
    };

    rafRef.current = window.requestAnimationFrame(lerp);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [parallaxEnabled]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!parallaxEnabled || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetRef.current = {
        x: nx * PARALLAX_MAX * 2,
        y: ny * PARALLAX_MAX * 2,
      };
    },
    [parallaxEnabled]
  );

  const onPointerLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "iahv relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[1.75rem] bg-white lg:max-w-[480px]",
        "shadow-[0_22px_55px_-30px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70",
        className
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      role="img"
      aria-label="Animated illustration of an online Quran teacher with two students"
    >
      <div
        ref={setLayer("ambient")}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(16,185,129,0.07),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(15,23,42,0.03),transparent_50%)]" />
        <div className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div
        ref={setLayer("decor")}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <span className="absolute left-[12%] top-[22%] h-16 w-16 rounded-full border border-emerald-200/50" />
        <span className="absolute right-[14%] top-[28%] h-10 w-10 rounded-full border border-slate-200/80" />
        <span className="absolute bottom-[18%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-300/50" />
      </div>

      <div
        className="absolute left-1/2 z-[2] -translate-x-1/2"
        style={{
          top: "var(--iahv-teacher-y)",
          width: "var(--iahv-teacher-w)",
        }}
      >
        <div ref={setLayer("teacher")} className="will-change-transform">
          <div className={cn(!reducedMotion && "iahv__float-screen")}>
            <TeacherScreen paused={reducedMotion} />
          </div>
        </div>
      </div>

      <div
        className="absolute z-[3]"
        style={{
          left: "var(--iahv-boy-x)",
          top: "var(--iahv-boy-y)",
          width: "var(--iahv-boy-w)",
        }}
      >
        <div ref={setLayer("boy")} className="will-change-transform">
          <div className={cn(!reducedMotion && "iahv__float-boy")}>
            <FrameAnimation
              frames={BOY_FRAMES}
              frameMs={HERO_FRAME_MS.boy}
              alt=""
              startOffset={0}
              paused={reducedMotion}
              className="h-auto w-full object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>
      </div>

      <div
        className="absolute z-[4]"
        style={{
          left: "var(--iahv-girl-x)",
          top: "var(--iahv-girl-y)",
          width: "var(--iahv-girl-w)",
        }}
      >
        <div ref={setLayer("girl")} className="will-change-transform">
          <div className={cn(!reducedMotion && "iahv__float-girl")}>
            <FrameAnimation
              frames={GIRL_FRAMES}
              frameMs={HERO_FRAME_MS.girl}
              alt=""
              startOffset={4}
              paused={reducedMotion}
              className="h-auto w-full object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
