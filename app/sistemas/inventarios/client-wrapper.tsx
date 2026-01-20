"use client"

import dynamic from "next/dynamic"

const SistemaInventariosPageClient = dynamic(() => import("./page.client"), {
  ssr: false,
})

export default function InventariosClientWrapper() {
  return <SistemaInventariosPageClient />
}
