import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_5bmQ2vxADEig@ep-frosty-queen-ahku8g2f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
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
