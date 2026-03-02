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
                <Link href="/odi-training" className="hover:text-white transition-colors">
                  ODI Training
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
          All rights reserved by USSP
        </div>
      </div>
    </footer>
  );
}
