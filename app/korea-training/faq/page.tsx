import { faqs } from '@/lib/site-data';

export default function FAQPage() {
    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">FAQ</p>
            <h1 className="section-title mt-3">Frequently asked questions</h1>
            <div className="mt-8 space-y-6">
                {faqs.map((faq) => (
                    <div key={faq.question} className="card-surface">
                        <h2 className="text-xl font-bold">{faq.question}</h2>
                        <p className="mt-3 text-[#526977]">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
