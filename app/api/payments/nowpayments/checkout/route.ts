import { NextResponse } from 'next/server';
import { createNowPaymentsInvoice } from '@/lib/nowpayments';
import { prisma } from '@/lib/prisma';

function getPublicBaseUrl() {
    const value = process.env.PAYMENT_PUBLIC_URL?.trim();
    if (!value) return null;

    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.hostname === 'localhost') return null;
        return url.origin;
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const confirmationCode = typeof body?.confirmationCode === 'string'
            ? body.confirmationCode.trim()
            : '';

        if (!confirmationCode) {
            return NextResponse.json({ message: 'Confirmation code is required.' }, { status: 400 });
        }

        if (process.env.PAYMENT_PROVIDER?.trim().toLowerCase() !== 'nowpayments') {
            return NextResponse.json({ message: 'NOWPayments checkout is not enabled.' }, { status: 503 });
        }

        const apiKey = process.env.NOWPAYMENTS_API_KEY?.trim();
        const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET?.trim();
        const publicBaseUrl = getPublicBaseUrl();
        if (!apiKey || !ipnSecret || !publicBaseUrl) {
            return NextResponse.json({
                message: 'Payment checkout is not configured. Contact the programme team.',
            }, { status: 503 });
        }

        const amount = Number(process.env.SUPPORT_FEE_AMOUNT || '500');
        const currency = (process.env.SUPPORT_FEE_CURRENCY || 'USD').trim().toUpperCase();
        if (!Number.isFinite(amount) || amount <= 0 || !/^[A-Z]{3}$/.test(currency)) {
            return NextResponse.json({ message: 'Payment amount configuration is invalid.' }, { status: 503 });
        }

        const code = await prisma.confirmationCode.findUnique({
            where: { code: confirmationCode },
            include: { application: true },
        });
        const application = code?.application;

        if (!code || code.revokedAt || !application) {
            return NextResponse.json({ message: 'Invalid or expired confirmation code.' }, { status: 404 });
        }
        if (application.status !== 'APPROVED' || !['PENDING', 'FAILED'].includes(application.paymentStatus)) {
            return NextResponse.json({ message: 'This application is not eligible for payment.' }, { status: 409 });
        }

        const encodedCode = encodeURIComponent(confirmationCode);
        const returnUrl = `${publicBaseUrl}/korea-training/status?code=${encodedCode}`;
        const invoice = await createNowPaymentsInvoice({
            apiKey,
            amount,
            currency,
            confirmationCode,
            callbackUrl: `${publicBaseUrl}/api/payments/nowpayments/ipn`,
            returnUrl,
        });

        await prisma.payment.create({
            data: {
                applicationId: application.id,
                paymentReference: invoice.id,
                provider: 'NOWPayments',
                amount,
                currency,
                status: 'PENDING',
            },
        });

        return NextResponse.json({ data: { invoiceUrl: invoice.invoiceUrl } });
    } catch (error) {
        console.error('NOWPayments checkout failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ message: 'Could not start checkout. Please try again.' }, { status: 502 });
    }
}