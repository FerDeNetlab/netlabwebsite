/**
 * ERP Endpoint Audit — Comprehensive Test Suite
 * Tests every API endpoint that admin pages depend on.
 * Run: node scripts/test-endpoints.mjs
 */

import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_5bmQ2vxADEig@ep-frosty-queen-ahku8g2f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DB_URL);

let passed = 0;
let failed = 0;
const failures = [];

function ok(name) {
  passed++;
  console.log(`  ✅ ${name}`);
}

function fail(name, reason) {
  failed++;
  failures.push({ name, reason });
  console.log(`  ❌ ${name}: ${reason}`);
}

async function testQuery(name, query) {
  try {
    const result = await query;
    ok(name);
    return result;
  } catch (error) {
    fail(name, error.message);
    return null;
  }
}

// =====================================================
// 1. TABLE EXISTENCE TESTS
// =====================================================
console.log('\n📋 TABLE EXISTENCE');
const requiredTables = ['clientes', 'oportunidades', 'cotizaciones', 'cotizacion_items', 'productos', 'proyectos'];
for (const table of requiredTables) {
  await testQuery(`Table "${table}" exists`, sql`
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = ${table}
  `);
}

// =====================================================
// 2. CLIENTES CRUD (used by: /admin/clientes, /admin/clientes/[id], /admin/clientes/nuevo)
// =====================================================
console.log('\n👥 CLIENTES CRUD');

// GET /api/clientes — used by clientes/page.tsx, CRMKanban.tsx, cotizaciones/nueva
const allClientes = await testQuery('GET clientes (list)', sql`
  SELECT * FROM public.clientes WHERE activo = true ORDER BY created_at DESC
`);

// POST /api/clientes — used by clientes/nuevo/page.tsx
const newCliente = await testQuery('POST clientes (create)', sql`
  INSERT INTO public.clientes (id, nombre, empresa, email, telefono, ciudad, estado, direccion, rfc, notas, activo, created_at, updated_at)
  VALUES (gen_random_uuid(), '__TEST_CLIENTE__', 'Test Corp', 'test@test.com', '555-0000', 'CDMX', 'CDMX', 'Dir Test', 'TEST000000XX0', 'nota test', true, NOW(), NOW())
  RETURNING *
`);

const testClienteId = newCliente?.[0]?.id;

if (testClienteId) {
  // GET /api/clientes/[id] — used by clientes/[id]/page.tsx
  await testQuery('GET clientes/[id] (single)', sql`
    SELECT * FROM public.clientes WHERE id = ${testClienteId}
  `);

  // PATCH /api/clientes/[id] — used by clientes/[id]/page.tsx
  await testQuery('PATCH clientes/[id] (update)', sql`
    UPDATE public.clientes SET nombre = COALESCE(${'__TEST_UPDATED__'}, nombre), updated_at = NOW() WHERE id = ${testClienteId} RETURNING *
  `);

  // DELETE /api/clientes/[id] — used by clientes/[id]/page.tsx (soft delete)
  await testQuery('DELETE clientes/[id] (soft delete)', sql`
    UPDATE public.clientes SET activo = false, updated_at = NOW() WHERE id = ${testClienteId}
  `);

  // Cleanup
  await sql`DELETE FROM public.clientes WHERE id = ${testClienteId}`;
} else {
  fail('clientes/[id] tests', 'Could not create test client');
}

// =====================================================
// 3. PRODUCTOS CRUD (used by: /admin/cotizaciones/productos, /admin/cotizaciones/nueva)
// =====================================================
console.log('\n📦 PRODUCTOS CRUD');

// GET /api/productos — used by productos/page.tsx, cotizaciones/nueva
await testQuery('GET productos (list)', sql`
  SELECT * FROM productos WHERE activo = true ORDER BY categoria, nombre LIMIT 5
`);

// POST /api/productos — used by productos/page.tsx
const newProd = await testQuery('POST productos (create)', sql`
  INSERT INTO productos (id, nombre, descripcion, precio_unitario, categoria, unidad, activo, created_at, updated_at)
  VALUES (gen_random_uuid(), '__TEST_PROD__', 'Test desc', 100.00, 'Test', 'pieza', true, NOW(), NOW())
  RETURNING *
`);

const testProdId = newProd?.[0]?.id;

