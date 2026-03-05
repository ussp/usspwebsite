import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - USSP",
  description:
    "Privacy Policy for US Software Professionals Inc. (USSP). Since 2003, USSP is committed to protecting the privacy of job applicants, clients, and website visitors.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <section className="pt-28 pb-12 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-white/60 font-[family-name:var(--font-montserrat)]">
            Last updated: March 3, 2026
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-8 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              1. Introduction
            </h2>
            <p>
              US Software Professionals Inc. (&ldquo;USSP,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website{" "}
              <strong>www.ussp.co</strong> or use our online job application system.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Information you provide directly:</strong> When you apply for a
                job through our careers portal, we collect your name, email address,
                phone number, and resume/CV file. We also record your SMS consent
                preference and the timestamp of that consent.
              </li>
              <li>
                <strong>Information from third-party sign-in:</strong> If you choose to
                sign in with LinkedIn, we receive your name, email address, profile
                picture, locale, and email verification status from LinkedIn via OpenID
                Connect. We do not access your LinkedIn connections, messages, or any
                other LinkedIn data.
              </li>
              <li>
                <strong>Automatically collected information:</strong> We may collect
                standard web server log data such as your IP address, browser type, and
                pages visited.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and evaluate your job application</li>
              <li>To communicate with you regarding your application status</li>
              <li>To send SMS messages about job opportunities (only with your explicit consent)</li>
              <li>To send job alert notifications when new positions are posted (only if you opt in)</li>
              <li>To pre-fill application forms when you sign in with LinkedIn</li>
              <li>To improve our website and application process</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              4. LinkedIn Integration
            </h2>
            <p>
              Our job application portal offers an optional &ldquo;Sign in with
              LinkedIn&rdquo; feature. When you use this feature, we only request access
              to your basic profile information (name and email address) through
              LinkedIn&apos;s OpenID Connect protocol. We do <strong>not</strong> post
              to your LinkedIn account, access your connections, or read your messages.
              You can revoke this access at any time through your{" "}
              <a
                href="https://www.linkedin.com/psettings/permitted-services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn privacy settings
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              5. SMS Communications &amp; TCPA Consent
            </h2>
            <p className="mb-3">
              USSP may send SMS text messages regarding job opportunities and
              application updates only with your explicit consent, provided during
              the application process.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may opt out at any time by replying STOP to any message or by contacting us directly.</li>
              <li>Consent to receive SMS is not a condition of employment or application.</li>
              <li>Message frequency varies. Standard message and data rates may apply.</li>
              <li>We record the timestamp of your consent for compliance purposes.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              6. Data Storage and Security
            </h2>
            <p>
              Your application data and uploaded resumes are stored securely using
              industry-standard encryption and access controls. Resume files are stored
              in a private, access-controlled storage bucket. Only authorized USSP
              personnel involved in the hiring process can access your application data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              7. Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties.
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>With hiring managers and authorized personnel evaluating your application</li>
              <li>With service providers who assist us in operating our website (e.g., hosting, storage) under strict confidentiality agreements</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              8. Data Retention
            </h2>
            <p>
              We retain your application data for up to 24 months after submission to
              consider you for future opportunities. You may request deletion of your
              data at any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              9. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for LinkedIn sign-in at any time</li>
              <li>Opt out of SMS communications by replying STOP or contacting us</li>
              <li>Unsubscribe from job alert notifications at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-[family-name:var(--font-alata)] text-dark mb-3">
              10. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your
              data rights, contact us at:
            </p>
            <div className="mt-3 bg-light-gray rounded-lg p-4">
              <p className="font-[family-name:var(--font-alata)] text-dark">
                US Software Professionals Inc.
              </p>
              <p>875 N Michigan Ave, Suite 3100</p>
              <p>Chicago, IL 60614</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:accounts@ussoftwarepro.com"
                  className="text-primary hover:underline"
                >
                  accounts@ussoftwarepro.com
                </a>
              </p>
              <p>Phone: +1-(312) 546-4306</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
