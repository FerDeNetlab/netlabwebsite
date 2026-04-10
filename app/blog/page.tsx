import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { CommandPrompt } from "@/components/ui/command-prompt"

export const metadata: Metadata = {
  title: "Blog | Odoo y ERP para PyMEs en México | Netlab",
  description: "Guías, comparativas y recursos sobre Odoo Community Edition, implementación de ERP y digitalización para PyMEs mexicanas.",
  alternates: {
    canonical: "https://www.netlab.mx/blog",
  },
}

const posts = [
  {
    slug: "odoo-community-vs-enterprise",
    title: "Odoo Community vs Enterprise: ¿cuál conviene para tu PyME en México?",
    description: "Comparativa completa: módulos, costos, diferencias técnicas y cuándo elegir Community Edition para ahorrar más de $420,000 MXN en licencias.",
    date: "10 de abril de 2026",
    readTime: "8 min",
    tags: ["Odoo", "Community Edition", "ERP", "Costos"],
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <CommandPrompt command="ls blog --all" path="~/netlab" user="netlab@consulting" />

        <div className="mt-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-mono mb-3">
            Blog de Netlab
          </h1>
          <p className="text-slate-400 font-mono text-sm">
            Guías sobre Odoo Community, ERP y sistemas para PyMEs en México.
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-slate-800 bg-[#111] hover:border-green-500/40 transition-colors rounded-sm p-6"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2 py-0.5 bg-green-500/10 text-green-400 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold text-white font-mono group-hover:text-green-400 transition-colors mb-2 leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-slate-400 font-mono leading-relaxed mb-4">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime} lectura
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs font-mono text-green-400 group-hover:gap-2 transition-all">
                  Leer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
