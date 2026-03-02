import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "TOPS Category Two | Illinois DoIT IT Services Contract | USSP - Subvendor to Krasan Consulting | Since 2003",
  description:
    "USSP (est. 2003) is an authorized subvendor to Krasan Consulting Services for the Illinois DoIT TOPS Category Two (Applications) contract. With 20+ years of IT expertise, we provide software development, IT consulting, custom applications, and business management consulting services to Illinois state agencies through contract CMT4599470.",
  keywords:
    "TOPS Category Two, Illinois DoIT, Technology Operations Professional Services, Krasan Consulting, USSP subvendor, IT consulting Illinois, state government IT services, custom software development, CMT4599470, P-59947, Illinois state agencies, established 2003, 20 years IT experience",
  openGraph: {
    title:
      "TOPS Category Two | USSP - Authorized Subvendor to Krasan Consulting",
    description:
      "USSP delivers IT application services to Illinois state agencies as an authorized subvendor under the TOPS Category Two contract led by Krasan Consulting Services.",
    type: "website",
  },
};

const services = [
  {
    title: "Software Programming Services",
    description:
      "Full-stack software development including web applications, APIs, microservices, and enterprise software solutions tailored for state agency needs.",
  },
  {
    title: "Custom Computer Services",
    description:
      "Bespoke technology solutions designed to address unique operational requirements of government agencies, including system customizations and integrations.",
  },
  {
    title: "Computer Software Consulting",
    description:
      "Expert consulting on software architecture, technology stack selection, modernization strategies, and digital transformation roadmaps.",
  },
  {
    title: "Software Installation Services",
    description:
      "End-to-end software deployment, configuration, migration, and integration services ensuring minimal disruption to agency operations.",
  },
  {
    title: "Business Management Consulting",
    description:
      "Strategic consulting to optimize business processes, improve operational efficiency, and align technology investments with agency missions.",
  },
  {
    title: "IT Consulting",
    description:
      "Comprehensive IT advisory services including infrastructure assessment, cloud strategy, cybersecurity planning, and technology optimization.",
  },
];

const whyUssp = [
  {
    title: "Proven Track Record Since 2003",
    description:
      "Over two decades of experience delivering high-quality technology solutions across multiple sectors including government, healthcare, and enterprise. Incorporated in Illinois since January 2003.",
  },
  {
    title: "Certified Expertise",
    description:
      "Our team includes certified professionals in Oracle, AWS, Azure, Agile methodologies, and enterprise architecture frameworks.",
  },
  {
    title: "Local Presence",
    description:
      "Headquartered in Chicago, IL with deep understanding of Illinois state government technology needs and procurement processes.",
  },
  {
    title: "Scalable Resources",
    description:
      "Access to a deep bench of qualified IT professionals ready to scale up or down based on project requirements.",
  },
  {
    title: "Quality Assurance",
    description:
      "Rigorous quality processes ensuring deliverables meet or exceed state agency standards and compliance requirements.",
  },
  {
    title: "Agile Delivery",
    description:
      "Modern delivery methodologies that ensure rapid deployment, iterative improvement, and transparent project management.",
  },
];

