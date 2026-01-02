'use client';

import RolesMatrix from '@/components/admin/RolesMatrix';
import AdminGuide from '@/components/AdminGuide';
import { rolesGuide } from '@/lib/adminGuides';

export default function RolesPage() {
    return (
        <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Roles y Permisos</h1>
            <RolesMatrix />
            <AdminGuide {...rolesGuide} />
        </div>
    );
}
