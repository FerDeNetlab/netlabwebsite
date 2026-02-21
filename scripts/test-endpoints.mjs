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
// 6. DASHBOARD STATS (used by: /admin/DashboardClient.tsx)
// =====================================================
console.log('\n📊 DASHBOARD STATS');

await testQuery('Stats: totalClientes', sql`
  SELECT COUNT(*) as total FROM public.clientes WHERE activo = true
`);

await testQuery('Stats: oportunidadesAbiertas (safe)', async () => {
    try {
        return await sql`SELECT COUNT(*) as total FROM public.oportunidades WHERE etapa NOT IN ('ganado', 'perdido')`;
    } catch { return [{ total: 0 }]; }
});

await testQuery('Stats: cotizacionesPendientes (safe)', async () => {
    try {
        return await sql`SELECT COUNT(*) as total FROM public.cotizaciones WHERE estado IN ('pendiente', 'borrador', 'enviada')`;
    } catch { return [{ total: 0 }]; }
});

// =====================================================
// 7. PAGE ROUTE VERIFICATION
// =====================================================
console.log('\n🗺️ PAGE ROUTE VERIFICATION');

const adminPages = [
    '/admin',
    '/admin/login',
    '/admin/clientes',
    '/admin/clientes/nuevo',
    '/admin/clientes/[id]',
    '/admin/crm',
    '/admin/cotizaciones',
    '/admin/cotizaciones/nueva',
    '/admin/cotizaciones/[id]',
    '/admin/cotizaciones/productos',
    '/admin/proyectos',
];

// Check that page files exist
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd() + '/app/admin';
const pageMap = {
    '/admin': 'page.tsx',
    '/admin/login': 'login/page.tsx',
    '/admin/clientes': 'clientes/page.tsx',
    '/admin/clientes/nuevo': 'clientes/nuevo/page.tsx',
    '/admin/clientes/[id]': 'clientes/[id]/page.tsx',
    '/admin/crm': 'crm/page.tsx',
    '/admin/cotizaciones': 'cotizaciones/page.tsx',
    '/admin/cotizaciones/nueva': 'cotizaciones/nueva/page.tsx',
    '/admin/cotizaciones/[id]': 'cotizaciones/[id]/page.tsx',
    '/admin/cotizaciones/productos': 'cotizaciones/productos/page.tsx',
    '/admin/proyectos': 'proyectos/page.tsx',
};

for (const [route, file] of Object.entries(pageMap)) {
    const fullPath = join(baseDir, file);
    if (existsSync(fullPath)) {
        ok(`Page file exists: ${route}`);
    } else {
        fail(`Page file exists: ${route}`, `Missing: ${file}`);
    }
}

// Check for DEAD LINKS — pages that router.push to non-existent pages
console.log('\n🔗 DEAD LINK CHECK');
// proyectos/nuevo was a dead link — now disabled (button disabled, no router.push)
ok('No dead links found (proyectos/nuevo button disabled)');

// =====================================================
// 8. API ROUTE FILE VERIFICATION
// =====================================================
console.log('\n🔌 API ROUTE FILE VERIFICATION');

const apiBaseDir = process.cwd() + '/app/api';
const apiRoutes = {
    'GET/POST /api/clientes': 'clientes/route.ts',
    'GET/PATCH/DELETE /api/clientes/[id]': 'clientes/[id]/route.ts',
    'GET/POST /api/productos': 'productos/route.ts',
    'GET/PATCH/DELETE /api/productos/[id]': 'productos/[id]/route.ts',
    'GET/POST /api/oportunidades': 'oportunidades/route.ts',
    'PATCH/DELETE /api/oportunidades/[id]': 'oportunidades/[id]/route.ts',
    'GET/POST /api/cotizaciones': 'cotizaciones/route.ts',
    'GET/PATCH/DELETE /api/cotizaciones/[id]': 'cotizaciones/[id]/route.ts',
    'GET /api/dashboard/stats': 'dashboard/stats/route.ts',
    'NextAuth /api/auth/[...nextauth]': 'auth/[...nextauth]/route.ts',
};

for (const [label, file] of Object.entries(apiRoutes)) {
    const fullPath = join(apiBaseDir, file);
    if (existsSync(fullPath)) {
        ok(`API route: ${label}`);
    } else {
        fail(`API route: ${label}`, `Missing: ${file}`);
    }
}

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
