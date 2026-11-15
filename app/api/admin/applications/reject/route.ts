import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
            return NextResponse.json({ message: 'Administrator authentication is required.' }, { status: 401 });
        }

        const { applicationId } = await request.json();
        if (typeof applicationId !== 'string' || !applicationId) {
            return NextResponse.json({ message: 'Application ID is required.' }, { status: 400 });
        }

        const application = await prisma.application.findUnique({ where: { id: applicationId } });
        if (!application) {
            return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
        }

        const updated = await prisma.application.update({
            where: { id: application.id },
            data: {
                status: 'REJECTED',
                paymentStatus: 'PENDING',
                batchAssignmentState: 'NOT_ELIGIBLE',
            },
        });

        return NextResponse.json({
            message: 'Application rejected.',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Could not reject application.', error: String(error) }, { status: 500 });
    }
}
