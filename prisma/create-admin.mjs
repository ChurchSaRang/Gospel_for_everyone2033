import crypto from 'node:crypto';

const LEGACY_ADMIN_EMAIL = 'admin@gospletoeveryone.org';

function hashPassword(value) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(value, salt, 64);
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    let databaseProtocol = '';
    try {
        databaseProtocol = databaseUrl ? new URL(databaseUrl).protocol : '';
    } catch {
        throw new Error('Set DATABASE_URL to a valid production PostgreSQL URL.');
    }
    if (!['postgres:', 'postgresql:'].includes(databaseProtocol)) {
        throw new Error('Set DATABASE_URL to the production PostgreSQL database before creating an admin.');
    }
    if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
        throw new Error('Set ADMIN_EMAIL to a valid email address.');
    }
    if (!adminPassword || adminPassword.length < 6 || adminPassword.length > 256) {
        throw new Error('Set ADMIN_INITIAL_PASSWORD to a password between 6 and 256 characters.');
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const passwordHash = hashPassword(adminPassword);
    try {
        await prisma.$transaction(async (transaction) => {
            await transaction.adminUser.upsert({
                where: { email: adminEmail },
                update: {
                    passwordHash,
                    role: 'SUPER_ADMIN',
                    name: 'Super Admin',
                    isActive: true,
                },
                create: {
                    email: adminEmail,
                    name: 'Super Admin',
                    passwordHash,
                    role: 'SUPER_ADMIN',
                },
            });

            if (adminEmail !== LEGACY_ADMIN_EMAIL) {
                await transaction.adminUser.updateMany({
                    where: { email: LEGACY_ADMIN_EMAIL },
                    data: { isActive: false },
                });
            }
        });
    } finally {
        await prisma.$disconnect();
    }

    console.log(`Super Admin credentials created or reset for ${adminEmail}.`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Admin creation failed.');
    process.exitCode = 1;
});
