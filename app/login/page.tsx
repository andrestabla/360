import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { getOrganizationSettings } from '@/app/lib/actions';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Login | Maturity 360',
    description: 'Portal de acceso seguro',
};

export default async function LoginPage() {
    const orgSettings = await getOrganizationSettings();
    const branding = (orgSettings?.branding as any) || {};

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <LoginForm branding={branding} />
        </Suspense>
    );
}
