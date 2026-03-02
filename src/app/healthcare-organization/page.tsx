import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Healthcare Organization - USSP",
  description: "USSP Healthcare Organization staffing solutions. We are here to meet your most critical staffing needs.",
};

const services = [
  {
    title: "Direct Placement",
    description:
      "We provide qualified, pre-screened international healthcare professionals for permanent positions at your facility. Our rigorous selection process ensures you receive top-tier candidates.",
  },
  {
    title: "Travel Nursing",
    description:
      "Flexible staffing solutions to address temporary shortages. Our travel nurses are experienced professionals ready to integrate into your team quickly and effectively.",
  },
  {
    title: "International Recruitment",
    description:
      "Access a global pool of healthcare talent. We handle the entire process from recruitment to immigration, licensure, and placement at your facility.",
  },
];

const advantages = [
  { number: 1, title: "Needs Assessment", description: "We start by understanding your specific staffing requirements and organizational culture." },
  { number: 2, title: "Candidate Matching", description: "Our team identifies and pre-screens candidates that match your requirements." },
  { number: 3, title: "Credentialing", description: "We verify all credentials, licenses, and certifications before placement." },
  { number: 4, title: "Onboarding Support", description: "We provide comprehensive onboarding support for placed professionals." },
  { number: 5, title: "Ongoing Partnership", description: "Continuous support and follow-up to ensure satisfaction for both parties." },
];

export default function HealthcareOrganization() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        heading="For Healthcare Organizations"
        subheading="We are here to meet your most critical staffing needs."
        buttonText="Contact Us"
        buttonHref="mailto:medicalstaffing@ussp.co"
        backgroundImage="/assets/images/healthcare-hero.jpg"
      />

      {/* Nursing Shortage */}
      <section className="py-20 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-6">
            Nursing Shortage
          </h2>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            Don&apos;t let worry over the nurse shortage keep you up at night.
            We&apos;ve got you covered!
          </p>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-[family-name:var(--font-alata)] mb-4">
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

      {/* Our Advantage */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Advantage" />
          <div className="space-y-6 max-w-3xl mx-auto">
            {advantages.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-6 bg-white rounded-lg p-6 shadow-sm"
              >
                <span className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-[family-name:var(--font-alata)] font-bold">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm
        title="Partner With Us"
        subtitle="Contact our healthcare staffing team"
        email="medicalstaffing@ussp.co"
      />
    </>
  );
}
