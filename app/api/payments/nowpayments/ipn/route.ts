import { NextResponse } from 'next/server';
import { verifyNowPaymentsSignature } from '@/lib/nowpayments';
import { prisma } from '@/lib/prisma';

type NowPaymentsNotification = Record<string, unknown> & {
    invoice_id?: string | number | null;
    order_id?: string | null;
    payment_status?: string;
    price_amount?: string | number;
    price_currency?: string;
};

export async function POST(request: Request) {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET?.trim();
    if (!secret) {
        return NextResponse.json({ message: 'Payment notifications are not configured.' }, { status: 503 });
    }

    let payload: NowPaymentsNotification;
    try {
        payload = await request.json() as NowPaymentsNotification;
    } catch {
        return NextResponse.json({ message: 'Invalid notification payload.' }, { status: 400 });
    }

    if (!verifyNowPaymentsSignature(payload, request.headers.get('x-nowpayments-sig'), secret)) {
        return NextResponse.json({ message: 'Invalid payment notification signature.' }, { status: 401 });
    }

    const invoiceId = payload.invoice_id === undefined || payload.invoice_id === null
        ? ''
        : String(payload.invoice_id);
    const orderId = typeof payload.order_id === 'string' ? payload.order_id : '';
    const paymentStatus = typeof payload.payment_status === 'string' ? payload.payment_status.toLowerCase() : '';
    if (!invoiceId || !orderId || !paymentStatus) {
        return NextResponse.json({ message: 'Payment notification is missing required fields.' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
        where: { paymentReference: invoiceId },
        include: { application: { include: { confirmationCodes: true } } },
    });
    if (!payment || payment.provider !== 'NOWPayments') {
        return NextResponse.json({ message: 'Payment invoice was not found.' }, { status: 404 });
    }

    const hasMatchingCode = payment.application.confirmationCodes.some(
        (code) => code.code === orderId && !code.revokedAt,
    );
    const paidAmount = Number(payload.price_amount);
    const expectedAmount = Number(payment.amount);
    const currency = typeof payload.price_currency === 'string' ? payload.price_currency.toUpperCase() : '';
    if (!hasMatchingCode || !Number.isFinite(paidAmount)
        || Math.abs(paidAmount - expectedAmount) > 0.000001 || currency !== payment.currency.toUpperCase()) {
        return NextResponse.json({ message: 'Payment notification does not match the invoice.' }, { status: 409 });
    }

    if (paymentStatus === 'finished') {
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'SUCCESSFUL', webhookVerified: true },
            }),
            prisma.application.update({
                where: { id: payment.applicationId },
                data: {
                    paymentStatus: 'SUCCESSFUL',
                    status: 'PAID',
                    batchAssignmentState: 'WAITING_FOR_BATCH',
                },
            }),
        ]);
    } else if (paymentStatus === 'failed' || paymentStatus === 'expired') {
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED', webhookVerified: true },
            }),
            prisma.application.update({
                where: { id: payment.applicationId },
                data: { paymentStatus: 'FAILED', batchAssignmentState: 'WAITING_FOR_PAYMENT' },
            }),
        ]);
    }

    return NextResponse.json({ received: true });
}