export type SkyBogey = {
  id: number;
  x: number;
  y: number;
  life: number;
};

type SkyBridge = {
  __skyBogeys__?: SkyBogey[];
  __skyKills__?: number[];
};

function sky(): SkyBridge {
  return globalThis as typeof globalThis & SkyBridge;
}

export function publishBogeys(list: SkyBogey[]) {
  sky().__skyBogeys__ = list;
}

export function readBogeys(): SkyBogey[] {
  return sky().__skyBogeys__ ?? [];
}

export function killBogey(id: number) {
  const g = sky();
  (g.__skyKills__ ??= []).push(id);
}

export function consumeKills(): number[] {
  const g = sky();
  const kills = g.__skyKills__ ?? [];
  g.__skyKills__ = [];
  return kills;
}
