import type { MetadataRoute } from "next"

// Páginas privadas / propuestas de cliente / portales por token: fuera de índice.
const disallow = [
  "/admin",
  "/api",
  "/documentaciones",
  "/tickets",
  "/t/",
  "/d/",
  "/edgar",
  "/aura-market",
  "/gomwater",
  "/grupoaq",
  "/mexar-meli",
  "/tierra-fertil",
  "/propuesta-asociacion",
]

// Crawlers de motores de IA (GEO/AEO): los permitimos explícitamente para
// aparecer y ser citados en ChatGPT, Perplexity, Claude y los AI Overviews de Google.
const aiBots = [
  "GPTBot",          // OpenAI (entrenamiento)
  "OAI-SearchBot",   // OpenAI (búsqueda / ChatGPT Search)
  "ChatGPT-User",    // OpenAI (navegación en vivo)
  "ClaudeBot",       // Anthropic
  "Claude-Web",      // Anthropic (navegación)
  "anthropic-ai",    // Anthropic
  "PerplexityBot",   // Perplexity
  "Perplexity-User", // Perplexity (navegación en vivo)
  "Google-Extended", // Google Gemini / AI Overviews
  "Applebot-Extended", // Apple Intelligence
  "Bingbot",         // Bing / Copilot
  "Amazonbot",       // Amazon
  "Bytespider",      // TikTok / Doubao
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: "https://www.netlab.mx/sitemap.xml",
    host: "https://www.netlab.mx",
  }
}
