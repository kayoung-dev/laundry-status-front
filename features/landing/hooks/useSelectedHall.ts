"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_HALL, HALLS } from "../constants";

const STORAGE_KEY = "washon.hall";
const listeners = new Set<() => void>();
// Kept in memory too, so a pick still sticks for the visit when storage is blocked.
let picked: string | null = null;

function readHall(): string {
  if (picked) {
    return picked;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved && HALLS.includes(saved) ? saved : DEFAULT_HALL;
  } catch {
    return DEFAULT_HALL;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function selectHall(hall: string) {
  picked = hall;
  try {
    window.localStorage.setItem(STORAGE_KEY, hall);
  } catch {
    // Storage blocked: the in-memory pick is enough.
  }
  listeners.forEach((listener) => listener());
}

/** The residence hall the visitor picked in the header, shared by every component that shows it. */
export function useSelectedHall(): string {
  return useSyncExternalStore(subscribe, readHall, () => DEFAULT_HALL);
}
