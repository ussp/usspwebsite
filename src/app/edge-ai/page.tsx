import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import ProcessTimeline from "@/components/ProcessTimeline";
import ExpandableSection from "@/components/ExpandableSection";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Edge AI & Computer Vision Solutions | Facility Safety & Intelligence | USSP",
  description:
    "Since 2003, USSP delivers on-premises Edge AI and computer vision solutions for facility safety — anonymous person tracking, zone occupancy monitoring, real-time alerts. Privacy-first, no facial recognition, BIPA compliant. For government, commercial, healthcare, and industrial facilities.",
  keywords:
    "Edge AI, computer vision, AI video analytics, facility safety, VionOS.ai, anonymous person tracking, on-premises AI, NVIDIA Jetson, zone occupancy, real-time alerts, BIPA compliant, privacy-first AI, facility intelligence, security analytics, AI-powered surveillance alternative, Edge AI solutions Chicago, commercial facility safety, government facility AI",
  openGraph: {
    title:
      "Edge AI & Computer Vision Solutions | Facility Safety & Intelligence | USSP",
    description:
      "On-premises Edge AI and computer vision for facility safety. Anonymous person tracking, zone occupancy, real-time alerts — no facial recognition, no cloud. For government, commercial, healthcare, and industrial facilities.",
    type: "website",
  },
};

const capabilities = [
  {
    title: "Safety Monitoring",
    description:
      "Real-time person detection, staff-to-occupant ratio alerts, unattended zone detection, and restricted area intrusion alerts. Continuous monitoring without facial recognition.",
    items: [
      "Person detection & counting",
      "Staff ratio alerts",
      "Unattended zone detection",
      "Restricted area alerts",
    ],
  },
  {
    title: "Operations Intelligence",
    description:
      "Zone occupancy analytics, entry/exit counting, staff clustering detection, and queue monitoring. Data-driven insights for operational efficiency.",
    items: [
      "Zone occupancy analytics",
      "Entry/exit counting",
      "Staff clustering detection",
      "Queue monitoring",
    ],
  },
  {
    title: "Compliance & Audit",
    description:
      "Anonymous Person Tokens (SHA-256 hashed, 4-hour TTL), zone event logs, and full audit trails. No biometric data is ever captured or stored.",
    items: [
      "Anonymous Person Tokens (SHA-256)",
      "4-hour token TTL",
      "Zone event logs",
      "No biometrics stored",
    ],
  },
];

const industries = [
  {
    title: "Corrections & Juvenile Justice",
    description:
      "Youth safety monitoring, staff-to-youth ratio compliance, incident detection, and SB1366/BIPA-compliant surveillance alternatives.",
  },
  {
    title: "Healthcare Facilities",
    description:
      "Patient wandering alerts, fall risk zone monitoring, staff coverage optimization, and visitor flow analytics for hospitals and long-term care.",
  },
  {
    title: "Education & Campuses",
    description:
      "Campus occupancy monitoring, restricted zone alerts, emergency evacuation tracking, and building utilization analytics.",
  },
  {
    title: "Manufacturing & Warehouses",
    description:
      "Safety zone compliance, PPE detection areas, forklift zone alerts, loading dock monitoring, and occupancy-based HVAC optimization.",
  },
  {
    title: "Government & Public Sector",
    description:
      "Secure facility monitoring, visitor flow management, queue optimization, and TOPS-procurable deployment for Illinois state agencies.",
  },
  {
    title: "Entertainment & Venues",
    description:
      "Crowd density monitoring, queue wait-time estimation, zone capacity alerts, and real-time guest flow analytics for large venues.",
  },
];

const privacyFeatures = [
  {
    title: "No Facial Recognition",
    description:
      "VionOS.ai uses skeletal pose estimation and bounding-box tracking — never facial recognition or biometric identification.",
  },
  {
    title: "No Cloud Required",
    description:
      "All AI inference runs on-premises on NVIDIA Jetson hardware. Video frames never leave the facility network.",
  },
  {
    title: "No PII Captured",
    description:
      "No names, faces, or personally identifiable information are captured. Only anonymous spatial and behavioral data.",
  },
  {
    title: "BIPA Compliant",
    description:
      "Designed from the ground up to comply with the Illinois Biometric Information Privacy Act — no biometric data is collected, stored, or transmitted.",
  },
  {
    title: "On-Premises Processing",
    description:
      "NVIDIA Jetson Orin edge devices process video locally. No external API calls, no cloud dependencies, no data egress.",
  },
  {
    title: "Audit-Ready Logs",
    description:
      "Complete event logs with timestamps, zone IDs, and anonymous token trails. Ready for compliance audits and oversight reviews.",
  },
];

