import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { sendApplicantEmail } from '@/lib/applicant-email';
import { findBatchForApplication } from '@/lib/batch-assignment';
import { prisma } from '@/lib/prisma';

const assignmentSchema = z.object({
    applicationId: z.string().min(1),
}).strict();

class AssignmentError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
    }
}

export async function POST(request: Request) {
    const authorization = await authorizeAdminApi(['BATCH_COORDINATOR']);
    if (authorization.response) return authorization.response;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'A valid JSON request body is required.' }, { status: 400 });
    }

    const parsedBody = assignmentSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json({ message: 'Application ID is required.' }, { status: 400 });
    }

    try {
        const assigned = await prisma.$transaction(async (tx) => {
            const application = await tx.application.findUnique({
                where: { id: parsedBody.data.applicationId },
                include: {
                    applicant: true,
                    confirmationCodes: { where: { revokedAt: null }, orderBy: { createdAt: 'desc' }, take: 1 },
                },
            });

            if (!application) throw new AssignmentError('Application not found.', 404);
            if (application.paymentStatus !== 'SUCCESSFUL'
                || !['PAID', 'PAID_WAITING_FOR_BATCH'].includes(application.status)
                || application.batchAssignmentState !== 'WAITING_FOR_BATCH') {
                throw new AssignmentError('Only confirmed, paid applications awaiting a batch can be assigned.', 409);
            }

            const openBatches = await tx.batch.findMany({
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

            if (!candidateBatch) throw new AssignmentError('No batch has remaining capacity.', 409);

            const reservedBatch = await tx.batch.updateMany({
                where: {
                    id: candidateBatch.id,
                    isOpen: true,
                    assignmentNumber: { lt: candidateBatch.capacity },
                },
                data: { assignmentNumber: { increment: 1 } },
            });
            if (reservedBatch.count !== 1) {
                throw new AssignmentError('The selected batch has just reached capacity. Please retry.', 409);
            }

            const applicationUpdate = await tx.application.updateMany({
                where: {
                    id: application.id,
                    paymentStatus: 'SUCCESSFUL',
                    batchAssignmentState: 'WAITING_FOR_BATCH',
                    status: { in: ['PAID', 'PAID_WAITING_FOR_BATCH'] },
                },
                data: {
                    preferredBatch: candidateBatch.code,
                    batchAssignmentState: 'ASSIGNED',
                    status: 'BATCH_ASSIGNED',
                },
            });
            if (applicationUpdate.count !== 1) {
                throw new AssignmentError('The application is no longer available for assignment.', 409);
            }

            const updatedApplication = await tx.application.findUniqueOrThrow({
                where: { id: application.id },
                include: {
                    applicant: true,
                    confirmationCodes: { where: { revokedAt: null }, orderBy: { createdAt: 'desc' }, take: 1 },
                },
            });
            const updatedBatch = await tx.batch.findUniqueOrThrow({ where: { id: candidateBatch.id } });
            let confirmationCode = updatedApplication.confirmationCodes[0]?.code;
            if (!confirmationCode) {
                confirmationCode = `GTE-${new Date().getFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
                await tx.confirmationCode.create({
                    data: {
                        code: confirmationCode,
                        applicantId: updatedApplication.applicantId,
                        applicationId: updatedApplication.id,
                    },
                });
            }

            return { application: updatedApplication, batch: updatedBatch, confirmationCode };
        });

        const nameParts = assigned.application.applicant.fullName.split(' ');
        const email = await sendApplicantEmail({
            type: 'batch-assigned',
            recipient: assigned.application.applicant.email,
            name: {
                firstName: nameParts[0] || 'Applicant',
                middleName: '',
                lastName: nameParts.slice(1).join(' '),
            },
            applicationId: assigned.application.id,
            confirmationCode: assigned.confirmationCode,
            batchName: assigned.batch.name,
            batchNumber: assigned.batch.assignmentNumber,
        });

        return NextResponse.json({
            message: email.sent
                ? 'Application assigned to batch and applicant notified.'
                : 'Application assigned to batch, but the notification email could not be sent.',
            data: {
                application: {
                    id: assigned.application.id,
                    reference: assigned.application.reference,
                    status: assigned.application.status,
                    paymentStatus: assigned.application.paymentStatus,
                    batchAssignmentState: assigned.application.batchAssignmentState,
                    preferredBatch: assigned.application.preferredBatch,
                },
                batch: assigned.batch,
                batchNumber: assigned.batch.assignmentNumber,
                emailSent: email.sent,
            },
        });
    } catch (error) {
        if (error instanceof AssignmentError) {
            return NextResponse.json({ message: error.message }, { status: error.status });
        }

        console.error('Batch assignment failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ message: 'Batch assignment failed.' }, { status: 500 });
    }
}
