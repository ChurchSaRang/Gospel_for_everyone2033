import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatBatchName(code?: string | null) {
    if (!code) return undefined;
    const map: Record<string, string> = {
        'BATCH-A': 'Batch A',
        'BATCH-B': 'Batch B',
        'BATCH-C': 'Batch C',
    };
    return map[code] ?? code;
}

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ message: 'Confirmation code is required.' }, { status: 400 });
        }

        const normalizedCode = code.trim();
        const confirmationCode = await prisma.confirmationCode.findUnique({
            where: { code: normalizedCode, revokedAt: null },
            include: {
                application: {
                    include: { applicant: true },
                },
            },
        });

        if (!confirmationCode?.application) {
            return NextResponse.json({ message: 'Invalid or expired confirmation code.' }, { status: 404 });
        }

        const application = confirmationCode.application;
        const payload = {
            fullName: application.applicant.fullName,
            country: application.applicant.country ?? '—',
            age: application.applicant.age ?? 0,
            applicationStatus: application.status,
            paymentStatus: application.paymentStatus,
            batchName: formatBatchName(application.preferredBatch),
            trainingId: confirmationCode.code,
            supportFeeAmount: Number(process.env.SUPPORT_FEE_AMOUNT || '500'),
            supportFeeCurrency: (process.env.SUPPORT_FEE_CURRENCY || 'USD').toUpperCase(),
        };

        return NextResponse.json({ data: payload });
    } catch (error) {
        return NextResponse.json({ message: 'Lookup failed.', error: String(error) }, { status: 500 });
    }
}
