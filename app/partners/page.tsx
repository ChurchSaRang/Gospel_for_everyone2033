import Image from 'next/image';
import { partners } from '@/lib/site-data';

export default function PartnersPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">A global family</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">One Gospel. Many regions. Shared witness.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">
                    The Gospel for Everyone vision calls churches and evangelical alliances to serve together across cultures. Explore the organizations named as partners and sponsors, and visit each one through its official public website.
                </p>
            </header>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {partners.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visit the official website of ${partner.name}`}
                        className="group flex h-full flex-col border border-[#dce5eb] bg-white p-4 transition hover:-translate-y-1 hover:border-[#075b8f] hover:shadow-[0_16px_44px_rgba(18,45,66,0.12)] sm:p-5"
                    >
                        <div className="relative aspect-[3/2] w-full bg-[#f7fafb] p-4">
                            <Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-contain p-3" />
                        </div>
                        <div className="flex flex-1 flex-col pt-5">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#f07835]">{partner.type}</p>
                            <h2 className="font-display mt-2 text-2xl leading-tight text-[#122d42] group-hover:text-[#075b8f]">{partner.name}</h2>
                            <p className="mt-3 text-sm leading-6 text-[#526977]">{partner.relationship}</p>
                            <span className="mt-auto pt-5 text-sm font-bold text-[#075b8f]">Visit official website <span aria-hidden="true">↗</span></span>
                        </div>
                    </a>
                ))}
            </div>
        </main>
    );
}
