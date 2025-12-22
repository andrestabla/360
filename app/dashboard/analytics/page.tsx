'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    ChartPieSlice, Table, Plus, Upload, ShareNetwork, ChartBar, FileCsv, Database,
    PresentationChart, Kanban, DotsThreeOutline, X, FloppyDisk, ChartLineUp, Function, Sparkle, Link as LinkIcon,
    Gear, Lock, Globe, Users, Trash, DownloadSimple, Printer, Funnel, DotsSixVertical, ArrowsOut, ArrowsIn, PlusCircle,
    Envelope, UserPlus, Check, Copy, CaretLeft, CaretRight, MagnifyingGlass, CheckCircle
} from '@phosphor-icons/react';

import { DB, Project, ProjectPhase } from '@/lib/data';
import { useApp } from '@/context/AppContext';

// --- UTILS: PROGRESS CALCULATION (Sync with Workflows Module) ---
const getStatusValue = (status: string) => {
    switch (status) {
        case 'VALIDATED': return 100;
        case 'DELIVERED': return 90;
        case 'IN_REVIEW': return 80;
        case 'COMPLETED': return 60;
        case 'IN_PROGRESS': return 20;
        default: return 0;
    }
};

const getPhaseProgress = (phase: ProjectPhase) => {
    if (!phase.activities || phase.activities.length === 0) return 0;
    const total = phase.activities.reduce((acc, act) => acc + getStatusValue(act.status), 0);
    return Math.round(total / phase.activities.length);
};

const getProjectProgress = (proj: Project) => {
    if (!proj.phases || proj.phases.length === 0) return 0;
    const totalPhaseProgress = proj.phases.reduce((acc, p) => acc + getPhaseProgress(p), 0);
    return Math.round(totalPhaseProgress / proj.phases.length);
};

// --- LAYERS 1 & 2: DATA & BUILDER DEFINITIONS ---

type AccessLevel = 'PRIVATE' | 'PUBLIC_ORG' | 'SHARED';
type AggregationType = 'COUNT' | 'SUM' | 'AVG';
type ChartType =
    | 'KPI' | 'TABLE' | 'MATRIX'
    | 'BAR' | 'BAR_STACKED' | 'LOLLIPOP'
    | 'LINE' | 'AREA'
    | 'PIE' | 'DONUT' | 'TREEMAP'
    | 'SCATTER' | 'BUBBLE'
    | 'RADAR' | 'FUNNEL' | 'GAUGE'
    | 'GANTT' | 'THERMOMETER' | 'HEATMAP';

const CHART_CATEGORIES = {
    'Resumen & Tablas': ['KPI', 'TABLE', 'MATRIX'],
    'Comparación': ['BAR', 'BAR_STACKED', 'LOLLIPOP'],
    'Tendencia': ['LINE', 'AREA'],
    'Composición': ['PIE', 'DONUT', 'TREEMAP'],
    'Relación': ['SCATTER', 'BUBBLE'],
    'Especiales': ['RADAR', 'FUNNEL', 'GAUGE'],
    'Gestión de Proyectos': ['GANTT', 'THERMOMETER', 'HEATMAP']
};

interface DataColumn {
    name: string;
    type: 'STRING' | 'NUMBER' | 'DATE';
}

interface Dataset {
    id: string;
    title: string;
    sourceType: 'WORKFLOWS' | 'REPOSITORY' | 'AUDIT' | 'UPLOAD' | 'PROJECTS' | 'STORAGE';
    rows: number;
    size: string;
    updatedAt: string;
    columns: DataColumn[];
    access: AccessLevel;
    ownerId: string;
    _filterFolderId?: string;
    _data?: any[]; // For uploaded datasets
}

interface WidgetConfig {
    datasetId: string;
    chartType: ChartType;
    aggregation: AggregationType | 'MATRIX';
    valueColumn: string; // The field to aggregate
    groupColumn?: string; // The dimension to group by (for charts)
    filter?: { column: string, operator: 'EQUALS', value: string };
}

interface DashboardSection {
    id: string;
    title: string;
    widgets: Widget[];
    columns?: number; // 1, 2 or 3
}

interface Widget {
    id: string;
    title: string;
    config: WidgetConfig;
    layout: { x: number, y: number, w: number, h: number }; // Future Grid Layout
}

interface Dashboard {
    id: string;
    title: string;
    description: string;
    sections: DashboardSection[];
    updatedAt: string;
    access: AccessLevel;
    ownerId: string;
    views: number;
    unit?: string; // Unidad o 'GLOBAL'
    process?: string; // Proceso asociado
    isAuto?: boolean; // Indica si fue generado automáticamente
}

// --- HELPERS ---
const getPhaseTeam = (phase: ProjectPhase, users: any[]) => {
    const participants = new Set<string>();
    phase.activities?.forEach(a => {
        a.participants?.forEach((p: any) => {
            const userId = typeof p === 'string' ? p : p.userId;
            const u = users.find((user: any) => user.id === userId);
            if (u) participants.add(u.name);
        });
    });
    return Array.from(participants).join(', ');
};

// --- MOCK DATA LAYER (LAYER 1) ---

const MOCK_DATASETS: Dataset[] = [
    {
        id: 'DS-WF', title: 'Workflows: Casos T1-2025', sourceType: 'WORKFLOWS', rows: 1250, size: '450KB', updatedAt: '2025-06-15', access: 'PUBLIC_ORG', ownerId: 'u1',
        columns: [
            { name: 'ID Caso', type: 'STRING' }, { name: 'Estado', type: 'STRING' }, { name: 'Unidad', type: 'STRING' }, { name: 'Tiempo Resolución (h)', type: 'NUMBER' }
        ]

    },
    {
        id: 'DS-PROJ', title: 'Gestión de Proyectos (En Vivo)', sourceType: 'PROJECTS', rows: 0, size: 'Dynamic', updatedAt: 'Ahora', access: 'PUBLIC_ORG', ownerId: 'sys',
        columns: [
            { name: 'Proyecto', type: 'STRING' }, { name: 'Carpeta (Unidad)', type: 'STRING' }, { name: 'Estado', type: 'STRING' }, { name: 'Progreso (%)', type: 'NUMBER' }, { name: 'Fases', type: 'NUMBER' },
            { name: 'Fase', type: 'STRING' }, { name: 'Estado Fase', type: 'STRING' }, { name: 'Actividad', type: 'STRING' }, { name: 'Estado Actividad', type: 'STRING' }, { name: 'Responsable', type: 'STRING' }
        ]
    },
    {
        id: 'DS-REPO', title: 'Repositorio: Metadatos', sourceType: 'REPOSITORY', rows: 8400, size: '2.1MB', updatedAt: '2025-06-14', access: 'PRIVATE', ownerId: 'u1',
        columns: [
            { name: 'Nombre Archivo', type: 'STRING' }, { name: 'Tipo MIME', type: 'STRING' }, { name: 'Autor', type: 'STRING' }, { name: 'Tamaño (MB)', type: 'NUMBER' }
        ]
    },
    {
        id: 'DS-UPLOAD', title: 'Presupuesto Marketing.xlsx', sourceType: 'UPLOAD', rows: 120, size: '25KB', updatedAt: '2025-06-10', access: 'PRIVATE', ownerId: 'u1',
        columns: [
            { name: 'Mes', type: 'STRING' }, { name: 'Canal', type: 'STRING' }, { name: 'Inversión', type: 'NUMBER' }, { name: 'Leads', type: 'NUMBER' }
        ]
    }
];

const MOCK_DASHBOARDS: Dashboard[] = [
    {
        id: 'DB-1',
        title: 'Resumen Operativo',
        description: 'KPIs principales de la operación',
        updatedAt: 'Hace 2h',
        access: 'PUBLIC_ORG',
        ownerId: 'sys',
        views: 340,
        // Dashboard Global (sin unit ni process)
        sections: [
            {
                id: 'sec-1',
                title: 'Indicadores Globales',
                widgets: [
                    {
                        id: 'w1', title: 'Casos Totales', layout: { x: 0, y: 0, w: 1, h: 1 },
                        config: { datasetId: 'DS-WF', chartType: 'KPI', aggregation: 'COUNT', valueColumn: 'ID Caso' }
                    },
                    {
                        id: 'w2', title: 'Casos por Estado', layout: { x: 0, y: 0, w: 2, h: 2 },
                        config: { datasetId: 'DS-WF', chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'ID Caso', groupColumn: 'Estado' }
                    }
                ]
            }
        ]
    },
    {
        id: 'DB-2',
        title: 'Métricas de Desarrollo',
        description: 'Indicadores del área de desarrollo de software',
        updatedAt: 'Hace 1d',
        access: 'PUBLIC_ORG',
        ownerId: 'sys',
        views: 125,
        unit: 'Desarrollo de Software', // Subárea
        process: 'DevOps', // Proceso de la subárea
        sections: [
            {
                id: 'sec-dev-1',
                title: 'Métricas DevOps',
                widgets: []
            }
        ]
    },
    {
        id: 'DB-3',
        title: 'Dashboard de RRHH',
        description: 'Métricas de gestión de candidatos',
        updatedAt: 'Hace 3h',
        access: 'PRIVATE',
        ownerId: 'sys',
        views: 89,
        unit: 'Reclutamiento y Selección', // Subárea
        process: 'Gestión de Candidatos', // Proceso de la subárea
        sections: [
            {
                id: 'sec-rrhh-1',
                title: 'Reclutamiento',
                widgets: []
            }
        ]
    },
    {
        id: 'DB-4',
        title: 'Análisis Financiero',
        description: 'Reportes de contabilidad y cierre mensual',
        updatedAt: 'Hace 5h',
        access: 'PUBLIC_ORG',
        ownerId: 'sys',
        views: 234,
        unit: 'Contabilidad', // Subárea
        process: 'Cierre Mensual', // Proceso de la subárea
        sections: [
            {
                id: 'sec-fin-1',
                title: 'Cierre Contable',
                widgets: []
            }
        ]
    }
];

// --- LOGIC LAYER (LAYER 2: QUERY ENGINE) ---

