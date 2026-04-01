"use client";

/**
 * Custom SVG radar chart for SPACE framework dimensions.
 * Renders a 5-axis spider chart with baseline (gray) and post-training (blue) overlays.
 * No external charting library.
 */

interface RadarChartProps {
  labels: string[];
  baselineValues: number[]; // 0-5 scale
  postValues: number[]; // 0-5 scale
  maxValue?: number;
  size?: number;
}

export default function RadarChart({
  labels,
  baselineValues,
  postValues,
  maxValue = 5,
  size = 300,
}: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / labels.length;
  // Start from top (-PI/2)
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  function getPolygonPoints(values: number[]): string {
    return values.map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    }).join(" ");
  }

  // Grid rings
  const rings = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={labels.map((_, i) => {
              const p = getPoint(i, ring);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="#E8EAEC"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {labels.map((_, i) => {
          const p = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#E8EAEC"
              strokeWidth={1}
            />
          );
        })}

        {/* Baseline polygon (gray) */}
        <polygon
          points={getPolygonPoints(baselineValues)}
          fill="rgba(156, 163, 175, 0.2)"
          stroke="#9CA3AF"
          strokeWidth={2}
        />

        {/* Post-training polygon (blue) */}
        <polygon
          points={getPolygonPoints(postValues)}
          fill="rgba(37, 99, 235, 0.15)"
          stroke="#2563EB"
          strokeWidth={2}
        />

        {/* Data points - baseline */}
        {baselineValues.map((v, i) => {
          const p = getPoint(i, v);
          return (
            <circle key={`b-${i}`} cx={p.x} cy={p.y} r={3} fill="#9CA3AF" />
          );
        })}

        {/* Data points - post */}
        {postValues.map((v, i) => {
          const p = getPoint(i, v);
          return (
            <circle key={`p-${i}`} cx={p.x} cy={p.y} r={3} fill="#2563EB" />
          );
        })}

        {/* Labels */}
        {labels.map((label, i) => {
          const p = getPoint(i, maxValue + 0.8);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-dark/60"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-xs text-dark/50">Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-dark/50">Post-Training</span>
        </div>
      </div>
    </div>
  );
}
