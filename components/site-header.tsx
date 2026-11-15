'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { navItems } from '@/lib/site-data';

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    function translateCurrentPage(language: string) {
        if (!language) return;

        const translationUrl = new URL('https://translate.google.com/translate');
        translationUrl.searchParams.set('sl', 'auto');
        translationUrl.searchParams.set('tl', language);
        translationUrl.searchParams.set('u', window.location.href);
        window.location.assign(translationUrl.toString());
    }

    return (
        <header className="sticky top-0 z-40 border-b border-[#dce5eb] bg-white/95 backdrop-blur-md">
            <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="shrink-0" aria-label="Gospel for Everyone home">
                    <Image
                        src="/public%20pictures/Gospel%20for%20everyone%20logo.png"
                        alt="Gospel for Everyone"
                        width={128}
                        height={88}
                        priority
                        className="h-14 w-[82px] object-contain sm:h-16 sm:w-[94px]"
                    />
                </Link>

                <div className="hidden items-center gap-2 sm:flex">
                    <Link href="/donate" className="btn-secondary px-4 py-2 text-sm">
                        Donate
                    </Link>
                    <Link href="/korea-training/application" className="btn-primary px-4 py-2 text-sm">
                        Apply
                    </Link>
                </div>

                <button
                    type="button"
                    className="btn-secondary px-4 py-2 text-sm"
                    aria-expanded={menuOpen}
                    aria-controls="site-menu"
                    onClick={() => setMenuOpen((isOpen) => !isOpen)}
                >
                    {menuOpen ? 'Close menu' : 'Menu'}
                </button>

                <label className="sr-only" htmlFor="site-language">Translate this site</label>
                <select
                    id="site-language"
                    defaultValue=""
                    onChange={(event) => translateCurrentPage(event.target.value)}
                    className="h-10 max-w-28 rounded-md border border-[#b8cbd7] bg-white px-2 text-sm font-semibold text-[#122d42] sm:max-w-36 sm:px-3"
                >
                    <option value="" disabled>Language</option>
                    <option value="ar">Arabic</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="zh-TW">Chinese (Traditional)</option>
                    <option value="nl">Dutch</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ha">Hausa</option>
                    <option value="hi">Hindi</option>
                    <option value="id">Indonesian</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ms">Malay</option>
                    <option value="ne">Nepali</option>
                    <option value="fa">Persian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="es">Spanish</option>
                    <option value="sw">Swahili</option>
                    <option value="tl">Tagalog</option>
                    <option value="th">Thai</option>
                    <option value="tr">Turkish</option>
                    <option value="uk">Ukrainian</option>
                    <option value="ur">Urdu</option>
                    <option value="vi">Vietnamese</option>
                    <option value="yo">Yoruba</option>
                </select>

                {menuOpen && (
                    <nav id="site-menu" aria-label="Main menu" className="absolute right-4 top-[calc(100%+0.25rem)] z-50 grid w-[min(20rem,calc(100vw-2rem))] gap-1 rounded-lg border border-[#dce5eb] bg-white p-2 shadow-xl sm:right-6 lg:right-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded px-3 py-2 text-sm font-semibold text-[#29495d] hover:bg-[#eef4f7] hover:text-[#075b8f]"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/donate" onClick={() => setMenuOpen(false)} className="rounded px-3 py-2 text-sm font-semibold text-[#29495d] hover:bg-[#eef4f7] hover:text-[#075b8f]">Donate</Link>
                        <Link href="/korea-training/application" onClick={() => setMenuOpen(false)} className="btn-primary mt-1 justify-center text-sm">Apply</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
