"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/positions", label: "Positions", icon: "💼" },
  { href: "/clients", label: "Clients", icon: "🏢" },
  { href: "/end-clients", label: "End Clients", icon: "🏛️" },
  { href: "/applications", label: "Applications", icon: "📋" },
  { href: "/contacts", label: "Contacts", icon: "📨" },
  { href: "/articles", label: "Articles", icon: "📝" },
  { href: "/staff", label: "Staff", icon: "👥" },
  { href: "/partnerships", label: "Partnerships", icon: "🤝" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-60 bg-near-black text-white flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">USSP</h1>
        <p className="text-xs text-white/50 mt-0.5">Back Office</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
