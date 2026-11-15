'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
    {
        image: '/public%20pictures/hero%20section%20backgroun%20image%20one.jfif',
        alt: 'Church leaders gathered for a global mission assembly',
        label: 'One message. Every people.',
    },
    {
        image: '/public%20pictures/hero%20section%20backgroun%20image%20two.jfif',
        alt: 'The worship auditorium at SaRang Church in Seoul',
        label: 'Rooted in the local church.',
    },
    {
        image: '/public%20pictures/hero%20section%20backgroun%20image%20three.jfif',
        alt: 'Participants listening together at a church gathering',
        label: 'A global family in one calling.',
    },
    {
        image: '/public%20pictures/hero%20section%20backgroun%20image%20four.jfif',
        alt: 'Speakers at the 2025 WEA Seoul General Assembly',
        label: 'A vision carried together.',
    },
];

export function HeroCarousel() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="relative isolate min-h-[660px] overflow-hidden bg-[#102a43] text-white sm:min-h-[720px] lg:min-h-[760px]">
            {slides.map((slide, index) => (
                <div
                    key={slide.image}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,28,45,0.88)_0%,rgba(8,28,45,0.72)_48%,rgba(8,28,45,0.22)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,28,45,0.58)_0%,transparent_46%)]" />

            <div className="container-shell relative flex min-h-[660px] items-end pb-12 pt-28 sm:min-h-[720px] sm:pb-16 lg:min-h-[760px] lg:pb-20">
                <div className="max-w-3xl">
                    <div className="mb-6 flex items-center gap-3">
                        <Image
                            src="/public%20pictures/Gospel%20for%20everyone%20logo.png"
                            alt="Gospel for Everyone movement logo"
                            width={92}
                            height={64}
                            className="h-12 w-[68px] rounded-sm bg-white object-contain p-1 sm:h-14 sm:w-20"
                        />
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85 sm:text-sm">
                            Gospel for Everyone by 2033
                        </p>
                    </div>

                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ffbe78] sm:text-base">
                        {slides[activeSlide].label}
                    </p>
                    <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.04] text-white sm:text-6xl lg:text-7xl">
                        The Gospel for Everyone.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
                        A shared call to make Jesus known in every community and every digital space, through lives shaped by truth, compassion and hope.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/vision" className="btn-gold">
                            Discover the vision
                        </Link>
                        <Link href="/korea-training" className="btn-light">
                            Explore digital evangelism training
                        </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
                        <p className="max-w-md border-l-2 border-[#f07835] pl-4 text-sm leading-6 text-white/85">
                            “Go and make disciples of all nations.” <span className="font-semibold text-white">Matthew 28:19</span>
                        </p>
                        <div className="flex items-center gap-2" aria-label="Choose hero slide">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.image}
                                    type="button"
                                    aria-label={`Show slide ${index + 1}: ${slide.label}`}
                                    aria-pressed={index === activeSlide}
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-1.5 transition-all ${index === activeSlide ? 'w-10 bg-[#ffbe78]' : 'w-5 bg-white/60 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}