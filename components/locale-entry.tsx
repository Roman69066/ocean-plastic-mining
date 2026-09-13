"use client";
import { useEffect } from "react";
import { preferredLocale } from "@/lib/locale-routing";
export function LocaleEntry() {
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem("opm-language");
    } catch {}
    window.location.replace(
      `/${preferredLocale(stored, navigator.languages)}/` +
        window.location.search +
        window.location.hash,
    );
  }, []);
  return null;
}
