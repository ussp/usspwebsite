import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-near-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-alata)] font-bold mb-4">
              USSP
            </h3>
            <p className="text-white/70 text-sm font-[family-name:var(--font-montserrat)]">
              Better Things Together
            </p>
            <p className="text-white/50 text-xs font-[family-name:var(--font-montserrat)] mt-2">
              Serving clients since 2003
            </p>
            <a
              href="https://www.linkedin.com/company/ussp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-white/70 hover:text-white transition-colors"
              aria-label="Follow USSP on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-sm font-[family-name:var(--font-montserrat)]">Follow us</span>
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-[family-name:var(--font-alata)] font-bold mb-4 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-white/70 font-[family-name:var(--font-montserrat)]">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  IT Services
                </Link>
              </li>
              <li>
                <Link href="/small-business-solutions" className="hover:text-white transition-colors">
                  Small Business Solutions
                </Link>
              </li>
              <li>
                <Link href="/blockchain" className="hover:text-white transition-colors">
                  Blockchain
                </Link>
              </li>
              <li>
                <Link href="/ai-training" className="hover:text-white transition-colors">
                  AI Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Healthcare */}
          <div>
            <h4 className="text-sm font-[family-name:var(--font-alata)] font-bold mb-4 uppercase tracking-wider">
              Healthcare
            </h4>
            <ul className="space-y-2 text-sm text-white/70 font-[family-name:var(--font-montserrat)]">
              <li>
                <Link href="/healthcare-staffing" className="hover:text-white transition-colors">
                  Healthcare Professionals
                </Link>
              </li>
              <li>
                <Link href="/healthcare-organization" className="hover:text-white transition-colors">
                  Healthcare Organizations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-[family-name:var(--font-alata)] font-bold mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70 font-[family-name:var(--font-montserrat)]">
              <li>875 N Michigan Ave, 3100</li>
              <li>Chicago IL 60614</li>
              <li>+1-(312) 546-4306</li>
              <li>Fax: +1-(312) 253-2026</li>
              <li>Mon - Fri 8:00 am to 5:00 pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/50 font-[family-name:var(--font-montserrat)]">
          &copy; {new Date().getFullYear()} US Software Professionals Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
