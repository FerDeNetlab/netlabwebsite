import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { articulos, getArticulo } from "@/lib/blog-data"

type Props = { params: Promise<{ slug: string }> }

const baseUrl = "https://www.netlab.mx"

export async function generateStaticParams() {
    return articulos.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const a = getArticulo(slug)
    if (!a) return { title: "Artículo no encontrado | Netlab" }
    const title = `${a.titulo} | Netlab`
    return {
        title,
        description: a.descripcion,
        keywords: a.keywords,
        openGraph: {
            title,
            description: a.descripcion,
            type: "article",
            locale: "es_MX",
            url: `${baseUrl}/blog/${a.slug}`,
            publishedTime: a.fechaISO,
        },
        alternates: { canonical: `${baseUrl}/blog/${a.slug}` },
    }
}

export default async function BlogArticlePage({ params }: Props) {
    const { slug } = await params
    const a = getArticulo(slug)
    if (!a) notFound()

    const url = `${baseUrl}/blog/${a.slug}`

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: a.titulo,
        description: a.descripcion,
        datePublished: a.fechaISO,
        dateModified: a.fechaISO,
        inLanguage: "es-MX",
        author: { "@type": "Organization", name: "Netlab Consulting", url: baseUrl },
        publisher: {
            "@type": "Organization",
            name: "Netlab Consulting",
            logo: { "@type": "ImageObject", url: `${baseUrl}/logo-netlab.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: a.keywords.join(", "),
        url,
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Netlab", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
            { "@type": "ListItem", position: 3, name: a.titulo, item: url },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <Navbar />
            <main className="min-h-screen bg-[#0c0c0c] py-16">
                <article className="container mx-auto px-4 max-w-3xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors mb-6 font-mono text-sm">
                        <ArrowLeft className="w-4 h-4" /> Volver al blog
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-bold text-white font-mono mb-4 text-balance">{a.titulo}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-slate-500 font-mono text-xs mb-8">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {a.fecha}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {a.readTime}</span>
                    </div>

                    {/* Respuesta corta — lo que citan los motores de IA */}
                    <div className="bg-green-500/5 border-l-2 border-green-500 rounded-r-md p-5 mb-10">
                        <p className="text-xs font-mono text-green-500 uppercase tracking-widest mb-2">Respuesta rápida</p>
                        <p className="text-slate-200 leading-relaxed">{a.respuestaCorta}</p>
                    </div>

                    {/* Índice */}
                    <nav className="mb-10 border border-slate-800 rounded-md p-4">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">En este artículo</p>
                        <ul className="space-y-1">
                            {a.secciones.map((s, i) => (
                                <li key={i}>
                                    <a href={`#s${i}`} className="text-slate-400 hover:text-green-400 text-sm transition-colors">
                                        {s.h}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Secciones */}
                    {a.secciones.map((s, i) => (
                        <section key={i} id={`s${i}`} className="mb-10 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-white font-mono mb-4">{s.h}</h2>
                            {s.parrafos?.map((p, j) => (
                                <p key={j} className="text-slate-300 leading-relaxed mb-4">{p}</p>
                            ))}
                            {s.lista && (
                                <ul className="space-y-2 mb-4">
                                    {s.lista.map((item, j) => (
                                        <li key={j} className="flex gap-3 text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {s.tabla && (
                                <div className="overflow-x-auto mb-4 border border-slate-800 rounded-md">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-900/60">
                                                {s.tabla.headers.map((h, j) => (
                                                    <th key={j} className="text-left font-mono text-green-400 px-3 py-2 whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {s.tabla.filas.map((fila, j) => (
                                                <tr key={j} className="border-t border-slate-800">
                                                    {fila.map((celda, k) => (
                                                        <td key={k} className="px-3 py-2 text-slate-300 align-top">{celda}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    ))}

                    {/* FAQ */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white font-mono mb-4">Preguntas frecuentes</h2>
                        <div className="space-y-4">
                            {a.faq.map((f, i) => (
                                <div key={i} className="border border-slate-800 rounded-md p-4">
                                    <h3 className="text-slate-100 font-semibold mb-2">{f.q}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="bg-slate-900/40 border border-green-500/20 rounded-md p-6 text-center mb-10">
                        <h2 className="text-xl font-bold text-white font-mono mb-2">¿Quieres implementar Odoo en tu empresa?</h2>
                        <p className="text-slate-400 text-sm mb-4">Agenda una consultoría gratuita con Netlab.</p>
                        <Link href="/agendar" className="inline-flex items-center gap-2 font-mono text-sm font-bold text-black bg-green-500 hover:bg-green-400 transition-all rounded-sm px-5 py-3">
                            Agendar consultoría <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Relacionados */}
                    {a.relacionados && a.relacionados.length > 0 && (
                        <section>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Sigue leyendo</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {a.relacionados.map((rel) => {
                                    const r = getArticulo(rel)
                                    if (!r) return null
                                    return (
                                        <Link key={rel} href={`/blog/${rel}`} className="group flex items-center justify-between gap-3 p-4 rounded-lg border border-slate-800 hover:border-green-500/40 transition-all">
                                            <span className="font-mono text-sm text-slate-200 group-hover:text-green-400 transition-colors">{r.titulo}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 flex-shrink-0" />
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </article>
            </main>
        </>
    )
}
