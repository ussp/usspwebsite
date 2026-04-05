import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import CareersLinkedInBanner from "@/components/CareersLinkedInBanner";
import { getActiveJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers - USSP",
  description:
    "Join USSP (est. 2003) — a leader in AI implementation with a 12-module AI training program for every team member. Over 20 years of innovation in IT staffing, healthcare, and technology. We invest in people who want to grow.",
  keywords:
    "USSP careers, AI jobs, machine learning training, IT staffing careers, technology jobs Chicago, workforce development, continuous learning",
};

export default async function Careers({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const jobs = await getActiveJobs();
  const { error } = await searchParams;

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            Careers at USSP
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            Build the future with a team that invests in your growth
          </p>
        </div>
      </section>

      {/* Auth error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-[family-name:var(--font-montserrat)]">
              LinkedIn sign-in could not be completed. Please try again, or apply
              directly using the form on any position page.
            </p>
          </div>
        </div>
      )}

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Why Join USSP?"
            subtitle="We seek individuals who are passionate about making a difference through innovation and quality."
          />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p>
              Since our founding in 2003, USSP (US Software Professionals Inc.)
              has been dedicated to revolutionizing the staffing industry by
              integrating cutting-edge technology with exceptional talent. With
              over two decades of experience, diversity and expertise define our
              team. Comprised of industry veterans, innovative engineers, and
              dedicated professionals, our people are at the heart of our
              success.
            </p>
            <p>
              With offices in Chicago, India, and Canada, we offer global career
              opportunities across multiple disciplines including technology,
              healthcare staffing, blockchain, and consulting.
            </p>
          </div>
        </div>
      </section>

      {/* AI Leadership & Workforce Development */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Investing in the Future"
            subtitle="At USSP, continuous learning is not a perk — it is how we work."
          />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p>
              Artificial intelligence is reshaping every industry, and USSP is
              leading the way. We do not just talk about AI — we train every
              member of our team to understand it, apply it, and build with it.
              Our{" "}
              <Link
                href="/ai-training"
                className="text-primary hover:text-primary-dark underline"
              >
                12-module AI &amp; Machine Learning curriculum
              </Link>{" "}
              covers everything from the foundations of machine learning to
              generative AI, AI agents, MLOps, and responsible AI practices.
            </p>
            <p>
              Whether you are a seasoned engineer or early in your career, you
              will have access to structured training in large language models,
              prompt engineering, computer vision, NLP, and enterprise AI
              strategy. Every module is designed for hands-on learning, and the
              program culminates in a real-world capstone project.
            </p>
            <p>
              This commitment to upskilling is not limited to AI. For over 20
              years, USSP has invested in its people through custom training
              programs, mentorship, and exposure to projects across industries —
              from government IT modernization to healthcare innovation to
              blockchain development. When you grow, we grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "AI-First Culture",
                text: "Every team member has access to our 12-module AI & ML training program — from foundations through capstone certification.",
              },
              {
                title: "Cross-Industry Exposure",
                text: "Work on projects spanning government agencies, Fortune 500 enterprises, healthcare organizations, and emerging startups.",
              },
              {
                title: "Grow With Us",
                text: "Mentorship, continuous learning, and career development paths that evolve as technology evolves. Your growth is our investment.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Open Positions"
            subtitle="We are always looking for talented individuals to join our team."
          />
          <CareersLinkedInBanner />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job.slug}
                className="bg-white border border-dark/10 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  {job.title}
                </h3>
                <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] mb-1">
                  {job.location}
                </p>
                <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-[family-name:var(--font-montserrat)] mb-4 self-start">
                  {job.type}
                </span>
                {job.description && (
                  <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] leading-relaxed mb-3 line-clamp-2">
                    {job.description.split("\n\n")[0]}
                  </p>
                )}
                <p className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)] mb-4">
                  {job.posted_at
                    ? `Posted ${new Date(job.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Open position"}
                </p>
                <Link
                  href={`/careers/apply/${job.slug}`}
                  className="mt-auto inline-flex items-center justify-center px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-md font-[family-name:var(--font-alata)] transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm
        title="Get In Touch"
        subtitle="Send us your resume and a brief introduction. We'd love to hear from you."
      />
    </>
  );
}
