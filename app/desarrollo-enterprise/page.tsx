import type { Metadata } from "next"
import { EnterpriseClient } from "./EnterpriseClient"

export const metadata: Metadata = {
  title: "Desarrollo de Software Enterprise a Medida | Netlab - Soluciones Corporativas México",
  description:
    "Desarrollamos software empresarial de primera calidad para grandes empresas y corporativos. Sistemas a medida, arquitectura escalable, microservicios, aplicaciones móviles enterprise, integraciones complejas y soluciones cloud para corporativos en México y Guadalajara.",
  keywords: [
    "desarrollo software enterprise",
    "software empresarial a medida",
    "desarrollo para corporativos",
    "software personalizado grandes empresas",
    "desarrollo enterprise México",
    "arquitectura de software escalable",
    "microservicios para empresas",
    "aplicaciones móviles enterprise",
    "software corporativo personalizado",
    "sistemas empresariales complejos",
    "desarrollo de software para corporativos",
    "integración de sistemas empresariales",
    "soluciones cloud enterprise",
    "software a medida Guadalajara",
    "desarrollo web empresarial",
    "aplicaciones empresariales personalizadas",
    "transformación digital corporativa",
    "software enterprise escalable",
    "desarrollo de plataformas empresariales",
    "sistemas empresariales seguros",
  ].join(", "),
  openGraph: {
    title: "Desarrollo de Software Enterprise a Medida | Netlab",
    description:
      "Soluciones de software corporativo de primera calidad. Arquitectura escalable, microservicios y desarrollo personalizado para grandes empresas.",
    type: "website",
  },
}

export default function DesarrolloEnterprisePage() {
  return <EnterpriseClient />
}
