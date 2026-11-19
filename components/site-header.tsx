'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { navItems } from '@/lib/site-data';
import translationLanguages from '@/lib/translation-languages.json';

const languageChoiceStorageKey = 'gte-language-choice';

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [suggestedLanguage, setSuggestedLanguage] = useState<(typeof translationLanguages)[number] | null>(null);

    useEffect(() => {
        if (window.localStorage.getItem(languageChoiceStorageKey)) return;

        let cancelled = false;
        fetch('/api/language-suggestion', { cache: 'no-store' })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Language suggestion request failed (${response.status}).`);
                }

                const result: unknown = await response.json();
                if (typeof result !== 'object' || result === null || !('languageCode' in result)) {
                    throw new Error('Language suggestion response has an invalid shape.');
                }

                const { languageCode } = result;
                if (languageCode !== null && typeof languageCode !== 'string') {
                    throw new Error('Language suggestion response contains an invalid language code.');
                }

                const language = translationLanguages.find((item) => item.code === languageCode) ?? null;
                if (!cancelled && language && !window.localStorage.getItem(languageChoiceStorageKey)) {
                    setSuggestedLanguage(language);
                }
            })
            .catch((error: unknown) => {
                console.error('Could not load a suggested site language.', error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function translateCurrentPage(language: string) {
        if (!language) return;

        window.localStorage.setItem(languageChoiceStorageKey, language);
        const translationUrl = new URL('https://translate.google.com/translate');
        translationUrl.searchParams.set('sl', 'auto');
        translationUrl.searchParams.set('tl', language);
        translationUrl.searchParams.set('u', window.location.href);
        window.location.assign(translationUrl.toString());
    }

    function continueInEnglish() {
        window.localStorage.setItem(languageChoiceStorageKey, 'en');
        setSuggestedLanguage(null);
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

                <div className="relative inline-flex h-10 max-w-40 items-center rounded-lg border border-[#d1d5db] bg-white transition-colors hover:border-[#9ca3af] focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/15">
                    <svg
                        className="pointer-events-none absolute left-3 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <select
                        id="site-language"
                        aria-label="Select Language"
                        defaultValue=""
                        onChange={(event) => translateCurrentPage(event.target.value)}
                        className="h-full w-full cursor-pointer appearance-none rounded-lg bg-transparent py-2 pl-10 pr-3 text-sm text-gray-800 outline-none"
                    >
                        <option value="" disabled>Select Language</option>
                        {translationLanguages.map((language) => (
                            <option key={language.code} value={language.code}>{language.flag} {language.name}</option>
                        ))}
                    </select>
                </div>

                {suggestedLanguage && (
                    <aside
                        aria-live="polite"
                        aria-labelledby="language-suggestion-title"
                        className="absolute right-4 top-full z-50 mt-2 w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-[#dce5eb] bg-white p-4 text-[#122d42] shadow-xl sm:right-6"
                    >
                        <p id="language-suggestion-title" className="text-sm leading-6">
                            Based on your approximate location, would you like to view this page in {suggestedLanguage.name}?
                            You can also continue in English.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => translateCurrentPage(suggestedLanguage.code)}
                                className="btn-primary px-3 py-2 text-sm"
                            >
                                Switch to {suggestedLanguage.name}
                            </button>
                            <button type="button" onClick={continueInEnglish} className="btn-secondary px-3 py-2 text-sm">
                                Continue in English
                            </button>
                        </div>
                    </aside>
                )}

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
