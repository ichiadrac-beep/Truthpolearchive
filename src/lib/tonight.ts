import { ARCHIVE_CASES } from "@/lib/archive-cases";
import { tonightClearance, type ClearanceId } from "@/lib/clearance";

export type TonightPick = {
  title: string;
  anniversary: boolean;
  special: ClearanceId | null;
  caseId: string | null;
};

type Anniversary = {
  month: number;
  day: number;
  through?: number;
  title: string;
  id: string;
};

const CASE_IDS = new Set(ARCHIVE_CASES.map((row) => row.id));

/** Local-date matches for Tonight’s File. Only ids that exist in ARCHIVE_CASES. */
const ANNIVERSARIES: Anniversary[] = [
  { month: 1, day: 7, title: "Mantell", id: "mantell" },
  { month: 1, day: 8, title: "Trans-en-Provence", id: "trans-en-provence" },
  { month: 1, day: 16, title: "Trindade Island", id: "trindade" },
  { month: 1, day: 23, title: "Berwyn Mountain", id: "berwyn" },
  { month: 2, day: 25, title: "Battle of Los Angeles", id: "battle-of-los-angeles" },
  { month: 3, day: 13, title: "Phoenix Lights", id: "phoenix-lights" },
  { month: 3, day: 16, title: "Malmstrom", id: "malmstrom" },
  { month: 3, day: 30, title: "Belgian Wave", id: "belgium-wave" },
  { month: 4, day: 6, title: "Westall", id: "westall" },
  { month: 4, day: 24, title: "Socorro", id: "socorro" },
  { month: 4, day: 25, title: "Aguadilla", id: "aguadilla" },
  { month: 5, day: 11, title: "McMinnville", id: "mcmminville" },
  { month: 6, day: 24, title: "Kenneth Arnold", id: "kenneth-arnold" },
  { month: 7, day: 1, title: "Valensole", id: "valensole" },
  { month: 7, day: 2, through: 9, title: "Roswell", id: "roswell" },
  { month: 7, day: 19, title: "Washington National", id: "washington-flap" },
  { month: 7, day: 20, title: "Washington National", id: "washington-flap" },
  { month: 7, day: 26, title: "Washington National", id: "washington-flap" },
  { month: 7, day: 27, title: "Washington National", id: "washington-flap" },
  { month: 8, day: 4, title: "Calvine", id: "calvine" },
  { month: 8, day: 21, title: "Kelly–Hopkinsville", id: "kelly-hopkinsville" },
  { month: 8, day: 25, title: "Lubbock Lights", id: "lubbock-lights" },
  { month: 8, day: 29, title: "Cussac", id: "cussac" },
  { month: 9, day: 3, title: "Exeter", id: "exeter" },
  { month: 9, day: 12, title: "Flatwoods", id: "flatwoods" },
  { month: 9, day: 16, title: "Ariel School", id: "ariel-school" },
  { month: 9, day: 19, title: "Tehran", id: "tehran" },
  { month: 9, day: 20, title: "Petrozavodsk", id: "petrozavodsk" },
  { month: 10, day: 4, title: "Shag Harbour", id: "shag-harbour" },
  { month: 10, day: 11, title: "Pascagoula", id: "pascagoula" },
  { month: 10, day: 21, title: "Valentich", id: "valentich" },
  { month: 10, day: 27, title: "Florence Stadium", id: "florence-1954" },
  { month: 11, day: 5, title: "Travis Walton", id: "travis-walton" },
  { month: 11, day: 7, title: "O'Hare Disc", id: "ohare" },
  { month: 11, day: 14, title: "Nimitz / Tic Tac", id: "nimitz" },
  { month: 11, day: 17, title: "JAL 1628", id: "jal-1628" },
  { month: 12, day: 9, title: "Kecksburg", id: "kecksburg" },
  { month: 12, day: 26, through: 28, title: "Rendlesham Forest", id: "rendlesham" },
].filter((row) => CASE_IDS.has(row.id));

export const TONIGHT_ANNIVERSARIES = ANNIVERSARIES;

export function anniversaryFor(date: Date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    ANNIVERSARIES.find((row) => {
      if (row.month !== month) return false;
      const end = row.through ?? row.day;
      return day >= row.day && day <= end;
    }) ?? null
  );
}

export function pickTonightFile(date: Date = new Date()): TonightPick {
  const match = anniversaryFor(date);
  if (match) {
    return { title: match.title, anniversary: true, special: null, caseId: match.id };
  }
  const cleared = tonightClearance();
  if (cleared.special) {
    return { title: cleared.title, anniversary: false, special: cleared.special, caseId: null };
  }
  const desk = ARCHIVE_CASES.find((row) => row.id === "cussac");
  return {
    title: desk?.title ?? "Cussac",
    anniversary: false,
    special: null,
    caseId: desk ? desk.id : null,
  };
}