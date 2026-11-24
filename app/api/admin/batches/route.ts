import { NextResponse } from 'next/server';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

const defaultBatches = [
    {
        code: 'BATCH-A',
        name: 'Batch A',
        capacity: 300,
        startDate: new Date('2027-03-05T00:00:00.000Z'),
        endDate: new Date('2027-04-03T00:00:00.000Z'),
    },
    {
        code: 'BATCH-B',
        name: 'Batch B',
        capacity: 300,
        startDate: new Date('2027-07-04T00:00:00.000Z'),
        endDate: new Date('2027-07-25T00:00:00.000Z'),
    },
    {
        code: 'BATCH-C',
        name: 'Batch C',
        capacity: 400,
        startDate: new Date('2027-11-07T00:00:00.000Z'),
        endDate: new Date('2027-11-28T00:00:00.000Z'),
    },
];

export async function GET() {
    const authorization = await authorizeAdminApi(['BATCH_COORDINATOR']);
    if (authorization.response) return authorization.response;

    try {
        await prisma.$transaction(defaultBatches.map((batch) => prisma.batch.upsert({
            where: { code: batch.code },
            update: {},
            create: {
                ...batch,
                assignmentNumber: 0,
                participantCount: 0,
            },
        })));

        const batches = await prisma.batch.findMany({
            orderBy: { startDate: 'asc' },
            select: {
                id: true,
                code: true,
                name: true,
                capacity: true,
                participantCount: true,
            },
        });

        return NextResponse.json({ data: batches });
    } catch (error) {
        return NextResponse.json({ message: 'Could not load cohort participants.', error: String(error) }, { status: 500 });
    }
}
