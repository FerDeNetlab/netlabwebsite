import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"
import { rateLimit } from "@/lib/rate-limit"

// Security headers applied to ALL responses
const securityHeaders = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // HSTS - enforce HTTPS for 1 year including subdomains
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  // Restrict browser features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  // XSS protection (legacy browsers)
  "X-XSS-Protection": "1; mode=block",
  // Content Security Policy - permissive enough for Vercel Analytics, Schema LD+JSON, inline styles
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; "),
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApiRoute = pathname.startsWith("/api") && !pathname.startsWith("/api/auth")

  // Rate limiting for API routes (30 requests/min per IP)
  if (isApiRoute) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous"
    const { success, remaining } = rateLimit(ip)

    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    // Auth-protected API routes
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url))
    }

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value)
    }
    return response
  }

  // Auth-protected admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url))
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
