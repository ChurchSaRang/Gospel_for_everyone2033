import { getPublicCohorts } from '@/lib/cohort-data';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
    const batches = await getPublicCohorts();
    return (
        <main className="container-shell py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="eyebrow">Programme schedule</p>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl">Three planned cohorts. One shared calling.</h1>
                <p className="mt-5 text-lg leading-8 text-[#526977]">The dates below are the current planning schedule. They may change; selected participants should rely on the official schedule sent by the programme team.</p>
            </header>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
                {batches.map((batch) => (
                    <div key={batch.code} className="card-surface">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f07835]">{batch.timing}</p>
                        <h2 className="font-display mt-3 text-3xl">{batch.batch}</h2>
                        <p className="mt-3 text-xl font-semibold text-[#075b8f]">{batch.participantCount}/{batch.capacity}</p>
                        <p className="mt-1 text-sm text-[#526977]">participants / Seoul South Korea</p>
                        <ul className="mt-5 space-y-2 text-[#526977]">
                            {batch.schedule.map((event) => (
                                <li key={event.label}>{event.label}: {event.date}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
}
