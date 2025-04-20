'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const path = window.location.pathname;
        if (!path.includes('wait')) {
            router.push('/wait');
        }
    }, [router]);

    return <>{children}</>;
}
