export default function ImpactPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Progress and purpose</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">Faithful work. Honest measures.</h1>
                <p className="mt-6 text-lg leading-8 text-[#526977]">We distinguish the movement’s global context from this programme’s plans. Targets are commitments to pursue, not results already achieved.</p>
            </header>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
                <article className="border border-[#dce5eb] bg-white p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Reported by WEA · 2025</p>
                    <p className="font-display mt-4 text-5xl text-[#075b8f]">161</p>
                    <p className="mt-3 leading-7 text-[#526977]">national evangelical alliances represented in the WEA network at the time of the Seoul Assembly report.</p>
                </article>
                <article className="border border-[#dce5eb] bg-white p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Reported by WEA · 2025</p>
                    <p className="font-display mt-4 text-5xl text-[#075b8f]">9</p>
                    <p className="mt-3 leading-7 text-[#526977]">regional bodies connected through a diverse global evangelical family.</p>
                </article>
                <article className="border border-[#dce5eb] bg-[#eaf2f6] p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Programme plan</p>
                    <p className="font-display mt-4 text-5xl text-[#075b8f]">1,000</p>
                    <p className="mt-3 leading-7 text-[#526977]">places planned across three Korea training cohorts. This is a target, not a completed participant count.</p>
                </article>
            </section>

            <section className="mt-12 grid gap-8 border-t border-[#dce5eb] pt-9 lg:grid-cols-[0.75fr_1.25fr]">
                <h2 className="font-display text-3xl text-[#122d42]">What impact should look like</h2>
                <ul className="grid gap-4 text-[#526977] sm:grid-cols-2">
                    <li className="border-l-2 border-[#075b8f] pl-4 leading-7">People growing in confidence to share their faith with respect.</li>
                    <li className="border-l-2 border-[#f07835] pl-4 leading-7">Church teams creating useful, truthful and locally meaningful content.</li>
                    <li className="border-l-2 border-[#36aebd] pl-4 leading-7">Digital conversations leading toward care, discipleship and community.</li>
                    <li className="border-l-2 border-[#075b8f] pl-4 leading-7">Training participants multiplying what they learn in their home contexts.</li>
                </ul>
            </section>

            <a className="mt-8 inline-flex font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4" href="https://worldea.org/global-church-mobilizes-as-wea-convenes-historic-seoul-assembly/" target="_blank" rel="noreferrer">Read the WEA’s 2025 Seoul Assembly report</a>
        </main>
    );
}
