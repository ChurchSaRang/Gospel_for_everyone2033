import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendApplicantEmail } from '@/lib/applicant-email';
import { findBatchForApplication } from '@/lib/batch-assignment';

export async function POST(request: Request) {
    try {
        const { applicationId } = await request.json();

        if (!applicationId) {
            return NextResponse.json({ message: 'Application ID is required.' }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { id: String(applicationId) },
            include: {
                applicant: true,
                confirmationCodes: { where: { revokedAt: null }, orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'Application not found.' }, { status: 404 });
        }

        const openBatches = await prisma.batch.findMany({
            where: { isOpen: true },
            orderBy: { startDate: 'asc' },
        });

        const candidateBatch = findBatchForApplication(
            openBatches.map((batch) => ({
                id: batch.id,
                code: batch.code,
                name: batch.name,
                capacity: batch.capacity,
                assignmentNumber: batch.assignmentNumber,
                isOpen: batch.isOpen,
            })),
            application.preferredBatch,
        );

        if (!candidateBatch) {
            return NextResponse.json({ message: 'No batch has remaining capacity.' }, { status: 409 });
        }

        const batch = await prisma.batch.findUnique({ where: { id: candidateBatch.id } });
        if (!batch) {
            return NextResponse.json({ message: 'Selected batch not found.' }, { status: 404 });
        }

        const updatedApplication = await prisma.$transaction(async (tx) => {
            const updatedBatch = await tx.batch.update({
                where: { id: batch.id },
                data: { assignmentNumber: batch.assignmentNumber + 1 },
            });

            const applicationUpdate = await tx.application.update({
                where: { id: application.id },
                data: {
                    preferredBatch: updatedBatch.code,
                    paymentStatus: 'SUCCESSFUL',
                    batchAssignmentState: 'ASSIGNED',
                    status: 'BATCH_ASSIGNED',
                },
            });

            return { application: applicationUpdate, batch: updatedBatch };
        });

        const confirmationCode = application.confirmationCodes[0]?.code ?? `GTE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        const applicantName = {
            firstName: application.applicant.fullName.split(' ')[0] || 'Applicant',
            middleName: '',
            lastName: application.applicant.fullName.split(' ').slice(1).join(' ') || '',
        };

        await sendApplicantEmail({
            type: 'batch-assigned',
            recipient: application.applicant.email,
            name: applicantName,
            applicationId: application.id,
            confirmationCode,
            batchName: updatedApplication.batch.name,
            batchNumber: updatedApplication.batch.assignmentNumber,
        });

        return NextResponse.json({
            message: 'Application assigned to batch successfully.',
            data: {
                application: updatedApplication.application,
                batch: updatedApplication.batch,
                batchNumber: updatedApplication.batch.assignmentNumber,
            },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Batch assignment failed.', error: String(error) }, { status: 500 });
    }
}
