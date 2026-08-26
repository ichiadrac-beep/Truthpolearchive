import { useEffect, useState } from "react";
import { subscribeClearance } from "@/lib/clearance";
import { pickTonightFile, type TonightPick } from "@/lib/tonight";

export function useClearanceTonight(): TonightPick {
  const [tonight, setTonight] = useState<TonightPick>(() =>
    typeof window === "undefined"
      ? { title: "Cussac", anniversary: false, special: null, caseId: null }
      : pickTonightFile(),
  );
  useEffect(() => {
    const sync = () => setTonight(pickTonightFile());
    sync();
    return subscribeClearance(sync);
  }, []);
  return tonight;
}