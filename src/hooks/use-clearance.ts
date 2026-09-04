import { useEffect, useState } from "react";
import { pickTonightFile, subscribeDayChange, type TonightPick } from "@/lib/tonight";

function sameTonight(a: TonightPick, b: TonightPick) {
  return (
    a.title === b.title &&
    a.caseId === b.caseId &&
    a.anniversary === b.anniversary &&
    a.href === b.href
  );
}

/** First paint uses the same daily picker as the client, so SSR and hydrate match. */
function firstPaintTonight(): TonightPick {
  return pickTonightFile();
}

export function useClearanceTonight(): TonightPick {
  const [tonight, setTonight] = useState<TonightPick>(firstPaintTonight);
  useEffect(() => {
    const sync = () => {
      const next = pickTonightFile();
      setTonight((prev) => (sameTonight(prev, next) ? prev : next));
    };
    sync();
    return subscribeDayChange(sync);
  }, []);
  return tonight;
}
