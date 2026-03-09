"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LinkedInButton from "./LinkedInButton";
import FileUpload from "./FileUpload";
import type { Job } from "@/lib/jobs";

interface ApplicationFormProps {
  job: Job;
}

export default function ApplicationForm({ job }: ApplicationFormProps) {
  const { data: session } = useSession();
  const [applicantType, setApplicantType] = useState<"employee" | "vendor">("employee");
  const [resumePath, setResumePath] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [phone, setPhone] = useState("");
  const [expectedBillRate, setExpectedBillRate] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Job alerts opt-in (post-submission)
  const [alertsOptIn, setAlertsOptIn] = useState(false);
  const [alertsSaving, setAlertsSaving] = useState(false);
  const [alertsSaved, setAlertsSaved] = useState(false);

  const isSignedIn = !!session?.user;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.name || !session?.user?.email) {
      setError("Please sign in with LinkedIn first.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number (10+ digits).");
      return;
    }

    if (!smsConsent) {
      setError("Please consent to SMS communications to continue.");
      return;
    }

    if (applicantType === "vendor") {
      if (!expectedBillRate.trim()) {
        setError("Please enter the expected bill rate.");
        return;
      }
      if (!availabilityDate) {
        setError("Please select a candidate availability date.");
        return;
      }
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
          linkedinSub: session.user.linkedinSub || null,
          givenName: session.user.givenName || null,
          familyName: session.user.familyName || null,
          profilePicture: session.user.image || null,
          locale: session.user.locale || null,
          emailVerified: session.user.linkedinEmailVerified ?? null,
          phone: phone.replace(/\D/g, ""),
          smsConsent: true,
          applicantType,
          expectedBillRate: applicantType === "vendor" ? expectedBillRate : null,
          availabilityDate: applicantType === "vendor" ? availabilityDate : null,
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

  const handleJobAlerts = async () => {
    if (!session?.user?.email) return;
    setAlertsSaving(true);
    try {
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          jobSlug: job.slug,
        }),
      });
      if (res.ok) {
        setAlertsSaved(true);
        setAlertsOptIn(true);
      }
    } catch {
      // Silently fail — non-critical
    } finally {
      setAlertsSaving(false);
    }
  };

  // Post-submission follow-up screen
  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Success message */}
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

        {/* Follow USSP on LinkedIn */}
        <div className="bg-white border border-dark/10 rounded-lg p-6">
          <h4 className="text-lg font-[family-name:var(--font-alata)] text-dark mb-2">
            Follow USSP on LinkedIn
          </h4>
          <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] mb-4">
            Stay updated on company news, projects, and new opportunities.
          </p>
          <a
            href="https://www.linkedin.com/company/us-software-professionals/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md font-[family-name:var(--font-alata)] text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Follow on LinkedIn
          </a>
        </div>

        {/* Job Alerts opt-in */}
        <div className="bg-white border border-dark/10 rounded-lg p-6">
          <h4 className="text-lg font-[family-name:var(--font-alata)] text-dark mb-2">
            Get Notified About New Positions
          </h4>
          <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] mb-4">
            We&apos;ll email you when new jobs matching your profile are posted.
          </p>
          {alertsSaved ? (
            <div className="flex items-center gap-2 text-green-700 font-[family-name:var(--font-montserrat)] text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Subscribed! We&apos;ll notify you about new positions.
            </div>
          ) : (
            <button
              type="button"
              onClick={handleJobAlerts}
              disabled={alertsSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-md font-[family-name:var(--font-alata)] text-sm transition-colors"
            >
              {alertsSaving ? "Subscribing..." : "Subscribe to Job Alerts"}
            </button>
          )}
        </div>

        {/* Browse more positions */}
        <div className="text-center">
          <Link
            href="/careers"
            className="text-primary hover:text-primary-dark font-[family-name:var(--font-alata)] text-sm transition-colors"
          >
            &larr; Browse More Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Applicant Type Toggle */}
      <div>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-3">
          I&apos;m applying as:
        </label>
        <div className="flex rounded-lg border border-dark/20 overflow-hidden">
          <button
            type="button"
            onClick={() => setApplicantType("employee")}
            className={`flex-1 px-4 py-2.5 text-sm font-[family-name:var(--font-alata)] transition-colors ${
              applicantType === "employee"
                ? "bg-primary text-white"
                : "bg-white text-dark/60 hover:bg-dark/5"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setApplicantType("vendor")}
            className={`flex-1 px-4 py-2.5 text-sm font-[family-name:var(--font-alata)] transition-colors ${
              applicantType === "vendor"
                ? "bg-primary text-white"
                : "bg-white text-dark/60 hover:bg-dark/5"
            }`}
          >
            Vendor
          </button>
        </div>
        {applicantType === "vendor" && (
          <p className="text-xs text-dark/50 font-[family-name:var(--font-montserrat)] mt-2">
            Submitting a candidate on behalf of your staffing agency or consultancy.
          </p>
        )}
      </div>

      <hr className="border-dark/10" />

      {/* Step 1: LinkedIn Sign-in (required) */}
      <div>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
          Step 1: {applicantType === "vendor" ? "Candidate LinkedIn Profile" : "Sign in with LinkedIn"}
        </label>
        <LinkedInButton />
      </div>

      <hr className="border-dark/10" />

      {/* Step 2: Phone Number (required, locked until signed in) */}
      <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
          Step 2: {applicantType === "vendor" ? "Vendor Phone Number" : "Phone Number"}{" "}
          <span className="text-red-500">*</span>
        </label>
        {!isSignedIn ? (
          <div className="border-2 border-dashed border-dark/20 rounded-md p-4 text-center">
            <p className="text-sm text-dark/40 font-[family-name:var(--font-montserrat)]">
              Sign in with LinkedIn to continue
            </p>
          </div>
        ) : (
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(312) 555-0100"
            maxLength={14}
            className="w-full px-4 py-2.5 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        )}
      </div>

      {/* Vendor-only fields: Bill Rate + Availability Date */}
      {applicantType === "vendor" && (
        <>
          <hr className="border-dark/10" />
          <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
            <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
              Expected Bill Rate{" "}
              <span className="text-red-500">*</span>
            </label>
            {!isSignedIn ? (
              <div className="border-2 border-dashed border-dark/20 rounded-md p-4 text-center">
                <p className="text-sm text-dark/40 font-[family-name:var(--font-montserrat)]">
                  Sign in with LinkedIn to continue
                </p>
              </div>
            ) : (
              <input
                type="text"
                value={expectedBillRate}
                onChange={(e) => setExpectedBillRate(e.target.value)}
                placeholder="e.g. $85/hr"
                className="w-full px-4 py-2.5 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            )}
          </div>

          <hr className="border-dark/10" />
          <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
            <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
              Candidate Availability Date{" "}
              <span className="text-red-500">*</span>
            </label>
            {!isSignedIn ? (
              <div className="border-2 border-dashed border-dark/20 rounded-md p-4 text-center">
                <p className="text-sm text-dark/40 font-[family-name:var(--font-montserrat)]">
                  Sign in with LinkedIn to continue
                </p>
              </div>
            ) : (
              <input
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            )}
          </div>
        </>
      )}

      <hr className="border-dark/10" />

      {/* Step 3: Resume Upload (optional, locked until signed in) */}
      <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
        <label className="block text-sm font-[family-name:var(--font-alata)] text-dark mb-2">
          Step 3: Upload {applicantType === "vendor" ? "candidate" : "your"} resume{" "}
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

      {/* TCPA SMS Consent */}
      <div className={!isSignedIn ? "opacity-40 pointer-events-none" : ""}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-dark/30 text-primary focus:ring-primary/30"
          />
          <span className="text-xs text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
            By checking this box, I consent to receive SMS text messages from US Software
            Professionals Inc. regarding job opportunities and application updates at the phone
            number provided. Message and data rates may apply. Reply STOP to opt out at any time.
            View our{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
            . <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 font-[family-name:var(--font-montserrat)]">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !isSignedIn || !smsConsent || !isValidPhone(phone) || (applicantType === "vendor" && (!expectedBillRate.trim() || !availabilityDate))}
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
