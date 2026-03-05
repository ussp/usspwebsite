import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactForm from "@/components/ContactForm";
import ExpandableSection from "@/components/ExpandableSection";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Context-First AI Platform | AI-Powered Business Solutions | Since 2003",
  description:
    "Since 2003, USSP's Context-First AI platform gives AI agents trusted, scored business context with TTL, source tagging, and 34+ connectors. Managed services for SMBs, enterprise framework licensing.",
  keywords:
    "context-first AI, agentic AI platform, AI context management, MCP, AI data platform, managed AI services, business intelligence, trust scoring, TTL, USSP portfolio, established 2003",
  openGraph: {
    title: "Context-First AI Platform | USSP - Since 2003",
    description:
      "Context-First AI for Business. Trusted, scored, fresh business context for your AI agents.",
    type: "website",
  },
};

const categories = [
  {
    name: "Business Intelligence",
    products: [
      {
        title: "Unified Communications Intelligence Platform",
        tagline: "Every call, text, and lead — unified for AI",
        badges: ["AI-Powered", "Managed Service", "Vendor-Agnostic"],
        features: [
          "Integrates calls, SMS/texting, CRM, and POS into one intelligence layer",
          "Generates outbound campaigns from historical customer data",
          "AI-coached talking points and priority-ranked lead queues",
          "Automates monitoring so staff focus on upselling and conversion",
        ],
        detail:
          "Vendor-agnostic phone integration (RingCentral and extensible to other providers). Keeps communication data current and contextual so any AI agent framework can reason over real-time customer interactions. Delivered as a managed service — USSP builds integrations, configures campaign rules, customizes AI coaching, and provides ongoing support.",
      },
      {
        title: "Executive Command Center",
        tagline: "Multi-site oversight with built-in financial planning",
        badges: ["Real-Time", "Multi-Site", "AI-Powered"],
        features: [
          "Unified executive dashboard across all business locations",
          "Real-time KPI scorecards with automated threshold alerts",
          "Built-in P&L forecasting, budgeting, and scenario modeling",
          "Cross-functional insights: marketing, finance, operations, staffing",
        ],
        detail:
          "Quick-action menus for immediate decisions. Cash flow modeling, EBITDA tracking, and multi-scenario 'what-if' analysis built in — no separate finance tool needed. Designed for C-suite and General Managers overseeing multiple locations.",
      },
    ],
  },
  {
    name: "Marketing & Engagement",
    products: [
      {
        title: "Marketing Automation Suite",
        tagline: "AI-powered campaigns from segmentation to conversion",
        badges: ["AI Copywriting", "SMS", "Multi-Channel"],
        features: [
          "Customer segmentation and audience targeting",
          "AI-generated campaign copy and SMS automation",
          "Real-time campaign performance tracking and ROI",
          "Built-in community and influencer relationship management",
        ],
        detail:
          "From local micro-influencer outreach to automated SMS campaigns — one platform for all customer engagement. AI handles the copy, segmentation, and scheduling while your team focuses on strategy.",
      },
      {
        title: "Competitive Intelligence Platform",
        tagline: "Know what your competitors do before your customers do",
        badges: ["Automated", "Daily Updates", "SEO Tracking"],
        features: [
          "Automated competitor pricing and event monitoring",
          "Review sentiment tracking and rating analysis",
          "Google Search ranking and SEO gap identification",
          "Daily market positioning insights delivered automatically",
        ],
        detail:
          "Web scraping, review aggregation, and search ranking analysis run continuously. Threats and opportunities surfaced daily so marketing teams can respond proactively instead of reactively.",
      },
    ],
  },
  {
    name: "Operations & Facilities",
    products: [
      {
        title: "Digital Twin — 3D Facility Simulator",
        tagline: "Simulate your facility before making a single change",
        badges: ["3D Simulation", "Real-Time", "Predictive"],
        features: [
          "3D guest flow simulation with zone-level occupancy tracking",
          "Queue prediction, staffing ratios, and revenue-per-zone modeling",
          "Replay historical days at 60x speed or simulate future scenarios",
          "Staff-to-guest safety ratio monitoring and compliance alerts",
        ],
        detail:
          "Built on Three.js with real POS data driving the simulation. Operations managers test staffing plans, optimize zone layouts, and identify bottlenecks without disrupting live operations. The only small business platform with 3D facility simulation.",
      },
      {
        title: "Staffing Optimizer",
        tagline: "Right people, right time, right cost",
        badges: ["Demand-Based", "Cost Optimization", "Scheduling"],
        features: [
          "Demand-based staffing forecasts from historical patterns",
          "Labor cost optimization with threshold alerts",
          "Integration with scheduling systems (WhenToWork and others)",
          "Per-day decline-factor modeling for operational efficiency",
        ],
        detail:
          "Connects to POS and scheduling systems to predict staffing needs. Automatically flags overstaffed and understaffed periods, helping managers reduce labor costs while maintaining service quality.",
      },
    ],
  },
  {
    name: "Growth & Strategy",
    products: [
      {
        title: "Market Analysis & Site Selection",
        tagline: "Data-driven decisions for where to grow next",
        badges: ["Census Data", "Drive-Time Maps", "Demographics"],
        features: [
          "Total addressable market sizing by ZIP code",
          "Drive-time isochrone mapping for catchment areas",
          "Census demographic analysis (250+ variables)",
          "Competitive density scoring for location decisions",
        ],
        detail:
          "Uses US Census API, OpenRouteService drive-time calculations, and Google Places data to quantify market opportunity. Site selection teams get demographic profiles, competitor maps, and market size estimates for any location in the US.",
      },
      {
        title: "Acquisition Scoring Engine",
        tagline: "Score, benchmark, and value acquisition targets",
        badges: ["Benchmarking", "Scoring 0-100", "PE-Ready"],
        features: [
          "Multi-site benchmarking across operational metrics",
          "Acquisition opportunity scoring on a 0-100 scale",
          "Fair value estimation using EBITDA multiples",
          "Portfolio optimization for growth-stage businesses",
        ],
        detail:
          "Designed for PE firms and multi-site operators evaluating acquisitions. Compares revenue per square foot, throughput, F&B attachment rates, and EBITDA margins against industry benchmarks to identify turnaround opportunities.",
      },
    ],
  },
  {
    name: "AI & Automation",
    products: [
      {
        title: "Managed Data Intelligence Platform",
        tagline:
          "Connect. Trust. Evolve. — Your AI\u2019s living foundation.",
        badges: [
          "34+ Connectors",
          "TTL & Trust Scoring",
          "MCP Ready",
          "Knowledge Graph",
        ],
        features: [
          "Connect: 34+ pre-built ingestors with source tagging for POS, CRM, phone, staffing, ads, census",
          "Trust: Every data point carries TTL (time-to-live) and trust scores \u2014 AI knows what\u2019s fresh vs. stale",
          "Evolve: Context automatically updates as business data changes \u2014 no manual refresh needed",
          "MCP server exposes business context to any AI agent \u2014 Claude, ChatGPT, CrewAI, LangGraph",
        ],
        detail:
          "The foundation layer for Context-First AI. Data is constantly changing \u2014 our platform ensures AI context evolves with it. Every data point is source-tagged with trust scores and TTL, so agents know what to trust and what\u2019s expired. MCP (Model Context Protocol) integration lets any AI agent framework query real-time business data directly. Each deployment is customized to your systems. Available as a managed service or enterprise framework.",
      },
      {
        title: "AI Workflow Engine",
        tagline: "8+ AI crews that work while you sleep",
        badges: ["CrewAI", "Autonomous", "Configurable"],
        features: [
          "8+ specialized AI agent crews for different business functions",
          "Automated marketing analysis, report generation, and data validation",
          "Configurable workflows that chain multiple AI agents together",
          "Powered by the Managed Data Intelligence Platform for real-time context",
        ],
        detail:
          "Built on CrewAI with specialized crews for budget allocation, staffing optimization, competitive analysis, proposal evaluation, and more. Each crew queries the unified data layer for current business context before generating insights or taking actions.",
      },
    ],
  },
];

