import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                applicant: true,
                confirmationCodes: {
                    where: { revokedAt: null },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
        }

        const submission = JSON.parse(application.data || '{}') as {
            firstName?: string;
            middleName?: string;
            lastName?: string;
            preferredBatch?: string;
        };

        const batchName = application.preferredBatch
            ? ({
                'BATCH-A': 'Batch A',
                'BATCH-B': 'Batch B',
                'BATCH-C': 'Batch C',
            } as Record<string, string>)[application.preferredBatch] ?? application.preferredBatch
            : null;

        return NextResponse.json({
            data: {
                id: application.id,
                reference: application.reference,
                status: application.status,
                paymentStatus: application.paymentStatus,
                preferredBatch: application.preferredBatch,
                batchAssignmentState: application.batchAssignmentState,
                confirmationCode: application.confirmationCodes[0]?.code ?? null,
                batchId: application.preferredBatch ?? null,
                batchName,
                submittedAt: application.submissionDate,
                applicant: {
                    id: application.applicant.id,
                    fullName: application.applicant.fullName,
                    email: application.applicant.email,
                    phone: application.applicant.phone,
                    country: application.applicant.country,
                    age: application.applicant.age,
                },
                submissionData: {
                    firstName: submission.firstName ?? application.applicant.fullName.split(' ')[0],
                    middleName: submission.middleName ?? '',
                    lastName: submission.lastName ?? application.applicant.fullName.split(' ').slice(1).join(' '),
                    preferredBatch: submission.preferredBatch ?? application.preferredBatch,
                },
            },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to load application detail.', error: String(error) }, { status: 500 });
    }
}
