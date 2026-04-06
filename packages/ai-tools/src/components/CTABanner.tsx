interface CTABannerProps {
  headline: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  headline,
  description,
  ctaText = "Learn about AI Transformation Monitor",
  ctaHref = "/",
  secondaryText,
  secondaryHref,
}: CTABannerProps) {
  return (
    <div className="mt-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark p-8 text-white">
      <h3 className="text-xl font-bold mb-2">{headline}</h3>
      <p className="text-white/80 text-sm mb-5 max-w-2xl">{description}</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          {ctaText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        {secondaryText && secondaryHref && (
          <a
            href={secondaryHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition-colors"
          >
            {secondaryText}
          </a>
        )}
      </div>
    </div>
  );
}
