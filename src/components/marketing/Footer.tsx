"use client";

import Link from "next/link";
import Image from "next/image";

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
  merchants: [
    { label: "Sell on SaveGoal", href: "/merchants/sell" },
    { label: "Merchant Dashboard", href: "/merchants/dashboard" },
    { label: "Partner Program", href: "/merchants/partner" },
    { label: "Integration API", href: "/merchants/api" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const paymentMethods = [
  { label: "MTN MOMO", color: "bg-[#ffcc00]", textColor: "text-black" },
  { label: "Visa", color: "bg-[#1a1f71]", textColor: "text-white" },
  { label: "Mastercard", color: "bg-[#eb001b]", textColor: "text-white" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: "fb" },
  { name: "Instagram", href: "https://instagram.com", icon: "ig" },
  { name: "X", href: "https://x.com", icon: "x" },
];

export function Footer() {
  return (
    <footer className="bg-[#212d67] text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/SavegoalLogo.png"
                alt="SaveGoal"
                width={160}
                height={56}
                className="h-30 w-auto"
              />
            </div>
            <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed mb-6">
              Save smarter, own faster. The future of shopping in Africa.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#3d4a99] hover:bg-[#4850a5] rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  {social.icon === "fb" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  )}
                  {social.icon === "ig" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                  )}
                  {social.icon === "x" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
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

          {/* Merchants Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Merchants</h3>
            <ul className="space-y-3">
              {footerLinks.merchants.map((link) => (
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
            <div className="flex items-center gap-2 text-[#5e7fc1] text-sm">
              <span className="w-5 h-5 border border-[#5e7fc1] rounded-full flex items-center justify-center text-xs">©</span>
              <span>{new Date().getFullYear()} SaveGoal. All rights reserved.</span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-[#5e7fc1] text-sm">Payment Methods:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method.label}
                    className={`${method.color} ${method.textColor} rounded px-3 py-1 text-xs font-bold`}
                  >
                    {method.label}
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