const runQuery = (
    config: WidgetConfig,
    dataset: Dataset,
    context: { projects: Project[], folders: any[], users: any[], tenantId: string },
    activeFilters?: Record<string, string>
): any => {
    if (!dataset) return null;

    // 1. GET RAW DATA
    let rawRows: any[] = [];
    if (dataset.sourceType === 'UPLOAD' || dataset.sourceType === 'WORKFLOWS' || dataset.sourceType === 'REPOSITORY') {
        rawRows = (dataset as any)._data || [];
        // Fallback or mock for empty datasets in demo
        if (rawRows.length === 0 && dataset.rows > 0) {
            // Mocking some rows if needed for demo
            rawRows = Array.from({ length: 10 }).map((_, i) => ({
                id: i,
                'Estado': ['Abierto', 'Cerrado', 'En Proceso'][i % 3],
                'Unidad': ['Ventas', 'HR', 'IT'][i % 3],
                'Progreso (%)': Math.floor(Math.random() * 100)
            }));
        }
    } else if (dataset.sourceType === 'PROJECTS') {
        let projects = context.projects;
        if ((dataset as any)._filterFolderId) {
            projects = projects.filter(p => p.folderId === (dataset as any)._filterFolderId);
        }

        // FLATTEN HIERARCHY BASED ON GRANULARITY
        const needsActivityLevel = ['Actividad', 'Estado Actividad', 'Responsable', 'Duración (Días)'].includes(config.groupColumn || '') ||
            ['Actividad', 'Responsable', 'Duración (Días)'].includes(config.valueColumn) ||
            config.chartType === 'BAR_STACKED';
        const needsPhaseLevel = ['Fase', 'Estado Fase'].includes(config.groupColumn || '') || ['Fase'].includes(config.valueColumn);

        if (needsActivityLevel) {
            projects.forEach(p => {
                p.phases.forEach(ph => {
                    ph.activities.forEach(act => {
                        const statusMap: any = { 'COMPLETED': 'Completado', 'IN_PROGRESS': 'En Proceso', 'NOT_STARTED': 'Sin Iniciar' };
                        const baseRow = {
                            'Proyecto': p.title,
                            'Carpeta (Unidad)': context.folders.find(f => f.id === p.folderId)?.name || 'Sin Carpeta',
                            'Estado': statusMap[p.status] || p.status,
                            'Progreso (%)': getProjectProgress(p),
                            'Fase': ph.name,
                            'Estado Fase': statusMap[ph.status] || ph.status,
                            'Actividad': act.name,
                            'Estado Actividad': statusMap[act.status] || act.status,
                            'Responsable': 'Sin Asignar',
                            'Duración (Días)': [15, 20, 30, 45, 60][Math.floor(Math.random() * 5)] // Mocked duration
                        };

                        if (act.participants && act.participants.length > 0) {
                            act.participants.forEach((part: any) => {
                                const userId = typeof part === 'string' ? part : part.userId;
                                const u = context.users.find(u => u.id === userId);
                                rawRows.push({ ...baseRow, 'Responsable': u ? u.name : 'Desconocido' });
                            });
                        } else {
                            rawRows.push(baseRow);
                        }
                    });
                });
            });
        } else if (needsPhaseLevel) {
            projects.forEach(p => {
                p.phases.forEach(ph => {
                    rawRows.push({
                        'Proyecto': p.title,
                        'Carpeta (Unidad)': context.folders.find(f => f.id === p.folderId)?.name || 'Sin Carpeta',
                        'Estado': p.status,
                        'Progreso (%)': getProjectProgress(p),
                        'Fase': ph.name,
                        'Estado Fase': ph.status,
                        'Fases': p.phases.length
                    });
                });
            });
        } else {
            rawRows = projects.map(p => ({
                'Proyecto': p.title,
                'Carpeta (Unidad)': context.folders.find(f => f.id === p.folderId)?.name || 'Sin Carpeta',
                'Estado': p.status,
                'Progreso (%)': getProjectProgress(p),
                'Fases': p.phases.length
            }));
        }
    }

    // 2. APPLY FILTERS
    if (activeFilters) {
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== 'all') {
                const filterIndex = parseInt(key.replace('filter_', ''));
                const filterColumn = dataset.columns.filter(c => c.type === 'STRING')[filterIndex];
                if (filterColumn) {
                    rawRows = rawRows.filter(row => String(row[filterColumn.name]) === value);
                }
            }
        });
    }

    // 3. SPECIAL HANDLING FOR MATRIX & GANTT
    if (config.chartType === 'MATRIX') {
        const projectsData = context.projects.filter(p => !((dataset as any)._filterFolderId) || p.folderId === (dataset as any)._filterFolderId);
        const rows = projectsData.map((p: any) => ({
            id: p.id,
            project: p.title,
            progress: getProjectProgress(p),
            phases: p.phases.map((ph: any) => ({
                name: ph.name,
                progress: getPhaseProgress(ph),
                team: getPhaseTeam(ph, context.users)
            }))
        }));
        return { type: 'MATRIX', rows, maxPhases: Math.max(...rows.map(r => r.phases.length), 0) };
    }

    if (config.chartType === 'GANTT') {
        const projectsData = context.projects.filter(p => !((dataset as any)._filterFolderId) || p.folderId === (dataset as any)._filterFolderId);
        const tasks = projectsData.flatMap(p => p.phases.flatMap(ph => ph.activities.map(act => ({
            id: act.id,
            project: p.title,
            name: act.name,
            progress: act.status === 'COMPLETED' ? 100 : (act.status === 'IN_PROGRESS' ? 50 : 0),
            status: act.status
        }))));
        return { type: 'GANTT', tasks: tasks.slice(0, 5) }; // Limit for preview
    }

    // 4. GROUP AND AGGREGATE
    const valueCol = config.valueColumn;
    const groupCol = config.groupColumn;
    const agg = config.aggregation || 'COUNT';

    if (config.chartType === 'KPI') {
        let resultValue: any = 0;
        if (agg === 'COUNT') {
            resultValue = rawRows.length;
        } else {
            const numericValues = rawRows.map(r => {
                const val = r[valueCol];
                if (typeof val === 'number') return val;
                if (typeof val === 'string') {
                    const cleaned = val.replace('%', '');
                    return parseFloat(cleaned) || 0;
                }
                return 0;
            });

            if (numericValues.length === 0) {
                resultValue = 0;
            } else {
                const sum = numericValues.reduce((a, b) => a + b, 0);
                resultValue = agg === 'SUM' ? sum : Math.round(sum / numericValues.length);
            }
        }

        const isPercentage = valueCol.includes('%') || (rawRows.length > 0 && String(rawRows[0][valueCol]).includes('%'));
        const displayValue = isPercentage ? `${resultValue}%` : resultValue.toLocaleString();

        return { value: displayValue, label: agg === 'COUNT' ? `Total ${valueCol}` : `${agg} de ${valueCol}` };
    }

    if (groupCol) {
        if (config.chartType === 'BAR_STACKED') {
            const pivot: Record<string, Record<string, number>> = {};
            const subGroups = new Set<string>();
            rawRows.forEach(row => {
                const mainKey = String(row[groupCol] || 'Sin Valor');
                const subKey = String(row['Estado Actividad'] || 'Sin Estado');
                subGroups.add(subKey);
                if (!pivot[mainKey]) pivot[mainKey] = {};
                pivot[mainKey][subKey] = (pivot[mainKey][subKey] || 0) + 1;
            });
            return { type: 'STACKED', labels: Object.keys(pivot), series: Array.from(subGroups).map(s => ({ name: s, data: Object.keys(pivot).map(l => pivot[l][s] || 0) })) };
        }

        const groups: Record<string, { sum: number, count: number }> = {};
        rawRows.forEach(row => {
            const key = String(row[groupCol] || 'Sin Valor');
            if (!groups[key]) groups[key] = { sum: 0, count: 0 };

            let val = 0;
            if (agg !== 'COUNT') {
                const rawVal = row[valueCol];
                if (typeof rawVal === 'number') val = rawVal;
                else if (typeof rawVal === 'string') val = parseFloat(rawVal.replace('%', '')) || 0;
            } else {
                val = 1;
            }

            groups[key].sum += val;
            groups[key].count += 1;
        });

        const labels = Object.keys(groups);
        const data = labels.map(k => {
            if (agg === 'COUNT') return groups[k].count;
            if (agg === 'SUM') return groups[k].sum;
            if (agg === 'AVG') return Math.round(groups[k].sum / groups[k].count);
            return groups[k].sum;
        });

        return { labels, data };
    }

    return null;
};

// --- COMPONENT ---

