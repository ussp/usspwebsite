"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LinkedInButton from "./LinkedInButton";
import FileUpload from "./FileUpload";
import type { Job } from "@/lib/jobs";

interface ApplicationFormProps {
  job: Job;
}

export default function ApplicationForm({ job }: ApplicationFormProps) {
  const { data: session } = useSession();
  const [resumePath, setResumePath] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignedIn = !!session?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.name || !session?.user?.email) {
      setError("Please sign in with LinkedIn first.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: session.user.name,
          email: session.user.email,
          jobTitle: job.title,
          jobSlug: job.slug,
          resumePath: resumePath || null,
          resumeName: resumeName || null,
          authProvider: "linkedin",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg className="w-12 h-12 mx-auto text-green-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-[family-name:var(--font-alata)] text-green-800 mb-2">
          Application Submitted
        </h3>
        <p className="text-green-700 font-[family-name:var(--font-montserrat)]">
          Thank you for applying for the <strong>{job.title}</strong> position.
          We&apos;ll review your application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: LinkedIn Sign-in (required) */}
      <div>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
          Step 1: Sign in with LinkedIn
        </label>
        <LinkedInButton />
      </div>

      <hr className="border-dark/10" />

      {/* Step 2: Resume Upload (optional, locked until signed in) */}
      <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
          Step 2: Upload your resume{" "}
          <span className="text-dark/40 font-[family-name:var(--font-montserrat)]">(optional)</span>
        </label>
        {!isSignedIn ? (
          <div className="border-2 border-dashed border-dark/20 rounded-md p-6 text-center">
            <svg className="w-8 h-8 mx-auto text-dark/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-dark/40 font-[family-name:var(--font-montserrat)]">
              Sign in with LinkedIn to unlock resume upload
            </p>
          </div>
        ) : (
          <FileUpload
            onUploaded={(path, name) => {
              setResumePath(path);
              setResumeName(name);
            }}
          />
        )}
      </div>

      <hr className="border-dark/10" />

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 font-[family-name:var(--font-montserrat)]">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !isSignedIn}
        className="w-full px-8 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-md font-[family-name:var(--font-alata)] text-sm transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>

      {!isSignedIn && (
        <p className="text-xs text-center text-dark/40 font-[family-name:var(--font-montserrat)]">
          Sign in with LinkedIn to submit your application
        </p>
      )}
    </form>
  );
}
