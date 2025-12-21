'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, StorageProvider, TenantStorageConfig, GoogleDriveConfig, DropboxConfig, OneDriveConfig, SharePointConfig, S3Config } from '@/lib/data';
import {
    CloudArrowUp,
    CheckCircle,
    XCircle,
    Warning,
    GoogleDriveLogo,
    DropboxLogo,
    MicrosoftOutlookLogo,
    AmazonLogo,
    HardDrives,
    FloppyDisk,
    Eye,
    EyeSlash
} from '@phosphor-icons/react';

export default function StorageConfigPage() {
    const { currentTenantId } = useApp();
    const tenant = DB.tenants.find(t => t.id === currentTenantId);

    const [selectedProvider, setSelectedProvider] = useState<StorageProvider>(
        tenant?.storageConfig?.provider || 'LOCAL'
    );
    const [config, setConfig] = useState<any>(tenant?.storageConfig?.config || {});
    const [showSecrets, setShowSecrets] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ status: 'SUCCESS' | 'FAILED', message: string } | null>(null);
    const [saved, setSaved] = useState(false);

    const providers = [
        { id: 'GOOGLE_DRIVE' as StorageProvider, name: 'Google Drive', icon: GoogleDriveLogo, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { id: 'DROPBOX' as StorageProvider, name: 'Dropbox', icon: DropboxLogo, color: 'text-blue-700', bgColor: 'bg-blue-50' },
        { id: 'ONEDRIVE' as StorageProvider, name: 'OneDrive', icon: MicrosoftOutlookLogo, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { id: 'SHAREPOINT' as StorageProvider, name: 'SharePoint', icon: MicrosoftOutlookLogo, color: 'text-green-600', bgColor: 'bg-green-50' },
        { id: 'S3' as StorageProvider, name: 'Amazon S3', icon: AmazonLogo, color: 'text-orange-600', bgColor: 'bg-orange-50' },
        { id: 'LOCAL' as StorageProvider, name: 'Almacenamiento Local', icon: HardDrives, color: 'text-slate-600', bgColor: 'bg-slate-50' },
    ];

    const handleTestConnection = async () => {
        setTesting(true);
        setTestResult(null);

        // Simulate API call to test connection
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock validation
        const isValid = validateConfig();

        if (isValid) {
            setTestResult({ status: 'SUCCESS', message: 'Conexión exitosa. El proveedor está configurado correctamente.' });
        } else {
            setTestResult({ status: 'FAILED', message: 'Error de conexión. Verifica las credenciales.' });
        }

        setTesting(false);
    };

    const validateConfig = (): boolean => {
        switch (selectedProvider) {
            case 'GOOGLE_DRIVE':
                return !!(config.clientId && config.clientSecret && config.refreshToken);
            case 'DROPBOX':
                return !!config.accessToken;
            case 'ONEDRIVE':
                return !!(config.clientId && config.clientSecret && config.refreshToken);
            case 'SHAREPOINT':
                return !!(config.siteUrl && config.clientId && config.clientSecret && config.tenantId);
            case 'S3':
                return !!(config.accessKeyId && config.secretAccessKey && config.region && config.bucket);
            case 'LOCAL':
                return !!config.basePath;
            default:
                return false;
        }
    };

    const handleSave = () => {
        if (!tenant) return;

        const storageConfig: TenantStorageConfig = {
            provider: selectedProvider,
            enabled: true,
            config: config,
            lastTested: testResult?.status === 'SUCCESS' ? new Date().toISOString() : undefined,
            testStatus: testResult?.status,
            testMessage: testResult?.message
        };

        tenant.storageConfig = storageConfig;
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const renderConfigForm = () => {
        switch (selectedProvider) {
            case 'GOOGLE_DRIVE':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client ID</label>
                            <input
                                type="text"
                                value={config.clientId || ''}
                                onChange={e => setConfig({ ...config, clientId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="123456789-abcdefg.apps.googleusercontent.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client Secret</label>
                            <div className="relative">
                                <input
                                    type={showSecrets ? 'text' : 'password'}
                                    value={config.clientSecret || ''}
                                    onChange={e => setConfig({ ...config, clientSecret: e.target.value })}
                                    className="w-full p-3 pr-12 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
                                />
                                <button
                                    onClick={() => setShowSecrets(!showSecrets)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showSecrets ? <EyeSlash size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Refresh Token</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.refreshToken || ''}
                                onChange={e => setConfig({ ...config, refreshToken: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Folder ID (Opcional)</label>
                            <input
                                type="text"
                                value={config.folderId || ''}
                                onChange={e => setConfig({ ...config, folderId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="1AbCdEfGhIjKlMnOpQrStUvWxYz"
                            />
                            <p className="text-xs text-slate-500 mt-1">ID de la carpeta raíz donde se almacenarán todos los documentos</p>
                        </div>
                    </div>
                );

            case 'DROPBOX':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Access Token</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.accessToken || ''}
                                onChange={e => setConfig({ ...config, accessToken: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="sl.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Root Path (Opcional)</label>
                            <input
                                type="text"
                                value={config.rootPath || ''}
                                onChange={e => setConfig({ ...config, rootPath: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="/Maturity360"
                            />
                            <p className="text-xs text-slate-500 mt-1">Ruta raíz donde se almacenarán todos los documentos</p>
                        </div>
                    </div>
                );

            case 'ONEDRIVE':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client ID (Application ID)</label>
                            <input
                                type="text"
                                value={config.clientId || ''}
                                onChange={e => setConfig({ ...config, clientId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="12345678-1234-1234-1234-123456789abc"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client Secret</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.clientSecret || ''}
                                onChange={e => setConfig({ ...config, clientSecret: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Refresh Token</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.refreshToken || ''}
                                onChange={e => setConfig({ ...config, refreshToken: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="M.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tenant ID (Opcional)</label>
                            <input
                                type="text"
                                value={config.tenantId || ''}
                                onChange={e => setConfig({ ...config, tenantId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="12345678-1234-1234-1234-123456789abc"
                            />
                        </div>
                    </div>
                );

            case 'SHAREPOINT':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Site URL</label>
                            <input
                                type="text"
                                value={config.siteUrl || ''}
                                onChange={e => setConfig({ ...config, siteUrl: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="https://yourcompany.sharepoint.com/sites/yoursite"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client ID</label>
                            <input
                                type="text"
                                value={config.clientId || ''}
                                onChange={e => setConfig({ ...config, clientId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="12345678-1234-1234-1234-123456789abc"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Client Secret</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.clientSecret || ''}
                                onChange={e => setConfig({ ...config, clientSecret: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tenant ID</label>
                            <input
                                type="text"
                                value={config.tenantId || ''}
                                onChange={e => setConfig({ ...config, tenantId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="12345678-1234-1234-1234-123456789abc"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Library Name (Opcional)</label>
                            <input
                                type="text"
                                value={config.libraryName || ''}
                                onChange={e => setConfig({ ...config, libraryName: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Documents"
                            />
                        </div>
                    </div>
                );

            case 'S3':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Access Key ID</label>
                            <input
                                type="text"
                                value={config.accessKeyId || ''}
                                onChange={e => setConfig({ ...config, accessKeyId: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="AKIAIOSFODNN7EXAMPLE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Secret Access Key</label>
                            <input
                                type={showSecrets ? 'text' : 'password'}
                                value={config.secretAccessKey || ''}
                                onChange={e => setConfig({ ...config, secretAccessKey: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Region</label>
                            <input
                                type="text"
                                value={config.region || ''}
                                onChange={e => setConfig({ ...config, region: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="us-east-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bucket Name</label>
                            <input
                                type="text"
                                value={config.bucket || ''}
                                onChange={e => setConfig({ ...config, bucket: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="my-maturity360-bucket"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Endpoint (Opcional)</label>
                            <input
                                type="text"
                                value={config.endpoint || ''}
                                onChange={e => setConfig({ ...config, endpoint: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="https://s3.amazonaws.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Para servicios compatibles con S3 (MinIO, DigitalOcean Spaces, etc.)</p>
                        </div>
                    </div>
                );

            case 'LOCAL':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Ruta Base</label>
                            <input
                                type="text"
                                value={config.basePath || ''}
                                onChange={e => setConfig({ ...config, basePath: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="/var/www/maturity360/storage"
                            />
                            <p className="text-xs text-slate-500 mt-1">Ruta absoluta en el servidor donde se almacenarán los archivos</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Límite de Almacenamiento (GB)</label>
                            <input
                                type="number"
                                value={config.maxSizeGB || ''}
                                onChange={e => setConfig({ ...config, maxSizeGB: parseInt(e.target.value) || undefined })}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="100"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <CloudArrowUp size={36} className="text-blue-600" />
                    Configuración de Almacenamiento
                </h1>
                <p className="text-slate-600">
                    Configura el proveedor de almacenamiento en la nube donde se guardarán todos los documentos del sistema.
                </p>
            </div>

            {/* Provider Selection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Seleccionar Proveedor</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {providers.map(provider => {
                        const Icon = provider.icon;
                        const isSelected = selectedProvider === provider.id;
                        return (
                            <button
                                key={provider.id}
                                onClick={() => {
                                    setSelectedProvider(provider.id);
                                    setConfig({});
                                    setTestResult(null);
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`p-3 rounded-lg ${provider.bgColor}`}>
                                        <Icon size={32} className={provider.color} weight="fill" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{provider.name}</span>
                                    {isSelected && (
                                        <CheckCircle size={20} className="text-blue-600" weight="fill" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Configuration Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Configuración de {providers.find(p => p.id === selectedProvider)?.name}</h2>
                {renderConfigForm()}
            </div>

            {/* Test Connection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Probar Conexión</h2>
                <button
                    onClick={handleTestConnection}
                    disabled={testing || !validateConfig()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {testing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Probando conexión...
                        </>
                    ) : (
                        <>
                            <CloudArrowUp size={20} weight="bold" />
                            Probar Conexión
                        </>
                    )}
                </button>

                {testResult && (
                    <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${testResult.status === 'SUCCESS'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                        {testResult.status === 'SUCCESS' ? (
                            <CheckCircle size={24} className="text-green-600 flex-shrink-0" weight="fill" />
                        ) : (
                            <XCircle size={24} className="text-red-600 flex-shrink-0" weight="fill" />
                        )}
                        <div>
                            <p className={`font-bold ${testResult.status === 'SUCCESS' ? 'text-green-800' : 'text-red-800'}`}>
                                {testResult.status === 'SUCCESS' ? 'Conexión Exitosa' : 'Error de Conexión'}
                            </p>
                            <p className={`text-sm ${testResult.status === 'SUCCESS' ? 'text-green-700' : 'text-red-700'}`}>
                                {testResult.message}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={handleSave}
                    disabled={!validateConfig() || testResult?.status !== 'SUCCESS'}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <FloppyDisk size={20} weight="bold" />
                    Guardar Configuración
                </button>
            </div>

            {saved && (
                <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn">
                    <CheckCircle size={24} weight="fill" />
                    <span className="font-bold">Configuración guardada exitosamente</span>
                </div>
            )}

            {/* Warning */}
            {tenant?.storageConfig && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <Warning size={24} className="text-amber-600 flex-shrink-0" weight="fill" />
                    <div className="text-sm text-amber-800">
                        <p className="font-bold mb-1">Importante:</p>
                        <p>Cambiar el proveedor de almacenamiento no migrará automáticamente los archivos existentes. Asegúrate de realizar una migración manual si es necesario.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
