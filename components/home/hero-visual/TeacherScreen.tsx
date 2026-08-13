"use client";

import { FrameAnimation } from "@/components/home/hero-visual/FrameAnimation";
import {
  HERO_FRAME_MS,
  TEACHER_FRAMES,
} from "@/components/home/hero-visual/heroAnimationFrames";
import { cn } from "@/lib/cn";

export interface ITeacherScreenProps {
  className?: string;
  paused?: boolean;
}

/** Laptop / video-call bezel with teacher frame loop inside. */
export function TeacherScreen({ className, paused }: ITeacherScreenProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]",
        className
      )}
      aria-hidden="true"
    >
      {/* Screen bezel */}
      <div className="relative overflow-hidden rounded-[1.15rem] border border-slate-200/90 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
        {/* Top bar */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/90 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <span className="ml-2 h-1.5 flex-1 rounded-full bg-slate-200/80" />
        </div>

        <div className="relative aspect-[4/3] bg-gradient-to-b from-[#F8FAFC] to-white">
          <FrameAnimation
            frames={TEACHER_FRAMES}
            frameMs={HERO_FRAME_MS.teacher}
            alt=""
            startOffset={2}
            paused={paused}
            className="absolute inset-0 h-full w-full object-contain object-bottom p-2 sm:p-3"
          />
        </div>
      </div>

      {/* Laptop base */}
      <div className="relative mx-auto -mt-px h-2.5 w-[108%] max-w-none -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-slate-200 to-slate-300 shadow-sm" />
      <div className="mx-auto h-1.5 w-[42%] rounded-b-md bg-slate-300/90" />
    </div>
  );
}
