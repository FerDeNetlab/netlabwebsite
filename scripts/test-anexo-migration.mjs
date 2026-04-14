#!/usr/bin/env node
/**
 * Test: Verificar que la migración del Anexo Financiero pasó
 * node scripts/test-anexo-migration.mjs
 */

import { neon } from '@neondatabase/serverless';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('❌ DATABASE_URL no configurada');
  process.exit(1);
}

const sql = neon(DB_URL);

async function testMigration() {
  console.log('🔍 Verificando migración del Anexo Financiero...\n');

  const checks = [
    {
      name: 'Tabla bolsas_presupuestarias',
      query: `SELECT 1 FROM information_schema.tables WHERE table_name = 'bolsas_presupuestarias'`,
    },
    {
      name: 'Tabla decisiones_junta',
      query: `SELECT 1 FROM information_schema.tables WHERE table_name = 'decisiones_junta'`,
    },
    {
      name: 'Tabla alertas_financieras',
      query: `SELECT 1 FROM information_schema.tables WHERE table_name = 'alertas_financieras'`,
    },
    {
      name: 'Campo facturas.tipo_ingreso',
      query: `SELECT 1 FROM information_schema.columns WHERE table_name = 'facturas' AND column_name = 'tipo_ingreso'`,
    },
    {
      name: 'Campo oportunidades.tipo_ingreso',
      query: `SELECT 1 FROM information_schema.columns WHERE table_name = 'oportunidades' AND column_name = 'tipo_ingreso'`,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const result = await sql([check.query]);
      if (result && result.length > 0) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${check.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Resultado: ${passed} pasado, ${failed} fallido`);

  if (failed === 0) {
    console.log('\n✨ La migración pasó correctamente. Fase 2 lista para comenzar.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Hay problemas con la migración. Verifica el script SQL.');
    process.exit(1);
  }
}

testMigration();
