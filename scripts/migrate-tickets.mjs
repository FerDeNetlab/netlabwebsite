#!/usr/bin/env node
/**
 * Migración del módulo de Tickets (ticketera)
 *   node scripts/migrate-tickets.mjs
 * Crea ticket_proyectos, tickets, ticket_comentarios + triggers.
 * Idempotente (CREATE TABLE IF NOT EXISTS).
 */

import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_URL = process.env.DATABASE_URL
if (!DB_URL) {
    console.error('❌ ERROR: DATABASE_URL no está configurada')
    process.exit(1)
}

const sql = neon(DB_URL)

// Divide el SQL en statements respetando bloques dollar-quoted ($$ ... $$)
function splitStatements(content) {
    const statements = []
    let current = ''
    let inDollar = false
    const lines = content.split('\n')
    for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('--')) continue // comentario de línea completa
        // contar ocurrencias de $$ para alternar el estado
        const dollarCount = (line.match(/\$\$/g) || []).length
        current += line + '\n'
        if (dollarCount % 2 === 1) inDollar = !inDollar
        if (!inDollar && line.includes(';')) {
            statements.push(current.trim())
            current = ''
        }
    }
    if (current.trim()) statements.push(current.trim())
    return statements.filter((s) => s && s !== ';')
}

async function run() {
    console.log('🚀 Migración de Tickets...\n')
    const sqlPath = path.join(__dirname, 'create-tickets-tables.sql')
    const content = fs.readFileSync(sqlPath, 'utf-8')
    const statements = splitStatements(content)

    let ok = 0
    let err = 0
    for (const stmt of statements) {
        try {
            await sql.query(stmt)
            ok++
            const label = stmt.split('\n')[0].slice(0, 70)
            console.log(`  ✅ ${label}`)
        } catch (e) {
            err++
            console.error(`  ❌ ${stmt.split('\n')[0].slice(0, 70)}\n     ${e.message}`)
        }
    }
    console.log(`\n✨ Listo. ${ok} statements OK, ${err} con error.`)
    process.exit(err > 0 ? 1 : 0)
}

run()
