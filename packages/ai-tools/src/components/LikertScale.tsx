"use client";

interface LikertScaleProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

export default function LikertScale({
  name,
  label,
  value,
  onChange,
  lowLabel = "Strongly Disagree",
  highLabel = "Strongly Agree",
}: LikertScaleProps) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-xs text-dark/40 w-24 text-right pr-2">{lowLabel}</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer transition-colors ${
              value === n
                ? "bg-primary text-white border-primary"
                : "bg-white text-dark border-light-gray hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            {n}
          </label>
        ))}
        <span className="text-xs text-dark/40 w-24 pl-2">{highLabel}</span>
      </div>
    </div>
  );
}
