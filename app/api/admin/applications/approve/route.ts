import { NextResponse } from 'next/server';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { hasSentSelectionEmail, sendApplicantEmail } from '@/lib/applicant-email';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const authorization = await authorizeAdminApi(['APPLICATION_REVIEWER']);
        if (authorization.response) return authorization.response;
        const { applicationId } = await request.json();
        if (typeof applicationId !== 'string' || !applicationId) {
            return NextResponse.json({ message: 'Application ID is required.' }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { applicant: true, confirmationCodes: { where: { revokedAt: null }, orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!application) return NextResponse.json({ message: 'Application not found.' }, { status: 404 });

        const data = JSON.parse(application.data) as { firstName?: string; middleName?: string; lastName?: string };
        const name = {
            firstName: data.firstName || application.applicant.fullName.split(' ')[0] || application.applicant.fullName,
            middleName: data.middleName || '',
            lastName: data.lastName || application.applicant.fullName.split(' ').slice(1).join(' '),
        };
        let confirmationCode = application.confirmationCodes[0]?.code;
        if (!confirmationCode) {
            confirmationCode = `GTE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
            await prisma.confirmationCode.create({
                data: {
                    code: confirmationCode,
                    applicantId: application.applicantId,
                    applicationId: application.id,
                },
            });
        }

        if (application.status !== 'APPROVED') {
            await prisma.application.update({
                where: { id: application.id },
                data: {
                    status: 'APPROVED',
                    batchAssignmentState: 'WAITING_FOR_PAYMENT',
                    paymentStatus: 'PENDING',
                },
            });
        }

        if (await hasSentSelectionEmail(application.applicant.email, application.id)) {
            return NextResponse.json({ message: 'Application is approved. The selection notice was already sent.' });
        }

        const result = await sendApplicantEmail({
            type: 'selection-notice',
            recipient: application.applicant.email,
            name,
            applicationId: application.id,
            confirmationCode,
        });

        return NextResponse.json({
            message: result.sent
                ? 'Application approved and selection notice sent.'
                : 'Application approved, but the selection notice could not be sent. Configure Gmail SMTP and retry.',
            data: { status: 'APPROVED', emailSent: result.sent },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Could not approve application.', error: String(error) }, { status: 500 });
    }
}