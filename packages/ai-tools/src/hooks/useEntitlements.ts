"use client";

import { useState, useEffect } from "react";

interface EntitlementsData {
  siteId: string;
  enabledTools: string[];
}

let cachedData: EntitlementsData | null = null;

export function useEntitlements() {
  const [data, setData] = useState<EntitlementsData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    fetch("/api/entitlements")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          cachedData = d;
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isToolEnabled = (toolKey: string | null): boolean => {
    if (!toolKey) return true; // null toolKey = always visible (e.g. Dashboard)
    if (!data) return true; // loading — show everything to avoid flicker
    return data.enabledTools.includes(toolKey);
  };

  return { data, loading, isToolEnabled };
}
