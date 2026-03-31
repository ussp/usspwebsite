"use client";

interface ApplicantFlowChartProps {
  data: Array<{ week: string; count: number }>;
}

export default function ApplicantFlowChart({ data }: ApplicantFlowChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-dark/50 font-medium">
              {d.count > 0 ? d.count : ""}
            </span>
            <div
              className="w-full bg-amber-400 rounded-t-sm transition-all min-h-[2px]"
              style={{
                height: `${Math.max((d.count / maxCount) * 100, 2)}%`,
              }}
            />
            <span className="text-[10px] text-dark/40">{d.week}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-3 h-3 bg-amber-400 rounded-sm" />
        <span className="text-xs text-dark/50">In Progress</span>
      </div>
    </div>
  );
}
