export default function VisionPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-4xl">
                <p className="eyebrow">Our vision</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">The Gospel for Everyone by 2033.</h1>
                <p className="mt-6 max-w-3xl text-xl leading-9 text-[#526977]">We long to see every person prayed for and every nation reached with the good news of Jesus, through a Church that is united in hope and active in love.</p>
            </header>

            <section className="mt-12 grid gap-10 border-y border-[#dce5eb] py-10 lg:grid-cols-2">
                <div>
                    <p className="eyebrow">The meaning of the horizon</p>
                    <h2 className="font-display mt-4 text-3xl text-[#122d42]">A date that points us toward faithfulness.</h2>
                </div>
                <div className="space-y-4 leading-7 text-[#526977]">
                    <p>Many Christian traditions use AD 33 as a traditional reference for the death and resurrection of Jesus. The exact chronology is not universally agreed, and Christian communities mark this anniversary in different ways.</p>
                    <p>The World Evangelical Alliance’s 2025 General Assembly described 2033 as an approaching 2,000-year anniversary horizon and centered its Seoul gathering on “The Gospel for Everyone by 2033.” For this movement, the year is a shared focus for prayer and mission, not a prediction and not a finish line for God’s work.</p>
                    <a className="inline-flex font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4" href="https://gospelforeveryone.worldea.org/information/program/" target="_blank" rel="noreferrer">Explore the WEA Assembly theme</a>
                </div>
            </section>

            <section className="mt-12 grid gap-4 sm:grid-cols-3">
                <article className="border-t-4 border-[#075b8f] bg-white p-6">
                    <h2 className="font-display text-2xl text-[#122d42]">Every people</h2>
                    <p className="mt-3 leading-7 text-[#526977]">The Gospel is good news for people of every language, culture and generation.</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f07835]">Revelation 7:9</p>
                </article>
                <article className="border-t-4 border-[#f07835] bg-white p-6">
                    <h2 className="font-display text-2xl text-[#122d42]">Every believer</h2>
                    <p className="mt-3 leading-7 text-[#526977]">A life shaped by Christ can become a quiet, credible witness in ordinary places.</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f07835]">1 Peter 3:15</p>
                </article>
                <article className="border-t-4 border-[#36aebd] bg-white p-6">
                    <h2 className="font-display text-2xl text-[#122d42]">Every space</h2>
                    <p className="mt-3 leading-7 text-[#526977]">From local streets to digital networks, we meet people with truth, patience and love.</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f07835]">Colossians 4:5–6</p>
                </article>
            </section>
        </main>
    );
}
