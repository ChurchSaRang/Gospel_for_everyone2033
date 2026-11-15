'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError('');

        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const payload = await response.json();

        if (!response.ok) {
            setError(payload.message || 'Login failed.');
            setLoading(false);
            return;
        }

        router.push('/admin/applications');
        router.refresh();
    }

    return (
        <div className="container-shell py-16">
            <div className="mx-auto max-w-lg card-surface bg-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Admin login</p>
                <h1 className="section-title mt-3">Secure access</h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <label className="block text-sm font-medium text-[#122d42]">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-2 w-full rounded-xl border border-[#b8cbd7] bg-white p-3"
                            placeholder="Enter your admin email"
                            required
                        />
                    </label>
                    <label className="block text-sm font-medium text-[#122d42]">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 w-full rounded-xl border border-[#b8cbd7] bg-white p-3"
                            placeholder="Enter your password"
                            required
                        />
                    </label>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
                    )}

                    <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
