import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ResearchCitationCard from "@/components/ResearchCitationCard";
import { RESEARCH_BENCHMARKS } from "@ussp-platform/core";

export const dynamic = "force-dynamic";

export default async function MethodologyPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">Methodology</h1>
        <p className="text-sm text-dark/50 mb-8">
          Our measurement approach is grounded in peer-reviewed research and industry-standard frameworks.
        </p>

        {/* Philosophy */}
        <section className="bg-near-black text-white rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Core Principle: Measure Growth</h2>
          <p className="text-sm text-white/70">
            This tool measures how AI training empowers the same team to deliver measurably more.
            Every role gets the right AI tools for their specific work.
            The goal is tracking productivity growth and capability building.
          </p>
        </section>

        {/* Frameworks */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Research Frameworks</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary">DORA Metrics</h3>
                <a href="https://dora.dev/research/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">dora.dev/research &rarr;</a>
              </div>
              <p className="text-xs text-dark/40 mb-2">
                Forsgren, Humble, Kim — <a href="https://itrevolution.com/product/accelerate/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Accelerate</a> (2018). Google Cloud DORA Reports (2018-2024).
              </p>
              <p className="text-sm text-dark/70 mb-3">
                Four key metrics that predict software delivery performance: Deployment Frequency,
                Lead Time for Changes, Change Failure Rate, and Mean Time to Recovery.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-light-gray/50 rounded p-2">
                  <span className="font-medium">Deployment Frequency</span> — How often code deploys to production
                </div>
                <div className="bg-light-gray/50 rounded p-2">
                  <span className="font-medium">Lead Time</span> — Time from commit to production
                </div>
                <div className="bg-light-gray/50 rounded p-2">
                  <span className="font-medium">Change Failure Rate</span> — % of deploys causing incidents
                </div>
                <div className="bg-light-gray/50 rounded p-2">
                  <span className="font-medium">MTTR</span> — Time to restore service after failure
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-light-gray p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary">SPACE Framework</h3>
                <a href="https://queue.acm.org/detail.cfm?id=3454124" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Read paper &rarr;</a>
              </div>
              <p className="text-xs text-dark/40 mb-2">
                Forsgren, Storey, Maddila et al. — &ldquo;The SPACE of Developer Productivity&rdquo; (ACM Queue, 2021).
              </p>
              <p className="text-sm text-dark/70 mb-3">
                Five dimensions of developer productivity. Key principle: always measure at least 3 dimensions,
                mixing perceptual (surveys) with objective (system data) metrics.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Satisfaction", "Performance", "Activity", "Communication", "Efficiency"].map((dim) => (
                  <span key={dim} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-light-gray p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary">DevEx Framework</h3>
                <a href="https://queue.acm.org/detail.cfm?id=3595878" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Read paper &rarr;</a>
              </div>
              <p className="text-xs text-dark/40 mb-2">
                Noda, Storey, Forsgren — &ldquo;DevEx: What Actually Drives Productivity&rdquo; (ACM Queue, 2023).
              </p>
              <p className="text-sm text-dark/70 mb-3">
                Three core dimensions of developer experience that directly impact productivity.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Flow State", "Feedback Loops", "Cognitive Load"].map((dim) => (
                  <span key={dim} className="px-3 py-1.5 rounded-full bg-info/10 text-info font-medium">
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-light-gray p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary">DORA AI Capabilities Model</h3>
                <a href="https://dora.dev/capabilities/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">dora.dev/capabilities &rarr;</a>
              </div>
              <p className="text-xs text-dark/40 mb-2">
                Google DORA Team (2025). 7 organizational capabilities that amplify AI benefits.
              </p>
              <p className="text-sm text-dark/70 mb-3">
                DORA&apos;s 2025 finding: AI is an amplifier — it magnifies existing strengths and weaknesses.
                These 7 capabilities determine whether AI adoption succeeds.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["AI-Accessible Data", "Clear AI Stance", "Healthy Data", "Platform Engineering", "User Focus", "Version Control", "Small Batches"].map((cap) => (
                  <span key={cap} className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Research benchmarks */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Research Benchmarks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResearchCitationCard source="Forrester TEI (GitHub Copilot)" finding="22% developer productivity improvement" year={2023} url="https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/" />
            <ResearchCitationCard source="McKinsey" finding="20-45% productivity improvement in software engineering" year={2023} url="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/unleashing-developer-productivity-with-generative-ai" />
            <ResearchCitationCard source="Harvard/BCG Study" finding="25% faster, 40% higher quality" year={2023} url="https://www.hbs.edu/ris/Publication%20Files/24-013_d9b45b68-9e74-42d6-a1c6-c72fb70c7571.pdf" />
            <ResearchCitationCard source="GitHub Copilot Study (Peng et al.)" finding="55.8% faster task completion" year={2023} url="https://arxiv.org/abs/2302.06590" />
            <ResearchCitationCard source="DORA AI Capabilities Model" finding="7 capabilities determine AI adoption success" year={2025} url="https://dora.dev/capabilities/" />
            <ResearchCitationCard source="DORA State of DevOps" finding="90% use AI; only 24% trust AI code significantly" year={2025} url="https://dora.dev/research/" />
          </div>
        </section>

        {/* Government angle */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Government Efficiency</h2>
          <div className="bg-white rounded-lg border border-light-gray p-5">
            <p className="text-sm text-dark/70 mb-3">
              This tool is designed with government agencies in mind. Under USSP&apos;s TOPS contract
              (CMT4599470, through February 2034), we serve state and federal IT teams that require:
            </p>
            <ul className="text-sm text-dark/60 space-y-2 list-disc list-inside">
              <li><strong>Measurable outcomes</strong> — Quantitative before/after data using peer-reviewed frameworks</li>
              <li><strong>Audit-ready data</strong> — Every metric traced to its source with timestamps</li>
              <li><strong>Budget justification</strong> — Executive summary reports for IG and budget submissions</li>
              <li><strong>No job displacement</strong> — Measures &ldquo;same team, more output&rdquo; aligned with workforce protection policies</li>
              <li><strong>Standardized methodology</strong> — Research-backed, not proprietary or arbitrary</li>
              <li><strong>Cross-team benchmarking</strong> — Compare improvement across departments</li>
            </ul>
          </div>
        </section>

        {/* References */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">References</h2>
          <p className="text-xs text-dark/40 mb-3">Click any link to read the original paper or report.</p>
          <ol className="text-xs text-dark/60 space-y-3 list-decimal list-inside">
            <li>Forsgren, N., Humble, J., Kim, G. (2018). <em>Accelerate: The Science of Lean Software and DevOps.</em> IT Revolution Press. <a href="https://itrevolution.com/product/accelerate/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">itrevolution.com</a></li>
            <li>Forsgren, N., Storey, M-A., et al. (2021). &ldquo;The SPACE of Developer Productivity.&rdquo; <em>ACM Queue</em>, 19(1). <a href="https://queue.acm.org/detail.cfm?id=3454124" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read paper</a></li>
            <li>Noda, A., Storey, M-A., Forsgren, N. (2023). &ldquo;DevEx: What Actually Drives Productivity.&rdquo; <em>ACM Queue</em>, 21(2). <a href="https://queue.acm.org/detail.cfm?id=3595878" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read paper</a></li>
            <li>Peng, S., et al. (2023). &ldquo;The Impact of AI on Developer Productivity: Evidence from GitHub Copilot.&rdquo; <a href="https://arxiv.org/abs/2302.06590" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">arxiv.org/abs/2302.06590</a></li>
            <li>Dell&apos;Acqua, F., et al. (2023). &ldquo;Navigating the Jagged Technological Frontier.&rdquo; <em>Harvard Business School Working Paper 24-013.</em> <a href="https://www.hbs.edu/ris/Publication%20Files/24-013_d9b45b68-9e74-42d6-a1c6-c72fb70c7571.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read paper (PDF)</a></li>
            <li>McKinsey &amp; Company (2023). &ldquo;Unleashing Developer Productivity with Generative AI.&rdquo; <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/unleashing-developer-productivity-with-generative-ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mckinsey.com</a></li>
            <li>Forrester Research (2023). &ldquo;The Total Economic Impact of GitHub Copilot.&rdquo; <a href="https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.blog</a></li>
            <li>Google DORA Team (2024). <em>State of DevOps Report 2024.</em> <a href="https://dora.dev/research/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dora.dev/research</a></li>
            <li>Google DORA Team (2025). <em>State of AI-assisted Software Development.</em> <a href="https://dora.dev/research/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dora.dev/research</a></li>
            <li>Google DORA Team (2025). <em>DORA AI Capabilities Model.</em> <a href="https://dora.dev/capabilities/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dora.dev/capabilities</a></li>
          </ol>
        </section>
      </main>
    </>
  );
}
