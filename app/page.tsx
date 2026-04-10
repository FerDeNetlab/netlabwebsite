import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { ProblemsSection } from "@/components/sections/problems"
import dynamic from "next/dynamic"

// Above-the-fold: imported statically (Navbar, Hero, Problems)
// Below-the-fold: lazy-loaded to reduce initial JS bundle
const OdooExpertsSection = dynamic(() => import("@/components/sections/odoo-experts").then(m => ({ default: m.OdooExpertsSection })))
const ServicesSection = dynamic(() => import("@/components/sections/services").then(m => ({ default: m.ServicesSection })))
const SystemsSection = dynamic(() => import("@/components/sections/systems").then(m => ({ default: m.SystemsSection })))
const MethodologySection = dynamic(() => import("@/components/sections/methodology").then(m => ({ default: m.MethodologySection })))
const OdooCEvsEnterpriseSection = dynamic(() => import("@/components/sections/odoo-ce-vs-enterprise").then(m => ({ default: m.OdooCEvsEnterpriseSection })))
const OdooPricingSection = dynamic(() => import("@/components/sections/odoo-pricing").then(m => ({ default: m.OdooPricingSection })))
const DirectContactSection = dynamic(() => import("@/components/sections/direct-contact").then(m => ({ default: m.DirectContactSection })))
const CtaSection = dynamic(() => import("@/components/sections/cta").then(m => ({ default: m.CtaSection })))
const FaqSection = dynamic(() => import("@/components/sections/faq").then(m => ({ default: m.FaqSection })))
const Footer = dynamic(() => import("@/components/sections/footer").then(m => ({ default: m.Footer })))

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <OdooExpertsSection />
      <ServicesSection />
      <SystemsSection />
      <MethodologySection />
      <OdooCEvsEnterpriseSection />
      <OdooPricingSection />
      <DirectContactSection />
      <CtaSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
