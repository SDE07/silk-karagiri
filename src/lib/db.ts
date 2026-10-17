import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

/**
 * Singleton MySQL 8.0 connection pool for Next.js App Router.
 * Reuses the pool across hot-reloads in development.
 */
export function getDbPool(): mysql.Pool {
  if (global._mysqlPool) {
    return global._mysqlPool;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "pass@1234",
    database: process.env.DB_NAME || "silk_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

  if (process.env.NODE_ENV !== "production") {
    global._mysqlPool = pool;
  }

  return pool;
}

/**
 * Execute parameterized SQL query with type-safety.
 */
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const pool = getDbPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
