"use client";

import { useNow } from "@/hooks/useNow";
import { formatClock } from "@/lib/time";

/** "HH:mm" of now plus `offsetMin`, refreshed every 30s. Null until mounted. */
export function useClock(offsetMin = 0): string | null {
  const now = useNow();
  return now ? formatClock(now, offsetMin) : null;
}
