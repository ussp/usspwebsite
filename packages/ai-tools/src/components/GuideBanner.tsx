interface GuideBannerProps {
  title: string;
  children: React.ReactNode;
  variant?: "info" | "tip" | "warning" | "step";
}

const VARIANT_STYLES = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  tip: "bg-emerald-50 border-emerald-200 text-emerald-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  step: "bg-purple-50 border-purple-200 text-purple-900",
};

const VARIANT_ICONS = {
  info: "i",
  tip: "?",
  warning: "!",
  step: "#",
};

export default function GuideBanner({ title, children, variant = "info" }: GuideBannerProps) {
  return (
    <div className={`rounded-lg border p-4 mb-6 ${VARIANT_STYLES[variant]}`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          variant === "info" ? "bg-blue-200 text-blue-700" :
          variant === "tip" ? "bg-emerald-200 text-emerald-700" :
          variant === "warning" ? "bg-amber-200 text-amber-700" :
          "bg-purple-200 text-purple-700"
        }`}>
          {VARIANT_ICONS[variant]}
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">{title}</p>
          <div className="text-sm opacity-80">{children}</div>
        </div>
      </div>
    </div>
  );
}
