import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "AI Training - USSP",
  description: "AI & Machine Learning Training Curriculum for Teams and Professionals. Hands-on courses in Generative AI, LLMs, Computer Vision, NLP, and MLOps.",
};

const modules = [
  {
    number: 1,
    title: "Foundations of AI & Machine Learning",
    topics: "AI landscape overview, supervised vs unsupervised learning, neural network fundamentals, model training lifecycle, key frameworks (TensorFlow, PyTorch)",
  },
  {
    number: 2,
    title: "Data Engineering for AI",
    topics: "Data collection and preprocessing, feature engineering, data pipelines, handling imbalanced datasets, data versioning and governance",
  },
  {
    number: 3,
    title: "Natural Language Processing (NLP)",
    topics: "Text preprocessing, tokenization, embeddings, sentiment analysis, named entity recognition, text classification, transformer architecture",
  },
  {
    number: 4,
    title: "Large Language Models (LLMs)",
    topics: "GPT, Claude, and LLaMA architectures, prompt engineering, fine-tuning, RAG (Retrieval-Augmented Generation), context windows, token optimization",
  },
  {
    number: 5,
    title: "Generative AI Applications",
    topics: "Text generation, image generation (Stable Diffusion, DALL-E), code generation, AI agents, multi-modal models, responsible AI practices",
  },
  {
    number: 6,
    title: "Computer Vision",
    topics: "Image classification, object detection, image segmentation, CNNs, transfer learning, real-time video analysis, edge deployment",
  },
  {
    number: 7,
    title: "AI in the Enterprise",
    topics: "AI strategy and roadmap, use case identification, ROI assessment, change management, AI governance frameworks, compliance and ethics",
  },
  {
    number: 8,
    title: "Prompt Engineering & AI Integration",
    topics: "Advanced prompting techniques, chain-of-thought, few-shot learning, API integration, building AI-powered applications, tool use and function calling",
  },
  {
    number: 9,
    title: "MLOps & Model Deployment",
    topics: "Model versioning, CI/CD for ML, containerization, cloud deployment (AWS SageMaker, Azure ML, GCP Vertex AI), monitoring and drift detection",
  },
  {
    number: 10,
    title: "AI Agents & Automation",
    topics: "Autonomous agents, multi-agent systems, workflow automation, tool integration, memory and planning, agent frameworks (LangChain, CrewAI)",
  },
  {
    number: 11,
    title: "AI Security & Responsible AI",
    topics: "Adversarial attacks, prompt injection, model safety, bias detection and mitigation, explainability (XAI), regulatory compliance",
  },
  {
    number: 12,
    title: "Capstone Project & Certification",
    topics: "End-to-end AI solution design, team-based project, real-world dataset application, presentation and peer review, certification assessment",
  },
];

const goals = [
  "Understand the foundations of AI, machine learning, and deep learning",
  "Build and deploy large language model (LLM) applications",
  "Apply prompt engineering and RAG techniques for enterprise use cases",
  "Develop computer vision and NLP solutions using modern frameworks",
  "Implement MLOps practices for production-grade AI systems",
  "Design AI agents and automation workflows",
  "Evaluate AI ethics, security, and governance frameworks",
  "Deliver an end-to-end AI capstone project",
];

export default function AITraining() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            AI & Machine Learning Training
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            For Teams and Professionals
          </p>
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

      {/* AI Transformation CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-alata)] mb-4">
            Training Is Just the Beginning
          </h2>
          <p className="text-white/80 font-[family-name:var(--font-montserrat)] mb-8 max-w-2xl mx-auto">
            This AI &amp; ML curriculum powers the Accelerate phase of
            USSP&apos;s end-to-end AI Transformation framework. Combine
            training with readiness assessment, strategy, and talent staffing
            for a complete AI adoption journey.
          </p>
          <Link
            href="/ai-transformation"
            className="inline-block px-8 py-3 bg-white text-primary font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
          >
            Explore AI Transformation Services
          </Link>
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
