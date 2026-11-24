'use client';

import { useEffect, useState } from 'react';

type Cohort = {
    id: string;
    code: string;
    name: string;
    capacity: number;
    participantCount: number;
};

type CohortMessage = {
    cohortId: string;
    text: string;
    isError: boolean;
};

export function CohortParticipantPanel() {
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [participantDrafts, setParticipantDrafts] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [savingCohortId, setSavingCohortId] = useState<string | null>(null);
    const [message, setMessage] = useState<CohortMessage | null>(null);

    useEffect(() => {
        let active = true;

        async function loadCohorts() {
            try {
                const response = await fetch('/api/admin/batches', { cache: 'no-store' });
                const payload = await response.json();
                if (!active) return;
                if (!response.ok || !Array.isArray(payload.data)) {
                    setLoadError(true);
                    return;
                }

                setCohorts(payload.data);
                setParticipantDrafts(Object.fromEntries(
                    payload.data.map((cohort: Cohort) => [cohort.id, String(cohort.participantCount)]),
                ));
            } catch {
                if (active) setLoadError(true);
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadCohorts();
        return () => { active = false; };
    }, []);

    async function saveParticipantCount(cohort: Cohort) {
        const participantCount = Number(participantDrafts[cohort.id]);
        if (!Number.isInteger(participantCount) || participantCount < 0 || participantCount > cohort.capacity) {
            setMessage({
                cohortId: cohort.id,
                text: `Enter a whole number from 0 to ${cohort.capacity}.`,
                isError: true,
            });
            return;
        }

        setSavingCohortId(cohort.id);
        setMessage(null);
        try {
            const response = await fetch(`/api/admin/batches/${cohort.id}/participants`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantCount }),
            });
            const payload = await response.json();
            if (!response.ok || !payload.data) {
                throw new Error(payload.message || 'Could not save participant count.');
            }

            setCohorts((current) => current.map((item) => item.id === cohort.id
                ? { ...item, participantCount: payload.data.participantCount }
                : item));
            setParticipantDrafts((current) => ({
                ...current,
                [cohort.id]: String(payload.data.participantCount),
            }));
            setMessage({ cohortId: cohort.id, text: 'Participant count saved.', isError: false });
        } catch (error) {
            setMessage({
                cohortId: cohort.id,
                text: error instanceof Error ? error.message : 'Could not save participant count.',
                isError: true,
            });
        } finally {
            setSavingCohortId(null);
        }
    }

    return (
        <section aria-labelledby="cohort-participants-heading" className="card-surface bg-white">
            <h2 id="cohort-participants-heading" className="text-2xl font-bold">Cohort participants</h2>
            <p className="mt-2 text-sm leading-6 text-[#526977]">Update the participant totals shown on the public cohort cards. Counts cannot exceed each cohort’s planned capacity.</p>
            {loading ? (
                <p className="mt-5 text-sm text-[#526977]">Loading cohort counts…</p>
            ) : loadError ? (
                <p role="alert" className="mt-5 text-sm text-red-700">Cohort counts could not be loaded. Refresh the page to try again.</p>
            ) : cohorts.length === 0 ? (
                <p role="alert" className="mt-5 text-sm text-red-700">No cohort records were returned. Refresh the page or contact an administrator.</p>
            ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {cohorts.map((cohort) => (
                        <form
                            key={cohort.id}
                            className="rounded-2xl border border-[#dce5eb] bg-[#f7fafb] p-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void saveParticipantCount(cohort);
                            }}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075b8f]">{cohort.code}</p>
                                    <h3 className="mt-1 text-lg font-bold">{cohort.name}</h3>
                                </div>
                                <span className="rounded-full bg-[#eaf2f6] px-2 py-1 text-xs font-semibold text-[#075b8f]">
                                    {cohort.participantCount}/{cohort.capacity}
                                </span>
                            </div>
                            <label className="mt-4 grid gap-1 text-sm font-medium text-[#29495d]" htmlFor={`participants-${cohort.id}`}>
                                Participant count
                                <input
                                    id={`participants-${cohort.id}`}
                                    className="h-10 rounded-lg border border-[#c7d7e1] bg-white px-3"
                                    type="number"
                                    min="0"
                                    max={cohort.capacity}
                                    step="1"
                                    value={participantDrafts[cohort.id] ?? ''}
                                    onChange={(event) => setParticipantDrafts((current) => ({
                                        ...current,
                                        [cohort.id]: event.target.value,
                                    }))}
                                    required
                                />
                            </label>
                            <button
                                className="btn-secondary mt-3 px-4 py-2"
                                type="submit"
                                disabled={savingCohortId === cohort.id}
                            >
                                {savingCohortId === cohort.id ? 'Saving…' : 'Save count'}
                            </button>
                            {message?.cohortId === cohort.id && (
                                <p aria-live="polite" className={`mt-2 text-sm ${message.isError ? 'text-red-700' : 'text-green-700'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    ))}
                </div>
            )}
        </section>
    );
}
