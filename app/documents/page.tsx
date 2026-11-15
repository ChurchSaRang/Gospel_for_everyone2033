import Link from 'next/link';
import { publicDocuments } from '@/lib/public-documents';

export default function DocumentsPage() {
    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Public documents</p>
            <h1 className="section-title mt-3">Programme resource library</h1>
            <p className="mt-4 max-w-2xl text-[#526977]">Read programme documents online or download the original Word files.</p>

            <div className="mt-10 divide-y divide-[#dce5eb] border-y border-[#dce5eb]">
                {publicDocuments.map((document) => (
                    <article key={document.slug} className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075b8f]">{document.category}</p>
                            <h2 className="mt-2 text-xl font-bold">{document.title} <span className="font-normal text-[#526977]">| {document.titleKo}</span></h2>
                            <p className="mt-2 max-w-2xl text-sm text-[#526977]">{document.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href={`/documents/${document.slug}`} className="btn-primary">Open online</Link>
                            <a href={`/public%20docs/${encodeURIComponent(document.fileName)}`} download className="btn-secondary">Download DOCX</a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}