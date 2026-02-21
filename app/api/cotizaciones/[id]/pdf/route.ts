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
      SELECT c.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa,
        cl.email as cliente_email, cl.telefono as cliente_telefono,
        cl.rfc as cliente_rfc, cl.direccion as cliente_direccion,
        cl.ciudad as cliente_ciudad, cl.estado as cliente_estado
      FROM cotizaciones c LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE c.id = ${id}
    ` as Record<string, unknown>[]

        if (cotResult.length === 0) {
            return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
        }

        const cot = cotResult[0] as Record<string, any>

        const items = await sql`
      SELECT ci.*, p.nombre as producto_nombre
      FROM cotizacion_items ci LEFT JOIN productos p ON ci.producto_id = p.id
      WHERE ci.cotizacion_id = ${id} ORDER BY ci.created_at ASC
    ` as Record<string, any>[]

        // ══════════════════════════════════════════════════
        //  NETLAB PDF — Terminal Window Design
        // ══════════════════════════════════════════════════
        const doc = new jsPDF({ unit: 'mm', format: 'letter' })
        const pw = doc.internal.pageSize.getWidth()   // 215.9
        const ph = doc.internal.pageSize.getHeight()   // 279.4
        const m = 12 // margin
        const cw = pw - m * 2 // content width

        // ── Colors (exact netlab.mx tokens) ──
        const C = {
            pageBg: [20, 20, 20],        // page background outside terminal
            termBg: [10, 10, 10],        // #0a0a0a terminal body
            headerBg: [26, 27, 38],       // #1a1b26 terminal title bar
            border: [30, 41, 59],       // slate-800 border
            green: [34, 197, 94],      // #22c55e primary
            red: [239, 68, 68],      // traffic dot
            yellow: [234, 179, 8],      // traffic dot
            greenDot: [34, 197, 94],      // traffic dot
            white: [255, 255, 255],
            text: [203, 213, 225],    // slate-300
            muted: [148, 163, 184],    // slate-400
            dim: [100, 116, 139],    // slate-500
            rowAlt: [18, 18, 24],       // subtle alt row
        }

        // ── Helpers ──
        const setC = (c: number[]) => doc.setTextColor(c[0], c[1], c[2])
        const setF = (c: number[]) => doc.setFillColor(c[0], c[1], c[2])
        const setD = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2])
        const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

        // ── Page background ──
        setF(C.pageBg)
        doc.rect(0, 0, pw, ph, 'F')

        // ══════════════════════════════════════════════════
        //  TERMINAL WINDOW
        // ══════════════════════════════════════════════════
        const termX = m
        const termY = m
        const termW = cw
        const termH = ph - m * 2

        // Terminal body (rounded rectangle)
        setF(C.termBg)
        doc.roundedRect(termX, termY, termW, termH, 3, 3, 'F')
        setD(C.border)
        doc.roundedRect(termX, termY, termW, termH, 3, 3, 'S')

        // ── Title bar ──
        const tbH = 10
        setF(C.headerBg)
        // Top rounded, bottom flat
        doc.roundedRect(termX, termY, termW, tbH + 3, 3, 3, 'F')
        doc.rect(termX, termY + tbH - 2, termW, 5, 'F') // flatten bottom

        // Border below title bar
        setD(C.border)
        doc.line(termX, termY + tbH, termX + termW, termY + tbH)

        // Traffic light dots
        const dotY = termY + tbH / 2
        const dotR = 1.5
        const dotX = termX + 8
        setF(C.red)
        doc.circle(dotX, dotY, dotR, 'F')
        setF(C.yellow)
        doc.circle(dotX + 5, dotY, dotR, 'F')
        setF(C.greenDot)
        doc.circle(dotX + 10, dotY, dotR, 'F')

        // Title text (centered like TerminalFrame)
        setC(C.dim)
        doc.setFontSize(7)
        doc.setFont('courier', 'normal')
        doc.text(`root@netlab:~/cotizaciones/${cot.numero_cotizacion || ''}`, termX + termW / 2, dotY + 1, { align: 'center' })

        let y = termY + tbH + 8
        const px = termX + 8 // padding x
        const innerW = termW - 16

        // ── Logo + Company ──
        try {
            const logoPath = join(process.cwd(), 'public', 'logo-netlab.png')
            const logoBuffer = readFileSync(logoPath)
            const logoB64 = logoBuffer.toString('base64')
            // Logo is 6376x1176 → ratio 5.42:1
            const logoH = 8
            const logoW = logoH * 5.42
            doc.addImage(`data:image/png;base64,${logoB64}`, 'PNG', px, y - 2, logoW, logoH)
        } catch {
            setC(C.green)
            doc.setFontSize(18)
            doc.setFont('courier', 'bold')
            doc.text('NETLAB', px, y + 4)
        }

        // Quote number on right
        setC(C.green)
        doc.setFontSize(14)
        doc.setFont('courier', 'bold')
        doc.text(cot.numero_cotizacion || '—', px + innerW, y + 3, { align: 'right' })

        setC(C.muted)
        doc.setFontSize(7)
        doc.setFont('courier', 'normal')
        doc.text('COTIZACIÓN', px + innerW, y - 1, { align: 'right' })

        y += 14

        // ── Separator (green dashed line like terminal prompt) ──
        setC(C.green)
        doc.setFontSize(6)
        doc.setFont('courier', 'normal')
        doc.text('─'.repeat(90), px, y)
        y += 5

        // ══════════════════════════════════════════════════
        //  CLIENT + DETAILS (two terminal-style boxes)
        // ══════════════════════════════════════════════════
        const boxW = (innerW - 6) / 2
        const boxH = 42
        const boxL = px
        const boxR = px + boxW + 6

        // ── Left box: Client ──
        setF(C.headerBg)
        doc.roundedRect(boxL, y, boxW, boxH, 2, 2, 'F')
        setD(C.border)
        doc.roundedRect(boxL, y, boxW, boxH, 2, 2, 'S')

        setC(C.green)
        doc.setFontSize(6.5)
        doc.setFont('courier', 'bold')
        doc.text('$ cat cliente.json', boxL + 5, y + 6)

        setC(C.white)
        doc.setFont('courier', 'bold')
        doc.setFontSize(9)
        doc.text(cot.cliente_nombre || '—', boxL + 5, y + 13)

        doc.setFont('courier', 'normal')
        doc.setFontSize(7.5)
        setC(C.text)
        let cy = y + 19
        if (cot.cliente_empresa) { doc.text(cot.cliente_empresa, boxL + 5, cy); cy += 5 }
        if (cot.cliente_email) { setC(C.green); doc.text(cot.cliente_email, boxL + 5, cy); cy += 5 }
        if (cot.cliente_telefono) { setC(C.text); doc.text(`☎ ${cot.cliente_telefono}`, boxL + 5, cy); cy += 5 }
        if (cot.cliente_rfc) { setC(C.yellow); doc.text(`RFC: ${cot.cliente_rfc}`, boxL + 5, cy) }
        if (cot.cliente_direccion) { cy += 5; setC(C.muted); doc.setFontSize(6.5); doc.text(cot.cliente_direccion.substring(0, 45), boxL + 5, cy) }

        // ── Right box: Details ──
        setF(C.headerBg)
        doc.roundedRect(boxR, y, boxW, boxH, 2, 2, 'F')
        setD(C.border)
        doc.roundedRect(boxR, y, boxW, boxH, 2, 2, 'S')

        setC(C.green)
        doc.setFontSize(6.5)
        doc.setFont('courier', 'bold')
        doc.text('$ cat detalles.json', boxR + 5, y + 6)

        doc.setFontSize(7.5)
        let dy = y + 14
        const addKV = (key: string, val: string, valColor = C.white) => {
            setC(C.muted)
            doc.setFont('courier', 'normal')
            doc.text(`"${key}":`, boxR + 5, dy)
            setC(valColor)
            doc.setFont('courier', 'bold')
            doc.text(`"${val}"`, boxR + boxW - 5, dy, { align: 'right' })
            dy += 6
        }

        addKV('fecha', cot.fecha_emision ? new Date(cot.fecha_emision).toLocaleDateString('es-MX') : '—')
        addKV('vence', cot.fecha_vencimiento ? new Date(cot.fecha_vencimiento).toLocaleDateString('es-MX') : '—')
        addKV('estado', (cot.estado || 'borrador').toUpperCase(), C.green)
        addKV('pago', (cot.condiciones_pago || '—').substring(0, 20))

        y += boxH + 6

        // ── Concepto ──
        if (cot.concepto) {
            setC(C.green)
            doc.setFontSize(6.5)
            doc.setFont('courier', 'bold')
            doc.text('$ echo $CONCEPTO', px, y)
            setC(C.white)
            doc.setFontSize(9)
            doc.setFont('courier', 'normal')
            doc.text(cot.concepto, px, y + 6)
            y += 12
        }

        // ══════════════════════════════════════════════════
        //  ITEMS TABLE
        // ══════════════════════════════════════════════════
        setC(C.green)
        doc.setFontSize(6.5)
        doc.setFont('courier', 'bold')
        doc.text('$ cat partidas.csv | column -t', px, y)
        y += 4

        // Table header
        setF(C.headerBg)
        doc.roundedRect(px, y, innerW, 8, 1.5, 1.5, 'F')
        doc.rect(px, y + 4, innerW, 4, 'F') // flatten bottom

        setC(C.green)
        doc.setFontSize(6.5)
        doc.setFont('courier', 'bold')

        // Column positions
        const tCols = {
            num: px + 3,
            desc: px + 12,
            qty: px + innerW * 0.55,
            price: px + innerW * 0.65,
            disc: px + innerW * 0.8,
            sub: px + innerW * 0.9,
        }

        doc.text('#', tCols.num, y + 5.5)
        doc.text('DESCRIPCIÓN', tCols.desc, y + 5.5)
        doc.text('CANT', tCols.qty, y + 5.5)
        doc.text('P.UNIT', tCols.price, y + 5.5)
        doc.text('DESC', tCols.disc, y + 5.5)
        doc.text('SUBTOTAL', tCols.sub, y + 5.5)
        y += 8

        // Rows
        doc.setFontSize(7)
        items.forEach((item: Record<string, any>, i: number) => {
            if (y > ph - 55) {
                doc.addPage()
                setF(C.pageBg); doc.rect(0, 0, pw, ph, 'F')
                // Redraw terminal bg on new page
                setF(C.termBg); doc.rect(termX, 0, termW, ph, 'F')
                y = 12
            }

            const rowH = 7.5
            if (i % 2 === 0) {
                setF(C.rowAlt)
                doc.rect(px, y, innerW, rowH, 'F')
            }

            const ry = y + 5
            setC(C.dim); doc.setFont('courier', 'normal')
            doc.text(String(i + 1).padStart(2, ' '), tCols.num, ry)

            setC(C.text)
            doc.text((item.descripcion || item.producto_nombre || '—').substring(0, 45), tCols.desc, ry)

            setC(C.muted)
            doc.text(String(item.cantidad), tCols.qty, ry)
            doc.text(fmt(Number(item.precio_unitario)), tCols.price, ry)
            doc.text(item.descuento ? `${item.descuento}%` : '—', tCols.disc, ry)

            setC(C.green); doc.setFont('courier', 'bold')
            doc.text(fmt(Number(item.subtotal)), tCols.sub, ry)

            y += rowH
        })

        // Bottom border of table
        setD(C.border)
        doc.line(px, y, px + innerW, y)
        y += 6

        // ══════════════════════════════════════════════════
        //  TOTALS (terminal-style box on the right)
        // ══════════════════════════════════════════════════
        const totW = 75
        const totX = px + innerW - totW

        setF(C.headerBg)
        doc.roundedRect(totX, y, totW, 32, 2, 2, 'F')
        setD(C.border)
        doc.roundedRect(totX, y, totW, 32, 2, 2, 'S')

        doc.setFontSize(7.5)
        doc.setFont('courier', 'normal')

        // Subtotal
        setC(C.muted)
        doc.text('Subtotal', totX + 5, y + 7)
        setC(C.text)
        doc.text(fmt(Number(cot.subtotal || 0)), totX + totW - 5, y + 7, { align: 'right' })

        // IVA
        setC(C.muted)
        doc.text('IVA 16%', totX + 5, y + 14)
        setC(C.text)
        doc.text(fmt(Number(cot.iva || 0)), totX + totW - 5, y + 14, { align: 'right' })

        // Separator
        setD(C.green)
        doc.setLineWidth(0.5)
        doc.line(totX + 5, y + 18, totX + totW - 5, y + 18)
        doc.setLineWidth(0.2)

        // Total
        setC(C.green)
        doc.setFontSize(10)
        doc.setFont('courier', 'bold')
        doc.text('TOTAL', totX + 5, y + 26)
        doc.text(`${fmt(Number(cot.total || 0))} MXN`, totX + totW - 5, y + 26, { align: 'right' })

        y += 38

        // ── Notes ──
        if (cot.notas && y < ph - 30) {
            setC(C.yellow)
            doc.setFontSize(6.5)
            doc.setFont('courier', 'bold')
            doc.text('# NOTAS', px, y)

            setC(C.text)
            doc.setFontSize(7)
            doc.setFont('courier', 'normal')
            const splitNotes = doc.splitTextToSize(cot.notas, innerW)
            doc.text(splitNotes, px, y + 5)
            y += 5 + splitNotes.length * 3.5
        }

        // ══════════════════════════════════════════════════
        //  FOOTER (inside terminal)
        // ══════════════════════════════════════════════════
        const fy = termY + termH - 8

        setD(C.border)
        doc.line(px, fy - 3, px + innerW, fy - 3)

        setC(C.dim)
        doc.setFontSize(6)
        doc.setFont('courier', 'normal')
        doc.text('Este documento es una cotización y no tiene validez fiscal.', px, fy)

        setC(C.green)
        doc.text(
            `netlab.mx • ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            px + innerW, fy, { align: 'right' }
        )

        // Terminal prompt at bottom
        setC(C.green)
        doc.setFontSize(6.5)
        doc.setFont('courier', 'bold')
        doc.text('netlab@consulting:~$', px, fy + 4)
        setC(C.dim)
        doc.setFont('courier', 'normal')
        doc.text('_', px + 42, fy + 4)

        // ── Output ──
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
