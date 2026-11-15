'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CohortParticipantPanel } from '@/components/admin/cohort-participant-panel';

type AppSummary = {
    id: string;
    reference: string;
    fullName: string;
    country: string | null;
    status: string;
    paymentStatus: string;
    preferredBatch: string | null;
    createdAt: string;
};

type OverviewResponse = {
    totalApplications: number;
    pendingPayments: number;
    successfulPayments: number;
    assignedApplicants: number;
    recentApplications: AppSummary[];
};

export default function AdminDashboardPage() {
    const [overview, setOverview] = useState<OverviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadOverview() {
            try {
                const response = await fetch('/api/admin/overview');
                const payload = await response.json();
                if (!active) return;
                setOverview(payload.data ?? null);
                setLoadError(!response.ok || !payload.data);
            } catch {
                if (active) setLoadError(true);
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadOverview();
        return () => { active = false; };
    }, []);

    if (loading) {
        return <div className="container-shell py-16 text-[#526977]">Loading dashboard…</div>;
    }

    if (loadError || !overview) {
        return <div role="alert" className="container-shell py-16 text-[#526977]">The dashboard could not be loaded. Refresh the page to try again.</div>;
    }

    const stats = [
        { label: 'Total applications', value: overview.totalApplications },
        { label: 'Pending payments', value: overview.pendingPayments },
        { label: 'Successful payments', value: overview.successfulPayments },
        { label: 'Assigned applicants', value: overview.assignedApplicants },
    ];

    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Admin dashboard</p>
            <h1 className="section-title mt-3">Operational overview</h1>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.label} className="card-surface bg-white">
                        <p className="text-sm uppercase tracking-[0.16em] text-[#075b8f]">{item.label}</p>
                        <div className="mt-4 text-3xl font-black text-[#122d42]">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <CohortParticipantPanel />
            </div>

            <div className="mt-10 card-surface bg-white">
                    <h2 className="text-2xl font-bold">Recent applicants</h2>
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-[#f7fafb] text-[#075b8f]">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Country</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Payment</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overview.recentApplications.map((app) => (
                                    <tr key={app.id} className="border-t border-[#dce5eb]">
                                        <td className="p-3">
                                            <div className="font-semibold">{app.fullName}</div>
                                            <div className="text-xs text-[#526977]">{app.reference}</div>
                                        </td>
                                        <td className="p-3">{app.country || '—'}</td>
                                        <td className="p-3">{app.status}</td>
                                        <td className="p-3">{app.paymentStatus}</td>
                                        <td className="p-3">
                                            <Link href={`/admin/applications/${app.id}`} className="btn-secondary inline-flex px-3 py-2 text-xs">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
}
