/**
 * Freewheel Automated Database Setup & Seeder Script
 * 
 * Automatically connects to PostgreSQL, creates freewheel_db if it doesn't exist,
 * builds all 7 database tables, and seeds the real 9 team members!
 */

const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const rawDbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/freewheel_db';

console.log('=======================================================');
console.log('  Freewheel PostgreSQL Database Setup & Seeder');
console.log(`  Connecting to PostgreSQL Server...`);
console.log('=======================================================');

async function ensureDatabaseExists(urlStr) {
  try {
    const urlObj = new URL(urlStr);
    const dbName = urlObj.pathname.replace(/^\//, '') || 'freewheel_db';
    
    // Create temporary connection to default 'postgres' database
    urlObj.pathname = '/postgres';
    const postgresClient = new Client({
      connectionString: urlObj.toString(),
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    await postgresClient.connect();
    
    // Check if freewheel_db exists
    const checkRes = await postgresClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (checkRes.rows.length === 0) {
      console.log(`[Database Auto-Create] Database "${dbName}" does not exist. Creating database now...`);
      await postgresClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[Database Auto-Create] Database "${dbName}" created successfully!`);
    } else {
      console.log(`[Database Verified] Database "${dbName}" exists.`);
    }

    await postgresClient.end();
  } catch (err) {
    console.warn('[Database Check Warning]', err.message);
  }
}

async function runDatabaseSetup() {
  await ensureDatabaseExists(rawDbUrl);

  const pool = new Pool({
    connectionString: rawDbUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  let client;
  try {
    client = await pool.connect();
    console.log('[1/3] Connected to target PostgreSQL database!');

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const sqlContent = fs.readFileSync(schemaPath, 'utf8');
    console.log('[2/3] Executing schema table creation and seed queries...');

    await client.query(sqlContent);
    console.log('[3/3] All database tables created and real team members seeded successfully!');

    // Verify User Count
    const userRes = await client.query('SELECT COUNT(*) FROM users');
    console.log(`\n  ✅ SUCCESS! Verified ${userRes.rows[0].count} team members configured in PostgreSQL database.`);

    console.log('=======================================================');
    console.log('  Database setup completed cleanly!');
    console.log('=======================================================');
  } catch (err) {
    console.error('\n  ❌ Setup Error:', err.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runDatabaseSetup();
