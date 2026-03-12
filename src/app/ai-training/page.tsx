import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";

export const metadata: Metadata = {
  title:
    "Custom AI Training for Teams | Role-Based, Org-Specific | USSP",
  description:
    "Since 2003, USSP delivers custom AI training tailored to your team's roles, your organization's tools, and your industry's constraints. Not a generic bootcamp — training built around how your people actually work.",
  keywords:
    "custom AI training, role-based AI training, enterprise AI training, AI training for project managers, AI training for developers, organizational AI adoption, custom AI curriculum, AI tools training, prompt engineering training, AI workflow training",
  openGraph: {
    title: "Custom AI Training for Teams | Role-Based, Org-Specific | USSP",
    description:
      "AI training tailored to your team's roles, your org's tools, and your industry's constraints. Not generic — built around how your people actually work.",
    type: "website",
  },
};

const roleTracks = [
  {
    role: "Project Managers",
    icon: "clipboard",
    tools: "AI-assisted planning, risk forecasting, resource optimization, automated status reporting",
    outcome:
      "PMs learn to use AI for sprint planning, stakeholder communication, dependency tracking, and project risk analysis — using tools that fit your PM methodology.",
  },
  {
    role: "Developers & Engineers",
    icon: "code",
    tools: "Code assistants, AI-powered code review, API integration, test generation, CI/CD automation",
    outcome:
      "Engineers learn to ship faster with AI pair programming, automated testing, code refactoring, and intelligent debugging — within your stack and coding standards.",
  },
  {
    role: "Business Analysts",
    icon: "chart",
    tools: "Data extraction, report generation, requirements analysis, process mapping with AI",
    outcome:
      "Analysts learn to use AI for faster data synthesis, automated documentation, stakeholder interviews, and turning unstructured data into actionable insights.",
  },
  {
    role: "Executives & Leaders",
    icon: "strategy",
    tools: "AI strategy evaluation, vendor assessment, ROI modeling, governance frameworks",
    outcome:
      "Leaders learn to evaluate AI opportunities, set realistic adoption timelines, manage AI risk, and build a culture of responsible AI use across the organization.",
  },
  {
    role: "Sales & Marketing",
    icon: "megaphone",
    tools: "Content generation, customer research, personalization, competitive analysis, CRM automation",
    outcome:
      "Sales and marketing teams learn to use AI for prospect research, email drafting, campaign optimization, and content creation — aligned with your brand voice and compliance rules.",
  },
  {
    role: "Operations & Support",
    icon: "gear",
    tools: "Workflow automation, knowledge base management, ticket triage, process documentation",
    outcome:
      "Ops teams learn to automate repetitive tasks, build AI-assisted knowledge bases, and streamline support workflows — without disrupting existing SOPs.",
  },
];

const whyCustom = [
  {
    title: "Your Tech Stack, Not Ours",
    description:
      "We train on the tools your team actually uses — your IDE, your project management platform, your cloud provider, your data stack. No time wasted on irrelevant frameworks.",
  },
  {
    title: "Your Policies & Compliance",
    description:
      "Every organization has constraints — data privacy rules, security policies, industry regulations, approved vendor lists. We build these into the training from day one.",
  },
  {
    title: "Your Workflows & Processes",
    description:
      "Agile? Waterfall? SAFe? We map AI tools to your actual methodology so teams can adopt AI within the way they already work — not around it.",
  },
  {
    title: "Your Industry Context",
    description:
      "Healthcare AI looks different from fintech AI. Government compliance is different from retail. We understand domain-specific constraints and tailor use cases accordingly.",
  },
];

const engagementSteps = [
  {
    number: 1,
    title: "Discovery",
    description:
      "We learn your org — roles, tools, workflows, constraints, and goals",
  },
  {
    number: 2,
    title: "Curriculum Design",
    description:
      "Custom training tracks built for each role in your team",
  },
  {
    number: 3,
    title: "Hands-On Training",
    description:
      "Live sessions using your actual tools, data, and workflows",
  },
  {
    number: 4,
    title: "Practice & Apply",
    description:
      "Teams apply AI to real work with guided support and feedback",
  },
  {
    number: 5,
    title: "Measure & Iterate",
    description:
      "Track adoption, measure impact, and refine the approach",
  },
];

