import { programmeTopics } from '@/lib/site-data';

export default function CurriculumPage() {
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Curriculum</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">A practical craft, formed by a deeper calling.</h1>
                <p className="mt-6 text-lg leading-8 text-[#526977]">The learning areas connect biblical conviction with creative practice, so digital communication serves people rather than replacing relationships.</p>
            </header>
            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {programmeTopics.map((topic) => (
                    <div key={topic} className="flex min-h-36 items-start gap-4 border border-[#dce5eb] bg-white p-5 sm:p-6">
                        <span className="font-display text-2xl text-[#f07835]">{String(programmeTopics.indexOf(topic) + 1).padStart(2, '0')}</span>
                        <p className="font-semibold leading-7 text-[#29495d]">{topic}</p>
                    </div>
                ))}
            </div>
            <p className="mt-8 max-w-3xl border-l-4 border-[#36aebd] bg-[#eaf2f6] p-5 leading-7 text-[#526977]">Throughout, the measure of good communication is not just reach. It is truth told with grace, care for the listener, and a clear path toward community.</p>
        </main>
    );
}
