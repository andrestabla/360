'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, CheckSquare, Square, CaretDown, CaretRight } from '@phosphor-icons/react';
import { PERMISSIONS, Permission } from '@/lib/data';
import { getRolePermissionsAction, updateRolePermissionsAction, resetRolePermissionsAction } from '@/app/actions/roleActions';
import { toast } from 'react-hot-toast';
const LEVELS = [
    { level: 1, label: 'Nivel 1 (Admin Tenant)' },
    { level: 2, label: 'Nivel 2 (Jefe Área)' },
    { level: 3, label: 'Nivel 3 (Analista Sr)' },
    { level: 4, label: 'Nivel 4 (Analista Jr)' },
    { level: 5, label: 'Nivel 5 (Asistente)' },
    { level: 6, label: 'Nivel 6 (Operativo)' },
];

const PERMISSION_LABELS: Record<string, string> = {
    // Admin
    ACCESS_ADMIN_PANEL: 'Acceder Panel Admin',
    MANAGE_ORG_SETTINGS: 'Configuración Organización',
    MANAGE_SUBSCRIPTION: 'Gestionar Suscripción',
    VIEW_AUDIT_LOGS: 'Ver Auditoría',
    // Users
    VIEW_USERS: 'Ver Usuarios',
    CREATE_USERS: 'Crear Usuarios',
    EDIT_USERS: 'Editar Usuarios',
    DELETE_USERS: 'Eliminar Usuarios',
    MANAGE_ROLES: 'Gestionar Roles',
    IMPERSONATE_USERS: 'Suplantar Identidad',
    // Repository
    VIEW_REPOSITORY: 'Ver Repositorio',
    CREATE_FOLDERS: 'Crear Carpetas',
    UPLOAD_DOCUMENTS: 'Subir Documentos',
    EDIT_DOCUMENTS: 'Editar Documentos',
    DELETE_DOCUMENTS: 'Eliminar Documentos',
    SHARE_DOCUMENTS: 'Compartir Documentos',
    // Workflows
    VIEW_WORKFLOWS: 'Ver Flujos',
    CREATE_PROJECTS: 'Crear Proyectos',
    EDIT_PROJECTS: 'Editar Proyectos',
    DELETE_PROJECTS: 'Eliminar Proyectos',
    MANAGE_TEMPLATES: 'Gestionar Plantillas',
    // Chat
    ACCESS_CHAT: 'Acceder Chat',
    BROADCAST_MESSAGES: 'Enviar Difusión',
    // Analytics
    VIEW_ANALYTICS: 'Ver Analíticas',
    EXPORT_REPORTS: 'Exportar Reportes',
    // Surveys
    MANAGE_SURVEYS: 'Gestionar Encuestas',
    CREATE_SURVEYS: 'Crear Encuestas',
    VIEW_SURVEY_RESULTS: 'Ver Resultados',
    RESPOND_SURVEYS: 'Responder Encuestas'
};

