import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Edgar Cervantes | Netlab Consulting",
    robots: "noindex, nofollow",
}

export default function EdgarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
