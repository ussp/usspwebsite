import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactForm from "@/components/ContactForm";
import ExpandableSection from "@/components/ExpandableSection";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "AI Transformation Services | Enterprise AI Readiness & Strategy | Since 2003",
  description:
    "Since 2003, USSP delivers end-to-end AI transformation: readiness assessment, AI strategy, workforce training, and AI talent staffing for enterprises and government agencies. 20+ years of IT expertise.",
  keywords:
    "AI transformation, AI readiness assessment, AI consulting, AI strategy, AI workforce training, AI staffing, enterprise AI adoption, government AI services, TOPS contract AI, USSP, established 2003",
  openGraph: {
    title: "AI Transformation Services | USSP - Since 2003",
    description:
      "End-to-end AI transformation: Assess, Architect, Accelerate, Staff. For enterprises and government agencies.",
    type: "website",
  },
};

const pillars = [
  {
    phase: "01",
    title: "Assess",
    subtitle: "AI Readiness Evaluation",
    points: [
      "Organizational AI maturity scoring",
      "Workforce skill-gap analysis",
      "Technology infrastructure audit",
      "Risk and compliance review",
      "Quantified readiness roadmap",
    ],
  },
  {
    phase: "02",
    title: "Architect",
    subtitle: "AI Integration Framework",
    points: [
      "Custom AI strategy and roadmap",
      "Human-AI workflow design",
      "Technology stack selection",
      "Governance and ethics framework",
      "Change management blueprint",
    ],
  },
  {
    phase: "03",
    title: "Accelerate",
    subtitle: "Training & Enablement",
    points: [
      "12-module AI & ML curriculum",
      "Role-based training tracks",
      "Hands-on labs and capstone projects",
      "Skill progression monitoring",
      "Continuous learning pathways",
    ],
  },
  {
    phase: "04",
    title: "Staff",
    subtitle: "AI Talent & Augmentation",
    points: [
      "AI/ML engineer placement",
      "Data scientist recruitment",
      "AI project management",
      "Staff augmentation for AI initiatives",
      "20+ years of recruitment expertise",
    ],
  },
];

const processSteps = [
  {
    number: 1,
    title: "Discovery",
    description:
      "Initial consultation to understand your business objectives, current technology landscape, and AI opportunity mapping.",
  },
  {
    number: 2,
    title: "Assessment",
    description:
      "Comprehensive organizational AI readiness evaluation including workforce skill-gap analysis and infrastructure audit.",
  },
  {
    number: 3,
    title: "Strategy",
    description:
      "Custom AI roadmap development, framework design, governance model, and technology stack recommendations.",
  },
  {
    number: 4,
    title: "Training",
    description:
      "Role-based AI training delivery powered by USSP's 12-module curriculum with hands-on labs and certification.",
  },
  {
    number: 5,
    title: "Implementation",
    description:
      "AI integration, solution deployment, and staff augmentation with qualified AI/ML professionals.",
  },
  {
    number: 6,
    title: "Optimize",
    description:
      "Performance monitoring, continuous improvement cycles, and ongoing support to maximize AI ROI.",
  },
];

const faqs = [
  {
    question: "What is AI Transformation?",
    answer:
      "AI Transformation is the systematic process of preparing an organization to adopt and integrate artificial intelligence across its operations. USSP's AI Transformation services follow a four-phase approach: Assess (organizational AI readiness evaluation), Architect (AI strategy and framework design), Accelerate (workforce training powered by USSP's 12-module AI curriculum), and Staff (AI talent recruitment and augmentation). This end-to-end approach ensures organizations don't just plan for AI — they successfully implement it.",
  },
  {
    question: "Does USSP offer AI readiness assessments?",
    answer:
      "Yes. USSP provides comprehensive AI readiness assessments that evaluate organizational AI maturity, workforce skill gaps, technology infrastructure, and compliance requirements. The assessment produces a quantified readiness score with an actionable roadmap for AI adoption, covering everything from quick wins to long-term strategic initiatives.",
  },
  {
    question:
      "Can Illinois state agencies use USSP for AI transformation services?",
    answer:
      "Yes. USSP is an authorized subvendor under the Illinois TOPS Category Two contract (CMT4599470), which covers IT consulting and business management consulting services. Illinois state agencies, boards, commissions, and qualified not-for-profit agencies can engage USSP for AI transformation services at pre-negotiated rates through February 2034.",
  },
  {
    question: "What makes USSP different from other AI consulting firms?",
    answer:
      "USSP offers end-to-end AI transformation covering assessment, architecture, training, AND staffing — most consulting firms stop at strategy. With 20+ years of IT experience since 2003, an existing 12-module AI & ML training curriculum, government contract access through TOPS, and deep recruitment expertise, USSP can take organizations from AI readiness evaluation to fully staffed AI operations.",
  },
  {
    question: "How long does an AI transformation engagement take?",
    answer:
      "Engagement timelines vary based on organizational size and scope. A focused AI readiness assessment typically takes 4-6 weeks. A full Assess-Architect-Accelerate-Staff engagement can span 3-12 months depending on the depth of transformation required. USSP designs each engagement to deliver value at every phase, so organizations see results incrementally rather than waiting for the entire program to complete.",
  },
];

