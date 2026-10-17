import { query } from "./db";
import { hashPassword } from "./auth";

/**
 * Ensures the required tables exist in MySQL silk_db and seeds default admin credentials.
 */
export async function ensureAdminTables(): Promise<void> {
  // 1. Create admin_users table
  await query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      name VARCHAR(191) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Check if default admin exists
  const existing = await query<any>(
    "SELECT id, email FROM admin_users WHERE email = ? LIMIT 1",
    ["admin@silkkaragiri.com"]
  );

  if (existing.length === 0) {
    const passwordHash = hashPassword("pass@1234");
    await query(
      `INSERT INTO admin_users (id, email, name, role, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "usr_admin_01",
        "admin@silkkaragiri.com",
        "Master Weaver Admin",
        "super_admin",
        passwordHash,
      ]
    );
    console.log("Seeded default admin: admin@silkkaragiri.com with pass@1234");
  }
}
