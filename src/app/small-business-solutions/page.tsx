import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Small Business Solutions - USSP",
  description: "Great solutions at an affordable price. Access to enterprise grade tools and platform at fraction of the price.",
};

const services = [
  {
    title: "Website and Branding",
    tagline: "Modern, clean and easy to maintain website",
    description: "We help small businesses establish their online presence with modern, responsive websites that are easy to maintain and update.",
  },
  {
    title: "Email and Collaboration",
    tagline: "Cloud hosted secured Email and other Collaboration apps",
    description: "Professional email with your company domain. We help you choose between Google Workspace, Microsoft 365, Zoho, or Rackspace based on your needs.",
  },
  {
    title: "Sales and Marketing",
    tagline: "Never too small for Customer Relationship Management (CRM)",
    description: "Implement CRM systems, email campaigns, and social media campaign automation to grow your business systematically.",
  },
  {
    title: "Data Backup and Recovery",
    tagline: "Cloud is not a final stop",
    description: "Onsite and offsite backup solutions including Synology and qNAP implementations to keep your data safe.",
  },
  {
    title: "Finance",
    tagline: "Invoicing, Accounting and Online Payments",
    description: "Set up accounting software, online payments, and recurring billing to streamline your financial operations.",
  },
  {
    title: "Human Resources",
    tagline: "Recruit and Manage talent",
    description: "Payroll, time-off management, and employee administration tools tailored for small businesses.",
  },
  {
    title: "Help Desk",
    tagline: "One stop shop for your customer service",
    description: "Unified help desk and ticketing system to manage customer inquiries efficiently.",
  },
  {
    title: "Custom Business Apps",
    tagline: "Store? Mobile App? Blog? Automation? You Got it!",
    description: "Custom stores, mobile apps, blogs, and automation solutions built specifically for your business needs.",
  },
];

const processSteps = [
  { number: 1, title: "Interview and Evaluate", description: "Understand your business needs" },
  { number: 2, title: "Design", description: "Create the right solution" },
  { number: 3, title: "Plan", description: "Map out the implementation" },
  { number: 4, title: "Implement", description: "Build and deploy" },
  { number: 5, title: "Monitor", description: "Track and measure" },
  { number: 6, title: "Repeat", description: "Continuous improvement" },
];

export default function SmallBusinessSolutions() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        heading="Great Solutions at an affordable price"
        subheading="Access to enterprise grade tools and platform at fraction of the price, along with a team of seasoned professionals to guide you along the way."
        buttonText="Really?"
        buttonHref="#intro"
        backgroundImage="/assets/images/small-biz-hero.jpg"
      />

      {/* Introduction */}
      <section id="intro" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Introduction"
            subtitle="What we do and Why we do it?"
          />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p className="font-bold text-lg text-dark">
              Welcome to our Small Business Division Page
            </p>
            <p>
              Our small business division has been established to serve
              businesses with 1-50 employees. Thanks to cloud revolution in IT,
              business apps have become ubiquitous, there is no one right answer
              and a plethora of options.
            </p>
            <p>
              We started this division to serve a specific need which our clients
              have. Our contact with clients starts mostly with a request for a
              website, mobile app or a store site.
            </p>
            <p>
              As you read further you will see various business apps that can be
              implemented. Please keep in mind that you do not have to implement
              them all.
            </p>
            <p>
              We are not re-sellers for a particular company who is pushing their
              solutions on you. Think of us like your own person CTO or advisory
              board.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <a
              href="#services"
              className="px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
            >
              Small Business Services
            </a>
            <a
              href="#process"
              className="px-8 py-3 border-2 border-near-black text-near-black font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-near-black hover:text-white transition-all"
            >
              Our Process
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <div id="process">
        <ProcessTimeline
          title="Our Process"
          subtitle="Implementing effective business systems in an incremental process."
          steps={processSteps}
        />
      </div>

      {/* Services */}
      <section id="services" className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Services Offered" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-alata)] font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-[family-name:var(--font-alata)] mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] mb-3">
                      {service.tagline}
                    </p>
                    <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm
        title="Contact Us"
        subtitle="Don't be afraid to reach out. You + us = awesome."
        email="accounts@ussoftwarepro.com"
      />
    </>
  );
}
