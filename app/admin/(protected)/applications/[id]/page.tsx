'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ApplicantDetail = {
    id: string;
    reference: string;
    status: string;
    paymentStatus: string;
    preferredBatch: string | null;
    batchAssignmentState: string;
    confirmationCode: string | null;
    batchId: string | null;
    batchName: string | null;
    submittedAt: string;
    applicant: {
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        country: string | null;
        age: number | null;
    };
    submissionData: {
        firstName: string;
        middleName: string;
        lastName: string;
        preferredBatch: string | null;
    };
};

export default function ApplicantDetailPage() {
    const params = useParams<{ id: string }>();
    const [application, setApplication] = useState<ApplicantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadApplication() {
            try {
                const response = await fetch(`/api/admin/applications/${params.id}`);
                const payload = await response.json();
                if (!response.ok) {
                    throw new Error(payload.message || 'Application not found.');
                }
                setApplication(payload.data ?? null);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : 'Unable to load application.');
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            loadApplication();
        }
    }, [params.id]);

    if (loading) {
        return <div className="container-shell py-16 text-[#526977]">Loading application…</div>;
    }

    if (error || !application) {
        return (
            <div className="container-shell py-16">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Application review</p>
                <h1 className="section-title mt-3">No application found</h1>
                <p className="mt-4 text-[#526977]">{error || 'This application could not be loaded.'}</p>
                <Link href="/admin/applications" className="btn-secondary mt-6 inline-flex">Back to applications</Link>
            </div>
        );
    }

    return (
        <div className="container-shell py-16">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Application details</p>
                    <h1 className="section-title mt-3">{application.applicant.fullName}</h1>
                </div>
                <Link href="/admin/applications" className="btn-secondary inline-flex">Back to list</Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="card-surface bg-white">
                    <h2 className="text-2xl font-bold">Applicant information</h2>
                    <div className="mt-5 space-y-3 text-sm text-[#122d42]">
                        <div><strong>Reference:</strong> {application.reference}</div>
                        <div><strong>Email:</strong> {application.applicant.email}</div>
                        <div><strong>Phone:</strong> {application.applicant.phone || 'Not provided'}</div>
                        <div><strong>Country:</strong> {application.applicant.country || 'Not provided'}</div>
                        <div><strong>Age:</strong> {application.applicant.age ?? 'Not provided'}</div>
                    </div>
                </div>

                <div className="card-surface bg-[#f7fafb]">
                    <h2 className="text-2xl font-bold">Application status</h2>
                    <div className="mt-5 space-y-3 text-sm text-[#122d42]">
                        <div><strong>Status:</strong> {application.status}</div>
                        <div><strong>Payment status:</strong> {application.paymentStatus === 'SUCCESSFUL' ? 'Paid' : application.paymentStatus === 'PENDING' ? 'Not paid yet' : application.paymentStatus || 'Not paid yet'}</div>
                        <div><strong>Batch preference:</strong> {application.preferredBatch || 'Not selected yet'}</div>
                        <div><strong>Batch ID:</strong> {application.batchId || 'Not assigned yet'}</div>
                        <div><strong>Batch:</strong> {application.batchName || 'Not assigned yet'}</div>
                        <div><strong>Batch assignment state:</strong> {application.batchAssignmentState}</div>
                        <div><strong>Confirmation code:</strong> {application.confirmationCode || 'Not issued yet'}</div>
                        <div><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