const faqItems = [
  {
    title: "What is Edge AI and how does it work?",
    content:
      "Edge AI means running artificial intelligence models directly on local hardware — at the 'edge' of the network — rather than sending data to the cloud. VionOS.ai runs computer vision models on NVIDIA Jetson devices installed at the facility. Cameras feed video to these local devices, which process frames in real time to detect people, track movement, and generate alerts. No video or data leaves the premises.",
  },
  {
    title: "What is VionOS.ai?",
    content:
      "VionOS.ai is USSP's Edge AI platform for facility safety and intelligence. It provides real-time computer vision analytics — person detection, zone occupancy monitoring, staff ratio alerts, and compliance logging — all running on-premises with no facial recognition and no cloud dependency. VionOS.ai is designed for government, commercial, healthcare, education, and industrial facilities.",
  },
  {
    title: "How does AI video analytics work without facial recognition?",
    content:
      "VionOS.ai uses skeletal pose estimation and bounding-box tracking to detect and count people without identifying who they are. Each detected person is assigned an Anonymous Person Token — a SHA-256 hashed identifier with a 4-hour time-to-live — that enables movement tracking within the facility without capturing any biometric or personally identifiable information. This approach is fully BIPA compliant.",
  },
  {
    title: "What industries can use Edge AI for facility safety?",
    content:
      "Edge AI facility safety solutions apply to corrections and juvenile justice, healthcare facilities, K-12 and university campuses, manufacturing and warehouses, government buildings, entertainment venues, retail stores, and any facility that needs real-time occupancy monitoring, safety alerts, or operational intelligence — without the privacy risks of facial recognition or cloud-based surveillance.",
  },
  {
    title: "Does video leave the facility?",
    content:
      "No. All video processing happens on-premises on NVIDIA Jetson edge devices. Raw video frames are never transmitted outside the facility network. Only structured event data (anonymous counts, zone occupancy numbers, alert triggers) can optionally be sent to a centralized dashboard — and even that is configurable and can remain fully on-premises.",
  },
  {
    title: "What hardware is required for on-premises AI?",
    content:
      "VionOS.ai runs on NVIDIA Jetson Orin edge devices — compact, energy-efficient AI computers that can process multiple camera feeds simultaneously. The platform works with existing IP camera infrastructure (RTSP streams). No GPU servers or data center equipment is required. A single Jetson device can typically handle 4-8 camera feeds depending on resolution and analytics complexity.",
  },
  {
    title: "How do Illinois state agencies procure this through TOPS?",
    content:
      "Illinois state agencies can engage USSP for Edge AI deployments through the TOPS Category Two contract (CMT4599470, BidBuy P-59947). USSP is an authorized subvendor to Krasan Consulting Services, the Primary Awardee. Agencies issue a Task Order through the existing TOPS vehicle — no separate RFP is needed. The contract is available through February 2034.",
  },
  {
    title: "How is Edge AI different from traditional CCTV monitoring?",
    content:
      "Traditional CCTV requires humans to watch screens in real time and review footage after incidents. Edge AI automates monitoring — it detects events as they happen, generates instant alerts, and logs everything with timestamps and zone data. It provides quantitative data (occupancy counts, dwell times, movement patterns) that CCTV cannot. And because VionOS.ai uses anonymous tracking, it delivers intelligence without the civil liberties concerns of facial recognition surveillance.",
  },
];

const deploymentSteps = [
  {
    number: 1,
    title: "Engagement Request",
    description: "Reach out or issue a Task Order via TOPS",
  },
  {
    number: 2,
    title: "AI Readiness Assessment",
    description: "We evaluate your facility, cameras, and requirements",
  },
  {
    number: 3,
    title: "Pilot Deployment",
    description: "On-premises pilot covering 1\u20132 use cases",
  },
  {
    number: 4,
    title: "Review & Optimize",
    description: "Performance review, tuning, and stakeholder sign-off",
  },
  {
    number: 5,
    title: "Scale & Expand",
    description: "Phased rollout to additional facilities and use cases",
  },
];

