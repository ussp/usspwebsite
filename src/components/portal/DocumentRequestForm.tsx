"use client";

import { useState, useRef } from "react";

interface DocumentRequestData {
  id: string;
  request_type: string;
  status: string;
  description: string | null;
  due_date: string | null;
  min_references: number | null;
  submitted_at: string | null;
  job_title?: string;
}

interface Props {
  request: DocumentRequestData;
  onSubmitted: () => void;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface ReferenceEntry {
  ref_name: string;
  ref_title: string;
  ref_company: string;
  ref_phone: string;
  ref_email: string;
  relationship: string;
}

export default function DocumentRequestForm({ request, onSubmitted }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SSN
  const [ssn, setSsn] = useState("");
  // DOB
  const [dob, setDob] = useState("");
  // Driver's License
  const [dlNumber, setDlNumber] = useState("");
  const [dlState, setDlState] = useState("");
  // Background check
  const [bgConsent, setBgConsent] = useState(false);
  // References
  const [references, setReferences] = useState<ReferenceEntry[]>(
    Array.from({ length: request.min_references || 2 }, () => ({
      ref_name: "",
      ref_title: "",
      ref_company: "",
      ref_phone: "",
      ref_email: "",
      relationship: "",
    }))
  );

  function formatSsnInput(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }

  async function uploadFile(file: File): Promise<{ path: string; fileName: string } | null> {
    // Get signed URL
    const urlRes = await fetch("/api/portal/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });
    if (!urlRes.ok) {
      const err = await urlRes.json();
      setError(err.error || "Failed to get upload URL");
      return null;
    }

    const { signedUrl, path } = await urlRes.json();

    // Upload to Supabase
    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-upsert": "true" },
      body: file,
    });
    if (!uploadRes.ok) {
      setError("Failed to upload file");
      return null;
    }

    return { path, fileName: file.name };
  }

