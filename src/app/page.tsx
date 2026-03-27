import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero with Video Background */}
      <HeroSection
        heading="Welcome to USSP"
        subheading="Better Things Together!"
        buttonText="About Us"
        buttonHref="#about"
        videoId="IY4ZjNNuNGI"
      />

      {/* Service Division Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/discover"
              className="relative group h-72 rounded-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: "url(/assets/images/tech-grid.jpg)",
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h3 className="text-2xl font-[family-name:var(--font-alata)] text-white mb-4">
                  Information Technology
                </h3>
                <span className="px-6 py-2 border-2 border-white text-white text-sm font-[family-name:var(--font-alata)] uppercase tracking-wider hover:bg-white hover:text-near-black transition-all">
                  Learn More
                </span>
              </div>
            </Link>
            <Link
              href="/edge-ai"
              className="relative group h-72 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-near-black" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:from-primary/30 transition-colors" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <p className="text-xs text-primary font-[family-name:var(--font-montserrat)] uppercase tracking-widest mb-2">
                  Powered by SmartSite
                </p>
                <h3 className="text-2xl font-[family-name:var(--font-alata)] text-white mb-4">
                  Edge AI &amp; Computer Vision
                </h3>
                <span className="px-6 py-2 border-2 border-white text-white text-sm font-[family-name:var(--font-alata)] uppercase tracking-wider hover:bg-white hover:text-near-black transition-all">
                  Learn More
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="About Us" />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p>
              <strong>Established in 2003</strong>, USSP (US Software
              Professionals Inc.) has been at the forefront of the staffing and
              technology industry for over two decades. We are dedicated to
              revolutionizing the staffing industry by integrating cutting-edge
              technology with exceptional talent. Our goal is to provide
              innovative solutions that drive fundamental business value and
              enhance the effectiveness of the organizations we serve.
            </p>
            <p>
              Founded in Chicago, IL, with more than 20 years of technological
              innovation, we have expanded our expertise responding to the
              growing needs for specialized staffing solutions across various
              sectors. With additional offices in India and Canada, we leverage
              global insights to deliver local excellence.
            </p>
            <p>
              We are pioneers at the intersection of technology and human
              potential. Our services are designed to be adaptive and
              forward-thinking, ensuring that we meet the challenges of today
              while preparing for the opportunities of tomorrow.
            </p>
            <p>
              Diversity and expertise define our team. Comprised of industry
              veterans, innovative engineers, and dedicated professionals, our
              people are at the heart of our success.
            </p>
            <p>
              We seek individuals who are passionate about making a difference
              through innovation and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="relative py-32 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url(/assets/images/values-bg.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] text-white mb-6">
            Our Core Values
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-[family-name:var(--font-montserrat)] italic">
            Integrity, Innovation, Respect, Accountability and Excellence
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Recruitment Services",
                icon: "/assets/icons/recruitment.svg",
                text: "Is your team missing a niche expert? Let our experienced team help you in augmenting your team with the missing expertise. Our recruiters can help in identifying, interviewing and present best candidate for Direct hire or Staff Augmentation.",
              },
              {
                title: "Solution Delivery",
                icon: "/assets/icons/solution-delivery.svg",
                text: "Our team has a proven reputation for delivering high quality software solutions across a broad spectrum of technologies. We put needs of the customer before us. We delivered solutions in Oracle ERP, consumer mobile applications, enterprise mobile applications, AWS ecosystem, Azure ecosystem, Iron IO, UX design.",
              },
              {
                title: "Product Development",
                icon: "/assets/icons/product-dev.svg",
                text: "Starting as early as you have an idea for software product development solutions, we work with you to analyze, build, design, and release a final product to market based on the Lean Startup methodology.",
              },
              {
                title: "Custom Training",
                icon: "/assets/icons/custom-training.svg",
                text: "We are as passionate about education and training as we are about development. Let our team help you put together custom training solutions. Explore our vast library of pre-recorded courses and labs.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="text-center p-6 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {service.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Focus" />

          {/* Data Analytics + AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h3 className="text-2xl font-[family-name:var(--font-alata)] mb-2">
                Data Analytics + Artificial Intelligence
              </h3>
              <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] mb-4">
                Big Data + Quantitative Analytics + Visualization
              </p>
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                In the world of connected entities, more data means more
                opportunity. Our Data Analytics division can help you unlock the
                value. It starts with aggregation and compilation of data in a
                big data cluster then we apply machine learning models on our
                data set. We present and consume the data using next-gen
                visualization platforms.
              </p>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/assets/images/data-analytics.jpg"
                alt="Data Analytics"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* IoT + Cloud + Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div className="relative h-64 rounded-lg overflow-hidden md:order-1 order-2">
              <Image
                src="/assets/images/iot-cloud.jpg"
                alt="IoT + Cloud + Mobile"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:order-2 order-1">
              <h3 className="text-2xl font-[family-name:var(--font-alata)] mb-2">
                IoT + Cloud + Mobile
              </h3>
              <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] mb-4">
                Mobile First + Cloud First + Connected Devices
              </p>
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Connected things need different paradigm of thinking than the
                yesteryear&apos;s web models. Developing IoT solutions means expertise
                in writing software for embedded devices and software to scale
                with them. Our Solution delivery team can help you combine
                machine and sensor data with the power of cloud and mobile.
              </p>
            </div>
          </div>

          {/* Technology Advisory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-[family-name:var(--font-alata)] mb-2">
                Technology Advisory + Agile Transformation
              </h3>
              <p className="text-sm text-primary font-[family-name:var(--font-montserrat)] mb-4">
                Enterprise Architecture + Portfolio Management
              </p>
              <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
                Our leadership team has an extensive expertise in delivery
                Enterprise architecture services to Fortune 500 companies. We
                also serve as a technology advisor for several startups focusing
                on delivering IoT, mobile and analytic solutions.
              </p>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/assets/images/tech-advisory.jpg"
                alt="Technology Advisory"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Work / Portfolio */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Work" />
          <p className="text-center text-dark/60 font-[family-name:var(--font-montserrat)] -mt-6 mb-10">
            Some of the awesome projects which we are a part of!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            <a
              href="https://www.versaquant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-white rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
            >
              <div className="w-48 h-20 relative mb-4">
                <Image
                  src="/assets/logos/versaquant.svg"
                  alt="VersaQuant - Intelligent investing simplified"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-lg">
                VersaQuant
              </h3>
            </a>
            <a
              href="https://www.sensemyform.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-white rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
            >
              <div className="w-40 h-24 relative mb-4">
                <Image
                  src="/assets/logos/sensemyform.png"
                  alt="SenseMyForm - Improve your running form"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-lg">
                SenseMyForm
              </h3>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
