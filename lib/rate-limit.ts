/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach. Not suitable for distributed/multi-instance setups.
 * For production at scale, consider Vercel KV or Upstash Redis.
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean old entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key)
        }
    }
}

export function rateLimit(
    identifier: string,
    { maxRequests = 30, windowMs = 60_000 } = {}
): { success: boolean; remaining: number } {
    cleanup()

    const now = Date.now()
    const entry = rateLimitMap.get(identifier)

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
        return { success: true, remaining: maxRequests - 1 }
    }

    entry.count++
    const remaining = Math.max(0, maxRequests - entry.count)

    if (entry.count > maxRequests) {
        return { success: false, remaining: 0 }
    }

    return { success: true, remaining }
}
