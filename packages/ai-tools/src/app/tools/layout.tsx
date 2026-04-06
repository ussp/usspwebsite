import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: "index, follow",
};

export default function PublicToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Public Header */}
      <header className="border-b border-light-gray bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/tools" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-dark">
              USSP <span className="text-dark/50 font-normal">Free Tools</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/tools"
              className="text-sm text-dark/60 hover:text-primary transition-colors"
            >
              All Tools
            </Link>
            <a
              href="https://www.ussp.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dark/60 hover:text-primary transition-colors"
            >
              USSP.co
            </a>
            <Link
              href="/login"
              className="text-sm px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Tool Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-light-gray py-8 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark/40">
          <p>&copy; {new Date().getFullYear()} US Software Professionals Inc. Since 2003.</p>
          <div className="flex gap-4">
            <Link href="/tools" className="hover:text-primary transition-colors">
              Free Tools
            </Link>
            <a href="https://www.ussp.co" className="hover:text-primary transition-colors">
              About USSP
            </a>
            <a href="https://www.ussp.co/careers" className="hover:text-primary transition-colors">
              Careers
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
