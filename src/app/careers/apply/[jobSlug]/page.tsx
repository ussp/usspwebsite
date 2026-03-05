import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveJobs, getJobBySlug } from "@/lib/jobs";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";

export const dynamicParams = true;

interface Props {
  params: Promise<{ jobSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobSlug } = await params;
  const job = await getJobBySlug(jobSlug);
  if (!job) return { title: "Apply - USSP" };
  return {
    title: `Apply: ${job.title} - USSP`,
    description: `Apply for the ${job.title} position at USSP. Since 2003, USSP has offered rewarding careers in IT, healthcare, and technology.`,
  };
}

export async function generateStaticParams() {
  const jobs = await getActiveJobs();
  return jobs.map((job) => ({ jobSlug: job.slug }));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function renderDescription(text: string) {
  const blocks = text.split("\n\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    // Check if this block is a section header like **Responsibilities**
    const headerMatch = block.match(/^\*\*(.+)\*\*$/);
    if (headerMatch) {
      elements.push(
        <h3
          key={i}
          className="text-lg font-[family-name:var(--font-alata)] text-dark mt-6 mb-3"
        >
          {headerMatch[1]}
        </h3>
      );
      continue;
    }

    // Check if this block is a bullet list
    const lines = block.split("\n");
    if (lines.every((l) => l.trimStart().startsWith("- "))) {
      elements.push(
        <ul key={i} className="list-disc pl-6 space-y-1.5 mb-4">
          {lines.map((line, j) => (
            <li
              key={j}
              className="text-dark/80 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed"
            >
              {line.replace(/^-\s*/, "")}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={i}
        className="text-dark/80 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed mb-4"
      >
        {block}
      </p>
    );
  }

  return elements;
}

export default async function ApplyPage({ params }: Props) {
  const { jobSlug } = await params;
  const job = await getJobBySlug(jobSlug);
  if (!job) notFound();

  return (
    <>
      <section className="pt-28 pb-12 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white font-[family-name:var(--font-montserrat)] mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Careers
          </Link>
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-2">
            {job.title}
          </h1>
          <p className="text-white/60 font-[family-name:var(--font-montserrat)]">
            {job.location} &middot; {job.type}
            {job.posted_at && (
              <> &middot; Posted {formatDate(job.posted_at)}</>
            )}
          </p>
        </div>
      </section>

      {/* Job Description */}
      {job.description && (
        <section className="py-12 bg-light-gray">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-[family-name:var(--font-alata)] text-dark mb-6">
              About This Role
            </h2>
            {renderDescription(job.description)}
          </div>
        </section>
      )}

      {/* Application Form */}
      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-4">
          <h2 className="text-2xl font-[family-name:var(--font-alata)] text-dark mb-6 text-center">
            Apply Now
          </h2>
          <ApplicationForm job={job} />
        </div>
      </section>
    </>
  );
}
