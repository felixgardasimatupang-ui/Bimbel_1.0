import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from '../src/lib/db';

async function migrate() {
  console.log('Running database migration...');

  const migrationPath = join(__dirname, '..', 'db', 'migrations', '001_initial_schema.sql');
  const sqlContent = readFileSync(migrationPath, 'utf-8');

  try {
    await sql.unsafe(sqlContent);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  await sql.end();
}

migrate();
