import mysql from "mysql2/promise";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "pass@1234",
    database: "silk_db",
  });

  console.log("Connecting to MySQL localhost:3306 (silk_db)...");
  await pool.query(`
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

  const [existing] = await pool.query(
    "SELECT id, email FROM admin_users WHERE email = ? LIMIT 1",
    ["admin@silkkaragiri.com"]
  );

  const passwordHash = hashPassword("pass@1234");
  if (existing.length === 0) {
    await pool.query(
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
    console.log("SUCCESS: Default admin seeded (admin@silkkaragiri.com / pass@1234)");
  } else {
    // Update password hash to guarantee it matches pass@1234
    await pool.query(
      "UPDATE admin_users SET password_hash = ? WHERE email = ?",
      [passwordHash, "admin@silkkaragiri.com"]
    );
    console.log("SUCCESS: Default admin credentials updated with pass@1234.");
  }

  const [rows] = await pool.query("SELECT id, email, name, role, created_at FROM admin_users");
  console.log("Admin Users in Database:", rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error executing seed:", err);
  process.exit(1);
});