const sampleModules = [
  {
    number: 1,
    title: "Foundations of AI & Machine Learning",
    topics:
      "AI landscape overview, supervised vs unsupervised learning, neural network fundamentals, model training lifecycle, key frameworks (TensorFlow, PyTorch)",
  },
  {
    number: 2,
    title: "Data Engineering for AI",
    topics:
      "Data collection and preprocessing, feature engineering, data pipelines, handling imbalanced datasets, data versioning and governance",
  },
  {
    number: 3,
    title: "Natural Language Processing (NLP)",
    topics:
      "Text preprocessing, tokenization, embeddings, sentiment analysis, named entity recognition, text classification, transformer architecture",
  },
  {
    number: 4,
    title: "Large Language Models (LLMs)",
    topics:
      "GPT, Claude, and LLaMA architectures, prompt engineering, fine-tuning, RAG (Retrieval-Augmented Generation), context windows, token optimization",
  },
  {
    number: 5,
    title: "Generative AI Applications",
    topics:
      "Text generation, image generation (Stable Diffusion, DALL-E), code generation, AI agents, multi-modal models, responsible AI practices",
  },
  {
    number: 6,
    title: "Computer Vision",
    topics:
      "Image classification, object detection, image segmentation, CNNs, transfer learning, real-time video analysis, edge deployment",
  },
  {
    number: 7,
    title: "AI in the Enterprise",
    topics:
      "AI strategy and roadmap, use case identification, ROI assessment, change management, AI governance frameworks, compliance and ethics",
  },
  {
    number: 8,
    title: "Prompt Engineering & AI Integration",
    topics:
      "Advanced prompting techniques, chain-of-thought, few-shot learning, API integration, building AI-powered applications, tool use and function calling",
  },
  {
    number: 9,
    title: "MLOps & Model Deployment",
    topics:
      "Model versioning, CI/CD for ML, containerization, cloud deployment (AWS SageMaker, Azure ML, GCP Vertex AI), monitoring and drift detection",
  },
  {
    number: 10,
    title: "AI Agents & Automation",
    topics:
      "Autonomous agents, multi-agent systems, workflow automation, tool integration, memory and planning, agent frameworks (LangChain, CrewAI)",
  },
  {
    number: 11,
    title: "AI Security & Responsible AI",
    topics:
      "Adversarial attacks, prompt injection, model safety, bias detection and mitigation, explainability (XAI), regulatory compliance",
  },
  {
    number: 12,
    title: "Capstone Project & Certification",
    topics:
      "End-to-end AI solution design, team-based project, real-world dataset application, presentation and peer review, certification assessment",
  },
];

export default function AITraining() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-4">
            Custom AI Training
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-6">
            AI Training Built Around Your Team, Your Tools, Your Rules
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-3xl mx-auto">
            Not a generic bootcamp. We learn how your organization works — your
            roles, your tech stack, your compliance requirements — and build
            training that makes AI useful on day one.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-white text-near-black font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
          >
            Get a Custom Training Plan
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Why Generic AI Training Fails"
            subtitle="One-size-fits-all AI courses teach tools nobody uses, skip the ones that matter, and ignore the constraints your team operates under"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-dark/10 rounded-lg">
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                Wrong Tools for the Role
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                A project manager doesn&apos;t need PyTorch. A developer
                doesn&apos;t need ROI modeling. Generic training wastes
                everyone&apos;s time teaching skills they&apos;ll never use —
                while skipping the AI tools that would actually make them faster.
              </p>
            </div>
            <div className="p-6 border border-dark/10 rounded-lg">
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                Ignores Your Organization
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Every org has its own tech stack, security policies, compliance
                rules, and methodologies. Training that ignores these
                constraints produces people who can use AI in a sandbox — but
                not at work.
              </p>
            </div>
            <div className="p-6 border border-dark/10 rounded-lg">
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                No Lasting Adoption
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Without connecting AI to real workflows and real deliverables,
                teams attend training, nod along, and go back to doing things
                the old way. Knowledge without application doesn&apos;t stick.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Tracks */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Different Roles, Different Training"
            subtitle="Every role uses AI differently — we build training tracks that match what each person actually does"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roleTracks.map((track) => (
              <div
                key={track.role}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  {track.role}
                </h3>
                <p className="text-xs text-primary font-[family-name:var(--font-montserrat)] uppercase tracking-wider mb-3">
                  {track.tools}
                </p>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {track.outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Custom */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Customized to Your Organization"
            subtitle="We don't hand you a syllabus — we learn your constraints and build training that works within them"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyCustom.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 bg-light-gray rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <ProcessTimeline
        title="How It Works"
        subtitle="From discovery to measurable AI adoption"
        steps={engagementSteps}
      />

      {/* Sample Curriculum */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Sample Curriculum Modules"
            subtitle="A starting point — every engagement is customized based on your team's roles, tools, and goals"
          />
          <div className="space-y-4">
            {sampleModules.map((mod) => (
              <div
                key={mod.number}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-near-black text-white rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-alata)] font-bold">
                    {mod.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)]">
                      {mod.topics}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Transformation CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Training Is Just the Beginning
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto">
            Custom AI training powers the Accelerate phase of USSP&apos;s
            end-to-end AI Transformation framework. Combine training with
            readiness assessment, strategy, and talent staffing for a complete
            AI adoption journey.
          </p>
          <Link
            href="/ai-transformation"
            className="inline-block px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
          >
            Explore AI Transformation Services
          </Link>
        </div>
      </section>

      {/* JSON-LD: Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Custom AI Training for Teams",
            description:
              "Role-based, organization-specific AI training. USSP learns your team's roles, tools, workflows, and constraints — then builds custom training that makes AI useful on day one.",
            provider: {
              "@type": "Organization",
              name: "USSP Inc. (US Software Professionals Inc.)",
              foundingDate: "2003-01-23",
              description:
                "Since 2003, USSP delivers technology solutions including custom AI training, IT staffing, and software development. Chicago, IL headquarters.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "875 N Michigan Ave, Suite 3100",
                addressLocality: "Chicago",
                addressRegion: "IL",
                postalCode: "60614",
                addressCountry: "US",
              },
              telephone: "+1-312-546-4306",
            },
            serviceType: [
              "Custom AI Training",
              "Role-Based AI Training",
              "Enterprise AI Adoption",
              "Prompt Engineering Training",
              "AI Workflow Training",
              "Organizational AI Readiness",
            ],
          }),
        }}
      />

      {/* Contact */}
      <div id="contact">
        <ContactForm
          title="Get a Custom Training Plan"
          subtitle="Tell us about your team, your tools, and your goals — we'll design training that fits."
          email="accounts@ussoftwarepro.com"
        />
      </div>
    </>
  );
}
