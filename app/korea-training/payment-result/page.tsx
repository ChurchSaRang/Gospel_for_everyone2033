import Link from 'next/link';

export default function PaymentResultPage() {
    return (
        <div className="container-shell py-16">
            <div className="card-surface max-w-2xl bg-[#f7fafb]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Support fee payment</p>
                <h1 className="section-title mt-3">Payment status review</h1>
                <p className="mt-6 text-[#526977]">A payment is confirmed only after the payment provider sends a verified server notification. A browser redirect alone does not confirm payment.</p>
                <Link href="/korea-training/status" className="btn-primary mt-6">
                    Check application status
                </Link>
            </div>
        </div>
    );
}
