import Link from 'next/link';

export default function EligibilityPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Who this is for</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">People ready to learn and serve.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">The training welcomes Christians who want to grow in digital mission and bring practical learning back to their communities.</p>
            </header>
            <section className="mt-9 grid gap-4 sm:grid-cols-2">
                <article className="border border-[#dce5eb] bg-white p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Current criteria</p>
                    <ul className="mt-5 space-y-4 leading-7 text-[#526977]">
                        <li>Age 20–55 at the time of application.</li>
                        <li>A committed Christian with an active local church or ministry connection.</li>
                        <li>A genuine interest in evangelism, communication or digital ministry.</li>
                        <li>Willingness to learn with others and share useful skills at home.</li>
                    </ul>
                </article>
                <aside className="bg-[#eaf2f6] p-6 sm:p-8">
                    <h2 className="font-display text-3xl text-[#122d42]">Please plan carefully.</h2>
                    <p className="mt-4 leading-7 text-[#526977]">Applying does not guarantee selection. A confirmation email and official programme documents will explain next steps. Venue, visa, sponsorship, travel and funding arrangements are only final when confirmed in writing.</p>
                    <Link href="/korea-training/application" className="btn-primary mt-6">Read and complete the form</Link>
                </aside>
            </section>
        </main>
    );
}
