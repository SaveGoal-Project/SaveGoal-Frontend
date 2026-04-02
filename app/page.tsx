import { Navbar } from "@/src/components/layouts/Navbar";
import { CTA } from "@/src/components/marketing/CTA";
import { Footer } from "@/src/components/marketing/Footer";
import { Hero } from "@/src/components/marketing/Hero";
import { HowItWorks } from "@/src/components/marketing/HowItWorks";
import { ProductGrid } from "@/src/components/marketing/ProductGrid";
import { Testimonials } from "@/src/components/marketing/Testimonials";

const testimonials = [
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
    role: "Fashion Entrepreneur",
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
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar variant="marketing" />
      <main>
        <Hero />
        <HowItWorks />
        <ProductGrid />
        <Testimonials testimonials={testimonials} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
