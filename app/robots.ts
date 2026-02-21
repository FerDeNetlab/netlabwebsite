import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/edgar",
          "/aura-market",
          "/gomwater",
          "/grupoaq",
          "/mexar-meli",
          "/tierra-fertil",
          "/propuesta-asociacion",
        ],
      },
    ],
    sitemap: "https://www.netlab.mx/sitemap.xml",
    host: "https://www.netlab.mx",
  }
}
