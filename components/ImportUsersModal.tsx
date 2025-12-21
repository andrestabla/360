'use client';

import { useState } from 'react';
import { X, UploadSimple, DownloadSimple, CheckCircle, Warning, Info } from '@phosphor-icons/react';
import { User } from '@/lib/data';

interface ImportUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (users: Partial<User>[]) => void;
    tenantId: string;
}

export default function ImportUsersModal({ isOpen, onClose, onImport, tenantId }: ImportUsersModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Partial<User>[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [importing, setImporting] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setErrors([]);
        setPreview([]);

        // Parse CSV
        const text = await selectedFile.text();
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
            setErrors(['El archivo está vacío o no tiene datos']);
            return;
        }

        // Parse header
        const header = lines[0].split(',').map(h => h.trim());
        const requiredFields = ['name', 'email'];
        const missingFields = requiredFields.filter(f => !header.includes(f));

        if (missingFields.length > 0) {
            setErrors([`Faltan campos requeridos: ${missingFields.join(', ')}`]);
            return;
        }

        // Parse data
        const users: Partial<User>[] = [];
        const validationErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row: Record<string, string> = {};

            header.forEach((key, index) => {
                row[key] = values[index] || '';
            });

            // Validate required fields
            if (!row.name || !row.email) {
                validationErrors.push(`Línea ${i + 1}: Faltan campos requeridos (name, email)`);
                continue;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
                validationErrors.push(`Línea ${i + 1}: Email inválido "${row.email}"`);
                continue;
            }

            // Validate level
            const level = parseInt(row.level) || 3;
            if (level < 1 || level > 6) {
                validationErrors.push(`Línea ${i + 1}: Nivel inválido. Debe ser entre 1 y 6`);
                continue;
            }

            const user: Partial<User> = {
                id: `user_${Date.now()}_${i}`,
                tenantId: tenantId,
                name: row.name,
                email: row.email,
                password: row.password || 'ChangeMe123!',
                level: level,
                role: row.role || 'Usuario',
                unit: row.unit || '',
                jobTitle: row.jobTitle || '',
                phone: row.phone || '',
                location: row.location || '',
                status: (row.status === 'ACTIVE' || row.status === 'SUSPENDED' || row.status === 'PENDING_INVITE' || row.status === 'DELETED'
                    ? row.status
                    : 'ACTIVE') as 'ACTIVE' | 'SUSPENDED' | 'PENDING_INVITE' | 'DELETED',
                initials: row.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            };

            users.push(user);
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        }

        setPreview(users);
    };

    const handleImport = () => {
        if (preview.length === 0) return;

        setImporting(true);

        // Simulate import delay
        setTimeout(() => {
            onImport(preview);
            setImporting(false);
            handleClose();
        }, 1500);
    };

    const handleClose = () => {
        setFile(null);
        setPreview([]);
        setErrors([]);
        setImporting(false);
        onClose();
    };

    const handleDownloadTemplate = () => {
        // Download the example CSV
        const link = document.createElement('a');
        link.href = '/templates/usuarios-ejemplo.csv';
        link.download = 'usuarios-ejemplo.csv';
        link.click();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <UploadSimple size={32} weight="fill" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Importar Usuarios</h2>
                            <p className="text-indigo-100 text-sm mt-1">Carga masiva desde archivo CSV</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} weight="bold" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Info size={24} className="text-blue-600 flex-shrink-0" weight="fill" />
                            <div className="text-sm text-blue-900">
                                <p className="font-bold mb-2">Instrucciones:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Descarga el archivo de ejemplo haciendo clic en el botón abajo</li>
                                    <li>Edita el archivo CSV con los datos de tus usuarios</li>
                                    <li>Asegúrate de mantener el formato y los nombres de las columnas</li>
                                    <li>Sube el archivo editado usando el botón de carga</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Download Template */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                        >
                            <DownloadSimple size={20} weight="bold" />
                            Descargar Plantilla CSV de Ejemplo
                        </button>
                    </div>

                    {/* CSV Format Info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-3">Formato del Archivo CSV</h3>
                        <div className="text-sm text-slate-700 space-y-2">
                            <p><strong>Columnas requeridas:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">name</code> - Nombre completo del usuario</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">email</code> - Email corporativo (debe ser único)</li>
                            </ul>
                            <p className="mt-3"><strong>Columnas opcionales:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">password</code> - Contraseña inicial (default: ChangeMe123!)</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">level</code> - Nivel de acceso 1-6 (default: 3)</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">role</code> - Rol del usuario (ej: Analista, Manager)</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">unit</code> - Unidad organizacional</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">jobTitle</code> - Cargo o título del puesto</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">phone</code> - Teléfono de contacto</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">location</code> - Ubicación física</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">status</code> - ACTIVE o INACTIVE (default: ACTIVE)</li>
                            </ul>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="cursor-pointer flex flex-col items-center gap-3"
                        >
                            <div className="p-4 bg-indigo-100 rounded-full">
                                <UploadSimple size={48} className="text-indigo-600" weight="fill" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-800">
                                    {file ? file.name : 'Haz clic para seleccionar un archivo CSV'}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    o arrastra y suelta aquí
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Warning size={24} className="text-red-600 flex-shrink-0" weight="fill" />
                                <div className="flex-1">
                                    <p className="font-bold text-red-900 mb-2">Errores encontrados:</p>
                                    <ul className="text-sm text-red-800 space-y-1">
                                        {errors.slice(0, 10).map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
                                        {errors.length > 10 && (
                                            <li className="text-red-600 font-bold">... y {errors.length - 10} errores más</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {preview.length > 0 && errors.length === 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <CheckCircle size={24} className="text-green-600 flex-shrink-0" weight="fill" />
                                <div>
                                    <p className="font-bold text-green-900">
                                        Vista Previa: {preview.length} usuarios listos para importar
                                    </p>
                                    <p className="text-sm text-green-800 mt-1">
                                        Revisa los datos antes de confirmar la importación
                                    </p>
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto bg-white rounded-lg border border-green-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-green-100 sticky top-0">
                                        <tr>
                                            <th className="text-left p-2 font-bold text-green-900">Nombre</th>
                                            <th className="text-left p-2 font-bold text-green-900">Email</th>
                                            <th className="text-left p-2 font-bold text-green-900">Nivel</th>
                                            <th className="text-left p-2 font-bold text-green-900">Rol</th>
                                            <th className="text-left p-2 font-bold text-green-900">Unidad</th>
                                            <th className="text-left p-2 font-bold text-green-900">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((user, index) => (
                                            <tr key={index} className="border-t border-green-100 hover:bg-green-50">
                                                <td className="p-2">{user.name}</td>
                                                <td className="p-2 text-xs">{user.email}</td>
                                                <td className="p-2">
                                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                                                        Nivel {user.level}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-xs">{user.role}</td>
                                                <td className="p-2 text-xs">{user.unit || '-'}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.status === 'ACTIVE'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={preview.length === 0 || errors.length > 0 || importing}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {importing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Importando...
                            </>
                        ) : (
                            <>
                                <UploadSimple size={20} weight="bold" />
                                Importar {preview.length} Usuarios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
