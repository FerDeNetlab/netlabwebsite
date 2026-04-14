#!/usr/bin/env node
/**
 * Script para ejecutar migración del Anexo Financiero
 * node scripts/migrate-anexo-financiero.mjs
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('❌ ERROR: DATABASE_URL no está configurada');
  process.exit(1);
}

const sql = neon(DB_URL);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración del Anexo Financiero...\n');

    const sqlPath = path.join(__dirname, 'create-anexo-financiero-tables.sql');
    const scriptContent = fs.readFileSync(sqlPath, 'utf-8');

    // Dividir el script en statements individuales por ";"
    const statements = scriptContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    let executed = 0;
    let errors = 0;

    for (const statement of statements) {
      try {
        // Agregar ; al final si no lo tiene
        const fullStatement = statement.endsWith(';') ? statement : statement + ';';
        await sql([fullStatement]);
        executed++;
        console.log(`✅ ${executed}. ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`);
      } catch (error) {
        errors++;
        console.error(`❌ ERROR: ${error.message}`);
        console.error(`   Statement: ${statement.substring(0, 100)}\n`);
      }
    }

    console.log(`\n📊 Resumen: ${executed} statements ejecutados, ${errors} errores`);

    if (errors === 0) {
      console.log('✨ Migración completada exitosamente');
      process.exit(0);
    } else {
      console.log('⚠️  Migración completada con errores');
      process.exit(1);
    }
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

runMigration();
