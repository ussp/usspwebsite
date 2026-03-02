import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Careers - USSP",
  description: "Join USSP - We seek individuals who are passionate about making a difference through innovation and quality.",
};

export default function Careers() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            Careers at USSP
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            Join our team of innovators
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Why Join USSP?"
            subtitle="We seek individuals who are passionate about making a difference through innovation and quality."
          />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p>
              At USSP, we are dedicated to revolutionizing the staffing industry
              by integrating cutting-edge technology with exceptional talent.
              Diversity and expertise define our team. Comprised of industry
              veterans, innovative engineers, and dedicated professionals, our
              people are at the heart of our success.
            </p>
            <p>
              With offices in Chicago, India, and Canada, we offer global career
              opportunities across multiple disciplines including technology,
              healthcare staffing, blockchain, and consulting.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Open Positions"
            subtitle="We are always looking for talented individuals to join our team."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Software Engineers",
                location: "Chicago, IL / Remote",
                type: "Full-time",
              },
              {
                title: "Healthcare Recruiters",
                location: "Chicago, IL",
                type: "Full-time",
              },
              {
                title: "IT Consultants",
                location: "Multiple Locations",
                type: "Contract / Full-time",
              },
              {
                title: "Blockchain Developers",
                location: "Remote",
                type: "Full-time",
              },
              {
                title: "Data Analysts",
                location: "Chicago, IL / Remote",
                type: "Full-time",
              },
              {
                title: "Project Managers",
                location: "Chicago, IL",
                type: "Full-time",
              },
            ].map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2">
                  {job.title}
                </h3>
                <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] mb-1">
                  {job.location}
                </p>
                <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-[family-name:var(--font-montserrat)]">
                  {job.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm
        title="Get In Touch"
        subtitle="Send us your resume and a brief introduction. We'd love to hear from you."
      />
    </>
  );
}
