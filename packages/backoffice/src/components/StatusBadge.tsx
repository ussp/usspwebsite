const STATUS_STYLES: Record<string, string> = {
  new: "bg-info/10 text-info",
  screening: "bg-warning/10 text-warning",
  interview: "bg-primary/10 text-primary",
  offer: "bg-success/10 text-success",
  hired: "bg-success/20 text-success font-medium",
  rejected: "bg-danger/10 text-danger",
  withdrawn: "bg-dark/10 text-dark/50",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-dark/10 text-dark/60";
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs capitalize ${style}`}
    >
      {status}
    </span>
  );
}