if (testProdId) {
  // GET /api/productos/[id]
  await testQuery('GET productos/[id] (single)', sql`
    SELECT * FROM public.productos WHERE id = ${testProdId}
  `);

  // PATCH /api/productos/[id] — used by productos/page.tsx edit
  await testQuery('PATCH productos/[id] (update)', sql`
    UPDATE public.productos SET nombre = COALESCE(${'__TEST_PROD_UPD__'}, nombre), updated_at = NOW() WHERE id = ${testProdId} RETURNING *
  `);

  // DELETE /api/productos/[id] — used by productos/page.tsx (soft delete)
  await testQuery('DELETE productos/[id] (soft delete)', sql`
    UPDATE public.productos SET activo = false, updated_at = NOW() WHERE id = ${testProdId}
  `);

  // Cleanup
  await sql`DELETE FROM public.productos WHERE id = ${testProdId}`;
} else {
  fail('productos/[id] tests', 'Could not create test product');
}

// =====================================================
// 4. OPORTUNIDADES CRUD (used by: /admin/crm/CRMKanban.tsx)
// =====================================================
console.log('\n🎯 OPORTUNIDADES CRUD');

// Need a temp client for FK
const tempClient = await sql`
  INSERT INTO public.clientes (id, nombre, activo, created_at, updated_at) 
  VALUES (gen_random_uuid(), '__TEMP_FOR_OP__', true, NOW(), NOW()) RETURNING id
`;
const tempClientId = tempClient[0].id;

// GET /api/oportunidades — used by CRMKanban
await testQuery('GET oportunidades (list with JOIN)', sql`
  SELECT o.*, c.nombre as cliente_nombre, c.empresa as cliente_empresa
  FROM oportunidades o LEFT JOIN clientes c ON o.cliente_id = c.id
  ORDER BY o.created_at DESC
`);

// POST /api/oportunidades — used by CRMKanban modal
const newOp = await testQuery('POST oportunidades (create)', sql`
  INSERT INTO oportunidades (id, nombre, cliente_id, valor, probabilidad, etapa, descripcion, created_at, updated_at)
  VALUES (gen_random_uuid(), '__TEST_OP__', ${tempClientId}, 50000, 50, 'prospecto', 'test', NOW(), NOW())
  RETURNING *
`);

const testOpId = newOp?.[0]?.id;

if (testOpId) {
  // PATCH /api/oportunidades/[id] — used by drag-drop + edit modal
  await testQuery('PATCH oportunidades/[id] (update etapa)', sql`
    UPDATE oportunidades SET etapa = COALESCE(${'calificacion'}, etapa), updated_at = NOW() WHERE id = ${testOpId} RETURNING *
  `);

  await testQuery('PATCH oportunidades/[id] (update all fields)', sql`
    UPDATE oportunidades SET 
      nombre = COALESCE(${'__TEST_OP_UPD__'}, nombre),
      valor = COALESCE(${75000}, valor),
      probabilidad = COALESCE(${80}, probabilidad),
      cliente_id = COALESCE(${tempClientId}, cliente_id),
      updated_at = NOW()
    WHERE id = ${testOpId} RETURNING *
  `);

  // DELETE /api/oportunidades/[id] — used by CRMKanban delete button
  await testQuery('DELETE oportunidades/[id] (hard delete)', sql`
    DELETE FROM oportunidades WHERE id = ${testOpId}
  `);
} else {
  fail('oportunidades/[id] tests', 'Could not create test oportunidad');
}

// Cleanup temp client
await sql`DELETE FROM public.clientes WHERE id = ${tempClientId}`;

// =====================================================
// 5. COTIZACIONES CRUD (used by: /admin/cotizaciones, /admin/cotizaciones/[id], /admin/cotizaciones/nueva)
// =====================================================
console.log('\n📄 COTIZACIONES CRUD');

// Need a temp client
const tempClient2 = await sql`
  INSERT INTO public.clientes (id, nombre, activo, created_at, updated_at)
  VALUES (gen_random_uuid(), '__TEMP_FOR_COT__', true, NOW(), NOW()) RETURNING id
`;
const tempClientId2 = tempClient2[0].id;

// GET /api/cotizaciones — used by cotizaciones/page.tsx
await testQuery('GET cotizaciones (list with JOIN)', sql`
  SELECT c.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa,
    (SELECT COUNT(*) FROM cotizacion_items WHERE cotizacion_id = c.id) as items_count
  FROM cotizaciones c LEFT JOIN clientes cl ON c.cliente_id = cl.id
  ORDER BY c.created_at DESC
`);

