interface ImprovementBadgeProps {
  value: number; // percentage improvement
  size?: "sm" | "md" | "lg";
}

export default function ImprovementBadge({ value, size = "md" }: ImprovementBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const color = isNeutral
    ? "bg-gray-100 text-gray-600"
    : isPositive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";

  const arrow = isNeutral ? "" : isPositive ? "\u2191" : "\u2193";
  const sign = isPositive ? "+" : "";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5 font-semibold",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${color} ${sizeClasses[size]}`}>
      {arrow && <span>{arrow}</span>}
      {sign}{value.toFixed(1)}%
    </span>
  );
}
