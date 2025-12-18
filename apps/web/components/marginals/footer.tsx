import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4 text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Home
              </Link>
              <Link
                href="/code-of-conduct"
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Code of Conduct
              </Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-900 mb-4 text-base">Legal</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/terms-and-conditions"
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-policy"
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Refund Policy
              </Link>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-base">Contact Us</h3>
            <a
              href="mailto:team@nitrutsav.in"
              className="text-gray-600 hover:text-gray-900 hover:underline transition-colors font-medium"
            >
              team@nitrutsav.in
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
            <a
              href="https://gdsc-nitr.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Made with ❤️ by DSC NIT Rourkela
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
