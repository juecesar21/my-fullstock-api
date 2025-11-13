import env from "@/env.js";
import camelcaseKeys from "camelcase-keys";
import { Pool, type QueryResultRow } from "pg";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  console.log("executed query", {
    text,
    duration: `${duration}ms`,
    rows: res.rowCount,
  });

  return { ...res, rows: camelcaseKeys(res.rows) as T[] };
}

export function getClient() {
  return pool.connect();
}

export async function testConnection(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful ✅");
  } catch (err) {
    console.error("Database connection failed ❌", err);
    throw err;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
  console.log("Database pool closed");
}
