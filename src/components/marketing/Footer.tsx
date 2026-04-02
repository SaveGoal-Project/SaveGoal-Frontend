"use client";

import Image from "next/image";
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
  merchants: [
    { label: "Sell on SaveGoal", href: "/merchants/sell" },
    { label: "Merchant Dashboard", href: "/merchant" },
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
  { label: "MTN MOMO", color: "bg-[#5a84df]" },
  { label: "VISA", color: "bg-[#5a84df]" },
  { label: "MASTERCARD", color: "bg-[#5a84df]" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: "f" },
  { name: "Instagram", href: "https://instagram.com", icon: "ig" },
  { name: "X", href: "https://x.com", icon: "x" },
];

export function Footer() {
  return (
    <footer className="bg-[#212d67] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-10 md:grid-cols-[1.15fr_repeat(4,0.7fr)]">
          <div className="max-w-[230px]">
            <Image
              src="/SavegoalLogo.png"
              alt="SaveGoal"
              width={165}
              height={75}
              className="h-auto w-[165px]"
            />
            <p className="mt-5 text-[14px] leading-7 text-[rgba(255,255,255,0.57)]">
              Save smarter, own faster. The future of shopping in Africa.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4457a4] text-sm font-semibold text-white transition-colors hover:bg-[#5c6fc0]"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-[14px] font-bold capitalize text-white">
                {group}
              </h3>
              <ul className="mt-6 space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/85 transition-colors hover:text-[#9bbcff]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[#8097db] pt-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] text-[#8aabee]">
              {new Date().getFullYear()} SaveGoal. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((method) => (
                <span
                  key={method.label}
                  className={`${method.color} rounded-[5px] border border-[#9bbcff] px-3 py-1 text-[10px] font-semibold text-white`}
                >
                  {method.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
