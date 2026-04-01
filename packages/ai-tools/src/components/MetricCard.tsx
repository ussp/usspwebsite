interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
}

export default function MetricCard({ label, value, subtext }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <p className="text-sm text-dark/60 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtext && <p className="text-xs text-dark/50 mt-1">{subtext}</p>}
    </div>
  );
}
