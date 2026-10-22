"use client";

import { useEffect, useState } from "react";

/**
 * The current time, refreshed every `intervalMs`. Null until mounted so the
 * server-rendered HTML never disagrees with the browser's clock.
 */
export function useNow(intervalMs = 30_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
