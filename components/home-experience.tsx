import Image from 'next/image';
import Link from 'next/link';
import { HeroCarousel } from '@/components/hero-carousel';
import { getPublicCohorts } from '@/lib/cohort-data';
import { galleryItems, partners } from '@/lib/site-data';

const trainingStories = [
    {
        image: '/public%20pictures/digital%20evangelism%20one.jpg',
        alt: 'Christian leaders presenting a digital evangelism training session',
        number: '01',
        title: 'Listen before you post',
        copy: 'Digital witness begins with people. Learn to notice the questions, stories and hopes already present in online communities.',
    },
    {
        image: '/public%20pictures/digital%20evangelism%20two.png',
        alt: 'A workshop group learning about digital evangelism',
        number: '02',
        title: 'Create with care',
        copy: 'Shape thoughtful, truthful and culturally aware content that invites conversation instead of chasing attention.',
    },
    {
        image: '/public%20pictures/digital%20evangelism%20three.jpg',
        alt: 'Speakers sharing the Gospel for Everyone vision at the Seoul assembly',
        number: '03',
        title: 'Connect people to community',
        copy: 'Online conversations are a beginning. Grow toward prayer, trusted relationships and life-giving local church community.',
    },
];

export async function HomeExperience() {
    const upcomingBatches = await getPublicCohorts();

    return (
        <main className="overflow-hidden">
            <HeroCarousel />

            <section className="container-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
                <div>
                    <p className="eyebrow">Why this vision matters</p>
                    <h2 className="section-title mt-4 max-w-2xl text-4xl sm:text-5xl">
                        The Great Commission belongs to the whole Church.
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526977]">
                        Jesus sends his followers to make disciples among all peoples. We believe that call reaches our streets, our homes and the digital places where people learn, build friendships and search for meaning.
                    </p>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-[#526977]">
                        Gospel for Everyone by 2033 invites churches, ministries and everyday Christians to pray, serve and share Christ with humility, courage and care.
                    </p>
                    <Link href="/mission" className="btn-primary mt-7">See how we serve</Link>
                </div>
                <div className="relative border-l-4 border-[#f07835] bg-white px-7 py-8 shadow-[0_16px_50px_rgba(18,45,66,0.08)] sm:px-10 sm:py-11">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#075b8f]">A word for the journey</p>
                    <blockquote className="font-display mt-5 text-3xl leading-tight text-[#122d42] sm:text-4xl">
                        “How are they to hear without someone preaching to them?”
                    </blockquote>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#526977]">Romans 10:14</p>
                    <p className="mt-8 border-t border-[#dce5eb] pt-5 text-sm leading-6 text-[#526977]">
                        Our answer is not louder noise. It is faithful presence: listening well, speaking truthfully and walking with people toward hope.
                    </p>
                </div>
            </section>

            <section className="bg-[#eaf2f6] py-16 sm:py-20 lg:py-24">
                <div className="container-shell">
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <div>
                            <p className="eyebrow">Faith in digital spaces</p>
                            <h2 className="section-title mt-4 text-4xl sm:text-5xl">Presence before platform.</h2>
                        </div>
                        <p className="max-w-2xl text-lg leading-8 text-[#526977] lg:justify-self-end">
                            A screen can carry a message, but ministry is always about people. The Korea Digital Evangelism Training Programme brings biblical grounding, creative practice and relational discipleship into one learning journey.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {trainingStories.map((story) => (
                            <article key={story.number} className="overflow-hidden rounded-lg border border-[#d2e0e8] bg-white">
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#dce5eb]">
                                    <Image src={story.image} alt={story.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-[1.03]" />
                                </div>
                                <div className="p-6 sm:p-7">
                                    <p className="text-xs font-bold tracking-[0.14em] text-[#f07835]">{story.number} / DIGITAL WITNESS</p>
                                    <h3 className="font-display mt-3 text-2xl text-[#122d42]">{story.title}</h3>
                                    <p className="mt-3 leading-7 text-[#526977]">{story.copy}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/korea-training" className="btn-primary">Explore the programme</Link>
                        <Link href="/korea-training/status" className="btn-secondary">Check application status / pay fee</Link>
                        <Link href="/korea-training/curriculum" className="btn-secondary">View learning areas</Link>
                    </div>
                </div>
            </section>

            <section className="container-shell py-16 sm:py-20 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <p className="eyebrow">A shared horizon</p>
                        <h2 className="section-title mt-4 text-4xl sm:text-5xl">Why 2033?</h2>
                        <p className="mt-5 leading-8 text-[#526977]">
                            Many Christians use AD 33 as a traditional reference for the events at the heart of Easter. Exact historical dating differs, but the WEA’s 2025 General Assembly described 2033 as an approaching 2,000-year anniversary horizon and made “The Gospel for Everyone by 2033” its theme.
                        </p>
                        <p className="mt-4 leading-8 text-[#526977]">
                            For this movement, 2033 is a shared call to prayer and mission, not a prediction or a claim that the work of evangelism can be completed by a date.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 text-sm font-semibold">
                            <a className="text-[#075b8f] underline decoration-[#f07835] underline-offset-4" href="https://worldea.org/global-church-mobilizes-as-wea-convenes-historic-seoul-assembly/" target="_blank" rel="noreferrer">Read the WEA Seoul Assembly report</a>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {upcomingBatches.map((batch, index) => (
                            <div key={batch.batch} className="flex min-h-48 flex-col justify-between border-t-4 border-[#f07835] bg-white p-5 shadow-[0_12px_36px_rgba(18,45,66,0.06)]">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075b8f]">Cohort 0{index + 1}</p>
                                    <h3 className="font-display mt-3 text-2xl text-[#122d42]">{batch.batch}</h3>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-[#122d42]">{batch.participantCount}/{batch.capacity}</p>
                                    <p className="mt-1 text-sm leading-6 text-[#526977]">participants / Seoul South Korea<br />{batch.dates}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 sm:py-20">
                <div className="container-shell">
                    <div className="flex flex-wrap items-end justify-between gap-5">
                        <div className="max-w-2xl">
                            <p className="eyebrow">Together across regions</p>
                            <h2 className="section-title mt-4 text-4xl sm:text-5xl">A global family. Many local voices.</h2>
                        </div>
                        <Link href="/partners" className="text-sm font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4">Meet the partner network</Link>
                    </div>
                    <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                        {partners.map((partner) => (
                            <a
                                key={partner.name}
                                href={partner.website}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex min-h-36 flex-col items-center justify-between border border-[#dce5eb] bg-[#f7fafb] p-4 text-center transition hover:border-[#075b8f] hover:bg-white sm:min-h-40"
                            >
                                <span className="relative flex h-16 w-full items-center justify-center sm:h-20">
                                    <Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="(max-width: 640px) 40vw, 20vw" className="object-contain" />
                                </span>
                                <span className="mt-3 text-xs font-bold leading-5 text-[#29495d] group-hover:text-[#075b8f] sm:text-sm">{partner.name}</span>
                            </a>
                        ))}
                    </div>
                    <p className="mt-5 max-w-3xl text-xs leading-5 text-[#647b89]">
                        Organizations shown here are presented as movement partners and sponsors. Each mark links to the organization’s public website.
                    </p>
                </div>
            </section>

            <section className="container-shell py-16 sm:py-20">
                <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="eyebrow">From Seoul and beyond</p>
                        <h2 className="section-title mt-4 text-4xl sm:text-5xl">A movement made visible.</h2>
                    </div>
                    <Link href="/gallery" className="text-sm font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4">Explore the gallery</Link>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryItems.slice(0, 4).map((item) => (
                        <figure key={item.title} className="group overflow-hidden rounded-lg bg-[#dce5eb]">
                            <div className="relative aspect-[4/3]">
                                <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                            </div>
                            <figcaption className="bg-white px-4 py-3 text-sm font-semibold text-[#29495d]">{item.title}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="bg-[#102a43] py-16 text-white sm:py-20">
                <div className="container-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Your next faithful step</p>
                        <h2 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">Pray. Learn. Share hope where you are.</h2>
                        <p className="mt-4 max-w-2xl leading-7 text-white/75">Start with the people around you. Explore the vision, prepare for training, or join a local conversation about digital witness.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 lg:justify-end">
                        <Link href="/korea-training/application" className="btn-gold">Apply for training</Link>
                        <Link href="/contact" className="btn-light">Connect with us</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}