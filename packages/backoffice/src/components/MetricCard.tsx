export default function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <p className="text-sm text-dark/60">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && <p className="text-xs text-dark/40 mt-1">{subtext}</p>}
    </div>
  );
}
