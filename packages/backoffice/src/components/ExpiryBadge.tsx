import { deriveExpiryStatus } from "@ussp-platform/core";

interface Props {
  expiryDate: string | null | undefined;
  className?: string;
}

function daysFromNow(expiryDate: string): number {
  const [y, m, d] = expiryDate.split("T")[0].split("-").map((n) => parseInt(n, 10));
  const expiryUtc = Date.UTC(y, m - 1, d);
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((expiryUtc - todayUtc) / 86_400_000);
}

export default function ExpiryBadge({ expiryDate, className = "" }: Props) {
  const status = deriveExpiryStatus(expiryDate);
  if (status === "none") return null;

  const base = "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full";

  if (status === "expired") {
    return (
      <span className={`${base} bg-red-100 text-red-700 ${className}`}>
        Expired {expiryDate ? `(${expiryDate})` : ""}
      </span>
    );
  }

  const days = expiryDate ? daysFromNow(expiryDate) : 0;

  if (status === "expiring_soon_30") {
    return (
      <span className={`${base} bg-red-100 text-red-700 ${className}`}>
        Expires in {days} day{days === 1 ? "" : "s"}
      </span>
    );
  }

  if (status === "expiring_soon_90") {
    return (
      <span className={`${base} bg-amber-100 text-amber-700 ${className}`}>
        Expires in {days} days
      </span>
    );
  }

  return (
    <span className={`${base} bg-green-100 text-green-700 ${className}`}>
      On file
    </span>
  );
}
