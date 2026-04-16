"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useTenant } from "@/hooks/useTenant";

const navItems = [
  { href: "/", label: "Dashboard", desc: "", icon: "📊", section: "", toolKey: null },
  // ── AI Transformation Lifecycle ──
  { href: "/readiness", label: "Readiness Assessment", desc: "Step 1 — Evaluate org AI capabilities", icon: "🔍", section: "1 · Assess", toolKey: "readiness" },
  { href: "/engagements", label: "Transformation Monitor", desc: "Step 2 — Measure before & after training", icon: "📈", section: "2 · Transform", toolKey: "engagements" },
  { href: "/governance", label: "GRC & Compliance", desc: "Step 3 — Policy, risk & audit tracking", icon: "🛡️", section: "3 · Govern", toolKey: "governance" },
  // ── Reference ──
  { href: "/methodology", label: "Methodology & Research", desc: "Frameworks, papers, citations", icon: "📚", section: "Reference", toolKey: "methodology" },
  { href: "/tools", label: "Free Public Tools", desc: "DORA, velocity, ROI calculators", icon: "🧮", section: "Reference", toolKey: "tools" },
];

const adminItems = [
  { href: "/readiness/questions", label: "Question Bank", desc: "Manage readiness questions", icon: "❓", section: "Admin", toolKey: null },
  { href: "/admin/tenants", label: "Tenant Management", desc: "Manage tenants, tools & users", icon: "🏢", section: "Admin", toolKey: null },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isToolEnabled } = useEntitlements();
  const { tenant } = useTenant();

  // Filter nav items based on entitlements
  const visibleItems = navItems.filter((item) => isToolEnabled(item.toolKey));

  // Only show admin items for owner tenants
  const allItems = tenant?.is_owner
    ? [...visibleItems, ...adminItems]
    : visibleItems;

  const displayName = tenant?.short_name || "AI Transformation";
  const tagline = tenant?.tagline || "Assess \u00B7 Transform \u00B7 Govern";

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-60 bg-near-black text-white flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        {tenant?.logo_url ? (
          <img src={tenant.logo_url} alt={displayName} className="h-7 mb-1" />
        ) : (
          <h1 className="text-lg font-bold tracking-tight">{displayName}</h1>
        )}
        <p className="text-xs text-white/50 mt-0.5">{tagline}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {allItems.map((item, i) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const showSection = item.section && (i === 0 || allItems[i - 1].section !== item.section);
          return (
            <div key={item.href}>
              {showSection && (
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-5 pb-1">
                  {item.section}
                </p>
              )}
              <Link
                href={item.href}
                className={`block px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.desc && (
                  <p className={`text-[11px] mt-0.5 ml-8 ${isActive ? "text-white/60" : "text-white/35"}`}>
                    {item.desc}
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-[10px] text-white/25">
          Based on DORA, SPACE &amp; DevEx research frameworks
        </p>
      </div>
    </aside>
  );
}
