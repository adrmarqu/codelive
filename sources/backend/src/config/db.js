const { Pool } = require('pg');

let sslConfig = false;

if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  const sslDisabled = process.env.DATABASE_URL.includes('sslmode=disable') || process.env.DB_SSL === 'false';
  
  if (!isLocal && !sslDisabled) {
    sslConfig = { rejectUnauthorized: false };
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

module.exports = pool;

