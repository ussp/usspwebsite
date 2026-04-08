import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";

export const dynamic = "force-dynamic";

const POLICY_AREAS = [
  {
    name: "AI Usage Policy",
    description: "Written policy on approved uses, prohibited uses, and responsibilities for AI tools.",
    status: "checklist",
    items: [
      "Policy document exists and is current",
      "Communicated to all team members",
      "Covers data privacy and confidentiality",
      "Covers code ownership and IP",
      "Lists approved AI tools",
      "Defines prohibited uses explicitly",
      "Includes data handling procedures",
    ],
  },
  {
    name: "Regulatory Compliance",
    description: "Alignment with state and federal AI regulations (DoIT policy, NIST AI RMF, EO 14110).",
    status: "checklist",
    items: [
      "Applicable state AI laws identified",
      "DoIT AI System Assessment filed (if state agency)",
      "30-day advance notice submitted to DoIT (if required)",
      "Agency Head written consent for state data use",
      "NIST AI Risk Management Framework reviewed",
      "Bias mitigation plan documented",
    ],
  },
  {
    name: "Data Governance",
    description: "Controls for what data can and cannot be used with AI tools.",
    status: "checklist",
    items: [
      "Data classification completed (public, internal, protected, restricted)",
      "Protected/restricted data excluded from AI prompts",
      "PII handling procedures documented",
      "Data residency requirements confirmed",
      "AI tool data retention policies reviewed",
    ],
  },
  {
    name: "Human Oversight",
    description: "Processes ensuring humans review and approve all AI-assisted output.",
    status: "checklist",
    items: [
      "Human-in-the-loop mandate documented",
      "AI-assisted deliverables labeled/disclosed",
      "Review process defined for AI-generated content",
      "Escalation path for AI concerns established",
      "No autonomous code generation policy enforced",
    ],
  },
  {
    name: "Monitoring & Audit",
    description: "Ongoing monitoring, incident reporting, and audit trail for AI usage.",
    status: "checklist",
    items: [
      "Continuous monitoring process defined",
      "AI security incident reporting channel established",
      "Per-sprint bias and quality spot checks planned",
      "Audit trail maintained for AI tool usage",
      "Periodic review schedule set (quarterly or per-PI)",
    ],
  },
];

export default async function GovernancePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-2">GRC & Compliance</h1>
        <p className="text-sm text-dark/50 mb-6">
          Governance, Risk, and Compliance tracking for AI transformation engagements.
          Step 3 of the lifecycle — ensuring AI usage remains compliant, auditable, and sustainable.
        </p>

        <GuideBanner title="AI Transformation Lifecycle" variant="info">
          <p>
            <strong>1. Assess</strong> (Readiness) &rarr; <strong>2. Transform</strong> (Train & Measure) &rarr; <strong>3. Govern</strong> (Comply & Audit).
            GRC is not a one-time gate — it runs continuously alongside the transformation.
          </p>
        </GuideBanner>

        {/* Policy & Compliance Checklist */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-1">Policy & Compliance Checklist</h2>
          <p className="text-sm text-dark/50 mb-5">
            Track compliance status across 5 governance areas. Use this during engagement setup
            and review periodically (per PI or quarterly).
          </p>

          <div className="space-y-5">
            {POLICY_AREAS.map((area, i) => (
              <div key={i} className="border border-light-gray rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{area.name}</h3>
                    <p className="text-xs text-dark/40">{area.description}</p>
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  {area.items.map((item, j) => (
                    <label key={j} className="flex items-start gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark">
                      <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State of Illinois DoIT AI Policy Reference */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">State of Illinois — DoIT AI Policy Quick Reference</h2>
          <p className="text-sm text-dark/50 mb-4">
            Key requirements from the DoIT &ldquo;Policy on the Acceptable and Responsible Use of Artificial Intelligence&rdquo; (effective April 1, 2025).
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-gray text-left">
                <th className="py-2 font-medium text-dark/60">Section</th>
                <th className="py-2 font-medium text-dark/60">Requirement</th>
                <th className="py-2 font-medium text-dark/60">Impact on AI Pilot</th>
              </tr>
            </thead>
            <tbody className="text-dark/70">
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;2</td>
                <td className="py-2">Designate AI Policy employee within 30 days</td>
                <td className="py-2">Identify IDJJ&apos;s designated person</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;4d, &#167;6</td>
                <td className="py-2">Human in the loop for all AI decisions</td>
                <td className="py-2">Built into our approach — AI suggests, human decides</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;4f</td>
                <td className="py-2">No protected data without Agency Head authorization</td>
                <td className="py-2">No case data in AI prompts; code and stories only</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;5a-c</td>
                <td className="py-2">Transparency — disclose AI use</td>
                <td className="py-2">Written disclosure to pilot participants</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;5e</td>
                <td className="py-2">State data use requires written consent</td>
                <td className="py-2">Clarify if source code = &ldquo;state data&rdquo;</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;5f</td>
                <td className="py-2">AI System Assessment + 30-day advance notice</td>
                <td className="py-2">Potential 30-day gate before pilot launch</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;7</td>
                <td className="py-2">Continuous monitoring and documentation</td>
                <td className="py-2">Measurement tool provides audit trail</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">&#167;11</td>
                <td className="py-2">Bias mitigation — regular reviews, corrective action</td>
                <td className="py-2">Per-sprint bias spot checks planned</td>
              </tr>
              <tr>
                <td className="py-2">&#167;12</td>
                <td className="py-2">Security incident reporting process</td>
                <td className="py-2">Reporting channel to be established</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Risk Register Template */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">Risk Register</h2>
          <p className="text-sm text-dark/50 mb-4">
            Common risks for AI transformation engagements in government settings.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-gray text-left">
                <th className="py-2 font-medium text-dark/60">Risk</th>
                <th className="py-2 font-medium text-dark/60">Likelihood</th>
                <th className="py-2 font-medium text-dark/60">Impact</th>
                <th className="py-2 font-medium text-dark/60">Mitigation</th>
              </tr>
            </thead>
            <tbody className="text-dark/70">
              <tr className="border-b border-light-gray/50">
                <td className="py-2">State pulls AI tools mid-pilot</td>
                <td className="py-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Medium</span></td>
                <td className="py-2"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">High</span></td>
                <td className="py-2">Full DoIT compliance upfront; document everything</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">30-day notice not filed — delays launch</td>
                <td className="py-2"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Unknown</span></td>
                <td className="py-2"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">High</span></td>
                <td className="py-2">Clarify with CIO immediately; file if needed</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">AI worsens output quality (GIGO)</td>
                <td className="py-2"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">High</span></td>
                <td className="py-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Medium</span></td>
                <td className="py-2">Training first; quality checklist; human review</td>
              </tr>
              <tr className="border-b border-light-gray/50">
                <td className="py-2">Sensitive data in AI prompts</td>
                <td className="py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Low</span></td>
                <td className="py-2"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span></td>
                <td className="py-2">Strict training; &ldquo;No PII&rdquo; rule; spot checks</td>
              </tr>
              <tr>
                <td className="py-2">Team resistance to AI tools</td>
                <td className="py-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Medium</span></td>
                <td className="py-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Medium</span></td>
                <td className="py-2">Voluntary pilot; training shows value first</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Coming Soon */}
        <div className="bg-light-gray/50 rounded-lg border border-dashed border-dark/10 p-6 text-center">
          <p className="text-sm text-dark/40">
            <strong>Coming soon:</strong> Per-engagement GRC tracking, automated compliance scoring,
            audit report generation, and DoIT assessment document builder.
          </p>
        </div>
      </main>
    </>
  );
}
