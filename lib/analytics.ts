"use client";

import { sendGTMEvent } from "@next/third-parties/google";

type EventParams = Record<string, string | number | boolean | null | undefined>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

const STORAGE_KEY = "fh_hipotecas_utms";

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    sendGTMEvent({ event, ...params, ...readUtms() });
  } catch {
    // no-op: analytics never breaks UX
  }
  // Meta Pixel passthrough (no-op if fbq is not loaded)
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    if (event === "form_submit") {
      w.fbq("track", "Lead", params);
    } else if (event === "page_view") {
      w.fbq("track", "ViewContent");
    }
  }
}

export function captureUtmsFromUrl() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Partial<Record<UtmKey, string>> = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) found[key] = v;
    }
    if (Object.keys(found).length > 0) {
      const existing = readUtms();
      const merged = { ...existing, ...found };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // ignore
  }
}

export function readUtms(): Partial<Record<UtmKey, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<UtmKey, string>>) : {};
  } catch {
    return {};
  }
}

let scrollMarksDone = new Set<number>();

export function initScrollDepthTracking() {
  if (typeof window === "undefined") return () => {};
  scrollMarksDone = new Set();
  const onScroll = () => {
    const doc = document.documentElement;
    const scrolled = window.scrollY + window.innerHeight;
    const total = doc.scrollHeight;
    if (total <= 0) return;
    const pct = Math.round((scrolled / total) * 100);
    for (const mark of [25, 50, 75, 100]) {
      if (pct >= mark && !scrollMarksDone.has(mark)) {
        scrollMarksDone.add(mark);
        track("scroll_depth", { depth: mark });
      }
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 500,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
