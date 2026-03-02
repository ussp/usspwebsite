import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactForm from "@/components/ContactForm";
import ExpandableSection from "@/components/ExpandableSection";

export const metadata: Metadata = {
  title: "Healthcare Staffing - USSP",
  description: "Your gateway to the American Dream. We're hiring registered nurses, physical therapists and occupational therapists.",
};

const programSections = [
  {
    title: "Achievements",
    content:
      "USSP Inc, together with our partners, has realized the aspirations of thousands of international healthcare professionals. We have transformed the dreams of numerous international healthcare professionals into reality. With our distinguished support programs and seasoned teams, our expertise in international staffing is unmatched.",
  },
  {
    title: "Opportunity",
    content:
      "Joining the USSP Healthcare Professionals program means you gain the backing of dedicated expert teams, committed to ensuring your success in the USA! By becoming a member of the USSP Healthcare Professionals program, you are supported by dedicated teams of experts focused on your success in the USA!",
  },
  {
    title: "Process",
    content:
      "We streamline the licensure and immigration procedures, making them straightforward for you. Our excellent clinical and cultural support is designed to aid in your rapid adaptation, both professionally and personally, to your new workplace and community.",
  },
  {
    title: "Support",
    content:
      "Our prestigious support programs and teams of skilled experts set us apart as leaders in international staffing. Our outstanding clinical and cultural support is customized to help you adapt quickly and effectively, both in your professional and personal life, to your new work and living environments.",
  },
];

const whyUssp = [
  { title: "Nursing Education", description: "Comprehensive NCLEX preparation and continuing education programs." },
  { title: "Immigration & Licensure", description: "End-to-end immigration and licensure support for healthcare professionals." },
  { title: "Transitions Program", description: "Cultural and professional transition support to help you adapt to life in the USA." },
  { title: "Career Opportunities", description: "Access to top healthcare facilities across the United States." },
  { title: "Benefits", description: "Competitive compensation and comprehensive benefits packages." },
  { title: "Ongoing Support", description: "Continuous support throughout your career journey with USSP." },
];

const howItWorks = [
  { number: 1, title: "Apply Online", description: "Complete our online application form." },
  { number: 2, title: "Interview", description: "Tell us about your American Dream and nursing experience." },
  { number: 3, title: "Accept Offer", description: "Sign your employment agreement with USSP." },
  { number: 4, title: "Document Collection", description: "Submit all required documents to get ready for our program." },
  { number: 5, title: "U.S. Licensure & NCLEX-RN Review", description: "Pass the NCLEX-RN the first time with USSP!" },
  { number: 6, title: "Begin Your Journey", description: "Start your rewarding career in the United States." },
];

export default function HealthcareStaffing() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        heading="For Healthcare Professionals"
        subheading="Your gateway to American Dream"
        buttonText="Start Your Journey"
        buttonHref="#journey"
        backgroundImage="/assets/images/healthcare-hero.jpg"
      />

      {/* Start Your Journey */}
      <section id="journey" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHeading title="Start your journey with USSP!" />
          <p className="text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed mb-8">
            We&apos;re hiring registered nurses, physical therapists and
            occupational therapists from around the globe! We are dedicated to
            helping you pursue your career as a healthcare professional in the
            USA. Our comprehensive programs provide everything you need to
            succeed.
          </p>
        </div>
      </section>

      {/* USSP Program */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="USSP Program"
            subtitle="Comprehensive support process for the healthcare professionals"
          />
          <div className="space-y-4">
            {programSections.map((section) => (
              <ExpandableSection
                key={section.title}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why USSP */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Why USSP" />
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

      {/* How It Works */}
      <ProcessTimeline
        title="How It Works"
        steps={howItWorks}
      />

      {/* Contact */}
      <ContactForm
        title="Start Your Journey Today"
        subtitle="Apply now and take the first step towards your American Dream"
      />
    </>
  );
}
