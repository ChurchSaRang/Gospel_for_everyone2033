import Link from 'next/link';

export default function DonatePage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Give, pray and participate</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">Help make room for more faithful witness.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">Generosity can strengthen training, local ministry and the partnerships that help people share the good news with care. We want every contribution to be handled with clarity and accountability.</p>
            </header>
            <section className="mt-9 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
                <div className="border border-[#dce5eb] bg-white p-7 sm:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Giving information</p>
                    <h2 className="font-display mt-4 text-3xl text-[#122d42]">Ask before you give.</h2>
                    <p className="mt-4 max-w-2xl leading-7 text-[#526977]">Online donation processing is not currently enabled on this page. Contact the movement team to receive confirmed giving channels and any relevant documentation. Do not send funds to an account shared through an unofficial message.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="mailto:support@gospelforeveryonemovement.com?subject=Giving%20to%20Gospel%20for%20Everyone" className="btn-primary">Request giving details</a>
                        <Link href="/korea-training/status" className="btn-secondary">Check application status / pay fee</Link>
                    </div>
                </div>
                <aside className="bg-[#102a43] p-7 text-white sm:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Beyond money</p>
                    <h2 className="font-display mt-4 text-3xl">Join in the work.</h2>
                    <ul className="mt-5 space-y-3 leading-7 text-white/80">
                        <li>Pray for churches and communities worldwide.</li>
                        <li>Share thoughtful, hopeful and truthful content.</li>
                        <li>Help someone grow in faith and digital wisdom.</li>
                    </ul>
                    <Link href="/mission" className="btn-light mt-7">Explore the mission</Link>
                </aside>
            </section>
        </main>
    );
}
