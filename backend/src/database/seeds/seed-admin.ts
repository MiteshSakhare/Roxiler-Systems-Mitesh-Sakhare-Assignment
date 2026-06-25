import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Seeds a default ADMIN user so the platform is usable on first run.
 * Idempotent: skips if the admin email already exists.
 *
 * Run via: npm run seed
 */
async function seedAdmin(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'store_rating_db',
    synchronize: false,
    logging: true,
  });

  await dataSource.initialize();

  const email = process.env.ADMIN_EMAIL || 'admin@nimbus.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const name = process.env.ADMIN_NAME || 'System Administrator Default';

  // Check if admin already exists
  const existing = await dataSource.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (existing.length > 0) {
    console.log(`Admin user (${email}) already exists — skipping seed.`);
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await dataSource.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, email, passwordHash, 'Platform HQ', 'ADMIN'],
  );

  console.log(`✅ Admin user seeded: ${email} / ${password}`);
  await dataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
