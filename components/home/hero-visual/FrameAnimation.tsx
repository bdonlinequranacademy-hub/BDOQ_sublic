"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export interface IFrameAnimationProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  frames: readonly string[];
  /** Milliseconds per frame */
  frameMs?: number;
  alt: string;
  /** Start offset so characters don’t animate in sync */
  startOffset?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}

const preloaded = new Set<string>();

function preloadFrames(frames: readonly string[]) {
  if (typeof window === "undefined") return;

  for (const src of frames) {
    if (preloaded.has(src)) continue;
    preloaded.add(src);
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
  }
}

/**
 * Single <img> frame loop via rAF — avoids stacking many DOM nodes.
 */
export function FrameAnimation({
  frames,
  frameMs = 120,
  alt,
  startOffset = 0,
  paused = false,
  className,
  style,
  ...imgProps
}: IFrameAnimationProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const frameIndexRef = useRef(0);
  const lastTickRef = useRef(0);
  const framesRef = useRef(frames);
  const frameMsRef = useRef(frameMs);
  const pausedRef = useRef(paused);

  framesRef.current = frames;
  frameMsRef.current = frameMs;
  pausedRef.current = paused;

  useEffect(() => {
    if (!frames.length) return undefined;

    preloadFrames(frames);
    frameIndexRef.current = startOffset % frames.length;
    if (imgRef.current) {
      imgRef.current.src = frames[frameIndexRef.current] ?? frames[0];
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      if (imgRef.current) {
        imgRef.current.src = frames[0];
      }
      return undefined;
    }

    let rafId = 0;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);

      if (pausedRef.current) {
        lastTickRef.current = now;
        return;
      }

      const elapsed = now - lastTickRef.current;
      if (elapsed < frameMsRef.current) return;

      lastTickRef.current = now - (elapsed % frameMsRef.current);
      const list = framesRef.current;
      if (!list.length || !imgRef.current) return;

      frameIndexRef.current = (frameIndexRef.current + 1) % list.length;
      const next = list[frameIndexRef.current];
      if (!next) return;
      // img.src is absolute; compare by pathname suffix
      if (!imgRef.current.currentSrc.endsWith(next) && !imgRef.current.src.endsWith(next)) {
        imgRef.current.src = next;
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [frames, startOffset]);

  if (!frames.length) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- frame swap needs mutable src
    <img
      ref={imgRef}
      src={frames[startOffset % frames.length] ?? frames[0]}
      alt={alt}
      draggable={false}
      decoding="async"
      className={cn("pointer-events-none select-none", className)}
      style={style}
      {...imgProps}
    />
  );
}
