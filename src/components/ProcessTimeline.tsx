interface ProcessStep {
  number: number;
  title: string;
  description?: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  title?: string;
  subtitle?: string;
}

export default function ProcessTimeline({
  steps,
  title,
  subtitle,
}: ProcessTimelineProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-dark/70 font-[family-name:var(--font-montserrat)]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-primary/20" />

          <div className="hidden md:flex justify-evenly">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center max-w-[180px]">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-xl font-[family-name:var(--font-alata)] font-bold mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: single column */}
          <div className="md:hidden grid grid-cols-1 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-xl font-[family-name:var(--font-alata)] font-bold mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
