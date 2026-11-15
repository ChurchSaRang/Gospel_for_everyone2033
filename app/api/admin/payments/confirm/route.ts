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

        const body = await request.json();
        const { applicationId, confirmationCode, status } = body ?? {};

        if (!status) {
            return NextResponse.json({ message: 'Payment status is required.' }, { status: 400 });
        }

        let application = null;

        if (applicationId) {
            application = await prisma.application.findUnique({ where: { id: String(applicationId) } });
        } else if (confirmationCode) {
            const codeRecord = await prisma.confirmationCode.findUnique({
                where: { code: String(confirmationCode).trim() },
                include: { application: true },
            });
            application = codeRecord?.application ?? null;
        }

        if (!application) {
            return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
        }

        const paymentStatus = String(status).toUpperCase();

        const updated = await prisma.application.update({
            where: { id: application.id },
            data: {
                paymentStatus: paymentStatus === 'SUCCESSFUL' ? 'SUCCESSFUL' : 'FAILED',
                status: paymentStatus === 'SUCCESSFUL' ? 'PAID' : 'SUBMITTED',
                batchAssignmentState: paymentStatus === 'SUCCESSFUL' ? 'WAITING_FOR_BATCH' : 'WAITING_FOR_PAYMENT',
            },
        });

        return NextResponse.json({
            message: paymentStatus === 'SUCCESSFUL' ? 'Payment confirmed.' : 'Payment marked as failed.',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Payment update failed.', error: String(error) }, { status: 500 });
    }
}