export default function EdgeAIPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-4">
            Powered by VionOS.ai
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-6">
            Edge AI &amp; Computer Vision for Facility Safety
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-3xl mx-auto">
            On-premises AI video analytics for real-time safety monitoring.
            Anonymous person tracking, zone occupancy intelligence, and instant
            alerts — without facial recognition, without the cloud. For
            government, commercial, healthcare, and industrial facilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-near-black font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Schedule a Demo
            </a>
            <a
              href="/assets/docs/USSP_EdgeAI_CapabilityBrief.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-primary bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
            >
              Download Capability Brief
            </a>
            <a
              href="#overview"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-near-black transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="overview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Platform Overview"
            subtitle="VionOS.ai — Edge AI for facility safety and operational intelligence"
          />
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed text-center">
              VionOS.ai is USSP&apos;s on-premises Edge AI platform that
              transforms existing camera infrastructure into an intelligent
              safety and operations layer. Using NVIDIA Jetson edge devices and
              advanced computer vision models, VionOS.ai delivers real-time
              person detection, zone occupancy analytics, and automated
              alerts — all without facial recognition, without biometric data,
              and without sending video to the cloud.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-light-gray rounded-lg p-6 text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                On-Premises
              </h3>
              <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                All processing on local NVIDIA Jetson hardware. No cloud
                dependency.
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6 text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                BIPA Compliant
              </h3>
              <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                No facial recognition. No biometrics. Illinois BIPA safe by
                design.
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6 text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                NVIDIA Jetson
              </h3>
              <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                Compact, energy-efficient edge AI hardware. 4-8 camera feeds per
                device.
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6 text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-sm font-bold mb-2">
                TOPS Available
              </h3>
              <p className="text-xs text-dark/60 font-[family-name:var(--font-montserrat)]">
                Illinois agencies can procure through TOPS Category Two
                (CMT4599470).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Core Capabilities"
            subtitle="AI-powered safety monitoring, operations intelligence, and compliance"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed mb-4">
                  {cap.description}
                </p>
                <ul className="space-y-2">
                  {cap.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-dark/60 font-[family-name:var(--font-montserrat)]"
                    >
                      <svg
                        className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
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
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Industries We Serve"
            subtitle="Edge AI facility safety for government, commercial, and institutional environments"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="p-6 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {ind.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                  {ind.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy by Design */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Privacy by Design"
            subtitle="Built from the ground up to protect civil liberties and comply with privacy law"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privacyFeatures.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <ProcessTimeline
        title="How to Get Started"
        subtitle="From initial engagement to scaled deployment"
        steps={deploymentSteps}
      />

      {/* Download Resources */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Resources"
            subtitle="Download capability briefs for your team and stakeholders"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                General Capability Brief
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed mb-6">
                Overview of the VionOS.ai Edge AI platform — capabilities,
                privacy architecture, industry applications, and procurement
                path. For any industry or audience.
              </p>
              <a
                href="/assets/docs/USSP_EdgeAI_CapabilityBrief.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
              >
                Download Brief
              </a>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                IDJJ &amp; IDOC Capability Brief
              </h3>
              <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed mb-6">
                Corrections-specific brief covering youth safety monitoring,
                SB1366 compliance, staff-to-youth ratios, and BIPA-compliant
                deployment for Illinois juvenile and adult facilities.
              </p>
              <a
                href="/assets/docs/USSP_EdgeAI_CapabilityBrief_IDJJ_IDOC.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
              >
                Download Brief
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-dark/50 font-[family-name:var(--font-montserrat)] mt-8">
            More department-specific briefs coming soon.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Common questions about Edge AI, VionOS.ai, and on-premises computer vision"
          />
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <ExpandableSection
                key={faq.title}
                title={faq.title}
                content={faq.content}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Ready to Explore Edge AI for Your Facility?
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a government agency, healthcare facility,
            manufacturer, or campus — VionOS.ai delivers real-time safety
            intelligence without compromising privacy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Schedule a Demo
            </a>
            <a
              href="/assets/docs/USSP_EdgeAI_CapabilityBrief.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all"
            >
              Download Brief
            </a>
            <Link
              href="/discover"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all"
            >
              Contact Us
            </Link>
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
            name: "VionOS.ai — Edge AI Safety & Facility Intelligence Platform",
            description:
              "On-premises Edge AI and computer vision platform for facility safety. Anonymous person tracking, zone occupancy monitoring, real-time alerts — no facial recognition, no cloud, BIPA compliant. For government, commercial, healthcare, and industrial facilities.",
            provider: {
              "@type": "Organization",
              name: "USSP Inc. (US Software Professionals Inc.)",
              foundingDate: "2003-01-23",
              description:
                "Since 2003, USSP delivers technology solutions including Edge AI, IT staffing, and software development. MBE, WBE, and DBE certified. Chicago, IL headquarters.",
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
            areaServed: [
              { "@type": "Country", name: "United States" },
              { "@type": "State", name: "Illinois" },
            ],
            serviceType: [
              "Edge AI Deployment",
              "Computer Vision Analytics",
              "Facility Safety Monitoring",
              "On-Premises AI Solutions",
              "Zone Occupancy Intelligence",
              "Privacy-First Video Analytics",
            ],
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
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.content,
              },
            })),
          }),
        }}
      />

      {/* Contact */}
      <div id="contact">
        <ContactForm
          title="Schedule a Demo or Ask a Question"
          subtitle="Tell us about your facility and use case — we'll show you how Edge AI can help."
        />
      </div>
    </>
  );
}
