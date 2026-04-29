import { neon } from '@neondatabase/serverless';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
    console.error('[migrate-aportes] DATABASE_URL no está configurada. Define la variable de entorno antes de ejecutar este script.');
    process.exit(1);
}
const sql = neon(DB_URL);

async function main() {
    await sql`
    CREATE TABLE IF NOT EXISTS aportes_capital (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      socio TEXT NOT NULL,
      monto NUMERIC(12,2) NOT NULL,
      concepto TEXT,
      fecha DATE NOT NULL DEFAULT CURRENT_DATE,
      notas TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
    console.log('✅ Created aportes_capital table');
}
main().catch(e => console.error(e));
