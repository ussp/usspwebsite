// =============================================================================
// Partner Knowledge Base — Static configuration for all USSP partners
//
// Partner data changes infrequently. Storing as typed config (not database)
// keeps it version-controlled, reviewable in PRs, and easy to extend.
// =============================================================================

export interface PartnerContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface PartnerDocument {
  name: string;
  description: string;
  path: string;
}

export interface EnrollmentDocument {
  name: string;
  description: string;
  status: "on_file" | "expired" | "pending" | "not_started";
  expiryDate?: string; // ISO date — null if no expiry
  notes?: string;
}

export interface Partner {
  slug: string;
  name: string;
  shortName: string;
  logo?: string;
  status: "active" | "in_conversation" | "potential" | "inactive";
  type: "prime_vendor" | "technology" | "investment" | "reseller" | "advisory";
  about: string;
  website?: string;

  // Used to match this partner to positions/assignments via client name
  clientNames: string[];

  // USSP's own enrollment documents for this partner (company-level, not per-consultant)
  enrollmentDocuments: EnrollmentDocument[];

  contractProcess: string[];
  submissionRequirements: string[];
  onboardingRequirements: string[];
  invoicing: {
    emails: string[];
    frequency: string;
    notes: string[];
  };
  contacts: PartnerContact[];
  documents: PartnerDocument[];

  // Tooltip-ready summaries for inline display in recruiter workflow
  tooltips: {
    submission: string;
    onboarding: string;
    invoicing: string;
  };
}

// =============================================================================
// Partner Data
// =============================================================================

