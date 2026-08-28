import { useEffect, useState } from "react";
import { subscribeClearance } from "@/lib/clearance";
import { anniversaryFor, pickTonightFile, type TonightPick } from "@/lib/tonight";

function sameTonight(a: TonightPick, b: TonightPick) {
  return (
    a.title === b.title &&
    a.caseId === b.caseId &&
    a.special === b.special &&
    a.anniversary === b.anniversary
  );
}

/** First paint only — Date, no sessionStorage, so SSR and the client match. */
function firstPaintTonight(): TonightPick {
  const match = anniversaryFor();
  if (match) {
    return { title: match.title, anniversary: true, special: null, caseId: match.id };
  }
  return { title: "Cussac", anniversary: false, special: null, caseId: "cussac" };
}

export function useClearanceTonight(): TonightPick {
  const [tonight, setTonight] = useState<TonightPick>(firstPaintTonight);
  useEffect(() => {
    const sync = () => {
      const next = pickTonightFile();
      setTonight((prev) => (sameTonight(prev, next) ? prev : next));
    };
    sync();
    return subscribeClearance(sync);
  }, []);
  return tonight;
}