const platformCapabilities = [
  "MCP Ready",
  "Framework-Agnostic",
  "34+ Connectors",
  "TTL & Trust Scoring",
  "Knowledge Graph",
  "Real-Time Sync",
];

const deliverySteps = [
  {
    number: 1,
    title: "Discovery",
    description:
      "We learn your business \u2014 systems, workflows, pain points, and goals. No two deployments are the same.",
  },
  {
    number: 2,
    title: "Build",
    description:
      "Custom integrations, business rules, domain knowledge, and AI configuration tailored to your operations.",
  },
  {
    number: 3,
    title: "Deploy",
    description:
      "Production deployment, data migration, and staff training. Your team is operational from day one.",
  },
  {
    number: 4,
    title: "Manage",
    description:
      "Ongoing monitoring, new integrations, rule updates, optimization, and support. We grow with your business.",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: "Next.js, React, TypeScript, Tailwind CSS, Three.js",
  },
  { category: "Backend", items: "Python, FastAPI, Flask, Node.js" },
  { category: "Database", items: "PostgreSQL, Supabase, Redis" },
  {
    category: "AI",
    items: "OpenAI GPT-4, Anthropic Claude, CrewAI, Cognee",
  },
  { category: "Cloud", items: "Railway, AWS, Vercel" },
  {
    category: "Integrations",
    items: "RingCentral, CRM, POS, Census API, Google APIs",
  },
];

