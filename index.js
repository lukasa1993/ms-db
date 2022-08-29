import fs       from 'fs';
import {
  create,
  up,
}               from 'ms-db-migration';
import postgres from 'postgres';

export const DB_CONFIG = {
  host:     process.env.POSTGRES_HOST,
  port:     process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD || fs.readFileSync('/run/secrets/POSTGRES_PASSWORD_FILE').toString().trim(),
  ssl:      parseInt(process.env.POSTGRES_SSL) === 1 ? {
    rejectUnauthorized: true,
    ca:                 fs.readFileSync('/run/secrets/POSTGRES_CA').toString(),
  } : null,
};

export function createMigrationsFolder() {
  if (fs.existsSync('./migrations') === false) {
    fs.mkdirSync('./migrations');
  }
}

export async function migrate(schema) {
  createMigrationsFolder();

  return await up({
    dir:    './migrations',
    driver: 'postgres',
    config: {
      ...DB_CONFIG, schema,
    },
  });
}

export async function createMigration(name, schema) {
  createMigrationsFolder();

  return await create({
    dir:       './migrations',
    driver:    'postgres',
    filename:  name,
    timestamp: true,
    config:    { ...DB_CONFIG, schema },
  });
}

const sql = postgres(DB_CONFIG);

export default sql;
