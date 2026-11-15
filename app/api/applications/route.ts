import { NextResponse } from 'next/server';
import { Country } from 'country-state-city';
import { applicationSchema } from '@/lib/application-schema';
import { sendApplicantEmail } from '@/lib/applicant-email';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = applicationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({
                message: 'Validation failed.',
                errors: Object.fromEntries(
                    parsed.error.issues.map((issue) => [issue.path[0] ?? 'form', issue.message]),
                ),
            }, { status: 400 });
        }

        const fullName = [parsed.data.firstName, parsed.data.middleName, parsed.data.lastName]
            .filter(Boolean)
            .join(' ');
        const residenceCountry = Country.getCountryByCode(parsed.data.residenceCountryCode);
        const preferredBatch = {
            BATCH_A: 'BATCH-A',
            BATCH_B: 'BATCH-B',
            BATCH_C: 'BATCH-C',
        }[parsed.data.preferredBatch];

        const applicant = await prisma.applicant.create({
            data: {
                fullName,
                email: parsed.data.email,
                phone: parsed.data.phone,
                country: residenceCountry?.name ?? parsed.data.residenceCountryCode,
                age: calculateAge(parsed.data.dob),
            },
        });

        const reference = `GTE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        const application = await prisma.application.create({
            data: {
                applicantId: applicant.id,
                reference,
                preferredBatch,
                status: 'SUBMITTED',
                paymentStatus: 'PENDING',
                batchAssignmentState: 'UNASSIGNED',
                termsVersion: 'korea-training-2026-v2',
                termsAcceptedAt: new Date(),
                data: JSON.stringify(parsed.data),
            },
        });

        const receiptEmail = await sendApplicantEmail({
            type: 'application-received',
            recipient: applicant.email,
            name: {
                firstName: parsed.data.firstName,
                middleName: parsed.data.middleName,
                lastName: parsed.data.lastName,
            },
            applicationId: application.id,
        });

        const successMessage = 'Your application has been successfully submitted. Keep an eye on your email.';

        return NextResponse.json({
            message: receiptEmail.sent ? successMessage : `${successMessage} The confirmation email could not be sent yet.`,
            data: {
                id: application.id,
                reference,
                confirmationCode: null,
                status: application.status,
                paymentStatus: application.paymentStatus,
                createdAt: application.createdAt,
                emailSent: receiptEmail.sent,
            },
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Request failed.', error: String(error) }, { status: 500 });
    }
}

function calculateAge(dob: string) {
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1;
    return age;
}

export async function GET() {
    const applications = await prisma.application.findMany({
        include: {
            applicant: true,
            confirmationCodes: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return NextResponse.json({
        data: applications.map((application) => ({
            id: application.id,
            reference: application.reference,
            fullName: application.applicant.fullName,
            country: application.applicant.country,
            status: application.status,
            paymentStatus: application.paymentStatus,
            preferredBatch: application.preferredBatch,
            createdAt: application.createdAt,
            confirmationCode: application.confirmationCodes[0]?.code ?? null,
        })),
    });
}
