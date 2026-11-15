import Link from 'next/link';

export default function SupportPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Programme support</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">Clarity is part of care.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">The programme’s current plan includes a USD 500 participant support fee for selected applicants. Any additional support is subject to available funds and written approval.</p>
            </header>
            <section className="mt-9 grid gap-4 md:grid-cols-2">
                <article className="border border-[#dce5eb] bg-white p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">What the fee supports</p>
                    <h2 className="font-display mt-3 text-3xl text-[#122d42]">Shared programme costs</h2>
                    <p className="mt-4 leading-7 text-[#526977]">The participant support fee is intended to contribute toward core training arrangements such as accommodation, meals, training resources, software and approved travel or visa support. Exact coverage depends on the participant’s written offer.</p>
                </article>
                <aside className="bg-[#eaf2f6] p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075b8f]">Before you pay or travel</p>
                    <h2 className="font-display mt-3 text-3xl text-[#122d42]">Wait for official confirmation.</h2>
                    <p className="mt-4 leading-7 text-[#526977]">Payment is requested only after selection and issuance of a confirmation code. Do not book flights, submit visa costs or rely on support promises unless they appear in your official programme documents.</p>
                    <Link href="/korea-training/status" className="btn-primary mt-6">Check status or payment</Link>
                </aside>
            </section>
        </main>
    );
}
