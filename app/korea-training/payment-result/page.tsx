export default function PaymentResultPage() {
    return (
        <div className="container-shell py-16">
            <div className="card-surface max-w-2xl bg-[#f7fafb]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Support fee payment</p>
                <h1 className="section-title mt-3">Payment status review</h1>
                <p className="mt-6 text-[#526977]">This flow is designed to verify provider responses server-side before updates are applied to applicant status. A live provider must be configured before final payment processing is enabled.</p>
            </div>
        </div>
    );
}
