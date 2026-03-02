import Link from "next/link";

interface HeroSectionProps {
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
  videoId?: string;
  videoType?: "youtube" | "vimeo";
  overlay?: boolean;
  height?: string;
}

export default function HeroSection({
  heading,
  subheading,
  buttonText,
  buttonHref = "#",
  backgroundImage,
  videoId,
  videoType = "youtube",
  overlay = true,
  height = "h-screen",
}: HeroSectionProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Video Background */}
      {videoId && (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={
              videoType === "youtube"
                ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
                : `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`
            }
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Background video"
          />
        </div>
      )}

      {/* Image Background */}
      {backgroundImage && !videoId && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-alata)] text-white mb-4">
          {heading}
        </h1>
        {subheading && (
          <p className="text-lg md:text-2xl text-white/90 font-[family-name:var(--font-montserrat)] mb-8">
            {subheading}
          </p>
        )}
        {buttonText && (
          <Link
            href={buttonHref}
            className="inline-block px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-all"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
