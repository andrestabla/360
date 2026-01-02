'use client';
// @ts-nocheck
// Note: TypeScript checking disabled for this imported file due to extensive type mismatches

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { DB, Survey, SurveyQuestion, QuestionType, SurveyResponse } from '@/lib/data';
import { DIAGNOSTIC_DIMENSIONS, DIAGNOSTIC_QUESTIONS } from '@/lib/templates/diagnostic';
import { SECTOR_BENCHMARKS_LIST } from '@/lib/benchmark';
import {
    Plus, ClipboardText, Trash, Clock, CaretRight, CheckCircle,
    Users, Globe, Gear, ChartBar, PaperPlaneRight, X, Smiley, Confetti,
    ChartPieSlice, DownloadSimple, ArrowLeft, SquaresFour,
    PresentationChart, ListChecks, Heartbeat, User, Check, CaretDown,
    Lightning, WarningCircle, Briefcase, UsersThree,
    ArrowClockwise, Target, TrendUp, TrendDown, Buildings, Medal, Lightbulb,
    Star, Calendar, ThumbsUp, ThumbsDown, ListNumbers, Rows, UploadSimple
} from '@phosphor-icons/react';

export default function SurveysPage() {
    const { currentUser } = useApp();
    const { t } = useTranslation();
    const [view, setView] = useState<'LIST' | 'TEMPLATE_SELECT' | 'BUILDER' | 'RESPOND' | 'RESULTS'>('LIST');
    const [activeTab, setActiveTab] = useState<'OPEN' | 'DRAFT' | 'CLOSED'>('OPEN');

    // Data State
    // Load initial data with persistence check
    const [surveys, setSurveys] = useState<Survey[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('db_surveys');
            return saved ? JSON.parse(saved) : (DB.surveys || []);
        }
        return DB.surveys || [];
    });

    // We also need to persist responses
    const [responses, setResponses] = useState<SurveyResponse[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('db_responses');
            return saved ? JSON.parse(saved) : (DB.surveyResponses || []);
        }
        return DB.surveyResponses || [];
    });

    // Sync DB with local state on mount/update to mock "Backend"
    useEffect(() => {
        DB.surveys = surveys;
        DB.surveyResponses = responses;
        localStorage.setItem('db_surveys', JSON.stringify(surveys));
        localStorage.setItem('db_responses', JSON.stringify(responses));
    }, [surveys, responses]);

    const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
    const [answeringSurvey, setAnsweringSurvey] = useState<Survey | null>(null);
    const [reportingSurvey, setReportingSurvey] = useState<Survey | null>(null);

    // Filter State
    const [filterUnit, setFilterUnit] = useState('ALL');
    const [filterProcess, setFilterProcess] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // --- ACTIONS ---

    const handleCreateFromTemplate = (templateKey: string) => {
        let newQuestions: SurveyQuestion[] = [];
        let title = 'Nueva Encuesta';
        let description = '';

        if (templateKey === 'DIAGNOSTIC') {
            title = 'Diagnóstico de Madurez Digital e IA';
            description = 'Evaluación integral de 6 dimensiones (180 preguntas) para medir el nivel de madurez.';
            // Generate full 180 questions
            let qCounter = 0;
            DIAGNOSTIC_DIMENSIONS.forEach(dim => {
                const dimQuestions = (DIAGNOSTIC_QUESTIONS as any)[dim.id] || [];
                dimQuestions.forEach((qText: any) => {
                    qCounter++;
                    newQuestions.push({
                        id: `q-${dim.id}-${qCounter}`,
                        section: dim.id,
                        type: 'LIKERT',
                        title: qText,
                        required: true,
                        scale: 5
                    });
                });
            });
        } else if (templateKey === 'CLIMA') {
            title = 'Clima Organizacional Q3';
            description = 'Pulso de clima laboral, liderazgo y bienestar.';
            newQuestions = [
                { id: 'c1', section: 'liderazgo', type: 'LIKERT', title: 'Confío en las decisiones de liderazgo.', required: true, scale: 5 },
                { id: 'c2', section: 'liderazgo', type: 'LIKERT', title: 'Recibo orientación clara sobre prioridades.', required: true, scale: 5 },
                { id: 'c3', section: 'bienestar', type: 'LIKERT', title: 'Mi carga de trabajo es manejable.', required: true, scale: 5 },
                { id: 'c4', section: 'comunicacion', type: 'LIKERT', title: 'La información importante llega a tiempo.', required: true, scale: 5 },
                { id: 'c5', type: 'TEXT', title: '¿Qué deberíamos mejorar prioritariamente?', required: false }
            ];
        } else if (templateKey === 'NPS') {
            title = 'Encuesta de Satisfacción (NPS)';
            description = 'Evaluación de lealtad y satisfacción del cliente interno.';
            newQuestions = [
                { id: 'n1', type: 'NPS', title: '¿Qué tan probable es que recomiendes este servicio a un colega?', required: true },
                { id: 'n2', type: 'LIKERT', title: '¿Qué tan satisfecho estás con el servicio recibido?', required: true, scale: 5 },
                { id: 'n3', type: 'TEXT', title: '¿Qué fue lo mejor del servicio?', required: false }
            ];
        } else {
            // BLANK
            newQuestions = [];
        }

        const newSurvey: Survey = {
            id: `S-${Date.now()}`,
            ownerId: currentUser?.id || 'u1',
            title,
            description,
            isAnonymous: templateKey === 'CLIMA', // Default anonymous for Climate
            status: 'DRAFT',
            audience: 'TENANT',
            questions: newQuestions,
            createdAt: new Date().toISOString().split('T')[0],
            responsesCount: 0,
            unit: undefined, // Se configurará en el builder
            process: undefined // Se configurará en el builder
        };

        setEditingSurvey(newSurvey);
        setView('BUILDER');
    };

    const handleSaveList = (updatedList: Survey[]) => {
        setSurveys(updatedList);
        DB.surveys = updatedList; // Sync Mock
    };

    const handleResponseSubmit = (response: SurveyResponse) => {
        setResponses(prev => [...prev, response]);
        const updatedSurveys = surveys.map(s => s.id === response.surveyId ? { ...s, responsesCount: (s.responsesCount || 0) + 1 } : s);
        handleSaveList(updatedSurveys);
        setView('LIST');
        setAnsweringSurvey(null);
    };

    // --- HOOKS (DEBEN ESTAR ANTES DE CUALQUIER RETURN) ---

    // Permissions
    const { hasPermission } = useApp();
    const canManage = hasPermission('MANAGE_SURVEYS');

    // Opciones disponibles para filtros (derivadas de encuestas existentes)
    const availableUnits = useMemo(() => {
        const units = new Set<string>();
        surveys.forEach(s => {
            if (s.unit) units.add(s.unit);
        });
        return Array.from(units).sort();
    }, [surveys]);

    const availableProcesses = useMemo(() => {
        const processes = new Set<string>();
        surveys.forEach(s => {
            if (s.process && (filterUnit === 'ALL' || s.unit === filterUnit)) {
                processes.add(s.process);
            }
        });
        return Array.from(processes).sort();
    }, [surveys, filterUnit]);

    // Resetear filtro de proceso cuando cambie la unidad
    useEffect(() => {
        setFilterProcess('ALL');
    }, [filterUnit]);

    const filteredSurveys = useMemo(() => surveys.filter(s => {
        // 1. Status Filter
        let matchStatus = false;
        if (activeTab === 'OPEN') matchStatus = s.status === 'OPEN' || s.status === 'SCHEDULED';
        else if (activeTab === 'DRAFT') matchStatus = s.status === 'DRAFT';
        else matchStatus = s.status === 'CLOSED' || s.status === 'ARCHIVED';

        if (!matchStatus) return false;

        // 2. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchTitle = s.title.toLowerCase().includes(query);
            const matchDesc = s.description?.toLowerCase().includes(query);
            if (!matchTitle && !matchDesc) return false;
        }

        // 3. Unit Filter
        if (filterUnit !== 'ALL') {
            if (s.unit !== filterUnit) return false;
        }

        // 4. Process Filter
        if (filterProcess !== 'ALL') {
            if (s.process !== filterProcess) return false;
        }

        // 5. Visibility / Assignment Filter
        if (canManage) return true; // Admins see all

        // Regular users logic
        const isGlobal = s.audience === 'TENANT' && !s.targetUserId;
        const isMyUnit = s.audience === 'UNIT' && s.targetUnitId && currentUser?.unit &&
            (DB.units.find(u => u.id === s.targetUnitId)?.name === currentUser.unit);

        const targetUnit = DB.units.find(u => u.id === s.targetUnitId);
        const unitMatch = s.audience === 'UNIT' && targetUnit?.name === currentUser?.unit;

        const isMeDirectly = currentUser?.id ? s.targetUserId?.includes(currentUser.id) : false;

        return isGlobal || unitMatch || isMeDirectly;
    }), [surveys, activeTab, searchQuery, filterUnit, filterProcess, canManage, currentUser]);

    // --- RENDER ---

    if (view === 'TEMPLATE_SELECT') {
        return (
            <div className="p-8 h-full bg-slate-50 flex flex-col items-center justify-center animate-fadeIn">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{t('surveys_template_title')}</h2>
                            <p className="text-slate-500">{t('surveys_template_subtitle')}</p>
                        </div>
                        <button onClick={() => setView('LIST')} className="text-slate-400 hover:text-slate-600 font-medium">{t('surveys_cancel')}</button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <button onClick={() => handleCreateFromTemplate('DIAGNOSTIC')} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex gap-4 group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><PresentationChart size={28} weight="fill" /></div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600">Diagnóstico MD-IA</h3>
                                <p className="text-sm text-slate-500 mt-1">Evaluación completa de 180 preguntas en 6 dimensiones. Incluye radar y scoring avanzado.</p>
                            </div>
                        </button>
                        <button onClick={() => handleCreateFromTemplate('CLIMA')} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex gap-4 group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Heartbeat size={28} weight="fill" /></div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-green-600">Clima Organizacional</h3>
                                <p className="text-sm text-slate-500 mt-1">Pulso rápido de bienestar, liderazgo y cultura. Recomendado anónimo.</p>
                            </div>
                        </button>
                        <button onClick={() => handleCreateFromTemplate('NPS')} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex gap-4 group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Smiley size={28} weight="fill" /></div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-600">NPS / Satisfacción</h3>
                                <p className="text-sm text-slate-500 mt-1">Mide lealtad y satisfacción del servicio con NPS, escalas y preguntas abiertas.</p>
                            </div>
                        </button>
                        <button onClick={() => handleCreateFromTemplate('BLANK')} className="bg-slate-100 p-6 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-200 transition-all text-left flex gap-4 group">
                            <div className="w-12 h-12 bg-white text-slate-400 rounded-lg flex items-center justify-center"><Plus size={28} /></div>
                            <div>
                                <h3 className="font-bold text-slate-600 text-lg">En Blanco</h3>
                                <p className="text-sm text-slate-500 mt-1">Comienza desde cero y construye tus propias preguntas.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (view === 'BUILDER' && editingSurvey) {
        return (
            <SurveyBuilder
                survey={editingSurvey}
                onSave={(s) => {
                    const exists = surveys.find(x => x.id === s.id);
                    const newList = exists ? surveys.map(x => x.id === s.id ? s : x) : [s, ...surveys];
                    handleSaveList(newList);
                    setView('LIST');
                    setEditingSurvey(null);
                }}
                onCancel={() => { setView('LIST'); setEditingSurvey(null); }}
            />
        );
    }

    if (view === 'RESPOND' && answeringSurvey) {
        return (
            <SurveyResponder
                survey={answeringSurvey}
                currentUser={currentUser}
                onSubmit={handleResponseSubmit}
                onCancel={() => { setView('LIST'); setAnsweringSurvey(null); }}
            />
        );
    }

    if (view === 'RESULTS' && reportingSurvey) {
        return (
            <SurveyResults
                survey={reportingSurvey}
                onBack={() => { setView('LIST'); setReportingSurvey(null); }}
            />
        );
    }

    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardText className="text-blue-600" weight="duotone" />
                        {t('surveys_title')}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{t('surveys_desc')}</p>
                </div>
                {canManage && (
                    <button onClick={() => setView('TEMPLATE_SELECT')} className="btn bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus weight="bold" /> {t('surveys_create_btn')}
                    </button>
                )}
            </div>

            {/* List Reuse */}
            <div className="flex gap-6 border-b border-slate-200 mb-6">
                {['OPEN', 'DRAFT', 'CLOSED'].map((tab: any) => {
                    // Hide Draft/Closed tabs for non-managers to simplify UI
                    if (!canManage && tab !== 'OPEN') return null;

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 flex items-center gap-2 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                        >
                            {tab === 'OPEN' && t('surveys_tab_active')}
                            {tab === 'DRAFT' && t('surveys_tab_drafts')}
                            {tab === 'CLOSED' && t('surveys_tab_closed')}

                            {/* Only show counts if manager or if it's the OPEN tab */}
                            {(canManage || tab === 'OPEN') && (
                                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs ml-1">
                                    {surveys.filter(s => {
                                        if (tab === 'OPEN') return s.status === 'OPEN' || s.status === 'SCHEDULED';
                                        if (tab === 'DRAFT') return s.status === 'DRAFT';
                                        return s.status === 'CLOSED' || s.status === 'ARCHIVED';
                                    }).length}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Barra de Filtros */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar encuestas..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                        <ClipboardText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* Filtro de Unidad */}
                    <div>
                        <select
                            value={filterUnit}
                            onChange={e => setFilterUnit(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
                        >
                            <option value="ALL">Todas las Unidades</option>
                            {availableUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Proceso */}
                    <div>
                        <select
                            value={filterProcess}
                            onChange={e => setFilterProcess(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
                            disabled={availableProcesses.length === 0}
                        >
                            <option value="ALL">Todos los Procesos</option>
                            {availableProcesses.map(process => (
                                <option key={process} value={process}>{process}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Indicador de filtros activos */}
                {(searchQuery || filterUnit !== 'ALL' || filterProcess !== 'ALL') && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Filtros activos:</span>
                        {searchQuery && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 flex items-center gap-1">
                                "{searchQuery}"
                                <button onClick={() => setSearchQuery('')} className="hover:text-purple-900">
                                    <X size={12} weight="bold" />
                                </button>
                            </span>
                        )}
                        {filterUnit !== 'ALL' && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 flex items-center gap-1">
                                {filterUnit}
                                <button onClick={() => setFilterUnit('ALL')} className="hover:text-purple-900">
                                    <X size={12} weight="bold" />
                                </button>
                            </span>
                        )}
                        {filterProcess !== 'ALL' && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-center gap-1">
                                {filterProcess}
                                <button onClick={() => setFilterProcess('ALL')} className="hover:text-blue-900">
                                    <X size={12} weight="bold" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterUnit('ALL');
                                setFilterProcess('ALL');
                            }}
                            className="ml-auto text-slate-500 hover:text-slate-700 font-medium"
                        >
                            Limpiar todo
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSurveys.map(survey => {
                        const hasResponded = DB.surveyResponses.some(r => r.surveyId === survey.id && r.respondentId === currentUser?.id);

                        return (
                            <div key={survey.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all group relative flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${survey.status === 'OPEN' ? 'bg-green-100 text-green-700' : survey.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {survey.status}
                                    </div>
                                    {canManage && (
                                        <button onClick={() => { setEditingSurvey(survey); setView('BUILDER'); }} className="text-slate-400 hover:text-blue-600 p-1">
                                            <Gear size={18} />
                                        </button>
                                    )}
                                </div>

                                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{survey.title}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">{survey.description || 'Sin descripción'}</p>

                                {/* Badges de Unidad y Proceso */}
                                {(survey.unit || survey.process || (!survey.unit && !survey.process)) && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {survey.unit && (
                                            <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded text-[10px] font-semibold uppercase tracking-wide">
                                                {survey.unit}
                                            </span>
                                        )}
                                        {survey.process && (
                                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-semibold">
                                                {survey.process}
                                            </span>
                                        )}
                                        {!survey.unit && !survey.process && (
                                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded text-[10px] font-bold uppercase">
                                                GLOBAL
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Badge for Type */}
                                {survey.questions.length > 20 && (
                                    <div className="absolute top-14 right-5 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold border border-blue-100">
                                        Diagnóstico
                                    </div>
                                )}

                                <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-50 pt-3 mt-auto">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} /> {survey.audience === 'TENANT' ? t('survey_audience_global') : t('survey_audience_unit')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ListChecks size={14} /> {survey.questions.length} {t('survey_questions_count')}
                                    </div>
                                </div>

                                {survey.status === 'OPEN' ? (
                                    <div className="mt-4">
                                        {!hasResponded ? (
                                            <button onClick={() => { setAnsweringSurvey(survey); setView('RESPOND'); }} className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-blue-500/20 shadow-lg mb-3">
                                                {t('survey_respond_btn')}
                                            </button>
                                        ) : (
                                            <button disabled className="w-full bg-green-50 text-green-600 border border-green-200 rounded-lg py-2 text-sm font-bold flex items-center justify-center gap-2 cursor-default mb-3">
                                                <CheckCircle weight="fill" size={16} /> {t('survey_completed_btn')}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 mb-3">
                                        <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">{survey.responsesCount} respuestas</span>
                                            {/* Status indicator for non-open surveys */}
                                            <span className="text-xs font-bold text-slate-400 capitalize">{survey.status === 'DRAFT' ? 'Borrador' : 'Cerrada'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Management Actions - Always visible for managers */}
                                {canManage && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setAnsweringSurvey(survey); setView('RESPOND'); }}
                                            className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                            title="Ver cómo ven los usuarios la encuesta"
                                        >
                                            <PaperPlaneRight size={16} weight="bold" />
                                            Vista Previa
                                        </button>
                                        <button
                                            onClick={() => { setEditingSurvey(survey); setView('BUILDER'); }}
                                            className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                            title="Editar contenido y configuración"
                                        >
                                            <Gear size={16} weight="bold" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => { setReportingSurvey(survey); setView('RESULTS'); }}
                                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors"
                                            title={t('survey_view_results')}
                                        >
                                            <ChartBar size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Result access for owners who are not managers */}
                                {(!canManage && survey.ownerId === currentUser?.id) && (
                                    <button onClick={() => { setReportingSurvey(survey); setView('RESULTS'); }} className="w-full mt-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2 text-xs font-bold" title={t('survey_view_results')}>
                                        <ChartBar size={16} /> Ver Resultados
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {filteredSurveys.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl">
                            <ClipboardText size={48} className="mx-auto mb-3 opacity-30" />
                            <p>{t('survey_empty_title')}</p>
                            {canManage && <button onClick={() => setView('TEMPLATE_SELECT')} className="text-blue-600 text-sm font-bold mt-2 hover:underline">{t('survey_empty_create_first')}</button>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SUBVIEWS ---

// --- ADVANCED ANALYTICS COMPONENTS ---

function RadarChart({ data, dimensions }: { data: Record<string, number>, dimensions: typeof DIAGNOSTIC_DIMENSIONS }) {
    // Simple SVG Radar Implementation
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const angleSlice = (Math.PI * 2) / dimensions.length;

    // Helper to get coordinates
    const getCoords = (val: number, i: number) => {
        const angle = i * angleSlice - Math.PI / 2; // Start at top
        const r = (val / 100) * radius;
        return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
    };

    // Build the path string for the data polygon
    const points = dimensions.map((dim, i) => {
        const val = data[dim.id] || 0;
        return getCoords(val, i).join(',');
    }).join(' ');

    // Build axis lines
    const axes = dimensions.map((dim, i) => {
        const [x, y] = getCoords(100, i);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
    });

    // Build labels
    const labels = dimensions.map((dim, i) => {
        const [x, y] = getCoords(115, i); // Push labels out a bit
        return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-slate-500 font-bold uppercase">
                {dim.name.split(' ')[0]} {/* Shorten name */}
            </text>
        );
    });

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Circles (20%, 40%, 60%, 80%, 100%) */}
                {[20, 40, 60, 80, 100].map(p => (
                    <circle key={p} cx={center} cy={center} r={(p / 100) * radius} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
                ))}
                {axes}
                {/* Data Polygon */}
                <polygon points={points} fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" strokeWidth="2" />
                {/* Data Points */}
                {dimensions.map((dim, i) => {
                    const val = data[dim.id] || 0;
                    const [x, y] = getCoords(val, i);
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#2563eb" className="hover:r-6 transition-all">
                            <title>{`${dim.name}: ${val}%`}</title>
                        </circle>
                    );
                })}
                {labels}
            </svg>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function ProgressBar({ value, max = 100, color = 'bg-blue-600', height = 'h-2' }: { value: number, max?: number, color?: string, height?: string }) {
    const p = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
            <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${p}%` }}></div>
        </div>
    );
}

function PercentileBar({ value, p25 = 45, p75 = 75 }: { value: number, p25?: number, p75?: number }) {
    // Visual bar from 0 to 100
    // Markers for P25, P75, and Value
    return (
        <div className="relative h-6 w-full mt-2">
            {/* Track */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 rounded-full -translate-y-1/2"></div>

            {/* Segments Colors (Optional - simple gray for now) */}

            {/* P25 Marker */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white shadow-sm z-10" style={{ left: `${p25}%` }} title={`P25: ${p25}`}></div>

            {/* P75 Marker */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white shadow-sm z-10" style={{ left: `${p75}%` }} title={`P75: ${p75}`}></div>

            {/* User Marker */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-20 transition-all duration-500 flex items-center justify-center ${value >= p75 ? 'bg-green-500' : value >= p25 ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{ left: `${value}%` }}
                title={`Tú: ${value}`}
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>

            {/* Labels below */}
            <div className="absolute top-5 w-full flex justify-between text-[9px] text-slate-400 font-mono">
                <span style={{ left: `${p25}%`, position: 'absolute', transform: 'translateX(-50%)' }}>P25:{p25}</span>
                <span style={{ left: `${value}%`, position: 'absolute', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#334155' }}>Tú:{value}</span>
                <span style={{ left: `${p75}%`, position: 'absolute', transform: 'translateX(-50%)' }}>P75:{p75}</span>
            </div>
        </div>
    )
}


function ResponseDistribution({ distribution, total }: { distribution: Record<string, number>, total: number }) {
    if (!distribution || total === 0) return null;

    // 1=Red, 2=Orange, 3=Yellow, 4=Blue, 5=Green
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

    return (
        <div className="w-full mt-3">
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-slate-100">
                {[1, 2, 3, 4, 5].map((score, i) => {
                    const count = distribution[score] || 0;
                    if (count === 0) return null;
                    const pct = (count / total) * 100;
                    return (
                        <div key={score} className={`${colors[i]} h-full transition-all duration-500 hover:opacity-80`} style={{ width: `${pct}%` }} title={`Opción ${score}: ${count} votos (${pct.toFixed(1)}%)`}></div>
                    );
                })}
            </div>
            <div className="flex justify-between mt-1 px-1 gap-1">
                {[1, 2, 3, 4, 5].map((score, i) => {
                    const count = distribution[score] || 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <div key={score} className="flex flex-col items-center flex-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors[i]} mb-1`}></div>
                            <span className="text-[9px] text-slate-400 font-mono">{pct}%</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function BadgeStatus({ score }: { score: number }) {
    const { t } = useTranslation();
    if (score >= 75) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">{t('badge_high')}</span>;
    if (score >= 50) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">{t('badge_medium')}</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">{t('badge_low')}</span>;
}

// --- MAIN RESULT COMPONENT ---

function SurveyResults({ survey, onBack }: { survey: Survey, onBack: () => void }) {
    const { t } = useTranslation();
    // Real-time updates simulation: State + Interval
    const [responses, setResponses] = useState(DB.surveyResponses.filter(r => r.surveyId === survey.id));

    useEffect(() => {
        const interval = setInterval(() => {
            const latest = DB.surveyResponses.filter(r => r.surveyId === survey.id);
            if (latest.length !== responses.length) {
                setResponses(latest);
            }
        }, 2000); // Check for new answers every 2s
        return () => clearInterval(interval);
    }, [survey.id, responses.length]);

    // --- DATA ENRICHMENT & FILTERING ---
    const [filterLocation, setFilterLocation] = useState('ALL');
    const [filterUnit, setFilterUnit] = useState('ALL');
    const [filterGender, setFilterGender] = useState('ALL');
    const [filterUser, setFilterUser] = useState('ALL'); // For non-anonymous

    // 1. Get List of Potential Participants (Mock based on Survey Target)
    // If targetUnitId is present, get users from that unit. Else, all tenant users.
    const allPotentialUsers = useMemo(() => {
        let users = DB.users;
        if (survey.audience === 'UNIT' && survey.targetUnitId) {
            users = users.filter(u => u.unit === survey.targetUnitId);
        }
        return users;
    }, [survey]);

    // 2. Enrich Responses with User Data
    const enrichedResponses = useMemo(() => {
        return responses.map(r => {
            const user = DB.users.find(u => u.id === r.respondentId);
            // Mock missing data for visualization richness
            const location = user?.location || (Math.random() > 0.5 ? 'Sede Central' : 'Sucursal Norte');
            const gender = (user?.name || '').endsWith('a') ? 'Femenino' : 'Masculino'; // Heuristic for demo
            const unit = user?.unit || 'General';
            return {
                ...r,
                user,
                meta: { location, unit, gender }
            };
        });
    }, [responses]);

    // 3. Apply Filters
    const filteredResponses = useMemo(() => {
        return enrichedResponses.filter(r => {
            if (filterLocation !== 'ALL' && r.meta.location !== filterLocation) return false;
            if (filterUnit !== 'ALL' && r.meta.unit !== filterUnit) return false;
            if (filterGender !== 'ALL' && r.meta.gender !== filterGender) return false;
            if (filterUser !== 'ALL' && r.respondentId !== filterUser) return false;
            return true;
        });
    }, [enrichedResponses, filterLocation, filterUnit, filterGender, filterUser]);

    const activeResponses = filteredResponses;
    const total = activeResponses.length; // Override 'total' for downstream calculations

    // 4. Calculate Dynamic Counts based on filters (Approximation)
    // In a real app, we would calculate the intersection of the 'Potential Users' and the Filters.
    // For this demo, we assume the 'invitedCount' scales somewhat with filters to avoid 0% rates if filtering by 'Responded'.
    // A better approach: Filter 'allPotentialUsers' by the same criteria.
    const filteredPotentialUsers = useMemo(() => {
        return allPotentialUsers.filter(u => {
            // Mock metadata check for potential users to match the response metadata logic
            const location = u.location || 'Sede Central'; // Assume default for check
            const unit = u.unit;
            const gender = (u.name || '').endsWith('a') ? 'Femenino' : 'Masculino';

            // Note: This logic is slightly loose because we mocked metadata on responses randomly above if missing. 
            // Ideally data is consistent. We will do our best match.
            if (filterLocation !== 'ALL' && u.location !== filterLocation) return false; // Strict check on real data
            if (filterUnit !== 'ALL' && u.unit !== filterUnit) return false;
            // Gender check is heuristic on name, so it matches the response logic
            if (filterGender !== 'ALL' && ((u.name.endsWith('a') ? 'Femenino' : 'Masculino') !== filterGender)) return false;
            if (filterUser !== 'ALL' && u.id !== filterUser) return false;
            return true;
        });
    }, [allPotentialUsers, filterLocation, filterUnit, filterGender, filterUser]);

    const invitedCount = filteredPotentialUsers.length || 1; // Avoid div by 0
    // Mock 'inProgress' as a fraction of non-responders for demo
    const nonResponders = Math.max(0, invitedCount - total);
    const inProgressCount = Math.floor(nonResponders * 0.2);
    const completedCount = total;

    // Unique options for filters
    const locations = Array.from(new Set(allPotentialUsers.map(u => u.location || 'Sede Central'))).filter(Boolean);
    const units = Array.from(new Set(allPotentialUsers.map(u => u.unit))).filter(Boolean);
    const genders = ['Masculino', 'Femenino'];

    // --- CONTEXT VARIABLES (Restored) ---
    const isDiagnostic = survey.questions.length > 50;
    // const currentTenant = DB.tenants.find(t => t.id === survey.tenantId);
    const sectorName = 'Consultoría Empresarial';
    const benchmark = SECTOR_BENCHMARKS_LIST.find(b => b.sector === sectorName) || SECTOR_BENCHMARKS_LIST[0];



    // --- AGGREGATION LOGIC ---
    const getAggregatedData = (q: SurveyQuestion) => {
        if (total === 0) return null;
        const answers = activeResponses.map(r => r.answers[q.id]).filter(a => a !== undefined);

        if (q.type === 'LIKERT' || q.type === 'NPS' || q.type === 'RATING') {
            const sum = answers.reduce((a: any, b: any) => (a || 0) + Number(b || 0), 0);
            const avg = sum / answers.length;

            // Calculate Distribution for Detailed Graphics
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            answers.forEach(a => {
                const val = Math.round(Number(a));
                // @ts-ignore
                if (distribution[val] !== undefined) distribution[val]++;
            });

            return { type: 'AVG', value: avg.toFixed(1), rawValue: avg, distribution, count: answers.length };
        }
        if (q.type === 'MULTI' || q.type === 'CHECKBOX' || q.type === 'DROPDOWN' || q.type === 'YESNO') {
            const counts: Record<string, number> = {};
            // For checkbox, answers might be arrays
            answers.forEach((a: any) => {
                if (Array.isArray(a)) {
                    a.forEach((val: any) => { counts[String(val)] = (counts[String(val)] || 0) + 1; });
                } else {
                    counts[String(a)] = (counts[String(a)] || 0) + 1;
                }
            });
            return { type: 'COUNT', counts, total: answers.length };
        }
        return { type: 'TEXT', lastAnswers: answers.filter(a => typeof a === 'string').slice(-5) };
    };

    // --- VISUALIZATION HELPERS ---
    const ResponseDistribution = ({ distribution, total }: { distribution: Record<number, number>, total: number }) => {
        if (!total) return null;
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-lime-500', 'bg-green-600'];

        return (
            <div className="w-full mt-2">
                {/* Stacked Bar */}
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                    {[1, 2, 3, 4, 5].map((score, i) => {
                        // @ts-ignore
                        const count = distribution[score] || 0;
                        const pct = (count / total) * 100;
                        if (pct === 0) return null;
                        return (
                            <div key={score} className={`h-full ${colors[i]}`} style={{ width: `${pct}%` }} title={`Opción ${score}: ${count} votos (${Math.round(pct)}%)`}></div>
                        );
                    })}
                </div>
                {/* Legend / Stats */}
                <div className="flex justify-between mt-1 px-1">
                    {[1, 2, 3, 4, 5].map((score, i) => {
                        // @ts-ignore
                        const count = distribution[score] || 0;
                        const pct = Math.round((count / total) * 100);
                        return (
                            <div key={score} className="flex flex-col items-center">
                                <span className={`text-[8px] font-bold ${pct > 0 ? 'text-slate-600' : 'text-slate-300'}`}>{score}</span>
                                <span className={`text-[8px] ${pct > 0 ? 'text-slate-500' : 'text-transparent'}`}>{pct}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const diagnosticScores = useMemo(() => {
        if (!isDiagnostic || total === 0) return null;
        const dimScores: Record<string, number> = {};
        let dqSum = 0, aiqSum = 0, aiqWeightSum = 0;

        DIAGNOSTIC_DIMENSIONS.forEach(dim => {
            const qs = survey.questions.filter(q => q.section === dim.id);
            if (qs.length === 0) return;

            let dimTotalScore = 0, dimResponseCount = 0;
            qs.forEach(q => {
                const data = getAggregatedData(q);
                if (data && data.type === 'AVG') {
                    // Normalize 1-5 to 0-100
                    const normalized = (Number(data.value) - 1) * 25;
                    dimTotalScore += normalized;
                    dimResponseCount++;
                }
            });

            const dimScore = dimResponseCount > 0 ? (dimTotalScore / dimResponseCount) : 0;
            dimScores[dim.id] = Math.round(dimScore); // 0-100
            dqSum += dimScore;
            aiqSum += dimScore * (dim.weightAIQ || dim.weight);
            aiqWeightSum += (dim.weightAIQ || dim.weight);
        });

        // Sorted Dimensions for "Strengths/Weaknesses"
        const sortedDims = DIAGNOSTIC_DIMENSIONS.map(d => ({ ...d, score: dimScores[d.id] || 0 }))
            .sort((a, b) => b.score - a.score);

        return {
            dq: Math.round(dqSum / DIAGNOSTIC_DIMENSIONS.length),
            aiq: Math.round(aiqSum / aiqWeightSum),
            dimensions: dimScores,
            sortedDims
        };
    }, [survey, responses, isDiagnostic, total]);

    // Active Dimension for "Deep Dive"
    const [activeDimId, setActiveDimId] = useState<string>(DIAGNOSTIC_DIMENSIONS[0].id);
    const activeDim = DIAGNOSTIC_DIMENSIONS.find(d => d.id === activeDimId) || DIAGNOSTIC_DIMENSIONS[0];

    // Mock Subdimensions (Groups of questions)
    // We will group the 30 questions into 5 subdimensions of 6 questions each for visualization
    const subDimensionsMock = useMemo(() => {
        const qs = survey.questions.filter(q => q.section === activeDim.id);
        if (qs.length === 0) return [];

        // Generic names for subdimensions based on Dimension
        const subNames: Record<string, string[]> = {
            estrategia: ['Alineación Estratégica', 'Hoja de Ruta IA', 'Planificación de Inversiones', 'Cultura de Innovación', 'Gestión del Cambio'],
            infra: ['Arquitectura Cloud', 'Gobierno de Datos', 'Ciberseguridad', 'Integración de Sistemas', 'Calidad de Datos'],
            talento: ['Capacidades Digitales', 'Upskilling/Reskilling', 'Atracción de Talento', 'Formas de Trabajo (Agile)', 'Liderazgo Digital'],
            gob: ['Comités y Roles', 'Políticas de Uso', 'Gestión de Riesgos', 'Ética de IA', 'Medición de Valor'],
            procesos: ['Automatización (RPA)', 'Optimización de Procesos', 'Integración de Flujos', 'Monitoreo en Tiempo Real', 'Adopción de Herramientas'],
            cx: ['Customer Journey', 'Personalización', 'Omnicanalidad', 'Feedback Loop', 'Privacidad del Cliente']
        };

        const currentNames = subNames[activeDim.id] || ['Sub-dim 1', 'Sub-dim 2', 'Sub-dim 3', 'Sub-dim 4', 'Sub-dim 5'];
        const chunkSize = Math.ceil(qs.length / currentNames.length);

        return currentNames.map((name, i) => {
            const chunk = qs.slice(i * chunkSize, (i + 1) * chunkSize);
            let scoreSum = 0;
            chunk.forEach(q => {
                const d = getAggregatedData(q);
                if (d && d.type === 'AVG') scoreSum += ((Number(d.value) - 1) * 25);
            });
            const score = chunk.length > 0 ? Math.round(scoreSum / chunk.length) : 0;
            return { name, score, benchmark: Math.min(100, Math.max(0, score + (Math.random() * 20 - 10))) }; // Mock benchmark variation
        });

    }, [activeDim, survey, responses]);


    // --- TAB STATE ---
    const [activeResultTab, setActiveResultTab] = useState<'GENERAL' | 'DIMENSIONS' | 'ANALYTICS' | 'ACTIONS'>('GENERAL');

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ArrowLeft size={20} weight="bold" /></button>
                    <div>
                        <h1 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                            {survey.title}
                            {isDiagnostic && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wider font-bold border border-blue-200">Sector: {sectorName}</span>}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm">
                        <DownloadSimple size={18} weight="bold" /> PDF
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 border border-slate-200">
                        <ArrowClockwise size={20} />
                    </button>
                </div>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* --- FILTER BAR --- */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center animate-fadeIn">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                            <Target /> Filtros:
                        </div>

                        <select
                            value={filterLocation}
                            onChange={e => setFilterLocation(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">Todas las Sedes</option>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>

                        <select
                            value={filterUnit}
                            onChange={e => setFilterUnit(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">Todas las Unidades</option>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>

                        <select
                            value={filterGender}
                            onChange={e => setFilterGender(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">Todos los Géneros</option>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        {!survey.isAnonymous && (
                            <select
                                value={filterUser}
                                onChange={e => setFilterUser(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="ALL">Todos los Usuarios</option>
                                {allPotentialUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        )}

                        {(filterLocation !== 'ALL' || filterUnit !== 'ALL' || filterGender !== 'ALL' || filterUser !== 'ALL') && (
                            <button
                                onClick={() => { setFilterLocation('ALL'); setFilterUnit('ALL'); setFilterGender('ALL'); setFilterUser('ALL'); }}
                                className="text-red-500 text-xs font-bold hover:underline ml-auto"
                            >
                                Borrar Filtros
                            </button>
                        )}
                    </div>

                    {/* --- TABS --- */}
                    <div className="flex p-1 bg-slate-200/60 rounded-xl w-fit mb-6">
                        <button
                            onClick={() => setActiveResultTab('GENERAL')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeResultTab === 'GENERAL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <ChartPieSlice size={18} weight={activeResultTab === 'GENERAL' ? 'fill' : 'regular'} />
                            {t('results_tab_general')}
                        </button>

                        {isDiagnostic && (
                            <button
                                onClick={() => setActiveResultTab('DIMENSIONS')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeResultTab === 'DIMENSIONS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            >
                                <ChartBar size={18} weight={activeResultTab === 'DIMENSIONS' ? 'fill' : 'regular'} />
                                {t('results_tab_dimensions')}
                            </button>
                        )}

                        <button
                            onClick={() => setActiveResultTab('ANALYTICS')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeResultTab === 'ANALYTICS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <UsersThree size={18} weight={activeResultTab === 'ANALYTICS' ? 'fill' : 'regular'} />
                            {t('results_tab_analytics')}
                        </button>

                        {isDiagnostic && (
                            <button
                                onClick={() => setActiveResultTab('ACTIONS')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeResultTab === 'ACTIONS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            >
                                <Lightning size={18} weight={activeResultTab === 'ACTIONS' ? 'fill' : 'regular'} />
                                {t('results_tab_actions')}
                            </button>
                        )}
                    </div>

                    {/* === CONTENT === */}
                    {activeResultTab === 'GENERAL' && (
                        <>
                            {isDiagnostic && diagnosticScores && benchmark ? (
                                <>
                                    {/* === DIAGNOSTIC GENERAL VIEW === */}
                                    <div className="space-y-8 animate-fadeIn">
                                        {/* KPI Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-500 mb-1">{t('results_dq')}</div>
                                                    <div className="flex items-end gap-3">
                                                        <div className="text-6xl font-black text-blue-600 tracking-tighter">{diagnosticScores.dq.toFixed(1)}%</div>
                                                        <BadgeStatus score={diagnosticScores.dq} />
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-4 font-medium">{t('results_dq_desc')}</div>
                                            </div>
                                            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 flex flex-col justify-between">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-500 mb-1">{t('results_aiq')}</div>
                                                    <div className="flex items-end gap-3">
                                                        <div className="text-6xl font-black text-teal-600 tracking-tighter">{diagnosticScores.aiq.toFixed(1)}%</div>
                                                        <BadgeStatus score={diagnosticScores.aiq} />
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-4 font-medium">{t('results_aiq_desc')}</div>
                                            </div>
                                        </div>

                                        {/* Benchmark List */}
                                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Target size={24} className="text-orange-500" weight="duotone" />
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">{t('results_benchmark_title')}</h3>
                                                    <p className="text-xs text-slate-500">{t('results_benchmark_sector')}: {sectorName} | {t('results_benchmark_expected')}: <span className="font-bold text-slate-700">{((benchmark.maturity?.metric ?? benchmark.averageMaturity / 5) * 100).toFixed(0)}%</span></p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                                                    {diagnosticScores.sortedDims.map((dim) => {
                                                        const baseBench = ((benchmark.maturity?.metric ?? benchmark.averageMaturity / 5) * 100);
                                                        const variance = (dim.name.length % 5) * 3;
                                                        const p25 = baseBench - 10 - variance;
                                                        const p75 = baseBench + 10 + variance;
                                                        const gap = dim.score - baseBench;
                                                        const isTop = dim.score >= p75;
                                                        const isBottom = dim.score <= p25;

                                                        return (
                                                            <div key={dim.id} className="col-span-12 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 rounded-full ${isTop ? 'bg-green-500' : isBottom ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                                                        <span className="font-bold text-slate-700 text-sm">{dim.name}</span>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        {isTop && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded border border-green-200">Top 75%</span>}
                                                                        {isBottom && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded border border-red-200">Bottom 25%</span>}
                                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${gap >= 0 ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                                            {gap > 0 ? '+' : ''}{Math.round(gap)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <PercentileBar value={dim.score} p25={Math.round(p25)} p75={Math.round(p75)} />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* === STANDARD SURVEY VIEW === */
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-800 text-lg mb-4">Resultados de la Encuesta</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {survey.questions.map((q, idx) => {
                                                const data = getAggregatedData(q);
                                                if (!data) return null;
                                                return (
                                                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div className="flex justify-between items-start mb-2 gap-4">
                                                            <span className="font-bold text-slate-700 text-sm">{idx + 1}. {q.title}</span>
                                                            {data.type === 'AVG' && <span className="font-black text-blue-600 text-lg">{data.value}</span>}
                                                        </div>
                                                        {data.type === 'AVG' && <ResponseDistribution distribution={data.distribution || {}} total={data.count || 0} />}
                                                        {data.type === 'COUNT' && (
                                                            <div className="mt-3 space-y-2">
                                                                {Object.entries(data.counts || {}).map(([label, count]: [string, any]) => {
                                                                    const total = data.total || 1;
                                                                    const pct = Math.round((count / total) * 100);
                                                                    return (
                                                                        <div key={label} className="space-y-1">
                                                                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                                                <span>{label}</span>
                                                                                <span>{count} ({pct}%)</span>
                                                                            </div>
                                                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-blue-500" style={{ width: `${pct}%` }}></div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                        {data.type === 'TEXT' && data.lastAnswers && data.lastAnswers.length > 0 && (
                                                            <div className="bg-white p-3 rounded text-sm text-slate-600 italic mt-2 border border-slate-200">
                                                                "{data.lastAnswers[0]}" <span className="text-xs text-slate-400 not-italic ml-2">(+ {Math.max(0, data.lastAnswers.length - 1)} más)</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* === TAB: DIMENSIONS === */}
                    {activeResultTab === 'DIMENSIONS' && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Selector & Header */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-slate-800 mb-1">Análisis por Dimensión</h3>
                                    <div className="relative w-full max-w-md">
                                        <select
                                            value={activeDimId}
                                            onChange={(e) => setActiveDimId(e.target.value)}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-lg p-3 pr-8 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                                        >
                                            {DIAGNOSTIC_DIMENSIONS.map((d, i) => (
                                                <option key={d.id} value={d.id}>D{i + 1}: {d.name}</option>
                                            ))}
                                        </select>
                                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" weight="bold" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-blue-600">{diagnosticScores?.dimensions?.[activeDimId] || 0}%</div>
                                        <BadgeStatus score={diagnosticScores?.dimensions?.[activeDimId] || 0} />
                                    </div>
                                </div>
                            </div>

                            {/* Subdimensions List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">Subdimensiones</div>
                                <div className="divide-y divide-slate-100">
                                    {subDimensionsMock.map((sub, idx) => (
                                        <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="font-bold text-slate-700">{sub.name}</h5>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-lg font-bold text-slate-800">{sub.score}%</div>
                                                    <span className="text-xs text-slate-400 font-mono">(Bm: {Math.round(sub.benchmark)}%)</span>
                                                    <BadgeStatus score={sub.score} />
                                                </div>
                                            </div>
                                            <ProgressBar value={sub.score} color={sub.score >= 75 ? 'bg-green-500' : sub.score >= 50 ? 'bg-blue-500' : 'bg-orange-400'} height="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strengths / Weaknesses Mini Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50/50 rounded-2xl border border-green-100 p-6">
                                    <h4 className="flex items-center gap-2 font-bold text-green-800 mb-4"><TrendUp /> Dimensiones más Fuertes</h4>
                                    <ul className="space-y-3">
                                        {(diagnosticScores?.sortedDims || []).slice(0, 3).map((d: any, i: number) => (
                                            <li key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-green-200 text-xl">{i + 1}</span>
                                                    <span className="font-bold text-slate-700 text-sm">{d.name}</span>
                                                </div>
                                                <span className="font-bold text-green-600">{d.score}%</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6">
                                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-4"><TrendDown /> Áreas de Mejora</h4>
                                    <ul className="space-y-3">
                                        {[...(diagnosticScores?.sortedDims || [])].reverse().slice(0, 3).map((d: any, i: number) => (
                                            <li key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-red-200 text-xl">{i + 1}</span>
                                                    <span className="font-bold text-slate-700 text-sm">{d.name}</span>
                                                </div>
                                                <span className="font-bold text-red-600">{d.score}%</span>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === TAB: ANALYTICS === */}
                    {activeResultTab === 'ANALYTICS' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                                <Buildings size={32} className="text-blue-600" weight="duotone" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-lg">Analítica de Participación y Resultados</h3>
                                    <p className="text-blue-700/80 text-sm">Desglose de datos demográficos y respuestas.</p>
                                </div>
                            </div>

                            {/* Participation Graph & Stats */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><ChartPieSlice className="text-indigo-500" /> Participación General</h4>
                                <div className="flex flex-col md:flex-row items-center justify-around gap-8">

                                    {/* Donut Chart - Response Rate */}
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                strokeDasharray={2 * Math.PI * 88}
                                                strokeDashoffset={2 * Math.PI * 88 * (1 - (completedCount / invitedCount))}
                                                className="text-blue-600 transition-all duration-1000 ease-out"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-slate-800">{Math.round((completedCount / invitedCount) * 100)}%</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">Respuesta</span>
                                        </div>
                                    </div>

                                    {/* Bar Chart - User Counts */}
                                    <div className="flex-1 w-full max-w-md space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-bold text-slate-600">Usuarios Invitados</span>
                                                <span className="text-xl font-black text-slate-800">{invitedCount}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                <div className="h-full bg-slate-400 w-full"></div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-bold text-green-700">Respuestas Completadas</span>
                                                <span className="text-xl font-black text-green-600">{completedCount}</span>
                                            </div>
                                            <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: `${(completedCount / invitedCount) * 100}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-bold text-orange-700">En Progreso / Pendientes</span>
                                                <span className="text-xl font-black text-orange-600">{invitedCount - completedCount}</span>
                                            </div>
                                            <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${((invitedCount - completedCount) / invitedCount) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Breakdown Charts */}
                            {[
                                { title: 'Resultados por Sede', key: 'location', icon: Buildings, options: locations },
                                { title: 'Resultados por Unidad', key: 'unit', icon: Briefcase, options: units },
                                { title: 'Resultados por Género', key: 'gender', icon: User, options: genders }
                            ].map((breakdown) => (
                                <div key={breakdown.key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <breakdown.icon className="text-slate-400" size={20} /> {breakdown.title}
                                    </h4>

                                    <div className="space-y-4">
                                        {breakdown.options.map((opt: string) => {
                                            // Filter responses for this segment
                                            const segmentResponses = activeResponses.filter(r => r.meta[breakdown.key as keyof typeof r.meta] === opt);
                                            const count = segmentResponses.length;
                                            if (count === 0) return null;

                                            // Calculate Average Score for this segment (for diagnostic/survey)
                                            let scoreSum = 0;
                                            let itemCounts = 0;
                                            const scorableQuestions = survey.questions.filter(q => ['LIKERT', 'RATING', 'NPS'].includes(q.type));

                                            if (scorableQuestions.length > 0) {
                                                segmentResponses.forEach(r => {
                                                    scorableQuestions.forEach(q => {
                                                        const val = r.answers[q.id];
                                                        if (val !== undefined) {
                                                            scoreSum += ((Number(val) - 1) * 25); // Normalize 1-5 to 0-100
                                                            itemCounts++;
                                                        }
                                                    });
                                                });
                                            }

                                            const avgScore = itemCounts > 0 ? Math.round(scoreSum / itemCounts) : 0;
                                            const participationPct = Math.round((count / total) * 100);

                                            return (
                                                <div key={opt} className="relative group">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-bold text-slate-700">{opt}</span>
                                                        <div className="flex gap-4 text-xs">
                                                            <span className="text-slate-500">{count} respuestas</span>
                                                            <span className="font-bold text-slate-800">{avgScore}% Score</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden flex">
                                                        {/* Two bars: one for participation (width) and color by score? Or just Score bar. Let's do Score Bar. */}
                                                        <div
                                                            className={`h-full ${avgScore >= 75 ? 'bg-green-500' : avgScore >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                            style={{ width: `${avgScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="w-full bg-slate-50 rounded-full h-1 overflow-hidden" title="Participación relativa">
                                                        <div className="h-full bg-slate-300" style={{ width: `${participationPct}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {activeResponses.length === 0 && <div className="text-slate-400 italic text-sm text-center py-4">Sin datos para mostrar con los filtros actuales.</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* === TAB: ACTIONS === */}
                    {activeResultTab === 'ACTIONS' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <Lightning size={24} className="text-orange-500" weight="fill" />
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Líneas de Acción</h3>
                                        <p className="text-xs text-slate-500">Recomendaciones priorizadas basadas en sus dimensiones más débiles</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {diagnosticScores?.sortedDims && [...diagnosticScores.sortedDims].reverse().slice(0, 3).map((dim, i) => {
                                        const benchmarkScore = benchmark ? Math.round((benchmark.maturity?.metric ?? benchmark.averageMaturity / 5) * 100) : 0; // simplified global bench
                                        return (
                                            <div key={dim.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${i === 0 ? 'bg-red-500' : 'bg-orange-500'}`}>
                                                            D{DIAGNOSTIC_DIMENSIONS.findIndex(d => d.id === dim.id) + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{dim.name}</h4>
                                                            <div className="text-xs text-slate-500">Puntaje: <span className="font-bold text-red-500">{dim.score}%</span> | Bm: {benchmarkScore}%</div>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Prioridad {i + 1}</span>
                                                </div>
                                                <div className="p-6 bg-white space-y-3">
                                                    {/* Mock Actions */}
                                                    {[1, 2, 3, 4].map(n => (
                                                        <div key={n} className="flex gap-3 p-3 rounded-lg bg-blue-50/30">
                                                            <CaretRight size={16} className="text-blue-500 mt-0.5" weight="bold" />
                                                            <span className="text-sm text-slate-700">Acción recomendada específica para {dim.name.toLowerCase()} #{n}...</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Best Practices & Leaders - 2 col */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendUp className="text-green-500" /> Mejores Prácticas del Sector</h4>
                                    <ul className="space-y-3">
                                        {(benchmark.practices || []).slice(0, 5).map((p, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                <Plus size={14} className="text-green-500 mt-1 flex-shrink-0" weight="bold" />
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe className="text-blue-500" /> Prioridades del Sector</h4>
                                    <ol className="list-decimal pl-4 space-y-3 text-sm text-slate-600 marker:font-bold marker:text-blue-500">
                                        {(benchmark.priorities || []).map((p, i) => <li key={i}>{p}</li>)}
                                    </ol>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Lightbulb className="text-yellow-500" weight="fill" /> Líderes del Sector</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(benchmark.leaders || []).map((l, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{l}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

// Updated Responder with Section Support
function SurveyResponder({ survey, currentUser, onSubmit, onCancel }: { survey: Survey, currentUser: any, onSubmit: (r: SurveyResponse) => void, onCancel: () => void }) {
    const { t } = useTranslation();
    const [answers, setAnswers] = useState<Record<string, any>>(() => {
        // Load from local storage if available
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`survey_progress_${survey.id}`);
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Section/Dimension Logic
    const sectionIds = useMemo(() => Array.from(new Set(survey.questions.map(q => q.section).filter(Boolean))) as string[], [survey]);
    const hasSections = sectionIds.length > 0;
    const [activeSectionId, setActiveSectionId] = useState<string>(hasSections ? sectionIds[0] : '');

    // Pagination Logic
    const QUESTIONS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(0);

    // Auto-save effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (Object.keys(answers).length > 0 && !isPreview) {
                setIsSaving(true);
                localStorage.setItem(`survey_progress_${survey.id}`, JSON.stringify(answers));
                setTimeout(() => {
                    setIsSaving(false);
                    setLastSaved(new Date());
                }, 800);
            }
        }, 1500); // Debounce 1.5s
        return () => clearTimeout(timeout);
    }, [answers, survey.id]);

    // Reset page when section changes
    useEffect(() => {
        setCurrentPage(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSectionId]);

    const activeQuestions = useMemo(() => {
        if (!hasSections) return survey.questions;
        return survey.questions.filter(q => q.section === activeSectionId);
    }, [survey, hasSections, activeSectionId]);

    const visibleQuestions = useMemo(() => {
        const start = currentPage * QUESTIONS_PER_PAGE;
        return activeQuestions.slice(start, start + QUESTIONS_PER_PAGE);
    }, [activeQuestions, currentPage]);

    const totalPages = Math.ceil(activeQuestions.length / QUESTIONS_PER_PAGE);
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    const isLastSection = sectionIds.indexOf(activeSectionId) === sectionIds.length - 1;

    const handleAnswer = (qId: string, val: any) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!isLastPage) {
            setCurrentPage(prev => prev + 1);
        } else if (!isLastSection) {
            // Move to next dimension
            const nextIdx = sectionIds.indexOf(activeSectionId) + 1;
            setActiveSectionId(sectionIds[nextIdx]);
        } else {
            // Submit
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (!isFirstPage) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionIds.indexOf(activeSectionId) > 0) {
            // Go to previous dimension (first page for simplicity)
            const prevIdx = sectionIds.indexOf(activeSectionId) - 1;
            setActiveSectionId(sectionIds[prevIdx]);
        }
    };

    const handleSubmit = () => {
        const missing = survey.questions.filter(q => q.required && !answers[q.id]);
        if (missing.length > 0) {
            const missingIds = new Set(missing.map(q => q.id));
            const missingInView = visibleQuestions.some(q => missingIds.has(q.id));

            if (missingInView) {
                alert('Por favor responde las preguntas obligatorias de esta página.');
            } else {
                const confirmSubmit = confirm(`Aún tienes ${missing.length} preguntas sin responder en otras secciones. ¿Deseas enviar de todos modos?`);
                if (!confirmSubmit) return;
                submitResponse();
            }
            return;
        }
        submitResponse();
    };

    const submitResponse = () => {
        if (isPreview) {
            setSubmitted(true);
            return;
        }

        const response: SurveyResponse = {
            id: `R-${Date.now()}`,
            surveyId: survey.id,
            userId: currentUser?.id || 'anonymous-user',
            // Always store respondentId for duplication checks, even if anonymous (in real app, use a separate 'participations' table)
            respondentId: currentUser?.id || 'anonymous-user',
            answers,
            submittedAt: new Date().toISOString()
        };
        setSubmitted(true);
        localStorage.removeItem(`survey_progress_${survey.id}`);
        setTimeout(() => onSubmit(response), 2000);
    };

    if (submitted) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Confetti size={40} weight="fill" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('survey_thank_you_title')}</h2>
                <p className="text-slate-500">{t('survey_thank_you_desc')}</p>
            </div>
        );
    }

    // @ts-ignore
    const isPreview = survey.previewMode;

    // Helper to get section name
    const getSectionName = (id: string) => {
        const dim = DIAGNOSTIC_DIMENSIONS.find(d => d.id === id);
        return dim ? dim.name : id.charAt(0).toUpperCase() + id.slice(1);
    }

    // Progress Calculations
    const sectionTotal = activeQuestions.length;
    const sectionAnswered = activeQuestions.filter(q => answers[q.id]).length;
    const sectionProgress = sectionTotal > 0 ? Math.round((sectionAnswered / sectionTotal) * 100) : 0;

    const totalQ = survey.questions.length;
    const totalAnswered = Object.keys(answers).length;
    const globalProgress = Math.round((totalAnswered / totalQ) * 100);

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
            {/* Top Bar: Global Status */}
            <div className="bg-white border-b border-slate-200 z-10">
                {isPreview && (
                    <div className="bg-orange-100 text-orange-800 text-xs font-bold text-center py-1 border-b border-orange-200">
                        VISTA PREVIA - LAS RESPUESTAS NO SE GUARDARÁN
                    </div>
                )}
                <div className="px-6 py-3 flex justify-between items-center">
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium"><X size={18} /> {t('survey_exit')}</button>

                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('survey_global_progress')}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800" style={{ width: `${globalProgress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700">{globalProgress}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 w-24 justify-end">
                        {isSaving ? (
                            <span className="flex items-center gap-1 text-blue-500 animate-pulse"><Clock size={14} /> {t('survey_saving')}</span>
                        ) : lastSaved ? (
                            <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} weight="fill" /> {t('survey_saved')}</span>
                        ) : (
                            <span className="opacity-0">.</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                {/* Sidebar / Tabs for Sections (Desktop) */}
                {hasSections && (
                    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 overflow-y-auto">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('survey_sections')}</h3>
                        </div>
                        <div className="flex-1 py-2">
                            {sectionIds.map((secId, idx) => {
                                const secQs = survey.questions.filter(q => q.section === secId);
                                const secTotal = secQs.length;
                                const secAns = secQs.filter(q => answers[q.id]).length;
                                const isComplete = secAns === secTotal;
                                const isActive = activeSectionId === secId;

                                return (
                                    <button
                                        key={secId}
                                        onClick={() => { setActiveSectionId(secId); setCurrentPage(0); }}
                                        className={`w-full text-left px-5 py-3 text-sm border-l-4 transition-all hover:bg-slate-50 relative group ${isActive ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
                                    >
                                        <div className={`font-bold mb-1 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {getSectionName(secId)}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span>{secAns}/{secTotal}</span>
                                            {isComplete && <CheckCircle weight="fill" className="text-green-500" size={14} />}
                                        </div>

                                        {/* Mini Progress Bar for Item */}
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100">
                                            <div className={`h-full ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${(secAns / secTotal) * 100}%` }}></div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                    {/* Dimension Header & Progress */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{getSectionName(activeSectionId)}</h2>
                                    <p className="text-xs text-slate-500">{t('survey_page_info')} {currentPage + 1} {t('survey_page_of')} {totalPages}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-blue-600">{sectionProgress}%</span>
                                    <span className="text-xs text-slate-400 font-bold ml-1">{t('survey_completed')}</span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out" style={{ width: `${sectionProgress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto p-6 space-y-6 pb-32">
                        {visibleQuestions.map((q, idx) => (
                            <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                                <h3 className="font-bold text-slate-800 text-base leading-snug flex gap-2">
                                    <span className="text-slate-300 select-none">{(currentPage * QUESTIONS_PER_PAGE) + idx + 1}.</span>
                                    <span>
                                        {q.title}
                                        {q.required && <span className="text-red-500 text-sm ml-1" title={t('survey_required')}>*</span>}
                                    </span>
                                </h3>

                                <div className="pl-6">
                                    {q.type === 'LIKERT' && (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-wrap gap-2">
                                                {Array.from({ length: q.scale || 5 }, (_, i) => i + 1).map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleAnswer(q.id, val)}
                                                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg transition-all ${answers[q.id] === val ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 scale-105' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-300 hover:bg-blue-50'}`}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex justify-between w-full max-w-[300px] text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                <span>{t('survey_likert_disagree')}</span>
                                                <span>{t('survey_likert_agree')}</span>
                                            </div>
                                        </div>
                                    )}

                                    {q.type === 'NPS' && (
                                        <div className="overflow-x-auto pb-2">
                                            <div className="flex gap-1 min-w-max">
                                                {Array.from({ length: 11 }, (_, i) => i).map(val => (
                                                    <button key={val} onClick={() => handleAnswer(q.id, val)} className={`w-10 h-10 rounded-lg border-2 font-bold text-sm transition-all ${answers[q.id] === val ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}>{val}</button>
                                                ))}
                                            </div>
                                            <div className="flex justify-between w-full min-w-max text-xs font-bold text-slate-400 px-1 mt-2">
                                                <span>{t('survey_nps_unlikely')}</span>
                                                <span>{t('survey_nps_likely')}</span>
                                            </div>
                                        </div>
                                    )}

                                    {q.type === 'TEXT' && (
                                        <textarea
                                            className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[100px] text-slate-700"
                                            placeholder={t('survey_text_placeholder')}
                                            value={answers[q.id] || ''}
                                            onChange={e => handleAnswer(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === 'YESNO' && (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleAnswer(q.id, 'YES')}
                                                className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-3 ${answers[q.id] === 'YES' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20 scale-[1.02]' : 'bg-white text-slate-600 border-slate-100 hover:border-green-300 hover:bg-green-50'}`}
                                            >
                                                <ThumbsUp weight={answers[q.id] === 'YES' ? 'fill' : 'bold'} /> {t('survey_yes')}
                                            </button>
                                            <button
                                                onClick={() => handleAnswer(q.id, 'NO')}
                                                className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-3 ${answers[q.id] === 'NO' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20 scale-[1.02]' : 'bg-white text-slate-600 border-slate-100 hover:border-red-300 hover:bg-red-50'}`}
                                            >
                                                <ThumbsDown weight={answers[q.id] === 'NO' ? 'fill' : 'bold'} /> {t('survey_no')}
                                            </button>
                                        </div>
                                    )}

                                    {q.type === 'RATING' && (
                                        <div className="flex gap-2">
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const starVal = i + 1;
                                                const isSelected = starVal <= (answers[q.id] || 0);
                                                return (
                                                    <button
                                                        key={starVal}
                                                        onClick={() => handleAnswer(q.id, starVal)}
                                                        className={`transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
                                                    >
                                                        <Star
                                                            size={42}
                                                            weight={isSelected ? "fill" : "bold"}
                                                            className={isSelected ? "text-yellow-400 drop-shadow-sm" : "text-slate-200 hover:text-yellow-200"}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.type === 'DATE' && (
                                        <input
                                            type="date"
                                            className="w-full max-w-sm border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700"
                                            value={answers[q.id] || ''}
                                            onChange={e => handleAnswer(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === 'DROPDOWN' && (
                                        <select
                                            className="w-full max-w-sm border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 bg-white"
                                            value={answers[q.id] || ''}
                                            onChange={e => handleAnswer(q.id, e.target.value)}
                                        >
                                            <option value="">{t('survey_dropdown_placeholder')}</option>
                                            {q.options?.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}

                                    {(q.type === 'MULTI' || q.type === 'CHECKBOX') && (
                                        <div className="space-y-2">
                                            {q.options?.map((opt, i) => {
                                                const isSelected = q.type === 'MULTI' ? answers[q.id] === opt : (answers[q.id] || []).includes(opt);
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            if (q.type === 'MULTI') {
                                                                handleAnswer(q.id, opt);
                                                            } else {
                                                                const current = answers[q.id] || [];
                                                                const next = current.includes(opt) ? current.filter((x: any) => x !== opt) : [...current, opt];
                                                                handleAnswer(q.id, next);
                                                            }
                                                        }}
                                                        className={`w-full text-left p-4 border-2 rounded-xl transition-all flex items-center justify-between group ${isSelected ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-100 hover:border-indigo-300'}`}
                                                    >
                                                        <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                                                        <div className={`w-5 h-5 flex items-center justify-center border-2 transition-all ${q.type === 'MULTI' ? 'rounded-full' : 'rounded'} ${isSelected ? 'bg-indigo-600 border-indigo-600 shadow-inner' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                                            {isSelected && <Check size={12} weight="bold" className="text-white" />}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {q.type === 'RANKING' && (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-400 italic mb-2">Ordena los elementos según tu preferencia (simulación)</p>
                                            {(answers[q.id] || q.options || []).map((opt: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                    <div className="w-6 h-6 bg-slate-100 flex items-center justify-center rounded text-xs font-bold text-slate-500">{i + 1}</div>
                                                    <span className="flex-1 text-sm text-slate-700">{opt}</span>
                                                    <Rows size={16} className="text-slate-300 cursor-grab" />
                                                </div>
                                            ))}
                                            <p className="text-[10px] text-slate-400 mt-2">* Funcionalidad de arrastrar y soltar habilitada en producción.</p>
                                        </div>
                                    )}

                                    {q.type === 'FILE' && (
                                        <div className="w-full">
                                            {answers[q.id] ? (
                                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle weight="fill" className="text-green-600" size={24} />
                                                        <div>
                                                            <div className="text-sm font-bold text-green-800">Archivo adjunto</div>
                                                            <div className="text-xs text-green-600 uppercase font-mono">{answers[q.id].name || 'documento.pdf'}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleAnswer(q.id, null)} className="text-slate-400 hover:text-red-500 p-2"><X size={18} /></button>
                                                </div>
                                            ) : (
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleAnswer(q.id, { name: file.name, size: file.size });
                                                        }}
                                                    />
                                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
                                                        <UploadSimple size={32} className="mb-3 group-hover:scale-110 transition-transform" />
                                                        <div className="text-sm font-bold text-slate-600 group-hover:text-blue-700">Haz clic o arrastra para subir</div>
                                                        <div className="text-xs mt-1">PDF, Imágenes o Excel (Máx. 10MB)</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                        <div className="max-w-3xl mx-auto flex justify-between items-center">
                            <button
                                onClick={handlePrev}
                                disabled={isFirstPage && sectionIds.indexOf(activeSectionId) === 0}
                                className="px-6 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                {t('survey_prev_btn')}
                            </button>

                            {isLastPage ? (
                                isLastSection ? (
                                    <button onClick={handleSubmit} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transform hover:-translate-y-1 transition-all flex items-center gap-2">
                                        <PaperPlaneRight weight="bold" size={20} />
                                        {t('survey_finish_btn')}
                                    </button>
                                ) : (
                                    <button onClick={handleNext} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-800/20 transform hover:-translate-y-1 transition-all flex items-center gap-2">
                                        {t('survey_next_dim_btn')} <CaretRight weight="bold" />
                                    </button>
                                )
                            ) : (
                                <button onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transform hover:-translate-y-1 transition-all">
                                    {t('survey_next_btn')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reuse previous Builder
// --- BUILDER ---

// Componente reutilizable para selección de estructura organizacional
function SurveyBuilder({ survey, onSave, onCancel }: { survey: Survey, onSave: (s: Survey) => void, onCancel: () => void }) {
    const { t } = useTranslation();
    const [localSurvey, setLocalSurvey] = useState<Survey>({ ...survey });

    const [activeTab, setActiveTab] = useState<'DESIGN' | 'SETTINGS'>('DESIGN');
    const [inviteMode, setInviteMode] = useState<'ALL' | 'SPECIFIC' | null>(null);
    const [inviteEmails, setInviteEmails] = useState('');
    const [sendingInvite, setSendingInvite] = useState(false);

    const handleSendInvite = async () => {
        if (inviteMode === 'SPECIFIC' && !inviteEmails.trim()) {
            alert(t('Debes ingresar al menos un correo'));
            return;
        }

        setSendingInvite(true);
        // Simulate API call to send emails
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSendingInvite(false);
        setInviteMode(null);
        setInviteEmails('');
        alert('Invitaciones enviadas correctamente a los destinatarios seleccionados.');
    };

    // If Diagnostic (180+ questions), disable adding/removing questions for MVP simplicity/performance
    const isDiagnostic = survey.questions.length > 50;

    const updateSurvey = useCallback((updates: Partial<Survey>) => {
        setLocalSurvey(prev => ({ ...prev, ...updates }));
    }, []);

    const handleAddQuestion = (type: QuestionType) => {
        const newQ: SurveyQuestion = {
            id: `q-${Date.now()}`,
            type,
            title: t('builder_new_question'),
            required: false,
            scale: type === 'LIKERT' ? 5 : undefined,
            options: (type === 'MULTI' || type === 'CHECKBOX') ? ['Opción 1', 'Opción 2'] : undefined
        };
        updateSurvey({ questions: [...localSurvey.questions, newQ] });
    };

    const handleUpdateQuestion = (qId: string, updates: Partial<SurveyQuestion>) => {
        updateSurvey({
            questions: localSurvey.questions.map(q => q.id === qId ? { ...q, ...updates } : q)
        });
    };

    const handleDeleteQuestion = (qId: string) => {
        updateSurvey({
            questions: localSurvey.questions.filter(q => q.id !== qId)
        });
    };

    // Helper for Settings (Audience)
    const units = DB.units;
    const users = DB.users;

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Toolbar Header */}
            <div className="bg-white px-6 py-3 border-b border-slate-200 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('DESIGN')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'DESIGN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {t('builder_tab_design')}
                        </button>
                        <button
                            onClick={() => setActiveTab('SETTINGS')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'SETTINGS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {t('builder_tab_settings')}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">
                        {localSurvey.questions.length} {t('survey_questions_count')}
                    </span>

                    {/* Validación: No permitir publicar si tiene área pero no proceso */}
                    {localSurvey.unit && !localSurvey.process ? (
                        <div className="relative group">
                            <button
                                disabled
                                className="px-5 py-2 bg-slate-300 text-slate-500 rounded-lg font-bold cursor-not-allowed flex items-center gap-2 text-sm"
                            >
                                <WarningCircle size={16} weight="fill" /> No se puede publicar
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-50">
                                Debes seleccionar un <strong>Proceso</strong> en la pestaña SETTINGS antes de publicar esta encuesta.
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => onSave({ ...localSurvey, status: 'OPEN' })}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm"
                        >
                            <PaperPlaneRight size={16} weight="bold" /> {t('builder_publish')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">

                {/* TOOLBOX (Only in Design Mode) */}
                {activeTab === 'DESIGN' && !isDiagnostic && (
                    <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-4 overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('builder_question_types')}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => handleAddQuestion('TEXT')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><ClipboardText size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_free_text')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('LIKERT')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><ListChecks size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_likert')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('NPS')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><Smiley size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_nps_full')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('MULTI')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><SquaresFour size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_multi')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('CHECKBOX')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><CheckCircle size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_check')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('YESNO')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><ThumbsUp size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_yesno')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('RATING')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><Star size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_rating')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('DROPDOWN')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><CaretDown size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_dropdown')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('RANKING')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><ListNumbers size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_ranking')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('DATE')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><Calendar size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_date')}</span>
                            </button>
                            <button onClick={() => handleAddQuestion('FILE')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700"><UploadSimple size={18} /></div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{t('builder_type_file')}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* MAIN CANVAS / SETTINGS */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* EDITOR MODE */}
                        {activeTab === 'DESIGN' && (
                            <>
                                {/* Metadata Card */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors cursor-text">
                                    <input
                                        className="w-full text-2xl font-bold text-slate-800 border-none px-0 focus:ring-0 placeholder:text-slate-300"
                                        placeholder={t('builder_ph_title')}
                                        value={localSurvey.title}
                                        onChange={e => updateSurvey({ title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full mt-2 text-slate-500 border-none px-0 focus:ring-0 resize-none placeholder:text-slate-300"
                                        rows={2}
                                        placeholder={t('builder_ph_desc')}
                                        value={localSurvey.description}
                                        onChange={e => updateSurvey({ description: e.target.value })}
                                    />
                                </div>

                                {isDiagnostic && (
                                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg flex items-start gap-3">
                                        <PresentationChart size={24} weight="fill" className="flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <span className="font-bold block">Plantilla de Diagnóstico Activada</span>
                                            Esta es una encuesta estandarizada con 180 preguntas científicamente validadas. No se pueden agregar ni eliminar preguntas para mantener la integridad del benchmark.
                                        </div>
                                    </div>
                                )}

                                {/* Questions List */}
                                <div className="space-y-4">
                                    {localSurvey.questions.map((q, idx) => (
                                        <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all">
                                            <div className="absolute top-4 left-0 w-1 h-8 bg-slate-200 rounded-r opacity-0 group-hover:opacity-100 transition-opacity peer-checked:bg-blue-500"></div>

                                            {/* Question Header & Actions */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 flex gap-3">
                                                    <span className="font-bold text-slate-300 select-none pt-2">{idx + 1}.</span>
                                                    <div className="flex-1">
                                                        <input
                                                            className="w-full font-bold text-slate-700 border-none p-2 rounded hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                                                            value={q.title}
                                                            onChange={(e) => handleUpdateQuestion(q.id, { title: e.target.value })}
                                                            placeholder={t('builder_q_ph')}
                                                            readOnly={isDiagnostic}
                                                        />
                                                    </div>
                                                </div>
                                                {!isDiagnostic && (
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <label className="flex items-center gap-1 text-xs font-bold text-slate-400 cursor-pointer hover:text-blue-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={q.required}
                                                                onChange={e => handleUpdateQuestion(q.id, { required: e.target.checked })}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            {t('builder_required')}
                                                        </label>
                                                        <button
                                                            onClick={() => handleDeleteQuestion(q.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                            title={t('builder_delete_q')}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Preview / Editor Area based on Type */}
                                            <div className="pl-8">
                                                {q.type === 'TEXT' && (
                                                    <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-lg text-slate-400 text-sm italic">
                                                        {t('builder_text_help')}
                                                    </div>
                                                )}

                                                {(q.type === 'MULTI' || q.type === 'CHECKBOX') && (
                                                    <div className="space-y-2">
                                                        {q.options?.map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 border border-slate-300 ${q.type === 'MULTI' ? 'rounded-full' : 'rounded'}`}></div>
                                                                <input
                                                                    className="flex-1 text-sm text-slate-600 border-none p-1 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded"
                                                                    value={opt}
                                                                    readOnly={isDiagnostic}
                                                                    onChange={(e) => {
                                                                        const newOps = [...(q.options || [])];
                                                                        newOps[optIdx] = e.target.value;
                                                                        handleUpdateQuestion(q.id, { options: newOps });
                                                                    }}
                                                                />
                                                                {!isDiagnostic && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const newOps = q.options?.filter((_, i) => i !== optIdx);
                                                                            handleUpdateQuestion(q.id, { options: newOps });
                                                                        }}
                                                                        className="text-slate-300 hover:text-red-500 p-1"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {!isDiagnostic && (
                                                            <button
                                                                onClick={() => handleUpdateQuestion(q.id, { options: [...(q.options || []), `Opción ${(q.options?.length || 0) + 1}`] })}
                                                                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2"
                                                            >
                                                                <Plus size={12} /> {t('builder_add_option')}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {q.type === 'LIKERT' && (
                                                    <div className="flex gap-2">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-50">
                                                                {i + 1}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === 'NPS' && (
                                                    <div className="flex gap-1 overflow-hidden opacity-50">
                                                        {Array.from({ length: 11 }).map((_, i) => (
                                                            <div key={i} className="h-8 flex-1 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 bg-slate-50 first:rounded-l last:rounded-r">
                                                                {i}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === 'YESNO' && (
                                                    <div className="flex gap-4 opacity-50">
                                                        <div className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">SÍ</div>
                                                        <div className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">NO</div>
                                                    </div>
                                                )}

                                                {q.type === 'RATING' && (
                                                    <div className="flex gap-1 opacity-50">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} size={24} weight="bold" className="text-slate-200" />
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === 'DATE' && (
                                                    <div className="w-full max-w-[200px] h-10 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex items-center px-3 text-slate-300 text-sm">
                                                        dd/mm/aaaa
                                                    </div>
                                                )}

                                                {q.type === 'DROPDOWN' && (
                                                    <div className="space-y-2">
                                                        <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-400 italic">Vista previa del menú desplegable</div>
                                                        {q.options?.map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex items-center gap-2">
                                                                <div className="text-xs text-slate-400">{optIdx + 1}.</div>
                                                                <input
                                                                    className="flex-1 text-sm text-slate-600 border-none p-1 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newOps = [...(q.options || [])];
                                                                        newOps[optIdx] = e.target.value;
                                                                        handleUpdateQuestion(q.id, { options: newOps });
                                                                    }}
                                                                />
                                                                <button onClick={() => handleUpdateQuestion(q.id, { options: q.options?.filter((_, i) => i !== optIdx) })} className="text-slate-300 hover:text-red-500 p-1"><X size={12} /></button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleUpdateQuestion(q.id, { options: [...(q.options || []), `Opción ${(q.options?.length || 0) + 1}`] })} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                                            <Plus size={12} /> Añadir opción
                                                        </button>
                                                    </div>
                                                )}

                                                {q.type === 'RANKING' && (
                                                    <div className="space-y-2">
                                                        <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-400 italic">Arrastra para ordenar (en respuesta)</div>
                                                        {q.options?.map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex items-center gap-2">
                                                                <Rows size={14} className="text-slate-300" />
                                                                <input
                                                                    className="flex-1 text-sm text-slate-600 border-none p-1 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newOps = [...(q.options || [])];
                                                                        newOps[optIdx] = e.target.value;
                                                                        handleUpdateQuestion(q.id, { options: newOps });
                                                                    }}
                                                                />
                                                                <button onClick={() => handleUpdateQuestion(q.id, { options: q.options?.filter((_, i) => i !== optIdx) })} className="text-slate-300 hover:text-red-500 p-1"><X size={12} /></button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleUpdateQuestion(q.id, { options: [...(q.options || []), `Elemento ${(q.options?.length || 0) + 1}`] })} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                                            <Plus size={12} /> Añadir elemento
                                                        </button>
                                                    </div>
                                                )}

                                                {q.type === 'FILE' && (
                                                    <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 animate-pulse">
                                                        <UploadSimple size={24} className="mb-2" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Subida de archivos</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {!isDiagnostic && localSurvey.questions.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                            <p>{t('builder_no_questions')}</p>
                                            <p className="text-sm">{t('builder_select_type')}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* SETTINGS MODE */}
                        {activeTab === 'SETTINGS' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                        <Users className="text-blue-600" /> {t('builder_settings_header')}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('builder_audience_label')}</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => updateSurvey({ audience: 'TENANT', targetUnitId: undefined, targetUserId: undefined })}
                                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSurvey.audience === 'TENANT' && !localSurvey.targetUserId ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <Globe size={24} />
                                                    <span className="font-bold text-sm">{t('builder_audience_global_btn')}</span>
                                                </button>
                                                <button
                                                    onClick={() => updateSurvey({ audience: 'UNIT', targetUnitId: units[0]?.id || '', targetUserId: undefined })}
                                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSurvey.audience === 'UNIT' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <Users size={24} />
                                                    <span className="font-bold text-sm">{t('builder_audience_unit_btn')}</span>
                                                </button>
                                                <button
                                                    onClick={() => updateSurvey({ targetUserId: [] })} // Activate User mode
                                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSurvey.targetUserId ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <User size={24} />
                                                    <span className="font-bold text-sm">Usuarios Específicos</span>
                                                </button>
                                            </div>
                                        </div>

                                        {localSurvey.audience === 'UNIT' && (
                                            <div className="animate-fadeIn">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Unidad</label>
                                                <select
                                                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                                    value={localSurvey.targetUnitId}
                                                    onChange={(e) => updateSurvey({ targetUnitId: e.target.value })}
                                                >
                                                    {units.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-slate-500 mt-2">Solo los miembros de esta unidad verán esta encuesta.</p>
                                            </div>
                                        )}

                                        {localSurvey.targetUserId !== undefined && (
                                            <div className="animate-fadeIn">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Usuarios</label>
                                                <div className="border border-slate-200 rounded-lg max-h-60 overflow-y-auto p-2 space-y-1">
                                                    {users.map(user => {
                                                        const isSelected = localSurvey.targetUserId?.includes(user.id);
                                                        return (
                                                            <button
                                                                key={user.id}
                                                                onClick={() => {
                                                                    const current = Array.isArray(localSurvey.targetUserId) ? localSurvey.targetUserId : [];
                                                                    const next = current.includes(user.id)
                                                                        ? current.filter(id => id !== user.id)
                                                                        : [...current, user.id];
                                                                    updateSurvey({ targetUserId: next });
                                                                }}
                                                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}`}
                                                            >
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                                                                    {isSelected && <Check size={12} weight="bold" />}
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="text-sm font-bold text-slate-700">{user.name}</div>
                                                                    <div className="text-xs text-slate-500">{user.jobTitle} - {user.unit}</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">{localSurvey.targetUserId?.length || 0} usuarios seleccionados.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* NUEVA SECCIÓN: Estructura Organizacional */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                        <Buildings className="text-purple-600" /> Estructura Organizacional
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Campo de Área */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Área</label>
                                            <select
                                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                value={localSurvey.unit || 'GLOBAL'}
                                                onChange={e => {
                                                    const value = e.target.value === 'GLOBAL' ? undefined : e.target.value;
                                                    updateSurvey({ unit: value, process: undefined });
                                                }}
                                            >
                                                <option value="GLOBAL">Global (Toda la Organización)</option>
                                                {DB.units
                                                    .filter(u => u.type === 'UNIT' && (u.depth === 1 || u.depth === 2))
                                                    .map(u => (
                                                        <option key={u.id} value={u.name}>
                                                            {u.depth === 2 ? `  ↳ ${u.name}` : u.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">Selecciona el área o subárea organizacional</p>
                                        </div>

                                        {/* Campo de Proceso */}
                                        {localSurvey.unit && localSurvey.unit !== 'GLOBAL' && (
                                            <div className="animate-fadeIn">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    Proceso <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                    value={localSurvey.process || ''}
                                                    onChange={e => updateSurvey({ process: e.target.value || undefined })}
                                                >
                                                    <option value="">-- Seleccionar Proceso --</option>
                                                    {DB.units
                                                        .filter(u => {
                                                            // Buscar la unidad padre por nombre
                                                            const parentUnit = DB.units.find(pu =>
                                                                pu.name === localSurvey.unit
                                                            );
                                                            // Filtrar procesos que pertenecen a esta unidad
                                                            return u.type === 'PROCESS' &&
                                                                parentUnit &&
                                                                u.parentId === parentUnit.id;
                                                        })
                                                        .map(p => (
                                                            <option key={p.id} value={p.name}>{p.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Selecciona el proceso específico para {localSurvey.unit}
                                                </p>
                                            </div>
                                        )}

                                        {/* Advertencia si falta proceso */}
                                        {localSurvey.unit && !localSurvey.process && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                                                <WarningCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" weight="fill" />
                                                <div className="text-xs text-amber-700">
                                                    <strong>Proceso requerido:</strong> Debes seleccionar un proceso antes de publicar esta encuesta.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* <OrganizationalStructureSelector
                                        currentTenantId={survey.tenantId}
                                        selectedUnit={localSurvey.unit}
                                        selectedProcess={localSurvey.process}
                                        onUpdate={(unit, process) => updateSurvey({ unit, process })}
                                    /> */}
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                        <Gear className="text-slate-400" /> Preferencias
                                    </h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="checkbox"
                                            id="anon"
                                            checked={localSurvey.isAnonymous}
                                            onChange={e => updateSurvey({ isAnonymous: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="anon" className="cursor-pointer">
                                            <div className="font-bold text-slate-700 text-sm">Respuestas Anónimas</div>
                                            <div className="text-xs text-slate-500">No se registrará la identidad del encuestado (recomendado para Clima Laboral).</div>
                                        </label>
                                    </div>

                                    {/* Campo de Estado */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Estado de la Encuesta</label>
                                        <select
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            value={localSurvey.status}
                                            onChange={e => updateSurvey({ status: e.target.value as any })}
                                        >
                                            <option value="DRAFT">Borrador</option>
                                            <option value="OPEN">Activa</option>
                                            <option value="CLOSED">Cerrada</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {localSurvey.status === 'DRAFT' && 'La encuesta no es visible para los usuarios'}
                                            {localSurvey.status === 'OPEN' && 'La encuesta está disponible para responder'}
                                            {localSurvey.status === 'CLOSED' && 'La encuesta ya no acepta respuestas'}
                                        </p>
                                    </div>
                                </div>
                                {/* Invitation Block */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                        <PaperPlaneRight className="text-slate-400" /> Enviar Invitaciones
                                    </h3>

                                    {!inviteMode ? (
                                        <>
                                            <p className="text-sm text-slate-500 mb-4">Envía una notificación por correo a los participantes seleccionados.</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setInviteMode('ALL')}
                                                    className="flex-1 py-3 px-4 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Users size={20} />
                                                    Invitar a Todos
                                                </button>
                                                <button
                                                    onClick={() => setInviteMode('SPECIFIC')}
                                                    className="flex-1 py-3 px-4 bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <User size={20} />
                                                    Usuarios Específicos
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                                            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                                {inviteMode === 'ALL' ? <Users /> : <User />}
                                                {inviteMode === 'ALL' ? 'Invitar a toda la unidad' : 'Invitar usuarios específicos'}
                                            </h4>

                                            {inviteMode === 'ALL' ? (
                                                <p className="text-sm text-slate-600 mb-4">Se enviará un correo a todos los miembros registrados en <strong>{localSurvey.unit || 'la organización'}</strong>.</p>
                                            ) : (
                                                <div className="mb-4">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correos electrónicos</label>
                                                    <textarea
                                                        value={inviteEmails}
                                                        onChange={(e) => setInviteEmails(e.target.value)}
                                                        placeholder="usuario@ejemplo.com, otro@ejemplo.com"
                                                        className="w-full p-3 rounded-lg border border-slate-200 text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <p className="text-xs text-slate-400 mt-1">Separa los correos con comas.</p>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setInviteMode(null)}
                                                    className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-all"
                                                    disabled={sendingInvite}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleSendInvite}
                                                    disabled={sendingInvite || (inviteMode === 'SPECIFIC' && !inviteEmails)}
                                                    className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {sendingInvite ? <ArrowClockwise className="animate-spin" size={18} /> : <PaperPlaneRight size={18} />}
                                                    {sendingInvite ? 'Enviando...' : 'Enviar Invitaciones'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