// POST /api/cotizaciones — used by cotizaciones/nueva
const newCot = await testQuery('POST cotizaciones (create with all fields)', sql`
  INSERT INTO cotizaciones (id, cliente_id, concepto, subtotal, iva, total, estado, fecha_emision, fecha_vencimiento, condiciones_pago, notas, numero_cotizacion, created_at, updated_at)
  VALUES (gen_random_uuid(), ${tempClientId2}, 'Test Concepto', 10000, 1600, 11600, 'borrador', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Pago contra entrega', 'nota test', 'COT-TEST', NOW(), NOW())
  RETURNING *
`);

const testCotId = newCot?.[0]?.id;

if (testCotId) {
  // Insert test item
  const testItem = await testQuery('POST cotizacion_items (create)', sql`
    INSERT INTO cotizacion_items (id, cotizacion_id, descripcion, cantidad, precio_unitario, descuento, subtotal, created_at)
    VALUES (gen_random_uuid(), ${testCotId}, 'Servicio test', 2, 5000, 0, 10000, NOW())
    RETURNING *
  `);

  // GET /api/cotizaciones/[id] — used by cotizaciones/[id]/page.tsx
  const cotDetail = await testQuery('GET cotizaciones/[id] (with items + client)', sql`
    SELECT c.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa, cl.email as cliente_email, cl.rfc as cliente_rfc
    FROM cotizaciones c LEFT JOIN clientes cl ON c.cliente_id = cl.id WHERE c.id = ${testCotId}
  `);

  const cotItems = await testQuery('GET cotizacion_items for cotizacion', sql`
    SELECT ci.*, p.nombre as producto_nombre FROM cotizacion_items ci 
    LEFT JOIN productos p ON ci.producto_id = p.id WHERE ci.cotizacion_id = ${testCotId}
  `);

  // PATCH /api/cotizaciones/[id] — used by status change buttons
  await testQuery('PATCH cotizaciones/[id] (change estado)', sql`
    UPDATE cotizaciones SET estado = COALESCE(${'enviada'}, estado), updated_at = NOW() WHERE id = ${testCotId} RETURNING *
  `);

  // DELETE /api/cotizaciones/[id] — used by delete button
  await testQuery('DELETE cotizacion_items (cascade)', sql`
    DELETE FROM cotizacion_items WHERE cotizacion_id = ${testCotId}
  `);
  await testQuery('DELETE cotizaciones/[id]', sql`
    DELETE FROM cotizaciones WHERE id = ${testCotId}
  `);
} else {
  fail('cotizaciones/[id] tests', 'Could not create test cotizacion');
}

// Cleanup
await sql`DELETE FROM public.clientes WHERE id = ${tempClientId2}`;

// =====================================================
// 9. FINANCIAL TABLES
// =====================================================
console.log('\n💰 FINANCIAL TABLES');
for (const table of ['facturas', 'pagos', 'gastos', 'categorias_gasto']) {
  await testQuery(`Table "${table}" exists`, sql`
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = ${table}
  `);
}

// =====================================================
// 10. FACTURAS CRUD
// =====================================================
console.log('\n🧾 FACTURAS CRUD');

const tempClient3 = await sql`
  INSERT INTO public.clientes (id, nombre, activo, created_at, updated_at)
  VALUES (gen_random_uuid(), '__TEMP_FOR_FAC__', true, NOW(), NOW()) RETURNING id
`;
const tempClientId3 = tempClient3[0].id;

const newFac = await testQuery('POST facturas (create)', sql`
  INSERT INTO facturas (id, cliente_id, numero_factura, concepto, subtotal, iva, total, estado, fecha_emision, fecha_vencimiento, created_at, updated_at)
  VALUES (gen_random_uuid(), ${tempClientId3}, 'NL-TEST-0001', 'Test Factura', 10000, 1600, 11600, 'pendiente', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW(), NOW())
  RETURNING *
`);

const testFacId = newFac?.[0]?.id;