export const PARTNERS: Partner[] = [
  {
    slug: "krasan",
    name: "Krasan Consulting Services",
    shortName: "Krasan",
    status: "active",
    type: "prime_vendor",
    about:
      "Krasan is a Top 100 Woman-Owned Business with 25 years of experience. They develop and implement solutions that create value for government agencies, higher education, and market-leading corporations. Krasan is USSP's TOPS Prime Vendor — USSP is an authorized subvendor under TOPS Contract #CMT4599470.",
    website: "https://krasanconsulting.com",
    clientNames: ["Krasan", "Krasan Consulting", "Krasan Consulting Services"],

    enrollmentDocuments: [
      {
        name: "Subcontractor Services Agreement",
        description: "Signed subcontract enrollment contract with Krasan including requisition process",
        status: "on_file",
        notes: "Part of initial enrollment package",
      },
      {
        name: "W-9 Form",
        description: "IRS tax identification form for USSP",
        status: "on_file",
      },
      {
        name: "BEP Certification Letter",
        description: "Current Business Enterprise Program certification from the State of Illinois",
        status: "on_file",
        notes: "Must be renewed annually — check expiry",
      },
      {
        name: "Certificate of Good Standing",
        description: "Certificate from Illinois Secretary of State confirming USSP is in good standing",
        status: "on_file",
      },
      {
        name: "Certificate of Insurance",
        description: "Must name both Krasan Consulting Services, LLC AND the State of Illinois as additionally insured",
        status: "on_file",
        notes: "Verify annually that both Krasan and State of Illinois are listed",
      },
      {
        name: "ACH Payment Setup",
        description: "Voided check or bank letter for ACH payment processing",
        status: "on_file",
      },
    ],

    contractProcess: [
      "Sign 'Subcontract Enrollment Contract' with Krasan (includes Subcontractor Services Agreement + Requisition Process)",
      "Submit completed W-9 Form",
      "Submit current BEP (Business Enterprise Program) Certification Letter",
      "Submit Certificate of Good Standing from state of incorporation",
      "Submit Certificate of Insurance naming Krasan Consulting Services, LLC AND the State of Illinois as additionally insured",
      "Submit Voided Check or Bank Letter for ACH Payment Processing",
    ],

    submissionRequirements: [
      "Submit consultant in Krasan's ATS (Oorwin)",
      "Provide updated resume",
      "Provide signed Right to Represent (RTR)",
      "Provide valid identity proof (ID)",
      "Provide employment authorization (if required)",
    ],

    onboardingRequirements: [
      "Valid identity proof (ID)",
      "Employment authorization (if required)",
      "Address proof (utility bill to confirm US residency)",
      "Signed forms (if required by client)",
    ],

    invoicing: {
      emails: [
        "accounts@krasanconsulting.com",
        "finance@krasanconsulting.com",
      ],
      frequency: "Monthly or Biweekly (depends on client)",
      notes: [
        "Consultants must submit accurate timesheets in Oorwin timely",
        "Finance department processes invoices based on Oorwin timesheet data",
        "Send invoices to BOTH accounts@ and finance@ emails",
      ],
    },

    contacts: [
      {
        name: "Pavithra Karumuri",
        role: "CEO",
        email: "pavithra@krasanconsulting.com",
      },
      {
        name: "Tony Fremarek",
        role: "Vice President, Business Services",
        email: "Tony.Fremarek@krasanconsulting.com",
      },
      {
        name: "Partner Management Team",
        role: "Key POC for Partners",
        email: "partnerops@krasanconsulting.com",
      },
      {
        name: "Finance Team",
        role: "Finance & Invoicing",
        email: "finance@krasanconsulting.com",
      },
      {
        name: "Timesheet Team",
        role: "Timesheet Management",
        email: "timesheets@krasanconsulting.com",
      },
      {
        name: "Onboarding Team",
        role: "Consultant Onboarding",
        email: "onboarding@krasanconsulting.com",
      },
    ],

    documents: [
      {
        name: "TOPS Partner Instructions",
        description: "Complete partner onboarding presentation with contract process, submission requirements, invoicing, and contacts",
        path: "/api/docs/partners/krasan-tops-partner-instructions.pdf",
      },
    ],

    tooltips: {
      submission:
        "Krasan requires: Oorwin ATS submission, updated resume, signed RTR, valid ID, work authorization (if applicable)",
      onboarding:
        "Krasan onboarding: Valid ID, work authorization (if applicable), address proof (utility bill), signed forms",
      invoicing:
        "Invoice to: accounts@krasanconsulting.com + finance@krasanconsulting.com. Frequency: Monthly or Biweekly. Timesheets via Oorwin required.",
    },
  },
  {
    slug: "teleray",
    name: "TeleRay",
    shortName: "TeleRay",
    status: "in_conversation",
    type: "technology",
    about:
      "TeleRay provides medical imaging technology. USSP is exploring a reseller/investment partnership for Illinois government facilities including IDOC, IL Veterans, IDHS, IDJJ, and Cook County Health.",
    clientNames: ["TeleRay"],

    enrollmentDocuments: [],

    contractProcess: [
      "MOU in discussion — see /partnerships/teleray/mou for draft terms",
    ],

    submissionRequirements: [],
    onboardingRequirements: [],

    invoicing: {
      emails: [],
      frequency: "TBD",
      notes: ["Partnership terms under negotiation"],
    },

    contacts: [],
    documents: [],

    tooltips: {
      submission: "TeleRay partnership is under negotiation — no submission process yet",
      onboarding: "TeleRay partnership is under negotiation — no onboarding process yet",
      invoicing: "TeleRay billing terms under negotiation",
    },
  },
  {
    slug: "per4m-ai",
    name: "Per4m.AI",
    shortName: "Per4m.AI",
    status: "potential",
    type: "advisory",
    about:
      "Per4m.AI is a Chicago-based hybrid technology and services firm focused on AI Transformation (AX). They help enterprises close the AI Execution Gap through organizational assessment (SYNTHESIZE), strategic architecture (ARCHITECT), and workforce readiness (ACCELERATE). Founded by Josh Paolini, former Adobe Practice Leader and Northwestern University faculty. Potential advisory/methodology partner for USSP's AI transformation engagements.",
    website: "https://www.per4mai.com",
    clientNames: ["Per4m.AI", "Per4m", "Per4mAI"],

    enrollmentDocuments: [],

    contractProcess: [
      "Partnership structure under discussion — advisory/methodology license preferred over subcontractor",
    ],

    submissionRequirements: [],
    onboardingRequirements: [],

    invoicing: {
      emails: [],
      frequency: "TBD",
      notes: ["Partnership terms not yet established"],
    },

    contacts: [
      {
        name: "Josh Paolini",
        role: "Founder & CEO",
        email: "josh@per4mai.com",
      },
    ],
    documents: [],

    tooltips: {
      submission: "Per4m.AI partnership is potential — no submission process yet",
      onboarding: "Per4m.AI partnership is potential — no onboarding process yet",
      invoicing: "Per4m.AI billing terms not yet established",
    },
  },
  {
    slug: "lightkube",
    name: "LightKube Inc.",
    shortName: "LightKube",
    status: "potential",
    type: "technology",
    about:
      "LightKube is a New York-based enterprise technology services firm specializing in Cloud, Cybersecurity, AI, Data, Managed Services, and Technology Transformation. Founded by Nikhil Kumar (CISSP, Master Certified IT Architect, 2 US patents in identity/auth). Nikhil reported to Vinay for 10 years at CA Technologies — trusted relationship, will work with USSP when needed.",
    website: "https://www.lightkube.com",
    clientNames: ["LightKube", "LightKube Inc"],

    enrollmentDocuments: [],

    contractProcess: [
      "No formal process needed — Nikhil works with USSP on demand. Structure (sub, advisory, or staff aug) determined per engagement.",
    ],

    submissionRequirements: [],
    onboardingRequirements: [],

    invoicing: {
      emails: [],
      frequency: "TBD",
      notes: ["Partnership terms not yet established — determined per engagement"],
    },

    contacts: [
      {
        name: "Nikhil Kumar",
        role: "Founder & CEO",
        email: "",
      },
    ],
    documents: [],

    tooltips: {
      submission: "LightKube partnership is potential — no submission process yet",
      onboarding: "LightKube partnership is potential — no onboarding process yet",
      invoicing: "LightKube billing terms determined per engagement",
    },
  },
];

// =============================================================================
// Helpers
// =============================================================================

export function getAllPartners(): Partner[] {
  return PARTNERS;
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}

export function getPartnerByClientName(clientName: string): Partner | undefined {
  if (!clientName) return undefined;
  const lower = clientName.toLowerCase();
  return PARTNERS.find((p) =>
    p.clientNames.some((cn) => cn.toLowerCase() === lower)
  );
}
