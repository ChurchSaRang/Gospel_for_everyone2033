import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

const paymentConfirmationSchema = z.object({
    applicationId: z.string().min(1).optional(),
    confirmationCode: z.string().min(1).optional(),
    status: z.enum(['SUCCESSFUL', 'FAILED']),
}).strict().refine((value) => Boolean(value.applicationId || value.confirmationCode));

export async function POST(request: Request) {
    try {
        const authorization = await authorizeAdminApi(['FINANCE_OFFICER']);
        if (authorization.response) return authorization.response;

        const parsed = paymentConfirmationSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ message: 'Provide an application or confirmation code and a valid payment status.' }, { status: 400 });
        }

        const { applicationId, confirmationCode, status } = parsed.data;
        let application = null;

        if (applicationId) {
            application = await prisma.application.findUnique({ where: { id: applicationId } });
        } else if (confirmationCode) {
            const codeRecord = await prisma.confirmationCode.findUnique({
                where: { code: confirmationCode.trim() },
                include: { application: true },
            });
            application = codeRecord?.revokedAt ? null : codeRecord?.application ?? null;
        }

        if (!application) {
            return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
        }

        if (status === 'SUCCESSFUL' && application.paymentStatus === 'SUCCESSFUL') {
            return NextResponse.json({ message: 'This payment is already marked as paid.' }, { status: 409 });
        }
        if (status === 'SUCCESSFUL' && application.status !== 'APPROVED') {
            return NextResponse.json({ message: 'Only an approved application can be marked as paid.' }, { status: 409 });
        }

        const updated = await prisma.$transaction(async (transaction) => {
            const result = await transaction.application.update({
                where: { id: application.id },
                data: {
                    paymentStatus: status,
                    status: status === 'SUCCESSFUL' ? 'PAID' : 'SUBMITTED',
                    batchAssignmentState: status === 'SUCCESSFUL' ? 'WAITING_FOR_BATCH' : 'WAITING_FOR_PAYMENT',
                },
                select: { id: true, status: true, paymentStatus: true, batchAssignmentState: true },
            });
            await transaction.auditLog.create({
                data: {
                    actor: authorization.session?.email,
                    action: status === 'SUCCESSFUL' ? 'PAYMENT_MANUALLY_CONFIRMED' : 'PAYMENT_MANUALLY_MARKED_FAILED',
                    details: JSON.stringify({ applicationId: application.id, method: 'receipt_review' }),
                },
            });
            return result;
        });

        return NextResponse.json({
            message: status === 'SUCCESSFUL' ? 'Payment confirmed.' : 'Payment marked as failed.',
            data: updated,
        });
    } catch (error) {
        console.error('Payment confirmation failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ message: 'Payment update failed.' }, { status: 500 });
    }
}
