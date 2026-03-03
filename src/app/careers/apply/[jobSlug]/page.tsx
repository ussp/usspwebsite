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
            Apply: {job.title}
          </h1>
          <p className="text-white/60 font-[family-name:var(--font-montserrat)]">
            {job.location} &middot; {job.type}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-4">
          <ApplicationForm job={job} />
        </div>
      </section>
    </>
  );
}
