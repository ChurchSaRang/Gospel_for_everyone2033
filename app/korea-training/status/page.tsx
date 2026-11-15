'use client';

import { useEffect, useState } from 'react';

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
                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        disabled={startingPayment}
                                        className="btn-primary mt-4 w-full justify-center disabled:opacity-60"
                                    >
                                        {startingPayment ? 'Connecting to payment…' : response.paymentStatus === 'FAILED' ? 'Retry payment' : 'Proceed to payment'}
                                    </button>
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
        </div>
    );
}
