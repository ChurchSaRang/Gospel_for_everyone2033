import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
    return (
        <footer className="border-t border-[#29495d] bg-[#102a43] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:px-8">
                <div>
                    <Image
                        src="/public%20pictures/Gospel%20for%20everyone%20logo.png"
                        alt="Gospel for Everyone"
                        width={144}
                        height={98}
                        className="mb-5 h-16 w-28 object-contain"
                    />
                    <p className="max-w-sm text-sm leading-7 text-white/75">
                        Every believer can be a faithful witness. Together, we pray, create and disciple across neighbourhoods and digital spaces.
                    </p>
                    <p className="mt-5 border-l-2 border-[#f07835] pl-3 text-sm text-white/85">Romans 10:14 · A call to make the good news known</p>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Explore</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/mission">Mission</Link></li>
                        <li><Link href="/partners">Partners</Link></li>
                        <li><Link href="/impact">Impact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Programme</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li><Link href="/korea-training">Korea Training</Link></li>
                        <li><Link href="/korea-training/application">Apply</Link></li>
                        <li><Link href="/korea-training/status">Status</Link></li>
                        <li><Link href="/documents">Programme documents</Link></li>
                        <li><Link href="/donate">Donate</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Contact and policy</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-use">Website Terms</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><a href="mailto:support@gospelforeveryonemovement.com">Email support</a></li>
                        <li><a href="https://worldea.org/global-church-mobilizes-as-wea-convenes-historic-seoul-assembly/" target="_blank" rel="noreferrer">WEA Seoul Assembly</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/15 py-5 text-center text-sm text-white/65">
                © 2026 Gospel for Everyone by 2033. All rights reserved.
            </div>
        </footer>
    );
}