const faqs = [
  {
    question: "What is Context-First AI?",
    answer:
      "Context-First AI means your AI agents always have trusted, scored, fresh business context to reason over. Unlike generic AI tools that work with whatever data you feed them, USSP\u2019s platform ensures every data point has TTL (time-to-live), trust scores, and source tagging \u2014 so agents know what\u2019s fresh, what\u2019s stale, and what to trust. As your business data changes, AI context evolves automatically.",
  },
  {
    question: "What is MCP and how does USSP support it?",
    answer:
      "MCP (Model Context Protocol) is an open standard that lets AI agents like Claude and ChatGPT access external data sources directly. USSP\u2019s platform exposes business context through MCP, so any AI agent framework can query real-time operational data \u2014 POS transactions, CRM records, staffing data, and more \u2014 without custom integration code.",
  },
  {
    question: "What does \u2018managed service\u2019 mean?",
    answer:
      "Every product USSP deploys comes with ongoing support. We build the custom integrations, configure business rules, and maintain the system as your business evolves. When APIs change, new data sources appear, or your workflows shift \u2014 we handle it. You focus on running your business, we keep the technology working.",
  },
  {
    question: "Can I use my own AI agent framework?",
    answer:
      "Yes. USSP\u2019s platform is framework-agnostic. Whether you use CrewAI, LangGraph, Claude, OpenAI, or a custom solution, we ensure your AI agents have current, contextual business data to reason over. We adapt to your stack, not the other way around.",
  },
  {
    question: "Can enterprises license USSP\u2019s platform?",
    answer:
      "Yes. USSP\u2019s Context-First AI framework is available for enterprise deployment. Bring the same production-proven platform to your organization \u2014 with your data, your rules, your infrastructure. Contact us to discuss how the framework can be adapted to your AI workflows.",
  },
  {
    question: "How does USSP handle data freshness and trust?",
    answer:
      "Every data point in our platform carries TTL (time-to-live) and trust scores via source tagging. Your AI agents know whether data is fresh or stale, and how reliable it is based on its source (e.g., POS transaction data vs. manual entry vs. third-party API). As business data changes, the AI context evolves automatically \u2014 no manual refresh needed.",
  },
  {
    question: "What industries do these products serve?",
    answer:
      "Our products are currently deployed in family entertainment centers, indoor recreation venues, and small businesses with 1-50 employees. The underlying architecture \u2014 data integration, AI workflows, communications intelligence \u2014 is industry-agnostic and can be adapted to any service-oriented business.",
  },
  {
    question: "How long does deployment take?",
    answer:
      "A typical deployment takes 4-8 weeks from discovery to go-live, depending on the number of data sources and customization needed. Some products (like the Competitive Intelligence Platform) can be operational within 2 weeks. Complex multi-product deployments may take 3-6 months.",
  },
  {
    question: "Do I need to replace my existing systems?",
    answer:
      "No. USSP\u2019s products integrate with your existing systems \u2014 we connect to your current POS, CRM, phone system, and other tools. Our platform sits on top of what you already use, unifying data without forcing you to switch vendors.",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-4">
            Platform &amp; Portfolio
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-6">
            Context-First AI for Business
          </h1>
          <p className="text-lg text-white/70 font-[family-name:var(--font-montserrat)] mb-4 max-w-3xl mx-auto">
            Your AI agents are only as smart as the context they can access.
            USSP&apos;s platform gives them business data that&apos;s fresh,
            trusted, and scored &mdash; with TTL, source tagging, and trust
            scores &mdash; so they reason with confidence, not guesses.
          </p>
          <p className="text-white/50 font-[family-name:var(--font-montserrat)] mb-8">
            Built on 20+ years of IT expertise. Deployed in production. Since
            2003.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#platform"
              className="px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
            >
              The Platform
            </a>
            <a
              href="#products"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-near-black transition-all"
            >
              See It In Production
            </a>
          </div>
        </div>
      </section>

      {/* The Context-First AI Platform */}
      <section id="platform" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading
            title="The Context-First AI Platform"
            subtitle="A framework that ensures your AI agents always have trusted, current business context"
          />

          {/* Three Pillars — Algolia Data Kit inspired layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            {/* Connect */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3">
                Connect
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Plug into your business systems with 34+ pre-built connectors.
                Every data point is source-tagged &mdash; your AI knows exactly
                where it came from.
              </p>
              <p className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)] mt-3">
                POS &middot; CRM &middot; Phone &middot; Staffing &middot;
                Marketing &middot; Census
              </p>
            </div>

            {/* Trust & Score */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3">
                Trust &amp; Score
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Data carries TTL (time-to-live) and trust scores. Your AI agents
                know what&apos;s fresh, what&apos;s stale, and how reliable each
                source is &mdash; no guessing.
              </p>
              <p className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)] mt-3">
                Source Tagging &middot; Freshness Tracking &middot; Reliability
                Scoring
              </p>
            </div>

            {/* Evolve */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3">
                Evolve
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                As your business data changes, AI context evolves automatically.
                Any framework &mdash; CrewAI, LangGraph, Claude, custom &mdash;
                always reasons over current, verified data.
              </p>
              <p className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)] mt-3">
                Real-Time Sync &middot; Auto-Updates &middot; Living Context
              </p>
            </div>
          </div>

          {/* Capabilities Row */}
          <div className="flex flex-wrap gap-3 justify-center mt-12 pt-8 border-t border-dark/10">
            {platformCapabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs bg-near-black text-white px-4 py-2 rounded-full font-[family-name:var(--font-montserrat)]"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Two Paths — Enterprise + SMB */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading
            title="Two Ways to Get Started"
            subtitle="Whether you're a growing business or a large enterprise"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Enterprise */}
            <div className="bg-near-black text-white rounded-lg p-8">
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3">
                Enterprise Framework
              </h3>
              <p className="text-white/70 font-[family-name:var(--font-montserrat)] text-sm mb-6 leading-relaxed">
                Bring USSP&apos;s Context-First AI platform to your
                organization. Deploy the framework with your data, your rules,
                your infrastructure. Production-proven across multiple
                deployments.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "License the full platform framework",
                  "Deploy on your infrastructure",
                  "Custom connectors for your data sources",
                  "USSP implementation support available",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-sm text-white/60 font-[family-name:var(--font-montserrat)] flex items-start gap-2"
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
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-block px-6 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
              >
                Talk to Us
              </a>
            </div>

            {/* SMB Managed Service */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3">
                Managed Service for SMBs
              </h3>
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] text-sm mb-6 leading-relaxed">
                USSP builds, deploys, and manages your AI-powered business
                platforms end-to-end. No AI team needed &mdash; we handle the
                technology so you can focus on running your business.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "USSP builds and manages everything",
                  "Custom integrations for your systems",
                  "Ongoing monitoring, updates, and support",
                  "20+ years of IT expertise behind every deployment",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] flex items-start gap-2"
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
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#products"
                className="inline-block px-6 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
              >
                See Our Products
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Deployed & Validated — Products */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Deployed &amp; Validated"
            subtitle="Production systems powered by the Context-First AI platform"
          />

          {categories.map((category) => (
            <div key={category.name} className="mb-12 last:mb-0">
              <h3 className="text-lg font-[family-name:var(--font-alata)] text-primary mb-6 uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.products.map((product) => (
                  <div
                    key={product.title}
                    className="bg-light-gray rounded-lg p-8 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-xl font-[family-name:var(--font-alata)] mb-2">
                      {product.title}
                    </h4>
                    <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] font-bold mb-4">
                      {product.tagline}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-[family-name:var(--font-montserrat)]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
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
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Detail */}
                    <p className="text-xs text-dark/50 font-[family-name:var(--font-montserrat)] leading-relaxed border-t border-dark/10 pt-4">
                      {product.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Model */}
      <ProcessTimeline
        title="How We Deliver"
        steps={deliverySteps}
      />

      {/* Why Context-First AI? */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Why Context-First AI?
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto leading-relaxed">
            AI agents are only as good as their context. But business data is
            messy &mdash; systems change, APIs break, rules evolve. Most AI
            implementations fail not because the models are bad, but because the
            data is stale, fragmented, or untrustworthy. USSP&apos;s platform
            solves this at the foundation layer &mdash; so your AI agents always
            have business context they can trust.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/ai-transformation"
              className="px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              AI Transformation Services
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

      {/* Tech Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Technology Stack"
            subtitle="Production-grade tools for production-grade solutions"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((stack) => (
              <div
                key={stack.category}
                className="p-6 bg-light-gray rounded-lg"
              >
                <h3 className="text-sm font-[family-name:var(--font-alata)] text-primary uppercase tracking-wider mb-2">
                  {stack.category}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                  {stack.items}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* JSON-LD: ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "USSP Context-First AI Platform — Product Portfolio",
            description:
              "Production-deployed Context-First AI platform and business applications. Managed services for SMBs, enterprise framework licensing. Since 2003.",
            itemListElement: categories.flatMap((cat, ci) =>
              cat.products.map((product, pi) => ({
                "@type": "ListItem",
                position: ci * 2 + pi + 1,
                item: {
                  "@type": "SoftwareApplication",
                  name: product.title,
                  description: product.tagline,
                  applicationCategory: "BusinessApplication",
                  provider: {
                    "@type": "Organization",
                    name: "USSP Inc. (US Software Professionals Inc.)",
                    foundingDate: "2003-01-23",
                    url: "https://www.ussp.co",
                  },
                },
              }))
            ),
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
          title="Let&apos;s Build Your AI Foundation"
          subtitle="Tell us about your business and we&apos;ll show you how Context-First AI can help."
        />
      </div>
    </>
  );
}