export default function AITransformationPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-4">
            Enterprise &amp; Government AI Services
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-6">
            AI Transformation Services
          </h1>
          <p className="text-2xl text-white/90 font-[family-name:var(--font-alata)] mb-4">
            Assess. Architect. Accelerate. Staff.
          </p>
          <p className="text-lg text-white/70 font-[family-name:var(--font-montserrat)] mb-8 max-w-3xl mx-auto">
            End-to-end AI adoption for enterprises and government agencies.
            From readiness assessment to workforce transformation — backed by
            20+ years of IT expertise since 2003.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#approach"
              className="px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
            >
              Our Approach
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-near-black transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="The AI Readiness Challenge"
            subtitle="Why most organizations struggle with AI adoption"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  Skill Gaps
                </h3>
                <p className="text-dark/70 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                  Most workforces lack the AI literacy needed to effectively
                  adopt and leverage AI tools. Without targeted upskilling,
                  AI investments underperform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  Unclear ROI
                </h3>
                <p className="text-dark/70 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                  Organizations invest in AI without a clear framework for
                  measuring return. Without quantified baselines, it&apos;s
                  impossible to track progress.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  Fragmented Adoption
                </h3>
                <p className="text-dark/70 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                  Teams adopt AI tools independently without organizational
                  strategy, creating silos, redundancy, and security risks that
                  undermine the broader transformation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  Compliance &amp; Governance
                </h3>
                <p className="text-dark/70 font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                  Government agencies and regulated industries face additional
                  hurdles — data privacy, ethical AI requirements, and
                  procurement constraints that demand specialized expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section id="approach" className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Approach"
            subtitle="A four-phase framework for AI transformation"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-4xl font-[family-name:var(--font-alata)] text-primary/20">
                  {pillar.phase}
                </span>
                <h3 className="text-xl font-[family-name:var(--font-alata)] mt-2 mb-1">
                  {pillar.title}
                </h3>
                <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] font-bold mb-4">
                  {pillar.subtitle}
                </p>
                <ul className="space-y-2">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] flex items-start gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)]">
              The <strong>Accelerate</strong> phase is powered by{" "}
              <Link
                href="/ai-training"
                className="text-primary hover:text-primary-dark underline"
              >
                USSP&apos;s 12-module AI &amp; ML Training curriculum
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* For Enterprise */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="For Enterprise Organizations"
            subtitle="AI transformation that delivers measurable business outcomes"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                Quantified Results
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                Every engagement starts with measurable baselines and
                delivers quantified readiness scores so you can track
                progress and ROI.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                Industry Agnostic
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                Our framework adapts to any industry — financial services,
                manufacturing, healthcare, technology, and beyond. AI
                readiness is universal.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                End-to-End Delivery
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                Unlike pure consulting firms, USSP assesses, architects,
                trains, AND staffs your AI initiatives. One partner from
                strategy to execution.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/discover"
              className="text-primary hover:text-primary-dark font-[family-name:var(--font-alata)] text-sm underline"
            >
              Explore USSP&apos;s full IT services portfolio &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Government Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="AI Transformation for Government"
            subtitle="Available through the Illinois TOPS Category Two contract"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-8">
            <div className="md:col-span-3 space-y-4">
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Illinois state agencies can engage USSP for AI transformation
                services through the TOPS Category Two contract at
                pre-negotiated rates. AI strategy and readiness consulting
                falls under the &ldquo;Business Management Consulting&rdquo;
                and &ldquo;IT Consulting&rdquo; service categories.
              </p>
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                USSP&apos;s government AI transformation services address the
                unique compliance, procurement, and data governance
                requirements that public sector organizations face — ensuring
                AI adoption that meets state standards.
              </p>
              <Link
                href="/tops"
                className="inline-block mt-2 text-primary hover:text-primary-dark font-[family-name:var(--font-alata)] text-sm underline"
              >
                View full TOPS contract details &rarr;
              </Link>
            </div>
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div>
                  <p className="text-xs text-dark/50 font-[family-name:var(--font-alata)] uppercase tracking-wider">
                    Contract #
                  </p>
                  <p className="font-[family-name:var(--font-montserrat)] font-bold">
                    CMT4599470
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark/50 font-[family-name:var(--font-alata)] uppercase tracking-wider">
                    USSP Role
                  </p>
                  <p className="font-[family-name:var(--font-montserrat)] font-bold">
                    Authorized Subvendor
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark/50 font-[family-name:var(--font-alata)] uppercase tracking-wider">
                    Available Through
                  </p>
                  <p className="font-[family-name:var(--font-montserrat)] font-bold">
                    February 2034
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark/50 font-[family-name:var(--font-alata)] uppercase tracking-wider">
                    Eligible Users
                  </p>
                  <p className="text-sm font-[family-name:var(--font-montserrat)]">
                    All Illinois state agencies, boards, commissions, and
                    qualified not-for-profit agencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline title="How It Works" steps={processSteps} />

      {/* FAQ */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="space-y-4">
            {faqs.map((faq) => (
              <ExpandableSection
                key={faq.question}
                title={faq.question}
                content={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Ready to Transform Your Organization with AI?
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a Fortune 500 enterprise or an Illinois state
            agency, USSP can help you assess, plan, train, and staff your AI
            transformation journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/careers"
              className="px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Join Our AI Team
            </Link>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD: Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "AI Transformation Services",
            description:
              "End-to-end AI transformation services including AI readiness assessment, AI strategy architecture, workforce training, and AI talent staffing. Available to enterprises and government agencies through the Illinois TOPS contract.",
            provider: {
              "@type": "Organization",
              name: "USSP Inc. (US Software Professionals Inc.)",
              foundingDate: "2003-01-23",
              url: "https://www.ussp.co",
            },
            serviceType: [
              "AI Readiness Assessment",
              "AI Strategy Consulting",
              "AI Workforce Training",
              "AI Talent Staffing",
              "AI Integration Architecture",
            ],
            areaServed: ["United States", "Illinois"],
          }),
        }}
      />

      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Contact */}
      <div id="contact">
        <ContactForm
          title="Start Your AI Transformation"
          subtitle="Contact us to discuss your organization's AI readiness journey."
        />
      </div>
    </>
  );
}
