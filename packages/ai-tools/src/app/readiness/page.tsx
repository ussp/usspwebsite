import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import GuideBanner from "@/components/GuideBanner";
import StateLawSelector from "@/components/StateLawSelector";

export const dynamic = "force-dynamic";

const CAPABILITIES = [
  { name: "AI-Accessible Internal Data", description: "AI is connected to internal docs, code, and knowledge bases — not just generic public data.", question: "Can your AI tools access internal documentation, codebases, and knowledge?" },
  { name: "Clear AI Stance", description: "The organization has an explicit, communicated policy on how AI should and shouldn't be used.", question: "Does your organization have a clear, communicated policy on AI use?" },
  { name: "Healthy Data Ecosystems", description: "Internal data is high-quality, accessible, searchable, and unified across systems.", question: "Is your internal data high-quality, accessible, and well-organized?" },
  { name: "Platform Engineering", description: "Internal platforms provide automated, secure pathways that allow AI benefits to scale.", question: "Do your internal platforms support automated, secure workflows?" },
  { name: "User-Centric Focus", description: "Teams prioritize building the right things for users, not just building faster.", question: "Do teams focus on user outcomes, not just velocity?" },
  { name: "Version Control Maturity", description: "Mature version control practices act as a safety net for AI-accelerated change.", question: "Does the team use mature branching, review, and version control practices?" },
  { name: "Working in Small Batches", description: "Teams deliver in small increments to manage the risk and velocity that AI introduces.", question: "Does the team deliver work in small, frequent increments?" },
];

