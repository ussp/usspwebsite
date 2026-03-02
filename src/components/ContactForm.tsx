"use client";

import { useState } from "react";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  showAddress?: boolean;
  showMap?: boolean;
  email?: string;
}

export default function ContactForm({
  title = "Contact Us",
  subtitle,
  showAddress = true,
  showMap = true,
  email = "accounts@ussoftwarepro.com",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] text-center mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-primary font-[family-name:var(--font-montserrat)] mb-10 italic">
            {subtitle}
          </p>
        )}

        <div
          className={`grid gap-8 max-w-6xl mx-auto ${
            showAddress
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 max-w-xl"
          }`}
        >
          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <p className="text-green-800 font-[family-name:var(--font-montserrat)]">
                  Thanks for the message. We will get in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name *"
                  required
                  className="w-full px-4 py-3 border border-dark/20 bg-white rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  className="w-full px-4 py-3 border border-dark/20 bg-white rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-dark/20 bg-white rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-dark/20 bg-white rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-[family-name:var(--font-alata)] text-sm transition-colors"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          {showAddress && showMap && (
            <div className="rounded-lg overflow-hidden h-[300px] md:h-full min-h-[280px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.1!2d-87.6245!3d41.8988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca3e2d94695%3A0x4a745099c0e145ae!2s875%20N%20Michigan%20Ave%20%233100%2C%20Chicago%2C%20IL%2060611!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="USSP Office Location - 875 N Michigan Ave, Chicago"
              />
            </div>
          )}

          {/* Contact Info */}
          {showAddress && (
            <div className="space-y-5 font-[family-name:var(--font-montserrat)]">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p className="text-dark/70 text-sm">
                  875 N Michigan Ave, 3100
                  <br />
                  Chicago IL 60614
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                <p className="text-dark/70 text-sm">
                  Mon - Fri 8:00 am to 5:00 pm
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <p className="text-dark/70 text-sm">
                  Phone: +1-(312) 546-4306
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <p className="text-dark/70 text-sm">
                  Fax: +1-(312) 253-2026
                </p>
              </div>
              {email && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <p className="text-dark/70 text-sm">{email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
