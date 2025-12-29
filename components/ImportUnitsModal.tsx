'use client';

import { useState } from 'react';
import { X, UploadSimple, DownloadSimple, CheckCircle, Warning, Info } from '@phosphor-icons/react';
import { Unit } from '@/lib/data';

interface ImportUnitsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (units: Partial<Unit>[]) => void;
}

export default function ImportUnitsModal({ isOpen, onClose, onImport }: ImportUnitsModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Partial<Unit>[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [importing, setImporting] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setErrors([]);
        setPreview([]);

        // Parse CSV with auto-detection
        const text = await selectedFile.text();
        const cleanText = text.replace(/^\uFEFF/, ''); // Remove BOM
        const lines = cleanText.split(/\r?\n/).filter(line => line.trim());

        if (lines.length < 2) {
            setErrors(['El archivo está vacío o no tiene datos']);
            return;
        }

        // Detect delimiter
        const firstLine = lines[0];
        const delimiters = [',', ';', '\t'];
        let delimiter = ',';
        let maxCount = 0;

        for (const d of delimiters) {
            const count = firstLine.split(d).length;
            if (count > maxCount) {
                maxCount = count;
                delimiter = d;
            }
        }

        // Parse header
        const header = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
        const normalizedHeader = header.map(h => h.toLowerCase());

        const requiredFields = ['id', 'name', 'type', 'depth'];
        const missingFields = requiredFields.filter(f => !normalizedHeader.includes(f));

        if (missingFields.length > 0) {
            setErrors([`Faltan campos requeridos: ${missingFields.join(', ')}`]);
            return;
        }

        // Map header indexes
        const headerMap = new Map<string, number>();
        normalizedHeader.forEach((h, i) => headerMap.set(h, i));

        // Parse data
        const units: Partial<Unit>[] = [];
        const validationErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));

            const getVal = (key: string) => headerMap.has(key) ? values[headerMap.get(key)!] : '';

            const id = getVal('id');
            const name = getVal('name');
            const type = getVal('type');
            const depthStr = getVal('depth');
            const parentId = getVal('parentid');
            const responsibleEmail = getVal('responsibleemail');
            const description = getVal('description');

            // Validate required fields
            if (!id || !name || !type) {
                validationErrors.push(`Línea ${i + 1}: Faltan campos requeridos (id, name, type)`);
                continue;
            }

            // Validate type
            const upperType = type.toUpperCase();
            if (!['UNIT', 'PROCESS'].includes(upperType)) {
                validationErrors.push(`Línea ${i + 1}: Tipo inválido "${type}". Debe ser UNIT o PROCESS`);
                continue;
            }

            // Validate depth for UNIT
            if (upperType === 'UNIT' && (!depthStr || !['0', '1', '2'].includes(depthStr))) {
                validationErrors.push(`Línea ${i + 1}: Depth inválido para UNIT. Debe ser 0, 1 o 2`);
                continue;
            }

            const unit: Partial<Unit> = {
                id: id,
                name: name,
                type: upperType as 'UNIT' | 'PROCESS',
                depth: upperType === 'UNIT' ? parseInt(depthStr) : undefined,
                parentId: parentId || undefined,
                ownerId: responsibleEmail || undefined, // En producción, buscar usuario por email
                description: description || undefined
            };

            units.push(unit);
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        }

        setPreview(units);
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

    const downloadCSVTemplate = () => {
        const csvContent = `id,name,type,depth,parentId,parentName,responsibleEmail,description
DIR,Dirección General,UNIT,0,,,admin@demo.com,Dirección principal de la organización
OPS,Gerencia de Operaciones,UNIT,1,DIR,Dirección General,ops@demo.com,Área encargada de procesos operativos
FIN,Administración y Finanzas,UNIT,1,DIR,Dirección General,fin@demo.com,Gestión financiera y administrativa
CONT,Contabilidad,UNIT,2,FIN,Administración y Finanzas,cont@demo.com,Departamento de contabilidad
PROC-01,Proceso de Compras,PROCESS,,OPS,Gerencia de Operaciones,compras@demo.com,Flujo estandarizado de adquisiciones`;

        // Create blob with BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'plantilla-estructura-organizacional.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <UploadSimple size={32} weight="fill" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Importar Estructura Organizacional</h2>
                            <p className="text-purple-100 text-sm mt-1">Carga masiva desde archivo CSV</p>
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
                                    <li>Edita el archivo CSV con la estructura de tu organización</li>
                                    <li>Asegúrate de mantener el formato y los nombres de las columnas</li>
                                    <li>Sube el archivo editado usando el botón de carga</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Download Template */}
                    <div className="flex justify-center">
                        <button
                            onClick={downloadCSVTemplate}
                            type="button"
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
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">id</code> - Identificador único de la unidad</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">name</code> - Nombre de la unidad o proceso</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">type</code> - UNIT o PROCESS</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">depth</code> - 0 (Dirección), 1 (Área), 2 (Subárea) - Solo para UNIT</li>
                            </ul>
                            <p className="mt-3"><strong>Columnas opcionales:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">parentId</code> - ID de la unidad padre</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">parentName</code> - Nombre de la unidad padre (referencia)</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">responsibleEmail</code> - Email del responsable</li>
                                <li><code className="bg-slate-200 px-2 py-0.5 rounded">description</code> - Descripción de la unidad</li>
                            </ul>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
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
                            <div className="p-4 bg-purple-100 rounded-full">
                                <UploadSimple size={48} className="text-purple-600" weight="fill" />
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
                                        {errors.map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
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
                                        Vista Previa: {preview.length} unidades/procesos listos para importar
                                    </p>
                                    <p className="text-sm text-green-800 mt-1">
                                        Revisa los datos antes de confirmar la importación
                                    </p>
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto bg-white rounded-lg border border-green-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-green-100 sticky top-0">
                                        <tr>
                                            <th className="text-left p-2 font-bold text-green-900">ID</th>
                                            <th className="text-left p-2 font-bold text-green-900">Nombre</th>
                                            <th className="text-left p-2 font-bold text-green-900">Tipo</th>
                                            <th className="text-left p-2 font-bold text-green-900">Nivel</th>
                                            <th className="text-left p-2 font-bold text-green-900">Padre</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((unit, index) => (
                                            <tr key={index} className="border-t border-green-100 hover:bg-green-50">
                                                <td className="p-2 font-mono text-xs">{unit.id}</td>
                                                <td className="p-2">{unit.name}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${unit.type === 'UNIT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {unit.type}
                                                    </span>
                                                </td>
                                                <td className="p-2">{unit.depth !== undefined ? `Depth ${unit.depth}` : '-'}</td>
                                                <td className="p-2 text-xs text-slate-500">{unit.parentId || '-'}</td>
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
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {importing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Importando...
                            </>
                        ) : (
                            <>
                                <UploadSimple size={20} weight="bold" />
                                Importar {preview.length} Unidades
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
