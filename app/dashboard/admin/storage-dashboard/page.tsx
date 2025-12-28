'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, StorageProvider } from '@/lib/data';
import { getStorageService, StorageStats } from '@/lib/services/storageService';
import {
    CloudArrowUp,
    CheckCircle,
    Database,
    ChartPie,
    ArrowsLeftRight,
    Warning,
    Info
} from '@phosphor-icons/react';
import AdminGuide from '@/components/AdminGuide';
import { storageDashboardGuide } from '@/lib/adminGuides';

export default function StorageDashboardPage() {
    const { platformSettings } = useApp();
    const storageConfig = platformSettings.storage;

    const [stats, setStats] = useState<StorageStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [showMigration, setShowMigration] = useState(false);
    const [migrationTarget, setMigrationTarget] = useState<StorageProvider>('LOCAL');
    const [migrating, setMigrating] = useState(false);
    const [migrationProgress, setMigrationProgress] = useState(0);

    useEffect(() => {
        loadStats();
    }, [storageConfig]);

    const loadStats = async () => {
        if (!storageConfig) return;

        setLoadingStats(true);
        try {
            const service = getStorageService();
            if (service) {
                const result = await service.getStats();
                if (result.success && result.stats) {
                    setStats(result.stats);
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleMigration = async () => {
        setMigrating(true);
        setMigrationProgress(0);

        // Simulate migration progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setMigrationProgress(i);
        }

        setMigrating(false);
        setShowMigration(false);
        alert('Migración completada exitosamente');
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (!storageConfig) {
        return (
            <div className="p-8">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
                    <Warning size={32} className="text-amber-600 flex-shrink-0" weight="fill" />
                    <div>
                        <h3 className="font-bold text-amber-900 text-lg mb-2">Almacenamiento No Configurado</h3>
                        <p className="text-amber-800 mb-4">
                            No has configurado un proveedor de almacenamiento. Por favor, ve a la página de configuración para seleccionar y configurar un proveedor.
                        </p>
                        <a
                            href="/dashboard/admin/storage"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
                        >
                            <CloudArrowUp size={20} />
                            Configurar Almacenamiento
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const providerNames: Record<StorageProvider, string> = {
        'GOOGLE_DRIVE': 'Google Drive',
        'DROPBOX': 'Dropbox',
        'ONEDRIVE': 'OneDrive',
        'SHAREPOINT': 'SharePoint',
        'S3': 'Amazon S3',
        'R2': 'Cloudflare R2',
        'LOCAL': 'Almacenamiento Local'
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <Database size={36} className="text-blue-600" />
                    Dashboard de Almacenamiento
                </h1>
                <p className="text-slate-600">
                    Monitorea el uso de almacenamiento y gestiona tus archivos.
                </p>
            </div>

            {/* Current Provider Info */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-blue-100 text-sm font-medium mb-1">Proveedor Actual</div>
                        <div className="text-2xl font-bold">{providerNames[storageConfig.provider as import("@/lib/data").StorageProvider]}</div>
                        {storageConfig.lastTested && (
                            <div className="text-blue-100 text-sm mt-2">
                                Última prueba: {new Date(storageConfig.lastTested).toLocaleString('es-ES')}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {storageConfig.testStatus === 'success' ? (
                            <CheckCircle size={48} weight="fill" className="text-green-300" />
                        ) : (
                            <Warning size={48} weight="fill" className="text-yellow-300" />
                        )}
                    </div>
                </div>
            </div>

            {/* Storage Stats */}
            {loadingStats ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando estadísticas...</p>
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Size */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Database size={24} className="text-purple-600" weight="fill" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Espacio Utilizado</div>
                                <div className="text-2xl font-bold text-slate-800">{formatBytes(stats.totalSize)}</div>
                            </div>
                        </div>
                        {stats.limit && (
                            <div className="text-xs text-slate-500">
                                de {formatBytes(stats.limit)} disponibles
                            </div>
                        )}
                    </div>

                    {/* File Count */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <ChartPie size={24} className="text-blue-600" weight="fill" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Total de Archivos</div>
                                <div className="text-2xl font-bold text-slate-800">{stats.fileCount.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Percentage */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CloudArrowUp size={24} className="text-green-600" weight="fill" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Uso del Almacenamiento</div>
                                <div className="text-2xl font-bold text-slate-800">{(stats.usedPercentage ?? 0).toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${(stats.usedPercentage ?? 0) > 80 ? 'bg-red-500' :
                                    (stats.usedPercentage ?? 0) > 60 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(stats.usedPercentage ?? 0, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <p className="text-slate-600 text-center">No se pudieron cargar las estadísticas</p>
                </div>
            )}

            {/* Migration Tool */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <ArrowsLeftRight size={24} className="text-blue-600" />
                            Herramienta de Migración
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Migra todos tus archivos a un nuevo proveedor de almacenamiento
                        </p>
                    </div>
                    <button
                        onClick={() => setShowMigration(!showMigration)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                        {showMigration ? 'Cancelar' : 'Iniciar Migración'}
                    </button>
                </div>

                {showMigration && (
                    <div className="border-t border-slate-200 pt-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <Info size={24} className="text-blue-600 flex-shrink-0" weight="fill" />
                            <div className="text-sm text-blue-800">
                                <p className="font-bold mb-1">Importante:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>La migración puede tardar varios minutos dependiendo del tamaño de tus archivos</li>
                                    <li>Los archivos permanecerán en el proveedor actual hasta que la migración se complete</li>
                                    <li>Se recomienda realizar esta operación fuera del horario laboral</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Proveedor de Destino
                            </label>
                            <select
                                value={migrationTarget}
                                onChange={e => setMigrationTarget(e.target.value as StorageProvider)}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                disabled={migrating}
                            >
                                {Object.entries(providerNames)
                                    .filter(([key]) => key !== storageConfig?.provider)
                                    .map(([key, name]) => (
                                        <option key={key} value={key}>{name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        {migrating && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">Progreso de Migración</span>
                                    <span className="text-sm font-bold text-blue-600">{migrationProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${migrationProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Migrando archivos... Por favor no cierres esta página.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleMigration}
                                disabled={migrating}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {migrating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Migrando...
                                    </>
                                ) : (
                                    <>
                                        <ArrowsLeftRight size={20} weight="bold" />
                                        Iniciar Migración
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Warning about migration */}
            {!showMigration && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <Warning size={24} className="text-amber-600 flex-shrink-0" weight="fill" />
                    <div className="text-sm text-amber-800">
                        <p className="font-bold mb-1">Antes de migrar:</p>
                        <p>Asegúrate de haber configurado y probado la conexión con el nuevo proveedor de almacenamiento en la página de configuración.</p>
                    </div>
                </div>
            )}

            {/* Admin Guide */}
            <AdminGuide {...storageDashboardGuide as any} />
        </div>
    );
}
