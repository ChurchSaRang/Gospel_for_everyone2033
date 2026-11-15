import crypto from 'node:crypto';

async function main() {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const passwordHash = crypto.createHash('sha256').update('Admin@2026').digest('hex');

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
            startDate: new Date('2027-03-07T00:00:00.000Z'),
            endDate: new Date('2027-03-28T00:00:00.000Z'),
        },
        create: {
            code: 'BATCH-A',
            name: 'Batch A',
            capacity: 300,
            startDate: new Date('2027-03-07T00:00:00.000Z'),
            endDate: new Date('2027-03-28T00:00:00.000Z'),
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
        where: { email: 'admin@gospletoeveryone.org' },
        update: { passwordHash, role: 'SUPER_ADMIN', name: 'Super Admin' },
        create: {
            email: 'admin@gospletoeveryone.org',
            name: 'Super Admin',
            passwordHash,
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Seed completed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