  async function handleSubmitText(text: string, dlStateValue?: string) {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/portal/requests/${request.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submitted_text: text,
        submitted_dl_state: dlStateValue,
      }),
    });
    if (res.ok) {
      onSubmitted();
    } else {
      const err = await res.json();
      setError(err.error || "Submission failed");
    }
    setSubmitting(false);
  }

  async function handleSubmitFile(file: File) {
    setSubmitting(true);
    setError(null);
    const uploaded = await uploadFile(file);
    if (!uploaded) {
      setSubmitting(false);
      return;
    }
    const res = await fetch(`/api/portal/requests/${request.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submitted_path: uploaded.path,
        submitted_file_name: uploaded.fileName,
      }),
    });
    if (res.ok) {
      onSubmitted();
    } else {
      const err = await res.json();
      setError(err.error || "Submission failed");
    }
    setSubmitting(false);
  }

  async function handleSubmitReferences() {
    setSubmitting(true);
    setError(null);
    const validRefs = references.filter((r) => r.ref_name.trim());
    if (validRefs.length < (request.min_references || 1)) {
      setError(`Please provide at least ${request.min_references || 1} reference(s)`);
      setSubmitting(false);
      return;
    }
    const res = await fetch(`/api/portal/requests/${request.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ references: validRefs }),
    });
    if (res.ok) {
      onSubmitted();
    } else {
      const err = await res.json();
      setError(err.error || "Submission failed");
    }
    setSubmitting(false);
  }

  function updateReference(index: number, field: keyof ReferenceEntry, value: string) {
    setReferences((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  if (request.status === "submitted") {
    return (
      <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        Submitted — awaiting review
      </div>
    );
  }
  if (request.status === "approved") {
    return (
      <div className="p-4 bg-green-50 rounded-lg text-sm text-green-700">
        Approved
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {/* SSN */}
      {request.request_type === "ssn" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Social Security Number</label>
          <input
            type="text"
            value={formatSsnInput(ssn)}
            onChange={(e) => setSsn(e.target.value.replace(/\D/g, "").slice(0, 9))}
            placeholder="XXX-XX-XXXX"
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
            maxLength={11}
          />
          <button
            onClick={() => handleSubmitText(ssn.replace(/\D/g, ""))}
            disabled={ssn.replace(/\D/g, "").length !== 9 || submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {/* DOB */}
      {request.request_type === "dob" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <button
            onClick={() => handleSubmitText(dob)}
            disabled={!dob || submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {/* Driver's License */}
      {request.request_type === "drivers_license" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Driver&apos;s License</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                type="text"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value)}
                placeholder="License number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <select
              value={dlState}
              onChange={(e) => setDlState(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">State</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500">
            You may also upload a photo of your license (optional)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="text-sm"
          />
          <button
            onClick={async () => {
              if (!dlNumber || !dlState) {
                setError("License number and state are required");
                return;
              }
              const file = fileInputRef.current?.files?.[0];
              if (file) {
                // Upload file first, then submit text + file path
                setSubmitting(true);
                setError(null);
                const uploaded = await uploadFile(file);
                const res = await fetch(`/api/portal/requests/${request.id}/submit`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    submitted_text: dlNumber,
                    submitted_dl_state: dlState,
                    submitted_path: uploaded?.path,
                    submitted_file_name: uploaded?.fileName,
                  }),
                });
                if (res.ok) onSubmitted();
                else {
                  const err = await res.json();
                  setError(err.error || "Submission failed");
                }
                setSubmitting(false);
              } else {
                await handleSubmitText(dlNumber, dlState);
              }
            }}
            disabled={!dlNumber || !dlState || submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {/* Visa Document */}
      {request.request_type === "visa_document" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Work Authorization Document</label>
          <p className="text-xs text-gray-500">Upload a copy of your visa or work authorization (PDF, PNG, JPG)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="text-sm"
          />
          <button
            onClick={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) handleSubmitFile(file);
              else setError("Please select a file");
            }}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload & Submit"}
          </button>
        </div>
      )}

      {/* Background Check Consent */}
      {request.request_type === "background_check_consent" && (
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Background Check Authorization</p>
            <p>
              I hereby authorize US Software Professionals Inc. (USSP) to conduct a
              background investigation, which may include verification of employment
              history, education, criminal records, and professional references. I
              understand this information will be used solely for employment purposes.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={bgConsent}
              onChange={(e) => setBgConsent(e.target.checked)}
              className="rounded"
            />
            I agree to the background check authorization
          </label>
          <button
            onClick={() => handleSubmitText("CONSENT_GRANTED")}
            disabled={!bgConsent || submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Consent"}
          </button>
        </div>
      )}

      {/* References */}
      {request.request_type === "references" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Professional References (minimum {request.min_references || 2})
          </label>
          {references.map((ref, i) => (
            <div key={i} className="p-3 border rounded-lg space-y-2">
              <p className="text-xs font-medium text-gray-500">Reference {i + 1}</p>
              <input
                type="text"
                value={ref.ref_name}
                onChange={(e) => updateReference(i, "ref_name", e.target.value)}
                placeholder="Full name *"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={ref.ref_title}
                  onChange={(e) => updateReference(i, "ref_title", e.target.value)}
                  placeholder="Job title"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={ref.ref_company}
                  onChange={(e) => updateReference(i, "ref_company", e.target.value)}
                  placeholder="Company"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={ref.ref_phone}
                  onChange={(e) => updateReference(i, "ref_phone", e.target.value)}
                  placeholder="Phone"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="email"
                  value={ref.ref_email}
                  onChange={(e) => updateReference(i, "ref_email", e.target.value)}
                  placeholder="Email"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                value={ref.relationship}
                onChange={(e) => updateReference(i, "relationship", e.target.value)}
                placeholder="Relationship (e.g., Former Manager)"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setReferences((prev) => [
                ...prev,
                { ref_name: "", ref_title: "", ref_company: "", ref_phone: "", ref_email: "", relationship: "" },
              ])
            }
            className="text-sm text-primary hover:underline"
          >
            + Add another reference
          </button>
          <button
            onClick={handleSubmitReferences}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit References"}
          </button>
        </div>
      )}

      {/* Right to Represent */}
      {request.request_type === "right_to_represent" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Signed Right to Represent (RTR)</label>
          <p className="text-xs text-gray-500">Upload your signed RTR document (PDF, PNG, JPG)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="text-sm"
          />
          <button
            onClick={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) handleSubmitFile(file);
              else setError("Please select a file");
            }}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload & Submit"}
          </button>
        </div>
      )}

      {/* Identity Document */}
      {request.request_type === "identity_document" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Valid Identity Proof</label>
          <p className="text-xs text-gray-500">Upload a government-issued photo ID — passport, driver&apos;s license, or state ID (PDF, PNG, JPG)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="text-sm"
          />
          <button
            onClick={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) handleSubmitFile(file);
              else setError("Please select a file");
            }}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload & Submit"}
          </button>
        </div>
      )}

      {/* Fallback — other / any unhandled type */}
      {!["ssn", "dob", "drivers_license", "visa_document", "background_check_consent", "references", "right_to_represent", "identity_document"].includes(request.request_type) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {request.description || "Upload Required Document"}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="text-sm"
          />
          <button
            onClick={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) handleSubmitFile(file);
              else setError("Please select a file");
            }}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload & Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
