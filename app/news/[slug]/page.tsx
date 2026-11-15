import { notFound } from 'next/navigation';
import { newsArticles } from '@/lib/site-data';

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
    const article = newsArticles.find((item) => item.slug === params.slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="container-shell py-14 sm:py-20">
            <article className="max-w-3xl">
                <p className="eyebrow">Verified context</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">{article.title}</h1>
                <p className="mt-5 text-sm font-semibold text-[#526977]">{new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <div className="mt-8 space-y-6 text-lg leading-8 text-[#526977]">
                    <p>{article.excerpt}</p>
                    <p>The Seoul gathering connected the Great Commission to the realities of a changing world: faithful discipleship, global partnership, digital evangelism and the ethical use of emerging technologies.</p>
                    <p>For this movement, that context strengthens a practical invitation: use every appropriate space to serve people, share the hope of Christ and connect seekers with caring Christian community.</p>
                </div>
                <a className="mt-8 inline-flex font-bold text-[#075b8f] underline decoration-[#f07835] underline-offset-4" href={article.sourceUrl} target="_blank" rel="noreferrer">Read the original source</a>
            </article>
        </main>
    );
}
