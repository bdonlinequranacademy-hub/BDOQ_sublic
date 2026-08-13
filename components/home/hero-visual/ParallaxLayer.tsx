"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface IParallaxLayerProps {
  children: ReactNode;
  /** Multiplier for mouse parallax (0 = still, 1 = full strength) */
  depth?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

/** Applies translate from shared parallax coords without local state. */
export function ParallaxLayer({
  children,
  depth = 0.4,
  x = 0,
  y = 0,
  className,
  style,
}: IParallaxLayerProps) {
  return (
    <div
      className={cn("will-change-transform", className)}
      style={{
        ...style,
        transform: `translate3d(${x * depth}px, ${y * depth}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