export default function AnalyticsModule() {
    const { currentTenantId, version } = useApp(); // Used for reactivity
    const [view, setView] = useState<'HUB' | 'EDITOR'>('HUB');
    const [activeTab, setActiveTab] = useState<'DASHBOARDS' | 'DATASETS'>('DASHBOARDS');

    // Data (Real Context)
    const contextData = useMemo(() => ({
        projects: DB.projects.filter(p => p.tenantId === currentTenantId),
        folders: DB.projectFolders.filter(f => f.tenantId === currentTenantId),
        users: DB.users,
        tenantId: currentTenantId || ''
    }), [currentTenantId, version]);

    // Generate Dynamic Datasets from Folders
    const folderDatasets: Dataset[] = useMemo(() => {
        return contextData.folders.map(f => ({
            id: `DS-FLDR-${f.id}`,
            title: `Carpeta: ${f.name}`,
            sourceType: 'PROJECTS', // Reuse existing logic but we will filter by ID/Name 
            rows: contextData.projects.filter(p => p.folderId === f.id).length,
            size: 'Dynamic',
            updatedAt: 'Ahora',
            access: 'PUBLIC_ORG',
            ownerId: 'sys',
            columns: [
                { name: 'Proyecto', type: 'STRING' },
                { name: 'Estado', type: 'STRING' },
                { name: 'Progreso (%)', type: 'NUMBER' },
                { name: 'Fase', type: 'STRING' },
                { name: 'Actividad', type: 'STRING' },
                { name: 'Estado Actividad', type: 'STRING' },
                { name: 'Responsable', type: 'STRING' },
                { name: 'Fecha Fin', type: 'DATE' }
            ],
            // Hidden metadata to help query engine filter
            _filterFolderId: f.id
        } as any));
    }, [contextData]);

    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [editingNormDataset, setEditingNormDataset] = useState<Dataset | null>(null);

    // Persistence Logic with versioning
    useEffect(() => {
        const DASHBOARDS_VERSION = '2.0'; // Incrementar cuando cambie la estructura
        const storedVersion = localStorage.getItem('m360_dashboards_version');
        const stored = localStorage.getItem('m360_dashboards');

        // Si la versión cambió o no hay datos, usar MOCK_DASHBOARDS
        if (storedVersion !== DASHBOARDS_VERSION || !stored) {
            console.log('Loading new dashboard structure version:', DASHBOARDS_VERSION);
            setDashboards(MOCK_DASHBOARDS);
            localStorage.setItem('m360_dashboards_version', DASHBOARDS_VERSION);
            localStorage.setItem('m360_dashboards', JSON.stringify(MOCK_DASHBOARDS));
        } else {
            try {
                setDashboards(JSON.parse(stored));
            } catch (e) {
                setDashboards(MOCK_DASHBOARDS);
            }
        }
    }, []);

    useEffect(() => {
        if (dashboards.length > 0) {
            localStorage.setItem('m360_dashboards', JSON.stringify(dashboards));
        }
    }, [dashboards]);

    const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
    const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
    const [sharingDashboard, setSharingDashboard] = useState<Dashboard | null>(null);
    const [editingDashboardPropsId, setEditingDashboardPropsId] = useState<string | null>(null);

    // Merge static and dynamic datasets for the view
    const allDatasets = useMemo(() => [...datasets, ...folderDatasets], [datasets, folderDatasets]);

    // Modals
    const [showCreateDb, setShowCreateDb] = useState(false);
    const [showCreateDs, setShowCreateDs] = useState(false);

    // Filter state
    const [filters, setFilters] = useState<Record<string, string>>({
        dateRange: 'all',
        folder: 'all',
        status: 'all'
    });

    // Dashboard filters
    const [dashboardFilterUnit, setDashboardFilterUnit] = useState('ALL');
    const [dashboardFilterProcess, setDashboardFilterProcess] = useState('ALL');
    const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');

    // Obtener unidades disponibles en dashboards
    const dashboardAvailableUnits = useMemo(() => {
        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT')
            .map(u => u.name);
    }, [currentTenantId]);

    // Obtener procesos disponibles según la unidad seleccionada
    const dashboardAvailableProcesses = useMemo(() => {
        const allProjects = DB.projects.filter(p => p.tenantId === currentTenantId);
        const allFolders = DB.projectFolders.filter(f => f.tenantId === currentTenantId);

        const processesFromData = new Set<string>();

        allProjects.forEach((p: any) => {
            if (p.process) {
                if (dashboardFilterUnit === 'ALL' || p.unit === dashboardFilterUnit) {
                    processesFromData.add(p.process);
                }
            }
        });

        allFolders.forEach(f => {
            if (f.process) {
                if (dashboardFilterUnit === 'ALL' || f.unit === dashboardFilterUnit) {
                    processesFromData.add(f.process);
                }
            }
        });

        return Array.from(processesFromData).sort();
    }, [currentTenantId, dashboardFilterUnit]);

    // Resetear filtro de proceso cuando cambie la unidad
    useEffect(() => {
        setDashboardFilterProcess('ALL');
    }, [dashboardFilterUnit]);

    // Filtrar dashboards
    const filteredDashboards = useMemo(() => {
        return dashboards.filter(db => {
            const matchSearch = !dashboardSearchQuery ||
                db.title.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
                db.description.toLowerCase().includes(dashboardSearchQuery.toLowerCase());

            const matchUnit = dashboardFilterUnit === 'ALL' ||
                (dashboardFilterUnit === 'GLOBAL' && !db.unit) ||
                db.unit === dashboardFilterUnit;

            const matchProcess = dashboardFilterProcess === 'ALL' || db.process === dashboardFilterProcess;

            return matchSearch && matchUnit && matchProcess;
        });
    }, [dashboards, dashboardSearchQuery, dashboardFilterUnit, dashboardFilterProcess]);

    const updateDashboardProps = (id: string, updates: Partial<Dashboard>) => {
        setDashboards(dashboards.map(db => db.id === id ? { ...db, ...updates, updatedAt: 'Ahora' } : db));
        if (editingDashboard?.id === id) {
            setEditingDashboard({ ...editingDashboard, ...updates });
        }
    };

    const generateDashboardFromFolder = (folderDs: Dataset, metadata: { title: string, description: string, access: AccessLevel, unit?: string, process?: string }) => {
        const folderName = folderDs.title.replace('Carpeta: ', '');
        const newDb: Dashboard = {
            id: `DB-AUTO-${Date.now()}`,
            title: metadata.title || `Reporte ${folderName}`,
            description: metadata.description || `Análisis automático de proyectos en la carpeta ${folderName}`,
            updatedAt: 'Ahora',
            access: metadata.access,
            ownerId: 'me',
            views: 0,
            unit: metadata.unit,
            process: metadata.process,
            isAuto: true,
            sections: [
                {
                    id: 'sec-level-1',
                    title: 'Nivel 1: Resumen Ejecutivo',
                    columns: 2,
                    widgets: [
                        {
                            id: `w-cnt-${Date.now()}`, title: 'Actividades por Estado', layout: { x: 0, y: 0, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Estado Actividad' }
                        },
                        {
                            id: `w-dist-${Date.now()}`, title: 'Distribución Porcentual', layout: { x: 1, y: 0, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'PIE', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Estado Actividad' }
                        }
                    ]
                },
                {
                    id: 'sec-level-2',
                    title: 'Nivel 2: Comparativas',
                    columns: 3,
                    widgets: [
                        {
                            id: `w-stk-${Date.now()}`, title: 'Estado por Proyecto', layout: { x: 0, y: 0, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'BAR_STACKED', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Proyecto' }
                        },
                        {
                            id: `w-vol-${Date.now()}`, title: 'Volumen por Fase', layout: { x: 1, y: 0, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Fase' }
                        },
                        {
                            id: `w-chg-${Date.now()}`, title: 'Carga por Participante', layout: { x: 2, y: 0, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Responsable' }
                        }
                    ]
                },
                {
                    id: 'sec-level-3',
                    title: 'Nivel 3: Detalle y Tiempo',
                    columns: 1,
                    widgets: [
                        {
                            id: `w-map-${Date.now()}`, title: 'Mapa de Calor de Fases', layout: { x: 0, y: 0, w: 1, h: 3 },
                            config: { datasetId: folderDs.id, chartType: 'MATRIX', aggregation: 'MATRIX', valueColumn: 'Proyecto', groupColumn: 'Fase' }
                        },
                        {
                            id: `w-gnt-${Date.now()}`, title: 'Cronograma de Actividades (Gantt)', layout: { x: 0, y: 3, w: 1, h: 3 },
                            config: { datasetId: folderDs.id, chartType: 'GANTT', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Proyecto' }
                        },
                        {
                            id: `w-hst-${Date.now()}`, title: 'Histograma de Duración (Días)', layout: { x: 0, y: 6, w: 1, h: 2 },
                            config: { datasetId: folderDs.id, chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Actividad', groupColumn: 'Duración (Días)' }
                        }
                    ]
                }
            ]
        };
        setDashboards(prev => [newDb, ...prev]);
        setEditingDashboard(newDb);
        setView('EDITOR');
    };

    const createDashboard = (title: string, desc: string, isPublic: boolean, sourceFolderId?: string, unit?: string, process?: string) => {
        const access: AccessLevel = isPublic ? 'PUBLIC_ORG' : 'PRIVATE';

        if (sourceFolderId) {
            const ds = folderDatasets.find(d => d.id === sourceFolderId);
            if (ds) {
                generateDashboardFromFolder(ds, { title, description: desc, access, unit, process });
                setShowCreateDb(false);
                return;
            }
        }

        const newDb: Dashboard = {
            id: `DB-${Date.now()}`,
            title, description: desc, updatedAt: 'Ahora', access: isPublic ? 'PUBLIC_ORG' : 'PRIVATE',
            ownerId: 'me', views: 0,
            unit: unit === 'GLOBAL' ? undefined : unit,
            process: process || undefined,
            sections: [
                { id: 'sec-1', title: 'Principal', widgets: [] },
                {
                    id: 'sec-standard-analysis',
                    title: 'Análisis de Estructura (Global)',
                    columns: 1,
                    widgets: [
                        {
                            id: `w-std-1-${Date.now()}`, title: 'Distribución de Proyectos por Carpeta', layout: { x: 0, y: 0, w: 1, h: 2 },
                            config: { datasetId: 'DS-PROJ', chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Proyecto', groupColumn: 'Carpeta (Unidad)' }
                        },
                        {
                            id: `w-std-2-${Date.now()}`, title: 'Estado de Fases (%) - Promedio Global', layout: { x: 0, y: 2, w: 1, h: 2 },
                            config: { datasetId: 'DS-PROJ', chartType: 'MATRIX', aggregation: 'MATRIX', valueColumn: 'Progreso (%)', groupColumn: 'Fase' }
                        }
                    ]
                }
            ]
        };
        setDashboards(prev => [newDb, ...prev]);
        setEditingDashboard(newDb);
        setView('EDITOR');
        setShowCreateDb(false);
    };

    const generateDashboardFromUpload = (ds: Dataset) => {
        const widgets: Widget[] = [];

        // Identify column types
        const stringCols = ds.columns.filter(c => c.type === 'STRING');
        const numberCols = ds.columns.filter(c => c.type === 'NUMBER');

        // Primary categorical column (first string column)
        const primaryCat = stringCols[0];
        // Primary numeric column (first number column)
        const primaryNum = numberCols[0];

        // Row 1: KPIs (compact, top row)
        widgets.push({
            id: `w-kpi1-${Date.now()}`,
            title: 'Total Registros',
            layout: { x: 0, y: 0, w: 1, h: 1 },
            config: {
                datasetId: ds.id,
                chartType: 'KPI',
                aggregation: 'COUNT',
                valueColumn: primaryCat ? primaryCat.name : ds.columns[0].name
            }
        });

        if (primaryNum) {
            widgets.push({
                id: `w-kpi2-${Date.now()}`,
                title: `Total ${primaryNum.name}`,
                layout: { x: 1, y: 0, w: 1, h: 1 },
                config: {
                    datasetId: ds.id,
                    chartType: 'KPI',
                    aggregation: 'SUM',
                    valueColumn: primaryNum.name
                }
            });

            widgets.push({
                id: `w-kpi3-${Date.now()}`,
                title: `Promedio ${primaryNum.name}`,
                layout: { x: 2, y: 0, w: 1, h: 1 },
                config: {
                    datasetId: ds.id,
                    chartType: 'KPI',
                    aggregation: 'AVG',
                    valueColumn: primaryNum.name
                }
            });
        }

        // Row 2: Main visualizations
        if (primaryCat) {
            // Bar chart - distribution
            widgets.push({
                id: `w-bar-${Date.now()}`,
                title: `Distribución por ${primaryCat.name}`,
                layout: { x: 0, y: 1, w: 2, h: 2 }, // Adjusted for 3-col grid
                config: {
                    datasetId: ds.id,
                    chartType: 'BAR',
                    aggregation: 'COUNT',
                    valueColumn: primaryCat.name,
                    groupColumn: primaryCat.name
                }
            });

            // Donut chart - proportions
            widgets.push({
                id: `w-donut-${Date.now()}`,
                title: `Proporción ${primaryCat.name}`,
                layout: { x: 2, y: 1, w: 1, h: 2 }, // Adjusted for 3-col grid
                config: {
                    datasetId: ds.id,
                    chartType: 'DONUT',
                    aggregation: 'COUNT',
                    valueColumn: primaryCat.name,
                    groupColumn: primaryCat.name
                }
            });
        }

        // Row 3: Advanced analysis (if numeric data exists)
        if (primaryNum && primaryCat) {
            widgets.push({
                id: `w-analysis-${Date.now()}`,
                title: `${primaryNum.name} por ${primaryCat.name}`,
                layout: { x: 0, y: 3, w: 3, h: 2 }, // Adjusted for 3-col grid
                config: {
                    datasetId: ds.id,
                    chartType: 'BAR',
                    aggregation: 'SUM',
                    valueColumn: primaryNum.name,
                    groupColumn: primaryCat.name
                }
            });
        }

        const newDb: Dashboard = {
            id: `DB-UPL-${Date.now()}`,
            title: `Análisis: ${ds.title.replace('.xls', '').replace('.csv', '')}`,
            description: 'Tablero generado automáticamente desde archivo',
            updatedAt: 'Ahora',
            access: 'PRIVATE',
            ownerId: 'me',
            views: 0,
            sections: [
                {
                    id: 'sec-1',
                    title: 'Vista de Datos',
                    widgets: widgets
                },
                {
                    id: 'sec-standard-analysis',
                    title: 'Análisis de Estructura (Global)',
                    columns: 1,
                    widgets: [
                        {
                            id: `w-std-1-${Date.now()}`, title: 'Distribución de Proyectos por Carpeta', layout: { x: 0, y: 0, w: 1, h: 2 },
                            config: { datasetId: 'DS-PROJ', chartType: 'BAR', aggregation: 'COUNT', valueColumn: 'Proyecto', groupColumn: 'Carpeta (Unidad)' }
                        },
                        {
                            id: `w-std-2-${Date.now()}`, title: 'Estado de Fases (%) - Promedio Global', layout: { x: 0, y: 2, w: 1, h: 2 },
                            config: { datasetId: 'DS-PROJ', chartType: 'MATRIX', aggregation: 'MATRIX', valueColumn: 'Progreso (%)', groupColumn: 'Fase' }
                        }
                    ]
                }
            ]
        };

        setDashboards([newDb, ...dashboards]);
        setEditingDashboard(newDb);
        setView('EDITOR');
    };

    const createDataset = (title: string, source: any, fileOrId?: any) => {
        if (source === 'FILE' && fileOrId instanceof File) {
            const file = fileOrId;
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                let columns: DataColumn[] = [];
                let dataRows: any[] = [];
                let rowsCount = 0;

                // Simple HTML XLS Parser (or CSV)
                if (text.includes('<table')) {
                    // Parse HTML Table
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const table = doc.querySelector('table');
                    if (table) {
                        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || 'Col');
                        const rows = Array.from(table.querySelectorAll('tbody tr'));

                        // Guess types
                        const firstRowCells = rows[0]?.querySelectorAll('td');
                        columns = headers.map((h, i) => {
                            const val = firstRowCells?.[i]?.textContent?.trim();
                            const isNum = !isNaN(parseFloat(val || 'a'));
                            return { name: h, type: isNum ? 'NUMBER' : 'STRING' };
                        });

                        dataRows = rows.map(r => {
                            const cells = Array.from(r.querySelectorAll('td'));
                            const rowObj: any = {};
                            headers.forEach((h, i) => {
                                rowObj[h] = cells[i]?.textContent?.trim() || '';
                            });
                            return rowObj;
                        });
                        rowsCount = dataRows.length;
                    }
                } else {
                    // CSV fallback
                    const lines = text.split('\n').filter(l => l.trim());
                    if (lines.length > 0) {
                        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
                        columns = headers.map(h => ({ name: h, type: 'STRING' }));
                        dataRows = lines.slice(1).map(l => {
                            const vals = l.split(',');
                            const rowObj: any = {};
                            headers.forEach((h, i) => rowObj[h] = vals[i]?.replace(/"/g, '').trim());
                            return rowObj;
                        });
                        rowsCount = dataRows.length;
                    }
                }

                const newDs: Dataset = {
                    id: `DS-${Date.now()}`,
                    title: title || file.name,
                    sourceType: 'UPLOAD',
                    rows: rowsCount,
                    size: `${Math.round(file.size / 1024)}KB`,
                    updatedAt: 'Ahora',
                    access: 'PRIVATE',
                    ownerId: 'me',
                    columns: columns,
                    _data: dataRows
                };

                setDatasets([newDs, ...datasets]);
                setShowCreateDs(false);
            };
            reader.readAsText(fileOrId);
        } else {
            // Handle Linked Sources
            let columns: DataColumn[] = [{ name: 'ID', type: 'STRING' }];
            let rowsCount = Math.floor(Math.random() * 500) + 50;
            let size = '120KB';

            if (source === 'PROJECTS') {
                columns = [
                    { name: 'Fase', type: 'STRING' },
                    { name: 'Actividad', type: 'STRING' },
                    { name: 'Responsable', type: 'STRING' },
                    { name: 'Progreso (%)', type: 'NUMBER' },
                    { name: 'Días Estimados', type: 'NUMBER' },
                    { name: 'Estado', type: 'STRING' }
                ];
            } else if (source === 'REPOSITORY') {
                columns = [
                    { name: 'Archivo', type: 'STRING' },
                    { name: 'Tipo', type: 'STRING' },
                    { name: 'Tamaño (MB)', type: 'NUMBER' },
                    { name: 'Fecha Lectura', type: 'DATE' },
                    { name: 'Contenido Extraído', type: 'STRING' }
                ];
            } else if (source === 'STORAGE') {
                columns = [
                    { name: 'Archivo Externo', type: 'STRING' },
                    { name: 'Folder Path', type: 'STRING' },
                    { name: 'Metadata Tag', type: 'STRING' },
                    { name: 'Size', type: 'NUMBER' }
                ];
            }

            const newDs: Dataset = {
                id: `DS-${Date.now()}`,
                title,
                sourceType: source as any,
                rows: rowsCount,
                size,
                updatedAt: 'Ahora',
                access: 'PRIVATE',
                ownerId: 'me',
                columns: columns
            };
            setDatasets([newDs, ...datasets]);
            setShowCreateDs(false);
        }
    };

    const saveDashboard = (db: Dashboard) => {
        setDashboards(prev => prev.map(d => d.id === db.id ? db : d));
    };

    const deleteDashboard = (id: string) => {
        setDashboards(prev => prev.filter(d => d.id !== id));
    };

    // -- Views --

    if (view === 'EDITOR' && editingDashboard) {
        return (
            <DashboardBuilder
                dashboard={editingDashboard}
                datasets={allDatasets}
                contextData={contextData}
                onSave={saveDashboard}
                onBack={() => { setView('HUB'); setEditingDashboard(null); }}
                filters={filters}
                setFilters={setFilters}
            />
        );
    }

    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    #sidebar, .topbar, .no-print, aside, header {
                        display: none !important;
                    }
                    body, html, main, .content, #__next {
                        background: white !important;
                        height: auto !important;
                        overflow: visible !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .canvas-print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                        background: white !important;
                    }
                    .max-w-7xl {
                        max-width: 100% !important;
                    }
                    .flex-1 {
                        overflow: visible !important;
                    }
                }
            `}} />
            {/* Header / CTA Layer */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ChartPieSlice className="text-purple-600" weight="duotone" />
                        Analytics Studio
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Plataforma de Datos e Inteligencia de Negocios.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCreateDs(true)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
                        <Database size={18} /> Crear Dataset
                    </button>
                    <button onClick={() => setShowCreateDb(true)} className="btn bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20">
                        <PresentationChart size={18} weight="bold" /> Crear Tablero
                    </button>
                </div>
            </div>

            {/* Navigation Tabs (Layer 5) */}
            <div className="flex border-b border-slate-200 mb-6">
                <button onClick={() => setActiveTab('DASHBOARDS')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DASHBOARDS' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    <PresentationChart size={18} /> Mis Tableros
                </button>
                <button onClick={() => setActiveTab('DATASETS')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DATASETS' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    <Database size={18} /> Catálogo de Datos
                </button>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'DASHBOARDS' ? (
                    <>
                        {/* Filtros de Dashboards */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Búsqueda */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar tablero..."
                                    className="w-full pl-3 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={dashboardSearchQuery}
                                    onChange={e => setDashboardSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filtro de Unidad */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-purple-500 text-slate-600"
                                    value={dashboardFilterUnit}
                                    onChange={e => setDashboardFilterUnit(e.target.value)}
                                >
                                    <option value="ALL">Todas las Unidades</option>
                                    <option value="GLOBAL">Globales</option>
                                    {dashboardAvailableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>

                            {/* Filtro de Proceso */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-purple-500 text-slate-600"
                                    value={dashboardFilterProcess}
                                    onChange={e => setDashboardFilterProcess(e.target.value)}
                                >
                                    <option value="ALL">Todos los Procesos</option>
                                    {dashboardAvailableProcesses.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredDashboards.map(db => (
                                <DashboardCard
                                    key={db.id}
                                    dashboard={db}
                                    onClick={() => { setEditingDashboard(db); setView('EDITOR'); }}
                                    onDelete={deleteDashboard}
                                    onEdit={() => setEditingDashboardPropsId(db.id)}
                                    onShare={() => setSharingDashboard(db)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <DatasetCatalog datasets={allDatasets} onNormalize={setEditingNormDataset} />
                )}
            </div>

            {/* Modals */}
            {showCreateDb && <CreateDashboardModal onClose={() => setShowCreateDb(false)} onCreate={createDashboard} folderDatasets={folderDatasets} />}
            {showCreateDs && <CreateDatasetModal onClose={() => setShowCreateDs(false)} onCreate={createDataset} />}

            {editingDashboardPropsId && (() => {
                const db = dashboards.find(d => d.id === editingDashboardPropsId);
                return db ? (
                    <EditDashboardPropertiesModal
                        dashboard={db}
                        onClose={() => setEditingDashboardPropsId(null)}
                        onSave={(updates: any) => {
                            updateDashboardProps(db.id, updates);
                            setEditingDashboardPropsId(null);
                        }}
                    />
                ) : null;
            })()}

            {sharingDashboard && (
                <ShareDashboardModal
                    dashboard={sharingDashboard}
                    onClose={() => setSharingDashboard(null)}
                    users={contextData.users}
                />
            )}

            {editingNormDataset && (
                <NormalizeDatasetModal
                    dataset={editingNormDataset}
                    onClose={() => setEditingNormDataset(null)}
                    onSave={(updatedDs: Dataset) => {
                        setDatasets(prev => prev.map(ds => ds.id === updatedDs.id ? updatedDs : ds));
                        setEditingNormDataset(null);
                    }}
                />
            )}
        </div>
    );
}

// --- SUBVIEWS & COMPONENTS ---

function DashboardBuilder({ dashboard, datasets, contextData, onSave, onBack, filters, setFilters }: {
    dashboard: Dashboard,
    datasets: Dataset[],
    contextData: any,
    onSave: (d: Dashboard) => void,
    onBack: () => void,
    filters: Record<string, string>,
    setFilters: (f: Record<string, string>) => void
}) {
    // Use all available datasets inside builder too
    const [localDb, setLocalDb] = useState(dashboard);
    const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
    const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const [maximizedWidgetId, setMaximizedWidgetId] = useState<string | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    const handleSave = () => {
        onSave(localDb);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 3000);
    };

    const addSection = () => {
        const newSection: DashboardSection = {
            id: `SEC-${Date.now()}`,
            title: 'NUEVA SECCIÓN',
            widgets: []
        };
        setLocalDb({ ...localDb, sections: [...localDb.sections, newSection] });
    };

    const removeSection = (sectionId: string) => {
        setLocalDb({ ...localDb, sections: localDb.sections.filter(s => s.id !== sectionId) });
    };

    const updateSectionTitle = (sectionId: string, title: string) => {
        setLocalDb({
            ...localDb,
            sections: localDb.sections.map(s => s.id === sectionId ? { ...s, title } : s)
        });
    };

    const updateSectionColumns = (sectionId: string, columns: number) => {
        setLocalDb({
            ...localDb,
            sections: localDb.sections.map(s => s.id === sectionId ? { ...s, columns } : s)
        });
    };

    const addWidgetToSection = (sectionId: string) => {
        const newWidget: Widget = {
            id: `W-${Date.now()}`,
            title: 'Nueva Visualización',
            layout: { x: 0, y: 0, w: 1, h: 2 },
            config: {
                datasetId: datasets[0].id,
                chartType: 'MATRIX',
                aggregation: 'MATRIX',
                valueColumn: datasets[0].columns[0].name,
                groupColumn: datasets[0].columns[1]?.name
            }
        };
        setLocalDb({
            ...localDb,
            sections: localDb.sections.map(s => s.id === sectionId ? { ...s, widgets: [...s.widgets, newWidget] } : s)
        });
        setSelectedWidgetId(newWidget.id);
    };

    const updateWidget = (id: string, updates: Partial<Widget> | Partial<WidgetConfig>) => {
        setLocalDb({
            ...localDb,
            sections: localDb.sections.map(s => ({
                ...s,
                widgets: s.widgets.map(w => {
                    if (w.id !== id) return w;
                    if ('datasetId' in updates || 'chartType' in updates || 'aggregation' in updates || 'valueColumn' in updates || 'groupColumn' in updates) {
                        return { ...w, config: { ...w.config, ...updates } as WidgetConfig };
                    }
                    return { ...w, ...updates };
                })
            }))
        });
    };

    const removeWidget = (id: string) => {
        setLocalDb({
            ...localDb,
            sections: localDb.sections.map(s => ({
                ...s,
                widgets: s.widgets.filter(w => w.id !== id)
            }))
        });
        if (selectedWidgetId === id) setSelectedWidgetId(null);
    };

    const handleDragStart = (e: React.DragEvent, widgetId: string) => {
        setDraggedWidgetId(widgetId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', widgetId);
    };

    const handleDragOver = (e: React.DragEvent, targetWidgetId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropTargetId(targetWidgetId);
    };

    const handleDragLeave = () => {
        setDropTargetId(null);
    };

    const handleDrop = (e: React.DragEvent, targetWidgetId: string, targetSectionId?: string) => {
        e.preventDefault();

        if (!draggedWidgetId) {
            setDraggedWidgetId(null);
            setDropTargetId(null);
            return;
        }

        let draggedWidget: Widget | null = null;
        let sourceSectionId: string | null = null;

        // Find the widget and its source section
        localDb.sections.forEach(s => {
            const w = s.widgets.find(w => w.id === draggedWidgetId);
            if (w) {
                draggedWidget = w;
                sourceSectionId = s.id;
            }
        });

        if (!draggedWidget) return;

        const updatedSections = localDb.sections.map(s => {
            let newWidgets = [...s.widgets];
            const isSourceSection = s.id === sourceSectionId;
            const isTargetSection = targetSectionId ? s.id === targetSectionId : s.widgets.some(w => w.id === targetWidgetId);

            // Remove from source
            if (isSourceSection) {
                newWidgets = newWidgets.filter(w => w.id !== draggedWidgetId);
            }

            // Add to target
            if (isTargetSection) {
                if (targetWidgetId && !targetSectionId) {
                    const targetIndex = newWidgets.findIndex(w => w.id === targetWidgetId);
                    newWidgets.splice(targetIndex, 0, draggedWidget!);
                } else {
                    // Dropped on section head or empty section
                    newWidgets.push(draggedWidget!);
                }
            }

            return { ...s, widgets: newWidgets };
        });

        setLocalDb({ ...localDb, sections: updatedSections });
        setDraggedWidgetId(null);
        setDropTargetId(null);
    };

    const handleDragEnd = () => {
        setDraggedWidgetId(null);
        setDropTargetId(null);
    };

    const downloadWidgetData = (widget: Widget, data: any) => {
        if (!data) return;

        if (data.type === 'MATRIX') {
            // Generate Styled Excel (HTML)
            const headers = ['Proyecto', 'Progreso Total', ...Array.from({ length: data.maxPhases }, (_, i) => `Fase ${i + 1}`)];

            let html = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta charset="utf-8">
                    <style>
                        table { border-collapse: collapse; font-family: sans-serif; }
                        th { background-color: #7c3aed; color: white; border: 1px solid #ddd; padding: 10px; }
                        td { border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 12px; }
                        .project-cell { text-align: left; font-weight: bold; background-color: #f8fafc; }
                        .progress-high { background-color: #10b981; color: white; }
                        .progress-mid { background-color: #8b5cf6; color: white; }
                        .progress-low { background-color: #f1f5f9; color: #64748b; }
                        .team { font-size: 10px; color: #475569; display: block; margin-top: 4px; }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${data.rows.map((row: any) => `
                                <tr>
                                    <td class="project-cell">${row.project}</td>
                                    <td>${row.progress}%</td>
                                    ${Array.from({ length: data.maxPhases }, (_, i) => {
                const ph = row.phases[i];
                if (!ph) return '<td>-</td>';
                const colorClass = ph.progress >= 80 ? 'progress-high' : ph.progress >= 20 ? 'progress-mid' : 'progress-low';
                return `<td class="${colorClass}">
                                            <div><strong>${ph.name}</strong></div>
                                            <div>${ph.progress}%</div>
                                            <div class="team">${ph.team || ''}</div>
                                        </td>`;
            }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `.replace(/>\s+</g, '><');

            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const link = document.body.appendChild(document.createElement('a'));
            link.href = url;
            link.download = `${widget.title}.xls`;
            link.click();
            document.body.removeChild(link);
            return;
        }

        // Standard CSV Export for other types
        let csvContent = "data:text/csv;charset=utf-8,";
        const bom = "\uFEFF";
        csvContent += bom;

        if (data.labels && data.data) {
            csvContent += "Etiqueta,Valor\n";
            data.labels.forEach((l: string, i: number) => {
                csvContent += `"${l}",${data.data[i]}\n`;
            });
        } else if (data.value) {
            csvContent += "KPI,Valor\n";
            csvContent += `"${data.label}","${data.value}"\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.body.appendChild(document.createElement('a'));
        link.href = encodedUri;
        link.download = `${widget.title}.csv`;
        link.click();
        document.body.removeChild(link);
    };

    // Selected Widget
    const selectedWidget = localDb.sections.flatMap(s => s.widgets).find(w => w.id === selectedWidgetId);

    return (
        <div className="flex h-full bg-slate-100 overflow-hidden print:bg-white print:overflow-visible relative">
            {/* Sidebar Controls */}
            <div className={`bg-white border-r border-slate-200 flex flex-col shadow-xl z-20 no-print print:hidden transition-all duration-300 ${isEditorCollapsed ? 'w-0 overflow-hidden border-none' : 'w-80'}`}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded" title="Volver"><X size={20} /></button>
                        <span className="font-bold text-slate-700">Editor</span>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => setShowShareModal(true)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Compartir Tablero"><ShareNetwork size={18} /></button>
                        <button onClick={() => { setIsEditorCollapsed(true); setTimeout(() => window.print(), 300); }} className="text-slate-500 hover:bg-slate-50 p-1.5 rounded" title="Imprimir / PDF"><Printer size={18} /></button>
                        <button
                            onClick={handleSave}
                            className={`${justSaved ? 'text-green-600 bg-green-50' : 'text-purple-600 hover:bg-purple-50'} p-1.5 rounded transition-all flex items-center gap-1`}
                            title="Guardar"
                        >
                            {justSaved ? <Check size={18} weight="bold" /> : <FloppyDisk size={18} />}
                            {justSaved && <span className="text-[10px] font-bold">GUARDADO</span>}
                        </button>
                        <button onClick={() => setIsEditorCollapsed(true)} className="text-slate-400 hover:bg-slate-50 p-1.5 rounded ml-1" title="Contraer Editor"><CaretLeft size={18} weight="bold" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {selectedWidget ? (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">Configurar Visual</h3>
                                <button onClick={() => removeWidget(selectedWidget.id)} className="text-red-500 text-xs hover:underline">Eliminar</button>
                            </div>

                            <div>
                                <label className="label">Título</label>
                                <input className="input" value={selectedWidget.title} onChange={e => updateWidget(selectedWidget.id, { title: e.target.value })} />
                            </div>

                            <div>
                                <label className="label">Tipo de Gráfico</label>
                                <div className="space-y-3 h-64 overflow-y-auto pr-1 custom-scrollbar">
                                    {Object.entries(CHART_CATEGORIES).map(([cat, types]) => (
                                        <div key={cat}>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{cat}</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {types.map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => updateWidget(selectedWidget.id, { chartType: t as any })}
                                                        className={`p-1.5 rounded border text-center text-[10px] font-bold truncate transition-all ${selectedWidget.config.chartType === t ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-purple-300'}`}
                                                        title={t}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <label className="label">Fuente de Datos</label>
                                <select
                                    className="select"
                                    value={selectedWidget.config.datasetId}
                                    onChange={e => updateWidget(selectedWidget.id, { datasetId: e.target.value })}
                                >
                                    {datasets.map(ds => <option key={ds.id} value={ds.id}>{ds.title}</option>)}
                                </select>
                            </div>

                            {/* Logic Builder */}
                            <div>
                                <label className="label">Agregación (Operación)</label>
                                <div className="flex rounded-md shadow-sm">
                                    {['COUNT', 'SUM', 'AVG'].map(agg => (
                                        <button key={agg} onClick={() => updateWidget(selectedWidget.id, { aggregation: agg as any })} className={`flex-1 py-1 text-xs border ${selectedWidget.config.aggregation === agg ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}>{agg}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">Columna Valor</label>
                                <select className="select" value={selectedWidget.config.valueColumn} onChange={e => {
                                    const col = datasets.find(d => d.id === selectedWidget.config.datasetId)?.columns.find(c => c.name === e.target.value);
                                    let newAgg = selectedWidget.config.aggregation;
                                    if (col?.type === 'STRING') newAgg = 'COUNT'; // Force count for strings
                                    updateWidget(selectedWidget.id, { valueColumn: e.target.value, aggregation: newAgg });
                                }}>
                                    {datasets.find(d => d.id === selectedWidget.config.datasetId)?.columns.map(c => (
                                        <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
                                    ))}
                                </select>
                            </div>

                            {selectedWidget.config.chartType !== 'KPI' && (
                                <div>
                                    <label className="label">Agrupar Por (Eje X)</label>
                                    <select className="select" value={selectedWidget.config.groupColumn} onChange={e => updateWidget(selectedWidget.id, { groupColumn: e.target.value })}>
                                        {datasets.find(d => d.id === selectedWidget.config.datasetId)?.columns.map(c => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-10">
                            <p className="text-sm">Selecciona un componente del canvas para editar sus propiedades.</p>
                            <button onClick={() => addWidgetToSection(localDb.sections[0]?.id || 'sec-1')} className="mt-4 btn btn-primary w-full justify-center">
                                <Plus weight="bold" /> Añadir Componente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 canvas-print-area print:p-0 print:bg-white relative" onClick={() => setSelectedWidgetId(null)}>
                {isEditorCollapsed && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditorCollapsed(false); }}
                        className="fixed left-4 top-20 z-30 bg-white border border-slate-200 shadow-xl p-2 rounded-full text-purple-600 hover:bg-purple-50 transition-all animate-bounceIn no-print"
                        title="Expandir Editor"
                    >
                        <CaretRight size={20} weight="bold" />
                    </button>
                )}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{localDb.title}</h1>
                            {localDb.description && <p className="text-sm text-slate-500 mt-1">{localDb.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge flex gap-1 items-center bg-white border border-slate-200 shadow-sm">
                                {localDb.access === 'PRIVATE' ? <Lock size={12} /> : localDb.access === 'SHARED' ? <Users size={12} /> : <Globe size={12} />}
                                {localDb.access}
                            </span>
                        </div>
                    </div>


                    {/* Filters Bar - Dynamic based on dataset */}
                    {(() => {
                        // Get primary dataset from first widget of first section
                        const primaryDatasetId = localDb.sections[0]?.widgets[0]?.config?.datasetId;
                        const primaryDataset = datasets.find(d => d.id === primaryDatasetId);

                        if (!primaryDataset) return null;

                        // Extract unique values from dataset columns
                        const getUniqueValues = (columnName: string) => {
                            if (primaryDataset.sourceType === 'PROJECTS' && contextData.projects) {
                                const values = new Set<string>();
                                const statusMap: any = { 'COMPLETED': 'Completado', 'IN_PROGRESS': 'En Proceso', 'NOT_STARTED': 'Sin Iniciar' };

                                // Fix: Filter projects by folder if the dataset has a folder filter
                                const scopeProjects = (primaryDataset as any)._filterFolderId
                                    ? contextData.projects.filter((p: any) => p.folderId === (primaryDataset as any)._filterFolderId)
                                    : contextData.projects;

                                scopeProjects.forEach((p: any) => {
                                    if (columnName === 'Proyecto') values.add(p.title);
                                    if (columnName === 'Estado') values.add(statusMap[p.status] || p.status);
                                    if (columnName === 'Folder') values.add(p.folderId);
                                    p.phases?.forEach((ph: any) => {
                                        if (columnName === 'Fase') values.add(ph.name);
                                        if (columnName === 'Estado Fase') values.add(statusMap[ph.status] || ph.status);
                                        ph.activities?.forEach((act: any) => {
                                            if (columnName === 'Actividad') values.add(act.name);
                                            if (columnName === 'Estado Actividad') values.add(statusMap[act.status] || act.status);
                                            if (columnName === 'Responsable') {
                                                act.participants?.forEach((u: any) => {
                                                    const userId = typeof u === 'string' ? u : (u.userId || u.id);
                                                    const user = contextData.users.find((user: any) => user.id === userId);
                                                    values.add(user ? user.name : userId);
                                                });
                                            }
                                        });
                                    });
                                });
                                return Array.from(values).filter(Boolean);
                            } else if (primaryDataset.sourceType === 'UPLOAD' && primaryDataset._data) {
                                // For uploaded datasets, extract from _data
                                const values = new Set<string>();
                                primaryDataset._data.forEach((row: any) => {
                                    if (row[columnName]) values.add(String(row[columnName]));
                                });
                                return Array.from(values).filter(Boolean);
                            }
                            return [];
                        };

                        // Identify filterable columns (STRING type)
                        const filterableColumns = primaryDataset.columns
                            .filter(col => col.type === 'STRING')
                            .slice(0, 3); // Limit to 3 filters max

                        return (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Funnel size={16} className="text-purple-600" />
                                        Filtros:
                                    </div>

                                    {filterableColumns.map((column, idx) => {
                                        const uniqueValues = getUniqueValues(column.name);
                                        const filterKey = `filter_${idx}` as keyof typeof filters;

                                        return (
                                            <select
                                                key={column.name}
                                                value={filters[filterKey] || 'all'}
                                                onChange={(e) => setFilters({ ...filters, [filterKey]: e.target.value })}
                                                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            >
                                                <option value="all">Todos ({column.name})</option>
                                                {uniqueValues.map((val: any, vidx) => (
                                                    <option key={`${val}-${vidx}`} value={String(val)}>{String(val)}</option>
                                                ))}
                                            </select>
                                        );
                                    })}

                                    {Object.values(filters).some(v => v !== 'all') && (
                                        <button
                                            onClick={() => setFilters({})}
                                            className="text-xs text-purple-600 hover:text-purple-700 font-medium ml-auto flex items-center gap-1"
                                        >
                                            <X size={14} /> Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })()}


                    <div className="space-y-12 pb-20 mt-8">
                        {localDb.sections.map((section) => (
                            <div
                                key={section.id}
                                className="space-y-4"
                                onDragOver={(e) => section.widgets.length === 0 && e.preventDefault()}
                                onDrop={(e) => section.widgets.length === 0 && handleDrop(e, '', section.id)}
                            >
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-sm shadow-purple-200"></div>
                                        <input
                                            value={section.title}
                                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                            className="text-lg font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 w-64 placeholder:text-slate-300"
                                            placeholder="Título de la Sección"
                                        />

                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg ml-2">
                                            {[1, 2, 3].map(cols => (
                                                <button
                                                    key={cols}
                                                    onClick={() => updateSectionColumns(section.id, cols)}
                                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${(section.columns || 3) === cols ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    {cols} {cols === 1 ? 'Col' : 'Cols'}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => removeSection(section.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            title="Eliminar Sección"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => addWidgetToSection(section.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                                    >
                                        <Plus size={16} weight="bold" /> Añadir Visualización
                                    </button>
                                </div>

                                <div className={`grid gap-6 ${(section.columns || 3) === 1 ? 'grid-cols-1' :
                                    (section.columns || 3) === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    }`}>
                                    {section.widgets.map((widget) => {
                                        const ds = datasets.find(d => d.id === widget.config.datasetId);
                                        const data = ds ? runQuery(widget.config, ds, contextData, filters) : null;

                                        return (
                                            <div
                                                key={widget.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, widget.id)}
                                                onDragOver={(e) => handleDragOver(e, widget.id)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, widget.id)}
                                                onClick={(e) => { e.stopPropagation(); setSelectedWidgetId(widget.id); }}
                                                className={`bg-white rounded-2xl shadow-sm border-2 transition-all relative group flex flex-col overflow-hidden h-[380px] ${selectedWidgetId === widget.id ? 'border-purple-500 ring-4 ring-purple-50 shadow-md' : 'border-transparent hover:border-slate-200'} ${draggedWidgetId === widget.id ? 'opacity-40 grayscale scale-95' : ''} ${dropTargetId === widget.id ? 'border-purple-400 border-dashed scale-[1.03] bg-purple-50/50' : ''}`}
                                            >
                                                {/* Widget Header */}
                                                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                                        <div className="cursor-move text-slate-300 hover:text-slate-500 transition-colors p-1 rounded hover:bg-slate-50">
                                                            <DotsSixVertical size={16} weight="bold" />
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-sm truncate">{widget.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setMaximizedWidgetId(widget.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title="Maximizar"
                                                        >
                                                            <ArrowsOut size={14} weight="bold" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); downloadWidgetData(widget, data); }}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Exportar CSV"
                                                        >
                                                            <DownloadSimple size={14} weight="bold" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash size={14} weight="bold" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Widget Body */}
                                                <div className="flex-1 p-4 overflow-hidden flex flex-col relative">
                                                    {data ? (
                                                        <>
                                                            {widget.config.chartType === 'KPI' && (
                                                                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fadeIn">
                                                                    <div className="text-5xl font-black text-slate-900 mb-2 drop-shadow-sm">{data.value}</div>
                                                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-slate-100 px-2 py-1 rounded-full">{data.label}</div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'BAR' && (
                                                                <div className="flex-1 flex flex-col pt-2">
                                                                    <div className="flex-1 flex items-end gap-2 px-2 pb-2 w-full min-h-[150px]">
                                                                        {data.labels.map((l: string, i: number) => {
                                                                            const max = Math.max(...data.data, 1);
                                                                            const height = (data.data[i] / max) * 100;
                                                                            return (
                                                                                <div key={i} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                                                                                    <div
                                                                                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500 group-hover/bar:from-purple-500 group-hover/bar:to-purple-300 shadow-sm relative min-h-[2px]"
                                                                                        style={{ height: `${Math.max(height, 2)}%` }}
                                                                                    >
                                                                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl font-bold">
                                                                                            {data.data[i]}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <div className="flex justify-between gap-1 px-1 border-t border-slate-50 pt-2">
                                                                        {data.labels.map((l: string, i: number) => (
                                                                            <span key={i} className="flex-1 text-[8px] text-slate-400 truncate text-center font-bold" title={l}>
                                                                                {l.substring(0, 8)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'PIE' && (
                                                                <div className="flex-1 flex items-center justify-center gap-6 p-4">
                                                                    <div className="relative w-36 h-36 flex-shrink-0">
                                                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 filter drop-shadow-md">
                                                                            {data.data.reduce((acc: any, val: number, i: number) => {
                                                                                const total = data.data.reduce((a: any, b: any) => a + b, 0);
                                                                                const startPercent = acc.totalPercent;
                                                                                const percent = (val / total) * 100;
                                                                                acc.totalPercent += percent;

                                                                                const x1 = 50 + 40 * Math.cos(2 * Math.PI * startPercent / 100);
                                                                                const y1 = 50 + 40 * Math.sin(2 * Math.PI * startPercent / 100);
                                                                                const x2 = 50 + 40 * Math.cos(2 * Math.PI * acc.totalPercent / 100);
                                                                                const y2 = 50 + 40 * Math.sin(2 * Math.PI * acc.totalPercent / 100);

                                                                                const largeArcFlag = percent > 50 ? 1 : 0;
                                                                                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                                                                                acc.paths.push(
                                                                                    <path
                                                                                        key={i}
                                                                                        d={pathData}
                                                                                        fill={['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 6]}
                                                                                        className="hover:opacity-80 transition-opacity cursor-pointer group/pie"
                                                                                    >
                                                                                        <title>{data.labels[i]}: {val} ({Math.round(percent)}%)</title>
                                                                                    </path>
                                                                                );
                                                                                return acc;
                                                                            }, { totalPercent: 0, paths: [] }).paths}
                                                                            <circle cx="50" cy="50" r="20" fill="white" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                                        {data.labels.map((l: string, i: number) => {
                                                                            const total = data.data.reduce((a: any, b: any) => a + b, 0);
                                                                            const percentage = Math.round((data.data[i] / total) * 100);
                                                                            return (
                                                                                <div key={i} className="flex items-center justify-between gap-3 group/row">
                                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                                        <div className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 6] }}></div>
                                                                                        <span className="text-[10px] text-slate-600 font-medium truncate">{l}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                                        <span className="text-[10px] font-bold text-slate-900">{percentage}%</span>
                                                                                        <span className="text-[8px] text-slate-400">({data.data[i]})</span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'RADAR' && (
                                                                <div className="flex items-center justify-center p-2 flex-1 overflow-hidden">
                                                                    <svg viewBox="-120 -120 240 240" className="w-full h-full max-w-[280px] max-h-[280px]">
                                                                        {[20, 40, 60, 80, 100].map(r => (
                                                                            <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                                                                        ))}
                                                                        {data.labels.map((_: any, i: number) => {
                                                                            const angle = (Math.PI * 2 * i) / data.labels.length;
                                                                            const x = Math.cos(angle - Math.PI / 2) * 100;
                                                                            const y = Math.sin(angle - Math.PI / 2) * 100;
                                                                            return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#cbd5e1" strokeWidth="0.5" />;
                                                                        })}
                                                                        <polygon
                                                                            points={data.labels.map((l: string, i: number) => {
                                                                                const val = data.data[i] || 0;
                                                                                const r = (val / 100) * 100;
                                                                                const angle = (Math.PI * 2 * i) / data.labels.length;
                                                                                const x = Math.cos(angle - Math.PI / 2) * r;
                                                                                const y = Math.sin(angle - Math.PI / 2) * r;
                                                                                return `${x},${y}`;
                                                                            }).join(' ')}
                                                                            fill="rgba(139, 92, 246, 0.15)"
                                                                            stroke="#8b5cf6"
                                                                            strokeWidth="2.5"
                                                                        />
                                                                        {data.labels.map((l: string, i: number) => {
                                                                            const angle = (Math.PI * 2 * i) / data.labels.length;
                                                                            const x = Math.cos(angle - Math.PI / 2) * 115;
                                                                            const y = Math.sin(angle - Math.PI / 2) * 115;
                                                                            const truncated = l.length > 12 ? l.substring(0, 10) + '...' : l;
                                                                            return (
                                                                                <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="8" fontWeight="600">
                                                                                    {truncated}
                                                                                </text>
                                                                            );
                                                                        })}
                                                                    </svg>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'LINE' && (
                                                                <div className="flex-1 flex flex-col pt-4 px-2">
                                                                    <div className="flex-1 w-full relative h-[180px]">
                                                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                                                            {(() => {
                                                                                const max = Math.max(...data.data, 1);
                                                                                const step = 100 / (data.data.length - 1 || 1);
                                                                                const points = data.data.map((val: any, i: any) => `${i * step},${100 - (val / max) * 100}`).join(' ');
                                                                                return (
                                                                                    <>
                                                                                        <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                                                                                        <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#lineGradient)" />
                                                                                        <defs>
                                                                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                                                                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                    </>
                                                                                );
                                                                            })()}
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex justify-between px-1 text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                                                                        {data.labels.map((l: string, i: number) => <span key={i} className="truncate w-8 text-center">{l.substring(0, 3)}</span>)}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'MATRIX' && data?.type === 'MATRIX' && (
                                                                <div className="flex-1 overflow-auto rounded-lg border border-slate-100 bg-slate-50/50 custom-scrollbar">
                                                                    <table className="w-full text-left text-[10px] border-collapse min-w-[600px]">
                                                                        <thead className="bg-white sticky top-0 z-10 border-b shadow-sm">
                                                                            <tr>
                                                                                <th className="p-3 font-bold text-slate-700 bg-white min-w-[140px] sticky left-0 z-20 border-r">Proyecto</th>
                                                                                <th className="p-3 font-bold text-slate-700 text-center bg-white border-r">Progreso Total</th>
                                                                                {Array.from({ length: (data as any).maxPhases || 0 }).map((_, i) => (
                                                                                    <th key={i} className="p-3 font-bold text-slate-700 text-center bg-white border-r min-w-[120px]">Fase {i + 1}</th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {data.rows.map((row: any) => (
                                                                                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors">
                                                                                    <td className="p-3 font-bold text-slate-800 sticky left-0 bg-inherit z-10 border-r shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.project}</td>
                                                                                    <td className="p-3 text-center border-r">
                                                                                        <div className="flex items-center gap-1 justify-center">
                                                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${row.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                                                                                {row.progress}%
                                                                                            </span>
                                                                                        </div>
                                                                                    </td>
                                                                                    {Array.from({ length: (data as any).maxPhases || 0 }).map((_, i) => {
                                                                                        const phase = row.phases?.[i];
                                                                                        if (!phase) return <td key={i} className="p-3 text-center bg-slate-50/30 border-r text-slate-300">-</td>;
                                                                                        return (
                                                                                            <td key={i} className="p-3 border-r">
                                                                                                <div className="flex flex-col gap-1.5">
                                                                                                    <div className="flex justify-between items-center text-[8px] font-bold uppercase truncate" title={phase.name}>
                                                                                                        <span className="truncate max-w-[80px]">{phase.name}</span>
                                                                                                        <span className={phase.progress === 100 ? 'text-green-600' : 'text-purple-600'}>{phase.progress}%</span>
                                                                                                    </div>
                                                                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                                                                                                        <div
                                                                                                            className={`h-full transition-all duration-700 ${phase.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                                                                                                            style={{ width: `${phase.progress}%` }}
                                                                                                        />
                                                                                                    </div>
                                                                                                    {phase.team && (
                                                                                                        <div className="text-[7px] text-slate-400 truncate mt-0.5 italic" title={phase.team}>
                                                                                                            Ref: {phase.team}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </td>
                                                                                        );
                                                                                    })}
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'GANTT' && (
                                                                <div className="flex-1 flex flex-col p-2 space-y-3">
                                                                    {data.tasks.map((task: any, i: number) => (
                                                                        <div key={i} className="flex flex-col gap-1">
                                                                            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase px-1">
                                                                                <span className="truncate max-w-[150px]">{task.name}</span>
                                                                                <span className="text-slate-400">Progreso: {task.progress}%</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {/* Label with mock date */}
                                                                                <span className="text-[7px] text-slate-300 w-8">Dic {(i * 2) + 1}</span>
                                                                                <div className="flex-1 h-3 bg-slate-100 rounded-md overflow-hidden relative shadow-inner border border-slate-200/50">
                                                                                    {/* Start offset mock */}
                                                                                    <div
                                                                                        className={`h-full absolute left-0 ${task.status === 'COMPLETED' ? 'bg-green-500' : (task.status === 'IN_PROGRESS' ? 'bg-purple-500' : 'bg-slate-300')} shadow-lg rounded-r-md transition-all duration-1000`}
                                                                                        style={{
                                                                                            width: `${Math.max(task.progress, 15)}%`,
                                                                                            marginLeft: `${i * 10}%`
                                                                                        }}
                                                                                    >
                                                                                        <div className="w-full h-full bg-white/20 animate-pulse"></div>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-[7px] text-slate-300 w-8">Ene {(i * 2) + 5}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex justify-between px-10 text-[7px] font-black text-slate-300 border-t border-slate-100 pt-2">
                                                                        <span>SEMANA 1</span>
                                                                        <span>SEMANA 2</span>
                                                                        <span>SEMANA 3</span>
                                                                        <span>SEMANA 4</span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'BAR_STACKED' && data?.type === 'STACKED' && (
                                                                <div className="flex-1 flex flex-col px-2 pt-4">
                                                                    <div className="flex-1 flex items-end gap-3 pb-6 border-b border-slate-100">
                                                                        {data.labels.map((l: string, i: number) => {
                                                                            const total = data.series.reduce((sum: number, s: any) => sum + s.data[i], 0);
                                                                            const maxTotal = Math.max(...data.labels.map((_: any, idx: number) =>
                                                                                data.series.reduce((sum: number, s: any) => sum + s.data[idx], 0)
                                                                            ), 1);
                                                                            const scale = 100 / maxTotal;

                                                                            return (
                                                                                <div key={i} className="flex-1 flex flex-col items-center group/stacked relative">
                                                                                    <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden shadow-sm" style={{ height: `${total * scale}%` }}>
                                                                                        {data.series.map((s: any, si: number) => {
                                                                                            const val = s.data[i];
                                                                                            if (val === 0) return null;
                                                                                            const h = (val / total) * 100;
                                                                                            return (
                                                                                                <div
                                                                                                    key={si}
                                                                                                    className={`w-full hover:brightness-110 transition-all cursor-pointer`}
                                                                                                    style={{
                                                                                                        height: `${h}%`,
                                                                                                        backgroundColor: ['#e2e8f0', '#8b5cf6', '#10b981', '#f59e0b'][si % 4]
                                                                                                    }}
                                                                                                    title={`${s.name}: ${val}`}
                                                                                                />
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                    <span className="text-[8px] text-slate-400 mt-2 truncate w-full text-center font-bold">{l.substring(0, 5)}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {data.series.map((s: any, i: number) => (
                                                                            <div key={i} className="flex items-center gap-1">
                                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ['#e2e8f0', '#8b5cf6', '#10b981', '#f59e0b'][i % 4] }}></div>
                                                                                <span className="text-[7px] font-bold text-slate-400 uppercase">{s.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {widget.config.chartType === 'FUNNEL' && (
                                                                <div className="flex-1 flex flex-col justify-center space-y-2 px-6">
                                                                    {(() => {
                                                                        const statusOrder = ['Sin Iniciar', 'En Proceso', 'Completado'];
                                                                        const orderedData = statusOrder.map(status => {
                                                                            const idx = data.labels.findIndex((l: string) => l.includes(status) ||
                                                                                (status === 'Sin Iniciar' && l.includes('NOT_STARTED')) ||
                                                                                (status === 'En Proceso' && l.includes('IN_PROGRESS')) ||
                                                                                (status === 'Completado' && l.includes('COMPLETED')));
                                                                            return { label: status, value: idx >= 0 ? data.data[idx] : 0 };
                                                                        });
                                                                        const max = Math.max(...orderedData.map(d => d.value), 1);
                                                                        const colors = ['bg-slate-300', 'bg-purple-400', 'bg-purple-600'];
                                                                        return orderedData.map((item, i) => {
                                                                            const width = (item.value / max) * 100;
                                                                            return (
                                                                                <div key={i} className="w-full flex flex-col items-center">
                                                                                    <div className={`h-8 ${colors[i]} rounded-xl flex items-center justify-between px-4 text-white text-[10px] font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer`}
                                                                                        style={{ width: `${Math.max(width, 30)}%` }}>
                                                                                        <span>{item.label}</span>
                                                                                        <span className="bg-white/20 px-1.5 py-0.5 rounded-lg ml-2">{item.value}</span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center p-8 space-y-3">
                                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 border-dashed">
                                                                <ChartBar size={32} weight="thin" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-500">Sin Visualización</p>
                                                                <p className="text-[10px] mt-1 text-slate-400">Selecciona datos válidos para generar el gráfico</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Source Tag */}
                                                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-slate-50/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-100 z-0">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${ds?.sourceType === 'UPLOAD' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{ds?.sourceType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {section.widgets.length === 0 && (
                                        <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30 group/empty hover:bg-slate-50 hover:border-purple-200 transition-all cursor-pointer" onClick={() => addWidgetToSection(section.id)}>
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover/empty:scale-110 transition-transform">
                                                <Plus size={24} className="text-slate-300 group-hover/empty:text-purple-500" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">Sección Vacía</p>
                                            <p className="text-xs text-slate-400 mt-1">Haz clic para añadir tu primera visualización</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Section CTA */}
                        <div className="flex justify-center pt-12 items-center gap-4">
                            <div className="h-[1px] bg-slate-200 flex-1"></div>
                            <button
                                onClick={addSection}
                                className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 hover:shadow-xl hover:shadow-purple-500/5 transition-all font-bold text-sm group"
                            >
                                <PlusCircle size={24} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />
                                Añadir Nueva Sección de Análisis
                            </button>
                            <div className="h-[1px] bg-slate-200 flex-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <ShareDashboardModal
                    dashboard={localDb}
                    onClose={() => setShowShareModal(false)}
                    users={contextData.users}
                />
            )}

            {/* Maximized Widget Modal */}
            {
                maximizedWidgetId && (() => {
                    const widget = localDb.sections.flatMap(s => s.widgets).find(w => w.id === maximizedWidgetId);
                    if (!widget) return null;

                    const ds = datasets.find(d => d.id === widget.config.datasetId);
                    const data = ds ? runQuery(widget.config, ds, contextData, filters) : null;

                    return (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setMaximizedWidgetId(null)}>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                    <h2 className="text-2xl font-bold text-slate-900">{widget.title}</h2>
                                    <button
                                        onClick={() => setMaximizedWidgetId(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Cerrar"
                                    >
                                        <ArrowsIn size={24} className="text-slate-600" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 p-8 overflow-auto">
                                    {data ? (
                                        <div className="h-full flex items-center justify-center">
                                            {widget.config.chartType === 'KPI' && (
                                                <div className="text-center">
                                                    <div className="text-8xl font-black text-slate-900 mb-4">{data.value}</div>
                                                    <div className="text-2xl text-slate-500 uppercase tracking-wider">{data.label}</div>
                                                </div>
                                            )}
                                            {widget.config.chartType === 'MATRIX' && data?.type === 'MATRIX' && (
                                                <div className="w-full h-full flex flex-col p-4">
                                                    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                                                        <table className="w-full text-left text-sm border-collapse">
                                                            <thead className="bg-slate-50 sticky top-0 z-10 border-b group">
                                                                <tr>
                                                                    <th className="p-5 font-bold text-slate-900 bg-slate-50 min-w-[200px] sticky left-0 z-20 border-r">Nombre del Proyecto</th>
                                                                    <th className="p-5 font-bold text-slate-900 text-center bg-slate-50 border-r min-w-[120px]">Salud Total</th>
                                                                    {Array.from({ length: (data as any).maxPhases || 0 }).map((_, i) => (
                                                                        <th key={i} className="p-5 font-bold text-slate-900 text-center bg-slate-50 border-r min-w-[180px]">Fase {i + 1}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {data.rows.map((row: any) => (
                                                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                                                        <td className="p-5 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r shadow-md">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                                                {row.project}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-5 border-r">
                                                                            <div className="flex flex-col gap-2">
                                                                                <div className="flex justify-between font-black text-xs">
                                                                                    <span className="text-slate-500">AVANCE</span>
                                                                                    <span className="text-purple-600">{row.progress}%</span>
                                                                                </div>
                                                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className={`h-full ${row.progress === 100 ? 'bg-green-500' : 'bg-purple-600'} shadow-lg`}
                                                                                        style={{ width: `${row.progress}%` }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        {Array.from({ length: (data as any).maxPhases || 0 }).map((_, i) => {
                                                                            const phase = row.phases?.[i];
                                                                            if (!phase) return <td key={i} className="p-5 text-center bg-slate-50/20 border-r text-slate-300">-</td>;
                                                                            return (
                                                                                <td key={i} className="p-5 border-r">
                                                                                    <div className="flex flex-col gap-2">
                                                                                        <div className="flex flex-col">
                                                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">FASE {i + 1}</span>
                                                                                            <span className="font-bold text-slate-800 text-xs truncate max-w-[150px]" title={phase.name}>{phase.name}</span>
                                                                                            {phase.team && <span className="text-[9px] text-slate-500 italic mt-0.5 truncate max-w-[150px]" title={phase.team}>Responsable: {phase.team}</span>}
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                                                                <div
                                                                                                    className={`h-full transition-all duration-1000 ${phase.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                                                                                                    style={{ width: `${phase.progress}%` }}
                                                                                                />
                                                                                            </div>
                                                                                            <span className="text-xs font-bold text-slate-600 w-10 text-right">{phase.progress}%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            {widget.config.chartType !== 'KPI' && widget.config.chartType !== 'MATRIX' && (
                                                <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                    <div className="text-center">
                                                        <PresentationChart size={64} className="mx-auto mb-4" />
                                                        <p className="text-lg">Vista maximizada para {widget.config.chartType}</p>
                                                        <p className="text-sm mt-2">Visualización ampliada en desarrollo.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-400">
                                            <p>No hay datos disponibles para esta vista.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()
            }
        </div >
    );
}

function DatasetCatalog({ datasets, onNormalize }: { datasets: Dataset[], onNormalize: (ds: Dataset) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                        <th className="p-4 pl-6">Nombre</th>
                        <th className="p-4">Origen</th>
                        <th className="p-4">Filas</th>
                        <th className="p-4">Acceso</th>
                        <th className="p-4">Actualizado</th>
                        <th className="p-4 text-right pr-6">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {datasets.map(ds => (
                        <tr key={ds.id} className="hover:bg-slate-50 group">
                            <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-3">
                                <span className={`p-1.5 rounded ${ds.sourceType === 'UPLOAD' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {ds.sourceType === 'UPLOAD' ? <FileCsv /> : <Kanban />}
                                </span>
                                {ds.title}
                            </td>
                            <td className="p-4 text-slate-600"><span className="badge border border-slate-200">{ds.sourceType}</span></td>
                            <td className="p-4 text-slate-600">{ds.rows}</td>
                            <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold flex w-fit items-center gap-1 ${ds.access === 'PRIVATE' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {ds.access === 'PRIVATE' ? <Lock size={10} /> : <Globe size={10} />} {ds.access}
                                </span>
                            </td>
                            <td className="p-4 text-slate-400 text-xs">{ds.updatedAt}</td>
                            <td className="p-4 text-right pr-6">
                                <button
                                    onClick={() => onNormalize(ds)}
                                    className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors flex items-center gap-2 font-bold text-xs"
                                    title="Normalizar Datos"
                                >
                                    <Sparkle size={16} weight="fill" />
                                    Normalizar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function DashboardCard({ dashboard, onClick, onDelete, onEdit, onShare }: {
    dashboard: Dashboard,
    onClick: () => void,
    onDelete?: (id: string) => void,
    onEdit: () => void,
    onShare: () => void
}) {
    return (
        <div onClick={onClick} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-lg hover:border-purple-200 cursor-pointer transition-all group relative">
            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-all">
                <button
                    onClick={(e) => { e.stopPropagation(); onShare(); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Compartir"
                >
                    <ShareNetwork size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    title="Propiedades"
                >
                    <Gear size={16} />
                </button>
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Estás seguro de eliminar el tablero "${dashboard.title}"?\n\nEsta acción no se puede deshacer.`)) {
                                onDelete(dashboard.id);
                            }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                    >
                        <Trash size={16} />
                    </button>
                )}
            </div>
            <div className="aspect-video bg-slate-50 rounded-lg mb-4 flex items-center justify-center border border-slate-100 group-hover:bg-purple-50 transition-colors relative overflow-hidden">
                <ChartBar size={32} className="text-slate-300 group-hover:text-purple-400" />
                {dashboard.isAuto && (
                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-tighter flex items-center gap-1">
                        <Sparkle size={10} weight="fill" />
                        Autogenerado
                    </div>
                )}
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{dashboard.title}</h3>

            {/* Unidad y Proceso */}
            {(dashboard.unit || dashboard.process) && (
                <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                    {dashboard.unit && (
                        <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded text-[10px] font-bold uppercase">
                            {dashboard.unit}
                        </span>
                    )}
                    {dashboard.process && (
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-semibold">
                            {dashboard.process}
                        </span>
                    )}
                    {!dashboard.unit && !dashboard.process && (
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded text-[10px] font-bold uppercase">
                            GLOBAL
                        </span>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-400 mt-3">
                <span>{dashboard.updatedAt}</span>
                <span className={`px-1.5 py-0.5 rounded border ${dashboard.access === 'PUBLIC_ORG' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100'}`}>
                    {dashboard.access}
                </span>
            </div>
        </div>
    )
}

function EditDashboardPropertiesModal({ dashboard, onClose, onSave }: any) {
    const { currentTenantId } = useApp();
    const [title, setTitle] = useState(dashboard.title);
    const [description, setDescription] = useState(dashboard.description);
    const [access, setAccess] = useState(dashboard.access);

    // Estados jerárquicos
    const [selectedArea, setSelectedArea] = useState('GLOBAL');
    const [selectedSubarea, setSelectedSubarea] = useState('');
    const [selectedProcess, setSelectedProcess] = useState(dashboard.process || '');

    // Inicializar valores desde el dashboard
    useEffect(() => {
        if (dashboard.unit) {
            // Buscar si es un área o subárea
            const unitObj = DB.units.find(u => u.name === dashboard.unit && u.tenantId === currentTenantId);
            if (unitObj) {
                if (unitObj.depth === 1) {
                    // Es un área
                    setSelectedArea(dashboard.unit);
                    setSelectedSubarea('');
                } else if (unitObj.depth === 2) {
                    // Es una subárea, necesitamos encontrar el área padre
                    const parentArea = DB.units.find(u => u.id === unitObj.parentId);
                    if (parentArea) {
                        setSelectedArea(parentArea.name);
                        setSelectedSubarea(dashboard.unit);
                    }
                }
            }
        }
    }, [dashboard.unit, currentTenantId]);

    // Obtener áreas disponibles (depth 1)
    const availableAreas = useMemo(() => {
        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT' && u.depth === 1)
            .map(u => u.name);
    }, [currentTenantId]);

    // Obtener subáreas disponibles según el área seleccionada
    const availableSubareas = useMemo(() => {
        if (selectedArea === 'GLOBAL' || !selectedArea) return [];
        const areaUnit = DB.units.find(u =>
            u.tenantId === currentTenantId &&
            u.type === 'UNIT' &&
            u.name === selectedArea &&
            u.depth === 1
        );
        if (!areaUnit) return [];

        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT' && u.parentId === areaUnit.id)
            .map(u => u.name);
    }, [currentTenantId, selectedArea]);

    // Obtener procesos disponibles según área o subárea
    const availableProcesses = useMemo(() => {
        if (selectedArea === 'GLOBAL') return [];

        let parentUnitName = selectedSubarea || selectedArea;
        if (!parentUnitName) return [];

        const parentUnit = DB.units.find(u =>
            u.tenantId === currentTenantId &&
            u.name === parentUnitName
        );

        if (!parentUnit) return [];

        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'PROCESS' && u.parentId === parentUnit.id)
            .map(u => u.name);
    }, [currentTenantId, selectedArea, selectedSubarea]);

    // Resetear subárea cuando cambie el área
    useEffect(() => {
        setSelectedSubarea('');
        setSelectedProcess('');
    }, [selectedArea]);

    // Resetear proceso cuando cambie la subárea
    useEffect(() => {
        setSelectedProcess('');
    }, [selectedSubarea]);

    const handleSave = () => {
        const finalUnit = selectedSubarea || (selectedArea !== 'GLOBAL' ? selectedArea : undefined);
        onSave({
            title,
            description,
            access,
            unit: finalUnit,
            process: selectedProcess || undefined
        });
    };

    const canSave = selectedArea === 'GLOBAL' || (selectedArea !== 'GLOBAL' && selectedProcess);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Propiedades del Tablero</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="label">Título</label>
                        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Descripción</label>
                        <textarea className="input h-24 resize-none" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    {/* Selector de Área */}
                    <div>
                        <label className="label">Área</label>
                        <select
                            className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                            value={selectedArea}
                            onChange={e => setSelectedArea(e.target.value)}
                        >
                            <option value="GLOBAL">Global (Toda la Organización)</option>
                            {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>

                    {/* Selector de Subárea */}
                    {selectedArea !== 'GLOBAL' && availableSubareas.length > 0 && (
                        <div>
                            <label className="label">Subárea (Opcional)</label>
                            <select
                                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                value={selectedSubarea}
                                onChange={e => setSelectedSubarea(e.target.value)}
                            >
                                <option value="">-- Sin Subárea --</option>
                                {availableSubareas.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Selector de Proceso */}
                    {selectedArea !== 'GLOBAL' && (
                        <div>
                            <label className="label">Proceso *</label>
                            <select
                                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                value={selectedProcess}
                                onChange={e => setSelectedProcess(e.target.value)}
                                disabled={availableProcesses.length === 0}
                            >
                                <option value="">-- Seleccionar Proceso --</option>
                                {availableProcesses.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {availableProcesses.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">
                                    {selectedSubarea
                                        ? 'No hay procesos disponibles para esta subárea'
                                        : 'Selecciona una subárea o el área tendrá procesos directos'}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="label">Visibilidad</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setAccess('PRIVATE')}
                                className={`flex items-center gap-2 p-3 border rounded-xl text-xs font-bold transition-all ${access === 'PRIVATE' ? 'bg-slate-100 border-slate-500 text-slate-900 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                            >
                                <Lock size={16} /> Privado
                            </button>
                            <button
                                onClick={() => setAccess('PUBLIC_ORG')}
                                className={`flex items-center gap-2 p-3 border rounded-xl text-xs font-bold transition-all ${access === 'PUBLIC_ORG' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
                            >
                                <Globe size={16} /> Pública (Org)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="btn-ghost text-slate-500 px-6">Cancelar</button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="btn bg-purple-600 text-white px-8 h-10 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    )
}

function CreateDashboardModal({ onClose, onCreate, folderDatasets }: any) {
    const { currentTenantId } = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [access, setAccess] = useState<AccessLevel>('PRIVATE');
    const [selectedFolderId, setSelectedFolderId] = useState('');

    // Estados jerárquicos
    const [selectedArea, setSelectedArea] = useState('GLOBAL');
    const [selectedSubarea, setSelectedSubarea] = useState('');
    const [selectedProcess, setSelectedProcess] = useState('');

    // Obtener áreas disponibles (depth 1)
    const availableAreas = useMemo(() => {
        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT' && u.depth === 1)
            .map(u => u.name);
    }, [currentTenantId]);

    // Obtener subáreas disponibles según el área seleccionada
    const availableSubareas = useMemo(() => {
        if (selectedArea === 'GLOBAL' || !selectedArea) return [];
        const areaUnit = DB.units.find(u =>
            u.tenantId === currentTenantId &&
            u.type === 'UNIT' &&
            u.name === selectedArea &&
            u.depth === 1
        );
        if (!areaUnit) return [];

        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT' && u.parentId === areaUnit.id)
            .map(u => u.name);
    }, [currentTenantId, selectedArea]);

    // Obtener procesos disponibles según área o subárea
    const availableProcesses = useMemo(() => {
        if (selectedArea === 'GLOBAL') return [];

        let parentUnitName = selectedSubarea || selectedArea;
        if (!parentUnitName) return [];

        const parentUnit = DB.units.find(u =>
            u.tenantId === currentTenantId &&
            u.name === parentUnitName
        );

        if (!parentUnit) return [];

        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'PROCESS' && u.parentId === parentUnit.id)
            .map(u => u.name);
    }, [currentTenantId, selectedArea, selectedSubarea]);

    // Resetear subárea cuando cambie el área
    useEffect(() => {
        if (!selectedFolderId) {
            setSelectedSubarea('');
            setSelectedProcess('');
        }
    }, [selectedArea, selectedFolderId]);

    // Resetear proceso cuando cambie la subárea
    useEffect(() => {
        if (!selectedFolderId) {
            setSelectedProcess('');
        }
    }, [selectedSubarea, selectedFolderId]);

    // Auto-completar cuando se selecciona una carpeta
    useEffect(() => {
        if (selectedFolderId) {
            const folderDs = folderDatasets.find((ds: any) => ds.id === selectedFolderId);
            if (folderDs) {
                const folderId = (folderDs as any)._filterFolderId;
                const folder = DB.projectFolders.find(f => f.id === folderId);
                if (folder) {
                    if (folder.unit) {
                        const parts = folder.unit.split(' > ');
                        if (parts.length > 0) setSelectedArea(parts[0]);
                        if (parts.length > 1) setSelectedSubarea(parts[1]);
                    }
                    if (folder.process) {
                        setSelectedProcess(folder.process);
                    }
                    if (!title) setTitle(`Tablero Proyectos: ${folder.name}`);
                }
            }
        }
    }, [selectedFolderId, folderDatasets]);

    const handleCreate = () => {
        const finalUnit = selectedSubarea ? `${selectedArea} > ${selectedSubarea}` : (selectedArea !== 'GLOBAL' ? selectedArea : undefined);
        onCreate(title, description, access === 'PUBLIC_ORG', selectedFolderId, finalUnit, selectedProcess);
    };

    const isFolderAuto = !!selectedFolderId;
    const canCreate = title.trim().length > 0 && (selectedArea === 'GLOBAL' || selectedProcess);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-scaleIn max-h-[95vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div>
                        <h2 className="font-extrabold text-2xl text-slate-800 flex items-center gap-2">
                            <PresentationChart className="text-purple-600" weight="fill" />
                            Crear Nuevo Tablero
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Configura las propiedades y origen de datos de tu tablero.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="label text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Información General</label>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        className="input w-full font-bold text-lg"
                                        autoFocus
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Título del Tablero"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="input w-full min-h-[100px] text-sm py-3"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Descripción o propósito del análisis..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <label className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                <Sparkle size={14} weight="fill" />
                                Autogenerador desde Proyecto
                            </label>
                            <select
                                className="w-full text-sm bg-white border border-purple-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                                value={selectedFolderId}
                                onChange={(e) => setSelectedFolderId(e.target.value)}
                            >
                                <option value="">-- No autogenerar --</option>
                                {folderDatasets && folderDatasets.map((ds: any) => (
                                    <option key={ds.id} value={ds.id}>{ds.title.replace('Carpeta: ', '')}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-purple-600 mt-2 italic px-1">
                                {isFolderAuto
                                    ? "✓ Usando estructura de carpeta para Área/Proceso."
                                    : "Selecciona una carpeta para crear un tablero pre-configurado."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="label text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Clasificación Org.</label>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Área</label>
                                    <select
                                        className="w-full mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                        value={selectedArea}
                                        onChange={e => setSelectedArea(e.target.value)}
                                        disabled={isFolderAuto}
                                    >
                                        <option value="GLOBAL">Global (Toda la Organización)</option>
                                        {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                {selectedArea !== 'GLOBAL' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Subárea</label>
                                            <select
                                                className="w-full mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                                value={selectedSubarea}
                                                onChange={e => setSelectedSubarea(e.target.value)}
                                                disabled={isFolderAuto || availableSubareas.length === 0}
                                            >
                                                <option value="">-- Sin Subárea --</option>
                                                {availableSubareas.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Proceso *</label>
                                            <select
                                                className="w-full mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                                value={selectedProcess}
                                                onChange={e => setSelectedProcess(e.target.value)}
                                                disabled={isFolderAuto || (availableProcesses.length === 0)}
                                            >
                                                <option value="">-- Seleccionar Proceso --</option>
                                                {availableProcesses.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="label text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Visibilidad</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'PRIVATE', label: 'Privado', icon: Lock, desc: 'Solo yo' },
                                    { id: 'PUBLIC_ORG', label: 'Organización', icon: Globe, desc: 'Todo el tenant' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setAccess(opt.id as any)}
                                        className={`flex flex-col items-start gap-1 p-3 border-2 rounded-xl transition-all ${access === opt.id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <opt.icon size={16} weight={access === opt.id ? 'fill' : 'bold'} />
                                            <span className="text-xs font-bold uppercase">{opt.label}</span>
                                        </div>
                                        <span className="text-[10px] opacity-70">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
                    <button onClick={onClose} className="btn-ghost text-slate-500 px-6 font-bold">Cancelar</button>
                    <button
                        onClick={handleCreate}
                        disabled={!canCreate}
                        className="btn bg-purple-600 text-white px-10 h-12 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all font-bold"
                    >
                        {isFolderAuto ? 'Generar Tablero Maestro' : 'Crear Tablero Vacío'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateDatasetModal({ onClose, onCreate }: any) {
    const { currentTenantId } = useApp();
    const [title, setTitle] = useState('');
    const [source, setSource] = useState('FILE');
    const [file, setFile] = useState<File | null>(null);

    // Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const repositoryDocs = useMemo(() => {
        return DB.docs.filter(d =>
            d.tenantId === currentTenantId &&
            d.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [currentTenantId, searchTerm]);

    const activeProjects = useMemo(() => {
        return DB.projects.filter(p =>
            p.tenantId === currentTenantId &&
            p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [currentTenantId, searchTerm]);

    const organizationalStorages = [
        { id: 'ST-01', name: 'Amazon S3 (Data Lake Principal)', provider: 'S3' },
        { id: 'ST-02', name: 'SharePoint: Reportes RRHH', provider: 'SHAREPOINT' },
        { id: 'ST-03', name: 'Google Cloud Storage: Auditoría', provider: 'GCS' }
    ];

    const handleCreate = () => {
        let finalTitle = title;
        if (!finalTitle) {
            if (source === 'FILE' && file) finalTitle = file.name;
            else if (source === 'REPOSITORY') finalTitle = repositoryDocs.find(d => d.id === selectedId)?.title || 'Doc Repositorio';
            else if (source === 'PROJECTS') finalTitle = activeProjects.find(p => p.id === selectedId)?.title || 'Estructura Proyecto';
            else if (source === 'STORAGE') finalTitle = organizationalStorages.find(s => s.id === selectedId)?.name || 'Storage Externo';
        }
        onCreate(finalTitle, source, source === 'FILE' ? file : selectedId);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-slate-800">Nuevo Dataset</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="label text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nombre del Dataset (Opcional)</label>
                        <input className="input w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Análisis Trimestral" />
                    </div>

                    <div>
                        <label className="label text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tipo de Origen</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'FILE', label: 'Cargar Archivo', icon: Upload },
                                { id: 'REPOSITORY', label: 'Repositorio', icon: Globe },
                                { id: 'PROJECTS', label: 'Proyectos', icon: Kanban },
                                { id: 'STORAGE', label: 'Storage Org.', icon: Database },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { setSource(opt.id); setSearchTerm(''); setSelectedId(''); }}
                                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all ${source === opt.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'}`}
                                >
                                    <opt.icon size={24} weight={source === opt.id ? 'fill' : 'bold'} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {source === 'FILE' && (
                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center animate-fadeIn">
                            <Upload size={32} className="mx-auto text-slate-300 mb-2" />
                            <input
                                type="file"
                                id="file-upload"
                                accept=".csv,.xls,.xlsx"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                className="hidden"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer block">
                                <span className="text-sm font-bold text-blue-600 hover:underline">Seleccionar archivo</span>
                                <p className="text-[10px] text-slate-400 mt-1">Excel (.xlsx, .xls) o CSV</p>
                            </label>
                            {file && <p className="mt-3 text-xs font-bold text-slate-700 bg-white p-2 rounded border border-slate-100 shadow-sm truncate">{file.name}</p>}
                        </div>
                    )}

                    {(source === 'REPOSITORY' || source === 'PROJECTS') && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="relative">
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={source === 'REPOSITORY' ? 'Buscar en repositorio...' : 'Buscar proyecto...'}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <MagnifyingGlass className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            </div>
                            <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 custom-scrollbar">
                                {source === 'REPOSITORY' ? (
                                    repositoryDocs.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedId(doc.id)}
                                            className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between ${selectedId === doc.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            <span className="truncate flex-1">{doc.title}</span>
                                            {selectedId === doc.id && <CheckCircle size={14} weight="fill" />}
                                        </button>
                                    ))
                                ) : (
                                    activeProjects.map(proj => (
                                        <button
                                            key={proj.id}
                                            onClick={() => setSelectedId(proj.id)}
                                            className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between ${selectedId === proj.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            <div className="flex flex-col truncate flex-1">
                                                <span>{proj.title}</span>
                                                <span className="text-[10px] font-normal text-slate-400 tracking-tighter uppercase">ESTRUCTURA .XLS</span>
                                            </div>
                                            {selectedId === proj.id && <CheckCircle size={14} weight="fill" />}
                                        </button>
                                    ))
                                )}
                                {searchTerm && (source === 'REPOSITORY' ? repositoryDocs.length === 0 : activeProjects.length === 0) && (
                                    <p className="p-4 text-center text-xs text-slate-400 italic">No se encontraron resultados.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {source === 'STORAGE' && (
                        <div className="space-y-3 animate-fadeIn">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Puntos de Storage Configurador por Admin</p>
                            <div className="grid grid-cols-1 gap-2">
                                {organizationalStorages.map(st => (
                                    <button
                                        key={st.id}
                                        onClick={() => setSelectedId(st.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedId === st.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${selectedId === st.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Database size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-bold ${selectedId === st.id ? 'text-blue-700' : 'text-slate-700'}`}>{st.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase">{st.provider}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={onClose} className="btn-ghost text-slate-500 px-6">Cancelar</button>
                        <button
                            onClick={handleCreate}
                            disabled={(source === 'FILE' && !file) || (['REPOSITORY', 'PROJECTS', 'STORAGE'].includes(source) && !selectedId)}
                            className="btn bg-blue-600 text-white px-8 h-12 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all font-bold"
                        >
                            Cargar Dataset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShareDashboardModal({ dashboard, onClose, users }: { dashboard: Dashboard, onClose: () => void, users: any[] }) {
    const [tab, setTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
    const [search, setSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [externalEmail, setExternalEmail] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);

    const publicUrl = `https://knowledgeflow.app/shared/dashboard/${dashboard.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                            <ShareNetwork size={24} weight="fill" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Compartir Tablero</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{dashboard.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-slate-100 bg-slate-50/30">
                    <button
                        onClick={() => setTab('INTERNAL')}
                        className={`flex items-center gap-2 py-4 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tab === 'INTERNAL' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <UserPlus size={16} /> Colaboradores Internos
                    </button>
                    <button
                        onClick={() => setTab('EXTERNAL')}
                        className={`flex items-center gap-2 py-4 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tab === 'EXTERNAL' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <Globe size={16} /> Acceso Externo
                    </button>
                </div>

                <div className="p-8">
                    {tab === 'INTERNAL' ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Añadir a tu equipo</label>
                                <div className="relative group">
                                    <input
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                        placeholder="Busca por nombre, correo o cargo..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                    <Users className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                </div>
                            </div>

                            {search && (
                                <div className="space-y-1 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 animate-fadeIn max-h-56 overflow-y-auto custom-scrollbar">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u: any) => (
                                        <button
                                            key={u.id}
                                            onClick={() => {
                                                if (!selectedUsers.includes(u.id)) setSelectedUsers([...selectedUsers, u.id]);
                                                setSearch('');
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-all border border-transparent hover:border-blue-100 group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">{u.initials}</div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">{u.role}</p>
                                            </div>
                                            <PlusCircle size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    )) : (
                                        <div className="p-4 text-center text-slate-400 text-xs italic">No se encontraron usuarios</div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Usuarios con acceso</label>
                                {selectedUsers.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center bg-slate-50/50">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                                            <Users size={24} className="text-slate-200" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Solo tú tienes acceso a este tablero actualmente.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedUsers.map(uid => {
                                            const u = users.find((usr: any) => usr.id === uid);
                                            return (
                                                <div key={uid} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">{u?.initials}</div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-slate-800">{u?.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">EDITOR</span>
                                                            <span className="text-[10px] text-slate-400">• Acceso total</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== uid))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash size={18} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl border border-purple-400 shadow-xl shadow-purple-500/20 relative overflow-hidden group">
                                <span className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></span>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                        <LinkIcon size={24} weight="bold" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-white mb-1">Enlace de Visualización Pública</h4>
                                        <p className="text-white/70 text-xs leading-relaxed">Comparte una versión interactiva y de solo lectura de este tablero con personas externas (clientes, socios o directivos).</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3 relative z-10">
                                    <div className="flex-1 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-[11px] font-mono text-purple-100 truncate flex items-center shadow-inner">
                                        {publicUrl}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 transform active:scale-95 ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white text-purple-700 hover:bg-purple-50 shadow-lg'}`}
                                    >
                                        {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
                                        {copied ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                    <Envelope size={14} className="text-purple-500" />
                                    Enviar Invitación por Correo
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative flex-1 group">
                                        <input
                                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                                            placeholder="ejemplo@cliente.com"
                                            value={externalEmail}
                                            onChange={e => setExternalEmail(e.target.value)}
                                        />
                                        <Envelope className="absolute left-4 top-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                    </div>
                                    <button
                                        disabled={!externalEmail.includes('@')}
                                        onClick={() => {
                                            alert(`Invitación de acceso enviada correctamente a: ${externalEmail}`);
                                            setExternalEmail('');
                                        }}
                                        className="bg-slate-900 text-white px-8 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-slate-900/20 active:scale-95 transform"
                                    >
                                        Enviar Acceso
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                    <p className="text-[10px] text-slate-500 font-medium italic">Se generará una URL única con token de seguridad para el destinatario.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                    <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4">Cerrar</button>
                    {tab === 'INTERNAL' ? (
                        <button
                            disabled={selectedUsers.length === 0}
                            onClick={() => { alert('¡Equipos notificados y acceso concedido!'); onClose(); }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:grayscale transform active:scale-95"
                        >
                            Confirmar Accesos ({selectedUsers.length})
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-full shadow-sm">
                            <Sparkle size={14} className="text-purple-500" />
                            ACTUALIZACIÓN EN TIEMPO REAL ACTIVA
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
function NormalizeDatasetModal({ dataset, onClose, onSave }: { dataset: Dataset, onClose: () => void, onSave: (ds: Dataset) => void }) {
    const [title, setTitle] = useState(dataset.title);
    const [columns, setColumns] = useState<DataColumn[]>(JSON.parse(JSON.stringify(dataset.columns)));

    const handleUpdateColumnName = (index: number, name: string) => {
        const newCols = [...columns];
        newCols[index].name = name;
        setColumns(newCols);
    };

    const handleUpdateColumnType = (index: number, type: any) => {
        const newCols = [...columns];
        newCols[index].type = type;
        setColumns(newCols);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div>
                        <h2 className="font-extrabold text-2xl text-slate-800 flex items-center gap-2">
                            <Sparkle className="text-purple-600" weight="fill" />
                            Normalizar Dataset
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Refina los nombres y tipos de datos antes de usarlos en un tablero.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 border-r border-slate-100 pr-8 space-y-6">
                        <div>
                            <label className="label text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nombre del Dataset</label>
                            <input className="input w-full" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>

                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <h4 className="text-xs font-bold text-purple-700 flex items-center gap-2 mb-2">
                                <Kanban size={16} />
                                Resumen del Origen
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-500">Tipo:</span>
                                    <span className="font-bold text-slate-700">{dataset.sourceType}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-500">Filas estimadas:</span>
                                    <span className="font-bold text-slate-700">{dataset.rows}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-500">Columnas:</span>
                                    <span className="font-bold text-slate-700">{columns.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-400 italic">
                            Tip: Cambia los tipos de datos a NUMBER si planeas realizar cálculos matemáticos o DATE para filtros de tiempo.
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="label text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Mapeo de Columnas</label>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {columns.map((col, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-400">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            className="bg-transparent border-none outline-none font-bold text-slate-700 w-full focus:ring-0"
                                            value={col.name}
                                            onChange={e => handleUpdateColumnName(idx, e.target.value)}
                                            placeholder="Nombre de columna"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="bg-white border-slate-200 text-xs rounded-lg py-1 px-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            value={col.type}
                                            onChange={e => handleUpdateColumnType(idx, e.target.value as any)}
                                        >
                                            <option value="STRING">TEXTO (Abc)</option>
                                            <option value="NUMBER">NÚMERO (123)</option>
                                            <option value="DATE">FECHA (📅)</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={onClose} className="btn-ghost text-slate-500 px-6">Descartar</button>
                            <button
                                onClick={() => onSave({ ...dataset, title, columns })}
                                className="btn bg-purple-600 text-white px-8 h-12 shadow-lg shadow-purple-500/20 transform active:scale-95 transition-all font-bold"
                            >
                                Guardar Normalización
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
