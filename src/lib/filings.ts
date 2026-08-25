export type GuestFiling = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageName?: string;
  videoName?: string;
  status: "pending";
  filedAt: string;
};

const KEY = "truthpole-filings";

export function loadFilings(): GuestFiling[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFiling).slice(0, 20);
  } catch {
    return [];
  }
}

export function saveFilings(items: GuestFiling[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 20)));
  } catch {
    /* quota / private */
  }
}

function isFiling(value: unknown): value is GuestFiling {
  if (!value || typeof value !== "object") return false;
  const row = value as GuestFiling;
  return typeof row.id === "string" && typeof row.title === "string" && row.status === "pending";
}
