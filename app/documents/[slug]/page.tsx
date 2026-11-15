import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicDocument, publicDocuments } from '@/lib/public-documents';
import { readPublicDocumentText } from '@/lib/public-document-content';

export function generateStaticParams() {
    return publicDocuments.map(({ slug }) => ({ slug }));
}

export default async function DocumentReaderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const document = getPublicDocument(slug);
    if (!document) notFound();

    let text: string;
    try {
        text = await readPublicDocumentText(document.fileName);
    } catch {
        notFound();
    }

    return (
        <article className="container-shell py-16">
            <Link href="/documents" className="text-sm font-semibold text-[#075b8f] hover:underline">← All documents</Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">{document.category}</p>
            <h1 className="section-title mt-3">{document.title}</h1>
            <p className="mt-2 text-[#526977]">{document.titleKo}</p>
            <div className="mt-8 max-w-4xl border-y border-[#dce5eb] py-8">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#122d42]">{text}</pre>
            </div>
            <a href={`/public%20docs/${encodeURIComponent(document.fileName)}`} download className="btn-primary mt-8 inline-flex">Download original DOCX</a>
        </article>
    );
}