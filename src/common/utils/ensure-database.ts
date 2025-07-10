import { Logger } from '@nestjs/common';
import { join } from 'path';
import { spawn } from 'child_process';

export async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME || 'mma-platform';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPass = process.env.DB_PASS || 'postgres';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const { Client } = require('pg');
  const client = new Client({
    user: dbUser,
    password: dbPass,
    host: dbHost,
    port: parseInt(dbPort, 10),
    database: 'postgres',
  });
  await client.connect();
  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    Logger.log(`Database '${dbName}' created automatically.`);
    // Seed dummy data after DB creation
    const seedScript = join(process.cwd(), 'src', 'common', 'utils', 'seed-dummy-data.ts');
    const child = spawn('npx', ['ts-node', seedScript], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', (code) => {
      if (code === 0) {
        Logger.log('Dummy data seeded successfully.');
      } else {
        Logger.error('Failed to seed dummy data.');
      }
    });
  }
  await client.end();
}
