import Image from 'next/image';
import { galleryItems } from '@/lib/site-data';

export default function GalleryPage() {
    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Gallery</p>
            <h1 className="section-title mt-3">Movement moments, training sessions and outreach</h1>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {galleryItems.map((item) => (
                    <div key={item.title} className="overflow-hidden rounded-3xl border border-[#dce5eb] bg-white shadow-sm">
                        <Image src={item.image} alt={item.title} width={800} height={640} className="h-64 w-full object-cover" />
                        <div className="p-4 font-semibold text-[#122d42]">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
