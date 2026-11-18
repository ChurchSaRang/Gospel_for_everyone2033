import { NextResponse } from 'next/server';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const authorization = await authorizeAdminApi(['APPLICATION_REVIEWER']);
        if (authorization.response) return authorization.response;

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
