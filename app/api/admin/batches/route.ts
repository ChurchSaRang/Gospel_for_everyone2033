import { NextResponse } from 'next/server';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const authorization = await authorizeAdminApi(['BATCH_COORDINATOR']);
    if (authorization.response) return authorization.response;

    try {
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
