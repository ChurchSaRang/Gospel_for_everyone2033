import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicDocument } from '@/lib/public-documents';
import { readPublicDocumentText } from '@/lib/public-document-content';

export default async function KoreaTermsPage() {
    const document = getPublicDocument('training-terms');
    if (!document) notFound();

    const termsText = await readPublicDocumentText(document.fileName);

    return (
        <main className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Terms and conditions</p>
            <h1 className="section-title mt-3">{document.title}</h1>
            <p className="mt-2 text-[#526977]">{document.titleKo}</p>
            <p className="mt-5 max-w-4xl text-sm leading-6 text-[#526977]">Please read the full programme terms before submitting your application. The Batch A dates below reflect the confirmed 30-day schedule.</p>
            <article className="mt-8 max-w-5xl border-y border-[#dce5eb] py-8">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#122d42]">{termsText}</pre>
            </article>
            <Link href="/korea-training/application" className="btn-primary mt-8 inline-flex">Return to application</Link>
        </main>
    );
}