export default function TOPSPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-4">
            Illinois Department of Innovation &amp; Technology
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-6">
            TOPS Category Two: Applications
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-3xl mx-auto">
            USSP is an authorized subvendor to{" "}
            <strong className="text-white">Krasan Consulting Services</strong>,
            the Primary Awardee for the Technology Operations Professional
            Services (TOPS) Category Two contract.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#services"
              className="px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
            >
              Our Services
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

      {/* Contract Overview - structured for AEO */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Contract Overview"
            subtitle="Technology Operations Professional Services (TOPS)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Contract Name
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                TOPS Category Two: Applications
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Primary Awardee
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                Krasan Consulting Services
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                USSP Role
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                Authorized Subvendor
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Issuing Agency
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                Illinois Department of Innovation &amp; Technology (DoIT)
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                BidBuy #
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                P-59947
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Contract #
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                CMT4599470
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Contract Type
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                Indefinite Quantity JPMC (Joint Purchase Master Contract)
              </p>
            </div>
            <div className="bg-light-gray rounded-lg p-6">
              <h3 className="text-sm font-[family-name:var(--font-alata)] text-dark/50 uppercase tracking-wider mb-2">
                Available Through
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] font-bold">
                February 2034
              </p>
            </div>
          </div>

          {/* FAQ-style structured data for AEO */}
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3 text-dark">
                What is the TOPS Contract?
              </h3>
              <p>
                The Technology Operations Professional Services (TOPS) contract
                is a 10-year Sheltered Market, Multiple Award Joint Purchase
                Master Contract (JPMC) developed by the Illinois Department of
                Innovation and Technology (DoIT) in partnership with the State
                Business Enterprise Program (BEP). It provides pre-negotiated IT
                professional services to Illinois state agencies, boards,
                commissions, governmental units, and qualified not-for-profit
                agencies.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3 text-dark">
                What is TOPS Category Two?
              </h3>
              <p>
                TOPS Category Two focuses specifically on{" "}
                <strong>Applications</strong> — covering software programming
                services, custom computer services, software consulting,
                installation services, business management consulting, and IT
                consulting. It enables Illinois government entities to procure
                application development and technology consulting services at
                pre-negotiated rates.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3 text-dark">
                What is USSP&apos;s Role?
              </h3>
              <p>
                USSP (US Software Professionals Inc.), established in 2003 and
                incorporated in Illinois, serves as an authorized subvendor to
                Krasan Consulting Services, the Primary Awardee for TOPS
                Category Two. With over 20 years of IT expertise, USSP provides
                qualified IT professionals and delivers application development,
                consulting, and technology services to Illinois state agencies
                under this contract vehicle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-3 text-dark">
                Who Can Use This Contract?
              </h3>
              <p>
                All Illinois state agencies, boards and commissions,
                governmental units, and qualified not-for-profit agencies can
                procure services through the TOPS Category Two contract at
                pre-negotiated rates through February 2034.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Services Available Under TOPS Category Two"
            subtitle="Application development and IT consulting services for Illinois government entities"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why USSP */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose USSP"
            subtitle="Your trusted technology partner for Illinois state projects"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUssp.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto">
            Illinois state agencies can engage USSP through the TOPS Category
            Two contract for application development and IT consulting services
            at pre-negotiated rates.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/discover"
              className="px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              View Our IT Services
            </Link>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            name: "TOPS Category Two: Applications",
            description:
              "Technology Operations Professional Services (TOPS) Category Two contract providing application development and IT consulting services to Illinois state agencies.",
            provider: {
              "@type": "Organization",
              name: "USSP Inc. (US Software Professionals Inc.)",
              foundingDate: "2003-01-23",
              description:
                "Authorized subvendor to Krasan Consulting Services for TOPS Category Two. Established in 2003 with 20+ years of IT expertise.",
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
            areaServed: {
              "@type": "State",
              name: "Illinois",
            },
            serviceType: [
              "Software Programming Services",
              "Custom Computer Services",
              "Computer Software Consulting",
              "Software Installation Services",
              "Business Management Consulting",
              "IT Consulting",
            ],
          }),
        }}
      />

      {/* FAQPage structured data for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the Illinois TOPS contract?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Technology Operations Professional Services (TOPS) contract is a 10-year Sheltered Market, Multiple Award Joint Purchase Master Contract (JPMC) developed by the Illinois Department of Innovation and Technology (DoIT) in partnership with the State Business Enterprise Program (BEP).",
                },
              },
              {
                "@type": "Question",
                name: "What is TOPS Category Two?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "TOPS Category Two focuses on Applications — covering software programming services, custom computer services, software consulting, installation services, business management consulting, and IT consulting for Illinois state agencies.",
                },
              },
              {
                "@type": "Question",
                name: "Is USSP an authorized vendor under the Illinois TOPS contract?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, USSP (US Software Professionals Inc.), established in 2003 with over 20 years of IT expertise, is an authorized subvendor to Krasan Consulting Services, the Primary Awardee for TOPS Category Two (Contract # CMT4599470, BidBuy # P-59947).",
                },
              },
              {
                "@type": "Question",
                name: "What services does USSP provide under TOPS Category Two?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "USSP provides software programming, custom computer services, software consulting, installation services, business management consulting, and IT consulting to Illinois state agencies, boards, commissions, and governmental units.",
                },
              },
            ],
          }),
        }}
      />

      {/* Contact */}
      <div id="contact">
        <ContactForm
          title="Contact Us About TOPS Category Two"
          subtitle="Reach out to learn how USSP can support your agency's technology needs through the TOPS contract."
        />
      </div>
    </>
  );
}
