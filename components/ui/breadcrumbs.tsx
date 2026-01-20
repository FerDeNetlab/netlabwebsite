import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm font-mono">
        <li>
          <Link href="/" className="text-slate-500 hover:text-green-500 transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span>Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-slate-700" />
            {index === items.length - 1 ? (
              <span className="text-green-500">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-slate-500 hover:text-green-500 transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
