"use client";

import { useEffect, useState } from "react";

const TICK_MS = 30_000;

function format(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * "HH:mm" of now plus `offsetMin`, refreshed every 30s. Null until mounted so
 * the server-rendered HTML never disagrees with the browser's clock.
 */
export function useClock(offsetMin = 0): string | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return now ? format(new Date(now.getTime() + offsetMin * 60_000)) : null;
}
