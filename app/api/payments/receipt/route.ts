import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const MAX_RECEIPT_BYTES = 3 * 1024 * 1024;
const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const PAYMENT_EMAIL = 'payments@gospelforeveryonemovement.com';

function getImageType(buffer: Buffer) {
    if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return { mimeType: 'image/png', extension: 'png' };
    }
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { mimeType: 'image/jpeg', extension: 'jpg' };
    }
    if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        return { mimeType: 'image/webp', extension: 'webp' };
    }
    return null;
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character] ?? character);
}

function normalizeName(value: string) {
    return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

async function updateReceiptEmailLog(id: string, status: 'SENT' | 'FAILED') {
    try {
        await prisma.emailLog.update({ where: { id }, data: { status } });
    } catch (error) {
        console.error('Could not update payment receipt email log:', error instanceof Error ? error.message : 'Unknown database error');
    }
}

export async function POST(request: Request) {
    const origin = request.headers.get('origin');
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
        return NextResponse.json({ message: 'Receipt submissions must come from this website.' }, { status: 403 });
    }
    if (origin) {
        try {
            if (new URL(origin).origin !== new URL(request.url).origin) {
                return NextResponse.json({ message: 'Receipt submissions must come from this website.' }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 });
        }
    }

    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return NextResponse.json({ message: 'Receipt upload is too large.' }, { status: 413 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ message: 'Submit the receipt using the provided form.' }, { status: 400 });
    }

    const confirmationCode = formData.get('confirmationCode');
    const submittedName = formData.get('fullName');
    const receipt = formData.get('receipt');
    if (
        typeof confirmationCode !== 'string'
        || confirmationCode.trim().length === 0
        || confirmationCode.trim().length > 100
        || typeof submittedName !== 'string'
        || submittedName.trim().length === 0
        || submittedName.trim().length > 200
        || !(receipt instanceof File)
    ) {
        return NextResponse.json({ message: 'Enter your confirmation ID and full name, and attach a receipt image.' }, { status: 400 });
    }

    if (receipt.size === 0 || receipt.size > MAX_RECEIPT_BYTES) {
        return NextResponse.json({ message: 'Choose a receipt image no larger than 3 MB.' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await receipt.arrayBuffer());
    const imageType = getImageType(imageBuffer);
    if (!imageType || (receipt.type && receipt.type.toLowerCase() !== imageType.mimeType)) {
        return NextResponse.json({ message: 'Receipt must be a valid JPEG, PNG, or WebP image.' }, { status: 400 });
    }

    const code = confirmationCode.trim();
    const confirmation = await prisma.confirmationCode.findUnique({
        where: { code },
        include: { application: { include: { applicant: true } } },
    });
    if (!confirmation || confirmation.revokedAt || !confirmation.application) {
        return NextResponse.json({ message: 'Confirmation ID was not found.' }, { status: 404 });
    }
    const application = confirmation.application;
    if (normalizeName(submittedName) !== normalizeName(application.applicant.fullName)) {
        return NextResponse.json({ message: 'The full name and confirmation ID do not match our records.' }, { status: 400 });
    }
    if (application.status !== 'APPROVED' || !['PENDING', 'FAILED'].includes(application.paymentStatus)) {
        return NextResponse.json({ message: 'A receipt can only be submitted for an approved application with an unpaid fee.' }, { status: 409 });
    }

    const recentSubmission = await prisma.emailLog.findFirst({
        where: {
            templateName: `payment-receipt:${application.id}`,
            status: { in: ['PENDING', 'SENT'] },
            createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
        select: { id: true },
    });
    if (recentSubmission) {
        return NextResponse.json({ message: 'A receipt was submitted recently. Please wait for the payments team to review it.' }, { status: 429 });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.EMAIL_FROM?.trim();
    if (!apiKey || !from) {
        console.error('Payment receipt email is not configured: RESEND_API_KEY or EMAIL_FROM is missing.');
        return NextResponse.json({ message: 'Receipt submission is temporarily unavailable. Please contact the programme team.' }, { status: 503 });
    }

    const safeName = escapeHtml(application.applicant.fullName);
    const safeCode = escapeHtml(confirmation.code);
    const safeReference = escapeHtml(application.reference);
    const subject = `Training support fee receipt - ${confirmation.code}`;
    const text = `A training support fee receipt was submitted for review.

Applicant: ${application.applicant.fullName}
Confirmation ID: ${confirmation.code}
Application reference: ${application.reference}

The receipt image is attached. Verify the payment with the payment provider before marking the application paid.`;

    const emailLog = await prisma.emailLog.create({
        data: {
            recipient: PAYMENT_EMAIL,
            subject,
            templateName: `payment-receipt:${application.id}`,
            status: 'PENDING',
            provider: 'resend',
        },
    });
    const resend = new Resend(apiKey);
    let emailResult;
    try {
        emailResult = await resend.emails.send({
            from,
            to: [PAYMENT_EMAIL],
            replyTo: application.applicant.email,
            subject,
            text,
            html: `<p>A training support fee receipt was submitted for review.</p>
<p><strong>Applicant:</strong> ${safeName}<br>
<strong>Confirmation ID:</strong> ${safeCode}<br>
<strong>Application reference:</strong> ${safeReference}</p>
<p>The receipt image is attached. Verify the payment with the payment provider before marking the application paid.</p>`,
            attachments: [{
                filename: `payment-receipt.${imageType.extension}`,
                content: imageBuffer.toString('base64'),
                contentType: imageType.mimeType,
            }],
        });
    } catch (error) {
        await updateReceiptEmailLog(emailLog.id, 'FAILED');
        console.error('Payment receipt email failed:', error instanceof Error ? error.message : 'Unknown email error');
        return NextResponse.json({ message: 'The receipt could not be emailed. Please try again later.' }, { status: 502 });
    }

    if (emailResult.error || !emailResult.data?.id) {
        await updateReceiptEmailLog(emailLog.id, 'FAILED');
        console.error('Payment receipt email failed:', emailResult.error?.message ?? 'Resend returned no message ID.');
        return NextResponse.json({ message: 'The receipt could not be emailed. Please try again later.' }, { status: 502 });
    }

    await updateReceiptEmailLog(emailLog.id, 'SENT');
    return NextResponse.json({
        message: 'Receipt submitted. The payments team will verify it and update your application status.',
    }, { status: 201 });
}
