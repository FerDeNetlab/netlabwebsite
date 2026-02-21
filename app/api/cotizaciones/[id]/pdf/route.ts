import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { jsPDF } from 'jspdf'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    try {
        const cotResult = await sql`
      SELECT 
        c.*,
        cl.nombre as cliente_nombre,
        cl.empresa as cliente_empresa,
        cl.email as cliente_email,
        cl.telefono as cliente_telefono,
        cl.rfc as cliente_rfc,
        cl.direccion as cliente_direccion,
        cl.ciudad as cliente_ciudad,
        cl.estado as cliente_estado
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE c.id = ${id}
    ` as Record<string, unknown>[]

        if (cotResult.length === 0) {
            return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
        }

        const cot = cotResult[0] as Record<string, any>

        const items = await sql`
      SELECT ci.*, p.nombre as producto_nombre
      FROM cotizacion_items ci
      LEFT JOIN productos p ON ci.producto_id = p.id
      WHERE ci.cotizacion_id = ${id}
      ORDER BY ci.created_at ASC
    ` as Record<string, any>[]

        // ==========================================
        // NETLAB BRANDED PDF
        // ==========================================
        const doc = new jsPDF({ unit: 'mm', format: 'letter' })
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 15
        const contentWidth = pageWidth - margin * 2
        let y = 0

        // ── Brand Colors (matching netlab.mx) ──
        const bg = [12, 12, 12]           // #0c0c0c
        const cardBg = [26, 27, 38]       // #1a1b26
        const green = [34, 197, 94]       // #22c55e
        const darkGreen = [22, 163, 74]   // #16a34a
        const textLight = [203, 213, 225] // #cbd5e1
        const textMuted = [148, 163, 184] // #94a3b8
        const border = [30, 41, 59]       // #1e293b
        const white = [255, 255, 255]
        const yellow = [250, 204, 21]     // #facc15

        // ── Full page dark background ──
        doc.setFillColor(bg[0], bg[1], bg[2])
        doc.rect(0, 0, pageWidth, pageHeight, 'F')

        // ── Header bar ──
        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
        doc.rect(0, 0, pageWidth, 40, 'F')

        // Green accent line
        doc.setFillColor(green[0], green[1], green[2])
        doc.rect(0, 40, pageWidth, 1.5, 'F')

        // Logo
        try {
            const logoPath = join(process.cwd(), 'public', 'logo-netlab.png')
            const logoBuffer = readFileSync(logoPath)
            const logoBase64 = logoBuffer.toString('base64')
            doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', margin, 6, 28, 28)
        } catch {
            // Fallback: text logo
            doc.setTextColor(green[0], green[1], green[2])
            doc.setFontSize(24)
            doc.setFont('helvetica', 'bold')
            doc.text('N', margin + 5, 25)
        }

        // Company name + tagline
        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('NETLAB', margin + 32, 17)

        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('Soluciones Tecnológicas Empresariales', margin + 32, 23)
        doc.text('netlab.mx  •  contacto@netlab.mx', margin + 32, 28)

        // Quote badge (right side)
        const badgeText = 'COTIZACIÓN'
        const badgeW = 45
        doc.setFillColor(green[0], green[1], green[2])
        doc.roundedRect(pageWidth - margin - badgeW, 8, badgeW, 10, 2, 2, 'F')
        doc.setTextColor(bg[0], bg[1], bg[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(badgeText, pageWidth - margin - badgeW / 2, 14.5, { align: 'center' })

        doc.setTextColor(white[0], white[1], white[2])
        doc.setFontSize(14)
        doc.text(cot.numero_cotizacion || '—', pageWidth - margin, 30, { align: 'right' })

        y = 50

        // ── Client + Quote Details side by side ──
        const colW = (contentWidth - 6) / 2

        // Client card
        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
        doc.roundedRect(margin, y, colW, 50, 2, 2, 'F')
        doc.setDrawColor(border[0], border[1], border[2])
        doc.roundedRect(margin, y, colW, 50, 2, 2, 'S')

        // Green left border accent
        doc.setFillColor(green[0], green[1], green[2])
        doc.rect(margin, y, 1.5, 50, 'F')

        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text('FACTURAR A', margin + 6, y + 7)

        doc.setTextColor(white[0], white[1], white[2])
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(cot.cliente_nombre || '—', margin + 6, y + 15)

        doc.setTextColor(textLight[0], textLight[1], textLight[2])
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        let cy = y + 22
        if (cot.cliente_empresa) { doc.text(cot.cliente_empresa, margin + 6, cy); cy += 5 }
        if (cot.cliente_email) { doc.text(cot.cliente_email, margin + 6, cy); cy += 5 }
        if (cot.cliente_telefono) { doc.text(`Tel: ${cot.cliente_telefono}`, margin + 6, cy); cy += 5 }
        if (cot.cliente_rfc) {
            doc.setTextColor(yellow[0], yellow[1], yellow[2])
            doc.text(`RFC: ${cot.cliente_rfc}`, margin + 6, cy)
        }

        // Details card
        const detX = margin + colW + 6
        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
        doc.roundedRect(detX, y, colW, 50, 2, 2, 'F')
        doc.setDrawColor(border[0], border[1], border[2])
        doc.roundedRect(detX, y, colW, 50, 2, 2, 'S')

        doc.setFillColor(green[0], green[1], green[2])
        doc.rect(detX, y, 1.5, 50, 'F')

        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text('DETALLES', detX + 6, y + 7)

        doc.setFontSize(8)
        let dy = y + 15
        const addRow = (label: string, value: string, highlight = false) => {
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
            doc.setFont('helvetica', 'normal')
            doc.text(label, detX + 6, dy)
            if (highlight) {
                doc.setTextColor(green[0], green[1], green[2])
            } else {
                doc.setTextColor(white[0], white[1], white[2])
            }
            doc.setFont('helvetica', 'bold')
            doc.text(value, detX + colW - 6, dy, { align: 'right' })
            dy += 7
        }

        addRow('Fecha emisión', cot.fecha_emision ? new Date(cot.fecha_emision).toLocaleDateString('es-MX') : '—')
        addRow('Vencimiento', cot.fecha_vencimiento ? new Date(cot.fecha_vencimiento).toLocaleDateString('es-MX') : '—')
        addRow('Estado', (cot.estado || 'borrador').toUpperCase(), true)
        addRow('Condiciones', cot.condiciones_pago || '—')

        y += 58

        // ── Concepto ──
        if (cot.concepto) {
            doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
            doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F')
            doc.setFillColor(green[0], green[1], green[2])
            doc.rect(margin, y, 1.5, 14, 'F')

            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            doc.text('CONCEPTO', margin + 6, y + 5)
            doc.setTextColor(white[0], white[1], white[2])
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(cot.concepto, margin + 6, y + 11)
            y += 18
        }

        // ── Items Table ──
        // Table header
        doc.setFillColor(green[0], green[1], green[2])
        doc.roundedRect(margin, y, contentWidth, 9, 2, 2, 'F')
        // Cover bottom corners so they don't look rounded when table continues
        doc.setFillColor(green[0], green[1], green[2])
        doc.rect(margin, y + 5, contentWidth, 4, 'F')

        doc.setTextColor(bg[0], bg[1], bg[2])
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')

        const cols = [
            { label: '#', x: margin + 4, w: 8 },
            { label: 'DESCRIPCIÓN', x: margin + 14, w: contentWidth * 0.38 },
            { label: 'CANT.', x: margin + contentWidth * 0.52, w: 20 },
            { label: 'P. UNITARIO', x: margin + contentWidth * 0.62, w: 25 },
            { label: 'DESC.', x: margin + contentWidth * 0.78, w: 15 },
            { label: 'SUBTOTAL', x: margin + contentWidth * 0.88, w: 25 },
        ]

        cols.forEach(col => doc.text(col.label, col.x, y + 6))
        y += 9

        // Table rows
        items.forEach((item: Record<string, any>, index: number) => {
            if (y > pageHeight - 50) {
                // New page with dark bg
                doc.addPage()
                doc.setFillColor(bg[0], bg[1], bg[2])
                doc.rect(0, 0, pageWidth, pageHeight, 'F')
                y = margin
            }

            const rowH = 9
            const isEven = index % 2 === 0
            doc.setFillColor(isEven ? cardBg[0] : bg[0], isEven ? cardBg[1] : bg[1], isEven ? cardBg[2] : bg[2])
            doc.rect(margin, y, contentWidth, rowH, 'F')

            doc.setDrawColor(border[0], border[1], border[2])
            doc.line(margin, y + rowH, margin + contentWidth, y + rowH)

            const rowY = y + 6
            doc.setFontSize(7.5)

            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
            doc.setFont('helvetica', 'normal')
            doc.text(String(index + 1), cols[0].x, rowY)

            doc.setTextColor(white[0], white[1], white[2])
            const desc = (item.descripcion || item.producto_nombre || '—').substring(0, 55)
            doc.text(desc, cols[1].x, rowY)

            doc.setTextColor(textLight[0], textLight[1], textLight[2])
            doc.text(String(item.cantidad), cols[2].x, rowY)
            doc.text(`$${Number(item.precio_unitario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, cols[3].x, rowY)
            doc.text(item.descuento ? `${item.descuento}%` : '—', cols[4].x, rowY)

            doc.setTextColor(green[0], green[1], green[2])
            doc.setFont('helvetica', 'bold')
            doc.text(`$${Number(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, cols[5].x, rowY)

            y += rowH
        })

        y += 6

        // ── Totals ──
        const totW = 80
        const totX = pageWidth - margin - totW

        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
        doc.roundedRect(totX, y, totW, 35, 2, 2, 'F')
        doc.setDrawColor(border[0], border[1], border[2])
        doc.roundedRect(totX, y, totW, 35, 2, 2, 'S')

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')

        // Subtotal
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
        doc.text('Subtotal', totX + 5, y + 8)
        doc.setTextColor(textLight[0], textLight[1], textLight[2])
        doc.text(`$${Number(cot.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totX + totW - 5, y + 8, { align: 'right' })

        // IVA
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
        doc.text('IVA (16%)', totX + 5, y + 15)
        doc.setTextColor(textLight[0], textLight[1], textLight[2])
        doc.text(`$${Number(cot.iva || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totX + totW - 5, y + 15, { align: 'right' })

        // Divider
        doc.setDrawColor(green[0], green[1], green[2])
        doc.line(totX + 5, y + 20, totX + totW - 5, y + 20)

        // Total
        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('TOTAL', totX + 5, y + 28)
        doc.text(`$${Number(cot.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, totX + totW - 5, y + 28, { align: 'right' })

        y += 42

        // ── Notes ──
        if (cot.notas) {
            if (y > pageHeight - 40) {
                doc.addPage()
                doc.setFillColor(bg[0], bg[1], bg[2])
                doc.rect(0, 0, pageWidth, pageHeight, 'F')
                y = margin
            }

            doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
            const splitNotes = doc.splitTextToSize(cot.notas, contentWidth - 16)
            const notesH = 12 + splitNotes.length * 4
            doc.roundedRect(margin, y, contentWidth, notesH, 2, 2, 'F')
            doc.setFillColor(yellow[0], yellow[1], yellow[2])
            doc.rect(margin, y, 1.5, notesH, 'F')

            doc.setTextColor(yellow[0], yellow[1], yellow[2])
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            doc.text('NOTAS', margin + 6, y + 6)

            doc.setTextColor(textLight[0], textLight[1], textLight[2])
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            doc.text(splitNotes, margin + 6, y + 12)
        }

        // ── Footer ──
        const footerY = pageHeight - 12
        doc.setDrawColor(border[0], border[1], border[2])
        doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)

        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2])
        doc.setFontSize(6.5)
        doc.setFont('helvetica', 'normal')
        doc.text('Este documento es una cotización y no tiene validez fiscal.', margin, footerY)

        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(6.5)
        doc.text(
            `Generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}  •  netlab.mx`,
            pageWidth - margin, footerY, { align: 'right' }
        )

        // Output
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
        const filename = `Cotizacion-${cot.numero_cotizacion || id}.pdf`

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('[ERP] Error generating PDF:', error)
        return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 })
    }
}
