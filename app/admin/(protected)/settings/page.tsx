export default function AdminSettingsPage() {
    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Programme settings</p>
            <h1 className="section-title mt-3">System configuration</h1>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="card-surface">
                    <h2 className="text-xl font-bold">Support fee</h2>
                    <p className="mt-4 text-[#526977]">Amount and deadline remain configurable by authorised administrators. The default value is deliberately not set in this starter build.</p>
                </div>
                <div className="card-surface">
                    <h2 className="text-xl font-bold">Payment provider</h2>
                    <p className="mt-4 text-[#526977]">Live provider integration requires credentials and secure server-side configuration before production activation.</p>
                </div>
            </div>
        </div>
    );
}