const PERMISSION_GROUPS = [
    {
        title: 'Administración',
        permissions: ['ACCESS_ADMIN_PANEL', 'MANAGE_ORG_SETTINGS', 'MANAGE_SUBSCRIPTION', 'VIEW_AUDIT_LOGS']
    },
    {
        title: 'Usuarios',
        permissions: ['VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'DELETE_USERS', 'MANAGE_ROLES', 'IMPERSONATE_USERS']
    },
    {
        title: 'Repositorio Documental',
        permissions: ['VIEW_REPOSITORY', 'CREATE_FOLDERS', 'UPLOAD_DOCUMENTS', 'EDIT_DOCUMENTS', 'DELETE_DOCUMENTS', 'SHARE_DOCUMENTS']
    },
    {
        title: 'Gestión de Proyectos',
        permissions: ['VIEW_WORKFLOWS', 'CREATE_PROJECTS', 'EDIT_PROJECTS', 'DELETE_PROJECTS', 'MANAGE_TEMPLATES']
    },
    {
        title: 'Comunicación',
        permissions: ['ACCESS_CHAT', 'BROADCAST_MESSAGES']
    },
    {
        title: 'Encuestas',
        permissions: ['MANAGE_SURVEYS', 'CREATE_SURVEYS', 'VIEW_SURVEY_RESULTS', 'RESPOND_SURVEYS']
    },
    {
        title: 'Analítica',
        permissions: ['VIEW_ANALYTICS', 'EXPORT_REPORTS']
    }
];

const DEFAULT_DEFAULTS: Record<number, string[]> = {
    1: PERMISSIONS as string[], // Admin gets everything
    2: ['VIEW_USERS', 'VIEW_REPOSITORY', 'CREATE_FOLDERS', 'UPLOAD_DOCUMENTS', 'EDIT_DOCUMENTS', 'VIEW_WORKFLOWS', 'CREATE_PROJECTS', 'EDIT_PROJECTS', 'ACCESS_CHAT', 'VIEW_ANALYTICS', 'MANAGE_SURVEYS', 'CREATE_SURVEYS', 'VIEW_SURVEY_RESULTS', 'RESPOND_SURVEYS'],
    3: ['VIEW_REPOSITORY', 'UPLOAD_DOCUMENTS', 'EDIT_DOCUMENTS', 'VIEW_WORKFLOWS', 'CREATE_PROJECTS', 'ACCESS_CHAT', 'RESPOND_SURVEYS', 'VIEW_SURVEY_RESULTS'],
    4: ['VIEW_REPOSITORY', 'UPLOAD_DOCUMENTS', 'VIEW_WORKFLOWS', 'ACCESS_CHAT', 'RESPOND_SURVEYS'],
    5: ['VIEW_REPOSITORY', 'ACCESS_CHAT', 'RESPOND_SURVEYS'],
    6: ['VIEW_REPOSITORY', 'RESPOND_SURVEYS']
};

export default function RolesMatrix() {
    const { currentUser, isSuperAdmin } = useApp();
    const [templates, setTemplates] = useState<Record<number, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
        PERMISSION_GROUPS.reduce((acc, g) => ({ ...acc, [g.title]: true }), {})
    );

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        setLoading(true);
        const res = await getRolePermissionsAction();
        if (res.success) {
            const serverData = res.data || {};
            // Merge defaults: Use server data if present, otherwise default
            const mergedTemplates: Record<number, string[]> = {};

            for (const levelStr of Object.keys(DEFAULT_DEFAULTS)) {
                const level = parseInt(levelStr);
                // If server has data for this level (even empty array), use it.
                // If undefined, use default.
                if (serverData[level] !== undefined) {
                    mergedTemplates[level] = serverData[level];
                } else {
                    mergedTemplates[level] = DEFAULT_DEFAULTS[level];
                }
            }

            setTemplates(mergedTemplates);
        }
        setLoading(false);
    };

    const isAdmin = isSuperAdmin || (currentUser && (currentUser.level === 1 || currentUser.role?.toLowerCase().includes('admin')));

    if (!isAdmin) {
        return <div className="p-8 text-center text-red-500">Acceso Denegado. Solo Admin Tenant.</div>;
    }

    const togglePermission = async (level: number, permission: string) => {
        if (level === 1) {
            toast.error("El Administrador siempre debe tener todos los permisos");
            return;
        }

        const currentPerms = templates[level] || [];
        const hasIt = currentPerms.includes(permission);

        let newPerms;
        if (hasIt) {
            newPerms = currentPerms.filter(p => p !== permission);
        } else {
            newPerms = [...currentPerms, permission];
        }

        // Optimistic UI
        const newTemplates = { ...templates, [level]: newPerms };
        setTemplates(newTemplates);

        // Server Update
        const res = await updateRolePermissionsAction(level, newPerms);
        if (res.success) {
            // Toast removed to reduce noise on rapid clicks, or keep succinct
        } else {
            toast.error('Error al guardar');
            loadPermissions(); // Revert
        }
    };

    const toggleGroup = (title: string) => {
        setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleResetDefaults = async () => {
        if (!confirm('¿Estás seguro de restablecer los permisos a la configuración recomendada? Esto sobrescribirá los cambios actuales.')) return;

        setTemplates(DEFAULT_DEFAULTS);

        const res = await resetRolePermissionsAction(DEFAULT_DEFAULTS);
        if (res.success) {
            toast.success("Permisos restablecidos");
        } else {
            toast.error("Error al restablecer permisos");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" size={20} /> Matriz de Permisos
                </h3>
                <div className="flex gap-2">
                    <button onClick={handleResetDefaults} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Restablecer Recomendados
                    </button>
                    <button onClick={() => loadPermissions()} className="text-xs text-blue-600 hover:text-blue-800 underline px-2">
                        Refrescar
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 sticky left-0 bg-slate-50 z-20 w-1/3 min-w-[200px] border-r border-slate-200">Módulo / Permiso</th>
                            {LEVELS.map(l => (
                                <th key={l.level} className="px-4 py-4 text-center min-w-[120px] border-b border-slate-200">
                                    <div className="flex flex-col items-center">
                                        <span className={`text-slate-800 ${l.level === 1 ? 'text-blue-700 font-bold' : ''}`}>{l.label.split('(')[0]}</span>
                                        <span className="text-[9px] normal-case opacity-75">{l.label.split('(')[1].replace(')', '')}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {PERMISSION_GROUPS.map(group => (
                            <>
                                <tr key={group.title} className="bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer" onClick={() => toggleGroup(group.title)}>
                                    <td className="px-6 py-2 font-bold text-slate-700 sticky left-0 bg-slate-50/50 z-10 border-r border-slate-200 flex items-center gap-2" colSpan={LEVELS.length + 1}>
                                        {expandedGroups[group.title] ? <CaretDown size={14} /> : <CaretRight size={14} />}
                                        {group.title}
                                    </td>
                                </tr>
                                {expandedGroups[group.title] && group.permissions.map(permKey => (
                                    <tr key={permKey} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-3 font-medium text-slate-600 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 pl-10 text-xs">
                                            {PERMISSION_LABELS[permKey] || permKey}
                                        </td>
                                        {LEVELS.map(l => {
                                            const isChecked = (templates[l.level] || []).includes(permKey);
                                            const isDisabled = l.level === 1;

                                            return (
                                                <td key={l.level} className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => togglePermission(l.level, permKey)}
                                                        disabled={isDisabled}
                                                        className={`p-1 rounded transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                                    >
                                                        {isChecked ? (
                                                            <CheckSquare size={20} weight="fill" className={isDisabled ? 'text-slate-400' : 'text-blue-600'} />
                                                        ) : (
                                                            <Square size={20} className="text-slate-200 hover:text-slate-300" />
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
