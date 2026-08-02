import { useEffect, useState } from "react";

/** True only after client hydration - safe gate for browser-only libraries. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}