import Link from 'next/link';

export function ApplicationSummary() {
    return (
        <div className="rounded-3xl border border-[#dce5eb] bg-[#f7fafb] p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-[#eaf2f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#075b8f]">
                Application process
            </div>
            <h3 className="text-2xl font-bold text-[#122d42]">Apply for the Korea Digital Evangelism Training Programme</h3>
            <ol className="mt-6 space-y-4 text-[#122d42]">
                <li>1. Complete the application form.</li>
                <li>2. Read and agree to the programme terms and conditions.</li>
                <li>3. Submit the form and receive an acknowledgement email immediately.</li>
                <li>4. Await review within seven working days.</li>
            </ol>
            <p className="mt-5 text-sm text-[#526977]">
                Submission does not guarantee selection. Payment is required to secure a selected place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/korea-training/application" className="rounded-full bg-[#075b8f] px-5 py-3 font-semibold text-white hover:bg-[#06446a]">
                    PROCEED TO APPLICATION FORM
                </Link>
            </div>
        </div>
    );
}
