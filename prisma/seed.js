import crypto from 'node:crypto';

function hashPassword(value) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(value, salt, 64);
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!adminEmail || !adminPassword || adminPassword.length < 6) {
        throw new Error('Set ADMIN_EMAIL and an ADMIN_INITIAL_PASSWORD of at least 6 characters before seeding.');
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const passwordHash = hashPassword(adminPassword);

    await prisma.siteSetting.upsert({
        where: { key: 'programme-support-fee' },
        update: { value: '0' },
        create: { key: 'programme-support-fee', value: '0' },
    });

    await prisma.siteSetting.upsert({
        where: { key: 'support-fee-currency' },
        update: { value: 'USD' },
        create: { key: 'support-fee-currency', value: 'USD' },
    });

    await prisma.batch.upsert({
        where: { code: 'BATCH-A' },
        update: {
            startDate: new Date('2027-03-05T00:00:00.000Z'),
            endDate: new Date('2027-04-03T00:00:00.000Z'),
        },
        create: {
            code: 'BATCH-A',
            name: 'Batch A',
            capacity: 300,
            startDate: new Date('2027-03-05T00:00:00.000Z'),
            endDate: new Date('2027-04-03T00:00:00.000Z'),
            assignmentNumber: 0,
            participantCount: 0,
        },
    });

    await prisma.batch.upsert({
        where: { code: 'BATCH-B' },
        update: {},
        create: {
            code: 'BATCH-B',
            name: 'Batch B',
            capacity: 300,
            startDate: new Date('2027-07-04T00:00:00.000Z'),
            endDate: new Date('2027-07-25T00:00:00.000Z'),
            assignmentNumber: 0,
            participantCount: 0,
        },
    });

    await prisma.batch.upsert({
        where: { code: 'BATCH-C' },
        update: {},
        create: {
            code: 'BATCH-C',
            name: 'Batch C',
            capacity: 400,
            startDate: new Date('2027-11-07T00:00:00.000Z'),
            endDate: new Date('2027-11-28T00:00:00.000Z'),
            assignmentNumber: 0,
            participantCount: 0,
        },
    });

    await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: { passwordHash, role: 'SUPER_ADMIN', name: 'Super Admin', isActive: true },
        create: {
            email: adminEmail,
            name: 'Super Admin',
            passwordHash,
            role: 'SUPER_ADMIN',
        },
    });

    if (adminEmail !== 'admin@gospletoeveryone.org') {
        await prisma.adminUser.updateMany({
            where: { email: 'admin@gospletoeveryone.org' },
            data: { isActive: false },
        });
    }

    console.log('Seed completed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
