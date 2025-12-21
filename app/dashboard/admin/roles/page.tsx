'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PERMISSIONS, Permission } from '@/lib/data';
import { ShieldCheck, CheckSquare, Square } from '@phosphor-icons/react';
import AdminGuide from '@/components/AdminGuide';
import { rolesGuide } from '@/lib/adminGuides';

const LEVELS = [
    { level: 1, label: 'Nivel 1 (Admin Tenant)' },
    { level: 2, label: 'Nivel 2 (Jefe Área)' },
    { level: 3, label: 'Nivel 3 (Analista Sr)' },
    { level: 4, label: 'Nivel 4 (Analista Jr)' },
    { level: 5, label: 'Nivel 5 (Asistente)' },
    { level: 6, label: 'Nivel 6 (Operativo)' },
];

const PERMISSION_LABELS: Record<string, string> = {
    MANAGE_TENANT: 'Gestionar Configuración Tenant',
    MANAGE_UNITS: 'Gestionar Unidades Org.',
    MANAGE_USERS: 'Gestionar Usuarios',
    VIEW_ALL_DOCS: 'Ver Documentos Globales',
    UPLOAD_DOCS: 'Cargar Documentos',
    DELETE_DOCS: 'Eliminar Documentos',
    VIEW_AUDIT: 'Ver Auditoría'
};

export default function RolesPage() {
    const { currentUser, currentTenant, updateLevelPermissions } = useApp();
    const [templates, setTemplates] = useState<Record<number, string[]>>({});
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (currentTenant) {
            setTemplates(currentTenant.roleTemplates);
        }
    }, [currentTenant]);

    if (!currentUser || currentUser.level !== 1) {
        return <div className="p-8 text-center text-red-500">Acceso Denegado. Solo Admin Tenant.</div>;
    }

    if (!currentTenant) return <div>Loading...</div>;

    const togglePermission = (level: number, permission: string) => {
        if (level === 1) return; // Cannot modify admin

        const currentPerms = templates[level] || [];
        const hasIt = currentPerms.includes(permission);

        let newPerms;
        if (hasIt) {
            newPerms = currentPerms.filter(p => p !== permission);
        } else {
            newPerms = [...currentPerms, permission];
        }

        // Update local state and DB via context
        const newTemplates = { ...templates, [level]: newPerms };
        setTemplates(newTemplates);
        updateLevelPermissions(level, newPerms);

        setMessage('Permisos actualizados.');
        setTimeout(() => setMessage(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" /> Roles y Permisos
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Configura qué acciones puede realizar cada nivel jerárquico.</p>
                </div>
            </div>

            {message && (
                <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-bounce">
                    {message}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4 sticky left-0 bg-slate-50 z-10">Permiso</th>
                            {LEVELS.map(l => (
                                <th key={l.level} className="px-6 py-4 text-center min-w-[120px]">
                                    <div className="flex flex-col items-center">
                                        <span className="text-slate-800">{l.label.split('(')[0]}</span>
                                        <span className="text-[9px] normal-case opacity-75">{l.label.split('(')[1].replace(')', '')}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Object.keys(PERMISSIONS).map(permKey => (
                            <tr key={permKey} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50">
                                    {PERMISSION_LABELS[permKey] || permKey}
                                </td>
                                {LEVELS.map(l => {
                                    const isChecked = (templates[l.level] || []).includes(permKey);
                                    const isDisabled = l.level === 1;

                                    return (
                                        <td key={l.level} className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => togglePermission(l.level, permKey)}
                                                disabled={isDisabled}
                                                className={`p-1 rounded transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                            >
                                                {isChecked ? (
                                                    <CheckSquare size={24} weight="fill" className={isDisabled ? 'text-slate-400' : 'text-blue-600'} />
                                                ) : (
                                                    <Square size={24} className="text-slate-300 hover:text-slate-400" />
                                                )}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Guide */}
            <AdminGuide {...rolesGuide} />
        </div>
    );
}
