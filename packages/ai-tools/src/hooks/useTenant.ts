"use client";

import { useState, useEffect } from "react";

interface TenantBranding {
  site_id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string | null;
  tagline: string | null;
  is_owner: boolean;
}

let cachedTenant: TenantBranding | null = null;

export function useTenant() {
  const [tenant, setTenant] = useState<TenantBranding | null>(cachedTenant);
  const [loading, setLoading] = useState(!cachedTenant);

  useEffect(() => {
    if (cachedTenant) return;

    fetch("/api/tenant")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          cachedTenant = d;
          setTenant(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { tenant, loading };
}
