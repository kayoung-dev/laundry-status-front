"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UnauthorizedError } from "@/lib/api/client";
import { getDashboardMachines, machinesStreamUrl } from "../api";
import { PERIODIC_REFETCH_MS, STREAM_RECONNECT_MS, STREAM_REFETCH_DEBOUNCE_MS } from "../constants";
import type { DashboardMachine } from "../types";

interface UseAdminMachinesOptions {
  /** Start loading and streaming only once the session is confirmed. */
  enabled: boolean;
  onUnauthorized: () => void;
  /** Called with null after a successful read, or with a message on failure. */
  onError: (message: string | null) => void;
}

/**
 * Dashboard machine list kept live: GET /admin/machines/stream signals every
 * committed state change in any room, and each signal triggers a (debounced)
 * re-read of GET /admin/machines so admin-only fields stay consistent with the API.
 */
export function useAdminMachines({ enabled, onUnauthorized, onError }: UseAdminMachinesOptions) {
  const [machines, setMachines] = useState<DashboardMachine[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const [streamAttempt, setStreamAttempt] = useState(0);
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Several re-reads can be in flight (stream, interval, overrides); only the
  // latest one may write, so a slow older response cannot overwrite newer data.
  const loadSeq = useRef(0);

  const reload = useCallback(async () => {
    const seq = ++loadSeq.current;
    try {
      const next = await getDashboardMachines();
      if (seq !== loadSeq.current) {
        return;
      }
      setMachines(next);
      onError(null);
    } catch (err) {
      if (seq !== loadSeq.current) {
        return;
      }
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      onError("기기 목록을 불러오지 못했습니다.");
    }
  }, [onUnauthorized, onError]);

  useEffect(() => {
    if (enabled) {
      void reload();
    }
  }, [enabled, reload]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const source = new EventSource(machinesStreamUrl(), { withCredentials: true });

    const scheduleRefetch = () => {
      if (refetchTimer.current) {
        clearTimeout(refetchTimer.current);
      }
      refetchTimer.current = setTimeout(() => {
        refetchTimer.current = null;
        void reload();
      }, STREAM_REFETCH_DEBOUNCE_MS);
    };

    // Also fires on every automatic reconnect: re-read whatever changed while disconnected.
    source.onopen = () => {
      setLiveConnected(true);
      void reload();
    };
    source.addEventListener("machine_changed", scheduleRefetch);
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    source.onerror = () => {
      setLiveConnected(false);
      if (source.readyState === EventSource.CLOSED) {
        // The browser gave up (401 after the session expired, or a 5xx while
        // the backend restarts). The re-read redirects to login on 401;
        // otherwise reopen the stream after a pause.
        void reload();
        reconnectTimer = setTimeout(() => setStreamAttempt((n) => n + 1), STREAM_RECONNECT_MS);
      }
    };

    const interval = setInterval(() => void reload(), PERIODIC_REFETCH_MS);

    return () => {
      source.close();
      clearInterval(interval);
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (refetchTimer.current) {
        clearTimeout(refetchTimer.current);
        refetchTimer.current = null;
      }
    };
  }, [enabled, reload, streamAttempt]);

  return { machines, liveConnected, reload };
}
