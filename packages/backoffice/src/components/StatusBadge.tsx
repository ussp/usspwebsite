import Tooltip from "./Tooltip";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  phone_screen: "bg-purple-100 text-purple-800",
  interview_zoom: "bg-indigo-100 text-indigo-800",
  interview_in_person: "bg-violet-100 text-violet-800",
  employment_verification: "bg-cyan-100 text-cyan-800",
  references: "bg-teal-100 text-teal-800",
  clearances: "bg-sky-100 text-sky-800",
  offer_pending: "bg-amber-100 text-amber-800",
  onboarding: "bg-lime-100 text-lime-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
  // Candidate statuses
  available: "bg-emerald-100 text-emerald-800",
  employed: "bg-blue-100 text-blue-800",
  on_assignment: "bg-amber-100 text-amber-800",
  not_looking: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  phone_screen: "Phone Screen",
  interview_zoom: "Zoom Interview",
  interview_in_person: "Client/In-Person",
  employment_verification: "Verification",
  references: "References",
  clearances: "Clearances",
  offer_pending: "Offer Pending",
  onboarding: "Onboarding",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  // Candidate statuses
  available: "Available",
  employed: "Employed",
  on_assignment: "On Assignment",
  not_looking: "Not Looking",
};

const STATUS_TOOLTIPS: Record<string, string> = {
  new: "Application just received — awaiting initial review",
  phone_screen: "Initial phone call to assess basic fit and availability",
  interview_zoom: "Remote video interview with hiring team",
  interview_in_person: "On-site or face-to-face interview",
  employment_verification: "Verifying past employment history and credentials",
  references: "Contacting professional references",
  clearances: "Background check, security clearance, or drug screening",
  offer_pending: "Offer extended — awaiting candidate response",
  onboarding: "Offer accepted — completing paperwork and setup",
  hired: "Candidate is fully onboarded and placed",
  rejected: "Application was declined",
  withdrawn: "Candidate withdrew their application",
  available: "Candidate is open to new opportunities",
  employed: "Currently employed",
  on_assignment: "Currently placed on an active assignment",
  not_looking: "Not actively seeking new opportunities",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-dark/10 text-dark/60";
  const tooltip = STATUS_TOOLTIPS[status];
  const badge = (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${style}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );

  if (tooltip) {
    return <Tooltip text={tooltip}>{badge}</Tooltip>;
  }
  return badge;
}
