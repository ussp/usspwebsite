import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "ODI Training - USSP",
  description: "Oracle Data Integrator Training Curriculum for Administrators and Developers",
};

const modules = [
  {
    number: 1,
    title: "Introduction",
    topics: "ODI overview, architecture, components, graphical modules, agent types, repository overview",
  },
  {
    number: 2,
    title: "Repositories and Agents",
    topics: "Repository administration, storage spaces, master/work repository creation, agent management, listener/scheduler/web agent, load balancing",
  },
  {
    number: 3,
    title: "Topology: Overview",
    topics: "Data servers, physical schemas, logical architecture, context views",
  },
  {
    number: 4,
    title: "Topology: Physical/Logical Architecture",
    topics: "Topology planning and mapping, physical to logical schema mapping",
  },
  {
    number: 5,
    title: "Designer: Projects and Folders",
    topics: "Project creation, folder organization, knowledge modules, object exchange, markers",
  },
  {
    number: 6,
    title: "Designer: Model Concepts",
    topics: "Metadata, reverse engineering, datastore creation, constraints, keys, references",
  },
  {
    number: 7,
    title: "Designer: Interface Concepts",
    topics: "Interface fundamentals, business rules, mappings, filters, joins, staging areas, knowledge module usage",
  },
  {
    number: 8,
    title: "Designer: Designing Interfaces",
    topics: "Multi-source datastores, join creation, filtering, transformation specs, staging area configuration",
  },
  {
    number: 9,
    title: "Operator: Monitoring and Debugging",
    topics: "Session monitoring, execution troubleshooting, generated code review, error handling",
  },
  {
    number: 10,
    title: "Designer: Advanced Interface Topics",
    topics: "Business rules, variables, user functions, substitution methods, custom KM development",
  },
  {
    number: 11,
    title: "Designer: Procedures",
    topics: "Procedure creation, command additions, execution, result viewing",
  },
  {
    number: 12,
    title: "Designer: Packages",
    topics: "Package creation/execution, advanced packaging, error handling, execution path control, loops",
  },
  {
    number: 13,
    title: "Operator: Scenarios and Versions",
    topics: "Scenario management, version control, automation, scheduling, deployment",
  },
  {
    number: 14,
    title: "Designer: Data Quality",
    topics: "Data quality enforcement, source/target quality controls, data exploration, auditing",
  },
  {
    number: 15,
    title: "Changed Data Capture (Optional)",
    topics: "CDC techniques, strategies, consistency, journalizing",
  },
  {
    number: 16,
    title: "Administration: Advanced Topics",
    topics: "Open tools, security policies, password policies, SDK automation",
  },
];

const goals = [
  "Describe architecture of Oracle Data Integrator",
  "Apply ODI Topology concepts for data integration",
  "Describe ODI Model concepts",
  "Design ODI Interfaces, Procedures, and Packages to perform ELT data transformations",
  "Explore, audit data, and enforce data quality with ODI",
  "Administer ODI resources and setup security with ODI",
  "Implement Changed Data Capture with ODI",
  "Use ODI Web services and perform integration of ODI with SOA",
];

export default function ODITraining() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            Oracle Data Integrator Training Curriculum
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            For Administrators and Developers
          </p>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-10 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-lg font-[family-name:var(--font-montserrat)] mb-4">
            Check out our blog
          </p>
          <a
            href="http://www.odipundits.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-primary transition-all"
          >
            ODI Pundits
          </a>
        </div>
      </section>

      {/* Goals */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Learning Goals"
            subtitle="This curriculum enables learners to:"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-light-gray rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-alata)]">
                  {i + 1}
                </span>
                <p className="text-sm text-dark/80 font-[family-name:var(--font-montserrat)]">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading title="Training Modules" />
          <div className="space-y-4">
            {modules.map((mod) => (
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

      {/* Contact */}
      <ContactForm
        title="Contact Us"
        subtitle="For Availability, Pricing and Customization options"
        email="accounts@ussoftwarepro.com"
      />
    </>
  );
}
