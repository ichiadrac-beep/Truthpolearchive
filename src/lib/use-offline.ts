import { useEffect, useState } from "react";

/** True only after the tab stays offline briefly — avoids a flash over the header. */
export function useOffline() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer = 0;
    const apply = () => {
      window.clearTimeout(timer);
      if (navigator.onLine) {
        setOffline(false);
        return;
      }
      timer = window.setTimeout(() => setOffline(true), 900);
    };
    apply();
    window.addEventListener("online", apply);
    window.addEventListener("offline", apply);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", apply);
      window.removeEventListener("offline", apply);
    };
  }, []);

  return offline;
}
