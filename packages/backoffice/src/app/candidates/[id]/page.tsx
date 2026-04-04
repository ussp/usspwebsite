"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import StatusBadge from "@/components/StatusBadge";
import Tooltip from "@/components/Tooltip";
import OnboardingChecklist from "@/components/OnboardingChecklist";

interface Candidate {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  profile_picture: string | null;
  candidate_type: string;
  current_status: string;
  source: string;
  tags: string[];
  summary: string | null;
  location: string | null;
  work_preference: string | null;
  salary_expectation_min: number | null;
  salary_expectation_max: number | null;
  salary_type: string | null;
  created_at: string;
  updated_at: string | null;
}

interface Certification {
  id: string;
  candidate_id: string;
  certification_name: string;
  issuing_organization: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  source: string;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

interface PiiData {
  id?: string;
  ssn: string | null;
  dl_number: string | null;
  dl_state: string | null;
  dob: string | null;
  visa_type: string | null;
  visa_doc_path: string | null;
  visa_doc_name: string | null;
}

interface CandidateApplication {
  id: string;
  job_title: string;
  status: string;
  created_at: string;
}

interface OnboardingRecord {
  id: string;
  candidate_id: string;
  application_id: string;
  status: "in_progress" | "completed";
  i9_everify: string;
  background_check: string;
  orientation_training: string;
  started_at: string;
  completed_at: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  internal_employee: "bg-blue-100 text-blue-700",
  external: "bg-gray-100 text-gray-700",
  vendor: "bg-purple-100 text-purple-700",
};

const TYPE_LABELS: Record<string, string> = {
  internal_employee: "Internal",
  external: "External",
  vendor: "Vendor",
};

const VISA_TYPES = [
  { value: "H1B", label: "H-1B" },
  { value: "L1", label: "L-1" },
  { value: "OPT", label: "OPT" },
  { value: "CPT", label: "CPT" },
  { value: "GC", label: "Green Card" },
  { value: "citizen", label: "US Citizen" },
  { value: "EAD", label: "EAD" },
  { value: "other", label: "Other" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [pii, setPii] = useState<PiiData>({
    ssn: null,
    dl_number: null,
    dl_state: null,
    dob: null,
    visa_type: null,
    visa_doc_path: null,
    visa_doc_name: null,
  });
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [piiAccessDenied, setPiiAccessDenied] = useState(false);
  const [showSsn, setShowSsn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Salary state
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryType, setSalaryType] = useState("annual");
  const [savingSalary, setSavingSalary] = useState(false);
  const [salaryMessage, setSalaryMessage] = useState<string | null>(null);

  // Certifications state
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddCert, setShowAddCert] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [certExpiryDate, setCertExpiryDate] = useState("");
  const [certCredentialId, setCertCredentialId] = useState("");
  const [addingCert, setAddingCert] = useState(false);

  // Onboarding state
  const [onboardings, setOnboardings] = useState<OnboardingRecord[]>([]);

  // Form state for editing
  const [formSsn, setFormSsn] = useState("");
  const [formDlNumber, setFormDlNumber] = useState("");
  const [formDlState, setFormDlState] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formVisaType, setFormVisaType] = useState("");

  useEffect(() => {
    const id = params.id;

    Promise.all([
      fetch(`/api/candidates/${id}`).then((r) => r.json()),
      fetch(`/api/candidates/${id}/pii`).then((r) => {
        if (r.status === 403) {
          setPiiAccessDenied(true);
          return null;
        }
        return r.json();
      }),
    ]).then(([candidateData, piiData]) => {
      if (candidateData && !candidateData.error) {
        setCandidate(candidateData);
        setSalaryMin(candidateData.salary_expectation_min?.toString() || "");
        setSalaryMax(candidateData.salary_expectation_max?.toString() || "");
        setSalaryType(candidateData.salary_type || "annual");

        // Fetch all applications for this candidate (each job = separate record)
        fetch(`/api/applications/by-email?email=${encodeURIComponent(candidateData.email)}`)
          .then((r) => r.json())
          .then((apps) => {
            if (Array.isArray(apps)) setApplications(apps);
          });

        // Fetch certifications
        fetch(`/api/candidates/${id}/certifications`)
          .then((r) => r.json())
          .then((certs) => {
            if (Array.isArray(certs)) setCertifications(certs);
          });

        // Fetch onboarding records
        fetch(`/api/candidates/${id}/onboarding`)
          .then((r) => r.json())
          .then((obs) => {
            if (Array.isArray(obs)) setOnboardings(obs);
          });
      }
      if (piiData) {
        setPii(piiData);
        setFormSsn(piiData.ssn || "");
        setFormDlNumber(piiData.dl_number || "");
        setFormDlState(piiData.dl_state || "");
        setFormDob(piiData.dob || "");
        setFormVisaType(piiData.visa_type || "");
      }
      setLoading(false);
    });
  }, [params.id]);

