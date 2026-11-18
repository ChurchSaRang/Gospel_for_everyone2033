import { NextResponse } from 'next/server';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const authorization = await authorizeAdminApi();
    if (authorization.response) return authorization.response;

    const [totalApplications, pendingPayments, successfulPayments, assignedApplicants, recentApplications] = await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { paymentStatus: 'PENDING' } }),
        prisma.application.count({ where: { paymentStatus: 'SUCCESSFUL' } }),
        prisma.application.count({ where: { batchAssignmentState: 'ASSIGNED' } }),
        prisma.application.findMany({
            include: { applicant: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
        }),
    ]);

    return NextResponse.json({
        data: {
            totalApplications,
            pendingPayments,
            successfulPayments,
            assignedApplicants,
            recentApplications: recentApplications.map((application) => ({
                id: application.id,
                reference: application.reference,
                fullName: application.applicant.fullName,
                country: application.applicant.country,
                status: application.status,
                paymentStatus: application.paymentStatus,
                preferredBatch: application.preferredBatch,
                createdAt: application.createdAt,
            })),
        },
    });
}
