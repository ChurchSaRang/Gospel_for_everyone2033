import { createHmac, timingSafeEqual } from 'node:crypto';

const apiBaseUrl = 'https://api.nowpayments.io/v1';

type InvoiceInput = {
    apiKey: string;
    amount: number;
    currency: string;
    confirmationCode: string;
    callbackUrl: string;
    returnUrl: string;
};

type InvoiceResponse = {
    id?: string | number;
    invoice_url?: string;
};

function sortJsonValue(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortJsonValue);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
                .map(([key, entry]) => [key, sortJsonValue(entry)]),
        );
    }
    return value;
}

export async function createNowPaymentsInvoice({
    apiKey,
    amount,
    currency,
    confirmationCode,
    callbackUrl,
    returnUrl,
}: InvoiceInput) {
    const response = await fetch(`${apiBaseUrl}/invoice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            price_amount: amount,
            price_currency: currency.toLowerCase(),
            order_id: confirmationCode,
            order_description: `Training ID: ${confirmationCode}`,
            ipn_callback_url: callbackUrl,
            success_url: returnUrl,
            cancel_url: returnUrl,
        }),
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(`NOWPayments invoice request failed with status ${response.status}.`);
    }

    const invoice = await response.json() as InvoiceResponse;
    if (invoice.id === undefined || !invoice.invoice_url) {
        throw new Error('NOWPayments returned an incomplete invoice response.');
    }

    return { id: String(invoice.id), invoiceUrl: invoice.invoice_url };
}

export function verifyNowPaymentsSignature(
    payload: Record<string, unknown>,
    signature: string | null,
    secret: string,
) {
    if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;

    const expected = createHmac('sha512', secret)
        .update(JSON.stringify(sortJsonValue(payload)))
        .digest();
    const received = Buffer.from(signature, 'hex');

    return received.length === expected.length && timingSafeEqual(received, expected);
}