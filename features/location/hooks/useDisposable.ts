"use client";

import { useEffect, useMemo, type DependencyList } from "react";

/** `create()` kept while `deps` stay the same, and disposed when it is replaced or the component unmounts (three.js geometries and materials). */
export function useDisposable<T extends { dispose: () => void }>(create: () => T, deps: DependencyList): T {
  // The caller lists what `create` reads in `deps`.
  const value = useMemo(create, deps);
  useEffect(() => () => value.dispose(), [value]);
  return value;
}
