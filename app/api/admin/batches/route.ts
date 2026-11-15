import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const cookieStore = await cookies();
    if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
        return NextResponse.json({ message: 'Administrator authentication is required.' }, { status: 401 });
    }

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
