import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { jsPDF } from 'jspdf'

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
        // Fetch cotización with client
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

        // Fetch items
        const items = await sql`
      SELECT ci.*, p.nombre as producto_nombre
      FROM cotizacion_items ci
      LEFT JOIN productos p ON ci.producto_id = p.id
      WHERE ci.cotizacion_id = ${id}
      ORDER BY ci.created_at ASC
    ` as Record<string, any>[]

        // ==========================================
        // BUILD PDF
        // ==========================================
        const doc = new jsPDF({ unit: 'mm', format: 'letter' })
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 20
        const contentWidth = pageWidth - margin * 2
        let y = margin

        // Colors
        const darkGreen = [0, 120, 60]
        const black = [30, 30, 30]
        const gray = [120, 120, 120]
        const lightGray = [200, 200, 200]

        // ---- HEADER ----
        doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.rect(0, 0, pageWidth, 35, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('NETLAB', margin, 18)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Soluciones Tecnológicas', margin, 25)
        doc.text('www.netlab.mx | contacto@netlab.mx', margin, 30)

        // Cotización number (right side)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('COTIZACIÓN', pageWidth - margin, 18, { align: 'right' })
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(cot.numero_cotizacion || 'Sin número', pageWidth - margin, 25, { align: 'right' })

        y = 45

        // ---- CLIENT + QUOTE INFO ----
        const colLeft = margin
        const colRight = pageWidth / 2 + 10

        // Client box
        doc.setFillColor(245, 245, 245)
        doc.roundedRect(colLeft, y, contentWidth / 2 - 5, 45, 2, 2, 'F')

        doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('CLIENTE', colLeft + 5, y + 8)

        doc.setTextColor(black[0], black[1], black[2])
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(cot.cliente_nombre || '—', colLeft + 5, y + 16)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        let clientY = y + 22
        if (cot.cliente_empresa) { doc.text(cot.cliente_empresa, colLeft + 5, clientY); clientY += 5 }
        if (cot.cliente_email) { doc.text(cot.cliente_email, colLeft + 5, clientY); clientY += 5 }
        if (cot.cliente_telefono) { doc.text(`Tel: ${cot.cliente_telefono}`, colLeft + 5, clientY); clientY += 5 }
        if (cot.cliente_rfc) { doc.text(`RFC: ${cot.cliente_rfc}`, colLeft + 5, clientY) }

        // Quote info box
        doc.setFillColor(245, 245, 245)
        doc.roundedRect(colRight, y, contentWidth / 2 - 5, 45, 2, 2, 'F')

        doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('DETALLES', colRight + 5, y + 8)

        doc.setTextColor(black[0], black[1], black[2])
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        let detY = y + 16

        const addDetail = (label: string, value: string) => {
            doc.setFont('helvetica', 'bold')
            doc.text(label, colRight + 5, detY)
            doc.setFont('helvetica', 'normal')
            doc.text(value, colRight + 40, detY)
            detY += 5
        }

        addDetail('Fecha:', cot.fecha_emision ? new Date(cot.fecha_emision).toLocaleDateString('es-MX') : '—')
        addDetail('Vencimiento:', cot.fecha_vencimiento ? new Date(cot.fecha_vencimiento).toLocaleDateString('es-MX') : '—')
        addDetail('Estado:', (cot.estado || 'borrador').toUpperCase())
        addDetail('Condiciones:', cot.condiciones_pago || 'No especificadas')

        y += 55

        // ---- CONCEPTO ----
        if (cot.concepto) {
            doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text('CONCEPTO', margin, y)
            doc.setTextColor(black[0], black[1], black[2])
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(cot.concepto, margin, y + 7)
            y += 15
        }

        // ---- ITEMS TABLE ----
        doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('PARTIDAS', margin, y)
        y += 5

        // Table header
        doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.rect(margin, y, contentWidth, 8, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        const colWidths = [10, contentWidth * 0.4 - 10, 20, 30, 20, contentWidth * 0.2]
        const colStarts = [margin]
        for (let i = 1; i < colWidths.length; i++) {
            colStarts.push(colStarts[i - 1] + colWidths[i - 1])
        }

        doc.text('#', colStarts[0] + 2, y + 5.5)
        doc.text('DESCRIPCIÓN', colStarts[1] + 2, y + 5.5)
        doc.text('CANT.', colStarts[2] + 2, y + 5.5)
        doc.text('P. UNITARIO', colStarts[3] + 2, y + 5.5)
        doc.text('DESC.', colStarts[4] + 2, y + 5.5)
        doc.text('SUBTOTAL', colStarts[5] + 2, y + 5.5)

        y += 8

        // Table rows
        doc.setTextColor(black[0], black[1], black[2])
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)

        items.forEach((item: Record<string, any>, index: number) => {
            // Check if we need a new page
            if (y > 230) {
                doc.addPage()
                y = margin
            }

            const rowHeight = 8
            if (index % 2 === 0) {
                doc.setFillColor(250, 250, 250)
                doc.rect(margin, y, contentWidth, rowHeight, 'F')
            }

            const rowY = y + 5.5
            doc.text(String(index + 1), colStarts[0] + 2, rowY)

            // Truncate description if too long
            const desc = (item.descripcion || item.producto_nombre || '—').substring(0, 50)
            doc.text(desc, colStarts[1] + 2, rowY)
            doc.text(String(item.cantidad), colStarts[2] + 2, rowY)
            doc.text(`$${Number(item.precio_unitario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, colStarts[3] + 2, rowY)
            doc.text(item.descuento ? `${item.descuento}%` : '—', colStarts[4] + 2, rowY)
            doc.text(`$${Number(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, colStarts[5] + 2, rowY)

            y += rowHeight
        })

        // Bottom line
        doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
        doc.line(margin, y, margin + contentWidth, y)
        y += 5

        // ---- TOTALS ----
        const totalsX = pageWidth - margin - 70
        const totalsValX = pageWidth - margin

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(gray[0], gray[1], gray[2])
        doc.text('Subtotal:', totalsX, y)
        doc.setTextColor(black[0], black[1], black[2])
        doc.text(`$${Number(cot.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalsValX, y, { align: 'right' })
        y += 6

        doc.setTextColor(gray[0], gray[1], gray[2])
        doc.text('IVA (16%):', totalsX, y)
        doc.setTextColor(black[0], black[1], black[2])
        doc.text(`$${Number(cot.iva || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalsValX, y, { align: 'right' })
        y += 7

        doc.setDrawColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.line(totalsX - 5, y - 2, totalsValX, y - 2)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
        doc.text('TOTAL:', totalsX, y + 3)
        doc.text(`$${Number(cot.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, totalsValX, y + 3, { align: 'right' })

        y += 15

        // ---- NOTES ----
        if (cot.notas) {
            if (y > 230) { doc.addPage(); y = margin }
            doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2])
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text('NOTAS', margin, y)
            doc.setTextColor(black[0], black[1], black[2])
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            const splitNotes = doc.splitTextToSize(cot.notas, contentWidth)
            doc.text(splitNotes, margin, y + 6)
            y += 6 + splitNotes.length * 4
        }

        // ---- FOOTER ----
        const footerY = doc.internal.pageSize.getHeight() - 15
        doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5)
        doc.setTextColor(gray[0], gray[1], gray[2])
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text('Este documento es una cotización y no tiene validez fiscal.', margin, footerY)
        doc.text(`Generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - margin, footerY, { align: 'right' })

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
