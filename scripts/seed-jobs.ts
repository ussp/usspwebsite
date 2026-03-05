import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.log("No .env.local found, using existing environment variables");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const now = new Date().toISOString();

const sampleJobs = [
  {
    title: "Senior Software Engineer",
    slug: "senior-software-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `Join USSP as a Senior Software Engineer and lead the design and development of scalable enterprise applications for government agencies and Fortune 500 clients. You'll work with modern technology stacks, mentor junior developers, and drive architectural decisions on high-impact projects.

**Responsibilities**
- Design and build scalable web applications, REST APIs, and microservices
- Lead code reviews, establish best practices, and mentor junior engineers
- Collaborate with solution architects and business analysts to translate requirements into technical designs
- Optimize application performance, reliability, and security
- Participate in Agile ceremonies and contribute to sprint planning
- Evaluate and recommend new technologies and frameworks

**Requirements**
- 5+ years of professional software engineering experience
- Strong proficiency in one or more: TypeScript/JavaScript, Python, Java, or C#
- Experience with modern frameworks (React, Next.js, Angular, or Vue)
- Solid understanding of relational databases (PostgreSQL, SQL Server) and cloud platforms (AWS, Azure)
- Experience with CI/CD pipelines, containerization (Docker), and version control (Git)
- Strong problem-solving skills and ability to work independently

**Nice to Have**
- Experience with government IT projects or TOPS-style contracts
- Cloud certifications (AWS Solutions Architect, Azure Developer)
- Experience with AI/ML integrations or LLM-powered applications
- Knowledge of enterprise architecture patterns and microservices

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "Full-Stack Developer",
    slug: "full-stack-developer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is looking for a Full-Stack Developer to build end-to-end features across front-end and back-end systems. You'll work on diverse projects spanning government modernization, enterprise platforms, and AI-powered applications using modern web technologies.

**Responsibilities**
- Develop responsive front-end interfaces using React, Next.js, and TypeScript
- Build and maintain back-end services, APIs, and database schemas
- Integrate third-party services, APIs, and cloud infrastructure
- Write clean, well-tested, and documented code
- Collaborate with designers, product managers, and fellow developers
- Troubleshoot and resolve production issues across the full stack

**Requirements**
- 3+ years of full-stack development experience
- Proficiency in React or Next.js for front-end development
- Experience with Node.js, Python, or similar back-end technologies
- Working knowledge of PostgreSQL, MongoDB, or other databases
- Familiarity with RESTful API design and GraphQL
- Experience with Git, CI/CD, and modern development workflows

**Nice to Have**
- Experience with Tailwind CSS or modern CSS frameworks
- Familiarity with Supabase, Firebase, or similar BaaS platforms
- Exposure to AI/ML APIs (OpenAI, Anthropic, Hugging Face)
- Experience with serverless architectures or edge computing

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is hiring a DevOps Engineer to build and maintain cloud infrastructure, CI/CD pipelines, and deployment automation for enterprise and government clients. You'll ensure our applications are reliable, scalable, and secure across multiple cloud environments.

**Responsibilities**
- Design, build, and maintain CI/CD pipelines for automated testing and deployment
- Manage cloud infrastructure on AWS and Azure using Infrastructure as Code (Terraform, CloudFormation)
- Implement monitoring, alerting, and logging solutions (CloudWatch, Datadog, ELK)
- Automate provisioning, configuration management, and deployment processes
- Ensure security best practices including IAM, network policies, and secrets management
- Support development teams with containerization (Docker, Kubernetes) and environment management

**Requirements**
- 3+ years of DevOps or Site Reliability Engineering experience
- Strong experience with AWS or Azure cloud services
- Proficiency with CI/CD tools (GitHub Actions, Jenkins, GitLab CI)
- Experience with containerization (Docker) and orchestration (Kubernetes, ECS)
- Knowledge of Infrastructure as Code (Terraform, Ansible, or CloudFormation)
- Scripting skills in Bash, Python, or PowerShell

**Nice to Have**
- AWS or Azure certifications
- Experience with FedRAMP or government compliance frameworks
- Knowledge of service mesh architectures (Istio, Consul)
- Experience with GitOps workflows and ArgoCD

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "QA Engineer",
    slug: "qa-engineer",
    location: "Chicago, IL",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is seeking a QA Engineer to ensure the quality and reliability of enterprise and government applications. You'll develop test strategies, build automation frameworks, and work closely with development teams to deliver defect-free software.

**Responsibilities**
- Design and execute comprehensive test plans for web and API applications
- Build and maintain automated test suites using modern testing frameworks
- Perform functional, regression, integration, and performance testing
- Identify, document, and track defects through resolution
- Collaborate with developers and product managers to define acceptance criteria
- Contribute to continuous improvement of QA processes and tools

**Requirements**
- 3+ years of software quality assurance experience
- Experience with test automation frameworks (Selenium, Cypress, Playwright, or Jest)
- Strong knowledge of API testing tools (Postman, REST Assured)
- Familiarity with Agile/Scrum methodologies
- Understanding of SQL and database testing
- Excellent analytical and communication skills

**Nice to Have**
- Experience with performance testing tools (JMeter, k6, Locust)
- ISTQB or similar QA certification
- Experience testing government or healthcare applications
- Knowledge of accessibility testing (WCAG, Section 508)

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "IT Consultant",
    slug: "it-consultant",
    location: "Chicago, IL / Springfield, IL",
    type: "Contract",
    posted_at: now,
    active: true,
    description: `USSP is looking for an IT Consultant to provide technology advisory services to Illinois state agencies under the TOPS Category Two contract. You'll advise on cloud strategy, application modernization, and digital transformation initiatives across state government.

**Responsibilities**
- Assess client technology environments and recommend modernization strategies
- Develop IT roadmaps, architecture diagrams, and implementation plans
- Advise on cloud migration (AWS, Azure, GCP) and hybrid infrastructure strategies
- Support digital transformation initiatives across state agency operations
- Prepare technical documentation, SOWs, and project deliverables
- Collaborate with state agency stakeholders, project managers, and vendor teams

**Requirements**
- 5+ years of IT consulting or technology advisory experience
- Strong understanding of enterprise IT architecture and cloud platforms
- Experience with state government or public sector clients
- Excellent communication and presentation skills
- Ability to translate technical concepts for non-technical stakeholders
- Willingness to work on-site in Springfield, IL or Chicago, IL as needed

**Nice to Have**
- Experience with Illinois DoIT or TOPS contract engagements
- Cloud certifications (AWS, Azure, or GCP)
- Knowledge of government procurement and compliance frameworks
- Experience with ERP systems (Oracle, SAP, Workday)

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Competitive contract rates
- Professional development and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "Solution Architect",
    slug: "solution-architect",
    location: "Chicago, IL",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is seeking a Solution Architect to design enterprise-scale technical architectures for complex government and commercial engagements. You'll bridge business requirements and technology solutions, leading teams through design, implementation, and delivery.

**Responsibilities**
- Design end-to-end solution architectures for enterprise applications and integrations
- Evaluate technology options and make recommendations based on client requirements
- Create architecture documentation, data flow diagrams, and technical specifications
- Lead technical discussions with clients, vendors, and development teams
- Ensure solutions meet security, scalability, and compliance requirements
- Guide development teams during implementation and provide technical oversight

**Requirements**
- 7+ years of experience in software engineering with 3+ years in architecture roles
- Deep expertise in cloud platforms (AWS, Azure) and enterprise integration patterns
- Experience designing microservices, event-driven, and API-first architectures
- Strong knowledge of databases, messaging systems, and caching strategies
- Experience with government or enterprise-scale projects
- TOGAF, AWS Solutions Architect, or equivalent certification preferred

**Nice to Have**
- Experience with AI/ML architecture and LLM integration patterns
- Knowledge of FedRAMP, NIST, or government compliance frameworks
- Experience with legacy modernization and migration projects
- Familiarity with blockchain and distributed systems

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "Business Analyst",
    slug: "business-analyst",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is hiring a Business Analyst to bridge the gap between business stakeholders and engineering teams on enterprise projects. You'll gather and refine requirements, create detailed specifications, and ensure delivered solutions meet client expectations.

**Responsibilities**
- Elicit, document, and analyze business requirements from stakeholders
- Create user stories, process flows, wireframes, and functional specifications
- Facilitate workshops, interviews, and JAD sessions with business and technical teams
- Manage requirements traceability and change requests throughout the project lifecycle
- Support UAT planning, test case development, and go-live activities
- Identify process improvement opportunities and recommend solutions

**Requirements**
- 3+ years of business analysis experience in IT or software projects
- Strong proficiency in requirements documentation (user stories, BRDs, FRDs)
- Experience with Agile methodologies and tools (Jira, Confluence, Azure DevOps)
- Excellent communication, facilitation, and stakeholder management skills
- Analytical mindset with strong problem-solving abilities
- Knowledge of SQL and data analysis basics

**Nice to Have**
- CBAP, CCBA, or PMI-PBA certification
- Experience with government IT projects or procurement processes
- Familiarity with data visualization tools (Tableau, Power BI)
- Understanding of AI/ML concepts and their business applications

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    location: "Chicago, IL",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is seeking a Project Manager to lead cross-functional teams delivering technology solutions for government and enterprise clients. You'll manage project scope, timelines, budgets, and stakeholder relationships using Agile and traditional methodologies.

**Responsibilities**
- Plan, execute, and close projects on time, within scope, and on budget
- Lead cross-functional teams of developers, analysts, and consultants
- Manage project risks, issues, dependencies, and change requests
- Facilitate Agile ceremonies (standups, sprint planning, retrospectives)
- Communicate project status to stakeholders, sponsors, and leadership
- Develop project plans, schedules, resource plans, and status reports

**Requirements**
- 5+ years of IT project management experience
- PMP, CSM, or equivalent certification
- Experience managing projects using Agile, Scrum, or Waterfall methodologies
- Proficiency with project management tools (Jira, MS Project, Azure DevOps)
- Strong leadership, communication, and conflict resolution skills
- Experience managing budgets ranging from $500K to $5M+

**Nice to Have**
- Experience with government contracts and public sector project delivery
- SAFe certification or experience with scaled Agile frameworks
- Knowledge of ITIL or IT service management frameworks
- Familiarity with AI/ML project lifecycles

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "Data Analyst",
    slug: "data-analyst",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is looking for a Data Analyst to transform complex datasets into actionable insights for enterprise and government clients. You'll build dashboards, develop reports, and support data-driven decision making across diverse industries.

**Responsibilities**
- Analyze large datasets to identify trends, patterns, and business insights
- Build interactive dashboards and visualizations using modern BI tools
- Write complex SQL queries and develop data pipelines for reporting
- Collaborate with stakeholders to define KPIs and reporting requirements
- Ensure data quality, accuracy, and consistency across reporting systems
- Document data sources, transformations, and business logic

**Requirements**
- 3+ years of data analysis or business intelligence experience
- Advanced SQL skills and experience with relational databases (PostgreSQL, SQL Server)
- Proficiency with visualization tools (Tableau, Power BI, or Looker)
- Experience with Python or R for data analysis and scripting
- Strong analytical and problem-solving skills
- Excellent communication skills with the ability to present data insights to non-technical audiences

**Nice to Have**
- Experience with cloud data platforms (Snowflake, BigQuery, Redshift)
- Knowledge of statistical modeling and machine learning basics
- Experience with ETL/ELT tools (dbt, Airflow, Fivetran)
- Familiarity with government reporting requirements and compliance

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
  {
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    posted_at: now,
    active: true,
    description: `USSP is hiring an AI/ML Engineer to build and deploy machine learning models, LLM integrations, and AI-powered solutions for enterprise clients. You'll work at the forefront of applied AI, turning research into production systems that drive real business value.

**Responsibilities**
- Design, train, and deploy machine learning models for classification, NLP, and computer vision
- Build LLM-powered applications using OpenAI, Anthropic Claude, and open-source models
- Develop and maintain ML pipelines, feature stores, and model monitoring systems
- Integrate AI capabilities into existing enterprise applications and workflows
- Evaluate model performance, conduct A/B testing, and optimize for production
- Stay current with AI/ML research and recommend new approaches to business problems

**Requirements**
- 3+ years of experience in machine learning or AI engineering
- Strong Python skills with experience in PyTorch, TensorFlow, or scikit-learn
- Experience with LLMs and prompt engineering (OpenAI API, Anthropic, Hugging Face)
- Knowledge of NLP, computer vision, or recommendation systems
- Experience with MLOps tools and model deployment (MLflow, SageMaker, or similar)
- Understanding of data engineering fundamentals (SQL, data pipelines, feature engineering)

**Nice to Have**
- Experience building AI agents or multi-agent systems (CrewAI, LangGraph, AutoGen)
- Knowledge of RAG (Retrieval-Augmented Generation) architectures
- Experience with vector databases (Pinecone, Weaviate, pgvector)
- Familiarity with responsible AI practices and model governance
- Publications or contributions to open-source AI projects

**What We Offer**
- Comprehensive 12-module AI & Machine Learning training program
- Work on cutting-edge AI projects across industries
- Cross-industry project exposure: government, healthcare, Fortune 500, startups
- Health, dental, and vision benefits
- Flexible remote/hybrid work arrangements
- Professional development budget and career growth paths
- Collaborative, innovation-driven culture since 2003`,
  },
];

async function seed() {
  console.log(`Seeding ${sampleJobs.length} positions into Supabase...`);

  const { data, error } = await supabase
    .from("positions")
    .upsert(sampleJobs, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding positions:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted/updated ${data.length} positions:`);
  for (const job of data) {
    console.log(`  - ${job.title} (${job.location}) [${job.type}]`);
  }
}

seed();