  function formatSsn(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }

  function maskSsn(ssn: string): string {
    const digits = ssn.replace(/\D/g, "");
    if (digits.length < 4) return "***-**-****";
    return `***-**-${digits.slice(-4)}`;
  }

  async function handleSavePii() {
    setSaving(true);
    setSaveMessage(null);
    const body: Record<string, string | null> = {};

    const ssnDigits = formSsn.replace(/\D/g, "");
    if (ssnDigits !== (pii.ssn || "")) body.ssn = ssnDigits || null;
    if (formDlNumber !== (pii.dl_number || "")) body.dl_number = formDlNumber || null;
    if (formDlState !== (pii.dl_state || "")) body.dl_state = formDlState || null;
    if (formDob !== (pii.dob || "")) body.dob = formDob || null;
    if (formVisaType !== (pii.visa_type || "")) body.visa_type = formVisaType || null;

    if (Object.keys(body).length === 0) {
      setSaving(false);
      setSaveMessage("No changes to save");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const res = await fetch(`/api/candidates/${params.id}/pii`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // Refresh PII data
      const updated = await fetch(`/api/candidates/${params.id}/pii`).then((r) =>
        r.json()
      );
      setPii(updated);
      setFormSsn(updated.ssn || "");
      setFormDlNumber(updated.dl_number || "");
      setFormDlState(updated.dl_state || "");
      setFormDob(updated.dob || "");
      setFormVisaType(updated.visa_type || "");
      setSaveMessage("Saved successfully");
    } else {
      const err = await res.json();
      setSaveMessage(`Error: ${err.error || "Failed to save"}`);
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  }

  async function handleVisaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get signed upload URL
      const urlRes = await fetch(`/api/candidates/${params.id}/pii/upload`, {
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
        alert(err.error || "Failed to get upload URL");
        setUploading(false);
        return;
      }

      const { signedUrl, token, path } = await urlRes.json();

      // Upload file to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        alert("Failed to upload file");
        setUploading(false);
        return;
      }

      // Save the file path to PII record
      const saveRes = await fetch(`/api/candidates/${params.id}/pii`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visa_doc_path: path,
          visa_doc_name: file.name,
        }),
      });

      if (saveRes.ok) {
        setPii((prev) => ({ ...prev, visa_doc_path: path, visa_doc_name: file.name }));
        setSaveMessage("Visa document uploaded");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSaveSalary() {
    setSavingSalary(true);
    setSalaryMessage(null);
    const res = await fetch(`/api/candidates/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salary_expectation_min: salaryMin ? parseInt(salaryMin) : null,
        salary_expectation_max: salaryMax ? parseInt(salaryMax) : null,
        salary_type: salaryType,
      }),
    });
    if (res.ok) {
      setSalaryMessage("Saved");
    } else {
      const err = await res.json();
      setSalaryMessage(`Error: ${err.error || "Failed to save"}`);
    }
    setSavingSalary(false);
    setTimeout(() => setSalaryMessage(null), 3000);
  }

  async function handleAddCertification() {
    if (!certName.trim()) return;
    setAddingCert(true);
    const res = await fetch(`/api/candidates/${params.id}/certifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        certification_name: certName,
        issuing_organization: certIssuer || undefined,
        issue_date: certIssueDate || undefined,
        expiry_date: certExpiryDate || undefined,
        credential_id: certCredentialId || undefined,
        source: "recruiter_added",
      }),
    });
    if (res.ok) {
      const cert = await res.json();
      setCertifications((prev) => [cert, ...prev]);
      setCertName("");
      setCertIssuer("");
      setCertIssueDate("");
      setCertExpiryDate("");
      setCertCredentialId("");
      setShowAddCert(false);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to add certification");
    }
    setAddingCert(false);
  }

  async function handleVerifyCert(certId: string) {
    const res = await fetch(`/api/candidates/${params.id}/certifications/${certId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify" }),
    });
    if (res.ok) {
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === certId ? { ...c, verified: true, verified_at: new Date().toISOString() } : c
        )
      );
    }
  }

  async function handleOnboardingStepChange(
    onboardingId: string,
    step: string,
    status: string
  ) {
    const res = await fetch(`/api/candidates/${params.id}/onboarding/${onboardingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setOnboardings((prev) =>
        prev.map((o) => {
          if (o.id !== onboardingId) return o;
          return {
            ...o,
            [step]: status,
            status: data.completed ? "completed" : "in_progress",
            completed_at: data.completed ? new Date().toISOString() : null,
          };
        })
      );
    }
  }

  async function handleDeleteCert(certId: string) {
    if (!confirm("Remove this certification?")) return;
    const res = await fetch(`/api/candidates/${params.id}/certifications/${certId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCertifications((prev) => prev.filter((c) => c.id !== certId));
    }
  }

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

  if (!candidate) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-red-600">Candidate not found</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-start gap-4">
                {candidate.profile_picture ? (
                  <img
                    src={candidate.profile_picture}
                    alt=""
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    {candidate.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{candidate.full_name}</h2>
                  <p className="text-dark/60">{candidate.email}</p>
                  {candidate.phone && (
                    <p className="text-dark/60 text-sm">{candidate.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                      TYPE_COLORS[candidate.candidate_type] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {TYPE_LABELS[candidate.candidate_type] || candidate.candidate_type}
                  </span>
                  <StatusBadge status={candidate.current_status} />
                </div>
              </div>
              {candidate.summary && (
                <p className="mt-3 text-sm text-dark/70">{candidate.summary}</p>
              )}
            </div>

            {/* Salary Expectations Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold">Salary Expectations</h3>
                <Tooltip text="Used for rate matching against position salary ranges (7% weight in match scoring)" position="right">
                  <svg className="w-4 h-4 text-dark/30 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-dark/50 mb-1">Min</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-dark/40 text-sm">$</span>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dark/50 mb-1">Max</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-dark/40 text-sm">$</span>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dark/50 mb-1">Type</label>
                  <select
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value)}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="annual">Annual</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSaveSalary}
                  disabled={savingSalary}
                  className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {savingSalary ? "Saving..." : "Save"}
                </button>
                {salaryMessage && (
                  <span className={`text-sm ${salaryMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                    {salaryMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="font-semibold">Certifications ({certifications.length})</h3>
                  <Tooltip text="Professional certifications used for position matching (8% weight). Verify to confirm the candidate holds this cert." position="right">
                    <svg className="w-4 h-4 text-dark/30 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Tooltip>
                </div>
                <button
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {showAddCert ? "Cancel" : "+ Add"}
                </button>
              </div>

              {/* Add Certification Form */}
              {showAddCert && (
                <div className="mb-4 p-4 bg-light-gray/30 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="Certification name (e.g., AWS Solutions Architect)"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Issuing organization (e.g., Amazon Web Services)"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-dark/50 mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={certIssueDate}
                        onChange={(e) => setCertIssueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dark/50 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={certExpiryDate}
                        onChange={(e) => setCertExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dark/50 mb-1">Credential ID</label>
                      <input
                        type="text"
                        value={certCredentialId}
                        onChange={(e) => setCertCredentialId(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddCertification}
                    disabled={addingCert || !certName.trim()}
                    className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {addingCert ? "Adding..." : "Add Certification"}
                  </button>
                </div>
              )}

              {/* Certifications List */}
              {certifications.length > 0 ? (
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-start justify-between p-3 bg-light-gray/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{cert.certification_name}</p>
                          {cert.verified ? (
                            <Tooltip text="A recruiter has confirmed this certification is valid" position="top">
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                Verified
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip text="This certification has not been verified by a recruiter yet" position="top">
                              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                Unverified
                              </span>
                            </Tooltip>
                          )}
                          {cert.source === "extracted" && (
                            <Tooltip text="Automatically extracted from the candidate's resume" position="top">
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                From Resume
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        {cert.issuing_organization && (
                          <p className="text-xs text-dark/50 mt-0.5">{cert.issuing_organization}</p>
                        )}
                        <div className="flex gap-3 mt-1 text-xs text-dark/40">
                          {cert.issue_date && (
                            <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                          )}
                          {cert.expiry_date && (
                            <span
                              className={
                                new Date(cert.expiry_date) < new Date()
                                  ? "text-red-500"
                                  : ""
                              }
                            >
                              Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                            </span>
                          )}
                          {cert.credential_id && (
                            <span>ID: {cert.credential_id}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!cert.verified && (
                          <Tooltip text="Mark this certification as verified" position="top">
                            <button
                              onClick={() => handleVerifyCert(cert.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </Tooltip>
                        )}
                        <Tooltip text="Remove this certification" position="top">
                          <button
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark/40">No certifications added</p>
              )}
            </div>

            {/* PII Documents Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-semibold">Identity Documents</h3>
                <Tooltip text="All PII data is encrypted with AES-256-GCM at the application level before storage" position="right">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full cursor-help">
                    Encrypted
                  </span>
                </Tooltip>
              </div>

              {piiAccessDenied ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-dark/20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-dark/40">Access restricted — insufficient permissions</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* SSN */}
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">
                      Social Security Number (SSN)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showSsn ? "text" : "password"}
                          value={showSsn ? formatSsn(formSsn) : formSsn ? maskSsn(formSsn) : ""}
                          onChange={(e) => {
                            if (showSsn) {
                              setFormSsn(e.target.value.replace(/\D/g, "").slice(0, 9));
                            }
                          }}
                          readOnly={!showSsn}
                          placeholder="Enter SSN"
                          className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSsn(!showSsn)}
                        className="px-3 py-2 text-sm border border-light-gray rounded-lg hover:bg-light-gray transition-colors"
                      >
                        {showSsn ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Driver's License */}
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">
                      Driver&apos;s License
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={formDlNumber}
                          onChange={(e) => setFormDlNumber(e.target.value)}
                          placeholder="License number"
                          className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <select
                        value={formDlState}
                        onChange={(e) => setFormDlState(e.target.value)}
                        className="px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">State</option>
                        {US_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Visa / Work Authorization */}
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">
                      Visa / Work Authorization
                    </label>
                    <select
                      value={formVisaType}
                      onChange={(e) => setFormVisaType(e.target.value)}
                      className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                    >
                      <option value="">Select type...</option>
                      {VISA_TYPES.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>

                    {/* Visa Document Upload */}
                    <div className="mt-2">
                      {pii.visa_doc_name ? (
                        <div className="flex items-center gap-3 p-3 bg-light-gray/50 rounded-lg">
                          <svg className="w-6 h-6 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm flex-1">{pii.visa_doc_name}</span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-primary hover:underline"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-light-gray rounded-lg text-sm text-dark/50 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          {uploading ? "Uploading..." : "Upload visa document (PDF, PNG, JPG)"}
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleVisaUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSavePii}
                      disabled={saving}
                      className="px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    {saveMessage && (
                      <span className={`text-sm ${saveMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Info — Editable */}
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h3 className="font-semibold mb-3">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <Tooltip text="Internal = USSP employee, External = outside candidate, Vendor = subcontractor" position="left">
                    <label className="block text-dark/50 text-xs mb-1 cursor-help">Type</label>
                  </Tooltip>
                  <select
                    value={candidate.candidate_type}
                    onChange={async (e) => {
                      const newType = e.target.value;
                      const res = await fetch(`/api/candidates/${params.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ candidate_type: newType }),
                      });
                      if (res.ok) {
                        setCandidate((prev) =>
                          prev ? { ...prev, candidate_type: newType } : prev
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="internal_employee">Internal Employee</option>
                    <option value="external">External</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div>
                  <Tooltip text="Available = open to work / bench, Employed = currently placed, On Assignment = active engagement" position="left">
                    <label className="block text-dark/50 text-xs mb-1 cursor-help">Status</label>
                  </Tooltip>
                  <select
                    value={candidate.current_status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const res = await fetch(`/api/candidates/${params.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ current_status: newStatus }),
                      });
                      if (res.ok) {
                        setCandidate((prev) =>
                          prev ? { ...prev, current_status: newStatus } : prev
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="available">Available (Bench)</option>
                    <option value="employed">Employed</option>
                    <option value="on_assignment">On Assignment</option>
                    <option value="not_looking">Not Looking</option>
                    <option value="blacklisted">Blacklisted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-dark/50 text-xs mb-1">Location</label>
                  <input
                    type="text"
                    defaultValue={candidate.location || ""}
                    placeholder="e.g. Chicago, IL"
                    onBlur={async (e) => {
                      const newLoc = e.target.value.trim() || null;
                      if (newLoc === (candidate.location || "")) return;
                      const res = await fetch(`/api/candidates/${params.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ location: newLoc }),
                      });
                      if (res.ok) {
                        setCandidate((prev) =>
                          prev ? { ...prev, location: newLoc } : prev
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <Tooltip text="Candidate's preferred work arrangement — used for matching against position work mode" position="left">
                    <label className="block text-dark/50 text-xs mb-1 cursor-help">Work Preference</label>
                  </Tooltip>
                  <select
                    value={candidate.work_preference || ""}
                    onChange={async (e) => {
                      const val = e.target.value || null;
                      const res = await fetch(`/api/candidates/${params.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ work_preference: val }),
                      });
                      if (res.ok) {
                        setCandidate((prev) =>
                          prev ? { ...prev, work_preference: val } : prev
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Not specified</option>
                    <option value="remote">Remote Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="open_to_travel">Open to Travel</option>
                  </select>
                </div>
                <div>
                  <Tooltip text="How this candidate entered the system" position="left">
                    <label className="block text-dark/50 text-xs mb-1 cursor-help">Source</label>
                  </Tooltip>
                  <select
                    value={candidate.source}
                    onChange={async (e) => {
                      const newSource = e.target.value;
                      const res = await fetch(`/api/candidates/${params.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ source: newSource }),
                      });
                      if (res.ok) {
                        setCandidate((prev) =>
                          prev ? { ...prev, source: newSource } : prev
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="internal">Internal</option>
                    <option value="referral">Referral</option>
                    <option value="application">Application</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-dark/50">Added</span>
                  <span>{new Date(candidate.created_at).toLocaleDateString()}</span>
                </div>
                {candidate.tags.length > 0 && (
                  <div>
                    <span className="text-dark/50 block mb-1">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-light-gray px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h3 className="font-semibold mb-3">
                Applications ({applications.length})
              </h3>
              {applications.length > 0 ? (
                <div className="space-y-2">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => router.push(`/applications/${app.id}`)}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-light-gray transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{app.job_title}</p>
                        <p className="text-xs text-dark/50">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={app.status || "new"} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark/40">No applications</p>
              )}
            </div>

            {/* Onboarding */}
            {onboardings.length > 0 && (
              <div className="bg-white rounded-lg border border-light-gray p-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">Onboarding</h3>
                  <Tooltip text="Post-hire checklist auto-created when an application reaches Hired" position="right">
                    <svg className="w-4 h-4 text-dark/30 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Tooltip>
                </div>
                {onboardings.map((ob) => {
                  const linkedApp = applications.find((a) => a.id === ob.application_id);
                  return (
                    <div key={ob.id} className="mb-4 last:mb-0">
                      {linkedApp && (
                        <p className="text-xs text-dark/50 mb-2">
                          For: {linkedApp.job_title}
                        </p>
                      )}
                      <OnboardingChecklist
                        onboarding={ob}
                        onStepChange={handleOnboardingStepChange}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
