import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { ProblemsSection } from "@/components/sections/problems"
import { AboutSection } from "@/components/sections/about"
import { ServicesSection } from "@/components/sections/services"
import { SystemsSection } from "@/components/sections/systems"
import { MethodologySection } from "@/components/sections/methodology"
import { BenefitsSection } from "@/components/sections/benefits"
import { CaseStudiesSection } from "@/components/sections/case-studies"
import { FaqSection } from "@/components/sections/faq"
import { CtaSection } from "@/components/sections/cta"
import { EnterpriseSection } from "@/components/sections/enterprise"
import { HardwareSection } from "@/components/sections/hardware"
import { Footer } from "@/components/sections/footer"
import { DirectContactSection } from "@/components/sections/direct-contact"

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
