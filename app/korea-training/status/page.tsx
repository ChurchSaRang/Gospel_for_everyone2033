'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PayPalHostedButton } from '@/components/paypal-hosted-button';

type PaymentGateway = 'NOWPAYMENTS' | 'PAYPAL';
type ReceiptFeedback = { type: 'success' | 'error'; message: string };

type StatusResponse = {
    fullName: string;
    country: string;
    age: number;
    applicationStatus: string;
    paymentStatus: string;
    batchName?: string;
    trainingId: string;
    supportFeeAmount: number;
    supportFeeCurrency: string;
};

async function lookupStatus(code: string) {
    const response = await fetch('/api/application-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });
    const payload: { message?: string; data?: StatusResponse } = await response.json();
    if (!response.ok || !payload.data) {
        throw new Error(payload.message || 'Invalid confirmation code.');
    }
    return payload.data;
}

export default function StatusPage() {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [response, setResponse] = useState<StatusResponse | null>(null);
    const [error, setError] = useState('');
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [startingPayment, setStartingPayment] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('NOWPAYMENTS');
    const [receiptFormOpen, setReceiptFormOpen] = useState(false);
    const [receiptConfirmationCode, setReceiptConfirmationCode] = useState('');
    const [receiptFullName, setReceiptFullName] = useState('');
    const [receiptImage, setReceiptImage] = useState<File | null>(null);
    const [submittingReceipt, setSubmittingReceipt] = useState(false);
    const [receiptFeedback, setReceiptFeedback] = useState<ReceiptFeedback | null>(null);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) return;

        lookupStatus(code)
            .then((data) => {
                setConfirmationCode(code);
                setResponse(data);
                setError('');
            })
            .catch((lookupError) => {
                setResponse(null);
                setError(lookupError instanceof Error ? lookupError.message : 'Status lookup failed.');
            })
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setCheckingStatus(true);
        try {
            setResponse(await lookupStatus(confirmationCode));
            setError('');
        } catch (lookupError) {
            setError(lookupError instanceof Error ? lookupError.message : 'Status lookup failed.');
            setResponse(null);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleProceedToPayment = async () => {
        setStartingPayment(true);
        setError('');
        try {
            const checkoutResponse = await fetch('/api/payments/nowpayments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmationCode: response?.trainingId }),
            });
            const payload: { message?: string; data?: { invoiceUrl: string } } = await checkoutResponse.json();
            if (!checkoutResponse.ok || !payload.data?.invoiceUrl) {
                throw new Error(payload.message || 'Could not start payment checkout.');
            }
            window.location.assign(payload.data.invoiceUrl);
        } catch (paymentError) {
            setError(paymentError instanceof Error ? paymentError.message : 'Could not start payment checkout.');
            setStartingPayment(false);
        }
    };

    const openReceiptForm = () => {
        setReceiptConfirmationCode(response?.trainingId ?? confirmationCode);
        setReceiptFullName(response?.fullName ?? '');
        setReceiptImage(null);
        setReceiptFeedback(null);
        setReceiptFormOpen(true);
    };

    const handleReceiptSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!receiptImage) {
            setReceiptFeedback({ type: 'error', message: 'Choose a picture of your payment receipt.' });
            return;
        }

        setSubmittingReceipt(true);
        setReceiptFeedback(null);
        try {
            const formData = new FormData();
            formData.set('confirmationCode', receiptConfirmationCode);
            formData.set('fullName', receiptFullName);
            formData.set('receipt', receiptImage);
            const submitResponse = await fetch('/api/payments/receipt', {
                method: 'POST',
                body: formData,
            });
            const payload: { message?: string } = await submitResponse.json();
            if (!submitResponse.ok) {
                throw new Error(payload.message || 'Could not submit the receipt.');
            }

            setReceiptFormOpen(false);
            setReceiptImage(null);
            setReceiptFeedback({
                type: 'success',
                message: payload.message || 'Receipt submitted for review.',
            });
        } catch (submitError) {
            setReceiptFeedback({
                type: 'error',
                message: submitError instanceof Error ? submitError.message : 'Could not submit the receipt.',
            });
        } finally {
            setSubmittingReceipt(false);
        }
    };

    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Application status</p>
            <h1 className="section-title mt-3">Check your application and payment status</h1>
            <div className="mt-8 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={handleSubmit} className="card-surface">
                    <label className="space-y-2 text-sm font-medium text-[#122d42]">
                        Confirmation code
                        <input value={confirmationCode} onChange={(event) => setConfirmationCode(event.target.value)} className="w-full rounded-xl border border-[#b8cbd7] bg-white p-3" placeholder="Enter code" />
                    </label>
                    <button type="submit" disabled={checkingStatus} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
                        {checkingStatus ? 'Checking…' : 'Verify status'}
                    </button>
                    {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                </form>

                <div className="card-surface bg-[#f7fafb]">
                    {response ? (
                        <div>
                            <h2 className="text-2xl font-bold">Status result</h2>
                            <div data-translate-ignore className="mt-5 space-y-3 text-[#122d42]">
                                <div><strong>Name:</strong> {response.fullName}</div>
                                <div><strong>Country:</strong> {response.country}</div>
                                <div><strong>Age:</strong> {response.age}</div>
                                <div><strong>Application status:</strong> {response.applicationStatus}</div>
                                <div><strong>Payment status:</strong> {response.paymentStatus}</div>
                                {response.batchName && <div><strong>Batch:</strong> {response.batchName}</div>}
                                <div><strong>Training ID:</strong> {response.trainingId}</div>
                            </div>
                            {response.applicationStatus === 'APPROVED' && ['PENDING', 'FAILED'].includes(response.paymentStatus) && (
                                <div className="mt-6 border-t border-[#dce5eb] pt-5">
                                    <p className="text-sm text-[#526977]">
                                        Support fee: {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: response.supportFeeCurrency,
                                        }).format(response.supportFeeAmount)}
                                    </p>
                                    <fieldset className="mt-4 space-y-2">
                                        <legend className="text-sm font-medium text-[#122d42]">Choose a payment method</legend>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {(['NOWPAYMENTS', 'PAYPAL'] as const).map((gateway) => (
                                                <label key={gateway} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium ${selectedGateway === gateway ? 'border-[#075b8f] bg-[#eef7fb] text-[#122d42]' : 'border-[#b8cbd7] bg-white text-[#526977]'}`}>
                                                    <input
                                                        type="radio"
                                                        name="support-payment-gateway"
                                                        value={gateway}
                                                        checked={selectedGateway === gateway}
                                                        onChange={() => setSelectedGateway(gateway)}
                                                    />
                                                    {gateway === 'PAYPAL' ? 'PayPal' : 'Crypto with NOWPayments'}
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                    {selectedGateway === 'NOWPAYMENTS' ? (
                                        <button
                                            type="button"
                                            onClick={handleProceedToPayment}
                                            disabled={startingPayment}
                                            className="btn-primary mt-4 w-full justify-center disabled:opacity-60"
                                        >
                                            {startingPayment ? 'Connecting to NOWPayments…' : response.paymentStatus === 'FAILED' ? 'Retry with NOWPayments' : 'Continue with NOWPayments'}
                                        </button>
                                    ) : (
                                        <div className="mt-4 border-t border-[#dce5eb] pt-4">
                                            <p className="mb-3 text-sm leading-6 text-[#526977]">
                                                This PayPal button is only for the training support fee. Payments through this gateway are not automatically verified. Take a screenshot of your reciept, After payment is completed, you will be returned to the status page, click Submit payment receipt, enter your confirmation ID and full name, then upload the screenshot. An admin will verify it and update your payment status.
                                            </p>
                                            <PayPalHostedButton />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold">Secure applicant lookup</h2>
                            <p className="mt-4 text-[#526977]">Use your confirmation code to view a limited status record. Sensitive personal data remains protected.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <button type="button" onClick={openReceiptForm} className="btn-secondary">
                    Submit payment receipt
                </button>
            </div>
            <p className="mt-3 text-center text-sm text-[#526977]">
                Still having an issue with payment?{' '}
                <Link href="/contact" className="font-semibold text-[#075b8f] underline underline-offset-2">
                    Contact support
                </Link>
                .
            </p>
            {!receiptFormOpen && receiptFeedback && (
                <p
                    role={receiptFeedback.type === 'error' ? 'alert' : 'status'}
                    className={`mx-auto mt-4 max-w-2xl rounded-xl border p-3 text-sm ${receiptFeedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-800'}`}
                >
                    {receiptFeedback.message}
                </p>
            )}
            {receiptFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/60 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-receipt-title"
                        className="card-surface max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="payment-receipt-title" className="text-2xl font-bold text-[#122d42]">Submit a payment receipt</h2>
                                <p className="mt-2 text-sm leading-6 text-[#526977]">
                                    The receipt image and applicant details will be emailed to the payments team for review.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReceiptFormOpen(false)}
                                disabled={submittingReceipt}
                                aria-label="Close receipt form"
                                className="rounded-full p-2 text-[#526977] hover:bg-[#f3f6f8] disabled:opacity-50"
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                    <path d="m6 6 12 12M18 6 6 18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleReceiptSubmit} className="mt-6 space-y-4">
                            <label className="block space-y-2 text-sm font-medium text-[#122d42]">
                                Confirmation ID
                                <input
                                    required
                                    maxLength={100}
                                    value={receiptConfirmationCode}
                                    onChange={(event) => setReceiptConfirmationCode(event.target.value)}
                                    className="w-full rounded-xl border border-[#b8cbd7] bg-white p-3"
                                    autoComplete="off"
                                />
                            </label>
                            <label className="block space-y-2 text-sm font-medium text-[#122d42]">
                                Full name
                                <input
                                    required
                                    maxLength={200}
                                    value={receiptFullName}
                                    onChange={(event) => setReceiptFullName(event.target.value)}
                                    className="w-full rounded-xl border border-[#b8cbd7] bg-white p-3"
                                    autoComplete="name"
                                />
                            </label>
                            <label className="block space-y-2 text-sm font-medium text-[#122d42]">
                                Picture of payment receipt
                                <input
                                    required
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => setReceiptImage(event.target.files?.[0] ?? null)}
                                    className="block w-full rounded-xl border border-[#b8cbd7] bg-white p-3 text-sm"
                                />
                                <span className="block text-xs font-normal text-[#526977]">JPEG, PNG, or WebP; maximum file size 3 MB.</span>
                            </label>
                            {receiptFeedback?.type === 'error' && (
                                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {receiptFeedback.message}
                                </p>
                            )}
                            <div className="flex flex-wrap justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setReceiptFormOpen(false)}
                                    disabled={submittingReceipt}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReceipt}
                                    className="btn-primary disabled:opacity-60"
                                >
                                    {submittingReceipt ? 'Sending receipt...' : 'Send receipt'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
