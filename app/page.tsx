import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { ProblemsSection } from "@/components/sections/problems"
import dynamic from "next/dynamic"

// Above-the-fold: imported statically (Navbar, Hero, Problems)
// Below-the-fold: lazy-loaded to reduce initial JS bundle
const AboutSection = dynamic(() => import("@/components/sections/about").then(m => ({ default: m.AboutSection })))
const ServicesSection = dynamic(() => import("@/components/sections/services").then(m => ({ default: m.ServicesSection })))
const SystemsSection = dynamic(() => import("@/components/sections/systems").then(m => ({ default: m.SystemsSection })))
const MethodologySection = dynamic(() => import("@/components/sections/methodology").then(m => ({ default: m.MethodologySection })))
const BenefitsSection = dynamic(() => import("@/components/sections/benefits").then(m => ({ default: m.BenefitsSection })))
const CaseStudiesSection = dynamic(() => import("@/components/sections/case-studies").then(m => ({ default: m.CaseStudiesSection })))
const FaqSection = dynamic(() => import("@/components/sections/faq").then(m => ({ default: m.FaqSection })))
const CtaSection = dynamic(() => import("@/components/sections/cta").then(m => ({ default: m.CtaSection })))
const EnterpriseSection = dynamic(() => import("@/components/sections/enterprise").then(m => ({ default: m.EnterpriseSection })))
const HardwareSection = dynamic(() => import("@/components/sections/hardware").then(m => ({ default: m.HardwareSection })))
const Footer = dynamic(() => import("@/components/sections/footer").then(m => ({ default: m.Footer })))
const DirectContactSection = dynamic(() => import("@/components/sections/direct-contact").then(m => ({ default: m.DirectContactSection })))

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <AboutSection />
      <ServicesSection />
      <SystemsSection />
      <MethodologySection />
      <EnterpriseSection />
      <HardwareSection />
      <BenefitsSection />
      <CaseStudiesSection />
      <DirectContactSection />
      <CtaSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
