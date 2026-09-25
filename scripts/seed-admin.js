// Ensures at least one ADMIN user exists, using ADMIN_EMAIL / ADMIN_PASSWORD env vars.
// Safe to run on every boot: no-ops if an admin already exists or env vars are missing.
const { PrismaClient } = require('@prisma/client');
const { scryptSync, randomBytes } = require('crypto');

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed.');
    return;
  }

  const prisma = new PrismaClient();
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      console.log(`Admin already exists (${existingAdmin.email}) — skipping seed.`);
      return;
    }

    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { role: 'ADMIN', passwordHash: hashPassword(password), mustChangePassword: false }
      });
      console.log(`Promoted existing user ${email} to ADMIN.`);
      return;
    }

    await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        role: 'ADMIN',
        mustChangePassword: false
      }
    });
    console.log(`Created initial admin user: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Admin seed failed:', err);
  process.exit(1);
});
