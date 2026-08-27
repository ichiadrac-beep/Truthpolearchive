import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; base: number; tw: number; spd: number; hue: string };

/** placeholder restore in progress */
export function StarField({ paused }: { paused: boolean; allowDuel?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true" style={{ opacity: paused ? 0.45 : 1 }}>
      <div className="cosmos-wash absolute inset-0" />
    </div>
  );
}
