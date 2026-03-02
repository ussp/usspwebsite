"use client";

import { useState } from "react";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  showAddress?: boolean;
  email?: string;
}

export default function ContactForm({
  title = "Contact Us",
  subtitle,
  showAddress = true,
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
          <p className="text-center text-dark/70 font-[family-name:var(--font-montserrat)] mb-10">
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {showAddress && (
            <div className="space-y-4 font-[family-name:var(--font-montserrat)]">
              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-alata)] mb-2">
                  Address
                </h3>
                <p className="text-dark/70">
                  875 N Michigan Ave, Suite 3100
                  <br />
                  Chicago, IL 60614
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-alata)] mb-2">
                  Phone
                </h3>
                <p className="text-dark/70">+1-(312) 546-4306</p>
              </div>
              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-alata)] mb-2">
                  Email
                </h3>
                <p className="text-dark/70">{email}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-alata)] mb-2">
                  Hours
                </h3>
                <p className="text-dark/70">Mon - Fri 8:00 am to 5:00 pm</p>
              </div>
            </div>
          )}

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
                  className="w-full px-4 py-3 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  className="w-full px-4 py-3 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-dark/20 rounded-md font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md font-[family-name:var(--font-alata)] text-sm transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
