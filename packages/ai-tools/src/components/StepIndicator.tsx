interface Step {
  number: number;
  label: string;
  description: string;
  active?: boolean;
  completed?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
      <p className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-4">How this works</p>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step.completed
                ? "bg-success text-white"
                : step.active
                  ? "bg-primary text-white"
                  : "bg-light-gray text-dark/40"
            }`}>
              {step.completed ? "\u2713" : step.number}
            </div>
            <div>
              <p className={`text-sm font-medium ${step.active ? "text-primary" : step.completed ? "text-dark/60" : "text-dark/40"}`}>
                {step.label}
              </p>
              <p className="text-xs text-dark/40">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
