export default function AboutPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">About the movement</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">A world-wide call, lived out one conversation at a time.</h1>
                <p className="mt-6 text-lg leading-8 text-[#526977]">
                    Gospel for Everyone by 2033 is a Christian vision to mobilise believers, churches and ministries for faithful witness to Jesus Christ among all peoples. It is not a campaign owned by one platform or one personality. It is a shared invitation to pray, serve and make disciples wherever God has placed us.
                </p>
            </header>

            <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5 text-lg leading-8 text-[#526977]">
                    <p>The Great Commission is both global and personal. It calls the Church to cross borders, but also to notice the neighbour, coworker, student or stranger already within reach.</p>
                    <p>Digital life has become part of that human landscape. Social platforms can carry honest questions, friendship and creative work. We want Christians to enter those spaces with humility and discernment, connecting digital conversations to the deeper practices of prayer, care, Scripture and community.</p>
                    <p>Our hope is not simply to publish more content. It is to form people who can communicate the Gospel clearly, listen generously and walk alongside others in real relationships.</p>
                </div>
                <aside className="border-l-4 border-[#f07835] bg-white p-7 shadow-[0_16px_50px_rgba(18,45,66,0.08)] sm:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075b8f]">A shared foundation</p>
                    <p className="font-display mt-4 text-3xl leading-tight text-[#122d42]">“You will be my witnesses … to the ends of the earth.”</p>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-[#526977]">Acts 1:8</p>
                    <p className="mt-6 text-sm leading-6 text-[#526977]">A witness is not only a speaker. A witness is a person whose words and life point toward the hope they have found in Christ.</p>
                </aside>
            </section>

            <section className="mt-16 border-t border-[#dce5eb] pt-10">
                <p className="eyebrow">A moment in the story</p>
                <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
                    <p className="font-display text-4xl text-[#075b8f]">Seoul<br />2025</p>
                    <div className="max-w-3xl">
                        <h2 className="font-display text-3xl text-[#122d42]">A global gathering around a shared horizon</h2>
                        <p className="mt-4 leading-7 text-[#526977]">From 27–31 October 2025, the World Evangelical Alliance held its 14th General Assembly at SaRang Church in Seoul under the theme “The Gospel for Everyone by 2033.” The gathering highlighted evangelism, discipleship, global partnership and digital witness as part of the Church’s shared mission.</p>
                        <a className="mt-5 inline-flex font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4" href="https://worldea.org/global-church-mobilizes-as-wea-convenes-historic-seoul-assembly/" target="_blank" rel="noreferrer">Read the World Evangelical Alliance report</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
