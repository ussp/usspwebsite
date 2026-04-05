"use client";

import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import { getPartnerByClientName } from "@/lib/partners";

interface PartnerRequirementsTooltipProps {
  clientName: string | null | undefined;
  type: "submission" | "onboarding" | "invoicing";
}

const TYPE_LABELS: Record<PartnerRequirementsTooltipProps["type"], string> = {
  submission: "Submission Requirements",
  onboarding: "Onboarding Requirements",
  invoicing: "Invoicing Details",
};

function getRequirementsList(
  partner: ReturnType<typeof getPartnerByClientName>,
  type: PartnerRequirementsTooltipProps["type"]
): string[] {
  if (!partner) return [];
  switch (type) {
    case "submission":
      return partner.submissionRequirements;
    case "onboarding":
      return partner.onboardingRequirements;
    case "invoicing":
      return partner.invoicing.notes;
  }
}

export default function PartnerRequirementsTooltip({
  clientName,
  type,
}: PartnerRequirementsTooltipProps) {
  if (!clientName) return null;

  const partner = getPartnerByClientName(clientName);
  if (!partner) return null;

  const requirements = getRequirementsList(partner, type);

  const tooltipContent = (
    <div className="space-y-1.5 min-w-[200px]">
      <p className="font-medium text-white/90">
        {partner.shortName} — {TYPE_LABELS[type]}
      </p>
      {requirements.length > 0 ? (
        <ul className="list-disc list-inside space-y-0.5 text-white/80">
          {requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      ) : (
        <p className="text-white/60 italic">No requirements listed yet</p>
      )}
      <Link
        href={`/partnerships/${partner.slug}`}
        className="inline-block mt-1 text-blue-300 hover:text-blue-200 underline"
      >
        View full details
      </Link>
    </div>
  );

  return (
    <Tooltip text={tooltipContent} position="right">
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold cursor-help ml-1.5 flex-shrink-0">
        i
      </span>
    </Tooltip>
  );
}
