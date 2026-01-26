"use client";

import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Browse Products", href: "/products" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Mobile App", href: "/mobile-app" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const paymentMethods = ["MTN MOMO", "Visa", "Mastercard"];

export function Footer() {
  return (
    <footer className="bg-[#212d67] text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-10">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">SaveGoal</div>
            <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed">
              Save smarter, own faster. The future of shopping in Africa.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#9bbcff] transition-colors text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#9bbcff] transition-colors text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#9bbcff] transition-colors text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#5e7fc1]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-[#5e7fc1] text-sm">
              © {new Date().getFullYear()} SaveGoal. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-[#5e7fc1] text-sm">Payment Methods:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="bg-[#8aabee] border border-[#9bbcff] rounded px-3 py-1 text-xs font-bold text-white"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
