"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface Position {
  id: string;
  title: string;
  slug: string;
  active: boolean;
  location: string;
  type: string;
}

export default function NewApplicationPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [positionId, setPositionId] = useState("");
  const [applicantType, setApplicantType] = useState<"employee" | "vendor">("employee");
  const [expectedBillRate, setExpectedBillRate] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");

  // Resume upload
  const [resumePath, setResumePath] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/positions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPositions(data);
        setLoading(false);
      });
  }, []);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (![".pdf", ".doc", ".docx"].includes(ext)) {
      setUploadError("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { signedUrl, path } = await res.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type, "x-upsert": "true" },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      setResumePath(path);
      setResumeName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setResumeName("");
      setResumePath("");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid phone number (10+ digits).");
      return;
    }

    if (!positionId) {
      setError("Please select a position.");
      return;
    }

    const selectedPosition = positions.find((p) => p.id === positionId);
    if (!selectedPosition) {
      setError("Invalid position selected.");
      return;
    }

    if (applicantType === "vendor" && !expectedBillRate.trim()) {
      setError("Expected bill rate is required for vendor submissions.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: digits,
          jobTitle: selectedPosition.title,
          jobSlug: selectedPosition.slug,
          resumePath: resumePath || null,
          resumeName: resumeName || null,
          applicantType,
          expectedBillRate: applicantType === "vendor" ? expectedBillRate : null,
          availabilityDate: applicantType === "vendor" ? availabilityDate : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create application");
      }

      const data = await res.json();
      router.push(`/applications/${data.applicationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/50">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-dark/50 hover:text-dark mb-4 inline-block"
        >
          &larr; Back
        </button>

        <h2 className="text-xl font-bold mb-6">New Application</h2>
        <p className="text-sm text-dark/50 mb-6">
          Manually create an application on behalf of a candidate (no LinkedIn sign-in required).
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Candidate Info */}
          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h3 className="font-semibold">Candidate Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(312) 555-0100"
                maxLength={14}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-w-xs"
              />
            </div>
          </div>

          {/* Position Selection */}
          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h3 className="font-semibold">Position</h3>

            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">
                Select Position <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={positionId}
                onChange={(e) => setPositionId(e.target.value)}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Choose a position...</option>
                {positions.filter((p) => p.active).length > 0 && (
                  <optgroup label="Active Positions">
                    {positions
                      .filter((p) => p.active)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — {p.location} ({p.type})
                        </option>
                      ))}
                  </optgroup>
                )}
                {positions.filter((p) => !p.active).length > 0 && (
                  <optgroup label="Closed Positions">
                    {positions
                      .filter((p) => !p.active)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — {p.location} ({p.type})
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Applicant Type */}
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-2">
                Applicant Type
              </label>
              <div className="flex rounded-lg border border-light-gray overflow-hidden w-fit">
                <button
                  type="button"
                  onClick={() => setApplicantType("employee")}
                  className={`px-4 py-2 text-sm transition-colors ${
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
                  className={`px-4 py-2 text-sm transition-colors ${
                    applicantType === "vendor"
                      ? "bg-primary text-white"
                      : "bg-white text-dark/60 hover:bg-dark/5"
                  }`}
                >
                  Vendor
                </button>
              </div>
            </div>

            {applicantType === "vendor" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark/70 mb-1">
                    Expected Bill Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expectedBillRate}
                    onChange={(e) => setExpectedBillRate(e.target.value)}
                    placeholder="e.g. $85/hr"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark/70 mb-1">
                    Availability Date
                  </label>
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h3 className="font-semibold">Resume</h3>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                resumeName
                  ? "border-green-300 bg-green-50"
                  : "border-light-gray hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm text-dark/60">Uploading...</span>
                </div>
              ) : resumeName ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800">{resumeName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeName("");
                      setResumePath("");
                    }}
                    className="ml-2 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="w-8 h-8 mx-auto text-dark/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-dark/60">
                    Click to upload resume, or drag & drop
                  </p>
                  <p className="text-xs text-dark/40 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Error & Submit */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white text-sm rounded-lg transition-colors"
            >
              {submitting ? "Creating..." : "Create Application"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-light-gray text-sm rounded-lg hover:bg-light-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
