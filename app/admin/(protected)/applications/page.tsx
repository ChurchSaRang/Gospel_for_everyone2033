'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CohortParticipantPanel } from '@/components/admin/cohort-participant-panel';

type ApplicationRow = {
    id: string;
    reference: string;
    fullName: string;
    country: string | null;
    status: string;
    paymentStatus: string;
    preferredBatch: string | null;
    createdAt: string;
    confirmationCode: string | null;
};

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState('');
    const [message, setMessage] = useState('');
    const [canMarkPaymentPaid, setCanMarkPaymentPaid] = useState(false);
    const [canManageCohortParticipants, setCanManageCohortParticipants] = useState(false);
    const [search, setSearch] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        async function loadApplications() {
            try {
                const res = await fetch('/api/applications');
                const payload = await res.json();
                setApplications(payload.data ?? []);
                setCanMarkPaymentPaid(payload.canMarkPaymentPaid === true);
                setCanManageCohortParticipants(payload.canManageCohortParticipants === true);
            } catch (error) {
                console.error('Failed to load applications', error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        }

        loadApplications();
    }, []);

    async function approveApplication(applicationId: string) {
        setActionId(applicationId);
        setMessage('');
        try {
            const response = await fetch('/api/admin/applications/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId }),
            });
            const payload = await response.json();
            setMessage(payload.message || 'Application approval processed.');
            if (response.ok) {
                const refreshed = await fetch('/api/applications');
                const refreshedPayload = await refreshed.json();
                setApplications(refreshedPayload.data ?? []);
                setCanMarkPaymentPaid(refreshedPayload.canMarkPaymentPaid === true);
                setCanManageCohortParticipants(refreshedPayload.canManageCohortParticipants === true);
            }
        } catch {
            setMessage('Could not complete the approval action. Please try again.');
        } finally {
            setActionId('');
        }
    }

    async function rejectApplication(applicationId: string) {
        setActionId(applicationId);
        setMessage('');
        try {
            const response = await fetch('/api/admin/applications/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId }),
            });
            const payload = await response.json();
            setMessage(payload.message || 'Application rejected.');
            if (response.ok) {
                const refreshed = await fetch('/api/applications');
                const refreshedPayload = await refreshed.json();
                setApplications(refreshedPayload.data ?? []);
                setCanMarkPaymentPaid(refreshedPayload.canMarkPaymentPaid === true);
                setCanManageCohortParticipants(refreshedPayload.canManageCohortParticipants === true);
            }
        } catch {
            setMessage('Could not reject the application. Please try again.');
        } finally {
            setActionId('');
        }
    }

    async function markPaymentPaid(application: ApplicationRow) {
        const code = application.confirmationCode ? ` (ID: ${application.confirmationCode})` : '';
        if (!window.confirm(`Confirm that you reviewed the receipt and verified the funds for ${application.fullName}${code}?`)) {
            return;
        }

        setActionId(application.id);
        setMessage('');
        try {
            const response = await fetch('/api/admin/payments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: application.id, status: 'SUCCESSFUL' }),
            });
            const payload = await response.json();
            setMessage(payload.message || 'Payment confirmation processed.');
            if (response.ok) {
                const refreshed = await fetch('/api/applications');
                const refreshedPayload = await refreshed.json();
                setApplications(refreshedPayload.data ?? []);
                setCanMarkPaymentPaid(refreshedPayload.canMarkPaymentPaid === true);
                setCanManageCohortParticipants(refreshedPayload.canManageCohortParticipants === true);
            }
        } catch {
            setMessage('Could not mark the payment as paid. Please try again.');
        } finally {
            setActionId('');
        }
    }

    const countries = [...new Set(applications.map((application) => application.country).filter((country): country is string => Boolean(country)))].sort((left, right) => left.localeCompare(right));
    const statuses = [...new Set(applications.map((application) => application.status))].sort();
    const paymentStatuses = [...new Set(applications.map((application) => application.paymentStatus))].sort();
    const normalizedSearch = search.trim().toLowerCase();
    const filteredApplications = applications.filter((application) => (
        (!normalizedSearch || application.fullName.toLowerCase().includes(normalizedSearch) || application.reference.toLowerCase().includes(normalizedSearch) || application.confirmationCode?.toLowerCase().includes(normalizedSearch))
        && (!countryFilter || application.country === countryFilter)
        && (!statusFilter || application.status === statusFilter)
        && (!paymentFilter || application.paymentStatus === paymentFilter)
    ));
    const sortedApplications = [...filteredApplications].sort((left, right) => {
        if (sortBy === 'name') return left.fullName.localeCompare(right.fullName);
        if (sortBy === 'country') return (left.country || '').localeCompare(right.country || '');
        if (sortBy === 'status') return left.status.localeCompare(right.status);
        if (sortBy === 'payment') return left.paymentStatus.localeCompare(right.paymentStatus);
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    function clearFilters() {
        setSearch('');
        setCountryFilter('');
        setStatusFilter('');
        setPaymentFilter('');
        setSortBy('newest');
    }

    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Applications</p>
            <h1 className="section-title mt-3">Application review</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526977]">Search applicants, narrow the list by country or status, and sort records for review.</p>
            {canManageCohortParticipants && (
                <div className="mt-7">
                    <CohortParticipantPanel />
                </div>
            )}
            {message && <p role="status" className="mt-4 rounded-xl border border-[#dce5eb] bg-white p-3 text-sm text-[#122d42]">{message}</p>}
            <section aria-label="Search and filter applicants" className="mt-7 grid gap-3 rounded-lg border border-[#dce5eb] bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <label className="text-xs font-semibold text-[#526977]">
                    Search name, reference or confirmation ID
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Type to search" className="mt-1.5 h-10 w-full rounded-md border border-[#b8cbd7] bg-white px-3 text-sm text-[#122d42]" />
                </label>
                <label className="text-xs font-semibold text-[#526977]">
                    Country
                    <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-[#b8cbd7] bg-white px-3 text-sm text-[#122d42]">
                        <option value="">All countries</option>
                        {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-[#526977]">
                    Application status
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-[#b8cbd7] bg-white px-3 text-sm text-[#122d42]">
                        <option value="">All statuses</option>
                        {statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-[#526977]">
                    Payment status
                    <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-[#b8cbd7] bg-white px-3 text-sm text-[#122d42]">
                        <option value="">All payments</option>
                        {paymentStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-[#526977]">
                    Sort by
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-[#b8cbd7] bg-white px-3 text-sm text-[#122d42]">
                        <option value="newest">Newest first</option>
                        <option value="name">Name</option>
                        <option value="country">Country</option>
                        <option value="status">Application status</option>
                        <option value="payment">Payment status</option>
                    </select>
                </label>
                <button type="button" onClick={clearFilters} className="btn-secondary self-end px-3 py-2 text-sm">Clear filters</button>
            </section>
            <p aria-live="polite" className="mt-3 text-xs text-[#526977]">Showing {sortedApplications.length} of {applications.length} applicants</p>

            <div className="mt-4 overflow-x-auto card-surface">
                {loading ? (
                    <p className="p-4 text-sm text-[#526977]">Loading applications…</p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#f7fafb] text-[#075b8f]">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Country</th>
                                <th className="p-3">Batch</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Reference</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-[#526977]">{applications.length ? 'No applicants match these filters.' : 'No applications yet.'}</td>
                                </tr>
                            ) : (
                                sortedApplications.map((item) => (
                                    <tr key={item.id} className="border-t border-[#dce5eb]">
                                        <td className="p-3">
                                            <Link href={`/admin/applications/${item.id}`} className="font-semibold text-[#075b8f] hover:underline">
                                                {item.fullName}
                                            </Link>
                                        </td>
                                        <td className="p-3">{item.country || '—'}</td>
                                        <td className="p-3">{item.preferredBatch || 'No preference'}</td>
                                        <td className="p-3">{item.status}</td>
                                        <td className="p-3">
                                            <span>{item.paymentStatus}</span>
                                            {canMarkPaymentPaid && item.status === 'APPROVED' && item.paymentStatus !== 'SUCCESSFUL' && (
                                                <button
                                                    type="button"
                                                    onClick={() => markPaymentPaid(item)}
                                                    disabled={actionId === item.id}
                                                    title="Mark paid after verifying the receipt and funds"
                                                    aria-label={`Mark payment as paid for ${item.fullName}`}
                                                    className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                                                >
                                                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-3">{item.reference}</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-2">
                                                {item.status === 'REJECTED' ? (
                                                    <span className="text-xs text-[#526977]">Rejected</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => approveApplication(item.id)}
                                                        disabled={actionId === item.id}
                                                        className="btn-primary whitespace-nowrap px-3 py-2 text-xs disabled:opacity-60"
                                                    >
                                                        {actionId === item.id ? 'Sending...' : item.status === 'APPROVED' ? 'Retry email' : 'Approve & email'}
                                                    </button>
                                                )}
                                                {item.status !== 'REJECTED' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => rejectApplication(item.id)}
                                                        disabled={actionId === item.id}
                                                        className="btn-secondary whitespace-nowrap px-3 py-2 text-xs disabled:opacity-60"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
