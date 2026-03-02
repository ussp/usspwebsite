interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-4 ${
          light ? "text-white" : "text-dark"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg font-[family-name:var(--font-montserrat)] ${
            light ? "text-white/80" : "text-dark/70"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
