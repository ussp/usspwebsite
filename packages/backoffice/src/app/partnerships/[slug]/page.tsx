export const dynamic = "force-dynamic";

import Link from "next/link";
import { connection } from "next/server";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { getPartnerBySlug, type Partner } from "@/lib/partners";

const typeBadgeColors: Record<Partner["type"], string> = {
  prime_vendor: "bg-blue-100 text-blue-700",
  technology: "bg-purple-100 text-purple-700",
  investment: "bg-green-100 text-green-700",
  reseller: "bg-amber-100 text-amber-700",
  advisory: "bg-cyan-100 text-cyan-700",
};

const typeLabels: Record<Partner["type"], string> = {
  prime_vendor: "Prime Vendor",
  technology: "Technology",
  investment: "Investment",
  reseller: "Reseller",
  advisory: "Advisory",
};

const statusBadgeColors: Record<Partner["status"], string> = {
  active: "bg-green-100 text-green-700",
  in_conversation: "bg-amber-100 text-amber-700",
  potential: "bg-blue-100 text-blue-600",
  inactive: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<Partner["status"], string> = {
  active: "Active",
  in_conversation: "In Conversation",
  potential: "Potential",
  inactive: "Inactive",
};

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <div className="max-w-5xl">
            <Link
              href="/partnerships"
              className="text-sm text-primary hover:underline mb-4 inline-block"
            >
              &larr; Back to Partnerships
            </Link>
            <div className="rounded-lg border border-light-gray bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-dark mb-2">
                Partner not found
              </h2>
              <p className="text-dark/60 text-sm">
                No partner exists with slug &ldquo;{slug}&rdquo;.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const firstDocument = partner.documents[0] ?? null;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="max-w-5xl space-y-5">
          {/* Back link */}
          <Link
            href="/partnerships"
            className="text-sm text-primary hover:underline inline-block"
          >
            &larr; Back to Partnerships
          </Link>

          {/* Header Card */}
          <div className="rounded-lg border border-light-gray bg-white p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-dark mb-2">
                  {partner.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeBadgeColors[partner.type]}`}
                  >
                    {typeLabels[partner.type]}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeColors[partner.status]}`}
                  >
                    {statusLabels[partner.status]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm border border-light-gray rounded-lg text-dark hover:bg-light-gray transition-colors"
                  >
                    Visit Website &rarr;
                  </a>
                )}
                {firstDocument && (
                  <a
                    href={firstDocument.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Download Presentation
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="rounded-lg border border-light-gray bg-white p-6">
            <h2 className="text-lg font-bold text-dark mb-3">About</h2>
            <p className="text-sm text-dark/80 leading-relaxed">
              {partner.about}
            </p>
          </div>

          {/* USSP Enrollment Documents */}
          {partner.enrollmentDocuments.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-1">
                USSP Enrollment Status
              </h2>
              <p className="text-xs text-dark/50 mb-4">
                Company-level documents USSP must maintain to remain an active subcontractor with {partner.shortName}.
              </p>
              <div className="space-y-2">
                {partner.enrollmentDocuments.map((doc, i) => {
                  const statusColors: Record<string, string> = {
                    on_file: "bg-green-100 text-green-700",
                    expired: "bg-red-100 text-red-700",
                    pending: "bg-yellow-100 text-yellow-700",
                    not_started: "bg-gray-100 text-gray-500",
                  };
                  const statusLabels: Record<string, string> = {
                    on_file: "On File",
                    expired: "Expired",
                    pending: "Pending",
                    not_started: "Not Started",
                  };
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-light-gray/30"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${doc.status === "on_file" ? "bg-green-500" : doc.status === "expired" ? "bg-red-500" : doc.status === "pending" ? "bg-yellow-500" : "bg-gray-300"}`} />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <p className="text-xs text-dark/50 ml-4 mt-0.5">{doc.description}</p>
                        {doc.notes && (
                          <p className="text-xs text-amber-600 ml-4 mt-0.5">{doc.notes}</p>
                        )}
                        {doc.expiryDate && (
                          <p className={`text-xs ml-4 mt-0.5 ${new Date(doc.expiryDate) < new Date() ? "text-red-600 font-medium" : "text-dark/40"}`}>
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[doc.status] || ""}`}>
                        {statusLabels[doc.status] || doc.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contract Process */}
          {partner.contractProcess.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-3">
                Contract Process
              </h2>
              <ol className="space-y-2">
                {partner.contractProcess.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-dark/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Submission Requirements */}
          {partner.submissionRequirements.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-1">
                Submission Requirements
              </h2>
              <p className="text-xs text-dark/50 mb-3">
                What you need before submitting a candidate
              </p>
              <ul className="space-y-2">
                {partner.submissionRequirements.map((req, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <svg
                      className="shrink-0 w-5 h-5 text-green-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-dark/80">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Onboarding Requirements */}
          {partner.onboardingRequirements.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-1">
                Onboarding Requirements
              </h2>
              <p className="text-xs text-dark/50 mb-3">
                Required for consultant onboarding
              </p>
              <ul className="space-y-2">
                {partner.onboardingRequirements.map((req, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <svg
                      className="shrink-0 w-5 h-5 text-green-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-dark/80">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Invoicing & Billing */}
          {(partner.invoicing.emails.length > 0 ||
            partner.invoicing.notes.length > 0) && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-3">
                Invoicing &amp; Billing
              </h2>
              <div className="space-y-3 text-sm">
                {partner.invoicing.emails.length > 0 && (
                  <div>
                    <span className="font-medium text-dark/70 text-xs uppercase tracking-wide">
                      Invoice Emails
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {partner.invoicing.emails.map((email) => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="text-primary hover:underline"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="font-medium text-dark/70 text-xs uppercase tracking-wide">
                    Frequency
                  </span>
                  <p className="mt-1 text-dark/80">{partner.invoicing.frequency}</p>
                </div>
                {partner.invoicing.notes.length > 0 && (
                  <div>
                    <span className="font-medium text-dark/70 text-xs uppercase tracking-wide">
                      Notes
                    </span>
                    <ul className="mt-1 space-y-1">
                      {partner.invoicing.notes.map((note, i) => (
                        <li key={i} className="text-dark/80">
                          &bull; {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Contacts */}
          {partner.contacts.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-3">Key Contacts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partner.contacts.map((contact, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-light-gray p-4"
                  >
                    <p className="font-medium text-sm text-dark">
                      {contact.name}
                    </p>
                    <p className="text-xs text-dark/50 mt-0.5">
                      {contact.role}
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <p className="text-xs text-dark/60 mt-0.5">
                        {contact.phone}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {partner.documents.length > 0 && (
            <div className="rounded-lg border border-light-gray bg-white p-6">
              <h2 className="text-lg font-bold text-dark mb-3">Documents</h2>
              <ul className="space-y-2">
                {partner.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="shrink-0 w-5 h-5 text-primary mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <a
                        href={doc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {doc.name}
                      </a>
                      <p className="text-xs text-dark/50 mt-0.5">
                        {doc.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
