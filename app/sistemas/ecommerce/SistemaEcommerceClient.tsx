"use client"

import { Navbar } from "@/components/navbar"
import { useEffect } from "react"

export default function SistemaEcommerceClient() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* ... existing code here ... */}
    </div>
  )
}
