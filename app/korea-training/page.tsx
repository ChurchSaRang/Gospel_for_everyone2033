import Image from 'next/image';
import Link from 'next/link';
import { getPublicCohorts } from '@/lib/cohort-data';

const learningJourney = [
    {
        image: '/public%20pictures/digital%20evangelism%20one.jpg',
        alt: 'A digital evangelism training session with church leaders',
        step: 'Start with people',
        description: 'Read the moment with empathy: listen to real questions, understand local context and build trust before choosing a platform.',
    },
    {
        image: '/public%20pictures/digital%20evangelism%20two.png',
        alt: 'A presenter teaching digital evangelism to a workshop group',
        step: 'Make the message clear',
        description: 'Practice story, image, video and conversation formats that communicate biblical hope accurately and responsibly.',
    },
    {
        image: '/public%20pictures/digital%20evangelism%20three.jpg',
        alt: 'Global church leaders gathered at the Seoul General Assembly',
        step: 'Carry it into community',
        description: 'Connect digital conversations to prayer, pastoral care and local church relationships that can grow over time.',
    },
];

export const dynamic = 'force-dynamic';

export default async function KoreaTrainingPage() {
    const upcomingBatches = await getPublicCohorts();
    return (
        <main>
            <section className="relative isolate overflow-hidden bg-[#102a43] py-16 text-white sm:py-24">
                <div className="absolute inset-0 opacity-30">
                    <Image src="/public%20pictures/digital%20evangelism%20one.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-[#102a43]/75" />
                <div className="container-shell relative">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Korea Digital Evangelism Training</p>
                    <h1 className="font-display mt-5 max-w-4xl text-4xl leading-tight sm:text-6xl">Carry the good news into the places people already gather.</h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">A practical learning journey for Christians who want their online witness to be thoughtful, creative, biblically grounded and connected to real community.</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/korea-training/application" className="btn-gold">Apply for training</Link>
                        <Link href="/korea-training/curriculum" className="btn-light">Explore the curriculum</Link>
                        <Link href="/korea-training/status" className="btn-light">Check application status / pay fee</Link>
                    </div>
                </div>
            </section>

            <section className="container-shell py-14 sm:py-20">
                <div className="max-w-3xl">
                    <p className="eyebrow">A formation journey</p>
                    <h2 className="section-title mt-4 text-4xl sm:text-5xl">Digital skill in service of human connection.</h2>
                    <p className="mt-5 text-lg leading-8 text-[#526977]">The goal is not to turn faith into a marketing campaign. It is to help believers communicate with clarity, respect the people they meet online and offer a next step toward deeper conversation and discipleship.</p>
                </div>
                <div className="mt-9 grid gap-5 md:grid-cols-3">
                    {learningJourney.map((item, index) => (
                        <article key={item.step} className="overflow-hidden rounded-lg border border-[#dce5eb] bg-white">
                            <div className="relative aspect-[4/3] bg-[#eaf2f6]">
                                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Step 0{index + 1}</p>
                                <h3 className="font-display mt-3 text-2xl text-[#122d42]">{item.step}</h3>
                                <p className="mt-3 leading-7 text-[#526977]">{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="container-shell pb-14 sm:pb-20">
                <div className="card-surface bg-white">
                    <p className="eyebrow">Programme benefit</p>
                    <h2 className="section-title mt-3 text-3xl">A certificate in Content Creation and Media Management</h2>
                    <p className="mt-4 max-w-3xl leading-7 text-[#526977]">Participants who successfully complete the programme will receive a certificate from Soongsil University in Content Creation and Media Management.</p>
                </div>
            </section>

            <section className="bg-[#eaf2f6] py-14 sm:py-18">
                <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="eyebrow">Programme at a glance</p>
                        <h2 className="section-title mt-4 text-4xl">Learn. Practice. Return ready to serve.</h2>
                        <p className="mt-4 leading-7 text-[#526977]">The current programme plan is for three cohorts in Seoul during 2027. Dates, venue, sponsorship and travel arrangements remain subject to written programme confirmation.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {upcomingBatches.map((batch) => (
                            <article key={batch.batch} className="border border-[#d2e0e8] bg-white p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#f07835]">Planned cohort</p>
                                <h3 className="font-display mt-3 text-2xl text-[#122d42]">{batch.batch}</h3>
                                <p className="mt-3 text-2xl font-semibold text-[#075b8f]">{batch.participantCount}/{batch.capacity}</p>
                                <p className="mt-2 text-sm leading-6 text-[#526977]">participants / Seoul South Korea<br />{batch.dates}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container-shell flex flex-wrap items-center justify-between gap-6 py-14 sm:py-18">
                <div>
                    <p className="font-display text-3xl text-[#122d42]">“Always be prepared to give an answer … with gentleness and respect.”</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-[#526977]">1 Peter 3:15</p>
                </div>
                <Link href="/korea-training/application" className="btn-primary">Start your application</Link>
            </section>
        </main>
    );
}
