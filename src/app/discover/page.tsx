import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "IT Services - USSP",
  description: "USSP IT Services - Data Analytics, IoT, Cloud, Mobile, and Technology Advisory",
};

export default function Discover() {
  return (
    <>
      {/* Hero Slider */}
      <section className="pt-16">
        <div className="relative h-[70vh] bg-near-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-alata)] mb-4">
                Analytics
              </h1>
              <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
                React &gt; Predict &gt; Prescribe - Where are you at?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-white">
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

      {/* Services */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Services" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Recruitment Services",
                icon: "/assets/icons/recruitment.svg",
                text: "Is your team missing a niche expert? Let our experienced team help you in augmenting your team with the missing expertise.",
              },
              {
                title: "Solution Delivery",
                icon: "/assets/icons/solution-delivery.svg",
                text: "Our team has a proven reputation for delivering high quality software solutions across a broad spectrum of technologies.",
              },
              {
                title: "Product Development",
                icon: "/assets/icons/product-dev.svg",
                text: "We work with you to analyze, build, design, and release a final product to market based on the Lean Startup methodology.",
              },
              {
                title: "Custom Training",
                icon: "/assets/icons/custom-training.svg",
                text: "We are as passionate about education and training as we are about development. Explore our vast library of courses and labs.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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

      {/* Portfolio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Work" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            <a
              href="http://getthinglist.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
            >
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src="/assets/logos/thinglist.svg"
                  alt="Thinglist"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-lg">
                Thinglist
              </h3>
            </a>
            <a
              href="http://www.versaquant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 rounded-lg border border-dark/10 hover:shadow-lg transition-shadow"
            >
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src="/assets/logos/versaquant.svg"
                  alt="Versa Quant"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-alata)] text-lg">
                Versa Quant
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
