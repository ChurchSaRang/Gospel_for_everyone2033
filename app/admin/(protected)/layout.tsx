import { requireAdminSession } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAdminSession();

    return (
        <div className="container-shell py-8">
            <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#dce5eb] bg-white p-4 shadow-sm">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Admin portal</p>
                    <p className="mt-1 text-sm text-[#526977]">Signed in as {session.name || session.email}</p>
                </div>

                <form action="/api/admin/logout" method="POST">
                    <button type="submit" className="btn-secondary">Logout</button>
                </form>
            </div>

            {children}
        </div>
    );
}