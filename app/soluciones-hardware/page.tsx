import type { Metadata } from "next"
import { HardwareClient } from "./HardwareClient"

export const metadata: Metadata = {
  title: "Soluciones Hardware y Redes México | Infraestructura TI Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Diseño, instalación y mantenimiento de infraestructura tecnológica para empresas en México. Servidores, redes empresariales, almacenamiento SAN/NAS, equipos de cómputo al por mayor, cableado estructurado, racks, switches y soluciones de TI en Guadalajara, Ciudad de México, Monterrey.",
  keywords: [
    "soluciones hardware empresarial",
    "soluciones hardware México",
    "infraestructura TI empresas",
    "infraestructura TI Guadalajara",
    "servidores para empresas",
    "servidores México",
    "redes empresariales",
    "redes empresariales Monterrey",
    "cableado estructurado",
    "cableado estructurado México",
    "instalación de redes México",
    "equipos de cómputo empresarial",
    "computadoras al por mayor",
    "equipos de cómputo Guadalajara",
    "almacenamiento empresarial",
    "NAS para empresas",
    "SAN storage México",
    "switches empresariales",
    "racks para servidores",
    "mantenimiento de servidores",
    "infraestructura de red",
    "soluciones de TI Guadalajara",
    "equipamiento de oficinas",
    "hardware corporativo",
    "centro de datos empresarial",
    "virtualización de servidores",
    "respaldo y recuperación de datos",
    "soporte técnico empresarial",
    "Ciudad de México",
    "Monterrey",
    "Querétaro",
    "Puebla",
  ].join(", "),
  openGraph: {
    title: "Soluciones Hardware y Redes Empresariales México | Netlab",
    description:
      "Infraestructura tecnológica completa para tu empresa. Servidores, redes, almacenamiento y equipos de cómputo.",
    type: "website",
    locale: "es_MX",
  },
}


export default function SolucionesHardwarePage() {
  return <HardwareClient />
}
