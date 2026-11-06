'use client';

import { ServiceCard } from '@/components/ServiceCard';
import { services } from '@/lib/data';

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-center font-headline text-3xl font-bold">Our Services</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </div>
    );
}
