"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LOCATION_PATH } from "@/constants/navigation";
import { findHall, findLaundry, locationPath } from "@/features/location/utils";
import FloorScreen from "./FloorScreen";
import MapScreen from "./MapScreen";

interface LocationScreenProps {
  hallId: string | null;
  floor: number | null;
}

/**
 * Picks the level from the URL: campus (/location), hall (?hall=), floor (&floor=).
 * Unknown halls fall back to the campus, floors without a laundry room to the hall.
 * Esc goes one level up, like the browser back button.
 */
export default function LocationScreen({ hallId, floor }: LocationScreenProps) {
  const router = useRouter();
  const hall = findHall(hallId);
  const laundry = hall ? findLaundry(hall, floor) : undefined;
  const parent = laundry && hall ? locationPath(hall.id) : hall ? LOCATION_PATH : null;

  useEffect(() => {
    if (!parent) {
      return;
    }
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (e.key !== "Escape" || e.defaultPrevented || target?.closest("input, textarea, select, [role='dialog']")) {
        return;
      }
      router.push(parent as string);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [parent, router]);

  if (hall && laundry) {
    return <FloorScreen key={`${hall.id}-${laundry.floor}`} hall={hall} laundry={laundry} />;
  }
  return <MapScreen hall={hall} />;
}
