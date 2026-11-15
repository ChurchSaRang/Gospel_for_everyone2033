import Link from 'next/link';
import { newsArticles } from '@/lib/site-data';

export default function NewsPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">News and sources</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">The story behind the shared vision.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">A small reading room for verified milestones and the ideas shaping Gospel-centred digital mission.</p>
            </header>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
                {newsArticles.map((article) => (
                    <article key={article.slug} className="flex min-h-64 flex-col border border-[#dce5eb] bg-white p-6 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">{new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <h2 className="font-display mt-4 text-3xl leading-tight text-[#122d42]">{article.title}</h2>
                        <p className="mt-4 leading-7 text-[#526977]">{article.excerpt}</p>
                        <div className="mt-auto flex flex-wrap gap-5 pt-6 text-sm font-bold">
                            <Link href={`/news/${article.slug}`} className="text-[#075b8f] underline decoration-[#f07835] underline-offset-4">Read our summary</Link>
                            <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="text-[#075b8f] underline decoration-[#f07835] underline-offset-4">Open official source</a>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
