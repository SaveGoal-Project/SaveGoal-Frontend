import { Navbar } from "@/src/components/layouts/Navbar";
import { HeroShowcase } from "@/src/components/marketing/HeroShowcase";
import { HowItWorks } from "@/src/components/marketing/HowItWorks";
import { ProductGrid } from "@/src/components/marketing/ProductGrid";
import { Testimonials } from "@/src/components/marketing/Testimonials";
import { CTA } from "@/src/components/marketing/CTA";
import { Footer } from "@/src/components/marketing/Footer";
import { mockProducts as allMockProducts } from "@/src/domains/products/products.mock";

const mockProducts = [
  allMockProducts.find((p) => p.name === "Sony PlayStation 5") || allMockProducts[0],
  allMockProducts.find((p) => p.name === "Water Bottle") || allMockProducts[1],
  allMockProducts.find((p) => p.name === "Apple Series 3") || allMockProducts[2],
  allMockProducts.find((p) => p.name === "Adidas Sneakers") || allMockProducts[3],
];

const mockTestimonials = [
  {
    id: "1",
    name: "Kofi Mensah",
    role: "Software Developer",
    quote:
      "SaveGoal helped me get my MacBook without taking any loans. I saved for 6 months and now I own it completely!",
    product: "Apple MacBook Air",
  },
  {
    id: "2",
    name: "Ama Serwaa",
    role: "Fashion Designer",
    quote:
      "I love how I can track my progress every day. It keeps me motivated to save more. Already completed 3 goals!",
    product: "Sewing Machine",
  },
  {
    id: "3",
    name: "Kwame Asante",
    role: "Teacher",
    quote:
      "No hidden fees, no interest. Just save and get what you want. This is how shopping should be!",
    product: "Samsung TV",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section - Two Column Layout */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-6 md:space-y-8">
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                  Save Today,{" "}
                  <span className="bg-gradient-to-r from-[#4850a5] to-[#5761c9] bg-clip-text text-transparent">
                    Own Tomorrow
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-[#6b7280] leading-relaxed max-w-lg">
                  Turn your dreams into reality with SaveGoal. Create structured
                  savings plans for the products you love, and get them when
                  you&apos;re ready.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/register"
                    className="bg-[#2d3369] hover:bg-[#3d4479] text-white px-8 py-4 text-base font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Start Saving Now
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                  <a
                    href="/products"
                    className="border-2 border-[#d1d5db] text-[#374151] px-8 py-4 text-base font-semibold rounded-full hover:bg-[#f9fafb] transition-all duration-300 text-center"
                  >
                    Browse Products
                  </a>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-8 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-[#4850a5]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#4850a5]">100%</div>
                      <div className="text-sm text-[#9ca3af]">Secure Savings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-[#4850a5]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#4850a5]">50K +</div>
                      <div className="text-sm text-[#9ca3af]">Goals Achieved</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-[#4850a5]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#4850a5]">GH¢5M +</div>
                      <div className="text-sm text-[#9ca3af]">Saved</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Hero Showcase */}
              <div className="flex justify-center lg:justify-end">
                <HeroShowcase />
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <ProductGrid products={mockProducts} />
        <Testimonials testimonials={mockTestimonials} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