export default async function ReadinessPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">AI Readiness Assessment</h1>
        <p className="text-sm text-dark/50 mb-6">
          Based on the <strong>DORA 2025 AI Capabilities Model</strong> — evaluate whether an organization
          has the 7 capabilities needed for AI adoption to succeed.
        </p>

        <GuideBanner title="How this works" variant="info">
          <p>
            Score each of the 7 capabilities on a 1-5 scale based on interviews or observations.
            The tool computes an overall readiness tier and identifies blockers to address before investing in AI training.
          </p>
        </GuideBanner>

        <GuideBanner title="The Amplifier Model (DORA 2025)" variant="tip">
          <p>
            DORA research found that AI is an <strong>amplifier</strong> — it magnifies existing strengths AND weaknesses.
            Organizations with strong foundations see AI multiply their performance.
            Those with weak foundations see AI multiply their dysfunction.
            This assessment identifies which foundations need strengthening.
          </p>
        </GuideBanner>

        {/* Readiness Tiers */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Readiness Tiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-center">
              <p className="text-sm font-semibold text-red-800">Not Ready</p>
              <p className="text-xs text-red-600 mt-1">Score &lt; 2.0</p>
              <p className="text-[10px] text-red-500 mt-1">Critical gaps. Fix before training.</p>
            </div>
            <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-center">
              <p className="text-sm font-semibold text-amber-800">Foundation Needed</p>
              <p className="text-xs text-amber-600 mt-1">Score 2.0 - 2.9</p>
              <p className="text-[10px] text-amber-500 mt-1">Key gaps remain. Targeted fixes first.</p>
            </div>
            <div className="rounded-lg p-3 bg-blue-50 border border-blue-200 text-center">
              <p className="text-sm font-semibold text-blue-800">Ready</p>
              <p className="text-xs text-blue-600 mt-1">Score 3.0 - 3.9</p>
              <p className="text-[10px] text-blue-500 mt-1">Adequate. Training should produce results.</p>
            </div>
            <div className="rounded-lg p-3 bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-sm font-semibold text-emerald-800">Well Positioned</p>
              <p className="text-xs text-emerald-600 mt-1">Score 4.0 - 5.0</p>
              <p className="text-[10px] text-emerald-500 mt-1">Strong foundations. AI will amplify.</p>
            </div>
          </div>
        </div>

        {/* 7 Capabilities */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">The 7 AI Capabilities</h2>
          <p className="text-sm text-dark/50 mb-4">
            Each capability is scored 1-5 during an assessment. Capabilities scoring below 3 are flagged as blockers.
          </p>
          <div className="space-y-4">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="border border-light-gray rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{cap.name}</h3>
                    <p className="text-xs text-dark/50 mt-1">{cap.description}</p>
                    <p className="text-xs text-primary mt-2 italic">Assessment question: &ldquo;{cap.question}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Policy Checklist */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">AI Policy &amp; Governance</h2>
          <p className="text-sm text-dark/50 mb-4">
            Before adopting AI tools, organizations should have clear policies in place.
            These 4 areas are scored as part of the readiness assessment.
          </p>
          <div className="space-y-3">
            <div className="border border-light-gray rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">8</div>
                <div>
                  <h3 className="text-sm font-semibold">AI Usage Policy Exists</h3>
                  <p className="text-xs text-dark/50 mt-1">Does the organization have a written AI usage policy that has been communicated to employees?</p>
                  <p className="text-xs text-primary mt-2 italic">Score 1 = no policy, 5 = comprehensive policy actively enforced</p>
                </div>
              </div>
            </div>
            <div className="border border-light-gray rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">9</div>
                <div>
                  <h3 className="text-sm font-semibold">AI Policy Coverage</h3>
                  <p className="text-xs text-dark/50 mt-1">Does the policy cover: data privacy and confidentiality, code ownership and IP, approved AI tools list, prohibited uses, and data handling?</p>
                  <p className="text-xs text-primary mt-2 italic">Score 1 = no coverage, 5 = all areas comprehensively addressed</p>
                  <p className="text-[11px] text-dark/40 mt-1">Reference: <a href="https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NIST AI Risk Management Framework</a> for policy structure guidance</p>
                </div>
              </div>
            </div>
            <div className="border border-light-gray rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">10</div>
                <div>
                  <h3 className="text-sm font-semibold">Regulatory Awareness</h3>
                  <p className="text-xs text-dark/50 mt-1">Is the team aware of applicable state and federal AI regulations? Do they know what they can and cannot do with AI tools?</p>
                  <p className="text-xs text-primary mt-2 italic">Score 1 = no awareness, 5 = team trained on applicable regulations</p>
                  <p className="text-[11px] text-dark/40 mt-1">Use the State Law Reference below to identify which laws apply</p>
                </div>
              </div>
            </div>
            <div className="border border-light-gray rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">11</div>
                <div>
                  <h3 className="text-sm font-semibold">AI Governance</h3>
                  <p className="text-xs text-dark/50 mt-1">Is there an AI governance committee, designated responsible person, or formal review process for AI tool adoption?</p>
                  <p className="text-xs text-primary mt-2 italic">Score 1 = no governance, 5 = formal committee with review process</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Collect the organization&apos;s AI policy document</strong> (if one exists) during the assessment.
              If no policy exists, this is a key blocker to flag — the organization should create one before AI training begins.
            </p>
          </div>
        </div>

        {/* State & Regulatory Compliance */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">State &amp; Federal AI Regulations</h2>
          <p className="text-sm text-dark/50 mb-4">
            Different states have different AI laws. Select the organization&apos;s state to see which regulations apply.
            Each law links to the actual legal text so assessors can read the source.
          </p>
          <StateLawSelector />
        </div>

        {/* How to use */}
        <div className="bg-white rounded-lg border border-light-gray p-5">
          <h2 className="text-lg font-semibold mb-4">How to Run a Readiness Assessment</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-light-gray text-dark/60 flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Create an engagement (or use standalone)</p>
                <p className="text-xs text-dark/40">The readiness assessment can be linked to a Transformation engagement or run independently.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-light-gray text-dark/60 flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium">Interview stakeholders</p>
                <p className="text-xs text-dark/40">Meet with team leads, platform engineers, and management to score each capability 1-5.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-light-gray text-dark/60 flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Enter scores as a readiness assessment</p>
                <p className="text-xs text-dark/40">Create a &ldquo;readiness&rdquo; assessment for the team and submit the 7 capability scores.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-light-gray text-dark/60 flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <p className="font-medium">Review tier and blockers</p>
                <p className="text-xs text-dark/40">The tool assigns a readiness tier and flags any capability below 3 as a blocker to address.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-light-gray text-dark/60 flex items-center justify-center text-xs font-bold">5</div>
              <div>
                <p className="font-medium">If linked to a transformation engagement</p>
                <p className="text-xs text-dark/40">The final transformation report will include an Amplifier Analysis — correlating readiness with improvement.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
