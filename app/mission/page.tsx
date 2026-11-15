export default function MissionPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Mission and practice</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">Pray deeply. Communicate clearly. Walk with people.</h1>
                <p className="mt-6 text-lg leading-8 text-[#526977]">Our mission turns a global vision into faithful local practice. We equip people to serve their communities with biblical wisdom and to carry the character of Christ into every conversation.</p>
            </header>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
                <article className="bg-[#102a43] p-7 text-white">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">01 / Pray</p>
                    <h2 className="font-display mt-5 text-3xl">Begin with God.</h2>
                    <p className="mt-4 leading-7 text-white/75">We ask for wisdom, compassion and open hearts before we ask for reach. Mission is received before it is organized.</p>
                </article>
                <article className="bg-white p-7">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f07835]">02 / Equip</p>
                    <h2 className="font-display mt-5 text-3xl text-[#122d42]">Learn with purpose.</h2>
                    <p className="mt-4 leading-7 text-[#526977]">We build practical skills in digital storytelling, social platforms, contextual communication and responsible technology use.</p>
                </article>
                <article className="bg-[#dff2f3] p-7">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#075b8f]">03 / Send</p>
                    <h2 className="font-display mt-5 text-3xl text-[#122d42]">Return and multiply.</h2>
                    <p className="mt-4 leading-7 text-[#526977]">Participants bring learning home, strengthen local churches and help others share their faith with integrity.</p>
                </article>
            </section>

            <section className="mt-12 flex flex-col gap-5 border-l-4 border-[#f07835] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <p className="font-display text-2xl text-[#122d42]">“Let your conversation be always full of grace.”</p>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#526977]">Colossians 4:6</p>
                </div>
                <p className="max-w-md leading-7 text-[#526977]">Our witness should sound like the grace we have received: patient, truthful, respectful and full of hope.</p>
            </section>
        </main>
    );
}
