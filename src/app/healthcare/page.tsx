import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Healthcare - USSP",
  description: "USSP Healthcare Services - For Professionals and Organizations",
};

export default function Healthcare() {
  return (
    <section className="pt-16 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Healthcare Professional */}
        <div
          className="relative flex items-center justify-center p-12 min-h-[50vh]"
          style={{
            backgroundImage: "url(/assets/images/healthcare-hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-primary/70" />
          <div className="relative z-10 text-center text-white max-w-md">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-4">
              Are you a Healthcare Professional?
            </h2>
            <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8">
              Please click below to head to a dedicated page
            </p>
            <Link
              href="/healthcare-staffing"
              className="inline-block px-10 py-4 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Professional
            </Link>
          </div>
        </div>

        {/* Healthcare Organization */}
        <div
          className="relative flex items-center justify-center p-12 min-h-[50vh]"
          style={{
            backgroundImage: "url(/assets/images/tech-grid.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-near-black/70" />
          <div className="relative z-10 text-center text-white max-w-md">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-4">
              Are you a Healthcare Organization?
            </h2>
            <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8">
              Please click below to head to a dedicated page
            </p>
            <Link
              href="/healthcare-organization"
              className="inline-block px-10 py-4 bg-white text-near-black font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Organization
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
