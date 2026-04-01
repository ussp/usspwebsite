"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", desc: "", icon: "📊", section: "" },
  { href: "/engagements", label: "Transformation Monitor", desc: "Before/after team productivity", icon: "📈", section: "Tools" },
  { href: "/readiness", label: "Readiness Assessment", desc: "Org AI capability check", icon: "🔍", section: "Tools" },
  { href: "/methodology", label: "Methodology & Research", desc: "Frameworks, papers, citations", icon: "📚", section: "Reference" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-60 bg-near-black text-white flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">AI Transformation</h1>
        <p className="text-xs text-white/50 mt-0.5">Monitoring Tools</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item, i) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const showSection = item.section && (i === 0 || navItems[i - 1].section !== item.section);
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