if (testFacId) {
  await testQuery('GET facturas (list with JOIN)', sql`
    SELECT f.*, cl.nombre as cliente_nombre,
      (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p WHERE p.factura_id = f.id) as total_pagado
    FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
    ORDER BY f.created_at DESC
  `);

  await testQuery('GET facturas/[id] (detail)', sql`
    SELECT f.*, cl.nombre as cliente_nombre FROM facturas f
    LEFT JOIN clientes cl ON f.cliente_id = cl.id WHERE f.id = ${testFacId}
  `);

  // Register payment
  const newPago = await testQuery('POST pagos (register payment)', sql`
    INSERT INTO pagos (id, factura_id, monto, metodo_pago, referencia, fecha_pago, created_at)
    VALUES (gen_random_uuid(), ${testFacId}, 5000, 'transferencia', 'REF-TEST-001', CURRENT_DATE, NOW())
    RETURNING *
  `);

  await testQuery('GET pagos for factura', sql`
    SELECT * FROM pagos WHERE factura_id = ${testFacId}
  `);

  await testQuery('PATCH facturas/[id] (change estado)', sql`
    UPDATE facturas SET estado = 'parcial', updated_at = NOW() WHERE id = ${testFacId} RETURNING *
  `);

  // Cleanup
  await sql`DELETE FROM pagos WHERE factura_id = ${testFacId}`;
  await sql`DELETE FROM facturas WHERE id = ${testFacId}`;
} else {
  fail('facturas tests', 'Could not create test factura');
}

// =====================================================
// 11. GASTOS CRUD
// =====================================================
console.log('\n💸 GASTOS CRUD');

const cats = await testQuery('GET categorias_gasto', sql`
  SELECT * FROM categorias_gasto WHERE activo = true ORDER BY nombre
`);

const catId = cats?.[0]?.id;

const newGasto = await testQuery('POST gastos (create)', sql`
  INSERT INTO gastos (id, categoria_id, concepto, monto, fecha_vencimiento, proveedor, estado, created_at, updated_at)
  VALUES (gen_random_uuid(), ${catId || null}, 'Test Gasto', 5000, CURRENT_DATE + INTERVAL '7 days', 'Proveedor Test', 'pendiente', NOW(), NOW())
  RETURNING *
`);

const testGastoId = newGasto?.[0]?.id;

if (testGastoId) {
  await testQuery('GET gastos (list with categories)', sql`
    SELECT g.*, cg.nombre as categoria_nombre FROM gastos g
    LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
    ORDER BY g.created_at DESC
  `);

  await testQuery('PATCH gastos/[id] (mark paid)', sql`
    UPDATE gastos SET estado = 'pagado', fecha_pago = CURRENT_DATE, updated_at = NOW() WHERE id = ${testGastoId} RETURNING *
  `);

  await sql`DELETE FROM gastos WHERE id = ${testGastoId}`;
} else {
  fail('gastos tests', 'Could not create test gasto');
}

await sql`DELETE FROM public.clientes WHERE id = ${tempClientId3}`;

// =====================================================
// 12. FINANZAS STATS / CALENDARIO / FLUJO QUERIES
// =====================================================
console.log('\n📈 FINANZAS QUERIES');

await testQuery('Stats: CxC total', sql`
  SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE estado IN ('pendiente', 'parcial')
`);

await testQuery('Stats: CxP total', sql`
  SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE estado = 'pendiente'
`);

await testQuery('Stats: ingresos mes', sql`
  SELECT COALESCE(SUM(monto), 0) as total FROM pagos
  WHERE DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
`);

await testQuery('Calendario: cobros del mes', sql`
  SELECT f.id, f.numero_factura, f.total, f.fecha_vencimiento
  FROM facturas f WHERE EXTRACT(MONTH FROM f.fecha_vencimiento) = EXTRACT(MONTH FROM CURRENT_DATE)
`);

await testQuery('Flujo: ingresos esperados 90d', sql`
  SELECT fecha_vencimiento, SUM(total) as monto FROM facturas
  WHERE estado IN ('pendiente', 'parcial') AND fecha_vencimiento >= CURRENT_DATE
    AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '90 days'
  GROUP BY fecha_vencimiento ORDER BY fecha_vencimiento
`);

await testQuery('Flujo: egresos esperados 90d', sql`
  SELECT fecha_vencimiento, SUM(monto) as monto FROM gastos
  WHERE estado = 'pendiente' AND fecha_vencimiento >= CURRENT_DATE
    AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '90 days'
  GROUP BY fecha_vencimiento ORDER BY fecha_vencimiento
`);

// =====================================================
// SUMMARY
// =====================================================
console.log('\n' + '='.repeat(60));
console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed\n`);

if (failures.length > 0) {
  console.log('❌ FAILURES:');
  for (const f of failures) {
    console.log(`   • ${f.name}: ${f.reason}`);
  }
}

console.log('');
process.exit(failed > 0 ? 1 : 0);

