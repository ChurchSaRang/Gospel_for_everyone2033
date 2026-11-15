export default function ContactPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Contact and conversation</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">We would be glad to hear from you.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">Questions about the movement, training or a payment? Choose the channel that works best for you. For payment enquiries, include your confirmation code or training ID.</p>
            </header>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
                <a href="mailto:support@gospelforeveryonemovement.com?subject=Gospel%20for%20Everyone%20enquiry" className="group border border-[#dce5eb] bg-white p-7 transition hover:border-[#075b8f] hover:shadow-[0_16px_44px_rgba(18,45,66,0.1)]">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">Email support</p>
                    <h2 className="font-display mt-4 text-3xl text-[#122d42] group-hover:text-[#075b8f]">Write to our team</h2>
                    <p className="mt-3 break-all text-[#526977]">support@gospelforeveryonemovement.com</p>
                </a>
                <a href="https://wa.me/237652047418?text=Hello%2C%20I%20would%20like%20to%20ask%20about%20the%20Gospel%20for%20Everyone%20movement." target="_blank" rel="noreferrer" className="group border border-[#dce5eb] bg-[#eaf2f6] p-7 transition hover:border-[#075b8f] hover:shadow-[0_16px_44px_rgba(18,45,66,0.1)]">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">WhatsApp</p>
                    <h2 className="font-display mt-4 text-3xl text-[#122d42] group-hover:text-[#075b8f]">Start a conversation</h2>
                    <p className="mt-3 text-[#526977]">Chat with an agent at +237 652 047 418</p>
                </a>
            </div>
        </main>
    );
}
