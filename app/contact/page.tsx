const emailContacts = [
    { email: 'support@gospelforeveryonemovement.com', purpose: 'For General Support' },
    { email: 'applications@gospelforeveryonemovement.com', purpose: 'For Application Support' },
    { email: 'info@gospelforeveryonemovement.com', purpose: 'For Enquiries' },
    { email: 'donations@gospelforeveryonemovement.com', purpose: 'For Donations' },
    { email: 'payments@gospelforeveryonemovement.com', purpose: 'For Payment Issues' },
];

function EmailIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-16 w-16">
            <path fill="#25D366" d="M24 3.5C12.8 3.5 3.7 12.3 3.7 23.2c0 3.7 1.1 7.2 3.3 10.2L4.8 44l11-2.8c2.5 1.3 5.3 2 8.2 2 11.2 0 20.3-8.8 20.3-19.7S35.2 3.5 24 3.5Z" />
            <path fill="#fff" d="M17.2 12.7c-.5 0-1 .2-1.4.7-.5.5-1.8 1.8-1.8 4.5s1.8 5.2 2.1 5.6c.2.3 3.5 5.5 8.5 7.5 4.2 1.7 5 .9 5.9.8.9-.1 3-.1 3.4-1.9.4-.9 1.1-1.9 1.1-2.3 0-.4-.2-.5-.6-.7s-3-1.4-3.4-1.5c-.5-.2-.8-.3-1.1.2-.3.4-1.3 1.5-1.5 1.8-.3.3-.6.4-1 .1s-1.9-.7-3.7-2.2c-1.4-1.2-2.4-2.7-2.7-3.1-.3-.4 0-.7.2-.9.2-.2.4-.5.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-1.3-3.2-1.8-4.3-.5-1.2-1-1.2-1.4-1.2h-1Z" />
        </svg>
    );
}

function KakaoTalkIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-16 w-16">
            <path fill="#FEE500" d="M24 5C13.5 5 5 11.9 5 20.4c0 5.3 3.5 10 8.8 12.7L11.5 42l9.3-5.2c1 .2 2.1.3 3.2.3 10.5 0 19-6.9 19-15.4S34.5 5 24 5Z" />
            <text x="24" y="24" fill="#191919" fontSize="7" fontWeight="700" textAnchor="middle">TALK</text>
        </svg>
    );
}

export default function ContactPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Contact and conversation</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">We would be glad to hear from you.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">Questions about the movement, training or a payment? Choose the channel that works best for you. For payment enquiries, include your confirmation code or training ID.</p>
            </header>
            <div className="mt-9 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="border border-[#dce5eb] bg-white p-7 sm:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Email us</p>
                    <h2 className="font-display mt-4 text-3xl text-[#122d42]">Choose the right team.</h2>
                    <ul className="mt-6 divide-y divide-[#dce5eb]">
                        {emailContacts.map(({ email, purpose }) => (
                            <li key={email}>
                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-4 py-4 text-[#122d42] transition hover:text-[#075b8f]"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf2f6] text-[#075b8f]">
                                        <EmailIcon />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block break-all font-semibold">{email}</span>
                                        <span className="mt-1 block text-sm text-[#526977]">{purpose}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="bg-[#102a43] p-7 text-white sm:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffbe78]">Direct messaging</p>
                    <h2 className="font-display mt-4 text-3xl">Start a chat with an agent.</h2>
                    <p className="mt-3 leading-7 text-white/80">Choose a messaging app to continue your conversation.</p>
                    <div className="mt-7 flex items-center gap-5">
                        <a
                            href="https://wa.me/237652047418?text=Hello%2C%20I%20would%20like%20to%20ask%20about%20the%20Gospel%20for%20Everyone%20movement."
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat with an agent on WhatsApp"
                            title="WhatsApp"
                            className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
                        >
                            <WhatsAppIcon />
                        </a>
                        <a
                            href="https://open.kakao.com/o/s6nlmwYi"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat with an agent on KakaoTalk"
                            title="KakaoTalk"
                            className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FEE500]"
                        >
                            <KakaoTalkIcon />
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
