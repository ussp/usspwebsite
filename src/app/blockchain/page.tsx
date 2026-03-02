import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Blockchain - USSP",
  description: "USSP Blockchain consulting, development and hosting services.",
};

const services = [
  {
    title: "Advise",
    description:
      "USSP will provide the required insight to help you to overcome your challenge and pursue business objectives. Our blockchain consulting services don't merely give you a few iconic use case examples. What we really care about is shaping a technically sound and feasible solution that brings measurable efficiency.",
  },
  {
    title: "Implement",
    description:
      "We can develop dApps, NFT Marketplace, Asset Tokenization, Wallet Development, Smart Contracts, Node Development. Our implementation services range from small contract development to extensive implementation of enterprise-wide blockchain implementation.",
  },
  {
    title: "Host & Manage",
    description:
      "Our state-of-the-art NOC center can help with keeping the blockchain platform secure and up. If your implementation uses public blockchain, we can host and run nodes managing your staking pools or you can delegate assets to our company-managed staking pools.",
  },
];

const processSteps = [
  { number: 1, title: "Discovery", description: "Feasibility Study of the blockchain project with our expert team. Mapping business goals and workflows." },
  { number: 2, title: "Assessment", description: "Analyze the Business requirements and discover specific processes which can benefit from blockchain." },
  { number: 3, title: "Technical Stack Design", description: "Identify the right blockchain platform based on the business requirements. Architect the relevant components." },
  { number: 4, title: "MVP", description: "Create a Minimum Viable Product for a single use case to demonstrate the viability of the solution." },
  { number: 5, title: "Development", description: "Upon MVP acceptance, expand the blockchain stack to rest of the use cases identified during assessment." },
  { number: 6, title: "Operate", description: "Use the DevOps model to maintain the stability of the application. Monitor and perform proactive maintenance and security operations." },
];

const platforms = [
  {
    name: "Ethereum",
    description: "Decentralized open-source blockchain with smart contract functionality.",
    color: "#627EEA",
  },
  {
    name: "Solana",
    description: "Solana is a public blockchain platform. It achieves consensus using the Proof of History mechanism.",
    color: "#9945FF",
  },
  {
    name: "Corda",
    description: "Permissioned network, an open-source platform designed for financial organizations.",
    color: "#EC1D24",
  },
  {
    name: "Hyperledger Fabric",
    description: "A permissioned blockchain with modular architecture with smart contract capability.",
    color: "#2F3134",
  },
];

export default function Blockchain() {
  return (
    <>
      {/* Hero with Video */}
      <HeroSection
        heading="Blockchain Solutions"
        subheading="Advise. Implement. Host & Manage."
        buttonText="Read More"
        buttonHref="#services"
        videoId="IY4ZjNNuNGI"
      />

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Blockchain Services" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow text-center"
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

      {/* Process */}
      <ProcessTimeline
        title="Our Process"
        steps={processSteps}
      />

      {/* Platforms */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Blockchain Development Platforms" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-[family-name:var(--font-alata)] font-bold"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.name[0]}
                </div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {platform.name}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
